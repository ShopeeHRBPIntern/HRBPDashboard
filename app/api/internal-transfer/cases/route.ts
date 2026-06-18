import { NextRequest, NextResponse } from "next/server";
import { getInternalTransferCases } from "@/lib/data";
import type { CaseSummary } from "@/types/dashboard";

type SortKey = "newest" | "oldest" | "dueDate" | "name";

const workflowStepKeys = [
  "hrbp_criteria_decision",
  "salary_check_result",
  "current_manager_result",
  "interview_result",
  "effective_date",
  "current_manager_approval",
  "hod_approval"
] as const;

function isWorkflowStepKey(value: string): value is (typeof workflowStepKeys)[number] {
  return workflowStepKeys.includes(value as (typeof workflowStepKeys)[number]);
}

function isOpenStepValue(value?: string) {
  const normalized = value?.trim().toLowerCase();
  return Boolean(normalized && ["pending", "waiting", "wait", "error", "rejected", "reject", "failed", "fail"].includes(normalized));
}

function parseOwnerIds(value?: string) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
  } catch {}
  return value.split(/[,;|]/).map((item) => item.trim()).filter(Boolean);
}

function timeValue(value?: string) {
  if (!value) return 0;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function applyQuery(items: CaseSummary[], params: URLSearchParams) {
  const q = params.get("q")?.trim() ?? "";
  const step = params.get("step") ?? "";
  const status = params.get("status") ?? "";
  const pending = params.get("pending") ?? "";
  const department = params.get("department") ?? "";
  const entity = params.get("entity") ?? "";
  const owners = params.getAll("owner").flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);
  const sort = ((params.get("sort") || "newest") as SortKey);

  let rows = items;
  if (q) {
    const normalized = q.toLowerCase();
    rows = rows.filter(
      (item) =>
        (item.candidateName ?? "").toLowerCase().includes(normalized) ||
        (item.candidateEmail ?? "").toLowerCase().includes(normalized) ||
        (item.employeeId ?? "").toLowerCase().includes(normalized) ||
        (item.caseId ?? "").toLowerCase().includes(normalized) ||
        (item.uniqueJobId ?? "").toLowerCase().includes(normalized) ||
        (item.currentDepartment ?? "").toLowerCase().includes(normalized) ||
        (item.targetDepartment ?? "").toLowerCase().includes(normalized) ||
        (item.currentRole ?? "").toLowerCase().includes(normalized) ||
        (item.targetRole ?? "").toLowerCase().includes(normalized)
    );
  }
  if (isWorkflowStepKey(step)) rows = rows.filter((item) => isOpenStepValue(item[step]));
  if (status) rows = rows.filter((item) => item.statusLabel === status);
  if (pending) rows = rows.filter((item) => item.pendingActor === pending);
  if (department) rows = rows.filter((item) => item.currentDepartment === department || item.targetDepartment === department);
  if (entity) rows = rows.filter((item) => item.currentEntity === entity || item.targetEntity === entity);
  if (owners.length) rows = rows.filter((item) => owners.every((owner) => parseOwnerIds(item.hrbpCase).includes(owner)));

  return [...rows].sort((a, b) => {
    if (sort === "oldest") return timeValue(a.updatedAt ?? a.submittedAt) - timeValue(b.updatedAt ?? b.submittedAt);
    if (sort === "dueDate") return timeValue(a.dueDate) - timeValue(b.dueDate);
    if (sort === "name") return a.candidateName.localeCompare(b.candidateName);
    return timeValue(b.updatedAt ?? b.submittedAt) - timeValue(a.updatedAt ?? a.submittedAt);
  });
}

function toCsv(items: CaseSummary[]) {
  const headers = [
    "Case ID",
    "Candidate",
    "Email",
    "Employee ID",
    "Status",
    "Pending By",
    "Current Role",
    "Target Role",
    "Current Department",
    "Target Department",
    "Current Entity",
    "Target Entity",
    "HRBP Owner",
    "Submitted At",
    "Updated At",
    "Due Date"
  ];
  const rows = items.map((item) => [
    item.caseId,
    item.candidateName,
    item.candidateEmail,
    item.employeeId,
    item.statusLabel,
    item.pendingActor,
    item.currentRole,
    item.targetRole,
    item.currentDepartment,
    item.targetDepartment,
    item.currentEntity,
    item.targetEntity,
    parseOwnerIds(item.hrbpCase).join("; "),
    item.submittedAt,
    item.updatedAt,
    item.dueDate
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

export async function GET(request: NextRequest) {
  const data = await getInternalTransferCases();
  if (request.nextUrl.searchParams.get("format") !== "csv") {
    return NextResponse.json(data);
  }

  const filtered = applyQuery(data.items, request.nextUrl.searchParams);
  return new NextResponse(toCsv(filtered), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="internal-transfer-cases.csv"`
    }
  });
}
