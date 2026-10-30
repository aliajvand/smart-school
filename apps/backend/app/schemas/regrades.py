from typing import Optional, List
from pydantic import BaseModel, Field

class RegradeSubmissionRequest(BaseModel):
    student_id: str
    assessment_id: str
    question_number: int
    claimed_issue: str = Field(..., max_length=500)
    student_evidence_note: Optional[str] = None

class RegradeSubmissionResponse(BaseModel):
    regrade_ticket_id: str
    status: str = "pending_teacher_review"
    current_stage: str = "teacher_review"
    assigned_reviewer: str
    submission_timestamp: str
    message: str = "درخواست بازبینی با موفقیت ثبت شد و به کارتابل دبیر ارسال گردید."

class RegradeStepItem(BaseModel):
    id: str
    label: str
    role_description: str
    status: str  # 'completed' | 'active' | 'pending'
    timestamp: Optional[str] = None
    assignee: Optional[str] = None
    notes: Optional[str] = None

class RegradeDetailResponse(BaseModel):
    ticket_id: str
    student_id: str
    assessment_id: str
    current_stage: str
    steps: List[RegradeStepItem]
