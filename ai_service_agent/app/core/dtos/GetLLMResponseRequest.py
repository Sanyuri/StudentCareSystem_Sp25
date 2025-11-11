from pydantic import BaseModel

class GetLLMResponseRequest(BaseModel):
    prompt_type: str
    parameters: list[str]
    