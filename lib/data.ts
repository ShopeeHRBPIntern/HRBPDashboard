import type {
  CaseSummary,
  DashboardSummaryResponse,
  InternalTransferDetail,
  OnboardingJoinerSummary,
  ProcessCode,
  TimelineEvent
} from "@/types/dashboard";
import { getSheetRecords } from "./google-sheets";

const generatedAt = new Date("2026-06-17T09:00:00.000Z").toISOString();

type CaseRow = {
  case_id: string;
  unique_job_id: string;
  workflow_status: string;
  pending_actor: string;
  next_action: string;
  auto_screen_result: string;
  hrbp_criteria_decision: string;
  salary_check_result: string;
  hrbp_payroll_decision: string;
  current_manager_result: string;
  hrbp_cm_rejectCase_decision: string;
  interview_result: string;
  hrbp_interview_fail_decision: string;
  effective_date: string;
  current_manager_approval: string;
  hod_approval: string;
  transfer_type: string;
  last_event_key: string;
  last_error: string;
  created_at: string;
  updated_at: string;
  closed_at: string;
  message: string;
  channelCode: string;
  HRBP_case: string;
};

type CleanedTransferRow = {
  case_id: string;
  unique_job_id: string;
  join_status: string;
  submitted_at: string;
  candidate_email: string;
  candidate_name: string;
  employee_id: string;
  current_entity: string;
  current_team: string;
  service_months: string;
  current_rank: string;
  resume_link: string;
  choice1_entity: string;
  choice1_role: string;
  hris_employee_id: string;
  hris_display_name: string;
  hris_department: string;
  hris_current_team: string;
  hris_current_title: string;
  hris_reporting_manager: string;
  hris_reporting_manager_email: string;
  hris_yos: string;
  current_performance: string;
  hrbp: string;
  entity_code: string;
  target_team_department_category: string;
  target_category_sub_team: string;
  position_title: string;
  hiring_manager_email: string;
  backfill_or_new_hc: string;
  transfer_type: string;
  cleaned_at: string;
};

