from typing import Optional
from pydantic import BaseModel, Field

class StudentPointDto(BaseModel):
    student_code: str
    student_name: str
    gpa_gap: float
    number_of_remaining_fail_subjects: int
    absence_rate: float
    is_attendance_exempted: bool
    topsis_score: Optional[float]
    cluster: int
    care_reason: Optional[str] = None 
    
class TenantStudentPoint(BaseModel):
    student_code: str = Field(..., title="Student Code", description="The code identifying the student.")
    subject_code: str = Field(..., title="Subject Code", description="The code identifying the subject.")
    average_mark: float = Field(..., title="Average Mark", description="The average mark obtained by the student.")
    class_name: str = Field("", title="Class Name", description="The name of the class.")
    is_exempt: bool = Field(..., title="Is Exempt", description="Indicates if the student is exempted.")
    fail_reason: str = Field("None", title="Fail Reason", description="The reason for failure: AttendanceFail, Suspension, InsufficientPoints, or None.")
    point_status: str = Field("None", title="Point Status", description="The status of the student's points: None, Pass, or Fail.")
    semester_name: str = Field(..., title="Semester Name", description="The name of the semester.")
    is_pass_with: bool = Field(False, title="Is Pass With", description="Indicates if the student passed with conditions.")
    is_send_mail: bool = Field(False, title="Is Send Mail", description="Indicates if an email was sent.")
    start_date: Optional[str] = Field(None, title="Start Date", description="The start date in ISO format.")
    end_date: Optional[str] = Field(None, title="End Date", description="The end date in ISO format.")