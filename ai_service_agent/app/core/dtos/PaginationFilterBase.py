from pydantic import BaseModel, Field

class PaginationFilterBase(BaseModel):
    page_number: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, le=1000, description="Number of items per page")