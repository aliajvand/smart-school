from typing import List, Optional
from pydantic import BaseModel, Field
from .dashboard import KpiMetricItem, ProgressSeriesPoint

class ShapFeatureItem(BaseModel):
    feature_key: str
    label: str
    share_percent: float
    bar_gradient: str
    direction: str

class AtRiskStudentItem(BaseModel):
    id: str
    name: str
    grade_and_major: str
    risk_score: float
    priority_label: str
    status_tone: str
    dominant_factors: List[str]
    suggested_action: str
    outreach_approved: bool = False

class CounselorOverviewResponse(BaseModel):
    metrics: List[KpiMetricItem]
    progress_series: List[ProgressSeriesPoint]
    shap_features: List[ShapFeatureItem]
    total_at_risk_count: int

class OutreachApprovalRequest(BaseModel):
    student_id: str
    counselor_notes: Optional[str] = None
    custom_message: str
    confirmed_by_counselor: bool = Field(..., description="Explicit human approval gate")
