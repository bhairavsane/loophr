'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Workflow,
  ShieldCheck,
  History,
  MessageSquare,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const navSections = [
  {
    title: 'Discovery & Architecture',
    items: [
      { href: '/discover', label: 'Discover', icon: Search, step: 1 },
      { href: '/process/add_dependent', label: 'Process', icon: Workflow, step: 2 },
    ]
  },
  {
    title: 'Testing & Audit',
    items: [
      { href: '/review/add_dependent', label: 'Policy Review', icon: ShieldCheck, step: 3 },
      { href: '/replay/add_dependent', label: 'Replay', icon: History, step: 4 },
      { href: '/live', label: 'Live Case', icon: MessageSquare, step: 5 },
    ]
  }
];

import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isUnlocked, setIsUnlocked] = React.useState(false);

  React.useEffect(() => {
    const checkUnlocked = () => {
      setIsUnlocked(localStorage.getItem('loophr_demo_unlocked') === 'true');
    };
    
    checkUnlocked(); // Initial check
    window.addEventListener('demo_unlocked', checkUnlocked);
    
    return () => window.removeEventListener('demo_unlocked', checkUnlocked);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[220px] flex-col border-r border-[var(--border)] bg-[var(--bg)]">
        {/* Logo */}
        <Link href="/" className="flex h-14 items-center gap-3 border-b border-[var(--border)] px-4 transition-opacity hover:opacity-80 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center bg-white rounded-md shrink-0 shadow-sm p-1">
            <Image 
              src="/images/logo_loophr.png" 
              alt="LoopHR Logo" 
              width={22} 
              height={22} 
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)]">LoopHR</span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-6 p-4 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-2">
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const requiresUnlock = item.step === 2 || item.step === 3 || item.step === 4;
                const isDisabled = requiresUnlock && !isUnlocked;

                return (
                  <Link
                    key={item.href}
                    href={isDisabled ? '#' : item.href}
                    onClick={(e) => isDisabled && e.preventDefault()}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium shadow-sm border border-[var(--border)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] border border-transparent',
                      isDisabled && 'opacity-50 pointer-events-none'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-3 flex flex-col gap-4">
          <ThemeToggle />
          <p className="text-[11px] text-[var(--text-muted)]">
            Discover → Reconstruct → Replay → Automate
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
        <div className="mx-auto max-w-[1280px] p-6">{children}</div>
      </main>
    </div>
  );
}
