from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_role, require_roles
from app.schemas.dashboard import (
    TeacherDashboardResponse,
    PrincipalDashboardResponse,
    StudentDashboardResponse,
    KpiMetricItem,
    ProgressSeriesPoint,
    GradeBucketItem,
    SuspiciousAnswerItem,
    RecentActivityItem,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/teacher", response_model=TeacherDashboardResponse)
def get_teacher_dashboard(current_role: str = Depends(require_roles(["teacher", "principal"]))):
    """
    Teacher-scoped dashboard: returns class-level metrics and review queues.
    """
    return TeacherDashboardResponse(
        scope="teacher",
        teacher_name="علی اجوند",
        role_title="دبیر ریاضی و حسابان پیشرفته",
        metrics=[
            KpiMetricItem(
                title="دانش‌آموزان کلاس‌های من",
                numeric_value=128,
                delta_percent=8,
                is_positive_delta=True,
                tone="cyan",
                spark_points=[100, 110, 115, 120, 122, 125, 128],
                unit_label="نفر",
            ),
            KpiMetricItem(
                title="برگه تصحیح‌شده هوشمند",
                numeric_value=450,
                delta_percent=20,
                is_positive_delta=True,
                tone="indigo",
                spark_points=[280, 310, 350, 390, 410, 430, 450],
                unit_label="برگه",
            ),
            KpiMetricItem(
                title="نرخ تسلط مفهومی",
                numeric_value=98,
                delta_percent=2,
                is_positive_delta=True,
                is_percent=True,
                tone="emerald",
                spark_points=[92, 94, 93, 95, 96, 97, 98],
            ),
            KpiMetricItem(
                title="نیازمند بازبینی دستی دبیر",
                numeric_value=2,
                delta_percent=12,
                is_positive_delta=False,
                tone="amber",
                spark_points=[8, 6, 7, 5, 4, 3, 2],
                unit_label="مورد",
            ),
        ],
        progress_series=[
            ProgressSeriesPoint(period="هفته ۱", class_avg=25, school_avg=20),
            ProgressSeriesPoint(period="هفته ۲", class_avg=58, school_avg=45),
            ProgressSeriesPoint(period="هفته ۳", class_avg=87, school_avg=68),
            ProgressSeriesPoint(period="هفته ۴", class_avg=92, school_avg=74),
        ],
        grade_distribution=[
            GradeBucketItem(range_label="۰ - ۲۵", count=4, percent=8),
            GradeBucketItem(range_label="۲۵ - ۵۰", count=9, percent=18),
            GradeBucketItem(range_label="۵۰ - ۷۵", count=18, percent=36, highlighted=True),
            GradeBucketItem(range_label="۷۵ - ۹۰", count=12, percent=24),
            GradeBucketItem(range_label="۹۰ - ۱۰۰", count=7, percent=14),
        ],
        suspicious_answers=[
            SuspiciousAnswerItem(
                id="sus-1",
                student_name="سارا محمدی",
                similarity_score=93,
                matched_student_name="امیرحسین رضایی",
                matched_question_title="مساله ۳: انتگرال معین مساحت زیر منحنی",
                status="pending_review",
            ),
            SuspiciousAnswerItem(
                id="sus-2",
                student_name="امیرحسین رضایی",
                similarity_score=89,
                matched_student_name="مهدی کریمی",
                matched_question_title="مساله ۳: انتگرال معین مساحت زیر منحنی",
                status="pending_review",
            ),
        ],
        recent_activities=[
            RecentActivityItem(
                id="act-1",
                title="آزمون فیزیک تصحیح شد",
                description="۴۵ برگه با دقت ۹۶٪ توسط سامانه ارزیابی شد.",
                time_ago="۳ دقیقه پیش",
                status_tone="emerald",
                icon_type="check",
            ),
        ],
    )

@router.get("/principal", response_model=PrincipalDashboardResponse)
def get_principal_dashboard(current_role: str = Depends(require_roles(["principal"]))):
    """
    Principal-scoped dashboard: school-wide aggregate KPIs and analytics.
    """
    return PrincipalDashboardResponse(
        scope="principal",
        principal_name="دکتر محمدرضا صادقی",
        role_title="مدیر مجتمع آموزشی هوشمند",
        metrics=[
            KpiMetricItem(
                title="کل دانش‌آموزان فعال مجتمع",
                numeric_value=12500,
                delta_percent=8,
                is_positive_delta=True,
                is_compact=True,
                tone="cyan",
                spark_points=[11200, 11600, 11900, 12100, 12300, 12450, 12500],
                unit_label="نفر",
            ),
            KpiMetricItem(
                title="آزمون‌های تحلیلی ماه",
                numeric_value=1420,
                delta_percent=15,
                is_positive_delta=True,
                is_compact=True,
                tone="indigo",
                spark_points=[980, 1050, 1150, 1240, 1310, 1380, 1420],
                unit_label="جلسه",
            ),
            KpiMetricItem(
                title="میانگین تراز کل مدرسه",
                numeric_value=94,
                delta_percent=3,
                is_positive_delta=True,
                is_percent=True,
                tone="emerald",
                spark_points=[88, 89, 91, 90, 92, 93, 94],
            ),
            KpiMetricItem(
                title="پرونده‌های فعال EWS",
                numeric_value=18,
                delta_percent=5,
                is_positive_delta=False,
                tone="amber",
                spark_points=[28, 25, 23, 22, 20, 19, 18],
                unit_label="دانش‌آموز",
            ),
        ],
        progress_series=[
            ProgressSeriesPoint(period="هفته ۱", class_avg=20, school_avg=20),
            ProgressSeriesPoint(period="هفته ۲", class_avg=45, school_avg=45),
            ProgressSeriesPoint(period="هفته ۳", class_avg=68, school_avg=68),
            ProgressSeriesPoint(period="هفته ۴", class_avg=74, school_avg=74),
        ],
        grade_distribution=[
            GradeBucketItem(range_label="۰ - ۲۵", count=45, percent=5),
            GradeBucketItem(range_label="۲۵ - ۵۰", count=180, percent=20),
            GradeBucketItem(range_label="۵۰ - ۷۵", count=360, percent=40, highlighted=True),
            GradeBucketItem(range_label="۷۵ - ۹۰", count=220, percent=25),
            GradeBucketItem(range_label="۹۰ - ۱۰۰", count=90, percent=10),
        ],
        suspicious_answers=[],
        recent_activities=[
            RecentActivityItem(
                id="act-p-1",
                title="گزارش جامع ترمیک آماده شد",
                description="تحلیل عملکرد آموزشی ۵ پایه بارگذاری گردید.",
                time_ago="۱ ساعت پیش",
                status_tone="indigo",
                icon_type="document",
            ),
        ],
    )

@router.get("/student", response_model=StudentDashboardResponse)
def get_student_dashboard(current_role: str = Depends(require_roles(["student", "teacher", "principal"]))):
    """
    Student dashboard: individual performance, Taraz interval, and study progress.
    """
    return StudentDashboardResponse(
        scope="student",
        student_name="علی اجوند",
        taraz_min=9300,
        taraz_max=9600,
        taraz_estimate=9480,
        taraz_uncertainty=150,
        metrics=[
            KpiMetricItem(
                title="معدل تراز شده دروس",
                numeric_value=19.15,
                delta_percent=13,
                is_positive_delta=True,
                tone="cyan",
                spark_points=[18.2, 18.5, 18.8, 19.0, 19.15],
                unit_label="از ۲۰",
            ),
            KpiMetricItem(
                title="جزوه صوتی مطالعه شده",
                numeric_value=42,
                delta_percent=14,
                is_positive_delta=False,
                tone="violet",
                spark_points=[50, 48, 45, 43, 42],
                unit_label="جلسه",
            ),
        ],
        recent_activities=[
            RecentActivityItem(
                id="act-s-1",
                title="کوییز حرکت شتاب‌دار تکمیل شد",
                description="نمره کامل ۲۰ از ۲۰ ثبت گردید.",
                time_ago="هم‌اکنون",
                status_tone="emerald",
                icon_type="check",
            ),
        ],
    )
