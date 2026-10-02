from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictRequest(BaseModel):
    transaction_id: str = Field(..., description="Bitcoin transaction ID to analyze")

class TransactionResponse(BaseModel):
    transaction_id: str
    prediction: str
    risk_score: float
    confidence: float
    model: str = "GCN"
    model_version: str = "1.0"
    neighbor_count: int
    high_risk_neighbors: int
    risk_level: str

class TransactionDetailResponse(BaseModel):
    transaction_id: str
    prediction: str
    risk_score: float
    confidence: float
    risk_level: str
    neighbor_count: int
    features: List[float] = []

class NeighborItem(BaseModel):
    transaction_id: str
    risk_score: float
    prediction: str
    relation: str
    risk_level: str

class NeighborsResponse(BaseModel):
    transaction_id: str
    neighbors: List[NeighborItem]
