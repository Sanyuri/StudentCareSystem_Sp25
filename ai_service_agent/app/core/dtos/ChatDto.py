from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_id: str
    message: str
    
class GetChatHistoryResponse(BaseModel):
    messages: List[Dict[str, Any]]
    next_cursor: Optional[str]