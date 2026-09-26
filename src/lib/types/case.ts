export type EmployeeType = 'full_time' | 'part_time' | 'contractor' | 'intern';
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';
export type ResolutionStatus = 'resolved' | 'escalated' | 'pending' | 'rejected';

export interface HRCase {
  case_id: string;
  created_at: string;
  employee_id: string;
  employee_type: EmployeeType;
  employee_status: EmployeeStatus;
  location: string;
  tenure_months: number;
  request_text: string;
  category: string;
  hr_reply: string;
  actions_taken: string[];
  documents_requested: string[];
  approval_required: boolean;
  final_resolution: string;
  resolution_status: ResolutionStatus;
  handling_time_minutes: number;
  policy_version: string;
  days_since_event?: number;
  qualifying_event?: string;
}

export interface NormalizedCase extends HRCase {
  intent: string;
  attributes: Record<string, string | number | boolean>;
  observed_actions: string[];
  confidence: number;
}

export interface ClassifiedCase {
  case_id: string;
  category: string;
  intent: string;
  confidence: number;
}
