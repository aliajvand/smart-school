from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
import sympy as sp
from app.core.security import require_roles
from app.services.math_engine import (
    safe_parse_math,
    evaluate_parametric_variants,
    MathSecurityException,
)
from app.schemas.studio import (
    QuestionValidationRequest,
    QuestionValidationResponse,
    GenerateVariantsRequest,
    GenerateVariantsResponse,
    VariantItemSchema,
)

router = APIRouter(prefix="/studio/questions", tags=["Parametric Studio"])

@router.post("/validate", response_model=QuestionValidationResponse)
def validate_question(
    req: QuestionValidationRequest,
    current_role: str = Depends(require_roles(["teacher", "principal"])),
):
    """
    Validates a parametric mathematical template against safe subset and symbolic constraints.
    Rejects unsafe python patterns, attribute access, and unknown symbols.
    """
    param_symbols = [p.symbol for p in req.parameters]
    errors: List[str] = []
    
    # Check bounds
    for p in req.parameters:
        if p.min_val > p.max_val:
            errors.append(f"پارامتر {p.symbol}: حداقل ({p.min_val}) نمی‌تواند بزرگتر از حداکثر ({p.max_val}) باشد.")
        if p.step <= 0:
            errors.append(f"پارامتر {p.symbol}: گام تغییرات باید بزرگتر از صفر باشد.")
            
    if errors:
        return QuestionValidationResponse(
            is_valid=False,
            simplified_latex="",
            detected_symbols=param_symbols,
            errors=errors,
        )
        
    try:
        expr = safe_parse_math(req.expression, param_symbols)
        simplified_latex = sp.latex(sp.simplify(expr))
        detected_symbols = [s.name for s in expr.free_symbols]
        return QuestionValidationResponse(
            is_valid=True,
            simplified_latex=simplified_latex,
            detected_symbols=detected_symbols,
            errors=[],
        )
    except MathSecurityException as e:
        return QuestionValidationResponse(
            is_valid=False,
            simplified_latex="",
            detected_symbols=[],
            errors=[str(e)],
        )
    except Exception as e:
        return QuestionValidationResponse(
            is_valid=False,
            simplified_latex="",
            detected_symbols=[],
            errors=[f"خطای محاسباتی: {str(e)}"],
        )

@router.post("/generate-variants", response_model=GenerateVariantsResponse)
def generate_variants(
    req: GenerateVariantsRequest,
    current_role: str = Depends(require_roles(["teacher", "principal"])),
):
    """
    Generates N deterministic, symbolically verified question variants with answer keys.
    """
    param_dicts = [
        {
            "symbol": p.symbol,
            "min_val": p.min_val,
            "max_val": p.max_val,
            "step": p.step,
        }
        for p in req.parameters
    ]
    
    try:
        variants_data = evaluate_parametric_variants(
            template_expr_str=req.template_expression,
            parameters=param_dicts,
            variant_count=req.variant_count,
        )
        items = [VariantItemSchema(**v) for v in variants_data]
        return GenerateVariantsResponse(
            variants=items,
            count=len(items),
            difficulty_parity_verified=True,
        )
    except MathSecurityException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Security violation or invalid math: {str(e)}",
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generation failed: {str(e)}",
        )
