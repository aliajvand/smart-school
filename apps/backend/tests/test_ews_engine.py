import pytest
from app.services.ews_engine import (
    compute_ewma_baseline,
    assess_student_risk,
    normalize_shap_attributions,
)

def test_ewma_missing_values_are_not_zero():
    """
    CRITICAL QUALITY GATE: Missing values (None) must be ignored as gaps,
    and NEVER imputed as zero (which would falsely trigger risk flags).
    """
    scores_with_gaps = [18.0, None, 19.0, None, 18.5]
    baseline = compute_ewma_baseline(scores_with_gaps, alpha=0.3)
    assert baseline is not None
    assert baseline >= 18.0, f"Expected baseline around 18.5, got {baseline}"

def test_ewma_all_none_returns_none():
    assert compute_ewma_baseline([None, None]) is None

def test_assess_student_risk_urgent():
    # Low baseline + negative trend + multiple absences
    level, score, factors = assess_student_risk(
        historical_scores=[10.0, 11.0],
        recent_trend_delta=-2.5,
        unexcused_absences=3,
        assignment_delays=2,
    )
    assert level == "urgent"
    assert score >= 75.0
    assert len(factors) >= 3

def test_assess_student_risk_none():
    level, score, factors = assess_student_risk(
        historical_scores=[18.0, 19.0, 19.5],
        recent_trend_delta=0.5,
        unexcused_absences=0,
        assignment_delays=0,
    )
    assert level == "none"
    assert score < 50.0

def test_normalize_shap_attributions_sums_to_100():
    raw_shares = {"homework": 40.0, "attendance": 30.0, "audio_notes": 10.0}
    normalized = normalize_shap_attributions(raw_shares)
    total_pct = sum(item["share_percent"] for item in normalized)
    assert round(total_pct) == 100
    for item in normalized:
        assert "disclaimer" in item