const caseRows: CaseRow[] = [
  {
    case_id: "IT-2024-0058",
    unique_job_id: "SPE-PC-0058",
    workflow_status: "INTERVIEWING",
    pending_actor: "PAYROLL",
    next_action: "Waiting for P'Tae salary check result",
    auto_screen_result: "PASS",
    hrbp_criteria_decision: "PASS",
    salary_check_result: "PENDING",
    hrbp_payroll_decision: "PENDING",
    current_manager_result: "",
    hrbp_cm_rejectCase_decision: "",
    interview_result: "",
    hrbp_interview_fail_decision: "",
    effective_date: "",
    current_manager_approval: "",
    hod_approval: "",
    transfer_type: "INTERNAL_TRANSFER",
    last_event_key: "it:0058:salary-check",
    last_error: "",
    created_at: "2024-05-20T10:30:00.000Z",
    updated_at: "2024-05-20T11:30:00.000Z",
    closed_at: "",
    message: "Auto message sent to P'Tae for salary check",
    channelCode: "SEATALK_HRBP_GROUP",
    HRBP_case: "HRBP_MAIN"
  },
  {
    case_id: "IT-2024-0061",
    unique_job_id: "SPE-MKT-0061",
    workflow_status: "SALARY_CHECK_PENDING",
    pending_actor: "PAYROLL",
    next_action: "Salary eligibility response required",
    auto_screen_result: "PASS",
    hrbp_criteria_decision: "PASS",
    salary_check_result: "PENDING",
    hrbp_payroll_decision: "PENDING",
    current_manager_result: "",
    hrbp_cm_rejectCase_decision: "",
    interview_result: "",
    hrbp_interview_fail_decision: "",
    effective_date: "",
    current_manager_approval: "",
    hod_approval: "",
    transfer_type: "INTERNAL_TRANSFER",
    last_event_key: "it:0061:salary",
    last_error: "",
    created_at: "2024-05-19T08:50:00.000Z",
    updated_at: "2024-05-19T09:20:00.000Z",
    closed_at: "",
    message: "Salary check pending",
    channelCode: "SEATALK_HRBP_GROUP",
    HRBP_case: "HRBP_MAIN"
  },
  {
    case_id: "IT-2024-0062",
    unique_job_id: "SCOM-BI-0062",
    workflow_status: "HOD_APPROVAL_PENDING",
    pending_actor: "CURRENT_HOD",
    next_action: "HOD approval required",
    auto_screen_result: "PASS",
    hrbp_criteria_decision: "PASS",
    salary_check_result: "APPROVED",
    hrbp_payroll_decision: "APPROVED",
    current_manager_result: "APPROVED",
    hrbp_cm_rejectCase_decision: "",
    interview_result: "APPROVED",
    hrbp_interview_fail_decision: "PASS",
    effective_date: "2024-05-27",
    current_manager_approval: "APPROVED",
    hod_approval: "PENDING",
    transfer_type: "INTERNAL_TRANSFER",
    last_event_key: "it:0062:hod",
    last_error: "",
    created_at: "2024-05-18T12:20:00.000Z",
    updated_at: "2024-05-22T10:05:00.000Z",
    closed_at: "",
    message: "Current HOD approval email sent",
    channelCode: "EMAIL",
    HRBP_case: "HRBP_MAIN"
  },
  {
    case_id: "CONV-2024-0011",
    unique_job_id: "CONV-0011",
    workflow_status: "CONVERSION_WAITING_HOC_APPROVAL",
    pending_actor: "HRBP",
    next_action: "Send Head of Country approval email",
    auto_screen_result: "PASS",
    hrbp_criteria_decision: "PASS",
    salary_check_result: "",
    hrbp_payroll_decision: "",
    current_manager_result: "",
    hrbp_cm_rejectCase_decision: "",
    interview_result: "",
    hrbp_interview_fail_decision: "",
    effective_date: "",
    current_manager_approval: "",
    hod_approval: "",
    transfer_type: "CONVERSION",
    last_event_key: "conversion:0011:start",
    last_error: "",
    created_at: "2024-05-21T11:00:00.000Z",
    updated_at: "2024-05-21T11:30:00.000Z",
    closed_at: "",
    message: "Conversion case is eligible and waiting for Head of Country approval",
    channelCode: "SEATALK_HRBP_GROUP",
    HRBP_case: "HRBP_MAIN"
  },
  {
    case_id: "CONV-2024-0012",
    unique_job_id: "CONV-0012",
    workflow_status: "CONVERSION_READY_FOR_SHEET_UPDATE",
    pending_actor: "HRBP",
    next_action: "Update conversion tracker sheets",
    auto_screen_result: "PASS",
    hrbp_criteria_decision: "PASS",
    salary_check_result: "",
    hrbp_payroll_decision: "APPROVED",
    current_manager_result: "APPROVED",
    hrbp_cm_rejectCase_decision: "",
    interview_result: "",
    hrbp_interview_fail_decision: "PASS",
    effective_date: "23/06/2026",
    current_manager_approval: "",
    hod_approval: "APPROVED",
    transfer_type: "CONVERSION",
    last_event_key: "conversion:0012:date",
    last_error: "",
    created_at: "2024-05-14T09:00:00.000Z",
    updated_at: "2024-05-22T15:30:00.000Z",
    closed_at: "",
    message: "Effective date received",
    channelCode: "SEATALK_HRBP_GROUP",
    HRBP_case: "HRBP_MAIN"
  }
];

