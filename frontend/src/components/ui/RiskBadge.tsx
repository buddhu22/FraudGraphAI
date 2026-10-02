import React from 'react';
import type { RiskLevel } from '../../types';
import { getRiskColor, getRiskTextClass } from '../../utils/risk';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const labelMap: Record<RiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical',
};

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, className = '' }) => {
  const color = getRiskColor(level);
  const textClass = getRiskTextClass(level);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${textClass} ${className}`}
      style={{ borderColor: `${color}40`, background: `${color}14` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {labelMap[level]}
      {score !== undefined && (
        <span className="font-mono opacity-80">{Math.round(score * 100)}%</span>
      )}
    </span>
  );
};

export default RiskBadge;
