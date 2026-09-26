const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/lib/data/cache');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const discovery = [
  {
    "workflow_id": "add_dependent",
    "name": "Add Dependent to Insurance",
    "category": "add_dependent",
    "case_count": 73,
    "avg_handling_time_minutes": 17,
    "repeatability_pct": 91,
    "score": {
      "overall": 82,
      "processConsistency": 85,
      "repetition": 73,
      "policyClarity": 90,
      "dataAvailability": 88,
      "exceptionRate": 16,
      "penalties": [],
      "recommendation": "strong"
    },
    "sample_cases": ["HR-0001", "HR-0005", "HR-0012"]
  },
  {
    "workflow_id": "employment_letter",
    "name": "Employment Verification Letter",
    "category": "employment_letter",
    "case_count": 61,
    "avg_handling_time_minutes": 8,
    "repeatability_pct": 98,
    "score": {
      "overall": 95,
      "processConsistency": 97,
      "repetition": 61,
      "policyClarity": 95,
      "dataAvailability": 96,
      "exceptionRate": 3,
      "penalties": [],
      "recommendation": "strong"
    },
    "sample_cases": ["HR-0074", "HR-0078", "HR-0082"]
  },
  {
    "workflow_id": "address_update",
    "name": "Address Update",
    "category": "address_update",
    "case_count": 48,
    "avg_handling_time_minutes": 6,
    "repeatability_pct": 99,
    "score": {
      "overall": 93,
      "processConsistency": 98,
      "repetition": 48,
      "policyClarity": 95,
      "dataAvailability": 96,
      "exceptionRate": 1,
      "penalties": [],
      "recommendation": "strong"
    },
    "sample_cases": ["HR-0120", "HR-0121", "HR-0122"]
  },
  {
    "workflow_id": "leave_balance",
    "name": "Leave Balance Inquiry",
    "category": "leave_balance",
    "case_count": 42,
    "avg_handling_time_minutes": 5,
    "repeatability_pct": 97,
    "score": {
      "overall": 91,
      "processConsistency": 95,
      "repetition": 42,
      "policyClarity": 95,
      "dataAvailability": 92,
      "exceptionRate": 2,
      "penalties": [],
      "recommendation": "strong"
    },
    "sample_cases": ["HR-0160", "HR-0161", "HR-0162"]
  },
  {
    "workflow_id": "personal_info_update",
    "name": "Personal Info Update",
    "category": "personal_info_update",
    "case_count": 35,
    "avg_handling_time_minutes": 7,
    "repeatability_pct": 96,
    "score": {
      "overall": 88,
      "processConsistency": 92,
      "repetition": 35,
      "policyClarity": 90,
      "dataAvailability": 88,
      "exceptionRate": 4,
      "penalties": [],
      "recommendation": "strong"
    },
    "sample_cases": ["HR-0200", "HR-0201", "HR-0202"]
  },
  {
    "workflow_id": "payroll_document",
    "name": "Payroll Document Request",
    "category": "payroll_document",
    "case_count": 28,
    "avg_handling_time_minutes": 10,
    "repeatability_pct": 94,
    "score": {
      "overall": 85,
      "processConsistency": 88,
      "repetition": 28,
      "policyClarity": 85,
      "dataAvailability": 85,
      "exceptionRate": 6,
      "penalties": [],
      "recommendation": "strong"
    },
    "sample_cases": ["HR-0240", "HR-0241", "HR-0242"]
  },
  {
    "workflow_id": "onboarding_docs",
    "name": "Onboarding Documents",
    "category": "onboarding_docs",
    "case_count": 24,
    "avg_handling_time_minutes": 14,
    "repeatability_pct": 88,
    "score": {
      "overall": 78,
      "processConsistency": 80,
      "repetition": 24,
      "policyClarity": 75,
      "dataAvailability": 70,
      "exceptionRate": 12,
      "penalties": [],
      "recommendation": "moderate"
    },
    "sample_cases": ["HR-0280", "HR-0281", "HR-0282"]
  },
  {
    "workflow_id": "remote_work",
    "name": "Remote Work Request",
    "category": "remote_work",
    "case_count": 39,
    "avg_handling_time_minutes": 24,
    "repeatability_pct": 63,
    "score": {
      "overall": 56,
      "processConsistency": 60,
      "repetition": 39,
      "policyClarity": 50,
      "dataAvailability": 60,
      "exceptionRate": 35,
      "penalties": ["High human discretion", "Policy ambiguity"],
      "recommendation": "weak"
    },
    "sample_cases": ["HR-0320", "HR-0321", "HR-0322"]
  }
];

