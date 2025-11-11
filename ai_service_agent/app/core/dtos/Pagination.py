from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar('T')

class Pagination(BaseModel, Generic[T]):
    page_index: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, description="Number of items per page")
    total_items: int = Field(..., ge=0, description="Total number of items")
    items: List[T] = Field(..., description="List of items on the current page")
    
    @property
    def total_pages(self) -> int:
        if self.page_size == 0:
            return 0
        temp = self.total_items // self.page_size
        return temp if self.total_items % self.page_size == 0 else temp + 1
    
    @property
    def has_previous_page(self) -> bool:
        """Check if there's a previous page available."""
        return self.page_index > 1

    @property
    def has_next_page(self) -> bool:
        """Check if there's a next page available."""
        return self.page_index < self.total_pages