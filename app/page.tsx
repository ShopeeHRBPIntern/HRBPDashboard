import { AlertCircle, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Clock3, RefreshCcw, UserPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import { AppShell, SmallProgress } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getDashboardSummary } from "@/lib/data";

const processMeta = {
  internal_transfer: { href: "/internal-transfer", icon: BriefcaseBusiness, tone: "bg-blue-50 text-blue-700", label: "Internal Transfer" },
  conversion: { href: "/conversion", icon: RefreshCcw, tone: "bg-purple-50 text-purple-700", label: "Conversion" },
  onboarding: { href: "/onboarding", icon: UserPlus, tone: "bg-emerald-50 text-emerald-700", label: "Onboarding" }
} as const;

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const counts = {
    dashboard: summary.metrics.openCases,
    "internal-transfer": summary.processes.find((p) => p.process === "internal_transfer")?.openCount ?? 0,
    conversion: summary.processes.find((p) => p.process === "conversion")?.openCount ?? 0,
    onboarding: summary.processes.find((p) => p.process === "onboarding")?.openCount ?? 0
  };

  const metricCards = [
    { label: "Open Cases", value: summary.metrics.openCases, icon: UsersRound, tone: "bg-blue-50 text-blue-700" },
    { label: "Overdue", value: summary.metrics.overdueTasks, icon: Clock3, tone: "bg-red-50 text-red-600" },
    { label: "Pending HRBP", value: summary.metrics.pendingHRBP, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Needs Review", value: summary.metrics.errors, icon: AlertCircle, tone: "bg-orange-50 text-orange-600" }
  ];

  return (
    <AppShell active="dashboard" title="Overall Dashboard" subtitle="Cross-process HRBP operations view." counts={counts}>
      <section className="rounded-lg border border-line bg-white shadow-panel">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Operations Overview</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">Generated {summary.generatedAt.slice(0, 10)} from live process adapters.</p>
          </div>
          <Link href="/internal-transfer" className="inline-flex h-9 items-center gap-2 rounded-md bg-brand px-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700">
            Open cases
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 border-b border-line p-5 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-lg border border-line bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">{metric.value}</p>
                  </div>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${metric.tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-5 bg-slate-50/60 p-5 xl:grid-cols-[1.5fr_0.85fr]">
          <section className="rounded-lg border border-line bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-slate-950">Process Health</h3>
              <span className="text-xs font-semibold text-slate-500">{summary.processes.length} active processes</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {summary.processes.map((process) => {
                const meta = processMeta[process.process];
                const Icon = meta.icon;
                return (
                  <Link key={process.process} href={meta.href} className="group rounded-lg border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-panel">
                    <div className="flex items-start justify-between gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${meta.tone}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-brand" />
                    </div>
                    <p className="mt-4 font-bold text-slate-950">{meta.label}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {process.openCount} open, {process.overdueCount} overdue
                    </p>
                    <div className="mt-4">
                      <SmallProgress done={process.health === "healthy" ? 4 : process.health === "attention" ? 2 : 1} total={4} />
                    </div>
                    <div className="mt-4">
                      <StatusBadge label={process.health === "healthy" ? "Completed" : process.health === "attention" ? "Salary Check" : "HOD Approval"} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-slate-950">Recent Activity</h3>
              <Clock3 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 space-y-3">
              {summary.recentActivity.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-lg border border-line p-3">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                      {item.caseId} by {item.actor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