fs.writeFileSync(path.join(dir, 'discovery.json'), JSON.stringify(discovery, null, 2));

const processData = {
  "workflow_id": "add_dependent",
  "name": "Add Dependent to Insurance",
  "total_cases": 73,
  "main_path": {
    "steps": [
      { "id": "receive_request", "label": "Receive Employee Request", "description": "Employee submits request to add dependent", "case_count": 73 },
      { "id": "check_employee", "label": "Check Employee Profile", "description": "Verify employee status, type, and eligibility", "case_count": 73 },
      { "id": "verify_event", "label": "Verify Qualifying Event", "description": "Confirm qualifying life event (marriage, birth, adoption)", "case_count": 68 },
      { "id": "check_window", "label": "Check Enrollment Window", "description": "Verify request is within 30-day enrollment window", "case_count": 61 },
      { "id": "request_document", "label": "Request Documentation", "description": "Request marriage certificate, birth certificate, or court order", "case_count": 58 },
      { "id": "verify_document", "label": "Verify Document", "description": "Validate submitted documentation", "case_count": 53 },
      { "id": "update_benefits", "label": "Update Benefits System", "description": "Process dependent addition in benefits system", "case_count": 53 },
      { "id": "send_confirmation", "label": "Send Confirmation", "description": "Send confirmation to employee", "case_count": 53 }
    ],
    "case_count": 53
  },
  "variants": [
    {
      "name": "Late Enrollment",
      "trigger_condition": "Request submitted more than 30 days after qualifying event",
      "steps": [
        { "id": "receive_request", "label": "Receive Employee Request", "description": "Employee submits late request", "case_count": 12 },
        { "id": "check_employee", "label": "Check Employee Profile", "description": "Verify employee status", "case_count": 12 },
        { "id": "verify_event", "label": "Verify Qualifying Event", "description": "Confirm event type", "case_count": 12 },
        { "id": "check_window", "label": "Check Enrollment Window", "description": "Event date exceeds 30-day window", "case_count": 12 },
        { "id": "escalate_benefits_ops", "label": "Escalate to Benefits Operations", "description": "Route to Benefits Ops for exception review", "case_count": 7 },
        { "id": "approved_without_review", "label": "Approved Without Review", "description": "Approved despite policy requiring review (policy drift)", "case_count": 5 }
      ],
      "case_count": 12
    },
    {
      "name": "Missing Document",
      "trigger_condition": "Required documentation not provided or incomplete",
      "steps": [
        { "id": "receive_request", "label": "Receive Employee Request", "description": "Employee submits request", "case_count": 5 },
        { "id": "check_employee", "label": "Check Employee Profile", "description": "Verify employee status", "case_count": 5 },
        { "id": "request_document", "label": "Request Documentation", "description": "Request required certificate", "case_count": 5 },
        { "id": "follow_up", "label": "Follow Up on Document", "description": "Multiple follow-ups sent to employee", "case_count": 5 },
        { "id": "pending_resolution", "label": "Pending Resolution", "description": "Case remains pending awaiting documentation", "case_count": 3 }
      ],
      "case_count": 5
    },
    {
      "name": "Ineligible Employee",
      "trigger_condition": "Employee is inactive, contractor, or intern",
      "steps": [
        { "id": "receive_request", "label": "Receive Employee Request", "description": "Employee submits request", "case_count": 7 },
        { "id": "check_employee", "label": "Check Employee Profile", "description": "Employee status/type check fails", "case_count": 7 },
        { "id": "notify_ineligible", "label": "Notify Ineligibility", "description": "Inform employee of ineligibility", "case_count": 4 },
        { "id": "escalate_hr", "label": "Escalate to HR Manager", "description": "Route to HR for review of special cases", "case_count": 3 }
      ],
      "case_count": 7
    },
    {
      "name": "Unsupported Location",
      "trigger_condition": "Employee location is not in supported geography list",
      "steps": [
        { "id": "receive_request", "label": "Receive Employee Request", "description": "Employee from unsupported location", "case_count": 2 },
        { "id": "check_employee", "label": "Check Employee Profile", "description": "Location not in supported list", "case_count": 2 },
        { "id": "escalate_international", "label": "Escalate to International HR", "description": "Route to international HR team", "case_count": 2 }
      ],
      "case_count": 2
    }
  ]
};

