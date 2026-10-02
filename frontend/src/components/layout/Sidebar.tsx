import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Search,
  Network,
  BarChart3,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
}

const primary: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/' },
  { label: 'Investigate', icon: <Search size={18} />, to: '/investigate' },
  { label: 'Network', icon: <Network size={18} />, to: '/network' },
  { label: 'Analytics', icon: <BarChart3 size={18} />, to: '/analytics' },
];

const secondary: NavItem[] = [
  { label: 'GNN Monitor', icon: <Cpu size={18} />, to: '/model' },
  { label: 'Settings', icon: <Settings size={18} />, to: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-[#0a0d14] border-r border-white/5 overflow-hidden shrink-0"
      style={{ minWidth: collapsed ? 64 : 220 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 shrink-0">
          <Shield size={16} className="text-cyan-400" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-sm font-bold text-white tracking-wide">FraudGraph</span>
              <span className="text-sm font-bold text-cyan-400 tracking-wide"> AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Demo badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mt-3 mb-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5"
          >
            <Zap size={10} className="text-amber-400" />
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Demo Mode</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <div className={`mb-1 px-2 ${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Navigation</span>
        </div>
        {primary.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}

        <div className={`mt-4 mb-1 px-2 ${collapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Model</span>
        </div>
        {secondary.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-full py-3 border-t border-white/5 text-gray-500 hover:text-cyan-400 transition-colors"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
};

const SidebarLink: React.FC<{ item: NavItem; collapsed: boolean }> = ({ item, collapsed }) => {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 group
        ${
          isActive
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
        }`
      }
    >
      <span className="shrink-0">{item.icon}</span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );
};

export default Sidebar;
