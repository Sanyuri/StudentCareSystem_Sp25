from fastapi import APIRouter, Body
from app.client import get_llm_response
from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.ApiResponse import ApiResponse
from app.core.dtos.GetLLMResponseRequest import GetLLMResponseRequest

router = APIRouter(prefix="/llm", tags=["LLM Controller"])

@router.post("/", response_model=ApiResponse[str])
async def get_llm_response_async(request: ApiRequest[GetLLMResponseRequest] = Body(...)):    
    
    response = await get_llm_response(
        prompt_type = request.data.prompt_type,
        parameters=request.data.parameters
    )
    
    return ApiResponse[str](
        data = response,
        message = "Get LLM response successfully",
        status = 200
    )