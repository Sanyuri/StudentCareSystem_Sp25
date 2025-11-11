from sqlalchemy import text
from app.core.database import get_async_db_session
from app.core.dtos.ProgressCriterionTypeDto import TenantProgressCriterionTypeDto

async def get_progress_criterion_type_data(tenant_name: str):
    """
    Get progress criterion type for given students depends on student code
    use only if tenant_name and student_code are provided
    """
    async with await get_async_db_session(tenant_name) as db_session:
        sql = text("""
            SELECT
                Id,
                EnglishName,
                VietnameseName,
                EnglishDescription,
                VietnameseDescription
            FROM ProgressCriterionTypes
        """)

        result = await db_session.execute(sql)
    
    if not result:
        return []
    
    return [
        TenantProgressCriterionTypeDto(
            id=row[0],
            english_name=row[1],
            vietnamese_name=row[2],
            english_description=row[3],
            vietnamese_description=row[4]
        )
        for row in result
    ]