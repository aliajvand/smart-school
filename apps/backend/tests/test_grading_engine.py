import pytest
from app.services.grading_engine import (
    evaluate_step_score,
    clamp_score,
    apply_batch_cluster_score,
)

def test_evaluate_step_score_full():
    score = evaluate_step_score(max_step_score=10.0, is_correct=True)
    assert score == 10.0

def test_evaluate_step_score_partial_arithmetic_error():
    score = evaluate_step_score(max_step_score=10.0, is_correct=True, has_minor_arithmetic_error=True)
    assert score == 8.0

def test_evaluate_step_score_wrong_or_missing():
    assert evaluate_step_score(10.0, is_correct=False) == 0.0
    assert evaluate_step_score(10.0, is_correct=True, is_missing=True) == 0.0

def test_clamp_score():
    assert clamp_score(-5.0, 0.0, 20.0) == 0.0
    assert clamp_score(25.0, 0.0, 20.0) == 20.0
    assert clamp_score(18.556, 0.0, 20.0) == 18.56

def test_apply_batch_cluster_score():
    student_ids = ["st-1", "st-2", "st-3"]
    result = apply_batch_cluster_score(student_ids, cluster_score=19.5, max_score=20.0)
    assert result["batch_applied"] is True
    assert result["awarded_score"] == 19.5
    assert result["affected_students_count"] == 3
