const fs = require('fs');

const cases = [];
let caseCounter = 1;
let empCounter = 1001;

function generateId() {
  return 'HR-' + String(caseCounter++).padStart(4, '0');
}
function generateEmpId() {
  return 'EMP-' + String(Math.floor(Math.random() * 9000) + 1000);
}

function randArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDate() {
  const start = new Date('2025-01-01T00:00:00Z').getTime();
  const end = new Date('2026-09-01T00:00:00Z').getTime();
  return new Date(start + Math.random() * (end - start)).toISOString();
}

function createCase(base) {
  return {
    case_id: generateId(),
    created_at: generateDate(),
    employee_id: generateEmpId(),
    employee_type: randArray(['full_time', 'full_time', 'full_time', 'part_time', 'intern']),
    employee_status: randArray(['active', 'active', 'active', 'on_leave', 'inactive']),
    location: randArray(['India', 'US', 'UK', 'Germany', 'Singapore']),
    tenure_months: randInt(1, 120),
    approval_required: false,
    resolution_status: 'resolved',
    policy_version: 'hr_policy_2026_v1',
    ...base
  };
}

// 1. Add Dependent
const addDependentEdgeCases = [
  // 5 cases: days_since_event is 31-45 AND final_resolution is 'approved'
  ...Array(5).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'Need to add my newborn. It has been a bit over a month, hope this is fine.',
    hr_reply: 'Approved your dependent addition despite being slightly past the window.',
    actions_taken: ['checked_employee_status', 'verified_qualifying_event', 'checked_event_date', 'document_verified', 'updated_benefits', 'sent_confirmation'],
    documents_requested: ['birth_certificate'],
    final_resolution: 'approved',
    resolution_status: 'resolved',
    days_since_event: randInt(31, 45),
    qualifying_event: 'birth',
    handling_time_minutes: randInt(15, 25),
    policy_version: 'benefits_2026_v2'
  })),
  // 3 cases: days_since_event is 31-45 AND resolution_status is 'escalated'
  ...Array(3).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'Adding wife to insurance. We got married last month.',
    hr_reply: 'Your request is outside the standard 30-day window. Escalating to benefits ops.',
    actions_taken: ['checked_employee_status', 'verified_qualifying_event', 'checked_event_date', 'enrollment_window_expired', 'escalated_to_benefits_ops'],
    documents_requested: ['marriage_certificate'],
    final_resolution: 'Escalated for exception review',
    resolution_status: 'escalated',
    days_since_event: randInt(31, 45),
    qualifying_event: 'marriage',
    handling_time_minutes: randInt(20, 30),
    policy_version: 'benefits_2026_v2'
  })),
  // 7 cases: days_since_event is >45 AND resolution_status is 'escalated'
  ...Array(7).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'I want to add my husband to the health plan. We married a few months ago.',
    hr_reply: 'Since the marriage was more than 45 days ago, I have escalated this for special review.',
    actions_taken: ['checked_employee_status', 'checked_event_date', 'enrollment_window_expired', 'escalated_to_benefits_ops'],
    documents_requested: ['marriage_certificate'],
    final_resolution: 'Pending exception approval from Ops',
    resolution_status: 'escalated',
    days_since_event: randInt(46, 100),
    qualifying_event: 'marriage',
    handling_time_minutes: randInt(20, 30),
    policy_version: 'benefits_2026_v2'
  })),
  // 3 cases with employee_status: 'inactive'
  ...Array(3).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'Adding dependent to my coverage.',
    hr_reply: 'You are currently listed as inactive. Your benefits are suspended.',
    actions_taken: ['checked_employee_status', 'rejected_due_to_status'],
    documents_requested: [],
    final_resolution: 'Rejected - Employee inactive',
    resolution_status: 'rejected',
    employee_status: 'inactive',
    days_since_event: randInt(5, 20),
    qualifying_event: 'birth',
    handling_time_minutes: randInt(10, 20),
    policy_version: 'benefits_2026_v2'
  })),
  // 4 cases with employee_type: 'contractor'
  ...Array(4).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'Can I add my kid to my insurance plan?',
    hr_reply: 'Contractors are not eligible for company health insurance plans.',
    actions_taken: ['checked_employee_status', 'rejected_due_to_type'],
    documents_requested: [],
    final_resolution: 'Rejected - Contractors not eligible',
    resolution_status: 'rejected',
    employee_type: 'contractor',
    days_since_event: randInt(1, 10),
    qualifying_event: 'birth',
    handling_time_minutes: randInt(5, 10),
    policy_version: 'benefits_2026_v2'
  })),
  // 5 cases missing doc verified
  ...Array(5).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'Adding my spouse to my plan.',
    hr_reply: 'Please provide your marriage certificate to proceed.',
    actions_taken: ['checked_employee_status', 'verified_qualifying_event', 'requested_marriage_certificate'],
    documents_requested: ['marriage_certificate'],
    final_resolution: 'Pending document upload',
    resolution_status: 'pending',
    days_since_event: randInt(5, 25),
    qualifying_event: 'marriage',
    handling_time_minutes: randInt(10, 15),
    policy_version: 'benefits_2026_v2'
  })),
  // 2 cases location: Brazil
  ...Array(2).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'Need to add spouse for health benefits in Brazil.',
    hr_reply: 'We do not currently support benefit modifications for Brazil via this portal.',
    actions_taken: ['checked_location', 'escalated_to_regional_hr'],
    documents_requested: [],
    final_resolution: 'Escalated to Brazil HR',
    resolution_status: 'escalated',
    location: 'Brazil',
    days_since_event: randInt(5, 20),
    qualifying_event: 'marriage',
    handling_time_minutes: randInt(15, 25),
    policy_version: 'benefits_2026_v2'
  })),
  // 1 case contradictory data
  ...Array(1).fill(0).map(() => createCase({
    category: 'add_dependent',
    request_text: 'adding my son',
    hr_reply: 'All looks good. I have approved the request.',
    actions_taken: ['checked_employee_status', 'document_verified', 'approved'],
    documents_requested: ['birth_certificate'],
    final_resolution: 'approved',
    resolution_status: 'rejected',
    days_since_event: randInt(1, 15),
    qualifying_event: 'birth',
    handling_time_minutes: randInt(10, 20),
    policy_version: 'benefits_2026_v2'
  }))
];

