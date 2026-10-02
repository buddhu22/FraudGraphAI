import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';
import NetworkExplorer from './pages/NetworkExplorer';
import Analytics from './pages/Analytics';
import ModelMonitor from './pages/ModelMonitor';
import Settings from './pages/Settings';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="investigate" element={<Investigation />} />
        <Route path="network" element={<NetworkExplorer />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="model" element={<ModelMonitor />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
