import { ClipboardCheck, FileDown, Plus, Search, UsersRound, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CaseCard } from "@/components/CaseCard";
import { MetricCard } from "@/components/MetricCard";
import { getInternalTransferCases } from "@/lib/data";

const tabs = ["All Open", "HR Screening", "Salary Check", "Interviewing", "Decision", "HOD Approval"];

export default async function InternalTransferPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const cases = await getInternalTransferCases();
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const status = typeof searchParams?.status === "string" ? searchParams.status : "";

  let items = cases.items;
  if (q) {
    const ql = q.toLowerCase();
    items = items.filter((item) => (item.candidateName ?? "").toLowerCase().includes(ql) || (item.candidateEmail ?? "").toLowerCase().includes(ql) || (item.employeeId ?? "").toLowerCase().includes(ql) || (item.caseId ?? "").toLowerCase().includes(ql));
  }
  if (status && status !== "All Open") {
    items = items.filter((item) => item.statusLabel === status);
  }

  return (
    <AppShell active="internal-transfer" title="Internal Transfer" subtitle="Open cases from Google Form submissions, auto-screening, and pending HRBP actions.">
      <div className="mb-5 flex justify-end gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4" />
          New Case
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-bold text-slate-600">
          <FileDown className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <MetricCard label="All Open" value={cases.total} tone="blue" icon={ClipboardCheck} />
        <MetricCard label="HR Screening" value={cases.statusCounts["HR Screening"] ?? 0} tone="cyan" icon={UsersRound} />
        <MetricCard label="Salary Check" value={cases.statusCounts["Salary Check"] ?? 0} tone="orange" icon={CheckCircle2} />
        <MetricCard label="Interviewing" value={cases.statusCounts["Interviewing"] ?? 0} tone="green" icon={Clock3} />
        <MetricCard label="Decision" value={cases.statusCounts["Decision"] ?? 0} tone="purple" icon={AlertTriangle} />
        <MetricCard label="HOD Approval" value={cases.statusCounts["HOD Approval"] ?? 0} tone="red" icon={AlertTriangle} />
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_auto_auto_auto] gap-3">
        <form className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm text-slate-500" method="get">
          <Search className="h-4 w-4" />
          <input name="q" defaultValue={q} className="w-full outline-none" placeholder="Search by name, email, or department..." />
        </form>
        <div />
        <div />
        <div />
        <div />
      </div>

      <div className="mt-5 flex gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={tab === "All Open" ? "/internal-transfer" : `/internal-transfer?status=${encodeURIComponent(tab)}`}
            className={`rounded-lg border px-4 py-2 text-sm font-bold ${tab === "All Open" && !status ? "border-blue-200 bg-blue-50 text-brand" : status === tab ? "border-blue-200 bg-blue-50 text-brand" : "border-line bg-white text-slate-600"}`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-5 xl:grid-cols-4">
        {items.map((item) => (
          <CaseCard key={item.caseId} item={item} />
        ))}
        <article className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="flex items-center gap-3 text-slate-500">
            <ClipboardCheck className="h-5 w-5" />
            <p className="text-sm font-semibold">Showing {items.length} live cases from the dashboard adapter.</p>
          </div>
        </article>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <span>Showing 1 to {items.length} of {cases.total} open cases</span>
        <div className="flex gap-2">
          <span className="rounded-lg bg-brand px-3 py-2 font-bold text-white">1</span>
          <span className="rounded-lg bg-white px-3 py-2 font-bold">2</span>
          <span className="rounded-lg bg-white px-3 py-2 font-bold">Next</span>
        </div>
      </div>
    </AppShell>
  );
}
