'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  Settings,
  UserCheck,
  Lock
} from 'lucide-react';

// Using unknown to bypass import errors if file doesn't exist during compilation
// but adhering to the requested import path
import policyDataImport from '@/lib/data/cache/policy-comparison.json';
import workflowDataImport from '@/lib/data/cache/generated-workflow.json';

const policyData = policyDataImport as any;
const workflowData = workflowDataImport as any;


// --- Page Component ---

import { use } from 'react';

export default function ReviewPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const resolvedParams = use(params);
  const workflowId = resolvedParams.workflowId;
  const [isDeployed, setIsDeployed] = useState(false);

  useEffect(() => {
    const check = () => setIsDeployed(localStorage.getItem('loophr_deployed') === 'true');
    check();
    window.addEventListener('loophr_deployed', check);
    return () => window.removeEventListener('loophr_deployed', check);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--bg)] text-[var(--text-primary)] rounded-xl border border-[var(--border)] overflow-hidden">
        
        {/* Read-Only production banner */}
        {isDeployed && (
          <div className="flex items-center gap-3 px-6 py-2.5 bg-[rgba(34,197,94,0.08)] border-b border-[rgba(34,197,94,0.25)] text-[var(--success)] text-sm font-medium shrink-0">
            <Lock size={14} className="shrink-0" />
            <span>Read-Only: This workflow is actively deployed in production.</span>
            <span className="ml-auto flex items-center gap-1.5 text-xs opacity-70">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]" />
              </span>
              Live on SAP SuccessFactors
            </span>
          </div>
        )}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Policy Reconciliation: {workflowData?.name || 'Workflow'}</h1>
            <p className="text-[var(--text-secondary)] text-sm">Auditing proposed automation logic against active corporate policies for compliance.</p>
          </div>
          
          
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col">
          
          {/* TAB 1: Policy vs Reality */}
                      <div className="flex-1 overflow-auto p-6 flex gap-6">
              <div className="flex-1 space-y-6">
                
                <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-[var(--accent)]" />
                    <h2 className="text-lg font-medium">Policy Excerpt</h2>
                  </div>
                  <blockquote className="border-l-4 border-[var(--accent)] pl-4 italic text-[var(--text-secondary)]">
                    {policyData?.drifts?.[0]?.policy_text || "No policy text available."}
                  </blockquote>
                </div>

                <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-5">
                  <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-[var(--text-secondary)]" />
                    Historical Actions by Time Window
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-surface)] border-b border-[var(--border)]">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">Time Window</th>
                          <th className="px-4 py-3">Total Cases</th>
                          <th className="px-4 py-3">Approved</th>
                          <th className="px-4 py-3">Escalated</th>
                          <th className="px-4 py-3 rounded-tr-lg">Rejected</th>
                        </tr>
                      </thead>
                      <tbody>
                        {policyData?.time_buckets?.map((bucket: any, idx: number) => (
                          <tr key={idx} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                              <div>{bucket.label}</div>
                              <div className="text-xs text-[var(--text-muted)]">{bucket.range}</div>
                            </td>
                            <td className="px-4 py-3">{bucket.total}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-[rgba(34,197,94,0.15)] text-[var(--success)] rounded-full text-xs font-medium">
                                {bucket.approved}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-[rgba(234,179,8,0.15)] text-[var(--warning)] rounded-full text-xs font-medium">
                                {bucket.escalated}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-[rgba(239,68,68,0.15)] text-[var(--error)] rounded-full text-xs font-medium">
                                {bucket.rejected}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[var(--warning)]" />
                    Policy Drift Alerts
                  </h2>
                  <div className="space-y-4">
                    {policyData?.drifts?.filter((d: any) => ['high', 'medium'].includes(d.drift_severity)).map((drift: any, idx: number) => (
                      <div key={idx} className={cn(
                        "p-4 rounded-xl border flex flex-col gap-3",
                        drift.drift_severity === 'high' ? "bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.2)]" : "bg-[rgba(234,179,8,0.05)] border-[rgba(234,179,8,0.2)]"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className={drift.drift_severity === 'high' ? "text-[var(--error)]" : "text-[var(--warning)]"} />
                            <span className="font-medium text-[var(--text-primary)]">Behavior Mismatch</span>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full uppercase tracking-wider font-bold",
                            drift.drift_severity === 'high' ? "bg-[var(--error)] text-white" : "bg-[var(--warning)] text-black"
                          )}>
                            {drift.drift_severity} Severity
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                          <div className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                            <div className="text-[var(--text-secondary)] text-xs mb-1 uppercase tracking-wider">Expected (Policy)</div>
                            <div className="text-[var(--success)] flex items-start gap-1">
                              <CheckCircle size={14} className="mt-0.5 shrink-0" />
                              <span>{drift.expected_behavior}</span>
                            </div>
                          </div>
                          <div className="bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                            <div className="text-[var(--text-secondary)] text-xs mb-1 uppercase tracking-wider">Observed (Reality)</div>
                            <div className="text-[var(--error)] flex items-start gap-1">
                              <XCircle size={14} className="mt-0.5 shrink-0" />
                              <span>{drift.observed_behavior}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-[var(--text-secondary)] mt-1">{drift.details}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="w-80 flex flex-col gap-6">
                <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="text-sm text-[var(--text-secondary)] mb-2 uppercase tracking-wider font-semibold">Overall Compliance</div>
                  <div className="text-6xl font-light text-[var(--text-primary)]">
                    {policyData?.overall_compliance_rate || 0}%
                  </div>
                  <div className="text-sm text-[var(--text-muted)] mt-2">
                    Across {policyData?.total_cases_analyzed || 0} cases analyzed
                  </div>
                </div>
              </div>
            </div>

          
        </div>

        {/* Footer Action */}
        <div className="mt-6 flex justify-end">
          <Link 
            href={`/replay/${workflowId}`}
            className="flex items-center gap-2 bg-[var(--text-primary)] text-[var(--bg)] px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Run Historical Replay
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
