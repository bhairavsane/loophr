'use client';

import { useRouter } from "next/navigation";
import * as React from "react";
import { Upload, ArrowRight, Zap, ShieldCheck, GitBranch } from 'lucide-react';

import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

export default function HomePage() {
  const router = useRouter();

  // Reset the demo lock state whenever someone lands on the root page
  // This allows the user to do multiple dry runs of the pitch seamlessly
  React.useEffect(() => {
    localStorage.removeItem('loophr_demo_unlocked');
    window.dispatchEvent(new Event('demo_unlocked')); // Fire event to update AppShell immediately
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-4 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white rounded-[8px] p-2 shadow-sm inline-flex items-center justify-center">
            <Image 
              src="/images/logo_loophr.png" 
              alt="LoopHR Logo" 
              width={100} 
              height={26} 
              className="object-contain"
            />
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
          Automate HR Operations with
          <br />
          Zero Compliance Risk.
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-[var(--text-secondary)]">
          LoopHR passively analyzes historical case data to discover hidden workflows, 
          reconciles them against corporate policy, and deterministically backtests 
          automation rules prior to deployment.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push('/discover')}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Initialize Discovery Engine
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Feature pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: GitBranch, label: 'Empirical Process Discovery' },
            { icon: ShieldCheck, label: 'Policy Reconciliation' },
            { icon: Zap, label: 'Deterministic Backtesting' },
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
