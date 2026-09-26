export interface AutomationScore {
  overall: number;
  processConsistency: number;
  repetition: number;
  policyClarity: number;
  dataAvailability: number;
  exceptionRate: number;
  penalties: string[];
  recommendation: 'strong' | 'moderate' | 'weak' | 'not_recommended';
}

export interface DiscoveredWorkflow {
  workflow_id: string;
  name: string;
  category: string;
  case_count: number;
  avg_handling_time_minutes: number;
  repeatability_pct: number;
  score: AutomationScore;
  sample_cases: string[];
}
