'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
  UserCheck
} from 'lucide-react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  Handle
} from '@xyflow/react';
import { useTheme } from 'next-themes';
import '@xyflow/react/dist/style.css';

// Using unknown to bypass import errors if file doesn't exist during compilation
// but adhering to the requested import path
import policyDataImport from '@/lib/data/cache/policy-comparison.json';
import workflowDataImport from '@/lib/data/cache/generated-workflow.json';

const policyData = policyDataImport as any;
const workflowData = workflowDataImport as any;

// --- Node Types for React Flow ---

const ConditionNode = ({ data }: any) => (
  <div className="relative px-4 py-3 rounded-xl border-2 border-[var(--warning)] bg-[var(--bg-elevated)] shadow-lg min-w-[150px] text-center">
    <Handle type="target" position={Position.Top} className="!bg-[var(--warning)]" />
    <div className="flex items-center justify-center mb-1 text-[var(--warning)]">
      <GitBranch size={16} className="mr-1.5" />
      <span className="text-xs font-bold uppercase tracking-wider">Condition</span>
    </div>
    <div className="text-sm text-[var(--text-primary)] font-medium">{data.label}</div>
    {data.field && (
      <div className="mt-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] py-1 px-2 rounded font-mono">
        {data.field} {data.operator} {data.value}
      </div>
    )}
    <Handle type="source" position={Position.Bottom} className="!bg-[var(--warning)]" />
    {/* Additional handles for left/right if branching, but keeping it simple */}
  </div>
);

const ActionNode = ({ data }: any) => (
  <div className="relative px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-lg min-w-[150px] text-center">
    <Handle type="target" position={Position.Top} className="!bg-[var(--accent)]" />
    <div className="flex items-center justify-center mb-1 text-[var(--accent)]">
      <Settings size={16} className="mr-1.5" />
      <span className="text-xs font-bold uppercase tracking-wider">System Action</span>
    </div>
    <div className="text-sm text-[var(--text-primary)] font-medium">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-[var(--accent)]" />
  </div>
);

const HumanReviewNode = ({ data }: any) => (
  <div className="relative px-4 py-3 rounded-xl border-2 border-[var(--error)] bg-[var(--bg-elevated)] shadow-lg min-w-[150px] text-center">
    <Handle type="target" position={Position.Top} className="!bg-[var(--error)]" />
    <div className="flex items-center justify-center mb-1 text-[var(--error)]">
      <UserCheck size={16} className="mr-1.5" />
      <span className="text-xs font-bold uppercase tracking-wider">Human Review</span>
    </div>
    <div className="text-sm text-[var(--text-primary)] font-medium">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-[var(--error)]" />
  </div>
);

const nodeTypes = {
  condition: ConditionNode,
  action: ActionNode,
  system_action: ActionNode,
  human_review: HumanReviewNode,
  request_document: ActionNode,
};

// --- Page Component ---

import { use } from 'react';

