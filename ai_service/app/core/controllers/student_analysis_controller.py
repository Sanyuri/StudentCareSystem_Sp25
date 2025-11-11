from fastapi import APIRouter, Body, Header
from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.Pagination import Pagination
from app.core.dtos.ApiResponse import ApiResponse
from app.core.dtos.StudentPointDto import StudentPointDto
from app.core.dtos.StudentAnalysisFilter import CacheStudentRequest, StudentAnalysisFilter
from app.core.services.student_analysis_service import student_analysis_service

router = APIRouter(prefix="/student-analysis", tags=["Student Analysis"])

@router.post("/get-result", response_model= ApiResponse[Pagination[StudentPointDto]])
async def get_all(
    tenant_name: str = Header(...),
    request: ApiRequest[StudentAnalysisFilter] = Body(...)):
    
    result = await student_analysis_service.get_student_analysis(tenant_name.lower(), request.data)
    return ApiResponse[Pagination[StudentPointDto]](
        data = result,
        message = "Student analysis retrieved successfully",
        status = 200
    )