import pytest
import sympy as sp
from app.services.math_engine import (
    safe_parse_math,
    evaluate_parametric_variants,
    MathSecurityException,
)

def test_safe_math_valid_expression():
    expr = safe_parse_math("v0 * sin(theta) + g * t", ["v0", "theta", "g", "t"])
    assert isinstance(expr, sp.Expr)
    assert sp.Symbol("v0") in expr.free_symbols

def test_math_injection_import_rejected():
    with pytest.raises(MathSecurityException, match="Disallowed keyword"):
        safe_parse_math("__import__('os').system('dir')", ["x"])

def test_math_injection_os_system_rejected():
    with pytest.raises(MathSecurityException, match="Disallowed keyword"):
        safe_parse_math("os.system('calc')", ["os"])

def test_math_injection_attribute_access_rejected():
    with pytest.raises(MathSecurityException, match="Disallowed keyword"):
        safe_parse_math("x.__class__.__bases__", ["x"])

def test_math_injection_semicolon_rejected():
    with pytest.raises(MathSecurityException, match="Disallowed keyword"):
        safe_parse_math("x + 1; rm -rf /", ["x"])

def test_math_huge_exponent_rejected():
    with pytest.raises(MathSecurityException, match="Exponent too large"):
        safe_parse_math("x ** 1000", ["x"])

def test_math_unknown_unauthorized_symbol():
    with pytest.raises(MathSecurityException, match="Unauthorized symbol"):
        safe_parse_math("x + y + secret_var", ["x", "y"])

def test_evaluate_parametric_variants_success():
    params = [
        {"symbol": "a", "min_val": 1.0, "max_val": 5.0, "step": 1.0},
        {"symbol": "b", "min_val": 2.0, "max_val": 10.0, "step": 2.0},
        {"symbol": "x", "min_val": 1.0, "max_val": 5.0, "step": 1.0},
    ]
    variants = evaluate_parametric_variants("a * x + b", params, variant_count=5)
    assert len(variants) == 5
    for v in variants:
        assert v["is_valid"] is True
        assert "a" in v["variable_assignments"]
        assert "b" in v["variable_assignments"]
        assert "x" in v["variable_assignments"]

def test_parametric_invalid_step():
    params = [
        {"symbol": "a", "min_val": 1.0, "max_val": 5.0, "step": 0.0},
    ]
    with pytest.raises(ValueError, match="Step must be > 0"):
        evaluate_parametric_variants("a + 1", params, variant_count=3)

def test_parametric_invalid_range_min_greater_than_max():
    params = [
        {"symbol": "a", "min_val": 10.0, "max_val": 5.0, "step": 1.0},
    ]
    with pytest.raises(ValueError, match="min_val cannot exceed max_val"):
        evaluate_parametric_variants("a + 1", params, variant_count=3)

def test_parametric_division_by_zero_handling():
    params = [
        {"symbol": "a", "min_val": 0.0, "max_val": 0.0, "step": 1.0},
    ]
    with pytest.raises(MathSecurityException, match="Division by zero"):
        evaluate_parametric_variants("10 / a", params, variant_count=1)
