from fastapi import APIRouter, Header
from app.core.dtos.ApiResponse import ApiResponse
from app.core.dtos.ProgressCriterionTypeDto import TenantProgressCriterionTypeDto
from app.core.services.progress_criterion_type_service import get_progress_criterion_type_data

router = APIRouter(prefix="/progress-criterion-type", tags=["Progress criterion type management"])

@router.get("/", response_model=ApiResponse[list[TenantProgressCriterionTypeDto]])
async def train_model_async(tenant_name:str = Header(...)):
    result = await get_progress_criterion_type_data(tenant_name)
    
    return ApiResponse[list[TenantProgressCriterionTypeDto]](
        data = result,
        message = "Data imported successfully",
        status = 200
    )
