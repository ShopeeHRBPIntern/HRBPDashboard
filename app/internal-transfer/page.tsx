import { ArrowUpDown, ChevronDown, FileDown, Filter, Grid3X3, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CaseCard } from "@/components/CaseCard";
import OwnerFilter from "@/components/OwnerFilter";
import { getHRBPList, getInternalTransferCases } from "@/lib/data";
import type { CaseSummary, HrbpOwner } from "@/types/dashboard";

type WorkflowStepKey =
  | "hrbp_criteria_decision"
  | "salary_check_result"
  | "current_manager_result"
  | "interview_result"
  | "effective_date"
  | "current_manager_approval"
  | "hod_approval";
type SortKey = "newest" | "oldest" | "dueDate" | "name";
type ViewKey = "grid" | "list";

const workflowStepKeys: WorkflowStepKey[] = [
  "hrbp_criteria_decision",
  "salary_check_result",
  "current_manager_result",
  "interview_result",
  "effective_date",
  "current_manager_approval",
  "hod_approval"
];

const tabs: Array<{ key: "all" | WorkflowStepKey; label: string; title?: string }> = [
  { key: "all", label: "All Open" },
  { key: "hrbp_criteria_decision", label: "HRBP Criteria", title: "hrbp_criteria_decision" },
  { key: "salary_check_result", label: "Salary Check", title: "salary_check_result" },
  { key: "current_manager_result", label: "Manager Result", title: "current_manager_result" },
  { key: "interview_result", label: "Interview", title: "interview_result" },
  { key: "effective_date", label: "Effective Date", title: "effective_date" },
  { key: "current_manager_approval", label: "Mgr Approval", title: "current_manager_approval" },
  { key: "hod_approval", label: "HOD Approval", title: "hod_approval" }
];
const sortOptions: Array<{ key: SortKey; label: string }> = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "dueDate", label: "Due Date" },
  { key: "name", label: "Name" }
];

function paramValue(value?: string | string[]) {
  return typeof value === "string" ? value : "";
}

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function isOpenStepValue(value?: string) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return false;
  if (["pending", "waiting", "wait", "error", "rejected", "reject", "failed", "fail"].includes(normalized)) return true;
  return false;
}

function stepCount(items: CaseSummary[], step: "all" | WorkflowStepKey) {
  if (step === "all") return items.length;
  return items.filter((item) => isOpenStepValue(item[step])).length;
}

function isWorkflowStepKey(value: string): value is WorkflowStepKey {
  return workflowStepKeys.includes(value as WorkflowStepKey);
}

function isSortKey(value: string): value is SortKey {
  return sortOptions.some((option) => option.key === value);
}

function isViewKey(value: string): value is ViewKey {
  return value === "grid" || value === "list";
}

function timeValue(value?: string) {
  if (!value) return 0;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function parseOwnerIds(value?: string) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean);
  } catch {}
  return value.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
}

