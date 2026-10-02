import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Network, Shield, ArrowRight } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import KpiCards from '../components/dashboard/KpiCards';
import RiskOverview from '../components/dashboard/RiskOverview';
import { mockAnalytics } from '../mock/analytics';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0d1321] via-[#0a1220] to-[#080b11] p-8">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Graph-powered transaction intelligence
              </span>
            </div>

            <motion.h1
              className="text-4xl font-bold text-white mb-3 leading-tight"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              FraudGraph AI
            </motion.h1>

            <motion.p
              className="text-lg text-gray-400 mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Detect suspicious transaction patterns{' '}
              <span className="text-cyan-400 font-medium">before they become financial threats.</span>
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/investigate')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-sm font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Search size={15} />
                Investigate Transaction
              </button>
              <button
                onClick={() => navigate('/network')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <Network size={15} />
                Explore Network
              </button>
            </motion.div>
          </div>

          {/* Corner badge */}
          <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
            <div className="text-[10px] text-gray-600 uppercase tracking-wider">Dataset</div>
            <div className="text-xs font-mono text-cyan-400 font-semibold">Elliptic Bitcoin</div>
          </div>
        </div>

        {/* KPI */}
        <KpiCards
          data={{
            txAnalyzed: 203769,
            graphConnections: 234355,
            highRiskDetected: 4545,
            modelAccuracy: mockAnalytics.modelPerformance.f1,
            prAuc: mockAnalytics.modelPerformance.prAuc,
          }}
        />

        {/* Risk Overview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Risk Overview</h2>
            <button
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View Analytics <ArrowRight size={12} />
            </button>
          </div>
          <RiskOverview data={mockAnalytics} />
        </div>

        {/* Recent activity placeholder */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Recent High-Risk Transactions</h2>
          <div className="space-y-2">
            {[
              { id: 'tx_7a8f2c1e9b3d5f04', risk: 0.94, level: 'critical' },
              { id: 'tx_3b6e1d9a4c7f2e05', risk: 0.82, level: 'high' },
              { id: 'tx_9c4f7b2e6d1a8c03', risk: 0.71, level: 'high' },
            ].map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.5 }}
                onClick={() => navigate(`/investigate?tx=${tx.id}`)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 cursor-pointer transition-all group"
              >
                <span className="font-mono text-sm text-white/70">{tx.id}</span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: tx.level === 'critical' ? '#dc2626' : '#ef4444' }}
                  >
                    {Math.round(tx.risk * 100)}%
                  </span>
                  <span
                    className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      color: tx.level === 'critical' ? '#dc2626' : '#ef4444',
                      background: tx.level === 'critical' ? '#dc262615' : '#ef444415',
                    }}
                  >
                    {tx.level}
                  </span>
                  <ArrowRight size={12} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
