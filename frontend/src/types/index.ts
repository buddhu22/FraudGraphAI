// ─────────────────────────────────────────────
//  Core domain types for FraudGraph AI
// ─────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Transaction {
  id: string;
  riskScore: number;          // 0–1
  riskLevel: RiskLevel;
  prediction: 'licit' | 'illicit' | 'unknown';
  confidence: number;         // 0–1
  timestamp: string;
  features: number[];
  modelVersion: string;
}

export interface TransactionNode {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  prediction: 'licit' | 'illicit' | 'unknown';
  confidence: number;
  isTarget?: boolean;
  x?: number;
  y?: number;
}

export interface TransactionEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  suspicious?: boolean;
}

export interface GraphData {
  nodes: TransactionNode[];
  edges: TransactionEdge[];
}

export interface NeighborTransaction {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  relation: 'direct' | '2-hop' | '3-hop';
  prediction: 'licit' | 'illicit' | 'unknown';
  confidence: number;
}

export interface InvestigationResult {
  transaction: Transaction;
  graph: GraphData;
  neighbors: NeighborTransaction[];
  aiReport: AIReport;
  modelInsights: ModelInsights;
}

export interface AIReport {
  summary: string;
  reasons: ReportReason[];
  generatedAt: string;
}

export interface ReportReason {
  order: number;
  title: string;
  description: string;
}

export interface ModelInsights {
  illicitProbability: number;
  licitProbability: number;
  highRiskNeighbors: number;
  totalNeighbors: number;
  graphConnectivity: 'low' | 'medium' | 'high';
  oneHopRisk: number;
  twoHopRisk: number;
  modelConfidence: number;
}

export interface AnalyticsData {
  licitCount: number;
  illicitCount: number;
  unknownCount: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  riskScoreHistogram: { bin: string; count: number }[];
  highRiskTimeline: { date: string; count: number }[];
  degreeDistribution: { degree: number; count: number }[];
  modelPerformance: {
    precision: number;
    recall: number;
    f1: number;
    rocAuc: number;
    prAuc: number;
  };
}

export interface ModelInfo {
  name: string;
  version: string;
  inputFeatures: number;
  hiddenDimension: number;
  outputClasses: number;
  framework: string;
  trainedOn: string;
  parameters: number;
  performance: {
    precision: number;
    recall: number;
    f1: number;
    rocAuc: number;
    prAuc: number;
  };
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}
