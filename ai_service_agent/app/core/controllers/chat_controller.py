from typing import Any, Dict, List
from app.core.dtos.ChatDto import ChatRequest
from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.ApiResponse import ApiResponse
from fastapi import APIRouter, Body, Header, Query
from app.chatbot import get_chat_bot_response, get_message_history

router = APIRouter(prefix="/chat", tags=["Chat controller"])

@router.post("/", response_model=ApiResponse[List[Dict[str, Any]]])
async def post(request: ApiRequest[ChatRequest] = Body(...), tenant_name:str = Header(...)):
    response = await get_chat_bot_response(request.data, tenant_name=tenant_name)
    
    return ApiResponse[List[Dict[str, Any]]](
        data = response,
        message = "Chat bot response retrieved successfully",
        status = 200
    )

@router.get("/", response_model=ApiResponse[Dict[str, Any]])
async def get(user_id:str = Query(...)):
    history = await get_message_history(user_id=user_id)
    
    return ApiResponse[Dict[str, Any]](
        data = history,
        message = "Chat history retrieved successfully",
        status = 200
    )