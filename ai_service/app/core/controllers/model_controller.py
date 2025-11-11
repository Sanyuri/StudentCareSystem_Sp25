from fastapi import APIRouter, Body, Header
from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.ApiResponse import ApiResponse
from app.core.services.model_manager import model_manager
from app.core.dtos.TrainModelRequest import TrainModelRequest
from app.core.services.model_trainer_service import train_kmeans_model
from app.core.services.preprocessing_service import preprocessing_async
from app.core.services.student_ranking_service import rank_students_by_topsis
from app.core.services.tenant_data_importer_service import import_student_attendances_async, import_student_points_async

router = APIRouter(prefix="/model", tags=["Model management"])

@router.post("/train-model", response_model=ApiResponse[str])
async def train_model_async(request: ApiRequest[TrainModelRequest] = Body(...), tenant_name:str = Header(...)):
    await import_student_points_async(tenant_name = tenant_name, semester_name = request.data.semester_name)
    await import_student_attendances_async(tenant_name = tenant_name, semester_name = request.data.semester_name)
    await rank_students_by_topsis(tenant_name = tenant_name, semester_name = request.data.semester_name)
    _, x_unscaled = await preprocessing_async()
    
    train_kmeans_model(x = x_unscaled, n_clusters=request.data.n_clusters)
    
    return ApiResponse[str](
        data = "",
        message = "Data imported successfully",
        status = 200
    )

@router.post("/reload-model", response_model=ApiResponse[str])
async def reload_model_from_bytes_async(request: ApiRequest[bytes] = Body(...), name: str = Header(...)):
    model_manager.reload_model_from_bytes(content=request.data, name=name)
    
    return ApiResponse[str](
        data = "",
        message = "Model reloaded successfully",
        status = 200
    )
