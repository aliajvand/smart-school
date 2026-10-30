from typing import Optional
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
