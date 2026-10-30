from typing import List, Optional
from pydantic import BaseModel, Field

class KpiMetricItem(BaseModel):
    title: str
    numeric_value: float
    delta_percent: float
    is_positive_delta: bool = True
    is_percent: bool = False
    is_compact: bool = False
    tone: str
    spark_points: List[float]
    unit_label: Optional[str] = None

class ProgressSeriesPoint(BaseModel):
    period: str
    class_avg: float
    school_avg: float

class GradeBucketItem(BaseModel):
    range_label: str
    count: int
    percent: float
    highlighted: bool = False

class SuspiciousAnswerItem(BaseModel):
    id: str
    student_name: str
    similarity_score: float
    matched_student_name: str
    matched_question_title: str
    status: str

class RecentActivityItem(BaseModel):
    id: str
    title: str
    description: str
    time_ago: str
    status_tone: str
    icon_type: str

class TeacherDashboardResponse(BaseModel):
    scope: str = "teacher"
    teacher_name: str
    role_title: str
    metrics: List[KpiMetricItem]
    progress_series: List[ProgressSeriesPoint]
    grade_distribution: List[GradeBucketItem]
    suspicious_answers: List[SuspiciousAnswerItem]
    recent_activities: List[RecentActivityItem]

class PrincipalDashboardResponse(BaseModel):
    scope: str = "principal"
    principal_name: str
    role_title: str
    metrics: List[KpiMetricItem]
    progress_series: List[ProgressSeriesPoint]
    grade_distribution: List[GradeBucketItem]
    suspicious_answers: List[SuspiciousAnswerItem]
    recent_activities: List[RecentActivityItem]

class StudentDashboardResponse(BaseModel):
    scope: str = "student"
    student_name: str
    taraz_min: int
    taraz_max: int
    taraz_estimate: int
    taraz_uncertainty: int
    metrics: List[KpiMetricItem]
    recent_activities: List[RecentActivityItem]
