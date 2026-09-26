export type StepType = 'condition' | 'action' | 'request_document' | 'system_action' | 'human_review';
export type Operator = 'equals' | 'not_equals' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in';

export interface WorkflowStep {
  id: string;
  type: StepType;
  label: string;
  field?: string;
  operator?: Operator;
  value?: string | number | boolean;
  on_true?: string;
  on_false?: string;
  next?: string;
  evidence?: StepEvidence;
}

export interface StepEvidence {
  source: string;
  policy_reference?: string;
  historical_support: number;
  historical_total: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface GeneratedWorkflow {
  workflow_id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  created_at: string;
}

export interface ReconstructedProcess {
  workflow_id: string;
  name: string;
  total_cases: number;
  main_path: ProcessPath;
  variants: ProcessVariant[];
}

export interface ProcessPath {
  steps: ProcessStep[];
  case_count: number;
}

export interface ProcessStep {
  id: string;
  label: string;
  description: string;
  case_count: number;
}

export interface ProcessVariant {
  name: string;
  trigger_condition: string;
  steps: ProcessStep[];
  case_count: number;
}
