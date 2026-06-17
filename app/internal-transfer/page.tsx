import { ClipboardCheck, FileDown, Plus, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CaseCard } from "@/components/CaseCard";
import { MetricCard } from "@/components/MetricCard";
import { getInternalTransferCases } from "@/lib/data";

const tabs = ["All Open", "HR Screening", "Salary Check", "Interviewing", "Decision", "HOD Approval"];

export default async function InternalTransferPage() {
  const cases = await getInternalTransferCases();

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
        <MetricCard label="All Open" value={12} tone="blue" />
        <MetricCard label="HR Screening" value={2} tone="cyan" />
        <MetricCard label="Salary Check" value={3} tone="orange" />
        <MetricCard label="Interviewing" value={4} tone="green" />
        <MetricCard label="Decision" value={2} tone="purple" />
        <MetricCard label="HOD Approval" value={1} tone="red" />
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_auto_auto_auto] gap-3">
        <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-3 text-sm text-slate-500">
          <Search className="h-4 w-4" />
          <input className="w-full outline-none" placeholder="Search by name, email, or department..." />
        </label>
        {["Status: All Open", "Pending By: All", "Department: All", "Entity: All"].map((item) => (
          <button key={item} className="rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-600">
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        {tabs.map((tab) => (
          <button key={tab} className={`rounded-lg border px-4 py-2 text-sm font-bold ${tab === "All Open" ? "border-blue-200 bg-blue-50 text-brand" : "border-line bg-white text-slate-600"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-5 xl:grid-cols-4">
        {cases.items.map((item) => (
          <CaseCard key={item.caseId} item={item} />
        ))}
        <article className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="flex items-center gap-3 text-slate-500">
            <ClipboardCheck className="h-5 w-5" />
            <p className="text-sm font-semibold">Showing {cases.items.length} live mock cases from the dashboard adapter.</p>
          </div>
        </article>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <span>Showing 1 to {cases.items.length} of 12 open cases</span>
        <div className="flex gap-2">
          <span className="rounded-lg bg-brand px-3 py-2 font-bold text-white">1</span>
          <span className="rounded-lg bg-white px-3 py-2 font-bold">2</span>
          <span className="rounded-lg bg-white px-3 py-2 font-bold">Next</span>
        </div>
      </div>
    </AppShell>
  );
}
