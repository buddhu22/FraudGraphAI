import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "FraudGraph AI Backend"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    MODEL_PATH: str = os.getenv("MODEL_PATH", str(BASE_DIR / "artifacts" / "gcn_model.pth"))
    SCALER_PATH: str = os.getenv("SCALER_PATH", str(BASE_DIR / "artifacts" / "scaler.pkl"))
    NODE_MAPPING_PATH: str = os.getenv("NODE_MAPPING_PATH", str(BASE_DIR / "artifacts" / "node_mapping.pkl"))
    
    FEATURES_PATH: str = os.getenv("FEATURES_PATH", str(BASE_DIR / "data" / "processed" / "features.csv"))
    EDGES_PATH: str = os.getenv("EDGES_PATH", str(BASE_DIR / "data" / "processed" / "edges.csv"))
    CLASSES_PATH: str = os.getenv("CLASSES_PATH", str(BASE_DIR / "data" / "processed" / "classes.csv"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
