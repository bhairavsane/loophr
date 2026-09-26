'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRightCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Play,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import replayDataImport from '@/lib/data/cache/replay-results.json';
const replayData = replayDataImport as any;

import { use } from 'react';

export default function ReplayPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const resolvedParams = use(params);
  const workflowId = resolvedParams.workflowId;
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [hasReplayed, setHasReplayed] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const totalCases = replayData?.total || 0;
  const results = replayData?.results || [];

  // Replay animation effect
  useEffect(() => {
    if (isReplaying) {
      if (replayProgress < totalCases) {
        const timer = setTimeout(() => {
          setReplayProgress(prev => prev + 1);
        }, 50); // 50ms per case as requested (~3.5s for 73 cases)
        return () => clearTimeout(timer);
      } else {
        setIsReplaying(false);
        setHasReplayed(true);
      }
    }
  }, [isReplaying, replayProgress, totalCases]);

  const handleStartReplay = () => {
    setIsReplaying(true);
    setReplayProgress(0);
    setHasReplayed(false);
  };

  const visibleResults = results.slice(0, isReplaying ? replayProgress : (hasReplayed ? totalCases : 0));
  
  const filteredResults = activeFilter === 'all' 
    ? visibleResults 
    : visibleResults.filter((r: any) => r.classification === activeFilter);

  const getClassificationStyles = (type: string) => {
    switch(type) {
      case 'match': return { color: 'text-[var(--success)]', bg: 'bg-[rgba(34,197,94,0.15)]', icon: CheckCircle2, label: 'Match' };
      case 'correct_escalation': return { color: 'text-[var(--accent)]', bg: 'bg-[rgba(59,130,246,0.15)]', icon: ArrowRightCircle, label: 'Correct Escalation' };
      case 'policy_drift': return { color: 'text-[var(--warning)]', bg: 'bg-[rgba(234,179,8,0.15)]', icon: AlertTriangle, label: 'Policy Drift' };
      case 'automation_mismatch': return { color: 'text-[var(--error)]', bg: 'bg-[rgba(239,68,68,0.15)]', icon: XCircle, label: 'Automation Mismatch' };
      default: return { color: 'text-[var(--text-secondary)]', bg: 'bg-[var(--border)]', icon: HelpCircle, label: 'Unknown' };
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] p-6 pb-24">
        
        {/* Header */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2 flex items-center gap-3">
              Historical Audit
              <span className="text-sm px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-full text-[var(--text-secondary)]">
                {totalCases} cases
              </span>
            </h1>
            <p className="text-[var(--text-secondary)]">Executing proposed automation &quot;{replayData?.workflow_name}&quot; against historical dataset to measure compliance and safe coverage.</p>
          </div>
          
          {!isReplaying && !hasReplayed && (
            <button
              onClick={handleStartReplay}
              className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] whitespace-nowrap"
            >
              <Play size={18} fill="currentColor" />
              Run Audit ({totalCases} Cases)
            </button>
          )}
          
          {isReplaying && (
            <div className="flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--border)] px-6 py-3 rounded-lg">
              <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
              <span className="font-mono text-sm text-[var(--accent)]">Replaying... {replayProgress}/{totalCases}</span>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Coverage Meter (The Money Shot) */}
          <AnimatePresence>
            {(hasReplayed || (isReplaying && replayProgress > totalCases * 0.5)) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--bg-surface)] border border-[var(--border)] p-8 rounded-2xl relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-5 blur-[100px] rounded-full" />
                
                <h2 className="text-xl font-medium mb-6">Recommended autonomous coverage</h2>
                
                <div className="relative h-12 bg-[var(--bg-elevated)] rounded-full overflow-hidden border border-[var(--border)] mb-4">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--success)] to-[var(--accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${replayData?.safe_coverage_pct || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 flex items-center px-6 justify-between text-sm font-semibold drop-shadow-md">
                    <span className="text-white mix-blend-overlay">Safe to Automate</span>
                    <span className="text-white mix-blend-overlay">{replayData?.safe_coverage_pct}%</span>
                  </div>
                </div>
                
                <p className="text-[var(--text-secondary)] text-sm">
                  LoopHR recommends keeping <strong className="text-[var(--text-primary)]">{replayData?.human_review_pct}%</strong> of cases human-led due to policy drift and complexity.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Summary Cards */}
          <AnimatePresence>
            {hasReplayed && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-5 gap-4"
              >
                {[
                  { key: 'match', label: 'Match', count: replayData?.match, color: 'var(--success)' },
                  { key: 'correct_escalation', label: 'Correct Escalation', count: replayData?.correct_escalation, color: 'var(--accent)' },
                  { key: 'policy_drift', label: 'Policy Drift', count: replayData?.policy_drift, color: 'var(--warning)' },
                  { key: 'automation_mismatch', label: 'Auto Mismatch', count: replayData?.automation_mismatch, color: 'var(--error)' },
                  { key: 'unknown', label: 'Unknown', count: replayData?.unknown, color: 'var(--text-secondary)' },
                ].map((stat) => (
                  <button 
                    key={stat.key}
                    onClick={() => setActiveFilter(activeFilter === stat.key ? 'all' : stat.key)}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      activeFilter === stat.key 
                        ? `bg-[${stat.color}15] border-[${stat.color}50]` 
                        : "bg-[var(--bg-surface)] border-[var(--border)] hover:bg-[var(--bg-elevated)]"
                    )}
                  >
                    <div className="text-3xl font-light mb-1" style={{ color: stat.color }}>{stat.count}</div>
                    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replay Runner / Table */}
          {(isReplaying || hasReplayed) && (
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              
              {hasReplayed && (
                <div className="p-4 border-b border-[var(--border)] flex items-center gap-2">
                  <span className="text-sm text-[var(--text-secondary)] mr-2">Filter:</span>
                  {['all', 'match', 'correct_escalation', 'policy_drift', 'automation_mismatch'].map(filterKey => (
                    <button
                      key={filterKey}
                      onClick={() => setActiveFilter(filterKey)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize",
                        activeFilter === filterKey 
                          ? "bg-[var(--border-strong)] text-[var(--text-primary)]" 
                          : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      )}
                    >
                      {filterKey.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-elevated)] border-b border-[var(--border)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Case ID</th>
                      <th className="px-6 py-4 font-medium">Classification</th>
                      <th className="px-6 py-4 font-medium">Historical Outcome</th>
                      <th className="px-6 py-4 font-medium">Automation Outcome</th>
                      <th className="px-6 py-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredResults.map((result: any, idx: number) => {
                        const style = getClassificationStyles(result.classification);
                        const Icon = style.icon;
                        const isExpanded = expandedRow === result.case_id;

                        return (
                          <React.Fragment key={result.case_id}>
                            <motion.tr 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)] cursor-pointer"
                              onClick={() => setExpandedRow(isExpanded ? null : result.case_id)}
                            >
                              <td className="px-6 py-4 font-mono text-[var(--text-primary)]">
                                {result.case_id}
                                {isReplaying && idx === visibleResults.length - 1 && (
                                  <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", style.bg, style.color)}>
                                  <Icon size={14} />
                                  {style.label}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[var(--text-secondary)]">{result.historical_outcome}</td>
                              <td className="px-6 py-4 text-[var(--text-primary)] font-medium">{result.automation_outcome}</td>
                              <td className="px-6 py-4 text-right">
                                {isExpanded ? <ChevronUp size={16} className="text-[var(--text-muted)] inline" /> : <ChevronDown size={16} className="text-[var(--text-muted)] inline" />}
                              </td>
                            </motion.tr>
                            
                            {isExpanded && (
                              <tr className="bg-[var(--bg)] border-b border-[var(--border)]">
                                <td colSpan={5} className="px-6 py-6">
                                  <div className="grid grid-cols-2 gap-8">
                                    <div>
                                      <h4 className="text-xs uppercase text-[var(--text-muted)] font-semibold mb-2">Request Context</h4>
                                      <p className="text-sm text-[var(--text-secondary)] italic bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border)]">
                                        &quot;{result.request_text}&quot;
                                      </p>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-xs uppercase text-[var(--text-muted)] font-semibold mb-1">Expected by Policy</h4>
                                        <p className="text-sm font-medium text-[var(--text-primary)]">{result.policy_expected_outcome}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-xs uppercase text-[var(--text-muted)] font-semibold mb-1">Reasoning</h4>
                                        <p className="text-sm text-[var(--text-secondary)]">{result.reasoning}</p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
                
                {filteredResults.length === 0 && hasReplayed && (
                  <div className="p-8 text-center text-[var(--text-muted)]">
                    No cases match the selected filter.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Action */}
          <AnimatePresence>
            {hasReplayed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center mt-12"
              >
                <Link 
                  href="/live"
                  className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg)] px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-all hover:scale-105 shadow-lg whitespace-nowrap"
                >
                  Try Live Case
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </AppShell>
  );
}
