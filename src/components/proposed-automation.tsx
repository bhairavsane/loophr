'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  GitBranch,
  Settings,
  UserCheck,
  FileText
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

import workflowDataImport from '@/lib/data/cache/generated-workflow.json';

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
  </div>
);

const ActionNode = ({ data }: any) => (
  <div className="relative px-4 py-3 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-lg min-w-[150px] text-center">
    <Handle type="target" position={Position.Top} className="!bg-[var(--accent)]" />
    <div className="flex items-center justify-center mb-1 text-[var(--accent)]">
      <Settings size={16} className="mr-1.5" />
      <span className="text-xs font-bold uppercase tracking-wider">Action</span>
    </div>
    <div className="text-sm text-[var(--text-primary)] font-medium">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-[var(--accent)]" />
  </div>
);

const DocumentNode = ({ data }: any) => (
  <div className="relative px-4 py-3 rounded-xl border border-[var(--info)] bg-[var(--bg-elevated)] shadow-lg min-w-[150px] text-center">
    <Handle type="target" position={Position.Top} className="!bg-[var(--info)]" />
    <div className="flex items-center justify-center mb-1 text-[var(--info)]">
      <FileText size={16} className="mr-1.5" />
      <span className="text-xs font-bold uppercase tracking-wider">Request</span>
    </div>
    <div className="text-sm text-[var(--text-primary)] font-medium">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-[var(--info)]" />
  </div>
);

const HumanReviewNode = ({ data }: any) => (
  <div className="relative px-4 py-3 rounded-xl border-2 border-[var(--error)] bg-[var(--bg-elevated)] shadow-lg min-w-[150px] text-center">
    <Handle type="target" position={Position.Top} className="!bg-[var(--error)]" />
    <div className="flex items-center justify-center mb-1 text-[var(--error)]">
      <UserCheck size={16} className="mr-1.5" />
      <span className="text-xs font-bold uppercase tracking-wider">Escalate</span>
    </div>
    <div className="text-sm text-[var(--text-primary)] font-medium">{data.label}</div>
    <Handle type="source" position={Position.Bottom} className="!bg-[var(--error)]" />
  </div>
);

const nodeTypes = {
  condition: ConditionNode,
  action: ActionNode,
  system_action: ActionNode,
  request_document: DocumentNode,
  human_review: HumanReviewNode,
};

export function ProposedAutomation() {
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const { resolvedTheme } = useTheme();

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let yOffset = 50;

    workflowData.steps.forEach((step: any, index: number) => {
      let xOffset = 250;

      if (step.type === 'human_review') {
        xOffset = 550;
        yOffset -= 150; 
      }

      nodes.push({
        id: step.id,
        type: step.type,
        position: { x: xOffset, y: yOffset },
        data: { ...step },
      });

      if (step.next) {
        edges.push({
          id: `e-${step.id}-${step.next}`,
          source: step.id,
          target: step.next,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'var(--border-strong)', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-strong)' },
        });
      }

      if (step.on_true) {
        edges.push({
          id: `e-${step.id}-${step.on_true}-true`,
          source: step.id,
          target: step.on_true,
          label: 'Yes',
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'var(--success)', strokeWidth: 2 },
          labelBgStyle: { fill: 'var(--bg-surface)' },
          labelStyle: { fill: 'var(--success)', fontWeight: 600 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--success)' },
        });
      }

      if (step.on_false) {
        edges.push({
          id: `e-${step.id}-${step.on_false}-false`,
          source: step.id,
          target: step.on_false,
          label: 'No',
          type: 'step',
          animated: true,
          style: { stroke: 'var(--error)', strokeWidth: 2 },
          labelBgStyle: { fill: 'var(--bg-surface)' },
          labelStyle: { fill: 'var(--error)', fontWeight: 600 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--error)' },
        });
      }

      if (step.type !== 'human_review') {
        yOffset += 150;
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.data);
  }, []);

  return (
    <div className="flex-1 flex h-full overflow-hidden">
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
        <h3 className="font-medium text-lg border-b border-[var(--border)] pb-3 mb-4 text-[var(--text-primary)]">Node Evidence</h3>
        
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
                  <div className="text-xs text-[var(--text-secondary)] mb-1">Origin Source</div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{selectedNode.evidence.source}</div>
                </div>
                
                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-xs text-[var(--text-secondary)] mb-2">Historical Support</div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-2xl font-semibold text-[var(--accent)]">
                      {Math.round((selectedNode.evidence.historical_support / selectedNode.evidence.historical_total) * 100)}%
                    </span>
                    <span className="text-sm text-[var(--text-muted)] mb-1">
                      ({selectedNode.evidence.historical_support}/{selectedNode.evidence.historical_total} cases)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent)] rounded-full"
                      style={{ width: `${(selectedNode.evidence.historical_support / selectedNode.evidence.historical_total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                  <div className="text-xs text-[var(--text-secondary)] mb-1">AI Confidence</div>
                  <div className="capitalize text-sm font-medium text-[var(--success)]">
                    {selectedNode.evidence.confidence}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-[var(--text-muted)] italic">
                No supporting evidence explicitly linked to this node.
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-[var(--text-muted)] text-center mt-10">
            Click on a node in the graph to view its AI-generated evidence and historical support.
          </div>
        )}
      </div>
    </div>
  );
}
