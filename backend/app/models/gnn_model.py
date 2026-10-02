import torch
import torch.nn as nn
import torch.nn.functional as F

try:
    from torch_geometric.nn import GCNConv
    USE_PYG = True
except ImportError:
    USE_PYG = False

    class GCNConv(nn.Module):
        """
        Pure PyTorch GCNConv layer fallback when torch_geometric is unavailable.
        Computes standard graph convolution aggregation: D^{-1/2} A D^{-1/2} X W
        """
        def __init__(self, in_channels: int, out_channels: int):
            super().__init__()
            self.linear = nn.Linear(in_channels, out_channels, bias=True)

        def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
            num_nodes = x.size(0)
            if edge_index.numel() == 0 or num_nodes == 0:
                return self.linear(x)
            
            # Extract row, col indices
            row, col = edge_index[0], edge_index[1]
            
            # Degree computation with self-loops
            deg = torch.bincount(row, minlength=num_nodes).float() + 1.0
            deg_inv_sqrt = deg.pow(-0.5)
            
            edge_weight = deg_inv_sqrt[row] * deg_inv_sqrt[col]
            
            # Aggregate neighbors
            out = torch.zeros(num_nodes, x.size(1), device=x.device, dtype=x.dtype)
            out.index_add_(0, row, x[col] * edge_weight.unsqueeze(-1))
            
            # Self loop contribution
            out = out + x * (deg_inv_sqrt * deg_inv_sqrt).unsqueeze(-1)
            
            return self.linear(out)


class GCN(nn.Module):
    """
    2-Layer Graph Convolutional Network (GCN) matching Colab trained model:
    Input (166 features) -> GCNConv(166, 64) -> ReLU -> GCNConv(64, 2)
    Output: 2 classes (0 = Licit, 1 = Illicit)
    """
    def __init__(self, input_dim: int = 166, hidden_dim: int = 64, output_dim: int = 2):
        super().__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim
        
        self.conv1 = GCNConv(input_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, output_dim)

    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.conv2(x, edge_index)
        return x
