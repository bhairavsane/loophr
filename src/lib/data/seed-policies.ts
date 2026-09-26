import type { PolicyDocument } from '@/lib/types';

export const seedPolicies: PolicyDocument[] = [
  {
    id: 'benefits_enrollment',
    title: 'Benefits Enrollment Policy',
    version: 'benefits_2026_v2',
    effective_date: '2026-01-01',
    sections: [
      {
        id: 'sec_4_1',
        title: 'Eligibility',
        text: 'Only active full-time employees eligible for benefits. Contractors/interns not eligible.',
        rules: [
          {
            id: 'rule_4_1_a',
            condition: 'employee_type === "full_time" && employee_status === "active"',
            expected_action: 'allow_enrollment',
            enforcement: 'strict',
          },
          {
            id: 'rule_4_1_b',
            condition: 'employee_type === "contractor" || employee_type === "intern"',
            expected_action: 'deny_enrollment',
            enforcement: 'strict',
          },
        ],
      },
      {
        id: 'sec_4_2',
        title: 'Qualifying Life Events',
        text: 'Dependents may be added within 30 days of a qualifying life event (marriage, birth, adoption, legal guardianship). Beyond 30 days requires Benefits Operations exception review.',
        rules: [
          {
            id: 'rule_4_2_a',
            condition: 'event_date <= 30_days_ago',
            expected_action: 'process_normally',
            enforcement: 'strict',
          },
          {
            id: 'rule_4_2_b',
            condition: 'event_date > 30_days_ago',
            expected_action: 'escalate_to_benefits_ops',
            enforcement: 'strict',
          },
        ],
      },
      {
        id: 'sec_4_3',
        title: 'Required Documentation',
        text: 'Marriage certificate for spouse, birth certificate for child, court order for legal guardianship. Document must be verified before processing.',
        rules: [
          {
            id: 'rule_4_3_a',
            condition: 'missing_documentation',
            expected_action: 'request_documents',
            enforcement: 'strict',
          },
        ],
      },
      {
        id: 'sec_4_4',
        title: 'Supported Geographies',
        text: 'Benefits enrollment available in US, India, UK, Germany, Singapore only. Other locations require manual review.',
        rules: [
          {
            id: 'rule_4_4_a',
            condition: 'location in ["US", "India", "UK", "Germany", "Singapore"]',
            expected_action: 'process_normally',
            enforcement: 'recommended',
          },
          {
            id: 'rule_4_4_b',
            condition: 'location not in ["US", "India", "UK", "Germany", "Singapore"]',
            expected_action: 'manual_review',
            enforcement: 'strict',
          },
        ],
      },
    ],
  },
  {
    id: 'employment_verification',
    title: 'Employment Verification Policy',
    version: 'hr_policy_2026_v1',
    effective_date: '2026-01-01',
    sections: [
      {
        id: 'sec_7_1',
        title: 'Eligibility',
        text: 'Active and recently terminated (within 90 days) employees.',
        rules: [
          {
            id: 'rule_7_1_a',
            condition: 'employee_status === "active" || (employee_status === "terminated" && termination_date <= 90_days_ago)',
            expected_action: 'process_request',
            enforcement: 'strict',
          },
        ],
      },
      {
        id: 'sec_7_2',
        title: 'Processing',
        text: 'Standard letter generated within 2 business days. Must include job title, employment dates, salary only if employee authorizes.',
        rules: [
          {
            id: 'rule_7_2_a',
            condition: 'salary_requested && !employee_authorization',
            expected_action: 'exclude_salary_info',
            enforcement: 'strict',
          },
        ],
      },
    ],
  },
  {
    id: 'address_update',
    title: 'Address Update Policy',
    version: 'hr_policy_2026_v1',
    effective_date: '2026-01-01',
    sections: [
      {
        id: 'sec_3_1',
        title: 'Process',
        text: 'Employee submits new address. Update processed in HRIS within 1 business day. Tax implications reviewed for cross-state/cross-country moves.',
        rules: [
          {
            id: 'rule_3_1_a',
            condition: 'cross_state_or_country_move',
            expected_action: 'trigger_tax_review',
            enforcement: 'strict',
          },
        ],
      },
    ],
  },
  {
    id: 'remote_work',
    title: 'Remote Work Policy',
    version: 'remote_work_2025_v3',
    effective_date: '2025-07-01',
    sections: [
      {
        id: 'sec_9_1',
        title: 'Eligibility',
        text: 'Active employees with >6 months tenure. Requires manager approval.',
        rules: [
          {
            id: 'rule_9_1_a',
            condition: 'tenure_months > 6 && manager_approval',
            expected_action: 'approve_remote_work',
            enforcement: 'strict',
          },
          {
            id: 'rule_9_1_b',
            condition: 'tenure_months <= 6',
            expected_action: 'deny_remote_work',
            enforcement: 'recommended',
          },
        ],
      },
      {
        id: 'sec_9_2',
        title: 'International',
        text: 'Remote work from outside home country requires tax review and legal compliance check. Max 30 days/year without special approval.',
        rules: [
          {
            id: 'rule_9_2_a',
            condition: 'international_remote_days > 30 && !special_approval',
            expected_action: 'escalate_to_legal',
            enforcement: 'strict',
          },
        ],
      },
      {
        id: 'sec_9_3',
        title: 'Equipment',
        text: 'Company provides standard equipment for approved remote workers.',
        rules: [
          {
            id: 'rule_9_3_a',
            condition: 'remote_work_approved',
            expected_action: 'trigger_equipment_provisioning',
            enforcement: 'recommended',
          },
        ],
      },
    ],
  },
];