function titleFromOwnerId(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initialsFrom(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function matchesOwner(item: CaseSummary, selectedOwners: string[]) {
  if (!selectedOwners.length) return true;
  const parsedOwners = parseOwnerIds(item.hrbpCase);
  return selectedOwners.every((selected) => parsedOwners.includes(selected));
}

export default async function InternalTransferPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const cases = await getInternalTransferCases();
  const hrbps = await getHRBPList();
  const q = paramValue(searchParams?.q);
  const step = paramValue(searchParams?.step) as WorkflowStepKey | "";
  const status = paramValue(searchParams?.status);
  const pending = paramValue(searchParams?.pending);
  const department = paramValue(searchParams?.department);
  const entity = paramValue(searchParams?.entity);
  const sortParam = paramValue(searchParams?.sort);
  const viewParam = paramValue(searchParams?.view);
  const pageParam = Number.parseInt(paramValue(searchParams?.page), 10);
  const selectedOwners = Array.isArray(searchParams?.owner)
    ? searchParams.owner.flatMap((value) => value.split(",")).map((s) => s.trim()).filter(Boolean)
    : typeof searchParams?.owner === "string"
    ? searchParams.owner.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const counts = { "internal-transfer": cases.total };
  const activeStep = isWorkflowStepKey(step) ? step : "";
  const sort = isSortKey(sortParam) ? sortParam : "newest";
  const view = isViewKey(viewParam) ? viewParam : "grid";
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const activeSort = sortOptions.find((option) => option.key === sort) ?? sortOptions[0];
  const nextSort = sortOptions[(sortOptions.findIndex((option) => option.key === sort) + 1) % sortOptions.length]?.key ?? "newest";

  const statuses = unique(cases.items.map((item) => item.statusLabel));
  const pendingActors = unique(cases.items.map((item) => item.pendingActor));
  const departments = unique(cases.items.flatMap((item) => [item.currentDepartment, item.targetDepartment]));
  const entities = unique(cases.items.flatMap((item) => [item.currentEntity, item.targetEntity]));
  const ownerIds = unique(cases.items.flatMap((item) => parseOwnerIds(item.hrbpCase)));
  const owners: HrbpOwner[] = (ownerIds.length ? ownerIds : hrbps.map((hrbp) => hrbp.email || hrbp.name)).map((id) => {
    const match = hrbps.find((hrbp) => [hrbp.email, hrbp.name, hrbp.nickname].filter(Boolean).includes(id));
    const name = match?.name || titleFromOwnerId(id);
    const nickname = match?.nickname || name;
    return {
      id,
      name,
      nickname,
      email: match?.email,
      initials: initialsFrom(match?.nickname || name || id)
    };
  });

  let items = cases.items;
  if (q) {
    const ql = q.toLowerCase();
    items = items.filter(
      (item) =>
        (item.candidateName ?? "").toLowerCase().includes(ql) ||
        (item.candidateEmail ?? "").toLowerCase().includes(ql) ||
        (item.employeeId ?? "").toLowerCase().includes(ql) ||
        (item.caseId ?? "").toLowerCase().includes(ql) ||
        (item.uniqueJobId ?? "").toLowerCase().includes(ql) ||
        (item.currentDepartment ?? "").toLowerCase().includes(ql) ||
        (item.targetDepartment ?? "").toLowerCase().includes(ql) ||
        (item.currentRole ?? "").toLowerCase().includes(ql) ||
        (item.targetRole ?? "").toLowerCase().includes(ql)
    );
  }
  if (activeStep) items = items.filter((item) => isOpenStepValue(item[activeStep]));
  if (status) items = items.filter((item) => item.statusLabel === status);
  if (pending) items = items.filter((item) => item.pendingActor === pending);
  if (department) items = items.filter((item) => item.currentDepartment === department || item.targetDepartment === department);
  if (entity) items = items.filter((item) => item.currentEntity === entity || item.targetEntity === entity);
  if (selectedOwners.length > 0) items = items.filter((item) => matchesOwner(item, selectedOwners));
  items = [...items].sort((a, b) => {
    if (sort === "oldest") return timeValue(a.updatedAt ?? a.submittedAt) - timeValue(b.updatedAt ?? b.submittedAt);
    if (sort === "dueDate") return timeValue(a.dueDate) - timeValue(b.dueDate);
    if (sort === "name") return a.candidateName.localeCompare(b.candidateName);
    return timeValue(b.updatedAt ?? b.submittedAt) - timeValue(a.updatedAt ?? a.submittedAt);
  });

  const buildFilterHref = ({
    nextQ = q,
    nextStep = activeStep,
    nextStatus = status,
    nextPending = pending,
    nextDepartment = department,
    nextEntity = entity,
    nextOwners = selectedOwners,
    nextSort = sort,
    nextView = view,
    nextPage = currentPage.toString()
  }: {
    nextQ?: string;
    nextStep?: string;
    nextStatus?: string;
    nextPending?: string;
    nextDepartment?: string;
    nextEntity?: string;
    nextOwners?: string[];
    nextSort?: string;
    nextView?: string;
    nextPage?: string;
  } = {}) => {
    const params = new URLSearchParams();
    if (nextQ) params.set("q", nextQ);
    if (nextStep) params.set("step", nextStep);
    if (nextStatus) params.set("status", nextStatus);
    if (nextPending) params.set("pending", nextPending);
    if (nextDepartment) params.set("department", nextDepartment);
    if (nextEntity) params.set("entity", nextEntity);
    if (nextSort && nextSort !== "newest") params.set("sort", nextSort);
    if (nextView && nextView !== "grid") params.set("view", nextView);
    if (nextPage && nextPage !== "1") params.set("page", nextPage);
    nextOwners.forEach((owner) => params.append("owner", owner));
    const query = params.toString();
    return `/internal-transfer${query ? `?${query}` : ""}`;
  };

  const hasActiveFilters = Boolean(q || activeStep || status || pending || department || entity || selectedOwners.length || sort !== "newest" || view !== "grid");
  const totalPages = Math.max(1, Math.ceil(items.length / cases.pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safePage - 1) * cases.pageSize;
  const visibleItems = items.slice(pageStartIndex, pageStartIndex + cases.pageSize);
  const showingStart = items.length ? pageStartIndex + 1 : 0;
  const showingEnd = Math.min(pageStartIndex + visibleItems.length, items.length);
  const exportHref = (() => {
    const href = buildFilterHref({ nextPage: "" });
    const query = href.split("?")[1];
    return `/api/internal-transfer/cases?format=csv${query ? `&${query}` : ""}`;
  })();

  return (
    <AppShell active="internal-transfer" title="Internal Transfer" subtitle="Open cases from Google Form submissions, auto-screening, and pending HRBP actions." counts={counts}>
      <section className="rounded-lg border border-line bg-white shadow-panel">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Open Cases</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">Transfer cases from the internal transfer workflow queue.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={exportHref} className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50">
              <FileDown className="h-4 w-4" />
              Export
            </a>
            <button className="inline-flex h-9 items-center gap-2 rounded-md bg-brand px-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Case
            </button>
          </div>
        </div>

        <form className="grid gap-3 px-5 py-4 md:grid-cols-2 xl:grid-cols-[1.45fr_0.8fr_0.85fr_0.85fr_0.75fr_0.9fr_auto]" method="get">
          {activeStep ? <input type="hidden" name="step" value={activeStep} /> : null}
          {sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
          {view !== "grid" ? <input type="hidden" name="view" value={view} /> : null}
          {selectedOwners.map((owner) => (
            <input key={owner} type="hidden" name="owner" value={owner} />
          ))}

          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm text-slate-500 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input name="q" defaultValue={q} className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search by name, email, or department..." />
          </label>

          <label className="relative">
            <span className="sr-only">Status</span>
            <select name="status" defaultValue={status} className="h-10 w-full appearance-none rounded-md border border-line bg-white px-3 pr-8 text-xs font-semibold text-slate-600 shadow-sm outline-none transition focus:border-brand">
              <option value="">Status: All</option>
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Pending by</span>
            <select name="pending" defaultValue={pending} className="h-10 w-full appearance-none rounded-md border border-line bg-white px-3 pr-8 text-xs font-semibold text-slate-600 shadow-sm outline-none transition focus:border-brand">
              <option value="">Pending By: All</option>
              {pendingActors.map((option) => (
                <option key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Department</span>
            <select name="department" defaultValue={department} className="h-10 w-full appearance-none rounded-md border border-line bg-white px-3 pr-8 text-xs font-semibold text-slate-600 shadow-sm outline-none transition focus:border-brand">
              <option value="">Department: All</option>
              {departments.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </label>

          <label className="relative">
            <span className="sr-only">Entity</span>
            <select name="entity" defaultValue={entity} className="h-10 w-full appearance-none rounded-md border border-line bg-white px-3 pr-8 text-xs font-semibold text-slate-600 shadow-sm outline-none transition focus:border-brand">
              <option value="">Entity: All</option>
              {entities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </label>

          <OwnerFilter
            owners={owners}
            selectedOwners={selectedOwners}
            filters={{
              q,
              step: activeStep,
              status,
              pending,
              department,
              entity,
              sort,
              view
            }}
          />

          <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </form>

        <div className="flex flex-col gap-3 border-t border-line px-5 sm:flex-row sm:items-center sm:justify-between">
          <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Workflow step filters">
            {tabs.map((tab) => {
              const active = tab.key === "all" ? !activeStep : activeStep === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={buildFilterHref({ nextStep: tab.key === "all" ? "" : tab.key, nextPage: "1" })}
                  title={tab.title}
                  className={`inline-flex h-12 shrink-0 items-center gap-2 border-b-2 text-xs font-bold transition ${
                    active ? "border-brand text-brand" : "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-blue-50 text-brand" : "bg-slate-100 text-slate-500"}`}>{stepCount(cases.items, tab.key)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 pb-3 sm:pb-0">
            {hasActiveFilters ? (
              <Link href="/internal-transfer" className="rounded-md px-2 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                Clear Filters
              </Link>
            ) : null}
            <Link href={buildFilterHref({ nextSort, nextPage: "1" })} className="inline-flex h-8 items-center gap-1 rounded-md border border-line bg-white px-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort by: {activeSort.label}
            </Link>
            <Link href={buildFilterHref({ nextView: "grid", nextPage: "1" })} className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${view === "grid" ? "bg-blue-50 text-brand" : "text-slate-400 hover:bg-slate-50"}`} aria-label="Grid view">
              <Grid3X3 className="h-4 w-4" />
            </Link>
            <Link href={buildFilterHref({ nextView: "list", nextPage: "1" })} className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${view === "list" ? "bg-blue-50 text-brand" : "text-slate-400 hover:bg-slate-50"}`} aria-label="List view">
              <List className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className={`${view === "list" ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4"} gap-4 bg-slate-50/60 p-5`}>
          {visibleItems.map((item) => (
            <CaseCard key={item.caseId} item={item} variant={view} />
          ))}
          {!visibleItems.length ? (
            <div className="col-span-full rounded-lg border border-dashed border-line bg-white p-10 text-center text-sm font-semibold text-slate-500">
              No cases match the selected filters.
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-line px-5 py-4 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {showingStart} to {showingEnd} of {items.length} cases
          </span>
          <div className="flex items-center gap-2">
            <Link href={buildFilterHref({ nextPage: String(Math.max(1, safePage - 1)) })} className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white ${safePage === 1 ? "pointer-events-none text-slate-300" : "text-slate-500 hover:bg-slate-50"}`}>
              {"<"}
            </Link>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Link key={pageNumber} href={buildFilterHref({ nextPage: String(pageNumber) })} className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${pageNumber === safePage ? "bg-brand text-white" : "border border-line bg-white text-slate-500 hover:bg-slate-50"}`}>
                  {pageNumber}
                </Link>
              );
            })}
            <Link href={buildFilterHref({ nextPage: String(Math.min(totalPages, safePage + 1)) })} className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white ${safePage === totalPages ? "pointer-events-none text-slate-300" : "text-slate-500 hover:bg-slate-50"}`}>
              {">"}
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
