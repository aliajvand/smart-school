from typing import List, Optional, Tuple, Dict, Any

def compute_ewma_baseline(scores: List[Optional[float]], alpha: float = 0.3) -> Optional[float]:
    """
    Computes Exponentially Weighted Moving Average (EWMA) for personal baseline.
    CRITICAL RULE: Missing values (None) are treated as data gaps, NEVER as zero!
    """
    valid_scores = [s for s in scores if s is not None and isinstance(s, (int, float))]
    if not valid_scores:
        return None
    
    ewma = valid_scores[0]
    for s in valid_scores[1:]:
        ewma = alpha * s + (1 - alpha) * ewma
    return round(ewma, 2)

def assess_student_risk(
    historical_scores: List[Optional[float]],
    recent_trend_delta: float,
    unexcused_absences: int,
    assignment_delays: int,
) -> Tuple[str, float, List[str]]:
    """
    Assesses early warning system level: 'none' | 'watch' | 'urgent'.
    Returns (risk_level, risk_score_0_to_100, dominant_factors).
    """
    baseline = compute_ewma_baseline(historical_scores)
    factors = []
    score = 20.0  # Base line risk
    
    if baseline is not None and baseline < 12.0:
        score += 30.0
        factors.append("میانگین خط پایه پایین‌تر از حد نصاب (زیر ۱۲)")
        
    if recent_trend_delta < -2.0:
        score += 25.0
        factors.append(f"افت شدید نمرات اخیر ({recent_trend_delta:+.1f} نمره نسبت به خط مبنا)")
    elif recent_trend_delta < -0.8:
        score += 12.0
        factors.append("شیب نزولی ملایم در تکالیف هفتگی")
        
    if unexcused_absences >= 3:
        score += 25.0
        factors.append(f"{unexcused_absences} جلسه غیبت متوالی در جلسات درسی")
    elif unexcused_absences >= 1:
        score += 10.0
        factors.append("غیبت در جلسه آزمون تکوینی")
        
    if assignment_delays >= 2:
        score += 15.0
        factors.append(f"تاخیر در ارسال {assignment_delays} تکلیف متوالی")
        
    clamped_score = min(100.0, max(0.0, score))
    
    if clamped_score >= 75.0:
        level = "urgent"
    elif clamped_score >= 50.0:
        level = "watch"
    else:
        level = "none"
        
    return level, clamped_score, factors

def normalize_shap_attributions(raw_shares: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Normalizes feature importance to sum to 100% and tags with non-causal statistical labels.
    """
    total = sum(raw_shares.values())
    if total <= 0:
        total = 1.0
    
    results = []
    for k, v in raw_shares.items():
        norm_pct = round((v / total) * 100.0, 1)
        results.append({
            "feature_key": k,
            "share_percent": norm_pct,
            "disclaimer": "همبستگی آماری مدل — نه لزوماً علت بالینی یا فردی",
        })
    return results