const transferRows: CleanedTransferRow[] = [
  {
    case_id: "IT-2024-0058",
    unique_job_id: "SPE-PC-0058",
    join_status: "MATCHED",
    submitted_at: "20 May 2024 10:30",
    candidate_email: "nattaya.s@shopee.com",
    candidate_name: "Nattaya Srisawat",
    employee_id: "EMP-01234",
    current_entity: "SPE",
    current_team: "People Operations",
    service_months: "1 Year 2 Months",
    current_rank: "A-",
    resume_link: "",
    choice1_entity: "SCOM",
    choice1_role: "HR Business Partner",
    hris_employee_id: "EMP-01234",
    hris_display_name: "Nattaya Srisawat",
    hris_department: "People Operations",
    hris_current_team: "People Operations Department",
    hris_current_title: "HR Specialist",
    hris_reporting_manager: "Napatch Charoensuk",
    hris_reporting_manager_email: "napatch.c@shopee.com",
    hris_yos: "14",
    current_performance: "A-",
    hrbp: "HRBP Main",
    entity_code: "SCOM",
    target_team_department_category: "People & Culture",
    target_category_sub_team: "People & Culture",
    position_title: "HR Business Partner",
    hiring_manager_email: "thanakorn.p@shopee.com",
    backfill_or_new_hc: "Backfill",
    transfer_type: "Cross Entity",
    cleaned_at: "2024-05-20T11:30:00.000Z"
  },
  {
    case_id: "IT-2024-0061",
    unique_job_id: "SPE-MKT-0061",
    join_status: "MATCHED",
    submitted_at: "19 May 2024 08:50",
    candidate_email: "kanyarat.m@shopee.com",
    candidate_name: "Kanyarat M.",
    employee_id: "EMP-01580",
    current_entity: "SPE",
    current_team: "Marketing",
    service_months: "1 Year",
    current_rank: "B+",
    resume_link: "",
    choice1_entity: "SPE",
    choice1_role: "Brand Marketing Officer",
    hris_employee_id: "EMP-01580",
    hris_display_name: "Kanyarat M.",
    hris_department: "Marketing",
    hris_current_team: "Marketing",
    hris_current_title: "Marketing Officer",
    hris_reporting_manager: "P Tae",
    hris_reporting_manager_email: "ptae@shopee.com",
    hris_yos: "12",
    current_performance: "B+",
    hrbp: "HRBP Main",
    entity_code: "SPE",
    target_team_department_category: "Brand Marketing",
    target_category_sub_team: "Brand Marketing",
    position_title: "Marketing Officer",
    hiring_manager_email: "brand.hm@shopee.com",
    backfill_or_new_hc: "New HC",
    transfer_type: "Same Entity",
    cleaned_at: "2024-05-19T09:20:00.000Z"
  },
  {
    case_id: "IT-2024-0062",
    unique_job_id: "SCOM-BI-0062",
    join_status: "MATCHED",
    submitted_at: "18 May 2024 12:20",
    candidate_email: "saran.p@shopee.com",
    candidate_name: "Saran P.",
    employee_id: "EMP-01901",
    current_entity: "SPE",
    current_team: "Finance",
    service_months: "2 Years",
    current_rank: "A",
    resume_link: "",
    choice1_entity: "SPE",
    choice1_role: "Accountant",
    hris_employee_id: "EMP-01901",
    hris_display_name: "Saran P.",
    hris_department: "Finance",
    hris_current_team: "Finance",
    hris_current_title: "Accountant",
    hris_reporting_manager: "HOD Finance",
    hris_reporting_manager_email: "hod.finance@shopee.com",
    hris_yos: "24",
    current_performance: "A",
    hrbp: "HRBP Main",
    entity_code: "SPE",
    target_team_department_category: "Finance",
    target_category_sub_team: "Finance",
    position_title: "Accountant",
    hiring_manager_email: "finance.hm@shopee.com",
    backfill_or_new_hc: "Backfill",
    transfer_type: "Same Entity",
    cleaned_at: "2024-05-22T10:05:00.000Z"
  }
];

