from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_roles
from app.core.audit import record_audit_event
from app.schemas.regrades import RegradeSubmissionRequest, RegradeSubmissionResponse

router = APIRouter(prefix="/regrades", tags=["Regrades"])

@router.post("", response_model=RegradeSubmissionResponse)
def submit_regrade_request(
    req: RegradeSubmissionRequest,
    current_role: str = Depends(require_roles(["student", "teacher", "principal"])),
):
    """
    Submits a student appeal for exam regrading. Transitions state machine to 'teacher_review'.
    Logs audit record.
    """
    ticket_id = f"regrade-{req.student_id}-{req.assessment_id}-{req.question_number}"
    
    record_audit_event(
        action="SUBMIT_REGRADE_APPEAL",
        actor_role=current_role,
        target_student_id=req.student_id,
        purpose=f"درخواست بازبینی نمره سوال {req.question_number} در آزمون {req.assessment_id}",
        details=req.claimed_issue,
    )
    
    return RegradeSubmissionResponse(
        regrade_ticket_id=ticket_id,
        status="pending_teacher_review",
        current_stage="teacher_review",
        assigned_reviewer="استاد علی اجوند (دبیر ریاضی)",
        submission_timestamp=datetime.now(timezone.utc).isoformat(),
        message="درخواست بازبینی با موفقیت ثبت شد و به کارتابل دبیر ارسال گردید.",
    )
