'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { cn } from '@/lib/utils';
// @ts-ignore
import discoveryData from '@/lib/data/cache/discovery.json';

type DiscoveredWorkflow = {
  workflow_id: string;
  name: string;
  category: string;
  case_count: number;
  avg_handling_time_minutes: number;
  repeatability_pct: number;
  score: {
    overall: number;
    processConsistency: number;
    repetition: number;
    policyClarity: number;
    dataAvailability: number;
    exceptionRate: number;
    penalties: string[];
    recommendation: 'strong' | 'moderate' | 'weak' | 'not_recommended';
  };
  sample_cases: string[];
};

const ANALYSIS_STEPS = [
  { id: 1, text: 'Request types identified', delay: 300 },
  { id: 2, text: 'Similar cases clustered', delay: 600 },
  { id: 3, text: 'Repeated actions reconstructed', delay: 900 },
  { id: 4, text: 'Resolution patterns analyzed', delay: 1200 },
  { id: 5, text: 'Automation opportunities scored', delay: 1500 },
];

export default function DiscoverPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const workflows = discoveryData as DiscoveredWorkflow[];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsUploading(true);
      
      // Simulate network upload
      setTimeout(() => {
        setIsUploading(false);
        startAnalysis();
      }, 1500);
    }
  };

  const startAnalysis = () => {
    const timers = ANALYSIS_STEPS.map((step) =>
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id]);
        if (step.id === ANALYSIS_STEPS[ANALYSIS_STEPS.length - 1].id) {
          setTimeout(() => setAnalysisComplete(true), 500);
        }
      }, step.delay)
    );
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-2">
            What should HR stop doing manually?
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Analyzing historical data to identify repetitive tasks.
          </p>
        </header>

        {/* Upload Zone & Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <label className={cn(
            "border border-dashed border-[var(--border-strong)] rounded-xl p-8 flex flex-col items-center justify-center bg-[var(--bg-surface)] transition-colors relative",
            !file ? "hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] cursor-pointer" : ""
          )}>
            {!file && <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />}
            
            <div className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors",
              file ? "bg-[var(--success-muted)]" : "bg-[var(--bg-elevated)]"
            )}>
              {file && !isUploading ? (
                <CheckCircle2 className="h-8 w-8 text-[var(--success)]" />
              ) : (
                <FileText className={cn("h-8 w-8", file ? "text-[var(--success)]" : "text-[var(--accent)]")} />
              )}
            </div>
            
            <div className="text-[var(--text-primary)] font-medium mb-1 text-center">
              {file ? file.name : "Upload historical cases (CSV)"}
            </div>
            
            <div className="text-[var(--text-muted)] text-sm text-center">
              {file ? "350 cases loaded" : "Drag and drop or click to browse"}
            </div>
            
            {isUploading && (
              <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-[200px]">
                <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "linear" }}
                    className="h-full bg-[var(--accent)] rounded-full"
                  />
                </div>
                <span className="text-xs text-[var(--text-muted)]">Uploading...</span>
              </div>
            )}
            
            {file && !isUploading && (
              <div className="mt-4 px-3 py-1 rounded-full bg-[var(--success-muted)] text-[var(--success)] text-xs font-medium border border-[var(--border)]">
                Ready for analysis
              </div>
            )}
          </label>

          <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-surface)] flex flex-col justify-center">
            <h3 className="text-[var(--text-primary)] font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
              Analysis Progress
            </h3>
            <div className="space-y-3">
              {ANALYSIS_STEPS.map((step) => {
                const isComplete = completedSteps.includes(step.id);
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-5 w-5 rounded-full bg-[var(--success-muted)] flex items-center justify-center"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" />
                      </motion.div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-[var(--border-strong)] flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                      </div>
                    )}
                    <span
                      className={cn(
                        'text-sm transition-colors duration-300',
                        isComplete ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                      )}
                    >
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <AnimatePresence>
          {analysisComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex items-center justify-between border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-primary)]">
                    <CheckCircle className="h-4 w-4 text-[var(--success)]" />
                    8 repetitive workflows discovered
                  </span>
                  <span>·</span>
                  <span>Estimated 450+ hours/year of repetitive work</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {workflows.map((workflow) => {
                  const isDemoHighlight = workflow.name === 'Add Dependent to Insurance';
                  const recommendationColors = {
                    strong: 'bg-[var(--success-muted)] text-[var(--success)]',
                    moderate: 'bg-[var(--warning-muted)] text-[var(--warning)]',
                    weak: 'bg-[var(--error-muted)] text-[var(--error)]',
                    not_recommended: 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                  };

                  return (
                    <Link
                      href={`/process/${workflow.workflow_id}`}
                      key={workflow.workflow_id}
                      className={cn(
                        'group flex flex-col p-5 rounded-xl border transition-all duration-200',
                        isDemoHighlight
                          ? 'border-[var(--accent)] bg-[var(--info-muted)] hover:bg-[var(--bg-hover)]'
                          : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)]'
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-[var(--text-primary)] text-base leading-tight group-hover:text-[var(--accent)] transition-colors">
                          {workflow.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-4">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {workflow.case_count} cases
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workflow.avg_handling_time_minutes}m avg
                        </span>
                      </div>

                      <div className="mt-auto space-y-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-[var(--text-secondary)]">Repeatability</span>
                            <span className="text-[var(--text-primary)]">{workflow.repeatability_pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--accent)] rounded-full"
                              style={{ width: `${workflow.repeatability_pct}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md',
                            recommendationColors[workflow.score.recommendation]
                          )}>
                            {workflow.score.recommendation.replace('_', ' ')}
                          </span>
                        </div>

                        {workflow.score.penalties && workflow.score.penalties.length > 0 && (
                          <div className="flex items-start gap-1.5 text-xs text-[var(--error)] mt-2">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            <span className="opacity-90">{workflow.score.penalties[0]}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
