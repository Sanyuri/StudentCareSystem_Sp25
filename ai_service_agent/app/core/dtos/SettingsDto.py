from pydantic import BaseModel


class SaveSettingsRequest(BaseModel):
    provider: str
    model_id: str