import type { HRCase, DiscoveredWorkflow } from '@/lib/types';
import { calculateAutomationScore } from './scoring';

export function clusterAndScore(cases: HRCase[]): DiscoveredWorkflow[] {
  const groups: Record<string, HRCase[]> = {};

  for (const hrCase of cases) {
    const cat = hrCase.category || 'unknown';
    if (!groups[cat]) {
      groups[cat] = [];
    }
    groups[cat].push(hrCase);
  }

  const workflows: DiscoveredWorkflow[] = [];

  for (const [category, categoryCases] of Object.entries(groups)) {
    const automationScore = calculateAutomationScore(categoryCases, category);

    // Average handling time
    const validTimes = categoryCases
      .map((c) => c.handling_time_minutes)
      .filter((t): t is number => typeof t === 'number');
    const avg_handling_time_minutes =
      validTimes.length > 0
        ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
        : 0;

    workflows.push({
      workflow_id: category,
      name: category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      category,
      score: automationScore,
      sample_cases: categoryCases.slice(0, 3).map((c) => c.case_id),
      avg_handling_time_minutes,
      repeatability_pct: automationScore.processConsistency,
      case_count: categoryCases.length,
    });
  }

  workflows.sort((a, b) => b.score.overall - a.score.overall);
  return workflows;
}
