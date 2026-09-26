import { z } from 'zod';

export const BatchClassificationSchema = z.object({
  classifications: z.array(
    z.object({
      case_id: z.string(),
      category: z.string(),
      intent: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
});

export const ProcessReconstructionSchema = z.object({
  workflow_id: z.string(),
  name: z.string(),
  total_cases: z.number(),
  main_path: z.object({
    steps: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string(),
        case_count: z.number(),
      })
    ),
    case_count: z.number(),
  }),
  variants: z.array(
    z.object({
      name: z.string(),
      trigger_condition: z.string(),
      steps: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          description: z.string(),
          case_count: z.number(),
        })
      ),
      case_count: z.number(),
    })
  ),
});

export const PolicyComparisonSchema = z.object({
  policy_id: z.string(),
  workflow_id: z.string(),
  total_cases_analyzed: z.number(),
  overall_compliance_rate: z.number(),
  drifts: z.array(
    z.object({
      policy_rule_id: z.string(),
      policy_text: z.string(),
      expected_behavior: z.string(),
      observed_behavior: z.string(),
      compliant_cases: z.number(),
      non_compliant_cases: z.number(),
      drift_severity: z.enum(['low', 'medium', 'high']),
      details: z.string(),
    })
  ),
  time_buckets: z.array(
    z.object({
      label: z.string(),
      range: z.string(),
      total: z.number(),
      approved: z.number(),
      escalated: z.number(),
      rejected: z.number(),
    })
  ),
});

export const GeneratedWorkflowSchema = z.object({
  workflow_id: z.string(),
  name: z.string(),
  description: z.string(),
  trigger: z.string(),
  steps: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['condition', 'action', 'request_document', 'system_action', 'human_review']),
      label: z.string(),
      field: z.string().optional(),
      operator: z.enum(['equals', 'not_equals', 'gt', 'gte', 'lt', 'lte', 'in', 'not_in']).optional(),
      value: z.union([z.string(), z.number(), z.boolean()]).optional(),
      on_true: z.string().optional(),
      on_false: z.string().optional(),
      next: z.string().optional(),
      evidence: z.object({
        source: z.string(),
        policy_reference: z.string().optional(),
        historical_support: z.number(),
        historical_total: z.number(),
        confidence: z.enum(['high', 'medium', 'low']),
      }).optional(),
    })
  ),
  created_at: z.string(),
});

export const LiveCaseResultSchema = z.object({
  matched_workflow: z.string(),
  intent: z.string(),
  checks: z.array(
    z.object({
      check: z.string(),
      passed: z.boolean(),
      details: z.string(),
    })
  ),
  documents_needed: z.array(z.string()),
  recommended_action: z.string(),
  escalation_required: z.boolean(),
  escalation_reason: z.string().optional(),
  confidence: z.number().min(0).max(1),
});
