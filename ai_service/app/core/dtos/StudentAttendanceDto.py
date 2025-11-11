from pydantic import BaseModel


class TenantStudentAttendance(BaseModel):
    student_code: str
    semester_name: str
    subject_code: str
    total_absences: int
    total_slots: int
    absence_rate: float