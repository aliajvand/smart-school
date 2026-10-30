from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_roles
from app.core.audit import record_audit_event
from app.schemas.regrades import (
    RegradeSubmissionRequest,
    RegradeSubmissionResponse,
    RegradeDetailResponse,
    RegradeStepItem,
)

router = APIRouter(prefix="/regrades", tags=["Regrades"])

@router.get("/{ticket_id}", response_model=RegradeDetailResponse)
def get_regrade_details(
    ticket_id: str,
    current_role: str = Depends(require_roles(["student", "teacher", "principal"])),
):
    """
    Returns state machine progression steps for a regrade appeal.
    """
    return RegradeDetailResponse(
        ticket_id=ticket_id,
        student_id="st-109",
        assessment_id="math-12-exam",
        current_stage="teacher_review",
        steps=[
            RegradeStepItem(
                id="step-1",
                label="ثبت اعتراض دانش‌آموز",
                role_description="ثبت سیستمی همراه با متن توضیحات راه‌حل",
                status="completed",
                timestamp="۱۴۰۵/۰۲/۱۵ - ۱۰:۳۰",
                assignee="امیرحسین رضایی",
                notes="توضیح دانش‌آموز: استفاده از روش تغییر متغیر متفاوت در سوال ۳",
            ),
            RegradeStepItem(
                id="step-2",
                label="بررسی تخصصی دبیر",
                role_description="بازبینی دست‌خط و مراحل ریاضی خارج از پاسخ‌نامه استاندارد",
                status="active",
                assignee="استاد علی اجوند",
                notes="در حال مقایسه پاسخ‌برگ با خوشه پاسخ‌های تشابه ۹۲٪",
            ),
            RegradeStepItem(
                id="step-3",
                label="ثبت نمره نهایی در کارنامه",
                role_description="بروزرسانی تراز و ارسال اعلان وضعیت به دانش‌آموز",
                status="pending",
                assignee="سامانه مرکزی",
            ),
        ],
    )

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
