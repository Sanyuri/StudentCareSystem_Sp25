import httpx
import logging
from mcp import ClientSession
from langchain_groq import ChatGroq
from mcp.client.sse import sse_client
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
from langchain_mcp_adapters.tools import load_mcp_tools
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.services.settings_service import get_settings
from app.utils.config import MAX_RETRIES, MAX_TOKEN, AI_SERVER_URL
from app.core.services.prompt_management_service import get_prompts_by_model_and_type

def get_provider_llm_model(provider: str, model_id: str, temperature: int):
    if provider == 'groq':
        return ChatGroq(temperature=temperature, model=model_id, max_retries=MAX_RETRIES, max_tokens=MAX_TOKEN)
    if provider == 'google':
        return ChatGoogleGenerativeAI(temperature=temperature, model=model_id, max_retries=MAX_RETRIES, max_tokens=MAX_TOKEN)
    if provider == 'ollama':
        return ChatOllama(temperature=temperature, model=model_id, max_retries=MAX_RETRIES, max_tokens=MAX_TOKEN)
    return None

async def get_llm_response(prompt_type:str, parameters:list[str]):    
    settings_info = await get_settings()
    provider = settings_info['provider']
    model_id = settings_info['model_id']
    
    model = get_provider_llm_model(provider, model_id, 0)
    try:
        async with sse_client(f"{AI_SERVER_URL}/mcp/sse") as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                tools = await load_mcp_tools(session)
                
                prompt = await get_prompts_by_model_and_type(model=model_id, prompt_type=prompt_type, parameters=parameters)
                
                agent = create_react_agent(model=model, tools=tools)
                
                #Create HumanMessage object
                from langchain_core.messages import HumanMessage
                input_payload = {
                    "messages": [
                        HumanMessage(content=prompt)
                    ]
                }
                
                response = await agent.ainvoke(input_payload)
                
                messages = response["messages"]
                ai_message = messages[len(messages) - 1]
                
                return ai_message.content
    except httpx.ReadError as e:
        logging.error(f"Connection dropped during SSE: {e}")
        return "Connection dropped during SSE"
    except Exception as e:
        logging.error(f"Unexpected error in SSE connection: {e}")
        
        if hasattr(e, 'exceptions'):
            # Python 3.11+ ExceptionGroup support
            for idx, sub_exc in enumerate(e.exceptions):
                logging.error(f"Sub-exception #{idx + 1}: {type(sub_exc).__name__}: {sub_exc}", exc_info=sub_exc)
        
        return "Unexpected error in SSE connection"
    
async def get_llm_response(prompt:str):    
    settings_info = await get_settings()
    provider = settings_info['provider']
    model_id = settings_info['model_id']
    
    model = get_provider_llm_model(provider, model_id, 0)
    try:
        async with sse_client(f"{AI_SERVER_URL}/mcp/sse") as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                tools = await load_mcp_tools(session)
                
                agent = create_react_agent(model=model, tools=tools)
                
                #Create HumanMessage object
                from langchain_core.messages import HumanMessage
                input_payload = {
                    "messages": [
                        HumanMessage(content=prompt)
                    ]
                }
                
                response = await agent.ainvoke(input_payload)
                
                messages = response["messages"]
                ai_message = messages[len(messages) - 1]
                
                return ai_message.content
    except httpx.ReadError as e:
        logging.error(f"Connection dropped during SSE: {e}")
        return "Connection dropped during SSE"
    except Exception as e:
        logging.error(f"Unexpected error in SSE connection: {e}")
        
        if hasattr(e, 'exceptions'):
            # Python 3.11+ ExceptionGroup support
            for idx, sub_exc in enumerate(e.exceptions):
                logging.error(f"Sub-exception #{idx + 1}: {type(sub_exc).__name__}: {sub_exc}", exc_info=sub_exc)
        
        return "Unexpected error in SSE connection"
        
        