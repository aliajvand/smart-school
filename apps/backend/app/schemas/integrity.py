from typing import List, Optional
from pydantic import BaseModel, Field

class IntegrityNodeSchema(BaseModel):
    id: str
    name: str
    risk_score: float
    has_flag: bool = False

class IntegrityEdgeSchema(BaseModel):
    source_id: str
    target_id: str
    similarity_score: float
    edge_style: str  # solid | dashed | dotted
    reason: str
    review_state: str = "unreviewed"  # unreviewed | reviewed | dismissed

class IntegritySignalsResponse(BaseModel):
    nodes: List[IntegrityNodeSchema]
    edges: List[IntegrityEdgeSchema]
    non_verdict_disclaimer: str = "تشابه راه‌حل صرفاً یک سیگنال کمکی برای بررسی دبیر است و به معنای اثبات تخلف نیست."

class ClusterAnswerSchema(BaseModel):
    student_id: str
    display_name: str
    answer_text: str
    current_score: Optional[float] = None

class AnswerClusterSchema(BaseModel):
    cluster_id: str
    cluster_name: str
    representative_answer: str
    student_count: int
    similarity_percent: float
    confidence_score: float
    review_required: bool
    status: str

class BatchScoreRequest(BaseModel):
    cluster_id: str
    score: float = Field(..., ge=0, le=20)
    rubric_override_reason: Optional[str] = None
