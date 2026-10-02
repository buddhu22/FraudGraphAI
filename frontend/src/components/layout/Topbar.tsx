import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Topbar: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/investigate?tx=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#080b11]/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-mono">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <AnimatePresence>
          {searchOpen ? (
            <motion.form
              key="search-open"
              onSubmit={handleSearch}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 overflow-hidden"
            >
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transaction ID..."
                className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1 font-mono"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </motion.form>
          ) : (
            <motion.button
              key="search-closed"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search size={15} />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <button className="relative flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* Status dot */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-semibold uppercase tracking-wider">System Online</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
