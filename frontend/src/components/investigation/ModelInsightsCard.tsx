import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import type { ModelInsights } from '../../types';

interface ModelInsightsCardProps {
  insights: ModelInsights;
}

interface BarRowProps {
  label: string;
  value: number;  // 0–1
  color: string;
  suffix?: string;
  displayValue?: string;
}

const BarRow: React.FC<BarRowProps> = ({ label, value, color, suffix = '%', displayValue }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-gray-400 w-36 shrink-0">{label}</span>
    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
    <span className="text-xs font-mono font-semibold text-white w-14 text-right shrink-0">
      {displayValue ?? `${Math.round(value * 100)}${suffix}`}
    </span>
  </div>
);

const ModelInsightsCard: React.FC<ModelInsightsCardProps> = ({ insights }) => {
  const connectivityPct =
    insights.graphConnectivity === 'high' ? 0.9 : insights.graphConnectivity === 'medium' ? 0.55 : 0.2;

  return (
    <Card glow="cyan" delay={0.3} className="p-5">
      <h3 className="text-sm font-semibold text-white mb-4">GNN Model Insights</h3>

      <div className="space-y-3">
        <BarRow label="Illicit probability" value={insights.illicitProbability} color="#ef4444" />
        <BarRow label="Licit probability" value={insights.licitProbability} color="#22c55e" />
        <BarRow
          label="High-risk neighbors"
          value={insights.highRiskNeighbors / insights.totalNeighbors}
          color="#f59e0b"
          suffix=""
          displayValue={`${insights.highRiskNeighbors} / ${insights.totalNeighbors}`}
        />
        <BarRow label="1-hop risk" value={insights.oneHopRisk} color="#fb923c" />
        <BarRow label="2-hop risk" value={insights.twoHopRisk} color="#f59e0b" />
        <BarRow label="Graph connectivity" value={connectivityPct} color="#a855f7" displayValue={insights.graphConnectivity.toUpperCase()} />
        <BarRow label="Model confidence" value={insights.modelConfidence} color="#06b6d4" />
      </div>
    </Card>
  );
};

export default ModelInsightsCard;
