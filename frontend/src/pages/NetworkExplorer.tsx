import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeTypes,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import { motion } from 'framer-motion';
import { Search, RotateCcw, Filter } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import { getMockInvestigation } from '../mock/transactions';
import { getRiskColor, truncateId } from '../utils/risk';
import type { RiskLevel } from '../types';

type RiskFilter = 'all' | 'low' | 'medium' | 'high' | 'critical';
type DepthFilter = '1-hop' | '2-hop';

// Reuse transaction node style
interface CustomNodeData {
  label: string;
  riskScore: number;
  riskLevel: string;
  prediction: string;
  confidence: number;
  isTarget?: boolean;
  [key: string]: unknown;
}

const TxNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  const color = getRiskColor(data.riskLevel as RiskLevel);
  return (
    <div
      className="px-3 py-2 rounded-xl text-center"
      style={{
        border: `1.5px solid ${color}60`,
        background: `${color}10`,
        boxShadow: data.isTarget ? `0 0 18px ${color}40` : 'none',
        minWidth: 100,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !w-2 !h-2 !border-white/10" />
      <div className="text-[10px] font-mono text-white/50">{truncateId(data.label, 5, 3)}</div>
      <div className="text-sm font-bold font-mono" style={{ color }}>
        {Math.round(data.riskScore * 100)}%
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !w-2 !h-2 !border-white/10" />
    </div>
  );
};

const nodeTypes: NodeTypes = { tx: TxNode as any };

function buildNetworkGraph(txId: string) {
  const result = getMockInvestigation(txId);
  const target = result.transaction;
  const cx = 400;
  const cy = 280;
  const radius = 220;

  const nodes: Node[] = [
    {
      id: target.id,
      type: 'tx',
      position: { x: cx - 50, y: cy - 30 },
      data: {
        label: target.id,
        riskScore: target.riskScore,
        riskLevel: target.riskLevel,
        prediction: target.prediction,
        confidence: target.confidence,
        isTarget: true,
      },
    },
    ...result.graph.nodes
      .filter((n) => !n.isTarget)
      .map((n, i, arr) => {
        const angle = (i / arr.length) * 2 * Math.PI;
        return {
          id: n.id,
          type: 'tx',
          position: {
            x: cx + radius * Math.cos(angle) - 50,
            y: cy + radius * Math.sin(angle) - 30,
          },
          data: {
            label: n.id,
            riskScore: n.riskScore,
            riskLevel: n.riskLevel,
            prediction: n.prediction,
            confidence: n.confidence,
          },
        };
      }),
  ];

  const edges = result.graph.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1.5 },
    type: 'straight',
  }));

  return { nodes, edges };
}

const RISK_FILTERS: RiskFilter[] = ['all', 'low', 'medium', 'high', 'critical'];
const DEPTH_FILTERS: DepthFilter[] = ['1-hop', '2-hop'];

const NetworkExplorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [depthFilter, setDepthFilter] = useState<DepthFilter>('1-hop');

  const defaultTx = 'tx_7a8f2c1e9b3d5f04';
  const [activeTx, setActiveTx] = useState(defaultTx);
  const { nodes: initNodes, edges: initEdges } = buildNetworkGraph(activeTx);
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setActiveTx(search.trim());
  };

  const filterColors: Record<RiskFilter, string> = {
    all: 'text-gray-300 border-gray-600 bg-white/5',
    low: 'text-green-400 border-green-500/30 bg-green-500/10',
    medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    high: 'text-red-400 border-red-500/30 bg-red-500/10',
    critical: 'text-red-500 border-red-600/30 bg-red-600/10',
  };

  return (
    <PageTransition>
      <div className="p-6 max-w-[1400px] mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold text-white">Network Explorer</h1>
          <p className="text-sm text-gray-500 mt-0.5">Explore the full Bitcoin transaction graph network</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 flex-1 min-w-[200px] max-w-xs">
            <Search size={13} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Transaction ID..."
              className="bg-transparent text-xs font-mono text-white placeholder-gray-600 outline-none flex-1"
            />
          </form>

          {/* Risk filter */}
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-gray-600 mr-1" />
            {RISK_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setRiskFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border transition-all ${
                  riskFilter === f ? filterColors[f] : 'text-gray-600 border-white/5 hover:border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Depth */}
          <div className="flex items-center gap-1">
            {DEPTH_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setDepthFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                  depthFilter === f
                    ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                    : 'text-gray-600 border-white/5 hover:border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Reset */}
          <button
            onClick={() => { setSearch(''); setActiveTx(defaultTx); setRiskFilter('all'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-gray-400 border border-white/5 hover:border-white/10 hover:text-white transition-all"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        {/* Graph */}
        <div className="h-[calc(100vh-260px)] min-h-[450px] rounded-xl overflow-hidden border border-white/5">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.04)" />
            <Controls className="!bg-[#0a0d14] !border-white/10 !rounded-lg" />
            <MiniMap
              className="!bg-[#0a0d14] !border-white/10 !rounded-lg"
              nodeColor={(n) => getRiskColor((n.data as CustomNodeData).riskLevel as any)}
              maskColor="rgba(8,11,17,0.7)"
            />
          </ReactFlow>
        </div>
      </div>
    </PageTransition>
  );
};

export default NetworkExplorer;