const onboardingRows: OnboardingJoinerSummary[] = [
  {
    rowInFte: "42",
    stepTracker: "message_2_day_3",
    previousStepTracker: "message_1_sent",
    nextStepTracker: "message_3_pending",
    onboardingCompleted: false,
    dbKey: "maya.t@shopee.com",
    fullName: "Maya Thanasit",
    nickname: "Maya",
    companyEmail: "maya.t@shopee.com",
    personalEmail: "maya.personal@example.com",
    mobile: "0812345678",
    buddyEmail: "buddy.hr@shopee.com",
    hrbpName: "HRBP Main",
    hrbpEmail: "hrbp@shopee.com",
    onboardingSession: "20 May 2024",
    department: "People Operations",
    legalEntity: "SPE",
    team: "People & Culture",
    rank: "Analyst",
    speJobTitle: "HR Operations Analyst",
    dateOfJoin: "2024-05-20",
    endOfProbation: "2024-09-20",
    speReportingManager: "Napatch Charoensuk",
    speReportingManagerEmail: "napatch.c@shopee.com",
    location: "Bangkok",
    recruiter: "Recruiter A",
    ageDays: 3,
    createdAt: "2024-05-20T01:55:00.000Z",
    updatedAt: "2024-05-23T01:55:00.000Z"
  },
  {
    rowInFte: "43",
    stepTracker: "message_3_week_1",
    previousStepTracker: "message_2_day_3",
    nextStepTracker: "completed",
    onboardingCompleted: false,
    dbKey: "narin.k@shopee.com",
    fullName: "Narin K.",
    nickname: "Narin",
    companyEmail: "narin.k@shopee.com",
    buddyEmail: "buddy.ops@shopee.com",
    hrbpName: "HRBP Main",
    hrbpEmail: "hrbp@shopee.com",
    onboardingSession: "16 May 2024",
    department: "Operations",
    legalEntity: "SCOM",
    team: "Marketplace Ops",
    rank: "Associate",
    speJobTitle: "Operations Associate",
    dateOfJoin: "2024-05-16",
    endOfProbation: "2024-09-16",
    location: "Bangkok",
    recruiter: "Recruiter B",
    ageDays: 7,
    createdAt: "2024-05-16T01:55:00.000Z",
    updatedAt: "2024-05-23T01:55:00.000Z"
  },
  {
    rowInFte: "44",
    stepTracker: "completed",
    previousStepTracker: "message_3_week_1",
    nextStepTracker: "completed",
    onboardingCompleted: true,
    dbKey: "pim.s@shopee.com",
    fullName: "Pim S.",
    nickname: "Pim",
    companyEmail: "pim.s@shopee.com",
    buddyEmail: "buddy.pc@shopee.com",
    hrbpName: "HRBP Main",
    hrbpEmail: "hrbp@shopee.com",
    onboardingSession: "13 May 2024",
    department: "Finance",
    legalEntity: "SPE",
    team: "Accounting",
    rank: "Analyst",
    speJobTitle: "Accountant",
    dateOfJoin: "2024-05-13",
    endOfProbation: "2024-09-13",
    location: "Bangkok",
    recruiter: "Recruiter C",
    ageDays: 10,
    createdAt: "2024-05-13T01:55:00.000Z",
    updatedAt: "2024-05-23T01:55:00.000Z"
  }
];

const statusLabels: Record<string, string> = {
  INTERVIEWING: "Interviewing",
  SALARY_CHECK_PENDING: "Salary Check",
  HOD_APPROVAL_PENDING: "HOD Approval",
  CONVERSION_WAITING_HOC_APPROVAL: "HOC Approval",
  CONVERSION_READY_FOR_SHEET_UPDATE: "Ready for Sheet Update"
};

const externalActors = new Set(["PAYROLL", "HIRING_MANAGER", "CURRENT_MANAGER", "CURRENT_HOD"]);
let lastSource: "google_sheets" | "mock" = "mock";

async function loadCaseRows(): Promise<CaseRow[]> {
  const rows = await readAutomationTab("cases");
  setSource(rows);
  return rows.length ? rows.map((row) => withCaseDefaults(row)) : caseRows;
}

async function loadTransferRows(): Promise<CleanedTransferRow[]> {
  const rows = await readAutomationTab("Internal transfer cleaned data");
  setSource(rows);
  return rows.length ? rows.map((row) => withTransferDefaults(row)) : transferRows;
}

async function loadOnboardingRows(): Promise<OnboardingJoinerSummary[]> {
  const rows = await readAutomationTab("Onboarding_Process");
  setSource(rows);
  return rows.length ? rows.map((row) => normalizeOnboardingRow(row)) : onboardingRows;
}

async function readAutomationTab(range: string) {
  try {
    return await getSheetRecords(process.env.AUTOMATION_DB_SPREADSHEET_ID, range);
  } catch {
    return [];
  }
}

function transferFor(row: CaseRow, transfers: CleanedTransferRow[]) {
  return transfers.find((item) => item.case_id === row.case_id || item.unique_job_id === row.unique_job_id);
}

function processFor(row: CaseRow): ProcessCode {
  return row.transfer_type === "CONVERSION" ? "conversion" : "internal_transfer";
}

function isOverdue(row: CaseRow) {
  return row.workflow_status === "HOD_APPROVAL_PENDING" || Boolean(row.last_error);
}

function normalizeCase(row: CaseRow, transfers: CleanedTransferRow[]): CaseSummary {
  const transfer = transferFor(row, transfers);
  return {
    caseId: row.case_id,
    uniqueJobId: row.unique_job_id,
    process: processFor(row),
    candidateName: transfer?.candidate_name ?? row.case_id,
    candidateEmail: transfer?.candidate_email,
    employeeId: transfer?.employee_id,
    currentDepartment: transfer?.current_team,
    targetDepartment: transfer?.target_team_department_category,
    currentEntity: transfer?.current_entity,
    targetEntity: transfer?.entity_code,
    roleTitle: transfer?.hris_current_title ?? transfer?.position_title,
    status: row.workflow_status,
    statusLabel: statusLabels[row.workflow_status] ?? row.workflow_status.replaceAll("_", " "),
    pendingActor: row.pending_actor,
    nextAction: row.next_action,
    submittedAt: transfer?.submitted_at ?? row.created_at,
    updatedAt: row.updated_at,
    dueDate: row.effective_date || (row.workflow_status === "SALARY_CHECK_PENDING" ? "22 May 2024" : "27 May 2024"),
    isOverdue: isOverdue(row),
    lastError: row.last_error || undefined,
    message: row.message,
    channelCode: row.channelCode,
    hrbpCase: row.HRBP_case
  };
}

