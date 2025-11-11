from app.core.dtos.ApiRequest import ApiRequest
from app.core.dtos.ApiResponse import ApiResponse
from fastapi import APIRouter, Body, Header, Query
from app.core.dtos.StudentAnalysisFilter import CacheStudentRequest
from app.core.services.student_analysis_service import generate_and_save_student_care_reasons, get_student_progress_analysis

router = APIRouter(prefix="/student-analysis", tags=["Student Analysis"])
 
@router.post("/generate-reasons", response_model= ApiResponse[str])
async def generate_student_care_reasons(
    tenant_name: str = Header(...),
    request: ApiRequest[CacheStudentRequest] = Body(...)):
    
    await generate_and_save_student_care_reasons(tenant_name, request.data.semester_name,request.data.number_of_students, request.data.ignored_student_codes, request.data.ignored_status_codes)
    return ApiResponse[str](
        data = "",
        message = "Student analysis cached successfully",
        status = 200
    )
    
@router.get("/analyze_student_progress", response_model= ApiResponse[str])
async def get_progress_analysis(
    tenant_name: str = Header(...),
    student_code: str = Query(...),
    semester_name_list: list[str] = Query(...)):
    
    result = await get_student_progress_analysis(tenant_name=tenant_name, student_code=student_code, semester_name_list=semester_name_list)
    
    return ApiResponse[str](
        data = result,
        message = "Student analysis cached successfully",
        status = 200
    )