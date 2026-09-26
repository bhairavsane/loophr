'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { cn } from '@/lib/utils';
import { ArrowRight, Users, ChevronRight, Radio } from 'lucide-react';
import Link from 'next/link';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  type Node, 
  type Edge,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import { useTheme } from 'next-themes';
import '@xyflow/react/dist/style.css';
// @ts-ignore
import processDataRaw from '@/lib/data/cache/process-add-dependent.json';
import { ProposedAutomation } from '@/components/proposed-automation';
import { DeployModal } from '@/components/deploy-modal';

type ReconstructedProcess = {
  workflow_id: string;
  name: string;
  total_cases: number;
  main_path: {
    steps: Array<{ id: string; label: string; description: string; case_count: number }>;
    case_count: number;
  };
  variants: Array<{
    name: string;
    trigger_condition: string;
    steps: Array<{ id: string; label: string; description: string; case_count: number }>;
    case_count: number;
  }>;
};

const processData = processDataRaw as ReconstructedProcess;

function ProcessNode({ data }: { data: { label: string; caseCount: number; isMainPath: boolean } }) {
  return (
    <div className={cn(
      'rounded-md border px-4 py-2.5 text-sm min-w-[200px] shadow-sm',
      data.isMainPath
        ? 'border-[var(--accent)] bg-[var(--bg-surface)]'
        : 'border-[var(--border)] bg-[var(--bg-elevated)]'
    )}>
      <Handle type="target" position={Position.Top} className="!bg-[var(--border-strong)]" />
      <div className="font-medium text-[var(--text-primary)]">{data.label}</div>
      <div className="text-xs text-[var(--text-muted)] mt-1">{data.caseCount} cases</div>
      <Handle type="source" position={Position.Bottom} className="!bg-[var(--border-strong)]" />
    </div>
  );
}

const nodeTypes = {
  custom: ProcessNode,
};

import { use } from 'react';

export default function ProcessPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const resolvedParams = use(params);
  const workflowId = resolvedParams.workflowId;
  const [activeTab, setActiveTab] = useState<string>('main');
  const [activeView, setActiveView] = useState<'process' | 'proposed'>('process');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const check = () => setIsDeployed(localStorage.getItem('loophr_deployed') === 'true');
    check();
    window.addEventListener('loophr_deployed', check);
    return () => window.removeEventListener('loophr_deployed', check);
  }, []);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yPos = 50;

    // Main path nodes
    processData.main_path.steps.forEach((step, index) => {
      nodes.push({
        id: step.id,
        type: 'custom',
        position: { x: 300, y: yPos },
        data: { label: step.label, caseCount: step.case_count, isMainPath: true },
      });

      if (index > 0) {
        edges.push({
          id: `e-${processData.main_path.steps[index - 1].id}-${step.id}`,
          source: processData.main_path.steps[index - 1].id,
          target: step.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'var(--accent)' },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent)' },
        });
      }
      yPos += 120;
    });

    // Variant nodes
    processData.variants.forEach((variant, vIdx) => {
      let varYPos = 170 + (vIdx * 240); // Offset each variant group
      
      variant.steps.forEach((step, index) => {
        const nodeId = `v-${vIdx}-${step.id}`;
        nodes.push({
          id: nodeId,
          type: 'custom',
          position: { x: 650, y: varYPos },
          data: { label: step.label, caseCount: step.case_count, isMainPath: false },
        });

        if (index === 0) {
          // Connect first variant step to first main step as a mock trigger point
          edges.push({
            id: `e-main0-${nodeId}`,
            source: processData.main_path.steps[0].id,
            target: nodeId,
            type: 'smoothstep',
            animated: true,
            style: { stroke: 'var(--border-strong)', strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-strong)' },
          });
        } else {
          edges.push({
            id: `e-v-${vIdx}-${variant.steps[index - 1].id}-${step.id}`,
            source: `v-${vIdx}-${variant.steps[index - 1].id}`,
            target: nodeId,
            type: 'smoothstep',
            style: { stroke: 'var(--border-strong)' },
            markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-strong)' },
          });
        }
        varYPos += 120;
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--bg)] rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <header className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/discover" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                Discover
              </Link>
              <ChevronRight className="h-4 w-4 text-[var(--border-strong)]" />
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                Process Architecture: {processData.name}
              </h1>
              {isDeployed && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.3)] text-[var(--success)] text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
                  </span>
                  Status: Live on SAP SuccessFactors
                </span>
              )}
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
              onClick={() => setIsDeployModalOpen(true)}
              className="flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              Approve & Deploy
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>

                {activeView === 'proposed' && <ProposedAutomation />}

        {activeView === 'process' && (
        <div className="flex flex-1 overflow-hidden">
          {/* React Flow Canvas */}
          <div className="flex-1 h-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[var(--bg)]"
              colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
            >
              <Background color="var(--border-strong)" gap={16} size={1} />
              <Controls className="!bg-[var(--bg-surface)] !border-[var(--border)] !fill-[var(--text-primary)]" />
            </ReactFlow>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-[var(--border)] bg-[var(--bg-surface)] flex flex-col shrink-0">
            <div className="p-4 border-b border-[var(--border)]">
              <h3 className="font-medium text-[var(--text-primary)] mb-4">Process Paths</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveTab('main')}
                  className={cn(
                    'text-left px-3 py-2 rounded-md text-sm transition-colors border',
                    activeTab === 'main'
                      ? 'bg-[var(--info-muted)] border-[var(--accent)] text-[var(--text-primary)]'
                      : 'bg-[var(--bg-elevated)] border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  )}
                >
                  <div className="font-medium">Main Path</div>
                  <div className="text-xs opacity-80 mt-0.5">{processData.main_path.case_count} cases</div>
                </button>
                
                {processData.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(`var-${idx}`)}
                    className={cn(
                      'text-left px-3 py-2 rounded-md text-sm transition-colors border',
                      activeTab === `var-${idx}`
                        ? 'bg-[var(--bg-elevated)] border-[var(--border-strong)] text-[var(--text-primary)]'
                        : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                    )}
                  >
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-xs opacity-80 mt-0.5">{variant.case_count} cases</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'main' ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-2">
                    Standard Operating Procedure
                  </h4>
                  {processData.main_path.steps.map((step, idx) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-[var(--border)] pb-4 last:pb-0 last:border-transparent">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--accent)]" />
                      <div className="font-medium text-sm text-[var(--text-primary)]">{step.label}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">{step.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {processData.variants.map((variant, idx) => {
                    if (activeTab !== `var-${idx}`) return null;
                    return (
                      <div key={idx}>
                        <div className="mb-4 p-3 rounded-md bg-[var(--warning-muted)] border border-[var(--warning)] border-opacity-20">
                          <div className="text-xs font-medium text-[var(--warning)] uppercase mb-1">Trigger Condition</div>
                          <div className="text-sm text-[var(--text-primary)]">{variant.trigger_condition}</div>
                        </div>
                        <h4 className="text-sm font-medium text-[var(--text-primary)] border-b border-[var(--border)] pb-2 mb-4">
                          Exception Steps
                        </h4>
                        {variant.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="relative pl-6 border-l-2 border-[var(--border)] pb-4 last:pb-0 last:border-transparent">
                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-strong)]" />
                            <div className="font-medium text-sm text-[var(--text-primary)]">{step.label}</div>
                            <div className="text-xs text-[var(--text-muted)] mt-1">{step.description}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
      <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} />
    </AppShell>
  );
}