export async function getInternalTransferCases() {
  resetSource();
  const rows = await loadCaseRows();
  const transfers = await loadTransferRows();
  const items = rows.filter((row) => row.transfer_type !== "CONVERSION").map((row) => normalizeCase(row, transfers));
  return {
    items,
    page: 1,
    pageSize: 8,
    total: items.length,
    statusCounts: countBy(items, (item) => item.statusLabel),
    generatedAt,
    source: lastSource
  };
}

export async function getConversionCases() {
  resetSource();
  const rows = await loadCaseRows();
  const transfers = await loadTransferRows();
  const items = rows.filter((row) => row.transfer_type === "CONVERSION").map((row) => normalizeCase(row, transfers));
  return {
    items,
    page: 1,
    pageSize: 8,
    total: items.length,
    statusCounts: countBy(items, (item) => item.statusLabel),
    generatedAt,
    source: lastSource
  };
}

export async function getInternalTransferDetail(caseId: string): Promise<InternalTransferDetail | null> {
  resetSource();
  const rows = await loadCaseRows();
  const transfers = await loadTransferRows();
  const decoded = decodeURIComponent(caseId);

  let row = rows.find((item) => item.case_id === decoded || item.unique_job_id === decoded);
  if (!row) {
    // try to resolve from transfer rows by candidate email, employee id or candidate name
    const matchingTransfer = transfers.find(
      (t) => (t.candidate_email && (t.candidate_email === decoded || decoded.includes(t.candidate_email) || t.candidate_email.includes(decoded))) ||
      (t.employee_id && (t.employee_id === decoded || decoded.includes(t.employee_id))) ||
      (t.candidate_name && (t.candidate_name === decoded || decoded.includes(t.candidate_name)))
    );
    if (matchingTransfer) {
      row = rows.find((r) => r.case_id === matchingTransfer.case_id || r.unique_job_id === matchingTransfer.unique_job_id) ?? row;
    }
  }
  if (!row) return null;

  const transfer = transferFor(row, transfers);
  const summary = normalizeCase(row, transfers);
  return {
    ...summary,
    serviceMonths: transfer?.service_months,
    grade: transfer?.current_performance,
    manager: transfer?.hris_reporting_manager,
    hiringManager: transfer?.hiring_manager_email?.split("@")[0],
    currentRank: transfer?.current_rank,
    targetRole: transfer?.position_title,
    transferType: transfer?.transfer_type,
    progress: [
      event(row.case_id, "Auto screen", "System", progressStatus(row.auto_screen_result)),
      event(row.case_id, "HRBP criteria decision", "HRBP", progressStatus(row.hrbp_criteria_decision)),
      event(row.case_id, "Salary check result", "Payroll", progressStatus(row.salary_check_result)),
      event(row.case_id, "HRBP payroll decision", "Payroll", progressStatus(row.hrbp_payroll_decision)),
      event(row.case_id, "Current manager result", "Current Manager", progressStatus(row.current_manager_result)),
      event(row.case_id, "HRBP reject decision", "HRBP", progressStatus(row.hrbp_cm_rejectCase_decision)),
      event(row.case_id, "Interview result", "Hiring Manager", progressStatus(row.interview_result)),
      event(row.case_id, "Interview fail decision", "HRBP", progressStatus(row.hrbp_interview_fail_decision)),
      event(row.case_id, "Effective date", "System", progressStatus(row.effective_date)),
      event(row.case_id, "Current manager approval", "Current Manager", progressStatus(row.current_manager_approval)),
      event(row.case_id, "HOD approval", "Current HOD", progressStatus(row.hod_approval))
    ],
    latestActivity: [
      event(row.case_id, row.message, row.channelCode === "EMAIL" ? "System" : "HRBP", row.last_error ? "error" : "done", "20 May 2024 11:30"),
      event(row.case_id, "HR screening completed - eligible", "HRBP", "done", "20 May 2024 11:00"),
      event(row.case_id, "Case created from Google Form submission", "System", "done", "20 May 2024 10:30")
    ]
  };
}

