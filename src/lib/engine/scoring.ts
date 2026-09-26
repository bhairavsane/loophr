import type { HRCase, AutomationScore } from '@/lib/types';

export function calculateAutomationScore(cases: HRCase[], category: string): AutomationScore {
  if (!cases || cases.length === 0) {
    return {
      overall: 0,
      processConsistency: 0,
      repetition: 0,
      policyClarity: 0,
      dataAvailability: 0,
      exceptionRate: 0,
      recommendation: 'not_recommended',
      penalties: [],
    };
  }

  const actionSequences = new Set(cases.map((c) => JSON.stringify(c.actions_taken || [])));
  const uniqueCount = actionSequences.size;
  const processConsistency = Math.max(0, 1 - (uniqueCount - 1) / cases.length);

  const repetition = Math.min(100, cases.length) / 100;

  let policyClarity = 0.5;
  if (category === 'benefits_enrollment' || category === 'add_dependent') {
    policyClarity = 0.9;
  }

  const completeCases = cases.filter((c) => c.employee_id && c.category && c.request_text);
  const dataAvailability = completeCases.length / cases.length;

  const exceptions = cases.filter((c) => c.resolution_status === 'escalated' || c.resolution_status === 'rejected');
  const exceptionRate = exceptions.length / cases.length;
  const lowExceptionRate = 1 - exceptionRate;

  let score =
    0.3 * processConsistency +
    0.25 * repetition +
    0.2 * policyClarity +
    0.15 * dataAvailability +
    0.1 * lowExceptionRate;

  const penalties: string[] = [];

  if (exceptionRate > 0.3) {
    penalties.push('High exception rate (sensitive decisions or human discretion)');
    score -= 0.2;
  }

  if (dataAvailability < 0.5) {
    penalties.push('Incomplete data');
    score -= 0.2;
  }

  if (processConsistency < 0.3) {
    penalties.push('Unclear outcomes (inconsistent processes)');
    score -= 0.3;
  }

  score = Math.max(0, Math.min(1, score));

  return {
    overall: Math.round(score * 100),
    processConsistency: Math.round(processConsistency * 100),
    repetition: Math.round(repetition * 100),
    policyClarity: Math.round(policyClarity * 100),
    dataAvailability: Math.round(dataAvailability * 100),
    exceptionRate: Math.round(exceptionRate * 100),
    recommendation: scoreToRecommendation(score),
    penalties,
  };
}

export function scoreToRecommendation(score: number): 'strong' | 'moderate' | 'weak' | 'not_recommended' {
  if (score >= 0.8) return 'strong';
  if (score >= 0.6) return 'moderate';
  if (score >= 0.4) return 'weak';
  return 'not_recommended';
}
