import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getGroqClient, MODEL_ID } from '@/lib/ai/client';

const RequestSchema = z.object({
  request_text: z.string().min(1).max(1000),
  employee: z.object({
    employee_id: z.string(),
    name: z.string(),
    employee_type: z.enum(['full_time', 'part_time', 'contractor', 'intern']),
    employee_status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
    location: z.string(),
    tenure_months: z.number(),
    department: z.string(),
  }),
});

const LiveCaseResultSchema = z.object({
  matched_workflow: z.string(),
  intent: z.string(),
  checks: z.array(
    z.object({
      check: z.string(),
      passed: z.boolean(),
      details: z.string(),
    }),
  ),
  documents_needed: z.array(z.string()),
  recommended_action: z.string(),
  escalation_required: z.boolean(),
  escalation_reason: z.string().describe("Provide reason if escalated, otherwise empty string"),
  confidence: z.number().min(0).max(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.parse(body);

    const groq = getGroqClient();
    const { object } = await generateObject({
      model: groq(MODEL_ID),
      schema: LiveCaseResultSchema,
      prompt: `You are an HR automation system processing employee requests.

Employee context:
- Name: ${parsed.employee.name}
- ID: ${parsed.employee.employee_id}
- Type: ${parsed.employee.employee_type}
- Status: ${parsed.employee.employee_status}
- Location: ${parsed.employee.location}
- Tenure: ${parsed.employee.tenure_months} months
- Department: ${parsed.employee.department}

Employee request: "${parsed.request_text}"

Based on standard HR policies:
- Benefits enrollment (add_dependent): requires active full-time employees. Dependents can be added within 30 days of qualifying life event (marriage, birth, adoption). Required docs: marriage/birth certificate. Supported: US, India, UK, Germany, Singapore.
- Employment verification letters (employment_letter): available for active and recently terminated employees.
- Address updates (address_update): processed within 1 business day.
- Remote work (remote_work): requires >6 months tenure and manager approval.
- Relocation reimbursement (relocation): only available for Director level and above, or if explicitly stated in the offer letter. Requires HR Director approval. Standard reimbursement cap is $10k.
- Leave balance queries (leave_balance): automatically processed.

Determine:
1. What workflow this request maps to
2. What checks pass or fail given the employee context
3. What documents are needed
4. The recommended action (approve and process, or escalate with reason)
5. Your confidence level`,
    });

    return NextResponse.json(object);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Live case error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
