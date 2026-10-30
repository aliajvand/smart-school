from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_roles
from app.core.audit import record_audit_event
from app.schemas.counselor import (
    CounselorOverviewResponse,
    AtRiskStudentItem,
    ShapFeatureItem,
    OutreachApprovalRequest,
)
from app.schemas.dashboard import KpiMetricItem, ProgressSeriesPoint

router = APIRouter(prefix="/counselor", tags=["Counselor & EWS"])

MOCK_AT_RISK_STUDENTS = [
    AtRiskStudentItem(
        id="st-109",
        name="امیرحسین رضایی",
        grade_and_major="دوازدهم ریاضی • تغییر شیب نمرات حسابان",
        risk_score=88.0,
        priority_label="اولویت بررسی بالا",
        status_tone="danger",
        dominant_factors=["افت نمره آزمون دوره‌ای", "غیبت در آزمون تکوینی", "تاخیر در تمرین"],
        suggested_action="هماهنگی جلسه مشاوره آنلاین و ارسال بسته مرور جبرانی",
        outreach_approved=False,
    ),
    AtRiskStudentItem(
        id="st-104",
        name="سارا محمدی",
        grade_and_major="دوازدهم تجربی • ۳ غیبت متوالی زیست‌شناسی",
        risk_score=74.0,
        priority_label="نیازمند پیگیری آموزشی",
        status_tone="warning",
        dominant_factors=["عدم دسترسی به بستر آنلاین", "کاهش فعالیت در کوییزها"],
        suggested_action="ارسال جزوه صوتی جلسه و چک‌این وضعیت اینترنت",
        outreach_approved=False,
    ),
    AtRiskStudentItem(
        id="st-112",
        name="مهدی کریمی",
        grade_and_major="یازدهم ریاضی • تاخیر در تکالیف هندسه",
        risk_score=61.0,
        priority_label="رصد پشتیبان",
        status_tone="violet",
        dominant_factors=["عدم تطابق سرعت یادگیری", "افت زمان مطالعه در سامانه"],
        suggested_action="معرفی ویدیوهای مکمل هندسه تحلیلی",
        outreach_approved=True,
    ),
]

@router.get("/overview", response_model=CounselorOverviewResponse)
def get_counselor_overview(current_role: str = Depends(require_roles(["counselor", "principal"]))):
    """
    Returns counselor EWS portal overview metrics and SHAP feature attribution.
    Gated behind counselor/principal RBAC.
    """
    record_audit_event(
        action="VIEW_COUNSELOR_OVERVIEW",
        actor_role=current_role,
        purpose="پایش کلی شاخص‌های EWS مدرسه",
    )
    
    return CounselorOverviewResponse(
        metrics=[
            KpiMetricItem(
                title="دانش‌آموزان تحت پایش پایه",
                numeric_value=320,
                delta_percent=12,
                is_positive_delta=True,
                tone="cyan",
                spark_points=[40, 48, 52, 60, 68, 75, 82],
                unit_label="نفر",
            ),
            KpiMetricItem(
                title="پرونده‌های نیازمند بررسی مشاور",
                numeric_value=7,
                delta_percent=2,
                is_positive_delta=False,
                tone="amber",
                spark_points=[12, 15, 11, 18, 14, 9, 7],
                unit_label="پرونده",
            ),
            KpiMetricItem(
                title="جلسات مشاوره برگزارشده",
                numeric_value=24,
                delta_percent=20,
                is_positive_delta=True,
                tone="violet",
                spark_points=[10, 14, 16, 15, 20, 22, 24],
                unit_label="جلسه",
            ),
            KpiMetricItem(
                title="بهبود روند پس از جلسه",
                numeric_value=89,
                delta_percent=8,
                is_positive_delta=True,
                is_percent=True,
                tone="emerald",
                spark_points=[70, 74, 76, 80, 84, 86, 89],
            ),
        ],
        progress_series=[
            ProgressSeriesPoint(period="هفته ۱", class_avg=22, school_avg=18),
            ProgressSeriesPoint(period="هفته ۲", class_avg=65, school_avg=42),
            ProgressSeriesPoint(period="هفته ۳", class_avg=78, school_avg=55),
            ProgressSeriesPoint(period="هفته ۴", class_avg=85, school_avg=60),
        ],
        shap_features=[
            ShapFeatureItem(
                feature_key="homework_delay",
                label="تاخیر در تحویل ۲ تمرین حسابان متوالی",
                share_percent=48.0,
                bar_gradient="from-danger to-warning",
                direction="risk_increasing",
            ),
            ShapFeatureItem(
                feature_key="online_absence",
                label="غیبت در ۲ جلسه آنلاین روز آلودگی هوا",
                share_percent=32.0,
                bar_gradient="from-warning to-ai-violet",
                direction="risk_increasing",
            ),
            ShapFeatureItem(
                feature_key="audio_review_reduction",
                label="کاهش زمان مرور جزوه صوتی کلاس",
                share_percent=20.0,
                bar_gradient="from-ai-violet to-ai-cyan",
                direction="risk_increasing",
            ),
        ],
        total_at_risk_count=len(MOCK_AT_RISK_STUDENTS),
    )

@router.get("/students/at-risk", response_model=List[AtRiskStudentItem])
def get_at_risk_students(current_role: str = Depends(require_roles(["counselor", "principal"]))):
    """
    Returns prioritized at-risk student queue.
    """
    record_audit_event(
        action="VIEW_AT_RISK_QUEUE",
        actor_role=current_role,
        purpose="مشاهده صف پرونده‌های نیازمند اقدام مشاور",
    )
    return MOCK_AT_RISK_STUDENTS

@router.post("/outreach/approve")
def approve_human_outreach(
    req: OutreachApprovalRequest,
    current_role: str = Depends(require_roles(["counselor", "principal"])),
):
    """
    Human-in-the-loop approval gate: logs the counselor's explicit sign-off.
    Never sends automated messages without human confirmation.
    """
    if not req.confirmed_by_counselor:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="تایید صریح مشاور الزامی است (confirmed_by_counselor must be True).",
        )
        
    audit_entry = record_audit_event(
        action="APPROVE_OUTREACH_MESSAGE",
        actor_role=current_role,
        target_student_id=req.student_id,
        purpose="تایید ارسال پیام حمایتی به دانش‌آموز",
        details=req.custom_message,
    )
    
    return {
        "success": True,
        "audit_id": audit_entry.id,
        "message": "پیام حمایتی مشاور با موفقیت تایید و ارسال گردید.",
    }
