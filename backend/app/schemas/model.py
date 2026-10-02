from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class PerformanceMetrics(BaseModel):
    precision: float
    recall: float
    f1: float
    rocAuc: float
    prAuc: float

class ModelInfoResponse(BaseModel):
    name: str = "GCN"
    version: str = "1.0"
    framework: str = "PyTorch Geometric"
    input_features: int = 166
    hidden_dimensions: int = 64
    output_classes: int = 2
    classes: List[str] = ["Licit", "Illicit"]
    
    precision: Optional[float] = 0.942
    recall: Optional[float] = 0.895
    f1: Optional[float] = 0.918
    roc_auc: Optional[float] = 0.965
    pr_auc: Optional[float] = 0.924

    # CamelCase compatibility fields for React frontend
    inputFeatures: Optional[int] = 166
    hiddenDimension: Optional[int] = 64
    outputClasses: Optional[int] = 2
    trainedOn: Optional[str] = "Elliptic Bitcoin Dataset"
    parameters: Optional[int] = 14914
    performance: Optional[PerformanceMetrics] = None

class HealthResponse(BaseModel):
    status: str = "healthy"
    model_loaded: bool = True
    graph_loaded: bool = True
