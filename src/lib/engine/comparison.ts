import type { ReplayClassification, PolicyRule } from '@/lib/types';

export function classifyReplayResult(
  automationOutcome: string,
  historicalOutcome: string,
  policyExpectedOutcome: string
): ReplayClassification {
  if (policyExpectedOutcome === 'unknown') return 'unknown';

  if (
    automationOutcome === policyExpectedOutcome &&
    historicalOutcome === policyExpectedOutcome
  ) {
    return 'match';
  }

  if (
    automationOutcome === policyExpectedOutcome &&
    historicalOutcome !== policyExpectedOutcome
  ) {
    return 'policy_drift';
  }

  if (
    automationOutcome !== policyExpectedOutcome &&
    historicalOutcome === policyExpectedOutcome
  ) {
    return 'automation_mismatch';
  }

  return 'unknown';
}

export function evaluatePolicy(
  policyRules: PolicyRule[],
  caseAttributes: Record<string, string | number | boolean>
): string {
  // Hardcoded for add_dependent based on blueprint
  if (caseAttributes.employee_status !== 'active') return 'escalated';
  if (caseAttributes.employee_type !== 'full_time') return 'escalated';

  const daysSince =
    typeof caseAttributes.days_since_event === 'number'
      ? caseAttributes.days_since_event
      : Infinity;
  
  if (daysSince > 45) return 'rejected';
  if (daysSince > 30) return 'escalated';

  const validLocations = ['US', 'India', 'UK', 'Germany', 'Singapore'];
  if (!validLocations.includes(caseAttributes.location as string))
    return 'escalated';

  const validEvents = ['marriage', 'birth', 'adoption', 'legal_guardianship'];
  if (!validEvents.includes(caseAttributes.qualifying_event as string))
    return 'escalated';

  return 'approved';
}
