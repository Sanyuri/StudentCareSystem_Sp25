import json
import httpx
import logging
from functools import partial
from mcp import ClientSession
from pydantic import BaseModel
from mcp.client.sse import sse_client
from langgraph.prebuilt import ToolNode
from app.client import get_provider_llm_model
from app.core.dtos.ChatDto import ChatRequest
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage
from langgraph.graph import StateGraph, START, END
from langchain_mcp_adapters.tools import load_mcp_tools
from app.core.prompts.intent_prompt import INTENT_PROMPT
from langgraph.checkpoint.mongodb import AsyncMongoDBSaver
from app.core.services.settings_service import get_settings
from app.core.async_session_manager import AsyncRedisManager
from app.utils.json_service import extract_json_from_llm_response
from typing import Annotated, Any, Dict, List, Literal, TypedDict, Union
from app.utils.config import MAX_HISTORY_MESSAGES, MAX_MESSAGES_PER_DAY, MONGODB_URI, AI_SERVER_URL
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, RemoveMessage, AnyMessage, SystemMessage

class State(TypedDict):
    messages: Annotated[list, add_messages]
    intent_result: str
    tenant_name: str
    
async def increase_message_count(user_id: str):
    redis_key = f"ai_service:user:{user_id}:message_count"
    
    async with AsyncRedisManager() as redis_client:
        current = await redis_client.incr(redis_key)

        if current == 1:
            await redis_client.expire(redis_key, 86400)

        if current > MAX_MESSAGES_PER_DAY:
            return False
        return True
    
def intent_check(state: State, llm):
    history = state["messages"]
    
    human_messages = [msg.content for msg in reversed(history) if isinstance(msg, HumanMessage)]
    recent_human_msgs = list(reversed(human_messages[:5]))
    
    combined_human_text = "\n".join(recent_human_msgs)
    
    check_prompt = INTENT_PROMPT.format(messages=combined_human_text)
    prompt_msg = HumanMessage(content=check_prompt)
    # history.append(prompt_msg)

    response = llm.invoke([prompt_msg])
    state["intent_result"] = response.content
    #remove last message from the list
    history = history[:-1]
    state["messages"] = history  # update state with cleaned history
    return state

def intent_decision(state: State) -> str:
    try:
        cleaned_json = extract_json_from_llm_response(state["intent_result"])
        # Parse the string output from LLM as JSON
        intent_data = json.loads(cleaned_json)
        intent = intent_data.get("intent", "").lower()

        # Allow processing if intent is valid for conversation
        if intent in {"student_query", "greeting", "smalltalk"}:
            return "chatbot"
        else:
            return "end_with_invalid_intent"

    except (json.JSONDecodeError, TypeError, AttributeError) as e:
        # If the LLM returned invalid JSON or structure is corrupted
        return "end_with_invalid_intent"

def end_with_invalid_intent(state: State):
    
    # Add polite rejection
    state["messages"].append(
        AIMessage(content="Xin lỗi, câu hỏi không liên quan đến hệ thống hỗ trợ sinh viên nên tôi không thể trả lời.")
    )
    return state

def chatbot(state: State, llm):
    history = state["messages"]
    
    tenant_name = state.get("tenant_name", "unknown_tenant")

    system_msg = SystemMessage(content=f"""
        You are serving the system of tenant_name: **{tenant_name.lower}**.
        All your analysis, data queries, or advice **must be strictly relevant to this tenant** only. 
        Do not make assumptions about other tenants or provide misleading responses.
        In addition, do **not** invoke tools more than twice consecutively within a single conversation turn.
        ⚠️ Your responses must be written in **Vietnamese**.
        """)

    temp_history = [system_msg] + history[:]
    
    if len(temp_history) > 0 and isinstance(temp_history[-1], HumanMessage):
        last_content = temp_history[-1].content
        temp_history[-1] = HumanMessage(content=last_content)
    
    #Handle Tool Exceptions
    if len(history) > 0 and isinstance(history[-1], ToolMessage) and history[-1].content.startswith("Error:"):
        response = AIMessage(
            content="Có lỗi xảy ra hoặc do chưa đủ dữ liệu để trả lời câu hỏi của bạn. Vui lòng thử lại sau."
        )
    else:
        response = llm.invoke(temp_history)
        
    state["messages"].append(response)
    return state

def tools_condition(
    state: Union[list[AnyMessage], dict[str, Any], BaseModel],
    messages_key: str = "messages",
) -> Literal["tools", "delete_messages"]:
    """Route to tools if tool_calls present, otherwise delete_messages."""
    if isinstance(state, list):
        ai_message = state[-1]
    elif isinstance(state, dict) and (messages := state.get(messages_key, [])):
        ai_message = messages[-1]
    elif messages := getattr(state, messages_key, []):
        ai_message = messages[-1]
    else:
        raise ValueError(f"No messages found in input state to tool_edge: {state}")
    
    if hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls) > 0:
        return "tools"
    return "delete_messages"

def delete_messages(state):
    messages = state["messages"]
    if len(messages) > MAX_HISTORY_MESSAGES:
        return {"messages": [RemoveMessage(id=m.id) for m in messages[:-MAX_HISTORY_MESSAGES]]}
    
    return state

