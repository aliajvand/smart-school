from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class ParameterSpecSchema(BaseModel):
    id: str
    symbol: str
    label: str
    min_val: float
    max_val: float
    step: float = 1.0
    unit: Optional[str] = None

class QuestionValidationRequest(BaseModel):
    expression: str = Field(..., max_length=150, description="Mathematical expression using safe subset")
    parameters: List[ParameterSpecSchema]

class QuestionValidationResponse(BaseModel):
    is_valid: bool
    simplified_latex: str
    detected_symbols: List[str]
    errors: List[str] = []

class GenerateVariantsRequest(BaseModel):
    template_expression: str = Field(..., max_length=150)
    parameters: List[ParameterSpecSchema]
    variant_count: int = Field(default=5, ge=1, le=50)

class VariantItemSchema(BaseModel):
    variant_id: str
    variable_assignments: Dict[str, float]
    evaluated_answer: str
    latex_rendered: str
    is_valid: bool

class GenerateVariantsResponse(BaseModel):
    variants: List[VariantItemSchema]
    count: int
    difficulty_parity_verified: bool = True