export async function getOnboardingJoiners() {
  resetSource();
  const rows = await loadOnboardingRows();
  return {
    items: rows,
    total: rows.length,
    stepCounts: countBy(rows, (item) => item.stepTracker),
    generatedAt,
    source: lastSource
  };
}

export async function getHRBPList(): Promise<{ name: string; nickname?: string; email?: string }[]> {
  resetSource();
  const rows = await readAutomationTab("HRBP_List");
  setSource(rows);
  if (!rows.length) return [];
  return rows.map((r) => {
    const row = r as Record<string, string>;
    return {
      name: row.Name ?? row.name ?? row.Name?.toString() ?? "",
      nickname: row.Nickname ?? row.nickname ?? "",
      email: row.Email ?? row.email ?? ""
    };
  });
}

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  resetSource();
  const transfers = (await getInternalTransferCases()).items;
  const conversions = (await getConversionCases()).items;
  const onboarding = (await loadOnboardingRows());
  const allCases = [...transfers, ...conversions];

  return {
    processes: [
      summary("internal_transfer", "Internal Transfer", transfers.length, transfers.filter((item) => item.isOverdue).length, 0, 0),
      summary("conversion", "Conversion", conversions.length, 0, 1, 0),
      summary("onboarding", "Onboarding", onboarding.filter((item) => !item.onboardingCompleted).length, 1, 1, 0)
    ],
    metrics: {
      openCases: allCases.length + onboarding.filter((item) => !item.onboardingCompleted).length,
      overdueTasks: allCases.filter((item) => item.isOverdue).length + 1,
      pendingHRBP: allCases.filter((item) => item.pendingActor === "HRBP").length,
      pendingExternal: allCases.filter((item) => externalActors.has(item.pendingActor)).length,
      errors: allCases.filter((item) => item.lastError).length
    },
    recentActivity: [
      event("IT-2024-0058", "Salary check message sent", "HRBP", "done", "20 May 2024 11:30"),
      event("CONV-2024-0012", "Effective date received", "HRBP", "done", "22 May 2024 15:30"),
      event("ONB-42", "Day 3 onboarding check-in due", "System", "pending", "23 May 2024 08:55")
    ],
    generatedAt,
    source: lastSource
  };
}

function setSource(rows: Array<unknown>) {
  if (rows.length > 0) {
    lastSource = "google_sheets";
  }
}

function resetSource() {
  lastSource = "mock";
}

function summary(process: ProcessCode, label: string, openCount: number, overdueCount: number, completedThisMonth: number, errorCount: number) {
  return {
    process,
    label,
    openCount,
    overdueCount,
    completedThisMonth,
    errorCount,
    health: errorCount > 0 ? "blocked" : overdueCount > 0 ? "attention" : "healthy"
  } as const;
}

