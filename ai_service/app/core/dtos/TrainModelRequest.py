from pydantic import BaseModel


class TrainModelRequest(BaseModel):
    semester_name: str
    n_clusters: int