fs.writeFileSync(path.join(dir, 'process-add-dependent.json'), JSON.stringify(processData, null, 2));

const policyData = {
  "policy_id": "benefits_enrollment",
  "workflow_id": "add_dependent",
  "total_cases_analyzed": 73,
  "overall_compliance_rate": 89.0,
  "drifts": [
    {
      "policy_rule_id": "benefits_4.2_window",
      "policy_text": "Dependents may be added within 30 days of a qualifying life event. Requests beyond 30 days require Benefits Operations exception review.",
      "expected_behavior": "Requests after 30 days should be escalated for exception review",
      "observed_behavior": "5 cases between days 31-45 were approved directly without recorded exception review",
      "compliant_cases": 63,
      "non_compliant_cases": 5,
      "drift_severity": "high",
      "details": "17% of late requests (5 out of 12 cases beyond 30 days) were approved without the required Benefits Operations exception review. This represents a significant policy drift that could expose the organization to compliance risk."
    },
    {
      "policy_rule_id": "benefits_4.1_eligibility",
      "policy_text": "Only active full-time employees are eligible for benefits enrollment.",
      "expected_behavior": "Contractors, interns, and inactive employees should be rejected or escalated",
      "observed_behavior": "All contractor and inactive employee requests were correctly escalated",
      "compliant_cases": 73,
      "non_compliant_cases": 0,
      "drift_severity": "low",
      "details": "No eligibility drift detected. All ineligible requests were properly escalated."
    },
    {
      "policy_rule_id": "benefits_4.3_documentation",
      "policy_text": "Required documentation (marriage certificate, birth certificate, or court order) must be verified before processing.",
      "expected_behavior": "Dependent addition should not be processed without verified documentation",
      "observed_behavior": "2 cases were processed with approval despite no document verification recorded",
      "compliant_cases": 66,
      "non_compliant_cases": 2,
      "drift_severity": "medium",
      "details": "2 cases show dependent addition was approved without documented verification of required certificates. This could indicate either incomplete case records or a documentation bypass."
    }
  ],
  "time_buckets": [
    { "label": "Within 30 days", "range": "≤ 30 days", "total": 58, "approved": 53, "escalated": 3, "rejected": 2 },
    { "label": "31-45 days", "range": "31-45 days", "total": 8, "approved": 5, "escalated": 3, "rejected": 0 },
    { "label": "Over 45 days", "range": "> 45 days", "total": 7, "approved": 0, "escalated": 7, "rejected": 0 }
  ]
};

fs.writeFileSync(path.join(dir, 'policy-comparison.json'), JSON.stringify(policyData, null, 2));

