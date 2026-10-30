from typing import List, Dict, Any, Optional

def evaluate_step_score(
    max_step_score: float,
    is_correct: bool,
    has_minor_arithmetic_error: bool = False,
    is_missing: bool = False,
) -> float:
    """
    Computes step score with rigorous clamping between 0 and max_step_score.
    """
    if is_missing or max_step_score <= 0:
        return 0.0
    if is_correct and not has_minor_arithmetic_error:
        return float(max_step_score)
    if is_correct and has_minor_arithmetic_error:
        # Partial credit: deduct 20% for minor arithmetic slip
        return round(float(max_step_score) * 0.8, 2)
    return 0.0

def clamp_score(score: float, min_val: float = 0.0, max_val: float = 20.0) -> float:
    return max(min_val, min(max_val, round(score, 2)))

def apply_batch_cluster_score(
    student_ids: List[str],
    cluster_score: float,
    max_score: float = 20.0,
) -> Dict[str, Any]:
    """
    Applies batch grading to an entire AST cluster with clamping and audit metadata.
    """
    clamped = clamp_score(cluster_score, 0.0, max_score)
    return {
        "awarded_score": clamped,
        "max_score": max_score,
        "affected_students_count": len(student_ids),
        "student_ids": student_ids,
        "batch_applied": True,
        "audit_note": f"نمره گروهی {clamped} از {max_score} با موفقیت اعمال شد.",
    }
