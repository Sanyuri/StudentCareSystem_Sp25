from typing import Any, Dict
from fastapi import APIRouter, Body, Query
from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.Pagination import Pagination
from app.core.dtos.ApiResponse import ApiResponse
from app.core.dtos.PromptDto import PromptRequest, ModelPromptsDto, PromptFilter
from app.core.services.prompt_management_service import delete_prompt, delete_prompts_by_model, get_prompt, save_prompt

router = APIRouter(prefix="/prompt", tags=["Prompt management"])

@router.get("/", response_model=ApiResponse[Pagination[ModelPromptsDto]])
async def get(filter: PromptFilter = Query(None)):
    result = await get_prompt(filter=filter)
    return ApiResponse[Pagination[ModelPromptsDto]](
        data = result,
        message = "Prompt retrieved successfully",
        status = 200
    )

@router.post("/", response_model=ApiResponse[Dict[str, Any]])
async def add(request: ApiRequest[PromptRequest] = Body(...)):
    result = await save_prompt(model=request.data.model, prompt=request.data.prompt)
    return ApiResponse[Dict[str, Any]](
        data = result,
        message = "Prompt saved successfully",
        status = 200
    )
    
@router.patch("/", response_model=ApiResponse[Dict[str, Any]])
async def patch(request: ApiRequest[PromptRequest] = Body(...)):
    result = await save_prompt(model=request.data.model, prompt=request.data.prompt)
    return ApiResponse[Dict[str, Any]](
        data = result,
        message = "Prompt updated successfully",
        status = 200
    )
    
@router.delete("/", response_model=ApiResponse[str])
async def delete(model: str = Query(...), prompt_type: str = Query(...)):
    await delete_prompt(model=model, prompt_type=prompt_type)
    return ApiResponse[str](
        data = "",
        message = "Prompt deleted successfully",
        status = 200
    )
    
@router.delete("/model", response_model=ApiResponse[str])
async def delete_by_model(model: str = Query(...)):
    await delete_prompts_by_model(model=model)
    return ApiResponse[str](
        data = "",
        message = "Prompts deleted successfully",
        status = 200
    )