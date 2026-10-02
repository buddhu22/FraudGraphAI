import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { NeighborTransaction } from '../../types';
import { getRiskColor, getRiskTextClass, formatPercent, truncateId } from '../../utils/risk';
import RiskBadge from '../ui/RiskBadge';
import Card from '../ui/Card';

interface NeighborsTableProps {
  neighbors: NeighborTransaction[];
  onSelectNode?: (id: string) => void;
}

const NeighborsTable: React.FC<NeighborsTableProps> = ({ neighbors, onSelectNode }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = [...neighbors].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <Card glow="red" delay={0.25} className="p-5">
      <h3 className="text-sm font-semibold text-white mb-3">Suspicious Neighbors</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              {['Transaction', 'Risk', 'Confidence', 'Relation', 'Status'].map((h) => (
                <th key={h} className="text-left py-2 pr-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((n, i) => (
              <motion.tr
                key={n.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.2 }}
                className={`border-b border-white/[0.04] cursor-pointer transition-colors ${
                  hovered === n.id ? 'bg-white/[0.04]' : ''
                }`}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectNode?.(n.id)}
              >
                <td className="py-2.5 pr-4 font-mono text-white/80">{truncateId(n.id, 6, 4)}</td>
                <td className="py-2.5 pr-4">
                  <span className={`font-mono font-bold ${getRiskTextClass(n.riskLevel)}`}>
                    {formatPercent(n.riskScore)}
                  </span>
                </td>
                <td className="py-2.5 pr-4 font-mono text-gray-400">{formatPercent(n.confidence)}</td>
                <td className="py-2.5 pr-4">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      color: n.relation === 'direct' ? '#06b6d4' : n.relation === '2-hop' ? '#f59e0b' : '#9ca3af',
                      background: n.relation === 'direct' ? '#06b6d415' : n.relation === '2-hop' ? '#f59e0b15' : '#9ca3af10',
                    }}
                  >
                    {n.relation}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <RiskBadge level={n.riskLevel} />
                </td>
                <td className="py-2.5 text-gray-600 hover:text-cyan-400 transition-colors">
                  <ExternalLink size={12} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default NeighborsTable;