const addDependentHappyCount = 73 - addDependentEdgeCases.length;
const addDependentHappyCases = Array(addDependentHappyCount).fill(0).map(() => createCase({
  category: 'add_dependent',
  request_text: randArray([
    'Hi, I recently got married and need to add my wife to my health plan. What do I need to do?',
    'I just had a baby and need to add them to my insurance. Please advise.',
    'Need to add my husband to my benefits. Got married last weekend.',
    'Adopted a child, would like to add them to medical plan.'
  ]),
  hr_reply: 'Your dependent has been added to your benefits plan successfully.',
  actions_taken: ['checked_employee_status', 'verified_qualifying_event', 'checked_event_date', 'requested_marriage_certificate', 'document_verified', 'updated_benefits', 'sent_confirmation'],
  documents_requested: randArray([['marriage_certificate'], ['birth_certificate'], ['adoption_papers']]),
  final_resolution: 'Dependent added',
  resolution_status: 'resolved',
  employee_status: 'active',
  employee_type: 'full_time',
  days_since_event: randInt(1, 30),
  qualifying_event: randArray(['marriage', 'birth', 'adoption']),
  handling_time_minutes: randInt(10, 25),
  policy_version: 'benefits_2026_v2'
}));

const allAddDependentCases = [...addDependentEdgeCases, ...addDependentHappyCases];

function generateNormalCases(count, category, timeMin, timeMax, requests, hrReplies, actions, docs, pols) {
  return Array(count).fill(0).map(() => {
    const isEdge = Math.random() < 0.15;
    return createCase({
      category,
      request_text: randArray(requests),
      hr_reply: isEdge ? 'We are reviewing your request.' : randArray(hrReplies),
      actions_taken: actions,
      documents_requested: randArray(docs),
      final_resolution: isEdge ? 'Pending review' : 'Resolved',
      resolution_status: isEdge ? randArray(['pending', 'escalated']) : 'resolved',
      handling_time_minutes: randInt(timeMin, timeMax),
      policy_version: randArray(pols)
    });
  });
}

