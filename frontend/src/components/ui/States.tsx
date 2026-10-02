import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStepProps {
  steps: string[];
  currentStep: number;
}

export const LoadingSteps: React.FC<LoadingStepProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-2">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/20"
          style={{ borderTopColor: '#06b6d4' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-purple-500/20"
          style={{ borderBottomColor: '#a855f7' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col items-center gap-2">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= currentStep ? 1 : 0.25, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor:
                  i < currentStep ? '#22c55e' : i === currentStep ? '#06b6d4' : 'rgba(255,255,255,0.15)',
                scale: i === currentStep ? [1, 1.4, 1] : 1,
              }}
              transition={i === currentStep ? { duration: 0.8, repeat: Infinity } : {}}
            />
            <span
              className={`text-sm font-mono ${
                i < currentStep ? 'text-green-400' : i === currentStep ? 'text-cyan-400' : 'text-gray-600'
              }`}
            >
              {step}
              {i === currentStep && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ...
                </motion.span>
              )}
              {i < currentStep && ' ✓'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center"
  >
    {icon && (
      <div className="text-5xl mb-2">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </motion.div>
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'The inference service is currently unavailable.',
  onRetry,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center"
  >
    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
      <span className="text-red-400 text-xl">⚠</span>
    </div>
    <div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all"
      >
        Retry
      </button>
    )}
  </motion.div>
);
