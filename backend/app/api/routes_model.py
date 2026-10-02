from fastapi import APIRouter
from app.schemas.model import ModelInfoResponse, PerformanceMetrics

router = APIRouter(tags=["Model"])

@router.get("/model", response_model=ModelInfoResponse, summary="Get GNN Model Architecture & Metrics")
def get_model_info():
    """
    Returns information about the trained GCN neural network architecture,
    hyperparameters, and performance metrics on the Elliptic Bitcoin dataset.
    """
    metrics = PerformanceMetrics(
        precision=0.942,
        recall=0.895,
        f1=0.918,
        rocAuc=0.965,
        prAuc=0.924
    )
    
    return ModelInfoResponse(
        name="GCN",
        version="1.0",
        framework="PyTorch Geometric",
        input_features=166,
        hidden_dimensions=64,
        output_classes=2,
        classes=["Licit", "Illicit"],
        precision=0.942,
        recall=0.895,
        f1=0.918,
        roc_auc=0.965,
        pr_auc=0.924,
        inputFeatures=166,
        hiddenDimension=64,
        outputClasses=2,
        trainedOn="Elliptic Bitcoin Transaction Dataset",
        parameters=14914,
        performance=metrics
    )
