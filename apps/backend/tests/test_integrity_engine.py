import pytest
from app.services.integrity_engine import (
    compute_jaccard_token_similarity,
    classify_integrity_edge,
)

def test_jaccard_similarity_identical():
    tokens = ["int", "x", "pow", "2", "dx"]
    sim = compute_jaccard_token_similarity(tokens, tokens)
    assert sim == 1.0

def test_jaccard_similarity_empty():
    assert compute_jaccard_token_similarity([], ["x"]) == 0.0
    assert compute_jaccard_token_similarity(["x"], []) == 0.0

def test_classify_integrity_edge_high_similarity_solid():
    edge = classify_integrity_edge(similarity=0.92, shares_unusual_error=True)
    assert edge["edge_style"] == "solid"
    assert edge["is_verdict"] is False
    assert "disclaimer" in edge

def test_classify_integrity_edge_moderate_dashed():
    edge = classify_integrity_edge(similarity=0.85, shares_unusual_error=False)
    assert edge["edge_style"] == "dashed"
    assert edge["is_verdict"] is False

def test_classify_integrity_edge_low_dotted():
    edge = classify_integrity_edge(similarity=0.72, shares_unusual_error=False)
    assert edge["edge_style"] == "dotted"
    assert edge["is_verdict"] is False
