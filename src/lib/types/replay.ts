export type ReplayClassification =
  | 'match'
  | 'correct_escalation'
  | 'policy_drift'
  | 'automation_mismatch'
  | 'unknown';

export interface ReplayResult {
  case_id: string;
  request_text: string;
  automation_outcome: string;
  historical_outcome: string;
  policy_expected_outcome: string;
  classification: ReplayClassification;
  reasoning: string;
}

export interface ReplaySummary {
  workflow_id: string;
  workflow_name: string;
  total: number;
  match: number;
  correct_escalation: number;
  policy_drift: number;
  automation_mismatch: number;
  unknown: number;
  safe_coverage_pct: number;
  human_review_pct: number;
  results: ReplayResult[];
}
