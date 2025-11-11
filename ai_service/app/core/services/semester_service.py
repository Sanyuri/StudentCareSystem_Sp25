from sqlalchemy import text
from app.core.database import get_async_db_session

class SemesterService:
    """
    Service to handle semester-related operations.
    """
    def __init__(self, tenant_name: str):
        self.tenant_name = tenant_name

    async def get_all_semesters(self):
        session = await get_async_db_session(self.tenant_name)
        async with session as db_session:
            sql = text("""
                SELECT
                    SemesterName,
                    IsCurrentSemester,
                    StartDate,
                    EndDate
                FROM Semesters
            """)
            result = await db_session.execute(sql)
            semesters = result.fetchall()
        return semesters
    
