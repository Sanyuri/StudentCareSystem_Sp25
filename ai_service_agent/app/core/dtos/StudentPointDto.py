from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum

class FailReason(str, Enum):
    ATTENDANCE_FAIL = "AttendanceFail"
    SUSPENSION = "Suspension"
    INSUFFICIENT_POINTS = "InsufficientPoints"
    NONE = "None"

class PointStatus(str, Enum):
    NONE = "None"
    PASS = "Pass"
    FAIL = "Fail"

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
    point_status: PointStatus = Field(PointStatus.NONE, title="Point Status", description="The status of the student's performance.")
    average_mark: float = Field(..., title="Average Mark", description="The average mark obtained by the student.")
    is_exempt: bool = Field(..., title="Is Exempt", description="Indicates if the student is exempted.")
    fail_reason: FailReason = Field(FailReason.NONE, title="Fail Reason", description="The reason for failure if applicable.")
    semester_name: str = Field(..., title="Semester Name", description="The name of the semester.")
    class_name: str = Field("", title="Class Name", description="The name of the class.")
    is_pass_with: bool = Field(False, title="Is Pass With", description="Indicates if the student passed with conditions.")
    is_send_mail: bool = Field(False, title="Is Send Mail", description="Indicates if mail has been sent.")
    start_date: Optional[str] = Field(None, title="Start Date", description="The start date of the course.")
    end_date: Optional[str] = Field(None, title="End Date", description="The end date of the course.")