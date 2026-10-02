import React from 'react';
import { Settings as SettingsIcon, Info } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import Card from '../components/ui/Card';

const Settings: React.FC = () => (
  <PageTransition>
    <div className="p-6 max-w-[800px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure FraudGraph AI backend and preferences</p>
      </div>

      <Card glow="cyan" delay={0} className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Backend Connection</h3>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">API Base URL</label>
          <input
            type="text"
            defaultValue={import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white outline-none focus:border-cyan-500/50 transition-all"
          />
          <p className="text-[10px] text-gray-600 mt-1.5">Set VITE_API_URL in .env to override</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 font-semibold">Demo Mode Active</span>
          </div>
          <span className="text-[11px] text-gray-600">Connect a FastAPI backend to enable live inference</span>
        </div>
      </Card>

      <Card glow="none" delay={0.1} className="p-5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-white mb-1">About FraudGraph AI</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              FraudGraph AI uses a Graph Convolutional Network (GCN) trained on the Elliptic Bitcoin transaction
              dataset to predict whether a transaction is potentially illicit. The model achieves 97% precision
              and 91.6% PR-AUC on the fraud detection task.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              {[
                ['Model', 'GCN v1.0'],
                ['Dataset', 'Elliptic Bitcoin'],
                ['Framework', 'PyTorch Geometric'],
                ['Backend', 'FastAPI'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-gray-600">{k}:</span>
                  <span className="text-gray-300 font-mono">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  </PageTransition>
);

export default Settings;
