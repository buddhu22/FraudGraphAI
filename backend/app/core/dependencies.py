from fastapi import Depends
from app.services.inference_service import InferenceService
from app.services.graph_service import GraphService
from app.services.analytics_service import AnalyticsService

def get_inference_service() -> InferenceService:
    service = InferenceService.get_instance()
    if not service.is_loaded:
        service.load_artifacts_and_data()
    return service

def get_graph_service(
    inference_service: InferenceService = Depends(get_inference_service)
) -> GraphService:
    return GraphService(inference_service)

def get_analytics_service(
    inference_service: InferenceService = Depends(get_inference_service)
) -> AnalyticsService:
    return AnalyticsService(inference_service)
