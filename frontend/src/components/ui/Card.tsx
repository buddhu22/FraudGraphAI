import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'red' | 'green' | 'amber' | 'purple' | 'none';
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

const glowMap = {
  cyan: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] hover:border-cyan-500/30',
  red: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.08)] hover:border-red-500/30',
  green: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.08)] hover:border-green-500/30',
  amber: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:border-amber-500/30',
  purple: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.08)] hover:border-purple-500/30',
  none: '',
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = 'none',
  animate = true,
  delay = 0,
  onClick,
}) => {
  const base =
    'bg-white/[0.03] backdrop-blur-sm border border-white/[0.07] rounded-xl transition-all duration-300 ' +
    glowMap[glow];

  if (!animate) {
    return (
      <div className={`${base} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={`${base} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;