const workflowData = {
  "workflow_id": "add_dependent",
  "name": "Add Dependent to Insurance",
  "description": "Automated workflow for processing dependent addition requests based on qualifying life events",
  "trigger": "employee_requests_dependent_addition",
  "steps": [
    {
      "id": "check_employee_status",
      "type": "condition",
      "label": "Check Employee Status",
      "field": "employee_status",
      "operator": "equals",
      "value": "active",
      "on_true": "check_employee_type",
      "on_false": "human_review_status",
      "evidence": { "source": "Benefits Policy §4.1", "policy_reference": "benefits_4.1_eligibility", "historical_support": 66, "historical_total": 73, "confidence": "high" }
    },
    {
      "id": "check_employee_type",
      "type": "condition",
      "label": "Check Employee Type",
      "field": "employee_type",
      "operator": "equals",
      "value": "full_time",
      "on_true": "check_qualifying_event",
      "on_false": "human_review_type",
      "evidence": { "source": "Benefits Policy §4.1", "policy_reference": "benefits_4.1_eligibility", "historical_support": 62, "historical_total": 66, "confidence": "high" }
    },
    {
      "id": "check_qualifying_event",
      "type": "condition",
      "label": "Verify Qualifying Event",
      "field": "qualifying_event",
      "operator": "in",
      "value": "marriage,birth,adoption,legal_guardianship",
      "on_true": "check_enrollment_window",
      "on_false": "human_review_event",
      "evidence": { "source": "Benefits Policy §4.2", "policy_reference": "benefits_4.2_window", "historical_support": 62, "historical_total": 62, "confidence": "high" }
    },
    {
      "id": "check_enrollment_window",
      "type": "condition",
      "label": "Check 30-Day Window",
      "field": "days_since_event",
      "operator": "lte",
      "value": 30,
      "on_true": "check_location",
      "on_false": "escalate_benefits_ops",
      "evidence": { "source": "Benefits Policy §4.2", "policy_reference": "benefits_4.2_window", "historical_support": 53, "historical_total": 62, "confidence": "high" }
    },
    {
      "id": "check_location",
      "type": "condition",
      "label": "Check Supported Geography",
      "field": "location",
      "operator": "in",
      "value": "US,India,UK,Germany,Singapore",
      "on_true": "request_certificate",
      "on_false": "escalate_international",
      "evidence": { "source": "Benefits Policy §4.4", "policy_reference": "benefits_4.4_geography", "historical_support": 51, "historical_total": 53, "confidence": "high" }
    },
    {
      "id": "request_certificate",
      "type": "request_document",
      "label": "Request Certificate",
      "next": "validate_document",
      "evidence": { "source": "Benefits Policy §4.3", "policy_reference": "benefits_4.3_documentation", "historical_support": 51, "historical_total": 51, "confidence": "high" }
    },
    {
      "id": "validate_document",
      "type": "action",
      "label": "Validate Document",
      "next": "prepare_change",
      "evidence": { "source": "Benefits Policy §4.3", "historical_support": 49, "historical_total": 51, "confidence": "high" }
    },
    {
      "id": "prepare_change",
      "type": "system_action",
      "label": "Prepare Dependent Addition",
      "next": "send_confirmation",
      "evidence": { "source": "Historical practice", "historical_support": 49, "historical_total": 49, "confidence": "high" }
    },
    {
      "id": "send_confirmation",
      "type": "action",
      "label": "Send Confirmation to Employee",
      "evidence": { "source": "Historical practice", "historical_support": 49, "historical_total": 49, "confidence": "high" }
    },
    {
      "id": "escalate_benefits_ops",
      "type": "human_review",
      "label": "Escalate to Benefits Operations",
      "evidence": { "source": "Benefits Policy §4.2", "policy_reference": "benefits_4.2_window", "historical_support": 7, "historical_total": 12, "confidence": "medium" }
    },
    {
      "id": "escalate_international",
      "type": "human_review",
      "label": "Escalate to International HR",
      "evidence": { "source": "Benefits Policy §4.4", "historical_support": 2, "historical_total": 2, "confidence": "high" }
    },
    {
      "id": "human_review_status",
      "type": "human_review",
      "label": "Human Review — Inactive Employee",
      "evidence": { "source": "Benefits Policy §4.1", "historical_support": 3, "historical_total": 3, "confidence": "high" }
    },
    {
      "id": "human_review_type",
      "type": "human_review",
      "label": "Human Review — Non Full-Time",
      "evidence": { "source": "Benefits Policy §4.1", "historical_support": 4, "historical_total": 4, "confidence": "high" }
    },
    {
      "id": "human_review_event",
      "type": "human_review",
      "label": "Human Review — Unrecognized Event",
      "evidence": { "source": "Benefits Policy §4.2", "historical_support": 0, "historical_total": 0, "confidence": "low" }
    }
  ],
  "created_at": "2026-09-26T12:00:00Z"
};

