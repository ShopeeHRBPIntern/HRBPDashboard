import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { HrbpOwnerBadge } from "@/components/HrbpOwnerBadge";
import OwnerFilter from "@/components/OwnerFilter";
import { getOnboardingJoiners } from "@/lib/data";
import type { HrbpOwner } from "@/types/dashboard";

const stepLabels: Record<string, string> = {
  message_1_pending: "Day 1 pending",
  message_1_sent: "Day 1 sent",
  message_2_pending: "Day 3 pending",
  message_2_day_3: "Day 3 sent",
  message_3_pending: "Week 1 pending",
  message_3_week_1: "Week 1 sent",
  completed: "Completed"
};

function paramValue(value?: string | string[]) {
  return typeof value === "string" ? value : "";
}

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function initialsFrom(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function stepLabel(value?: string) {
  if (!value) return "-";
  return stepLabels[value] ?? value.replaceAll("_", " ");
}

function statusClass(completed: boolean) {
  return completed ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-brand";
}

export default async function OnboardingPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const joiners = await getOnboardingJoiners();
  const q = paramValue(searchParams?.q);
  const step = paramValue(searchParams?.step);
  const selectedHrbps = Array.isArray(searchParams?.hrbp)
    ? searchParams.hrbp.flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean)
    : typeof searchParams?.hrbp === "string"
    ? searchParams.hrbp.split(",").map((value) => value.trim()).filter(Boolean)
    : [];
  const active = joiners.items.filter((item) => !item.onboardingCompleted).length;
  const counts = { onboarding: joiners.total };
  const hrbps: HrbpOwner[] = unique(joiners.items.flatMap((item) => [item.hrbpName, item.hrbpEmail])).map((id) => {
    const match = joiners.items.find((item) => item.hrbpName === id || item.hrbpEmail === id);
    const name = match?.hrbpName || id;
    return {
      id,
      name,
      nickname: name,
      email: match?.hrbpEmail,
      initials: initialsFrom(name)
    };
  });
  const steps = unique(joiners.items.map((item) => item.stepTracker));

  let items = joiners.items;
  if (q) {
    const normalized = q.toLowerCase();
    items = items.filter(
      (item) =>
        (item.fullName ?? "").toLowerCase().includes(normalized) ||
        (item.companyEmail ?? "").toLowerCase().includes(normalized) ||
        (item.department ?? "").toLowerCase().includes(normalized) ||
        (item.team ?? "").toLowerCase().includes(normalized) ||
        (item.hrbpName ?? "").toLowerCase().includes(normalized) ||
        (item.hrbpEmail ?? "").toLowerCase().includes(normalized)
    );
  }
  if (selectedHrbps.length) items = items.filter((item) => selectedHrbps.some((owner) => item.hrbpName === owner || item.hrbpEmail === owner));
  if (step) items = items.filter((item) => item.stepTracker === step);

  const hasActiveFilters = Boolean(q || selectedHrbps.length || step);

  return (
    <AppShell active="onboarding" title="Onboarding Process" subtitle="New joiner readiness and automated message tracking." counts={counts}>
      <section className="rounded-lg border border-line bg-white shadow-panel">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Onboarding Queue</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">Track joiner readiness, HRBP ownership, and next automated message step.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Active</p>
              <p className="text-lg font-bold text-slate-950">{active}</p>
            </div>
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Completed</p>
              <p className="text-lg font-bold text-emerald-600">{joiners.total - active}</p>
            </div>
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Day 3</p>
              <p className="text-lg font-bold text-orange-600">{joiners.stepCounts.message_2_day_3 ?? 0}</p>
            </div>
            <div className="rounded-md border border-line px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Week 1</p>
              <p className="text-lg font-bold text-purple-600">{joiners.stepCounts.message_3_week_1 ?? 0}</p>
            </div>
          </div>
        </div>

        <form className="grid gap-3 px-5 py-4 md:grid-cols-2 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]" method="get">
          {selectedHrbps.map((owner) => (
            <input key={owner} type="hidden" name="hrbp" value={owner} />
          ))}
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm text-slate-500 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input name="q" defaultValue={q} className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search joiner, email, team, HRBP..." />
          </label>

          <OwnerFilter owners={hrbps} selectedOwners={selectedHrbps} basePath="/onboarding" ownerParam="hrbp" label="HRBP" filters={{ q, step }} />

          <label className="relative">
            <span className="sr-only">Step tracker</span>
            <select name="step" defaultValue={step} className="h-10 w-full appearance-none rounded-md border border-line bg-white px-3 pr-8 text-xs font-semibold text-slate-600 shadow-sm outline-none transition focus:border-brand">
              <option value="">Step: All</option>
              {steps.map((option) => (
                <option key={option} value={option}>
                  {stepLabel(option)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
          </label>

          <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50">
            <Search className="h-4 w-4" />
            Filter
          </button>
        </form>

        <div className="flex items-center justify-between border-t border-line px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Showing {items.length} of {joiners.total} joiners</p>
          {hasActiveFilters ? (
            <Link href="/onboarding" className="text-xs font-bold text-slate-500 hover:text-slate-800">
              Clear Filters
            </Link>
          ) : null}
        </div>

        <div className="overflow-x-auto bg-slate-50/60 p-5">
          <div className="min-w-[980px] overflow-hidden rounded-lg border border-line bg-white">
            <div className="grid grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1.1fr_1fr] gap-4 border-b border-line bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
              <span>Joiner</span>
              <span>Team</span>
              <span>HRBP / Buddy</span>
              <span>Join Date</span>
              <span>Step Tracker</span>
              <span>Manager</span>
            </div>
            <div className="divide-y divide-line">
              {items.map((item) => (
                <div key={item.dbKey} className="grid grid-cols-[1.4fr_1fr_1.1fr_0.8fr_1.1fr_1fr] gap-4 px-4 py-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950">{item.fullName}</p>
                    <p className="truncate text-xs font-semibold text-slate-500">{item.companyEmail}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{item.department}</p>
                    <p className="truncate text-xs text-slate-500">
                      {item.team} / {item.legalEntity}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      {item.hrbpName || item.hrbpEmail ? (
                        <HrbpOwnerBadge
                          owner={{
                            id: item.hrbpEmail || item.hrbpName || "",
                            name: item.hrbpName || item.hrbpEmail || "",
                            nickname: item.hrbpName || item.hrbpEmail,
                            email: item.hrbpEmail,
                            initials: initialsFrom(item.hrbpName || item.hrbpEmail || "")
                          }}
                          compact
                        />
                      ) : null}
                      <p className="truncate font-semibold text-slate-800">{item.hrbpName || item.hrbpEmail || "-"}</p>
                    </div>
                    <p className="truncate text-xs text-slate-500">{item.buddyEmail}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{item.dateOfJoin}</p>
                    <p className="truncate text-xs text-slate-500">Probation {item.endOfProbation}</p>
                  </div>
                  <div className="min-w-0">
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusClass(item.onboardingCompleted)}`}>{stepLabel(item.stepTracker)}</span>
                    <p className="mt-2 truncate text-xs font-semibold text-slate-500">Next: {stepLabel(item.nextStepTracker)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{item.speReportingManager ?? "-"}</p>
                    <p className="truncate text-xs text-slate-500">{item.location}</p>
                  </div>
                </div>
              ))}
              {!items.length ? <div className="p-8 text-center text-sm font-semibold text-slate-500">No joiners match the selected filters.</div> : null}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
