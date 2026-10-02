import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import Card from '../components/ui/Card';
import { mockModelInfo } from '../mock/model';

const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono text-white">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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

const ArchNode: React.FC<{ label: string; sub?: string; color?: string; arrow?: boolean }> = ({
  label, sub, color = '#06b6d4', arrow = true,
}) => (
  <div className="flex flex-col items-center">
    <div
      className="px-5 py-2 rounded-xl border text-center min-w-[140px]"
      style={{ borderColor: color + '40', background: color + '0f' }}
    >
      <div className="text-sm font-semibold" style={{ color }}>{label}</div>
      {sub && <div className="text-[10px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
    {arrow && (
      <div className="flex flex-col items-center my-1">
        <div className="w-px h-3 bg-white/10" />
        <ArrowRight size={10} className="text-gray-600 rotate-90" />
      </div>
    )}
  </div>
);

const ModelMonitor: React.FC = () => {
  const m = mockModelInfo;

  return (
    <PageTransition>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Model Intelligence</h1>
          <p className="text-sm text-gray-500 mt-0.5">GCN architecture, performance metrics, and inference monitoring</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Model info */}
          <Card glow="cyan" delay={0} className="p-5 xl:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Cpu size={16} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{m.name}</div>
                <div className="text-xs text-gray-500">{m.version}</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Loaded
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Input Features', value: m.inputFeatures.toString(), color: 'text-cyan-400' },
                { label: 'Hidden Dimension', value: m.hiddenDimension.toString(), color: 'text-purple-400' },
                { label: 'Output Classes', value: m.outputClasses.toString(), color: 'text-green-400' },
                { label: 'Parameters', value: m.parameters.toLocaleString(), color: 'text-amber-400' },
                { label: 'Framework', value: m.framework, color: 'text-cyan-400' },
                { label: 'Trained On', value: m.trainedOn, color: 'text-gray-300' },
              ].map((i) => (
                <div key={i.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className={`text-sm font-bold font-mono ${i.color}`}>{i.value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{i.label}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Performance</h3>
            <div className="space-y-3">
              <MetricBar label="Precision" value={m.performance.precision} color="#22c55e" />
              <MetricBar label="Recall" value={m.performance.recall} color="#f59e0b" />
              <MetricBar label="F1 Score" value={m.performance.f1} color="#06b6d4" />
              <MetricBar label="ROC-AUC" value={m.performance.rocAuc} color="#a855f7" />
              <MetricBar label="PR-AUC" value={m.performance.prAuc} color="#ec4899" />
            </div>
          </Card>

          {/* Architecture */}
          <Card glow="purple" delay={0.1} className="p-5">
            <h3 className="text-sm font-semibold text-white mb-5">Architecture</h3>
            <div className="flex flex-col items-center">
              <ArchNode label={`${m.inputFeatures} Features`} sub="Input layer" color="#06b6d4" />
              <ArchNode label="GCN Layer 1" sub="Message passing" color="#a855f7" />
              <ArchNode label={`${m.hiddenDimension} Hidden`} sub="Embedding dim" color="#f59e0b" />
              <ArchNode label="ReLU" sub="Activation" color="#22c55e" />
              <ArchNode label="Dropout 0.5" sub="Regularisation" color="#6b7280" />
              <ArchNode label="GCN Layer 2" sub="Message passing" color="#a855f7" />
              <ArchNode label={`${m.outputClasses} Classes`} sub="Softmax output" color="#22c55e" arrow={false} />
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default ModelMonitor;
