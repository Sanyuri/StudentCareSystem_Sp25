from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar('T')

class ApiResponse (BaseModel, Generic[T]):
    data: T
    message: str
    status: int
    timestamp: datetime = Field(default_factory=datetime.now)