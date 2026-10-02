import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Network,
  AlertTriangle,
  Brain,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import Card from '../ui/Card';
import { useCountUp } from '../../hooks/useCountUp';
import { formatPercent } from '../../utils/risk';

interface KpiData {
  txAnalyzed: number;
  graphConnections: number;
  highRiskDetected: number;
  modelAccuracy: number;
  prAuc: number;
}

const KpiCards: React.FC<{ data: KpiData }> = ({ data }) => {
  const txCount = useCountUp(data.txAnalyzed, 1800);
  const connCount = useCountUp(data.graphConnections, 1800);
  const riskCount = useCountUp(data.highRiskDetected, 1600);
  const accuracy = useCountUp(data.modelAccuracy * 100, 1400, 1);
  const prAuc = useCountUp(data.prAuc * 100, 1400, 1);

  const navigate = useNavigate();

  const cards = [
    {
      icon: <Activity size={18} className="text-cyan-400" />,
      label: 'Transactions Analyzed',
      value: txCount,
      sub: '+1,204 today',
      subColor: 'text-cyan-400',
      glow: 'cyan' as const,
      delay: 0,
    },
    {
      icon: <Network size={18} className="text-purple-400" />,
      label: 'Graph Connections',
      value: connCount,
      sub: 'Mapped edges',
      subColor: 'text-purple-400',
      glow: 'purple' as const,
      delay: 0.05,
    },
    {
      icon: <AlertTriangle size={18} className="text-red-400" />,
      label: 'High Risk Detected',
      value: riskCount,
      sub: '↑ 2.3% this week',
      subColor: 'text-red-400',
      glow: 'red' as const,
      delay: 0.1,
    },
    {
      icon: <Brain size={18} className="text-green-400" />,
      label: 'Model Accuracy',
      value: `${accuracy}%`,
      sub: 'GCN v1.0',
      subColor: 'text-green-400',
      glow: 'green' as const,
      delay: 0.15,
    },
    {
      icon: <TrendingUp size={18} className="text-amber-400" />,
      label: 'PR-AUC',
      value: `${prAuc}%`,
      sub: 'Fraud detection',
      subColor: 'text-amber-400',
      glow: 'amber' as const,
      delay: 0.2,
    },
    {
      icon: <Cpu size={18} className="text-cyan-400" />,
      label: 'Model',
      value: 'GCN v1.0',
      sub: 'PyTorch Geometric',
      subColor: 'text-cyan-400',
      glow: 'cyan' as const,
      delay: 0.25,
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => (
        <Card key={c.label} glow={c.glow} delay={c.delay} className="p-4 cursor-default">
          <div className="flex items-center justify-between mb-3">
            <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              {c.icon}
            </div>
            <span className={`text-[10px] font-semibold ${c.subColor}`}>{c.sub}</span>
          </div>
          <div className={`font-bold mb-0.5 ${c.isText ? 'text-lg text-white' : 'text-2xl text-white font-mono'}`}>
            {c.value}
          </div>
          <div className="text-[11px] text-gray-500">{c.label}</div>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;
