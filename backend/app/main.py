import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api import api_router
from app.services.inference_service import InferenceService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("fraudgraph.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup & shutdown event handler.
    Pre-loads models, scalers, and dataset indexes into memory ONCE during startup.
    """
    logger.info("Initializing FraudGraph AI FastAPI Backend...")
    try:
        service = InferenceService.get_instance()
        service.load_artifacts_and_data()
        logger.info("GNN Model, Scaler, and Graph Index loaded successfully.")
    except Exception as e:
        logger.error(f"Error initializing GNN artifacts on startup: {e}", exc_info=True)
    
    yield
    
    logger.info("Shutting down FraudGraph AI FastAPI Backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI Backend for FraudGraph AI - Graph Neural Network Bitcoin Financial Crime Investigation Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS Middleware
configured_origins = [url.strip() for url in settings.FRONTEND_URL.split(",") if url.strip()]
origins = list(set(configured_origins + [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in configured_origins else origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler preventing python stack traces from exposing to frontend.
    """
    logger.error(f"Unhandled server exception on path {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error during GNN processing."}
    )

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