async def get_chat_bot_response(request: ChatRequest, tenant_name: str):
    is_allowed = await increase_message_count(request.user_id)
    if not is_allowed:
        return convert_langchain_messages([AIMessage(content="Bạn đã vượt quá số lượt hỏi trong ngày. Vui lòng quay lại sau 24 giờ.")])
    try:
        async with sse_client(f"{AI_SERVER_URL}/mcp/sse") as (read, write):
            async with ClientSession(read, write) as session:
                async with AsyncMongoDBSaver.from_conn_string(MONGODB_URI) as memory:
                    await session.initialize()
                
                    settings_info = await get_settings()
                    provider = settings_info['provider']
                    model_id = settings_info['model_id']
                    
                    llm = get_provider_llm_model(provider, model_id, 0)

                    tools = await load_mcp_tools(session)

                    llm_with_tools = llm.bind_tools(tools = tools)
                    
                    graph_builder = StateGraph(State)
                    
                    intent_check_node = partial(intent_check, llm=llm)
                    graph_builder.add_node("intent_check", intent_check_node)
                    graph_builder.add_node("end_with_invalid_intent", end_with_invalid_intent)
                    chatbot_node = partial(chatbot, llm = llm_with_tools)
                    graph_builder.add_node("chatbot", chatbot_node)
                    tool_node = ToolNode(tools=tools)
                    graph_builder.add_node("tools", tool_node)
                    graph_builder.add_node(delete_messages)

                    # Any time a tool is called, we return to the chatbot to decide the next step
                    graph_builder.add_edge(START, "intent_check")
                    graph_builder.add_conditional_edges("intent_check", intent_decision)
                    graph_builder.add_edge("end_with_invalid_intent", "delete_messages")
                    graph_builder.add_conditional_edges(
                        "chatbot",
                        tools_condition
                    )
                    graph_builder.add_edge("delete_messages", END)
                    graph_builder.add_edge("tools", "chatbot")
                    graph = graph_builder.compile(checkpointer=memory)
                    
                    config = {"configurable": {"thread_id": request.user_id}}
                    
                    try:
                        state_tuple = await memory.aget_tuple(config)
                        state = state_tuple[0] if state_tuple else {"messages": []}
                    except Exception:
                        state = {"messages": []}
                    
                    if "messages" not in state:
                        state["messages"] = []
                        
                    if "tenant_name" not in state:
                        state["tenant_name"] = tenant_name
                    
                    state["messages"].append(HumanMessage(content=request.message))

                    output = await graph.ainvoke(state, config)
                    
                    messages = output['messages']
                    
                    for i in range(len(messages) - 1, -1, -1):
                        if isinstance(messages[i], HumanMessage):
                            recent_messages = messages[i:]
                            break
                        else:
                            recent_messages = messages
                    
                    # Get all messages from the output from  until meet the last HumanMessage
                    return convert_langchain_messages(recent_messages)
    except httpx.ReadError as e:
        logging.error(f"Connection dropped during SSE: {e}")
        return convert_langchain_messages([
            AIMessage(content="Mất kết nối đến máy chủ AI. Vui lòng thử lại sau.")
        ])
    except Exception as e:
        logging.error(f"Unexpected error in SSE connection: {e}")
        
        if hasattr(e, 'exceptions'):
            # Python 3.11+ ExceptionGroup support
            for idx, sub_exc in enumerate(e.exceptions):
                logging.error(f"Sub-exception #{idx + 1}: {type(sub_exc).__name__}: {sub_exc}", exc_info=sub_exc)
        
        return convert_langchain_messages([
            AIMessage(content="Hệ thống gặp sự cố nội bộ. Vui lòng thử lại sau.")
        ])
            
async def get_message_history(
    user_id: str
):
    """
    Retrieve a list of chat messages for a given user_id from the 'messages' channel,
    ensuring no duplicates and ordered chronologically (newest first).

    :param user_id: The user/thread identifier (thread_id).
    :param last_checkpoint_id: If provided, only checkpoints with checkpoint_id < this value 
                              will be returned (cursor pagination).
    :param limit: Maximum number of checkpoints to return.
    :return: A dict containing the latest checkpoint_id and a list of messages.
    """
    async with AsyncMongoDBSaver.from_conn_string(MONGODB_URI) as memory:
        # Base config to filter by user (thread_id = user_id).
        config = {
            "configurable": {
                "thread_id": user_id
            }
        }

        # Get the latest checkpoint
        checkpoint_tuple = await memory.aget(config)
        
        if not checkpoint_tuple:
            return {
                "checkpoint_id": None,
                "messages": []
            }
        
        # Extract messages from the latest checkpoint
        channel_values = checkpoint_tuple.get("channel_values", {})
        messages = channel_values.get("messages", [])
        
        # Since delete_messages ensures only the last MAX_HISTORY_MESSAGES messages are kept,
        # we can directly use the messages from the latest checkpoint
        all_messages = messages[-MAX_HISTORY_MESSAGES:]  # Get the last 'limit' messages
        
        # Convert to the desired format
        converted_messages = convert_langchain_messages(all_messages)
        
        return {
            "checkpoint_id": checkpoint_tuple.get("id"),
            "messages": converted_messages
        }

def convert_langchain_messages(messages: List[Any]) -> List[Dict[str, Any]]:
    """
    Convert LangChain HumanMessage, AIMessage, ToolMessage objects to JSON-serializable dicts.
    """
    result = []

    for i, msg in enumerate(messages):
        if isinstance(msg, list):
            continue

        if not hasattr(msg, "content"):
            continue
        
        base = {
            "type": type(msg).__name__,
            "content": msg.content,
            "id": getattr(msg, "id", None),
            "additional_kwargs": msg.additional_kwargs,
            "response_metadata": getattr(msg, "response_metadata", {}),
        }

        # AIMessage may include tool calls and usage
        if isinstance(msg, AIMessage):
            base["usage_metadata"] = getattr(msg, "usage_metadata", {})
            base["tool_calls"] = getattr(msg, "tool_calls", [])

        # ToolMessage includes name and tool_call_id
        if isinstance(msg, ToolMessage):
            base["name"] = msg.name
            base["tool_call_id"] = msg.tool_call_id

        result.append(base)

    return result