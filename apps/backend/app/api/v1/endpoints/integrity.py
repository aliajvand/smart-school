from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_roles
from app.core.audit import record_audit_event
from app.services.grading_engine import apply_batch_cluster_score
from app.schemas.integrity import (
    IntegritySignalsResponse,
    IntegrityNodeSchema,
    IntegrityEdgeSchema,
    AnswerClusterSchema,
    BatchScoreRequest,
)

router = APIRouter(prefix="", tags=["Integrity & Clustering"])

MOCK_CLUSTERS = [
    AnswerClusterSchema(
        cluster_id="cls-1",
        cluster_name="خوشه راه‌حل استاندارد دقیق",
        representative_answer="\\frac{x^3}{3} \\Big|_{-1}^{1} = \\frac{2}{3}",
        student_count=23,
        similarity_percent=96.0,
        confidence_score=98.0,
        review_required=False,
        status="reviewed",
    ),
    AnswerClusterSchema(
        cluster_id="cls-2",
        cluster_name="خوشه خطای علامت در کران پایین",
        representative_answer="\\frac{1}{3} - \\frac{1}{3} = 0",
        student_count=13,
        similarity_percent=92.0,
        confidence_score=90.0,
        review_required=True,
        status="pending",
    ),
    AnswerClusterSchema(
        cluster_id="cls-3",
        cluster_name="خوشه تغییر متغیر بدون تغییر کران‌ها",
        representative_answer="u = x^2 \\implies \\int u du",
        student_count=7,
        similarity_percent=87.0,
        confidence_score=85.0,
        review_required=True,
        status="flagged",
    ),
]

@router.get("/integrity/signals", response_model=IntegritySignalsResponse)
def get_integrity_signals(current_role: str = Depends(require_roles(["teacher", "principal"]))):
    """
    Returns graph similarity radar nodes and edges with distinct stroke pattern hints.
    Always includes the mandatory non-verdict disclaimer.
    """
    return IntegritySignalsResponse(
        nodes=[
            IntegrityNodeSchema(id="st-sara", name="سارا محمدی", risk_score=92.0, has_flag=True),
            IntegrityNodeSchema(id="st-amir", name="امیرحسین رضایی", risk_score=89.0, has_flag=True),
            IntegrityNodeSchema(id="st-mehdi", name="مهدی کریمی", risk_score=87.0, has_flag=True),
            IntegrityNodeSchema(id="st-nima", name="نیما علوی", risk_score=45.0, has_flag=False),
            IntegrityNodeSchema(id="st-maryam", name="مریم کمالی", risk_score=32.0, has_flag=False),
        ],
        edges=[
            IntegrityEdgeSchema(
                source_id="st-sara",
                target_id="st-amir",
                similarity_score=92.0,
                edge_style="solid",
                reason="همپوشانی خطای جبری مشابه در مرحله ۳ انتگرال",
                review_state="unreviewed",
            ),
            IntegrityEdgeSchema(
                source_id="st-amir",
                target_id="st-mehdi",
                similarity_score=89.0,
                edge_style="dashed",
                reason="شباهت ساختار حل بدون درج مراحل میانی",
                review_state="unreviewed",
            ),
            IntegrityEdgeSchema(
                source_id="st-sara",
                target_id="st-mehdi",
                similarity_score=87.0,
                edge_style="dotted",
                reason="همبستگی پارامتری مشکوک در نسخه آزمون جایگزین",
                review_state="unreviewed",
            ),
        ],
        non_verdict_disclaimer="تشابه راه‌حل صرفاً یک سیگنال کمکی برای بررسی دبیر است و به معنای اثبات تخلف نیست.",
    )

@router.get("/assessments/{assessment_id}/clusters", response_model=List[AnswerClusterSchema])
def get_assessment_clusters(
    assessment_id: str,
    current_role: str = Depends(require_roles(["teacher", "principal"])),
):
    """
    Returns AST isomorphic answer clusters for batch grading.
    """
    return MOCK_CLUSTERS

@router.post("/assessments/{assessment_id}/clusters/batch-score")
def apply_batch_score(
    assessment_id: str,
    req: BatchScoreRequest,
    current_role: str = Depends(require_roles(["teacher", "principal"])),
):
    """
    Applies score to all students within a cluster and logs an audit record.
    """
    cluster = next((c for c in MOCK_CLUSTERS if c.cluster_id == req.cluster_id), None)
    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"خوشه با شناسه '{req.cluster_id}' یافت نشد.",
        )
        
    mock_students = [f"st-{i}" for i in range(cluster.student_count)]
    result = apply_batch_cluster_score(mock_students, req.score)
    
    record_audit_event(
        action="BATCH_CLUSTER_GRADING",
        actor_role=current_role,
        purpose=f"اعمال نمره گروهی برای خوشه {req.cluster_id} در آزمون {assessment_id}",
        details=f"نمره {result['awarded_score']} برای {result['affected_students_count']} دانش‌آموز ثبت شد.",
    )
    
    return {
        "success": True,
        "cluster_id": req.cluster_id,
        "result": result,
    }
