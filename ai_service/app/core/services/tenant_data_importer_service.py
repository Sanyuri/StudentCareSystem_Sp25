import uuid
import logging
from datetime import datetime
from collections import defaultdict
from app.utils.audit import AuditMixin
from sqlalchemy import bindparam, text
from app.utils.config import BATCH_SIZE
from app.core.database import get_async_db_session
from app.core.services.subject_service import build_subject_groups
from app.core.async_session_manager import AsyncMongoDbManager    

async def get_selected_semester(db_session, semester_name):
    # Get Selected Students with row numbers
    semester_query = text("""
        SELECT StartDate, EndDate, SemesterName
        FROM Semesters
        WHERE SemesterName = :semester_name
    """)
    semester_results = await db_session.execute(semester_query, {"semester_name": semester_name})
    selected_semester = semester_results.fetchone()
    return selected_semester

async def import_student_points_async(semester_name="Summer2024", tenant_name='scs_hn'):
    async with await get_async_db_session(tenant_name) as source_db_session:
        async with AsyncMongoDbManager() as target_uow:
            start_row = 0

            # Get all SubjectCode, ReplacedBy from Subjects
            query_subjects = text("""
                                    SELECT
                                        SubjectCode,
                                        ReplacedBy
                                    FROM Subjects
                                    """)
            subjects_result = await source_db_session.execute(query_subjects)
            subjects_rows = subjects_result.fetchall()
            _, _, group_id_of_subject, _ = build_subject_groups(subjects_rows)
            
            selected_semester = await get_selected_semester(source_db_session, semester_name)
            
            while True:
                # Query to get students with row numbers from the source database
                student_query = text("""
                    WITH StudentRanked AS (
                        SELECT StudentCode, StudentName, Email, CurrentTermNo, ROW_NUMBER() OVER (ORDER BY StudentCode) AS RowNum
                        FROM Students
                    )
                    SELECT UPPER(StudentCode), StudentName, Email, CurrentTermNo
                    FROM StudentRanked
                    WHERE RowNum >= :start_row AND RowNum <= :end_row
                """)
                result = await source_db_session.execute(student_query, {
                    "start_row": start_row + 1,
                    "end_row": start_row + BATCH_SIZE
                })
                
                student_info = [{
                    "StudentCode": row[0],
                    "StudentName": row[1],
                    "StudentEmail": row[2],
                    "CurrentTermNo": row[3]
                } for row in result.fetchall()]

                if not student_info:
                    break

                # Create a list of student codes for queries
                student_codes = [student['StudentCode'] for student in student_info]

                # Query for student GPA gap and suspension info
                query_gpa_suspensions = text("""
                    WITH StudentPointsFiltered AS (
                        SELECT
                            StudentCode,
                            CASE
                                WHEN SUM(CASE WHEN IsAttendanceFail = 0 THEN 1 ELSE 0 END) = 0
                                THEN 1 ELSE 0
                            END AS AllSubjectAttendanceFailed
                        FROM StudentPoints
                        WHERE SemesterName = :semester_name
                        AND StudentCode IN :student_codes
                        GROUP BY StudentCode
                    )
                    SELECT
                        UPPER(sp.StudentCode),
                        CAST(10 - AVG(sp.AverageMark) AS FLOAT) AS GPA_GAP,
                        st.StatusCode
                    FROM StudentPoints sp
                    LEFT JOIN StudentPointsFiltered sf ON sp.StudentCode = sf.StudentCode
                    LEFT JOIN Subjects ss ON sp.SubjectCode = ss.SubjectCode
                    LEFT JOIN Students st ON sp.StudentCode = st.StudentCode
                    WHERE sp.SemesterName = :semester_name
                    AND sp.StudentCode IN :student_codes
                    AND (sp.IsAttendanceFail = 0 OR sf.AllSubjectAttendanceFailed = 1)
                    AND ss.IsGraded = 'true'
                    AND sp.SubjectCode NOT LIKE 'LAB%'
                    GROUP BY sp.StudentCode, st.StatusCode
                """).bindparams(
                    bindparam("student_codes", expanding=True),
                    bindparam("semester_name")
                )
                result = await source_db_session.execute(query_gpa_suspensions, {
                    "student_codes": student_codes,
                    "semester_name": semester_name
                })
                aggregator_rows = result.fetchall()

                # Query to get remaining failed subject info
                query_points = text("""
                    SELECT 
                        UPPER(StudentCode), 
                        SubjectCode, 
                        PointStatus, 
                        StartDate
                    FROM StudentPoints
                    WHERE StudentCode IN :student_codes
                    AND EndDate <= :end_date
                """).bindparams(
                    bindparam("student_codes", expanding=True),
                )
                points_result = await source_db_session.execute(query_points, {
                        "end_date": selected_semester.EndDate,
                        "student_codes": student_codes
                    }
                )
                rows_points = points_result.fetchall()

                data_map = defaultdict(list)

                # Collect data
                for rowp in rows_points:
                    st_code = rowp[0]
                    sb_code = rowp[1]
                    point_status = rowp[2]  # Now using enum value
                    start_date = rowp[3]
                    
                    if sb_code in group_id_of_subject:
                        group = group_id_of_subject[sb_code]
                    else:
                        group = sb_code

                    data_map[(st_code, group)].append((start_date, point_status))

                # Determine the latest record per student for remaining failed subjects
                fail_count_map = defaultdict(int)

                for (st_code, fc), records in data_map.items():
                    records.sort(key=lambda x: x[0], reverse=True)
                    _, newest_status = records[0]

                    is_fail = (newest_status == 'Fail') or (newest_status == 2)  # Using enum value
                    if is_fail:
                        fail_count_map[st_code] += 1

                # Prepare new records
                new_records = []
                for row in aggregator_rows:
                    student_code = row[0]
                    gpa_gap = row[1]
                    status_code = row[2]

                    # Find corresponding StudentName and StudentEmail for this student
                    student_data = next((student for student in student_info if student['StudentCode'] == student_code), None)
                    if student_data:
                        student_name = student_data['StudentName']
                        student_email = student_data['StudentEmail']
                        current_term_no = student_data['CurrentTermNo']
                    else:
                        student_name = None
                        student_email = None
                        current_term_no = None

                    remaining_failed_subjects = fail_count_map.get(student_code, 0)

                    # Prepare the new achievement
                    new_achievement = {
                        "SemesterName": semester_name,
                        "GpaGap": gpa_gap,
                        "NumberOfRemainingFailSubjects": remaining_failed_subjects,
                        "TopsisScore": None,
                        "CreatedAt": datetime.now()
                    }

                    # Check for existing record by StudentCode
                    existing_records = await target_uow.student_points.find({
                        "StudentCode": student_code
                    }).to_list(length=1)

                    if existing_records:
                        # If there is an existing record, update it
                        existing_record = existing_records[0]
                        
                        # Update student info in case it has changed
                        if student_name is not None:
                            existing_record["StudentName"] = student_name
                        if student_email is not None:
                            existing_record["StudentEmail"] = student_email
                        if current_term_no is not None:
                            existing_record["CurrentTermNo"] = current_term_no
                            
                        existing_record["StatusCode"] = status_code
                        
                        # Find if there's already an achievement with the same SemesterName
                        existing_semester_index = None
                        for i, achievement in enumerate(existing_record["StudentAchievements"]):
                            if achievement["SemesterName"] == semester_name:
                                existing_semester_index = i
                                break
                        
                        if existing_semester_index is not None:
                            # If achievement with same semester exists, overwrite it with new data
                            existing_record["StudentAchievements"][existing_semester_index] = new_achievement
                        else:
                            # If no achievement for this semester, append the new one
                            existing_record["StudentAchievements"].append(new_achievement)
                        
                        # Update the record with modified StudentAchievements and potentially updated student info
                        await target_uow.student_points.update_one(
                            {"_id": existing_record["_id"]},
                            {"$set": {
                                "StudentName": existing_record["StudentName"],
                                "StudentEmail": existing_record["StudentEmail"],
                                "CurrentTermNo": existing_record["CurrentTermNo"],
                                "StudentAchievements": existing_record["StudentAchievements"],
                                **AuditMixin().generate_audit_fields()
                            }}
                        )
                    else:
                        # If no record exists for this student, create a new one
                        new_record = {
                            "StudentCode": student_code,
                            "StudentName": student_name,
                            "StudentEmail": student_email,
                            "CurrentTermNo": current_term_no,
                            "Campus": tenant_name.lower(),
                            "StatusCode": status_code,
                            "StudentAchievements": [new_achievement],  # Start with the new achievement
                            **AuditMixin().generate_audit_fields()
                        }
                        new_records.append(new_record)

                # Insert the new records into MongoDB if any
                if new_records:
                    await target_uow.student_points.insert_many(new_records)

                start_row += BATCH_SIZE
                
