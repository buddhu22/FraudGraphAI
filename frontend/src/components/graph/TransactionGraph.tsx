import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
  addEdge,
  type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { GraphData, TransactionNode } from '../../types';
import { getRiskColor, truncateId, formatPercent } from '../../utils/risk';
import RiskBadge from '../ui/RiskBadge';

// ─── Custom node ────────────────────────────────
interface CustomNodeData {
  label: string;
  riskScore: number;
  riskLevel: string;
  prediction: string;
  confidence: number;
  isTarget?: boolean;
  [key: string]: unknown;
}

const TransactionNode: React.FC<{ data: CustomNodeData; selected: boolean }> = ({ data, selected }) => {
  const color = getRiskColor(data.riskLevel as any);
  const isTarget = data.isTarget;

  return (
    <div
      className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-center transition-all"
      style={{
        background: isTarget
          ? `radial-gradient(circle at 50% 30%, ${color}25, ${color}08)`
          : `${color}10`,
        border: `1.5px solid ${isTarget ? color : color + '60'}`,
        boxShadow: isTarget ? `0 0 20px ${color}40` : selected ? `0 0 12px ${color}30` : 'none',
        minWidth: 110,
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/20 !border-white/10 !w-2 !h-2" />
      {isTarget && (
        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold">
          !
        </div>
      )}
      <span className="text-[10px] font-mono text-white/60">{truncateId(data.label, 6, 4)}</span>
      <span className="text-base font-bold font-mono" style={{ color }}>
        {Math.round(data.riskScore * 100)}%
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: color + 'cc' }}>
        {data.prediction}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-white/20 !border-white/10 !w-2 !h-2" />
    </div>
  );
};

const nodeTypes: NodeTypes = { transaction: TransactionNode as any };

// ─── Layout helper ──────────────────────────────
function buildFlowNodes(graphData: GraphData): [Node[], Edge[]] {
  const targetNode = graphData.nodes.find((n) => n.isTarget);
  const otherNodes = graphData.nodes.filter((n) => !n.isTarget);

  const cx = 300;
  const cy = 250;
  const radius = 200;

  const nodes: Node[] = [
    ...(targetNode
      ? [
          {
            id: targetNode.id,
            type: 'transaction',
            position: { x: cx - 55, y: cy - 40 },
            data: {
              label: targetNode.id,
              riskScore: targetNode.riskScore,
              riskLevel: targetNode.riskLevel,
              prediction: targetNode.prediction,
              confidence: targetNode.confidence,
              isTarget: true,
            },
          },
        ]
      : []),
    ...otherNodes.map((n, i) => {
      const angle = (i / otherNodes.length) * 2 * Math.PI;
      return {
        id: n.id,
        type: 'transaction',
        position: {
          x: cx + radius * Math.cos(angle) - 55,
          y: cy + radius * Math.sin(angle) - 40,
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

  const edges: Edge[] = graphData.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: e.suspicious,
    style: {
      stroke: e.suspicious ? '#ef4444' : 'rgba(255,255,255,0.12)',
      strokeWidth: 1.5,
    },
    type: 'straight',
  }));

  return [nodes, edges];
}

// ─── Side panel ─────────────────────────────────
interface NodePanelProps {
  node: TransactionNode | null;
  onClose: () => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ node, onClose }) => {
  if (!node) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 320, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute right-0 top-0 h-full w-72 bg-[#0a0d14] border-l border-white/10 p-4 z-10 flex flex-col gap-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">Transaction Details</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <Row label="ID" value={<span className="font-mono text-xs break-all">{node.id}</span>} />
          <Row label="Risk Score" value={
            <span className="font-mono font-bold" style={{ color: getRiskColor(node.riskLevel) }}>
              {formatPercent(node.riskScore)}
            </span>
          } />
          <Row label="Prediction" value={
            <span className={node.prediction === 'illicit' ? 'text-red-400' : 'text-green-400'} >
              {node.prediction.toUpperCase()}
            </span>
          } />
          <Row label="Confidence" value={<span className="font-mono">{formatPercent(node.confidence)}</span>} />
          <Row label="Status" value={<RiskBadge level={node.riskLevel} />} />
        </div>

        <div className="mt-auto text-[10px] text-gray-600 text-center">
          Click another node to inspect it
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 border-b border-white/5 pb-2">
    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
    <span className="text-sm text-white">{value}</span>
  </div>
);

// ─── Main graph component ────────────────────────
interface TransactionGraphProps {
  graphData: GraphData;
  targetId: string;
  onNodeFocus?: (nodeId: string) => void;
}

const TransactionGraph: React.FC<TransactionGraphProps> = ({ graphData, targetId, onNodeFocus }) => {
  const [initNodes, initEdges] = buildFlowNodes(graphData);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [selectedNode, setSelectedNode] = useState<TransactionNode | null>(null);

  useEffect(() => {
    const [n, e] = buildFlowNodes(graphData);
    setNodes(n);
    setEdges(e);
    setSelectedNode(null);
  }, [graphData]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = graphData.nodes.find((n) => n.id === node.id);
      if (found) setSelectedNode(found);
      onNodeFocus?.(node.id);
    },
    [graphData.nodes, onNodeFocus],
  );

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255,255,255,0.04)"
        />
        <Controls className="!bg-[#0a0d14] !border-white/10 !rounded-lg" />
        <MiniMap
          className="!bg-[#0a0d14] !border-white/10 !rounded-lg"
          nodeColor={(n) => getRiskColor((n.data as CustomNodeData).riskLevel as any)}
          maskColor="rgba(8,11,17,0.7)"
        />
      </ReactFlow>
      <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};

export default TransactionGraph;
