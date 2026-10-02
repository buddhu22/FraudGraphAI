import type { Transaction, NeighborTransaction, InvestigationResult, AIReport, ModelInsights } from '../types';

export const EXAMPLE_TRANSACTION_IDS = [
  'tx_7a8f2c1e9b3d5f04',
  'tx_3b6e1d9a4c7f2e05',
  'tx_9c4f7b2e6d1a8c03',
  'tx_1e5a9d3c8f4b6e07',
  'tx_5f2d8b6a1c9e3d08',
];

function generateNeighbors(targetRisk: number): NeighborTransaction[] {
  const ids = [
    'tx_a1b2c3d4e5f6',
    'tx_f9e8d7c6b5a4',
    'tx_1234abcd5678',
    'tx_abcd1234efgh',
    'tx_xyz9876mnop',
    'tx_qrst4567uvwx',
  ];

  return ids.map((id, i) => {
    const riskScore = i < 2 ? 0.85 + Math.random() * 0.12 : i < 4 ? 0.55 + Math.random() * 0.2 : Math.random() * 0.35;
    const riskLevel = riskScore > 0.85 ? 'critical' : riskScore > 0.65 ? 'high' : riskScore > 0.35 ? 'medium' : 'low';
    return {
      id,
      riskScore: parseFloat(riskScore.toFixed(2)),
      riskLevel,
      relation: i < 3 ? 'direct' : i < 5 ? '2-hop' : '3-hop',
      prediction: riskScore > 0.5 ? 'illicit' : 'licit',
      confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2)),
    } as NeighborTransaction;
  });
}

function generateAIReport(riskScore: number): AIReport {
  return {
    summary:
      riskScore > 0.7
        ? 'This transaction exhibits a high-risk pattern based on its graph neighborhood and learned transaction features. Multiple connected nodes with elevated fraud probabilities were detected.'
        : riskScore > 0.4
        ? 'This transaction shows moderate risk indicators. Some connected nodes have elevated probabilities, warranting careful review.'
        : 'This transaction appears to be within normal operational parameters with low-risk graph neighbors.',
    reasons: [
      {
        order: 1,
        title: 'High-risk neighborhood',
        description:
          'Multiple connected transactions have elevated fraud probabilities, creating a dense cluster of suspicious activity in the graph.',
      },
      {
        order: 2,
        title: 'Suspicious connectivity',
        description:
          'The target transaction is closely connected to previously flagged illicit transactions through direct and 2-hop relationships.',
      },
      {
        order: 3,
        title: 'Model confidence',
        description: `The GCN model assigns a ${Math.round(riskScore * 100)}% illicit probability with high confidence based on aggregated neighborhood features.`,
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

function generateModelInsights(riskScore: number): ModelInsights {
  return {
    illicitProbability: riskScore,
    licitProbability: 1 - riskScore,
    highRiskNeighbors: Math.floor(riskScore * 18),
    totalNeighbors: 22,
    graphConnectivity: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
    oneHopRisk: parseFloat((riskScore * 0.95).toFixed(2)),
    twoHopRisk: parseFloat((riskScore * 0.72).toFixed(2)),
    modelConfidence: parseFloat((0.88 + Math.random() * 0.1).toFixed(2)),
  };
}

export function getMockInvestigation(txId: string): InvestigationResult {
  // Deterministic risk based on ID hash
  const hash = txId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const riskScore = parseFloat(((hash % 80) / 100 + 0.1).toFixed(2));
  const riskLevel = riskScore > 0.85 ? 'critical' : riskScore > 0.65 ? 'high' : riskScore > 0.35 ? 'medium' : 'low';

  const transaction: Transaction = {
    id: txId,
    riskScore,
    riskLevel,
    prediction: riskScore > 0.5 ? 'illicit' : 'licit',
    confidence: parseFloat((0.82 + Math.random() * 0.15).toFixed(2)),
    timestamp: new Date().toISOString(),
    features: Array.from({ length: 166 }, () => Math.random()),
    modelVersion: 'GCN v1.0',
  };

  const neighbors = generateNeighbors(riskScore);

  // Build graph
  const graphNodes: import('../types').TransactionNode[] = [
    { id: txId, riskScore, riskLevel, prediction: transaction.prediction, confidence: transaction.confidence, isTarget: true },
    ...neighbors.slice(0, 5).map((n) => ({
      id: n.id,
      riskScore: n.riskScore,
      riskLevel: n.riskLevel,
      prediction: n.prediction,
      confidence: n.confidence,
    })),
    // Extra peripheral nodes
    { id: 'tx_ghost_01', riskScore: 0.12, riskLevel: 'low' as const, prediction: 'licit' as const, confidence: 0.91 },
    { id: 'tx_ghost_02', riskScore: 0.78, riskLevel: 'high' as const, prediction: 'illicit' as const, confidence: 0.85 },
    { id: 'tx_ghost_03', riskScore: 0.04, riskLevel: 'low' as const, prediction: 'licit' as const, confidence: 0.97 },
  ];

  const edges = [
    { id: 'e0-1', source: neighbors[0].id, target: txId },
    { id: 'e0-2', source: neighbors[1].id, target: txId },
    { id: 'e0-3', source: txId, target: neighbors[2].id },
    { id: 'e0-4', source: txId, target: neighbors[3].id },
    { id: 'e0-5', source: txId, target: neighbors[4].id },
    { id: 'e0-6', source: neighbors[1].id, target: 'tx_ghost_01' },
    { id: 'e0-7', source: neighbors[2].id, target: 'tx_ghost_02' },
    { id: 'e0-8', source: neighbors[4].id, target: 'tx_ghost_03' },
    { id: 'e0-9', source: 'tx_ghost_01', target: neighbors[0].id },
  ].map((e) => ({ ...e, suspicious: false }));

  return {
    transaction,
    graph: { nodes: graphNodes, edges },
    neighbors,
    aiReport: generateAIReport(riskScore),
    modelInsights: generateModelInsights(riskScore),
  };
}