async def import_student_attendances_async(semester_name = 'Summer2024', tenant_name = 'scs_hn'):
    async with await get_async_db_session(tenant_name) as source_db_session:
        async with AsyncMongoDbManager() as target_uow:
            start_row = 0

            selected_semester = await get_selected_semester(source_db_session, semester_name)

            if not selected_semester:
                logging.warning(f"Semester {semester_name} not found, skipping import")
                return
            
            while True:
                # query for get select students with rownumber
                student_query = text("""
                    WITH StudentRanked AS (
                        SELECT StudentCode, ROW_NUMBER() OVER (ORDER BY StudentCode) AS RowNum
                        FROM Students
                    )
                    SELECT UPPER(StudentCode)
                    FROM StudentRanked
                    WHERE RowNum >= :start_row AND RowNum <= :end_row
                """)

                result = await source_db_session.execute(student_query, {
                    "start_row": start_row + 1,
                    "end_row": start_row + BATCH_SIZE
                })
                student_codes = [row[0] for row in result.fetchall()]

                if not student_codes:
                    break
                
                # Query for get subjects and FailReason in StudentPoints of tenant database by semester name and student code
                student_point_query = text("""
                    SELECT UPPER(StudentCode), SubjectCode, FailReason
                    FROM StudentPoints
                    WHERE SemesterName = :semester_name
                    AND StudentCode IN :student_codes
                """).bindparams(bindparam("student_codes", expanding=True))

                student_point_result = await source_db_session.execute(student_point_query, {
                    "semester_name": semester_name,
                    "student_codes": student_codes
                })
                student_point_rows = student_point_result.fetchall()
                
                # Filter subjects
                student_point_map = defaultdict(list)
                for row in student_point_rows:
                    student_code = row[0]
                    subject_code = row[1]
                    fail_reason = row[2] if row[2] else 'None'  # Using enum value

                    if subject_code.lower().endswith('c'):
                        continue

                    student_point_map[student_code].append((subject_code, fail_reason))
                
                # Get the average attendance info of each student from source db 
                attendance_query_str = text("""
                    SELECT UPPER(StudentCode), SubjectCode, TotalAbsences, TotalSlots
                    FROM StudentAttendances
                    WHERE SemesterName = :semester_name
                    AND StudentCode IN :student_codes
                """).bindparams(bindparam("student_codes", expanding=True))

                attendance_result = await source_db_session.execute(attendance_query_str, {
                    "semester_name": semester_name,
                    "student_codes": student_codes
                })
                attendance_rows = attendance_result.fetchall()

                attendance_map = {}
                for row in attendance_rows:
                    st_code, subject_code, total_abs, total_slots = row
                    attendance_map[(st_code, subject_code)] = (total_abs, total_slots)
                    
                # Calculate absence rate for each student
                aggregated_result = {}

                for st_code, subjects in student_point_map.items():
                    sum_abs, sum_slot, is_any_fail = 0, 0, False

                    for sub_code, fail_reason in subjects:
                        if fail_reason == 'AttendanceFail' or fail_reason == 0:  # Using enum value
                            is_any_fail = True

                        absences, slots = attendance_map.get((st_code, sub_code), (0, 17 if sub_code[:3].upper() in ["MLN", "HCM", "VNR"] else 20))
                        sum_abs += absences
                        sum_slot += slots

                    aggregated_result[st_code] = {
                        "sumAbs": sum_abs,
                        "sumSlot": sum_slot,
                        "isAnyFail": is_any_fail
                    }
                    
                # Solve existing record
                new_records = []
                for st_code, agg_val in aggregated_result.items():
                    sum_abs = agg_val["sumAbs"]
                    sum_slot = agg_val["sumSlot"]
                    is_fail = agg_val["isAnyFail"]

                    absence_rate = sum_abs / sum_slot if sum_slot > 0 else 0.0
                    is_exempt = (absence_rate > 0.2 and not is_fail)

                    # Prepare the new achievement
                    new_achievement = {
                        "SemesterName": semester_name,
                        "AbsenceRate": absence_rate,
                        "IsAttendanceExempted": is_exempt,
                        "CreatedAt": datetime.now()
                    }

                    # Check for existing record by StudentCode
                    existing_records = await target_uow.student_attendances.find({
                        "StudentCode": st_code
                    }).to_list(length=1)

                    if existing_records:
                        # If there is an existing record, update it
                        existing_record = existing_records[0]
                        
                        # Find if there's already an achievement with the same SemesterName
                        existing_semester_index = None
                        for i, achievement in enumerate(existing_record["StudentAchievements"]):
                            if achievement["SemesterName"] == semester_name:
                                existing_semester_index = i
                                break
                        
                        if existing_semester_index is not None:
                            # If achievement with same semester exists, overwrite it with new data
                            existing_record["StudentAchievements"][existing_semester_index] = new_achievement
                        else:
                            # If no achievement for this semester, append the new one
                            existing_record["StudentAchievements"].append(new_achievement)
                        
                        # Update the record with modified StudentAchievements
                        await target_uow.student_attendances.update_one(
                            {"_id": existing_record["_id"]},
                            {"$set": {
                                "StudentAchievements": existing_record["StudentAchievements"],
                                "UpdatedAt": datetime.now(),
                                "UpdatedBy": None  # Adjust if you have the user info
                            }}
                        )
                    else:
                        # If no record exists for this student, create a new one
                        new_record = {
                            "_id": str(uuid.uuid4()),
                            "StudentCode": st_code,
                            "StudentAchievements": [new_achievement],  # Start with the new achievement
                            **AuditMixin().generate_audit_fields()
                        }
                        new_records.append(new_record)

                # Insert the new records into MongoDB if any
                if new_records:
                    await target_uow.student_attendances.insert_many(new_records)
                    
                start_row += BATCH_SIZE
