import type { RiskLevel } from '../types';

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return '#22c55e';
    case 'medium':
      return '#f59e0b';
    case 'high':
      return '#ef4444';
    case 'critical':
      return '#dc2626';
    default:
      return '#6b7280';
  }
}

export function getRiskBg(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'rgba(34, 197, 94, 0.12)';
    case 'medium':
      return 'rgba(245, 158, 11, 0.12)';
    case 'high':
      return 'rgba(239, 68, 68, 0.12)';
    case 'critical':
      return 'rgba(220, 38, 38, 0.15)';
    default:
      return 'rgba(107, 114, 128, 0.12)';
  }
}

export function getRiskTextClass(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'text-green-400';
    case 'medium':
      return 'text-amber-400';
    case 'high':
      return 'text-red-400';
    case 'critical':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
}

export function getRiskBorderClass(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'border-green-500/30';
    case 'medium':
      return 'border-amber-500/30';
    case 'high':
      return 'border-red-500/30';
    case 'critical':
      return 'border-red-600/50';
    default:
      return 'border-gray-700/50';
  }
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 0.85) return 'critical';
  if (score >= 0.65) return 'high';
  if (score >= 0.35) return 'medium';
  return 'low';
}

export function truncateId(id: string, start = 8, end = 6): string {
  if (id.length <= start + end + 3) return id;
  return `${id.slice(0, start)}...${id.slice(-end)}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
