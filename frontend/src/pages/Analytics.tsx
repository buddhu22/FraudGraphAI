import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import PageTransition from '../components/ui/PageTransition';
import Card from '../components/ui/Card';
import { mockAnalytics } from '../mock/analytics';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-xs">
        <div className="font-semibold text-white mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.name ?? p.dataKey}: {p.value?.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono text-white">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const Analytics: React.FC = () => {
  const data = mockAnalytics;

  const classData = [
    { name: 'Licit', value: data.licitCount, fill: '#22c55e' },
    { name: 'Illicit', value: data.illicitCount, fill: '#ef4444' },
    { name: 'Unknown', value: data.unknownCount, fill: '#6b7280' },
  ];

  return (
    <PageTransition>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Fraud Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Comprehensive fraud detection metrics and model performance</p>
        </div>

        {/* Row 1: class dist + risk histogram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card glow="green" delay={0} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Licit vs Illicit Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={classData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#22c55e">
                  {classData.map((d) => (
                    <rect key={d.name} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card glow="cyan" delay={0.05} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Score Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.riskScoreHistogram}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="bin" tick={{ fill: '#6b7280', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" fill="url(#riskGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Row 2: timeline + degree */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card glow="red" delay={0.1} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">High-Risk Transactions Timeline</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.highRiskTimeline}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#ef4444" fill="url(#hrGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card glow="purple" delay={0.15} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Graph Degree Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.degreeDistribution} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="degree" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#a855f780" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Model performance */}
        <Card glow="cyan" delay={0.2} className="p-5">
          <h3 className="text-sm font-semibold text-white mb-5">Model Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <MetricBar label="Precision" value={data.modelPerformance.precision} color="#22c55e" />
              <MetricBar label="Recall" value={data.modelPerformance.recall} color="#f59e0b" />
              <MetricBar label="F1 Score" value={data.modelPerformance.f1} color="#06b6d4" />
              <MetricBar label="ROC-AUC" value={data.modelPerformance.rocAuc} color="#a855f7" />
              <MetricBar label="PR-AUC" value={data.modelPerformance.prAuc} color="#ec4899" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Precision', value: data.modelPerformance.precision, color: '#22c55e' },
                { label: 'Recall', value: data.modelPerformance.recall, color: '#f59e0b' },
                { label: 'F1 Score', value: data.modelPerformance.f1, color: '#06b6d4' },
                { label: 'ROC-AUC', value: data.modelPerformance.rocAuc, color: '#a855f7' },
                { label: 'PR-AUC', value: data.modelPerformance.prAuc, color: '#ec4899' },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <div className="text-xl font-bold font-mono" style={{ color: m.color }}>
                    {(m.value * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Analytics;
