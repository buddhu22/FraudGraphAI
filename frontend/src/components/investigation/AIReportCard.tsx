import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap } from 'lucide-react';
import Card from '../ui/Card';
import type { AIReport, ReportReason } from '../../types';

interface AIReportCardProps {
  report: AIReport;
  txId: string;
  riskScore: number;
  confidence: number;
  modelVersion: string;
  onGenerateReport?: () => void;
}

const AIReportCard: React.FC<AIReportCardProps> = ({
  report,
  txId,
  riskScore,
  confidence,
  modelVersion,
  onGenerateReport,
}) => {
  return (
    <Card glow="purple" delay={0.2} className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Brain size={14} className="text-purple-400" />
          </div>
          <span className="text-sm font-semibold text-white">AI Risk Assessment</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-semibold">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ●
          </motion.span>
          GCN Active
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-300 leading-relaxed mb-4 border-l-2 border-purple-500/40 pl-3">
        {report.summary}
      </p>

      {/* Meta row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Risk Score', value: `${Math.round(riskScore * 100)}%`, color: 'text-red-400' },
          { label: 'Confidence', value: `${Math.round(confidence * 100)}%`, color: 'text-cyan-400' },
          { label: 'Model', value: modelVersion, color: 'text-purple-400' },
          { label: 'Generated', value: new Date(report.generatedAt).toLocaleTimeString(), color: 'text-gray-400' },
        ].map((m) => (
          <div key={m.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/5">
            <div className={`text-sm font-bold font-mono ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Reasons */}
      <div className="space-y-3 mb-5">
        <div className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">
          Why This Transaction Is Flagged
        </div>
        {report.reasons.map((r, i) => (
          <motion.div
            key={r.order}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i + 0.3 }}
            className="flex gap-3"
          >
            <span className="text-[10px] font-bold font-mono text-purple-400 mt-1 shrink-0 w-5">
              0{r.order}
            </span>
            <div>
              <div className="text-sm font-semibold text-white">{r.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{r.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onGenerateReport}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold hover:bg-purple-500/15 hover:border-purple-500/30 transition-all"
      >
        <Zap size={14} />
        Generate Detailed Report
      </button>
    </Card>
  );
};

export default AIReportCard;
