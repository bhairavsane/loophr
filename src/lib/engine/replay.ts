import type {
  HRCase,
  GeneratedWorkflow,
  PolicyDocument,
  ReplayResult,
  ReplaySummary,
  ReplayClassification,
} from '@/lib/types';
import { classifyReplayResult, evaluatePolicy } from './comparison';

export function executeWorkflow(
  workflow: GeneratedWorkflow,
  caseAttributes: Record<string, string | number | boolean>
): string {
  if (!workflow.steps) return 'escalated';

  for (const step of workflow.steps) {
    if (step.type === 'condition' && step.field) {
      const fieldVal = caseAttributes[step.field];
      let pass = false;

      if (step.operator === 'equals' && fieldVal === step.value) {
        pass = true;
      }
      if (
        step.operator === 'in' &&
        typeof step.value === 'string' &&
        step.value.split(',').includes(fieldVal as string)
      ) {
        pass = true;
      }
      if (
        step.operator === 'lte' &&
        typeof fieldVal === 'number' &&
        typeof step.value === 'number' &&
        fieldVal <= step.value
      ) {
        pass = true;
      }

      if (!pass) {
        if (
          step.on_false &&
          (step.on_false.includes('human_review') || step.on_false.includes('escalate'))
        ) {
          return 'escalated';
        }
        if (step.on_false === 'reject') {
          return 'rejected';
        }
        return 'escalated';
      }
    }
  }

  return 'approved';
}

export function replayCase(
  hrCase: HRCase,
  workflow: GeneratedWorkflow,
  policy: PolicyDocument
): ReplayResult {
  const caseAttributes: Record<string, string | number | boolean> = {
    employee_status: hrCase.employee_status || 'unknown',
    employee_type: hrCase.employee_type || 'unknown',
    days_since_event: hrCase.days_since_event ?? Infinity,
    location: hrCase.location || 'unknown',
    qualifying_event: hrCase.qualifying_event || 'unknown',
  };

  const automation_outcome = executeWorkflow(workflow, caseAttributes);

  const policyRules = policy?.sections?.[0]?.rules || [];
  const policy_expected_outcome = evaluatePolicy(policyRules, caseAttributes);

  let historical_outcome = hrCase.final_resolution || 'unknown';
  if (hrCase.resolution_status === 'rejected') historical_outcome = 'rejected';
  else if (hrCase.resolution_status === 'escalated')
    historical_outcome = 'escalated';
  else if (
    hrCase.resolution_status === 'resolved'
  ) {
    historical_outcome = 'approved';
  }

  const classification = classifyReplayResult(
    automation_outcome,
    historical_outcome,
    policy_expected_outcome
  );

  return {
    case_id: hrCase.case_id,
    request_text: hrCase.request_text,
    automation_outcome,
    historical_outcome,
    policy_expected_outcome,
    classification,
    reasoning: `Automation: ${automation_outcome}, Historical: ${historical_outcome}, Policy: ${policy_expected_outcome} -> ${classification}`,
  };
}

export function replayAll(
  cases: HRCase[],
  workflow: GeneratedWorkflow,
  policy: PolicyDocument
): ReplaySummary {
  const results = cases.map((c) => replayCase(c, workflow, policy));

  const total = results.length;
  let match = 0;
  let policy_drift = 0;
  let automation_mismatch = 0;
  let unknown = 0;
  let correct_escalation = 0;

  for (const res of results) {
    if (res.classification === 'match') match++;
    else if (res.classification === 'policy_drift') policy_drift++;
    else if (res.classification === 'automation_mismatch') automation_mismatch++;
    else if (res.classification === 'correct_escalation') correct_escalation++;
    else unknown++;
  }

  const safe_coverage_pct =
    total > 0 ? ((match + correct_escalation) / total) * 100 : 0;
  const human_review_pct =
    total > 0 ? (correct_escalation / total) * 100 : 0;

  return {
    workflow_id: workflow.workflow_id,
    workflow_name: workflow.name,
    total,
    match,
    correct_escalation,
    policy_drift,
    automation_mismatch,
    unknown,
    safe_coverage_pct,
    human_review_pct,
    results,
  };
}
