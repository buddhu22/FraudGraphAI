import type { GraphData } from '../types';

// Standalone network graph for the Network Explorer page
export function generateNetworkGraph(centerTxId: string, depth: '1-hop' | '2-hop'): GraphData {
  const licitIds = Array.from({ length: 6 }, (_, i) => `tx_licit_${i.toString().padStart(2, '0')}`);
  const illicitIds = Array.from({ length: 4 }, (_, i) => `tx_illicit_${i.toString().padStart(2, '0')}`);
  const midIds = Array.from({ length: 5 }, (_, i) => `tx_mid_${i.toString().padStart(2, '0')}`);

  const allNodes = [
    {
      id: centerTxId,
      riskScore: 0.92,
      riskLevel: 'critical' as const,
      prediction: 'illicit' as const,
      confidence: 0.94,
      isTarget: true,
    },
    ...licitIds.map((id) => ({
      id,
      riskScore: 0.05 + Math.random() * 0.2,
      riskLevel: 'low' as const,
      prediction: 'licit' as const,
      confidence: 0.9 + Math.random() * 0.09,
    })),
    ...illicitIds.map((id) => ({
      id,
      riskScore: 0.75 + Math.random() * 0.2,
      riskLevel: 'high' as const,
      prediction: 'illicit' as const,
      confidence: 0.8 + Math.random() * 0.15,
    })),
    ...midIds.map((id) => ({
      id,
      riskScore: 0.35 + Math.random() * 0.3,
      riskLevel: 'medium' as const,
      prediction: 'unknown' as const,
      confidence: 0.65 + Math.random() * 0.2,
    })),
  ];

  const edges = [
    ...licitIds.slice(0, 3).map((id, i) => ({ id: `e-l${i}`, source: id, target: centerTxId, suspicious: false })),
    ...illicitIds.map((id, i) => ({ id: `e-il${i}`, source: centerTxId, target: id, suspicious: true })),
    ...midIds.slice(0, 3).map((id, i) => ({ id: `e-m${i}`, source: centerTxId, target: id, suspicious: false })),
    { id: 'e-cross-0', source: licitIds[0], target: midIds[0], suspicious: false },
    { id: 'e-cross-1', source: illicitIds[0], target: midIds[1], suspicious: true },
  ];

  return { nodes: allNodes, edges };
}
