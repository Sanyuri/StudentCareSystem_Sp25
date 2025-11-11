from datetime import datetime
from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, Field
from typing import Optional

T = TypeVar('T')

class ApiRequest(BaseModel, Generic[T]):
    data: T
    timestamp: Optional[datetime] = Field(None)