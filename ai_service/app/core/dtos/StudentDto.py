from pydantic import BaseModel

class TenantStudent(BaseModel):
    student_code: str
    student_name: str
    major: str
    gender: str
    progress: str
    current_term_no: int
    specialization: str