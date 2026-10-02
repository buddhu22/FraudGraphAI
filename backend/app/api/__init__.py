from fastapi import APIRouter
from app.api.routes_health import router as health_router
from app.api.routes_transactions import router as transactions_router, predict_router
from app.api.routes_analytics import router as analytics_router
from app.api.routes_model import router as model_router

api_router = APIRouter(prefix="/api")

api_router.include_router(health_router)
api_router.include_router(transactions_router)
api_router.include_router(predict_router)
api_router.include_router(analytics_router)
api_router.include_router(model_router)