const employmentLetterCases = generateNormalCases(61, 'employment_letter', 5, 12,
  ['need employment verification letter for apartment lease ASAP', 'Can I get a letter of employment?', 'Proof of employment needed for bank loan.'],
  ['Attached is your employment letter.', 'Your verification letter has been generated.'],
  ['verified_employee', 'generated_letter', 'sent_to_employee'],
  [[], []],
  ['hr_policy_2026_v1']
);

const addressUpdateCases = generateNormalCases(48, 'address_update', 3, 8,
  ['Can someone help me update my address? I moved last month', 'I relocated, need to change address.', 'Update my home address in the system please.'],
  ['Address has been updated successfully.', 'Your profile is updated with the new address.'],
  ['verified_identity', 'updated_address', 'notified_payroll'],
  [[], ['proof_of_address']],
  ['hr_policy_2026_v1']
);

const leaveBalanceCases = generateNormalCases(42, 'leave_balance', 3, 7,
  ['How many PTO days do I have left?', 'Can you check my sick leave balance?', 'Need to know my vacation accrual.'],
  ['You have 15 days of PTO remaining.', 'Your current sick leave balance is 5 days.'],
  ['checked_leave_system', 'replied_with_balance'],
  [[], []],
  ['hr_policy_2026_v1']
);

const remoteWorkCases = generateNormalCases(39, 'remote_work', 15, 35,
  ['I would like to request to work fully remote.', 'Can I WFH for the next 2 months?', 'Requesting remote work arrangement due to personal reasons.'],
  ['Your remote work request has been approved by your manager.', 'Please fill out the remote work agreement form.'],
  ['checked_policy', 'sent_to_manager_for_approval', 'approved_by_manager', 'updated_work_arrangement'],
  [[], ['remote_work_agreement']],
  ['remote_work_2025_v3']
);

const personalInfoUpdateCases = generateNormalCases(35, 'personal_info_update', 4, 10,
  ['Need to change my emergency contact.', 'Update my phone number to 555-1234.', 'I got married, need to update my last name.'],
  ['Your personal information has been updated.', 'Emergency contact saved.'],
  ['verified_identity', 'updated_profile', 'saved_changes'],
  [[], ['name_change_document']],
  ['hr_policy_2026_v1']
);

const payrollDocCases = generateNormalCases(28, 'payroll_document', 5, 15,
  ['I need my last 3 pay stubs.', 'Can you send my W-2 tax form?', 'Where can I find my salary certificate?'],
  ['Attached are your requested payroll documents.', 'You can download your tax forms from the portal.'],
  ['verified_identity', 'generated_documents', 'sent_to_employee'],
  [[], []],
  ['hr_policy_2026_v1']
);

const onboardingDocsCases = generateNormalCases(24, 'onboarding_docs', 8, 20,
  ['I think I missed uploading some onboarding docs.', 'Where do I submit my ID proof for onboarding?', 'Are my background check forms complete?'],
  ['Please upload your missing ID proof to the portal.', 'All your onboarding documents are now complete.'],
  ['checked_document_checklist', 'identified_missing_docs', 'notified_employee'],
  [['id_proof'], ['bank_details'], []],
  ['hr_policy_2026_v1']
);

const allCases = [
  ...allAddDependentCases,
  ...employmentLetterCases,
  ...addressUpdateCases,
  ...leaveBalanceCases,
  ...remoteWorkCases,
  ...personalInfoUpdateCases,
  ...payrollDocCases,
  ...onboardingDocsCases
];

const tsFileContent = "import type { HRCase } from '@/lib/types';\n\nexport const seedCases: HRCase[] = " + JSON.stringify(allCases, null, 2) + ";\n";

const fsObj = require('fs');
const path = require('path');
const outPath = '/Users/bhairav/Documents/VSCode-Projects/hr-automation-bpf2026/src/lib/data/seed-cases.ts';
fsObj.mkdirSync(path.dirname(outPath), { recursive: true });
fsObj.writeFileSync(outPath, tsFileContent, 'utf-8');
console.log('Generated successfully!');
