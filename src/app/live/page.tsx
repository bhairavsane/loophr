'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  User,
  Building2,
  MapPin,
  Calendar,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Check,
  Zap,
} from 'lucide-react';

type Employee = {
  employee_id: string;
  name: string;
  employee_type: 'full_time' | 'part_time' | 'contractor' | 'intern';
  employee_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  location: string;
  tenure_months: number;
  department: string;
};

const defaultEmployee: Employee = {
  employee_id: 'EMP-1042',
  name: 'Priya Sharma',
  employee_type: 'full_time',
  employee_status: 'active',
  location: 'India',
  tenure_months: 24,
  department: 'Engineering',
};

const SUGGESTED_REQUEST =
  'I got married two weeks ago and want to add my wife to my health insurance plan.';

type CheckResult = {
  check: string;
  passed: boolean;
  details: string;
};

type LiveCaseResult = {
  matched_workflow: string;
  intent: string;
  checks: CheckResult[];
  documents_needed: string[];
  recommended_action: string;
  escalation_required: boolean;
  escalation_reason: string;
  confidence: number;
};

const mockResponse: LiveCaseResult = {
  matched_workflow: 'add_dependent',
  intent: 'Add spouse to health insurance',
  checks: [
    { check: 'Employee Status', passed: true, details: 'Active employee confirmed' },
    { check: 'Employee Type', passed: true, details: 'Full-time employee eligible for benefits' },
    { check: 'Qualifying Event', passed: true, details: 'Marriage is a qualifying life event' },
    { check: 'Enrollment Window', passed: true, details: 'Within 30-day window (14 days since event)' },
    { check: 'Supported Location', passed: true, details: 'India is a supported geography' },
  ],
  documents_needed: ['Marriage certificate'],
  recommended_action: 'Approve dependent addition. Request marriage certificate for verification.',
  escalation_required: false,
  escalation_reason: '',
  confidence: 0.95,
};

export default function LiveCasePage() {
  const [requestText, setRequestText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<LiveCaseResult | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!requestText.trim()) return;

    setIsProcessing(true);
    setResult(null);
    setIsConfirmed(false);
    setError(null);

    try {
      const res = await fetch('/api/live-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_text: requestText,
          employee: defaultEmployee,
        }),
      });

      if (!res.ok) {
        throw new Error('API call failed');
      }

      const data: LiveCaseResult = await res.json();
      setResult(data);
    } catch (e: any) {
      console.warn('API error:', e);
      setError(e.message || 'Failed to process request');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Live Execution Environment
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Process unstructured employee requests through the validated automation policy engine.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 text-sm font-medium">
            <Brain className="w-4 h-4" />
            AI-Powered
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4 flex items-center gap-2 uppercase tracking-wider">
                <User className="w-4 h-4" />
                Employee Context
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-lg font-medium text-[var(--text-primary)]">
                    {defaultEmployee.name}
                  </div>
                  <div className="text-sm text-[var(--text-muted)] font-mono mt-0.5">
                    {defaultEmployee.employee_id}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-primary)] capitalize">
                      {defaultEmployee.department} · {defaultEmployee.employee_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-primary)]">
                      {defaultEmployee.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-[var(--text-primary)]">
                      {defaultEmployee.tenure_months} months tenure
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--success-muted)] text-[var(--success)] text-xs font-medium uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    {defaultEmployee.employee_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[var(--border)]">
                <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
                  Employee Request
                </label>
                <div className="relative">
                  <textarea
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    placeholder="Type an employee request..."
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 text-[var(--text-primary)] min-h-[100px] resize-none focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-muted)]"
                  />
                  {!requestText && (
                    <button
                      onClick={() => setRequestText(SUGGESTED_REQUEST)}
                      className="absolute bottom-3 right-3 text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      Use preset suggestion
                    </button>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing || !requestText.trim()}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                      isProcessing || !requestText.trim()
                        ? "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]"
                        : "bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90"
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Process Request
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[var(--bg)] min-h-[400px]">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] space-y-4 pt-12"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin" />
                        <Brain className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent)]" />
                      </div>
                      <p className="animate-pulse">Analyzing context & policies...</p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-[var(--error)] space-y-4 pt-12"
                    >
                      <AlertTriangle className="w-12 h-12" />
                      <p className="text-center font-medium">Failed to process request</p>
                      <p className="text-sm text-[var(--error)]/80">{error}</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">
                            {result.intent}
                          </h3>
                          <div className="flex gap-3 items-center text-sm">
                            <span className="px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border)] rounded text-[var(--text-secondary)] font-mono text-xs">
                              Workflow: {result.matched_workflow}
                            </span>
                            <span className="text-[var(--text-muted)]">•</span>
                            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
                              Confidence: {(result.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5">
                        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-4">
                          Policy Checks
                        </h4>
                        <div className="space-y-3">
                          {result.checks.map((check, idx) => (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx}
                              className="flex gap-3"
                            >
                              <div className="mt-0.5 shrink-0">
                                {check.passed ? (
                                  <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-[var(--error)]" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                  {check.check}
                                </div>
                                <div className="text-sm text-[var(--text-secondary)] mt-0.5">
                                  {check.details}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {result.documents_needed.length > 0 && (
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg p-5">
                          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Required Documents
                          </h4>
                          <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
                            {result.documents_needed.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className={cn(
                        "rounded-lg p-5 border",
                        result.escalation_required
                          ? "bg-[var(--warning)]/10 border-[var(--warning)]/20"
                          : "bg-[var(--success)]/10 border-[var(--success)]/20"
                      )}>
                        <div className="flex gap-3">
                          <div className="mt-0.5 shrink-0">
                            {result.escalation_required ? (
                              <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                              Recommended Action
                            </div>
                            <div className={cn(
                              "text-sm",
                              result.escalation_required ? "text-[var(--warning)]" : "text-[var(--success)]"
                            )}>
                              {result.recommended_action}
                              {result.escalation_reason.trim() !== '' && (
                                <span className="block mt-1 font-medium">
                                  Reason: {result.escalation_reason}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {!result.escalation_required && (
                        <div className="pt-2 flex justify-end">
                          {isConfirmed ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 text-[var(--success)] font-medium px-4 py-2"
                            >
                              <Check className="w-5 h-5" />
                              {result.matched_workflow.replace(/_/g, ' ')} update prepared. Confirmation sent to employee.
                            </motion.div>
                          ) : (
                            <button
                              onClick={() => setIsConfirmed(true)}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--text-primary)]/90 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Confirm Change
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] space-y-4 pt-12">
                      <Brain className="w-12 h-12 opacity-20" />
                      <p>Enter an employee request to analyze policies</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
