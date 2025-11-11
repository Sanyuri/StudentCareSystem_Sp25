from typing import Optional
from pydantic import BaseModel, Field
from app.core.dtos.PaginationFilterBase import PaginationFilterBase

class StudentAnalysisFilter(PaginationFilterBase):
    query: Optional[str] = Field(None, description="Search value for filtering")
    order_by_topsis_score: Optional[bool] = Field(None, description="Order by TOPSIS score")
    ignored_status_codes: Optional[list[str]] = Field(None, description="List of status codes to ignore")
    status_codes: Optional[list[str]] = Field(None, description="List of status codes to include")
    semester_name: str = Field(..., description="Semester name for filtering")
    min_gpa_gap: Optional[float] = Field(None, ge=0.0, le=10.0, description="Minimum GPA for filtering")
    max_gpa_gap: Optional[float] = Field(None, ge=0.0, le=10.0, description="Maximum GPA for filtering")
    min_absence_rate: Optional[float] = Field(None, ge=0.0, le=1.0, description="Minimum absence rate percentage")
    max_absence_rate: Optional[float] = Field(None, ge=0.0, le=1.0, description="Maximum absence rate percentage")
    min_fail_subjects: Optional[int] = Field(None, ge=0, description="Minimum number of failed subjects")
    max_fail_subjects: Optional[int] = Field(None, ge=0, description="Maximum number of failed subjects")
    min_current_term_no: Optional[int] = Field(None, ge=0, description="Minimum current term number")
    max_current_term_no: Optional[int] = Field(None, ge=0, description="Maximum current term number")
    is_attendance_exempted: Optional[bool] = Field(None, description="Filter students based on attendance exemption")
    ignored_student_codes: Optional[list[str]] = Field(None, description="List of student codes to ignore")
    
class CacheStudentRequest(BaseModel):
    semester_name: str = Field(..., description="Semester name for filtering")
    number_of_students: Optional[int] = Field(None, description="Maximum number of students to cache")
    ignored_student_codes: Optional[list[str]] = Field(None, description="List of student codes to ignore")
    ignored_status_codes: Optional[list[str]] = Field(None, description="List of status codes to ignore")