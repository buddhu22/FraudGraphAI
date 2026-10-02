import os
from pathlib import Path
import numpy as np
import pandas as pd
import torch
import joblib
from sklearn.preprocessing import StandardScaler

# Ensure path resolution
BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
DATA_DIR = BASE_DIR / "data" / "processed"

ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Sample transactions including standard Elliptic IDs and frontend mock IDs
DEMO_TX_IDS = [
    "tx-8f92a1d", "230425980", "5530458", "232022460", "tx_7a8f2c1e9b3d5f04",
    "tx-3b19e42", "tx-9c41f80", "tx-1d88a03", "tx-5e72c19", "tx-6a03d11",
    "tx-4f99b12", "tx-8e22c44", "tx-0b33f77", "tx-1a44e88", "tx-7d66a99"
]

def generate_artifacts_and_data():
    print("Generating demo GNN artifacts and transaction database...")

    np.random.seed(42)
    torch.manual_seed(42)

    # 1. Generate node mapping dictionary
    node_mapping = {tx_id: idx for idx, tx_id in enumerate(DEMO_TX_IDS)}
    node_mapping_path = ARTIFACTS_DIR / "node_mapping.pkl"
    joblib.dump(node_mapping, node_mapping_path)
    print(f"[OK] Saved {node_mapping_path}")

    # 2. Generate and fit StandardScaler for 166 features
    scaler = StandardScaler()
    dummy_features = np.random.randn(len(DEMO_TX_IDS), 166)
    scaler.fit(dummy_features)
    scaler_path = ARTIFACTS_DIR / "scaler.pkl"
    joblib.dump(scaler, scaler_path)
    print(f"[OK] Saved {scaler_path}")

    # 3. Create and save PyTorch GCN state dict
    # Re-import GCN architecture
    import sys
    sys.path.append(str(BASE_DIR))
    from app.models.gnn_model import GCN

    gcn_model = GCN(input_dim=166, hidden_dim=64, output_dim=2)
    model_path = ARTIFACTS_DIR / "gcn_model.pth"
    torch.save(gcn_model.state_dict(), model_path)
    print(f"[OK] Saved {model_path}")

    # 4. Generate features.csv (tx_id, time_step, feat_1..feat_165)
    feat_rows = []
    for idx, tx_id in enumerate(DEMO_TX_IDS):
        row = [tx_id, (idx % 49) + 1] + list(dummy_features[idx])
        feat_rows.append(row)
    
    features_df = pd.DataFrame(feat_rows)
    features_csv_path = DATA_DIR / "features.csv"
    features_df.to_csv(features_csv_path, index=False, header=False)
    print(f"[OK] Saved {features_csv_path}")

    # 5. Generate edges.csv (txId1, txId2)
    edges = [
        ("tx-8f92a1d", "tx-3b19e42"),
        ("tx-8f92a1d", "tx-9c41f80"),
        ("tx-8f92a1d", "tx-1d88a03"),
        ("tx-3b19e42", "tx-5e72c19"),
        ("tx-9c41f80", "tx-6a03d11"),
        ("230425980", "5530458"),
        ("230425980", "232022460"),
        ("tx_7a8f2c1e9b3d5f04", "tx-4f99b12"),
        ("tx-4f99b12", "tx-8e22c44"),
    ]
    edges_df = pd.DataFrame(edges, columns=["txId1", "txId2"])
    edges_csv_path = DATA_DIR / "edges.csv"
    edges_df.to_csv(edges_csv_path, index=False)
    print(f"[OK] Saved {edges_csv_path}")

    # 6. Generate classes.csv (tx_id, class)
    classes = []
    for idx, tx_id in enumerate(DEMO_TX_IDS):
        cls = "1" if idx % 3 == 0 else "2"  # 1 = illicit, 2 = licit
        classes.append((tx_id, cls))
    
    classes_df = pd.DataFrame(classes, columns=["tx_id", "class"])
    classes_csv_path = DATA_DIR / "classes.csv"
    classes_df.to_csv(classes_csv_path, index=False)
    print(f"[OK] Saved {classes_csv_path}")

    print("Finished seeding demo artifacts!")

if __name__ == "__main__":
    generate_artifacts_and_data()
