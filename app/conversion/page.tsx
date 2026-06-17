import { AlertTriangle, CheckCircle2, Clock3, FileSpreadsheet, RefreshCcw } from "lucide-react";
import { AppShell, SmallProgress } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { getConversionCases } from "@/lib/data";

const steps = ["Start", "Eligibility", "HOC Approval", "Effective Date", "Sheet Update", "Completed"];

export default async function ConversionPage() {
  const cases = await getConversionCases();
  const counts = { conversion: cases.total };

  return (
    <AppShell active="conversion" title="Conversion Process" subtitle="Partially connected conversion process with live case rows and mockup-only workflow steps." counts={counts}>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
        Conversion workflow is partially connected. Some steps are mockup-only in v1.
      </div>

      <div className="mt-5 grid grid-cols-5 gap-4">
        <MetricCard label="Active Cases" value={cases.total} icon={RefreshCcw} tone="blue" />
        <MetricCard label="Waiting HOC" value={1} icon={Clock3} tone="purple" />
        <MetricCard label="Waiting Date" value={0} icon={Clock3} tone="orange" />
        <MetricCard label="Ready Update" value={1} icon={FileSpreadsheet} tone="green" />
        <MetricCard label="Completed" value={1} icon={CheckCircle2} tone="green" />
      </div>

      <div className="mt-6 grid grid-cols-[1fr_0.8fr] gap-6">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="font-bold">Conversion Cases</h2>
          <div className="mt-5 divide-y divide-line">
            {cases.items.map((item) => (
              <div key={item.caseId} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold">{item.caseId}</p>
                    <StatusBadge label={item.statusLabel} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{item.nextAction}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold">{item.pendingActor}</p>
                  <p className="text-slate-500">{item.updatedAt?.slice(0, 10)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="font-bold">Workflow Preview</h2>
          <div className="mt-5 space-y-5">
            {steps.map((step, index) => (
              <div key={step}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-bold">{step}</span>
                  {index > 2 ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      <AlertTriangle className="h-3 w-3" />
                      Mockup
                    </span>
                  ) : (
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-brand">Live</span>
                  )}
                </div>
                <SmallProgress done={Math.min(index + 1, 3)} total={6} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
