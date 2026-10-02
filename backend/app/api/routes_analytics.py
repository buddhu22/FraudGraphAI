from fastapi import APIRouter, Depends
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import AnalyticsService
from app.core.dependencies import get_analytics_service

router = APIRouter(tags=["Analytics"])

@router.get("/analytics", response_model=AnalyticsResponse, summary="Get GNN & Network Analytics")
def get_analytics(analytics_service: AnalyticsService = Depends(get_analytics_service)):
    """
    Returns high-level graph network statistics, risk class distributions,
    and GNN model performance metrics.
    """
    return analytics_service.get_analytics()
