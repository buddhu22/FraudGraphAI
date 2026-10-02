from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Dict, Any, List

from app.schemas.transaction import (
    TransactionResponse,
    TransactionDetailResponse,
    NeighborsResponse,
    PredictRequest,
)
from app.schemas.graph import GraphResponse
from app.services.inference_service import InferenceService
from app.services.graph_service import GraphService
from app.core.dependencies import get_inference_service, get_graph_service

router = APIRouter(prefix="/transaction", tags=["Transactions"])

@router.get("/{transaction_id}", response_model=TransactionResponse, summary="Analyze Transaction & Get GNN Prediction")
def get_transaction(
    transaction_id: str,
    inference_service: InferenceService = Depends(get_inference_service)
):
    """
    Primary endpoint for Bitcoin transaction analysis.
    Executes GNN inference, computes risk score, risk level, and neighborhood metrics.
    """
    if not transaction_id or not transaction_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction ID cannot be empty"
        )

    try:
        res = inference_service.predict_transaction(transaction_id)
        return TransactionResponse(**res)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction '{transaction_id}' not found in database"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}"
        )

@router.get("/{transaction_id}/details", response_model=TransactionDetailResponse, summary="Get Transaction Feature Details")
def get_transaction_details(
    transaction_id: str,
    inference_service: InferenceService = Depends(get_inference_service)
):
    """
    Returns transaction features and GNN prediction details without raw internal system overhead.
    """
    try:
        pred_res = inference_service.predict_transaction(transaction_id)
        features = inference_service.get_transaction_features(transaction_id)
        
        return TransactionDetailResponse(
            transaction_id=transaction_id,
            prediction=pred_res["prediction"],
            risk_score=pred_res["risk_score"],
            confidence=pred_res["confidence"],
            risk_level=pred_res["risk_level"],
            neighbor_count=pred_res["neighbor_count"],
            features=features
        )
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

@router.get("/{transaction_id}/neighbors", response_model=NeighborsResponse, summary="Get Local Neighborhood Transactions")
def get_transaction_neighbors(
    transaction_id: str,
    inference_service: InferenceService = Depends(get_inference_service)
):
    """
    Returns direct and multi-hop graph neighbors sorted by risk score descending.
    """
    try:
        # Validate existence
        inference_service.predict_transaction(transaction_id)
        neighbors = inference_service.get_neighbors(transaction_id)
        return NeighborsResponse(
            transaction_id=transaction_id,
            neighbors=neighbors
        )
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

@router.get("/{transaction_id}/graph", response_model=GraphResponse, summary="Get React Flow Subgraph")
def get_transaction_graph(
    transaction_id: str,
    depth: int = Query(default=1, ge=1, le=2, description="Graph expansion depth (1 or 2 hops)"),
    graph_service: GraphService = Depends(get_graph_service)
):
    """
    Returns graph nodes and edges centered around target transaction up to `depth` hops,
    formatted specifically for React Flow rendering.
    """
    try:
        return graph_service.get_transaction_graph(tx_id=transaction_id, depth=depth)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

# Separate top-level router for POST /api/predict compatibility
predict_router = APIRouter(tags=["Transactions"])

@predict_router.post("/predict", response_model=TransactionResponse, summary="Predict Transaction Risk")
def predict_transaction_post(
    req: PredictRequest,
    inference_service: InferenceService = Depends(get_inference_service)
):
    """
    POST interface for GNN prediction request.
    """
    try:
        res = inference_service.predict_transaction(req.transaction_id)
        return TransactionResponse(**res)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction '{req.transaction_id}' not found"
        )
