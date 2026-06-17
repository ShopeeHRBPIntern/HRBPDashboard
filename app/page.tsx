import { AlertCircle, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import Link from "next/link";
import { AppShell, SmallProgress } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { getDashboardSummary } from "@/lib/data";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <AppShell active="dashboard" title="Overall Dashboard" subtitle="Cross-process HRBP operations view.">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Total Open" value={summary.metrics.openCases} icon={UsersRound} />
        <MetricCard label="Overdue Tasks" value={summary.metrics.overdueTasks} icon={Clock3} tone="red" />
        <MetricCard label="Pending HRBP" value={summary.metrics.pendingHRBP} icon={CheckCircle2} tone="green" />
        <MetricCard label="Error Review" value={summary.metrics.errors} icon={AlertCircle} tone="orange" />
      </div>

      <div className="mt-6 grid grid-cols-[1.4fr_0.8fr] gap-6">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Process Health</h2>
            <span className="text-xs font-semibold text-slate-500">Generated {summary.generatedAt.slice(0, 10)}</span>
          </div>
          <div className="mt-5 grid gap-4">
            {summary.processes.map((process) => (
              <Link
                key={process.process}
                href={process.process === "internal_transfer" ? "/internal-transfer" : `/${process.process.replace("_", "-")}`}
                className="rounded-lg border border-line p-4 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold">{process.label}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {process.openCount} open, {process.overdueCount} overdue
                    </p>
                  </div>
                  <StatusBadge label={process.health === "healthy" ? "Completed" : process.health === "attention" ? "Salary Check" : "HOD Approval"} />
                </div>
                <div className="mt-4">
                  <SmallProgress done={process.health === "healthy" ? 4 : 2} total={4} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="font-bold">Recent Activity</h2>
          <div className="mt-5 space-y-4">
            {summary.recentActivity.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-1 h-8 w-8 rounded-full bg-blue-50 p-2 text-brand">
                  <Clock3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {item.caseId} by {item.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