export default function ReviewPage({ params }: { params: Promise<{ workflowId: string }> }) {
  const resolvedParams = use(params);
  const workflowId = resolvedParams.workflowId;
  const [activeTab, setActiveTab] = useState<'policy' | 'automation'>('policy');
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const { resolvedTheme } = useTheme();

  // Generate initial nodes and edges from workflowData
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!workflowData || !workflowData.steps) return { initialNodes: [], initialEdges: [] };
    
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Very naive layout: arrange in a grid based on index, 
    // ideally we'd use dagre for complex layouts but this works for a simple demo
    let yPos = 50;
    
    workflowData.steps.forEach((step: any, idx: number) => {
      // Determine node type mapping
      let type = 'action';
      if (step.type === 'condition') type = 'condition';
      if (step.type === 'human_review') type = 'human_review';
      if (step.type === 'system_action') type = 'system_action';
      if (step.type === 'request_document') type = 'request_document';

      nodes.push({
        id: step.id,
        type,
        position: { x: 250, y: yPos },
        data: { ...step },
      });
      yPos += 150;

      // Edges
      if (step.next) {
        edges.push({
          id: `e-${step.id}-${step.next}`,
          source: step.id,
          target: step.next,
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--text-muted)' },
          style: { stroke: 'var(--text-muted)', strokeWidth: 2 },
        });
      }
      if (step.on_true) {
        edges.push({
          id: `e-${step.id}-${step.on_true}-true`,
          source: step.id,
          target: step.on_true,
          label: 'True',
          labelStyle: { fill: 'var(--success)', fontWeight: 600 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--success)' },
          style: { stroke: 'var(--success)', strokeWidth: 2 },
        });
      }
      if (step.on_false) {
        edges.push({
          id: `e-${step.id}-${step.on_false}-false`,
          source: step.id,
          target: step.on_false,
          label: 'False',
          labelStyle: { fill: 'var(--error)', fontWeight: 600 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--error)' },
          style: { stroke: 'var(--error)', strokeWidth: 2 },
          // Offset x position for branches naively in reality
        });
      }
    });

    // Slight manual adjustment for a demo tree look if we had a specific workflow
    // Here we'll just let them fall vertically and users can drag them
    
    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.data);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--bg)] text-[var(--text-primary)] rounded-xl border border-[var(--border)] overflow-hidden">
        
        {/* Header & Tabs */}
        <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Policy Reconciliation: {workflowData?.name || 'Workflow'}</h1>
            <p className="text-[var(--text-secondary)] text-sm">Auditing proposed automation logic against active corporate policies for compliance.</p>
          </div>
          
          <div className="flex bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('policy')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'policy' 
                  ? "bg-[var(--border)] text-[var(--text-primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Policy vs Reality
            </button>
            <button
              onClick={() => setActiveTab('automation')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'automation' 
                  ? "bg-[var(--border)] text-[var(--text-primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              Proposed Automation
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col">
          
          {/* TAB 1: Policy vs Reality */}
          {activeTab === 'policy' && (
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
          )}

          {/* TAB 2: Proposed Automation */}
          {activeTab === 'automation' && (
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-[var(--bg)]"
                  colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                  minZoom={0.5}
                >
                  <Background color="var(--border)" gap={16} size={1} />
                  <Controls className="!bg-[var(--bg-elevated)] !border-[var(--border)] !text-[var(--text-primary)]" />
                </ReactFlow>
              </div>

              {/* Right Sidebar: Evidence Panel */}
              <div className="w-80 bg-[var(--bg-elevated)] border-l border-[var(--border)] p-5 overflow-y-auto flex flex-col">
                <h3 className="font-medium text-lg border-b border-[var(--border)] pb-3 mb-4">Node Evidence</h3>
                
                {selectedNode ? (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Node Type</div>
                      <div className="capitalize font-medium text-[var(--text-primary)]">{selectedNode.type.replace('_', ' ')}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Label</div>
                      <div className="font-medium text-[var(--text-primary)]">{selectedNode.label}</div>
                    </div>

                    {selectedNode.evidence ? (
                      <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border)] space-y-4">
                        <div>
                          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Source Policy</div>
                          <div className="text-sm text-[var(--accent)] font-medium">{selectedNode.evidence.source}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Historical Support</div>
                          <div className="text-sm text-[var(--text-primary)]">
                            {selectedNode.evidence.historical_support} / {selectedNode.evidence.historical_total} cases
                          </div>
                          <div className="w-full bg-[var(--border)] h-1.5 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="bg-[var(--accent)] h-full" 
                              style={{ width: `${(selectedNode.evidence.historical_support / selectedNode.evidence.historical_total) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">Confidence</div>
                          <span className={cn(
                            "inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase",
                            selectedNode.evidence.confidence === 'high' ? "bg-[rgba(34,197,94,0.15)] text-[var(--success)]" :
                            selectedNode.evidence.confidence === 'medium' ? "bg-[rgba(234,179,8,0.15)] text-[var(--warning)]" :
                            "bg-[rgba(239,68,68,0.15)] text-[var(--error)]"
                          )}>
                            {selectedNode.evidence.confidence}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-[var(--text-muted)] italic bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border)] text-center">
                        No specific evidence linked to this node.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] text-center px-4">
                    <Settings size={32} className="mb-3 opacity-50" />
                    <p className="text-sm">Click on any node in the workflow to view its policy evidence and historical support.</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
