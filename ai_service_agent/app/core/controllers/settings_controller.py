from typing import Any, Dict
from fastapi import APIRouter, Body
from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.ApiResponse import ApiResponse
from app.core.dtos.SettingsDto import SaveSettingsRequest
from app.core.services.settings_service import get_settings, save_settings

router = APIRouter(prefix="/settings", tags=["Settings controller"])

@router.get("/", response_model= ApiResponse[Dict[str, Any]])
async def get():
    result = await get_settings()
    
    return ApiResponse[Dict[str, Any]](
        data = result,
        message = "Settings retrieved successfully",
        status = 200
    )
    
@router.post("/", response_model= ApiResponse[str])
async def post(request: ApiRequest[SaveSettingsRequest] = Body(...)):
    await save_settings(request.data.provider, request.data.model_id)
    
    return ApiResponse[str](
        data = "",
        message = "Settings updated successfully",
        status = 200
    )