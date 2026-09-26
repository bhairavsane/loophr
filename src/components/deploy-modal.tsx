import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Link2, X } from 'lucide-react';

export function DeployModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<'connecting' | 'deploying' | 'success'>('connecting');

  useEffect(() => {
    if (isOpen) {
      setStatus('connecting');
      setTimeout(() => setStatus('deploying'), 1500);
      setTimeout(() => setStatus('success'), 3500);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          {status === 'success' && (
            <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <X size={20} />
            </button>
          )}
          
          <div className="flex flex-col items-center text-center space-y-4 pt-4 pb-2">
            {status === 'connecting' && (
              <>
                <div className="h-16 w-16 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full flex items-center justify-center mb-2">
                  <Link2 size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">Establishing Connection</h3>
                <p className="text-[var(--text-secondary)] text-sm px-4">
                  Authenticating with enterprise API gateway (Workday / SAP SuccessFactors)...
                </p>
                <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)] mt-4" />
              </>
            )}

            {status === 'deploying' && (
              <>
                <div className="h-16 w-16 bg-[var(--warning)]/10 text-[var(--warning)] rounded-full flex items-center justify-center mb-2">
                  <Loader2 size={32} className="animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">Pushing Automation Rules</h3>
                <p className="text-[var(--text-secondary)] text-sm px-4">
                  Translating deterministic nodes into REST API webhooks for HRIS integration...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-16 w-16 bg-[var(--success)]/10 text-[var(--success)] rounded-full flex items-center justify-center mb-2"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">Deployed to Production</h3>
                <p className="text-[var(--text-secondary)] text-sm px-4 mb-4">
                  The automation has been successfully deployed. It is now actively listening to HRIS webhooks.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full py-2.5 bg-[var(--text-primary)] text-[var(--bg)] rounded-lg font-medium hover:opacity-90 transition-opacity mt-4"
                >
                  Return to Dashboard
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
