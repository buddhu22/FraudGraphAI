import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { RiskLevel } from '../../types';
import { getRiskColor } from '../../utils/risk';

interface RiskGaugeProps {
  score: number;           // 0–1
  riskLevel: RiskLevel;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  size = 180,
  strokeWidth = 10,
  animate = true,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 270° arc (3/4 of circle)
  const arcLength = circumference * 0.75;
  const color = getRiskColor(riskLevel);

  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const dashOffset = useTransform(spring, (v) => arcLength - v * arcLength);

  useEffect(() => {
    if (animate) {
      spring.set(score);
    } else {
      spring.jump(score);
    }
  }, [score, animate, spring]);

  const labelColor =
    riskLevel === 'low'
      ? 'text-green-400'
      : riskLevel === 'medium'
      ? 'text-amber-400'
      : riskLevel === 'critical'
      ? 'text-red-500'
      : 'text-red-400';

  const statusLabel =
    riskLevel === 'low'
      ? 'LOW RISK'
      : riskLevel === 'medium'
      ? 'MEDIUM RISK'
      : riskLevel === 'critical'
      ? 'CRITICAL'
      : 'HIGH RISK';

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" style={{ transform: 'rotate(135deg)' }}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>

      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-4xl font-bold font-mono ${labelColor}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {Math.round(score * 100)}%
        </motion.span>
        <motion.span
          className={`text-[10px] font-bold tracking-widest mt-0.5 ${labelColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {statusLabel}
        </motion.span>
      </div>
    </div>
  );
};

export default RiskGauge;
