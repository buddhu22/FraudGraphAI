from typing import Literal

RiskLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

def get_risk_level(score: float) -> RiskLevel:
    """
    Centralized risk classification threshold logic:
    0.00 - 0.29 → LOW
    0.30 - 0.59 → MEDIUM
    0.60 - 0.79 → HIGH
    0.80 - 1.00 → CRITICAL
    """
    if score < 0.30:
        return "LOW"
    elif score < 0.60:
        return "MEDIUM"
    elif score < 0.80:
        return "HIGH"
    else:
        return "CRITICAL"

def get_prediction_class(illicit_prob: float) -> str:
    """
    Maps illicit probability to prediction label: 'illicit' vs 'licit'
    """
    return "illicit" if illicit_prob >= 0.5 else "licit"
