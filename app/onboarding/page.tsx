import { AlertCircle, CheckCircle2, Clock3, Mail, UserPlus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { getOnboardingJoiners } from "@/lib/data";

const stepLabels: Record<string, string> = {
  message_1_pending: "Day 1 pending",
  message_1_sent: "Day 1 sent",
  message_2_pending: "Day 3 pending",
  message_2_day_3: "Day 3 sent",
  message_3_pending: "Week 1 pending",
  message_3_week_1: "Week 1 sent",
  completed: "Completed"
};

export default async function OnboardingPage() {
  const joiners = await getOnboardingJoiners();
  const active = joiners.items.filter((item) => !item.onboardingCompleted).length;
  const counts = { onboarding: joiners.total };

  return (
    <AppShell active="onboarding" title="Onboarding Process" subtitle="New joiner readiness and automated message tracking." counts={counts}>
      <div className="grid grid-cols-5 gap-4">
        <MetricCard label="Active Joiners" value={active} icon={UserPlus} />
        <MetricCard label="Completed" value={joiners.total - active} icon={CheckCircle2} tone="green" />
        <MetricCard label="Day 3 Due" value={joiners.stepCounts.message_2_day_3 ?? 0} icon={Mail} tone="orange" />
        <MetricCard label="Week 1 Due" value={joiners.stepCounts.message_3_week_1 ?? 0} icon={Clock3} tone="purple" />
        <MetricCard label="Needs Review" value={0} icon={AlertCircle} tone="red" />
      </div>

      <section className="mt-6 rounded-lg border border-line bg-white shadow-panel">
        <div className="grid grid-cols-[minmax(180px,1.5fr)_minmax(140px,1fr)_minmax(180px,1.2fr)_minmax(120px,0.9fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-4 border-b border-line px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          <span>Joiner</span>
          <span>Team</span>
          <span>HRBP / Buddy</span>
          <span>Join Date</span>
          <span>Step Tracker</span>
          <span>Manager</span>
        </div>
        <div className="divide-y divide-line">
          {joiners.items.map((item) => (
            <div key={item.dbKey} className="grid grid-cols-[minmax(180px,1.5fr)_minmax(140px,1fr)_minmax(180px,1.2fr)_minmax(120px,0.9fr)_minmax(140px,1fr)_minmax(140px,1fr)] gap-4 px-5 py-4 text-sm">
              <div className="min-w-0">
                <p className="font-bold truncate">{item.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{item.companyEmail}</p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.department}</p>
                <p className="text-xs text-slate-500 truncate">{item.team} / {item.legalEntity}</p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.hrbpName}</p>
                <p className="text-xs text-slate-500 truncate">{item.buddyEmail}</p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.dateOfJoin}</p>
                <p className="text-xs text-slate-500 truncate">Probation {item.endOfProbation}</p>
              </div>
              <div className="min-w-0">
                <span className={`rounded-md px-2 py-1 text-xs font-bold ${item.onboardingCompleted ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-brand"}`}>
                  {stepLabels[item.stepTracker] ?? "Needs review"}
                </span>
                <p className="mt-2 text-xs text-slate-500 truncate">
                  Next: {item.nextStepTracker ? stepLabels[item.nextStepTracker] ?? item.nextStepTracker : "-"}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.speReportingManager ?? "-"}</p>
                <p className="text-xs text-slate-500 truncate">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
