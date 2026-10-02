from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class RiskDistribution(BaseModel):
    low: int
    medium: int
    high: int
    critical: int

class ModelPerformance(BaseModel):
    precision: float
    recall: float
    f1: float
    rocAuc: float
    prAuc: float

class HistogramBin(BaseModel):
    bin: str
    count: int

class TimelineItem(BaseModel):
    date: str
    count: int

class DegreeItem(BaseModel):
    degree: int
    count: int

class AnalyticsResponse(BaseModel):
    total_transactions: int
    total_edges: int
    licit_transactions: int
    illicit_transactions: int
    unknown_transactions: int
    model: str = "GCN"
    model_version: str = "1.0"
    
    # Extra compatibility fields for React frontend
    licitCount: Optional[int] = None
    illicitCount: Optional[int] = None
    unknownCount: Optional[int] = None
    riskDistribution: Optional[RiskDistribution] = None
    riskScoreHistogram: Optional[List[HistogramBin]] = []
    highRiskTimeline: Optional[List[TimelineItem]] = []
    degreeDistribution: Optional[List[DegreeItem]] = []
    modelPerformance: Optional[ModelPerformance] = None
