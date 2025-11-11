from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import bindparam, text
from app.core.database import get_async_db_session

async def get_student_info(tenant_name: str, student_codes: list[str]):
    # Await để lấy đối tượng session hỗ trợ async context
    session = await get_async_db_session(tenant_name)
    async with session as db_session:
        sql = text("""
            SELECT
                UPPER(StudentCode),
                StudentName,
                Major,
                Gender,
                Progress,
                CurrentTermNo,
                Specialization
            FROM Students
            WHERE
                StudentCode IN :student_codes
        """).bindparams(
            bindparam("student_codes", expanding=True)
        )

        result = await db_session.execute(sql, {
            "student_codes": student_codes
        })

        student_info = result.fetchall()

    return student_info
