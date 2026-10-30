from typing import List, Dict, Any, Optional

def compute_jaccard_token_similarity(tokens_a: List[str], tokens_b: List[str]) -> float:
    """
    Computes Jaccard similarity between two mathematical AST token sets.
    """
    if not tokens_a or not tokens_b:
        return 0.0
    set_a, set_b = set(tokens_a), set(tokens_b)
    intersection = set_a.intersection(set_b)
    union = set_a.union(set_b)
    if not union:
        return 0.0
    return round(len(intersection) / len(union), 4)

def classify_integrity_edge(
    similarity: float,
    shares_unusual_error: bool = False,
    shares_adjacent_parameter: bool = False,
) -> Dict[str, Any]:
    """
    Classifies an academic integrity signal edge:
    - solid: high similarity >= 90% or shared unusual error
    - dashed: statistical suspicion 80-89%
    - dotted: parameter correlation < 80%
    CRITICAL RULE: Always includes non-verdict disclaimer.
    """
    if similarity >= 0.90 or shares_unusual_error:
        style = "solid"
        reason = "همپوشانی خطای جبری مشابه یا تشابه بالای ۹۰٪"
    elif similarity >= 0.80:
        style = "dashed"
        reason = "شباهت ساختار حل بدون درج مراحل میانی"
    else:
        style = "dotted"
        reason = "همبستگی پارامتری مشکوک در نسخه آزمون"
        
    return {
        "similarity_score": round(similarity * 100, 1),
        "edge_style": style,
        "reason": reason,
        "is_verdict": False,
        "disclaimer": "صرفاً سیگنال کمکی برای بازبینی دبیر است و حکم تخلف محسوب نمی‌شود.",
    }
