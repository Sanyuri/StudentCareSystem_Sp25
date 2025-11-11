from sqlalchemy import bindparam, text
from app.core.database import get_db_session

def get_student_points(tenant_name:str, semester_name_list:list[str],student_codes:list[str]):    
    with get_db_session(tenant_name) as db_session:
        student_points_query = text("""
            SELECT
                UPPER(StudentCode),
                SubjectCode,
                PointStatus,
                AverageMark,
                IsExempt,
                FailReason,
                SemesterName,
                ClassName,
                IsPassWith,
                IsSendMail,
                StartDate,
                EndDate
            FROM
                StudentPoints
            WHERE
                SemesterName IN :semester_names
                AND StudentCode IN :student_codes
            """
        ).bindparams(
            bindparam("semester_names", expanding=True),
            bindparam("student_codes", expanding=True)
        )
        
        result = db_session.execute(student_points_query, {
            "semester_names": semester_name_list,
            "student_codes": student_codes
        })
        
        student_points = result.fetchall()

    return student_points