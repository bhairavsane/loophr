const fs = require('fs');
const content = fs.readFileSync('src/app/process/[workflowId]/page.tsx', 'utf8');

// 1. Import ProposedAutomation
let newContent = content.replace(
  "import processDataRaw from '@/lib/data/cache/process-add-dependent.json';",
  "import processDataRaw from '@/lib/data/cache/process-add-dependent.json';\nimport { ProposedAutomation } from '@/components/proposed-automation';"
);

// 2. Add activeView state
newContent = newContent.replace(
  "  const [activeTab, setActiveTab] = useState<string>('main');",
  "  const [activeTab, setActiveTab] = useState<string>('main');\n  const [activeView, setActiveView] = useState<'process' | 'proposed'>('process');"
);

// 3. Update the header to include the tab toggle and the new Deploy button
const oldHeader = `<header className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/discover" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                Discover
              </Link>
              <ChevronRight className="h-4 w-4 text-[var(--border-strong)]" />
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                Process Architecture: {processData.name}
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              Empirically Reconstructed
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-xs flex items-center gap-1.5 text-[var(--text-primary)]">
                <Users className="h-3 w-3 text-[var(--accent)]" />
                {processData.total_cases} historical case executions
              </span>
            </p>
          </div>
          <Link
            href="/review/add_dependent"
            className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
          >
            Compare with Policy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>`;

const newHeader = `<header className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/discover" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                Discover
              </Link>
              <ChevronRight className="h-4 w-4 text-[var(--border-strong)]" />
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                Process Architecture: {processData.name}
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              Empirically Reconstructed
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-xs flex items-center gap-1.5 text-[var(--text-primary)]">
                <Users className="h-3 w-3 text-[var(--accent)]" />
                {processData.total_cases} historical case executions
              </span>
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-[var(--bg-elevated)] p-1 rounded-lg border border-[var(--border)]">
              <button
                onClick={() => setActiveView('process')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeView === 'process' 
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Historical Process
              </button>
              <button
                onClick={() => setActiveView('proposed')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeView === 'proposed' 
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                Proposed Automation
              </button>
            </div>
          
            <button
              onClick={() => alert('Automation deployed to Workday successfully!\\n\\nIn a real environment, this connects via Merge.dev or direct Workday REST APIs.')}
              className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              Approve & Deploy
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>`;

newContent = newContent.replace(oldHeader, newHeader);

// 4. Wrap the flex-1 content in activeView condition
const oldBody = `<div className="flex flex-1 overflow-hidden">
          {/* React Flow Canvas */}
          <div className="flex-1 h-full relative">`;

const newBody = `        {activeView === 'proposed' && <ProposedAutomation />}

        {activeView === 'process' && (
        <div className="flex flex-1 overflow-hidden">
          {/* React Flow Canvas */}
          <div className="flex-1 h-full relative">`;

newContent = newContent.replace(oldBody, newBody);

// Close the wrapper
newContent = newContent.replace(
  `                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>`,
  `                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </AppShell>`
);

fs.writeFileSync('src/app/process/[workflowId]/page.tsx', newContent);
