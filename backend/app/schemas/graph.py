from pydantic import BaseModel
from typing import List, Optional

class GraphNode(BaseModel):
    id: str
    label: str
    risk_score: float
    prediction: str
    is_target: bool
    risk_level: Optional[str] = None
    confidence: Optional[float] = None

class GraphEdge(BaseModel):
    source: str
    target: str
    weight: Optional[float] = 1.0
    suspicious: Optional[bool] = False

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
