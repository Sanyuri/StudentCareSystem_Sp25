import json
import httpx
import logging
from typing import Dict, List
from datetime import datetime
from app.client import get_llm_response
from app.core.prompts.student_analysis_prompt import STUDENT_ANALYSIS_PROMPT
from app.utils.config import AI_SERVER_URL, API_KEY
from app.core.async_session_manager import AsyncMongoDbManager
from app.utils.json_service import extract_json_from_llm_response

async def fetch_student_analysis_via_http(
    tenant_name: str,
    semester_name: str,
    page_number: int,
    page_size: int = 10,
    ignored_student_codes: List[str] = None,
    ignored_status_codes: List[str] = None
) -> List[Dict]:
    """
    Fetch student analysis result via HTTP from external service.

    :param tenant_name: Tenant identifier for multi-tenant context
    :param semester_name: Semester to filter results
    :param page_number: Page index
    :param page_size: Number of students per batch
    :return: List of student analysis dictionaries
    """
    payload = {
        "data": {
            "page_number": page_number,
            "page_size": page_size,
            "order_by_topsis_score": True,
            "ignored_status_codes": ignored_status_codes or [""],
            "semester_name": semester_name,
            "ignored_student_codes": ignored_student_codes or [""]
        },
        "timestamp": "1"
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                url=f"{AI_SERVER_URL}/student-analysis/get-result",
                headers={
                    "Tenant-Name": tenant_name,
                    "Content-Type": "application/json",
                    "X-Api-Key": API_KEY
                },
                json=payload
            )
            response.raise_for_status()
            return response.json().get("data", {}).get("items", [])
    except Exception as e:
        logging.error(f"❌ Failed to fetch student analysis via HTTP: {e}")
        return []

STUDENT_CARE_SELECTION_REASON_PROMPT_TYPE = "explain selection reasons"
async def generate_and_save_student_care_reasons(
    tenant_name: str,
    semester_name: str,
    number_of_students: int = 200,
    ignored_student_codes: list[str] = None,
    ignored_status_codes: list[str] = None
):
    #check tenant_name is null or empty
    if not tenant_name:
        logging.error("Tenant name is null or empty")
        return
    
    total_reason_map: Dict[str, str] = {}
    
    #Loop every 10 students
    for i in range(0, number_of_students, 10):
        page_number = (i // 10) + 1
        items = await fetch_student_analysis_via_http(
            tenant_name=tenant_name,
            semester_name=semester_name,
            page_number=page_number,
            page_size=10,
            ignored_student_codes=ignored_student_codes,
            ignored_status_codes=ignored_status_codes
        )

        if not items:
            break
        
        #create list of student info
        batch_students_str = "\n".join([
            f"- student_code={s['student_code']}, student_name={s['student_name']}, "
            f"gpa={10 - s['gpa_gap']}, fail_subjects={s['number_of_remaining_fail_subjects']}, "
            f"absence_rate={s['absence_rate']:.2f}"
            for s in items
        ])
        
        llm_result_str = await get_llm_response(prompt_type = STUDENT_CARE_SELECTION_REASON_PROMPT_TYPE, parameters=[tenant_name, semester_name, batch_students_str])
        try:
            cleaned_json = extract_json_from_llm_response(llm_result_str)
            llm_array = json.loads(cleaned_json)
            batch_reason_map: Dict[str, str] = {
                x["student_code"]: x["reason"] 
                for x in llm_array if "student_code" in x and "reason" in x
            }
        except Exception as e:
            logging.error(f"LLM JSON parse error: {e}\nRaw response:\n{llm_result_str}")
            batch_reason_map = {}
        
        total_reason_map.update(batch_reason_map)

    if not total_reason_map:
        logging.warning("No valid LLM reasons to update.")
        return

    async with AsyncMongoDbManager() as db:
        await update_care_reasons(db, total_reason_map, semester_name)

    logging.info(f"✅ Updated {len(total_reason_map)} students with LLM reasons in MongoDB.")

async def update_care_reasons(target_uow, reason_map: dict, semester_name: str):
    """
    Update CareReason for each student in the database based on the provided reason map.
    """
    for student_code, reason in reason_map.items():
        try:
            student = await target_uow.student_points.find_one({"StudentCode": student_code})

            if not student or "StudentAchievements" not in student:
                continue
            
            semester_achievements = []
            for i, achievement in enumerate(student.get("StudentAchievements", [])):
                if achievement.get("SemesterName") == semester_name:
                    semester_achievements.append((i, achievement))
            
            if not semester_achievements:
                continue

            latest_index = -1
            latest_date = datetime.min
            
            for idx, achievement in semester_achievements:
                created_at = achievement.get("CreatedAt", datetime.min)
                if created_at > latest_date:
                    latest_date = created_at
                    latest_index = idx
            
            if latest_index >= 0:
                result = await target_uow.student_points.update_one(
                    {"_id": student["_id"]},
                    {"$set": {f"StudentAchievements.{latest_index}.CareReason": reason}}
                )
                if result.modified_count > 0:
                    logging.info(f"✅ Updated CareReason for {student_code}")
                else:
                    logging.warning(f"⚠️ No update applied for {student_code}")
        
        except Exception as e:
            logging.error(f"❌ Error updating CareReason for {student_code}: {str(e)}")
            
async def fetch_progress_criterion_type_via_http(
    tenant_name: str
) -> List[Dict]:
    """
    Fetch progress criterion type via HTTP from external service.

    :param tenant_name: Tenant identifier for multi-tenant context
    :return: List of progress criterion type dictionaries
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url=f"{AI_SERVER_URL}/progress-criterion-type/",
                headers={
                    "Tenant-Name": tenant_name,
                    "Content-Type": "application/json",
                    "X-Api-Key": API_KEY
                }
            )
            response.raise_for_status()
            return response.json().get("data", [])
    except Exception as e:
        logging.error(f"❌ Failed to fetch progress criterion type via HTTP: {e}")
        return []
    
async def get_student_progress_analysis(tenant_name: str, student_code: str, semester_name_list: list[str]) -> str:
    try:
        criteria_list = await fetch_progress_criterion_type_via_http(tenant_name)
        
        prompt = STUDENT_ANALYSIS_PROMPT.format(
            tenant_name=tenant_name,
            student_code=student_code,
            progress_criterion_types=json.dumps(criteria_list, ensure_ascii=False),
            semester_name_list=json.dumps(semester_name_list, ensure_ascii=False),
        )
        
        llm_result = await get_llm_response(prompt=prompt)
        cleaned_json = extract_json_from_llm_response(llm_result)
        return cleaned_json
    except Exception as e:
        logging.error(f"❌ Failed to analyze student progress: {e}")
        return "Đã xảy ra lỗi khi phân tích tiến độ học tập của sinh viên."