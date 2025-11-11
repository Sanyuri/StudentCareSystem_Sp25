from pydantic import BaseModel

class TenantProgressCriterionTypeDto(BaseModel):
    id: str
    english_name: str
    vietnamese_name: str
    english_description: str
    vietnamese_description: str