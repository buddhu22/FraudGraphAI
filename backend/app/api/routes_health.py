from fastapi import APIRouter, Depends
from app.schemas.model import HealthResponse
from app.services.inference_service import InferenceService
from app.core.dependencies import get_inference_service

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse, summary="System Health Check")
def get_health(inference_service: InferenceService = Depends(get_inference_service)):
    """
    Returns system status, GNN model load status, and graph initialization status.
    """
    return HealthResponse(
        status="healthy",
        model_loaded=inference_service.is_loaded and (inference_service.model is not None),
        graph_loaded=inference_service.is_loaded and (len(inference_service.node_mapping) > 0 or len(inference_service.graph) > 0)
    )
