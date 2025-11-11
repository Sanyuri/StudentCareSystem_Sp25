from sqlalchemy import bindparam, text
from app.core.database import get_db_session

def get_student_attendances(tenant_name: str, semester_name_list: list[str], student_codes: list[str]):
    with get_db_session(tenant_name) as db_session:
        sql = text("""
            SELECT
                UPPER(StudentCode),
                SemesterName,
                SubjectCode,
                TotalAbsences,
                TotalSlots,
                AbsenceRate
            FROM
                StudentAttendances
            WHERE
                SemesterName IN :semester_names
                AND StudentCode IN :student_codes
        """).bindparams(
            bindparam("semester_names", expanding=True),
            bindparam("student_codes", expanding=True)
        )

        result = db_session.execute(sql, {
            "semester_names": semester_name_list,
            "student_codes": student_codes
        })

        student_attendances = result.fetchall()

    return student_attendances