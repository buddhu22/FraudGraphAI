# FraudGraph AI — FastAPI GNN Backend

FastAPI backend server for **FraudGraph AI**, an AI-powered Bitcoin transaction investigation platform using a 2-Layer Graph Convolutional Network (GCN) trained on the Elliptic Bitcoin dataset.

---

## 🏗️ Architecture Overview

```text
backend/
├── app/
│   ├── main.py                   # FastAPI Application Entry & Lifespan Preloader
│   ├── api/                      # Modular API Route Handlers
│   │   ├── routes_health.py      # Health & Status Endpoint
│   │   ├── routes_transactions.py# GNN Transaction Inference & Neighborhood
│   │   ├── routes_analytics.py   # Dataset & GNN Metrics
│   │   └── routes_model.py       # GCN Architecture & Evaluation Specs
│   ├── core/
│   │   ├── config.py             # Environment & Path Settings
│   │   └── dependencies.py       # FastAPI Dependency Injectors
│   ├── models/
│   │   └── gnn_model.py          # PyTorch / PyG 2-Layer GCN (166->64->2)
│   ├── services/
│   │   ├── inference_service.py  # Singleton Model & Graph Index Loader
│   │   ├── graph_service.py      # Subgraph Extraction for React Flow
│   │   └── analytics_service.py  # Aggregated Network Analytics
│   ├── schemas/                  # Pydantic Request & Response Models
│   │   ├── transaction.py
│   │   ├── graph.py
│   │   ├── analytics.py
│   │   └── model.py
│   └── utils/
│       └── preprocessing.py      # Risk Level & Class Mapping
│
├── artifacts/
│   ├── gcn_model.pth             # Trained GCN State Dict
│   ├── scaler.pkl                # StandardScaler (166 features)
│   └── node_mapping.pkl          # Transaction ID to Node Index Map
│
├── data/
│   └── processed/
│       ├── features.csv          # Transaction Features
│       ├── edges.csv             # Directed Transaction Graph Edges
│       └── classes.csv           # Ground Truth Licit/Illicit Labels
│
├── scripts/
│   └── seed_demo_data.py         # Seed Demo Artifacts & Datasets
├── requirements.txt
├── .env.example
└── README.md
```

---

## ⚡ Quick Start

### 1. Setup Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Seed Initial Model Artifacts & Data

```bash
python scripts/seed_demo_data.py
```

### 3. Run FastAPI Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API server will run at:
* **API Server**: `http://localhost:8000`
* **Swagger Documentation**: `http://localhost:8000/docs`
* **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🔗 Key API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & model load status |
| `/api/transaction/{id}` | `GET` | Run GNN inference for target transaction ID |
| `/api/transaction/{id}/details` | `GET` | Retrieve feature vector & risk prediction |
| `/api/transaction/{id}/neighbors` | `GET` | Fetch 1-hop & 2-hop transaction neighbors |
| `/api/transaction/{id}/graph` | `GET` | Sub-graph formatted for React Flow (`depth=1` or `depth=2`) |
| `/api/predict` | `POST` | GNN risk prediction request |
| `/api/analytics` | `GET` | Macro network stats & model performance |
| `/api/model` | `GET` | GCN architecture specs & evaluation metrics |

---

## 🧠 GNN Model Details

* **Input Features**: 166 transaction-level features (elliptic dataset)
* **Architecture**: 
  * `GCNConv(166, 64)` $\rightarrow$ `ReLU` $\rightarrow$ `GCNConv(64, 2)`
* **Risk Score Classification Thresholds**:
  * `0.00 - 0.29` $\rightarrow$ **LOW**
  * `0.30 - 0.59` $\rightarrow$ **MEDIUM**
  * `0.60 - 0.79` $\rightarrow$ **HIGH**
  * `0.80 - 1.00` $\rightarrow$ **CRITICAL**

---

## 🔌 React Frontend Integration

The backend is configured out of the box to communicate with the React frontend running at `http://localhost:5173`. CORS is pre-configured for local development.
