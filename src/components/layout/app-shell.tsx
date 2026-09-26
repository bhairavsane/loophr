'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  GitBranch,
  PlayCircle,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { href: '/discover', label: 'Discover', icon: Search, step: 1 },
  { href: '/process/add_dependent', label: 'Process', icon: GitBranch, step: 2 },
  { href: '/review/add_dependent', label: 'Review', icon: ChevronRight, step: 3 },
  { href: '/replay/add_dependent', label: 'Replay', icon: PlayCircle, step: 4 },
  { href: '/live', label: 'Live Case', icon: MessageSquare, step: 5 },
];

import Image from 'next/image';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[220px] flex-col border-r border-[var(--border)] bg-[var(--bg)]">
        {/* Logo */}
        <Link href="/" className="flex h-14 items-center gap-2 border-b border-[var(--border)] px-4 transition-opacity hover:opacity-80">
          <Image 
            src="/images/logo_loophr.png" 
            alt="LoopHR Logo" 
            width={120} 
            height={32} 
            className="object-contain"
          />
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                <span
                  className={cn(
                    'ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium',
                    isActive
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)]',
                  )}
                >
                  {item.step}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-3">
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
