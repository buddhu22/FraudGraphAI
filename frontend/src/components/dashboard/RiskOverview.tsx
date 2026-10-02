import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import type { AnalyticsData } from '../../types';

interface RiskOverviewProps {
  data: AnalyticsData;
}

const DONUT_COLORS = ['#22c55e', '#ef4444', '#6b7280'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm">
        <span className="font-semibold text-white">{payload[0].name}: </span>
        <span className="text-gray-300 font-mono">{payload[0].value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
};

const RiskOverview: React.FC<RiskOverviewProps> = ({ data }) => {
  const donutData = [
    { name: 'Licit', value: data.licitCount },
    { name: 'Illicit', value: data.illicitCount },
    { name: 'Unknown', value: data.unknownCount },
  ];

  const total = donutData.reduce((acc, d) => acc + d.value, 0);

  const distBars = [
    { label: 'Low Risk', value: data.riskDistribution.low, color: '#22c55e', pct: data.riskDistribution.low / total },
    { label: 'Medium Risk', value: data.riskDistribution.medium, color: '#f59e0b', pct: data.riskDistribution.medium / total },
    { label: 'High Risk', value: data.riskDistribution.high, color: '#ef4444', pct: data.riskDistribution.high / total },
    { label: 'Critical', value: data.riskDistribution.critical, color: '#dc2626', pct: data.riskDistribution.critical / total },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Donut */}
      <Card glow="cyan" delay={0.1} className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Transaction Classification</h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={donutData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationBegin={200}
                animationDuration={1000}
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-3">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                <div>
                  <div className="text-xs text-gray-400">{d.name}</div>
                  <div className="text-sm font-semibold text-white font-mono">{d.value.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-600">{((d.value / total) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Risk distribution bars */}
      <Card glow="red" delay={0.15} className="p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Risk Distribution</h3>
        <div className="flex flex-col gap-3">
          {distBars.map((bar, i) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{bar.label}</span>
                <span className="text-xs font-mono text-white">{bar.value.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: bar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.pct * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mini bar chart for timeline */}
        <div className="mt-5">
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">High-risk trend</div>
          <ResponsiveContainer width="100%" height={60}>
            <BarChart data={data.highRiskTimeline} barSize={6}>
              <Bar dataKey="count" fill="#ef444460" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default RiskOverview;
