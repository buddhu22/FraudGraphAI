import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, AlertTriangle, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import RiskGauge from '../components/ui/RiskGauge';
import Card from '../components/ui/Card';
import RiskBadge from '../components/ui/RiskBadge';
import AIReportCard from '../components/investigation/AIReportCard';
import ModelInsightsCard from '../components/investigation/ModelInsightsCard';
import NeighborsTable from '../components/investigation/NeighborsTable';
import TransactionGraph from '../components/graph/TransactionGraph';
import { LoadingSteps, EmptyState, ErrorState } from '../components/ui/States';
import { getMockInvestigation, EXAMPLE_TRANSACTION_IDS } from '../mock/transactions';
import type { InvestigationResult } from '../types';
import { truncateId, getRiskColor, getRiskTextClass } from '../utils/risk';
import { delay } from '../utils/risk';

const LOADING_STEPS = [
  'Scanning transaction...',
  'Mapping graph neighborhood...',
  'Running GCN inference...',
  'Calculating risk score...',
  'Generating investigation...',
];

const Investigation: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get('tx') ?? '');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Auto-run if tx param provided
  useEffect(() => {
    const tx = searchParams.get('tx');
    if (tx) {
      setQuery(tx);
      runAnalysis(tx);
    }
  }, []);

  const runAnalysis = async (txId?: string) => {
    const id = txId ?? query.trim();
    if (!id) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    // Simulate pipeline steps
    for (let i = 0; i < LOADING_STEPS.length; i++) {
      setLoadingStep(i);
      await delay(520 + Math.random() * 250);
    }

    try {
      // In real mode: const data = await transactionsApi.predict(id)
      const data = getMockInvestigation(id);
      setResult(data);
      setSearchParams({ tx: id });
    } catch {
      setError('Unable to analyze transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis();
  };

  const statusIcon =
    result?.transaction.riskLevel === 'low' ? (
      <CheckCircle size={16} className="text-green-400" />
    ) : (
      <AlertTriangle size={16} className="text-red-400" />
    );

  return (
    <PageTransition>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-white">Transaction Investigation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Enter a Bitcoin transaction ID to run GCN fraud analysis
          </p>
        </div>

        {/* Search bar */}
        <Card animate={false} className="p-5">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter transaction ID... e.g. tx_7a8f2c1e9b3d5f04"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black text-sm font-bold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Shield size={15} />}
              Analyze
            </button>
          </form>

          {/* Example IDs */}
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Examples:</span>
            {EXAMPLE_TRANSACTION_IDS.slice(0, 4).map((id) => (
              <button
                key={id}
                onClick={() => { setQuery(id); }}
                className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.07] text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              >
                {id}
              </button>
            ))}
          </div>
        </Card>

        {/* Loading */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card animate={false} className="p-6">
                <LoadingSteps steps={LOADING_STEPS} currentStep={loadingStep} />
              </Card>
            </motion.div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card animate={false} className="p-4">
                <ErrorState
                  title="Unable to analyze transaction"
                  description={error}
                  onRetry={() => runAnalysis()}
                />
              </Card>
            </motion.div>
          )}

          {/* Empty */}
          {!loading && !error && !result && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card animate={false} className="p-4">
                <EmptyState
                  icon="🕸️"
                  title="No transaction selected"
                  description="Enter a transaction ID above to begin your graph investigation."
                />
              </Card>
            </motion.div>
          )}

          {/* Result */}
          {!loading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Top banner */}
              <Card animate={false} glow={result.transaction.riskLevel === 'low' ? 'green' : 'red'} className="p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Gauge */}
                  <div className="shrink-0">
                    <RiskGauge
                      score={result.transaction.riskScore}
                      riskLevel={result.transaction.riskLevel}
                      size={160}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      {statusIcon}
                      <span className={`text-xs font-bold uppercase tracking-widest ${getRiskTextClass(result.transaction.riskLevel)}`}>
                        Transaction Analysis
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Transaction ID</div>
                      <code className="text-sm text-white font-mono break-all">{result.transaction.id}</code>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Risk Score', value: `${Math.round(result.transaction.riskScore * 100)}%`, color: getRiskTextClass(result.transaction.riskLevel) },
                        { label: 'Prediction', value: result.transaction.prediction.toUpperCase(), color: result.transaction.prediction === 'illicit' ? 'text-red-400' : 'text-green-400' },
                        { label: 'Confidence', value: `${Math.round(result.transaction.confidence * 100)}%`, color: 'text-cyan-400' },
                        { label: 'Model', value: result.transaction.modelVersion, color: 'text-purple-400' },
                      ].map((m) => (
                        <div key={m.label} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          <div className={`text-sm font-bold font-mono ${m.color}`}>{m.value}</div>
                          <div className="text-[10px] text-gray-600 mt-0.5">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    <RiskBadge level={result.transaction.riskLevel} score={result.transaction.riskScore} />
                  </div>
                </div>
              </Card>

              {/* Graph */}
              <div>
                <h2 className="text-sm font-semibold text-white mb-2">Graph Investigation</h2>
                <div className="h-[480px]">
                  <TransactionGraph
                    graphData={result.graph}
                    targetId={result.transaction.id}
                    onNodeFocus={setFocusedNodeId}
                  />
                </div>
              </div>

              {/* Bottom grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 space-y-5">
                  <NeighborsTable
                    neighbors={result.neighbors}
                    onSelectNode={setFocusedNodeId}
                  />
                  <AIReportCard
                    report={result.aiReport}
                    txId={result.transaction.id}
                    riskScore={result.transaction.riskScore}
                    confidence={result.transaction.confidence}
                    modelVersion={result.transaction.modelVersion}
                  />
                </div>
                <div>
                  <ModelInsightsCard insights={result.modelInsights} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Investigation;
