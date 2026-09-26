export type Enforcement = 'strict' | 'recommended' | 'discretionary';

export interface PolicyRule {
  id: string;
  condition: string;
  expected_action: string;
  enforcement: Enforcement;
}

export interface PolicySection {
  id: string;
  title: string;
  text: string;
  rules: PolicyRule[];
}

export interface PolicyDocument {
  id: string;
  title: string;
  version: string;
  effective_date: string;
  sections: PolicySection[];
}

export interface PolicyDrift {
  policy_rule_id: string;
  policy_text: string;
  expected_behavior: string;
  observed_behavior: string;
  compliant_cases: number;
  non_compliant_cases: number;
  drift_severity: 'low' | 'medium' | 'high';
  details: string;
}

export interface PolicyComparison {
  policy_id: string;
  workflow_id: string;
  total_cases_analyzed: number;
  drifts: PolicyDrift[];
  overall_compliance_rate: number;
  time_buckets: TimeBucket[];
}

export interface TimeBucket {
  label: string;
  range: string;
  total: number;
  approved: number;
  escalated: number;
  rejected: number;
}
