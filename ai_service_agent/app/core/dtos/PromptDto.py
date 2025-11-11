from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.dtos.PaginationFilterBase import PaginationFilterBase

class Prompt(BaseModel):
    prompt_type: str 
    content: str

class PromptRequest(BaseModel):
    model: str
    prompt: Prompt

class ModelPromptsDto(BaseModel):
    _id: str
    model: str
    prompts: List[Prompt]
    CreatedAt: Optional[datetime]
    CreatedBy: Optional[str]
    UpdatedAt: Optional[datetime]
    UpdatedBy: Optional[str]
    DeletedAt: Optional[datetime]
    DeletedBy: Optional[str]
    
class PromptResponseDto(BaseModel):
    model: str
    prompts: List[ModelPromptsDto]
    
class PromptFilter(PaginationFilterBase):
    query : Optional[str] = Field(None, description="Search value for filtering")
    