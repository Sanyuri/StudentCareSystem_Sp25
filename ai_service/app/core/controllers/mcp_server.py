import json
import logging
from datetime import datetime
from mcp.server import Server
from mcp.server.fastmcp import FastMCP
from fastapi import APIRouter, Request
from mcp.server.sse import SseServerTransport
from app.core.dtos.StudentDto import TenantStudent
from app.core.services import student_analysis_service
from app.core.dtos.StudentPointDto import TenantStudentPoint, PointStatus, FailReason
from app.core.services.semester_service import SemesterService
from app.core.services.student_service import get_student_info
from app.core.services.tenant_service import get_all_tenant_names
from app.core.dtos.StudentAnalysisFilter import StudentAnalysisFilter
from app.core.dtos.StudentAttendanceDto import TenantStudentAttendance
from app.core.services.student_points_service import get_student_points
from app.core.services.student_analysis_service import student_analysis_service
from app.core.services.student_attendance_service import get_student_attendances
from app.core.services.prompt_management_service import get_prompts_by_model_and_type

router = APIRouter()

mcp = FastMCP("StudentAnalysisMCP")

@mcp.tool()
def get_student_points_data(tenant_name: str, semester_name_list: list[str], student_codes: list[str]) -> str:
    """
    Get student scores info by subject for given students depends on semester and student code
    Use only if tenant_name, semester_name_list and student_code are provided
    """
    result = get_student_points(tenant_name, semester_name_list, student_codes)
    
    if not result:
        return "[]"

    return json.dumps([
        TenantStudentPoint(
            student_code=row[0],
            subject_code=row[1],
            point_status=row[2],  # Now using enum value
            average_mark=row[3],
            is_exempt=row[4],
            fail_reason=row[5],  # Now using enum value
            semester_name=row[6],
            class_name=row[7],
            is_pass_with=row[8],
            is_send_mail=row[9],
            start_date=row[10].isoformat() if row[10] else None,
            end_date=row[11].isoformat() if row[11] else None
        ).model_dump()
        for row in result
    ])
    
@mcp.tool()
def get_student_attendances_data(tenant_name: str, semester_name_list: list[str], student_codes: list[str]) -> str:
    """
    Get student absence info for given students depends on semester and student code
    Use only if tenant_name, semester_name_list and student_code are provided
    """
    result = get_student_attendances(tenant_name, semester_name_list, student_codes)
    
    if not result:
        return "[]"

    return json.dumps([
        TenantStudentAttendance(
            student_code=row[0],
            semester_name=row[1],
            subject_code=row[2],
            total_absences=row[3],
            total_slots=row[4],
            absence_rate=row[5]
        ).model_dump()
        for row in result
    ])
    
@mcp.tool()
async def get_student_info_data(tenant_name: str, student_codes: list[str]) -> str:
    """
    Get student info for given students depends on student code
    use only if tenant_name and student_code are provided
    """
    result = await get_student_info(tenant_name, student_codes)
    
    if not result:
        return "[]"
    
    return json.dumps([TenantStudent(
        student_code=row[0],
        student_name=row[1],
        major=row[2],
        gender=row[3],
        progress=row[4],
        current_term_no=row[5],
        specialization=row[6]
    ).model_dump() for row in result])

@mcp.tool()
async def get_all_semesters(tenant_name: str) -> str:
    """
    Get all semesters infor like semester name, start date, end date and current semester status
    use only if tenant_name is provided
    """
    semester_service = SemesterService(tenant_name)
    semesters = await semester_service.get_all_semesters()
    
    if not semesters:
        return "[]"

    return json.dumps([
        {
            "semester_name": row[0],
            "is_current_semester": row[1],
            "start_date": row[2].isoformat() if isinstance(row[2], datetime) else row[2],
            "end_date": row[3].isoformat() if isinstance(row[3], datetime) else row[3],
        }
        for row in semesters
    ])

@mcp.tool()
def get_all_tenants() -> str:
    """
    Get all tenant names, tenant names are used to filter data in other tools
    """
    tenant_names = get_all_tenant_names()
    
    if not tenant_names:
        return "[]"

    return json.dumps([tenant_name for tenant_name in tenant_names])

@mcp.tool()
async def get_students_sorted_by_performance(tenant_name: str, semester_name: str, page_number: int, page_size: int) -> str:

    """
        Returns a descending paginated list of students sorted by performance (using TOPSIS score) for a given tenant and semester.

        Args:
        - tenant_name (str): The name of the tenant (e.g., 'scs_hn').
        - semester_name (str): The semester to filter (e.g., 'Fall2024').
        - page_number (int): Page index (starts from 1).
        - page_size (int): Number of students per page.

        Returns:
        - JSON string of Pagination[StudentPointDto] with fields like student_code, gpa_gap, absence_rate, topsis_score, etc.

        Use when:
        - You want to get students ranked by academic risk.
        - Useful for advisors to identify students needing support.
    """
    
    student_ranking_filter = StudentAnalysisFilter(
        semester_name=semester_name,
        page_number=page_number,
        page_size=page_size,
        order_by_topsis_score=True)
    
    result = await student_analysis_service.get_student_analysis(tenant_name, student_ranking_filter)
    return json.dumps(result.model_dump(), ensure_ascii=False)

@mcp.prompt()
async def get_prompt_by_type(model: str, prompt_type: str, parameters: list[str]) -> str:
    return await get_prompts_by_model_and_type(model, prompt_type, parameters)

mcp_server: Server = mcp._mcp_server
sse = SseServerTransport("/mcp/messages/")

@router.get("/sse")
async def sse_handler(request: Request):
    try:
        # Ensure the SSE connection is established properly and doesn't close prematurely.
        async with sse.connect_sse(request.scope, request.receive, request._send) as (read, write):
            # Log the start of the SSE connection for debugging
            logging.info("SSE connection established")
            
            # Run the MCP server, which will handle streaming
            await mcp_server.run(read, write, mcp_server.create_initialization_options())
            
            # Ensure that no further response is sent after the stream starts
            logging.info("MCP server finished processing")

    except Exception as e:
        # Log the exception to understand any errors better
        logging.error(f"Caught exception in sse_handler: {e}")
        
        # Avoid sending an HTTP response here, just close the SSE stream
        return {"error": "An error occurred while processing SSE."}


@router.post("/messages/")
async def mcp_message_handler(request: Request):
    try:
        # Handle the MCP message and ensure no further response is sent after this
        return await sse.handle_post_message(request.scope, request.receive, request._send)
    except Exception as e:
        # Log the exception for debugging
        logging.error(f"Caught exception in mcp_message_handler: {e}")
        
        # Again, avoid sending another HTTP response; just handle the exception gracefully
        return {"error": "An error occurred while processing the message."}
