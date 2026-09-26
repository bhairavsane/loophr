'use client';

import { useRouter } from 'next/navigation';
import { Upload, ArrowRight, Zap, ShieldCheck, GitBranch } from 'lucide-react';

import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white rounded-[8px] p-2.5 shadow-sm inline-flex items-center justify-center">
            <Image 
              src="/images/logo_loophr.png" 
              alt="LoopHR Logo" 
              width={140} 
              height={36} 
              className="object-contain"
            />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5">
          <Zap className="h-3 w-3 text-[var(--accent)]" />
          <span className="text-xs text-[var(--text-secondary)]">
            AI-powered HR automation discovery
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          Turn yesterday&apos;s work into
          <br />
          tomorrow&apos;s automation.
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-[var(--text-secondary)]">
          LoopHR learns repetitive HR workflows from historical cases and backtests
          the automation against those same real-world cases before HR deploys it.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push('/discover')}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Upload className="h-4 w-4" />
          Analyze HR Cases
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: GitBranch, label: 'Process Discovery' },
            { icon: ShieldCheck, label: 'Policy Reconciliation' },
            { icon: Zap, label: 'Historical Replay' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5"
            >
              <Icon className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-secondary)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