function event(caseId: string, title: string, actor: string, status: TimelineEvent["status"], occurredAt?: string): TimelineEvent {
  return {
    id: `${caseId}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    caseId,
    process: caseId.startsWith("CONV") ? "conversion" : caseId.startsWith("ONB") ? "onboarding" : "internal_transfer",
    title,
    actor,
    status,
    occurredAt
  };
}

function progressStatus(value: string): TimelineEvent["status"] {
  const normalized = value?.toLowerCase().trim();
  if (!normalized || normalized === "pending" || normalized === "waiting" || normalized === "") {
    return "pending";
  }
  if (normalized === "pass" || normalized === "approved" || normalized === "done" || normalized === "eligible") {
    return "done";
  }
  return normalized === "error" || normalized === "rejected" || normalized === "fail" ? "error" : "pending";
}

function progressStatusGroup(values: string[]): TimelineEvent["status"] {
  const statuses = values.map(progressStatus);
  if (statuses.includes("error")) return "error";
  if (statuses.every((status) => status === "done")) return "done";
  return "pending";
}

function countBy<T>(rows: T[], key: (row: T) => string) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const value = key(row) || "unknown";
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function withCaseDefaults(row: Record<string, string>): CaseRow {
  return {
    case_id: row.case_id ?? "",
    unique_job_id: row.unique_job_id ?? "",
    workflow_status: row.workflow_status ?? "",
    pending_actor: row.pending_actor ?? "",
    next_action: row.next_action ?? "",
    auto_screen_result: row.auto_screen_result ?? "",
    hrbp_criteria_decision: row.hrbp_criteria_decision ?? "",
    salary_check_result: row.salary_check_result ?? "",
    hrbp_payroll_decision: row.hrbp_payroll_decision ?? "",
    current_manager_result: row.current_manager_result ?? "",
    hrbp_cm_rejectCase_decision: row.hrbp_cm_rejectCase_decision ?? "",
    interview_result: row.interview_result ?? "",
    hrbp_interview_fail_decision: row.hrbp_interview_fail_decision ?? "",
    effective_date: row.effective_date ?? "",
    current_manager_approval: row.current_manager_approval ?? "",
    hod_approval: row.hod_approval ?? "",
    transfer_type: row.transfer_type ?? "",
    last_event_key: row.last_event_key ?? "",
    last_error: row.last_error ?? "",
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
    closed_at: row.closed_at ?? "",
    message: row.message ?? "",
    channelCode: row.channelCode ?? "",
    HRBP_case: row.HRBP_case ?? ""
  };
}

function withTransferDefaults(row: Record<string, string>): CleanedTransferRow {
  return {
    case_id: row.case_id ?? "",
    unique_job_id: row.unique_job_id ?? "",
    join_status: row.join_status ?? "",
    submitted_at: row.submitted_at ?? "",
    candidate_email: row.candidate_email ?? "",
    candidate_name: row.candidate_name ?? "",
    employee_id: row.employee_id ?? "",
    current_entity: row.current_entity ?? "",
    current_team: row.current_team ?? "",
    service_months: row.service_months ?? "",
    current_rank: row.current_rank ?? "",
    resume_link: row.resume_link ?? "",
    choice1_entity: row.choice1_entity ?? "",
    choice1_role: row.choice1_role ?? "",
    hris_employee_id: row.hris_employee_id ?? "",
    hris_display_name: row.hris_display_name ?? "",
    hris_department: row.hris_department ?? "",
    hris_current_team: row.hris_current_team ?? "",
    hris_current_title: row.hris_current_title ?? "",
    hris_reporting_manager: row.hris_reporting_manager ?? "",
    hris_reporting_manager_email: row.hris_reporting_manager_email ?? "",
    hris_yos: row.hris_yos ?? "",
    current_performance: row.current_performance ?? "",
    hrbp: row.hrbp ?? "",
    entity_code: row.entity_code ?? "",
    target_team_department_category: row.target_team_department_category ?? "",
    target_category_sub_team: row.target_category_sub_team ?? "",
    position_title: row.position_title ?? "",
    hiring_manager_email: row.hiring_manager_email ?? "",
    backfill_or_new_hc: row.backfill_or_new_hc ?? "",
    transfer_type: row.transfer_type ?? "",
    cleaned_at: row.cleaned_at ?? ""
  };
}

function normalizeOnboardingRow(row: Record<string, string>): OnboardingJoinerSummary {
  return {
    rowInFte: row.row_in_FTE,
    stepTracker: row.step_tracker ?? "",
    previousStepTracker: row.previous_step_tracker,
    nextStepTracker: row.next_step_tracker,
    onboardingCompleted: parseBoolean(row.onboarding_completed),
    dbKey: row.db_key ?? row.company_email ?? row.personal_email ?? "",
    fullName: row.full_name ?? [row.first_name, row.surname].filter(Boolean).join(" "),
    nickname: row.nickname,
    companyEmail: row.company_email,
    personalEmail: row.personal_email,
    mobile: row.mobile,
    buddyEmail: row.buddy_email,
    hrbpName: row.hrbp_name,
    hrbpEmail: row.hrbp_email,
    onboardingSession: row.onboarding_session,
    department: row.department,
    legalEntity: row.legal_entity,
    team: row.team,
    rank: row.rank,
    speJobTitle: row.spe_job_title,
    dateOfJoin: row.date_of_join,
    endOfProbation: row.end_of_probation,
    speReportingManager: row.spe_reporting_manager,
    speReportingManagerEmail: row.spe_reporting_manager_email,
    location: row.location,
    recruiter: row.recruiter,
    ageDays: Number(row.age_days || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseBoolean(value = "") {
  return ["true", "yes", "y", "1", "completed"].includes(value.toLowerCase().trim());
}
