import re
from typing import Dict, List, Tuple, Any
import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
)

# Explicit allowed function allowlist
SAFE_FUNCTIONS = {
    "sin": sp.sin,
    "cos": sp.cos,
    "tan": sp.tan,
    "exp": sp.exp,
    "log": sp.log,
    "sqrt": sp.sqrt,
    "Abs": sp.Abs,
    "pi": sp.pi,
    "E": sp.E,
}

# Strict security regex: rejects any Python dunder methods, semicolons, import, or suspicious tokens
DISALLOWED_PATTERNS = [
    re.compile(r"__\w+__"),
    re.compile(r"\bimport\b"),
    re.compile(r"\bos\b"),
    re.compile(r"\bsys\b"),
    re.compile(r"\bsubprocess\b"),
    re.compile(r"\bexec\b"),
    re.compile(r"\beval\b"),
    re.compile(r"\bcompile\b"),
    re.compile(r"\bopen\b"),
    re.compile(r";"),
    re.compile(r"\."),  # Reject attribute access
]

class MathSecurityException(Exception):
    pass

def sanitize_and_validate_expression_string(expr_str: str, max_length: int = 150) -> None:
    if not expr_str or not expr_str.strip():
        raise MathSecurityException("Expression cannot be empty.")
    if len(expr_str) > max_length:
        raise MathSecurityException(f"Expression exceeds maximum length of {max_length} characters.")
    
    for pat in DISALLOWED_PATTERNS:
        if pat.search(expr_str):
            raise MathSecurityException("Disallowed keyword or pattern detected in expression.")

def safe_parse_math(expr_str: str, allowed_symbols: List[str]) -> sp.Expr:
    """
    Safely parses a mathematical string using sympy.parse_expr with:
    - Pre-parse regex sanitization
    - Restricted transformations
    - Explicit local symbol dictionary (no arbitrary Python globals)
    """
    sanitize_and_validate_expression_string(expr_str)
    
    # Check for huge exponents e.g. **1000000 to prevent DoS
    if "**" in expr_str:
        powers = re.findall(r"\*\*\s*(\d+)", expr_str)
        for p in powers:
            if int(p) > 20:
                raise MathSecurityException("Exponent too large (max allowed exponent is 20).")

    # Build explicit symbol mapping
    local_dict: Dict[str, Any] = {s: sp.Symbol(s) for s in allowed_symbols}
    local_dict.update(SAFE_FUNCTIONS)
    
    transformations = standard_transformations + (implicit_multiplication_application,)
    
    try:
        expr = parse_expr(
            expr_str,
            local_dict=local_dict,
            transformations=transformations,
            evaluate=True,
        )
    except Exception as e:
        raise MathSecurityException(f"Failed to safely parse mathematical expression: {str(e)}")

    # Verify that no unknown symbols or functions were generated
    for free_sym in expr.free_symbols:
        if free_sym.name not in allowed_symbols and free_sym.name not in SAFE_FUNCTIONS:
            raise MathSecurityException(f"Unauthorized symbol '{free_sym.name}' in expression.")

    return expr

def evaluate_parametric_variants(
    template_expr_str: str,
    parameters: List[Dict[str, Any]],
    variant_count: int = 5,
) -> List[Dict[str, Any]]:
    """
    Generates deterministic, verified variants for a parametric STEM question.
    """
    if variant_count < 1 or variant_count > 50:
        raise ValueError("variant_count must be between 1 and 50.")
    
    param_names = [p["symbol"] for p in parameters]
    parsed_expr = safe_parse_math(template_expr_str, param_names)
    
    variants = []
    for i in range(variant_count):
        assignments: Dict[str, float] = {}
        for p in parameters:
            min_val = p["min_val"]
            max_val = p["max_val"]
            step = p.get("step", 1.0)
            if step <= 0:
                raise ValueError(f"Step must be > 0 for parameter {p['symbol']}.")
            if min_val > max_val:
                raise ValueError(f"min_val cannot exceed max_val for parameter {p['symbol']}.")
            
            # Deterministic stepping across variant index
            steps_available = max(1, int((max_val - min_val) / step))
            step_idx = i % (steps_available + 1)
            val = round(min_val + step_idx * step, 4)
            assignments[p["symbol"]] = val
        
        # Substitute into sympy expression
        subbed = parsed_expr.subs([(sp.Symbol(k), v) for k, v in assignments.items()])
        
        # Check for division by zero or NaN / infinity
        if subbed.is_infinite or subbed.has(sp.nan) or sp.zoo in subbed.atoms():
            raise MathSecurityException("Division by zero or undefined mathematical result in variant.")
        
        try:
            evaluated_val = float(subbed.evalf())
            formatted_ans = f"{evaluated_val:.4f}".rstrip("0").rstrip(".")
        except Exception:
            formatted_ans = str(subbed)
            
        variants.append({
            "variant_id": f"v-{i + 1:02d}",
            "variable_assignments": assignments,
            "evaluated_answer": formatted_ans,
            "latex_rendered": sp.latex(subbed),
            "is_valid": True,
        })
        
    return variants