fs.writeFileSync(path.join(dir, 'generated-workflow.json'), JSON.stringify(workflowData, null, 2));

const requestsMatch = [
  "I got married last week. How do I add my spouse to my insurance?",
  "We just had a baby boy yesterday! I need to add him to my health plan.",
  "I legally adopted my daughter on the 5th and need to enroll her for benefits.",
  "Just got married, can I update my health insurance to family coverage?",
  "My wife had a baby two days ago, we need to add the newborn.",
  "Finalized adoption proceedings this week, wanting to add child to medical.",
  "Got married over the weekend, need to add my husband.",
  "Need to enroll my newborn son on my insurance plan.",
  "I got married on Friday, please help me add my spouse to insurance."
];

const results = [];
for (let i = 1; i <= 73; i++) {
  const caseId = `HR-${String(i).padStart(4, '0')}`;
  
  if (i <= 53) {
    const text = requestsMatch[i % requestsMatch.length];
    results.push({
      case_id: caseId,
      request_text: text,
      automation_outcome: "approved",
      historical_outcome: "approved",
      policy_expected_outcome: "approved",
      classification: "match",
      reasoning: "Active full-time employee, qualifying event within 30-day window, supported location. Automation correctly approves."
    });
  } else if (i <= 63) {
    const isContractor = i % 2 === 0;
    const text = isContractor ? "Hi, I am a contractor here and want to add my spouse." : "My spouse lost their job, I want to add them but I am located in an unsupported region.";
    results.push({
      case_id: caseId,
      request_text: text,
      automation_outcome: "escalated",
      historical_outcome: "escalated",
      policy_expected_outcome: "escalated",
      classification: "correct_escalation",
      reasoning: isContractor ? "Contractors are ineligible for benefits. Automation correctly escalated." : "Unsupported geography. Automation correctly escalated."
    });
  } else if (i <= 68) {
    results.push({
      case_id: caseId,
      request_text: "I got married 40 days ago and forgot to update my insurance. Can I still add my spouse?",
      automation_outcome: "escalated",
      historical_outcome: "approved",
      policy_expected_outcome: "escalated",
      classification: "policy_drift",
      reasoning: "Request submitted after 30-day window. Historically approved without required exception review. Automation correctly escalates based on policy."
    });
  } else if (i <= 71) {
    results.push({
      case_id: caseId,
      request_text: "Had a baby last week, adding them to benefits.",
      automation_outcome: "escalated",
      historical_outcome: "approved",
      policy_expected_outcome: "approved",
      classification: "automation_mismatch",
      reasoning: "Historically approved, but automation halted due to missing document verification step in case history."
    });
  } else {
    results.push({
      case_id: caseId,
      request_text: "Need to update my benefits profile to include my new dependent.",
      automation_outcome: "escalated",
      historical_outcome: "approved",
      policy_expected_outcome: "unknown",
      classification: "unknown",
      reasoning: "Contradictory data regarding employee status or event date in records. Required human review."
    });
  }
}

const replaySummary = {
  "workflow_id": "add_dependent",
  "workflow_name": "Add Dependent to Insurance",
  "total": 73,
  "match": 53,
  "correct_escalation": 10,
  "policy_drift": 5,
  "automation_mismatch": 3,
  "unknown": 2,
  "safe_coverage_pct": 86.3,
  "human_review_pct": 13.7,
  "results": results
};

fs.writeFileSync(path.join(dir, 'replay-results.json'), JSON.stringify(replaySummary, null, 2));

console.log('Successfully generated all 5 cache files');
