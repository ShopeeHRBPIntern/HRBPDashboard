import { ArrowLeft, CalendarDays, FileSpreadsheet, Mail, MoreHorizontal, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell, CheckPill } from "@/components/AppShell";
import { ProgressStepper } from "@/components/ProgressStepper";
import { StatusBadge } from "@/components/StatusBadge";
import { getInternalTransferDetail, getInternalTransferCases } from "@/lib/data";

export default async function InternalTransferDetailPage({ params }: { params: { caseId: string } }) {
  const [detail, cases] = await Promise.all([getInternalTransferDetail(params.caseId), getInternalTransferCases()]);
  if (!detail) notFound();

  const counts = { "internal-transfer": cases.total };
  const initials = detail.candidateName
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell active="internal-transfer" title="Internal Transfer" subtitle="Case detail and workflow status." counts={counts}>
      <div className="mb-4">
        <Link href="/internal-transfer" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand">
          <ArrowLeft className="h-4 w-4" />
          Back to Open Cases
        </Link>
      </div>

      <section className="rounded-lg border border-line bg-white shadow-panel">
        <div className="flex flex-col gap-4 border-b border-line px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-950">{detail.caseId}</h2>
              <StatusBadge label={detail.statusLabel || detail.status} />
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Submitted {detail.submittedAt ?? "-"} · Updated {detail.updatedAt ?? "-"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50">Edit</button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-slate-500 shadow-sm hover:bg-slate-50" aria-label="More">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 bg-slate-50/60 p-5 xl:grid-cols-[1fr_1.2fr]">
          <section className="rounded-lg border border-line bg-white p-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-brand ring-1 ring-blue-200">{initials}</div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-bold text-slate-950">{detail.candidateName}</h3>
                <p className="mt-2 flex items-center gap-2 truncate text-sm font-semibold text-slate-600">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  {detail.candidateEmail ?? "-"}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  081-234-5678
                </p>
                <p className="mt-4 text-sm font-bold text-slate-950">{detail.currentRole ?? detail.roleTitle ?? "-"}</p>
                <p className="text-sm font-semibold text-slate-500">{detail.currentDepartment ?? "-"} Department</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-xs font-semibold sm:grid-cols-3">
              <MetaPill label="Employee ID" value={detail.employeeId} />
              <MetaPill label="Service" value={detail.serviceMonths} />
              <MetaPill label="Grade" value={detail.grade} />
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <InfoPanel title="Current Position" rows={[["Role", detail.currentRole], ["Department", detail.currentDepartment], ["Entity", detail.currentEntity], ["Manager", detail.manager]]} />
            <InfoPanel title="Target Position" rows={[["Role", detail.targetRole], ["Department", detail.targetDepartment], ["Entity", detail.targetEntity], ["Hiring Manager", detail.hiringManager]]} />
          </div>
        </div>
      </section>

      <div className="mt-5">
        <ProgressStepper events={detail.progress} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="font-bold text-slate-950">Transfer Information</h2>
          <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
            <Field label="Target Department" value={detail.targetDepartment} />
            <Field label="Current Manager" value={detail.manager} />
            <Field label="Target Position" value={detail.targetRole} />
            <Field label="Current Entity" value={detail.currentEntity} />
            <Field label="Expected Effective Date" value={detail.dueDate} />
            <Field label="Target Entity" value={detail.targetEntity} />
            <Field label="Submitted Date" value={detail.submittedAt} />
            <Field label="Cross-Entity" value={<CheckPill>Yes</CheckPill>} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="font-bold text-slate-950">Eligibility Check</h2>
          <div className="mt-5 space-y-4 text-sm">
            <CheckRow label="Performance Grade" value={detail.grade} />
            <CheckRow label="Length of Service" value={detail.serviceMonths} />
            <CheckRow label="Rank Requirement" value={detail.currentRank} />
            <CheckRow label="Cross-Entity Rule" value="Eligible" />
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-line bg-white shadow-panel">
        <div className="flex flex-wrap gap-6 border-b border-line px-5 text-sm font-bold">
          <a href="#process" className="border-b-2 border-brand py-4 text-brand">Process</a>
          <a href="#timeline" className="py-4 text-slate-600 hover:text-slate-900">Timeline</a>
        </div>
        <div className="grid gap-5 p-5 xl:grid-cols-[1fr_0.9fr]">
          <div id="process" className="space-y-3">
            <h3 className="font-bold text-slate-950">Process Details</h3>
            {detail.progress.map((event, index) => (
              <details key={event.id} className="rounded-lg border border-line bg-slate-50/60 p-4" open={index === 0}>
                <summary className="cursor-pointer text-sm font-bold text-slate-900">{index + 1}. {event.title}</summary>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <Field label="Actor" value={event.actor} />
                  <Field label="Status" value={<StatusBadge label={event.status} />} />
                  <Field label="Occurred At" value={event.occurredAt ?? "-"} />
                </div>
              </details>
            ))}
          </div>
          <div id="timeline" className="space-y-3">
            <h3 className="font-bold text-slate-950">Latest Activity</h3>
            {detail.latestActivity.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border border-line p-4 text-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand">
                  <UserRound className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{item.occurredAt ?? "-"} · {item.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-line bg-white p-5 shadow-panel">
        <h2 className="font-bold text-slate-950">Quick Actions</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Action label="Message P'Tae" icon={<Mail className="h-4 w-4" />} tone="purple" />
          <Action label="View Interview Schedule" icon={<CalendarDays className="h-4 w-4" />} />
          <Action label="View in Sheet 1" icon={<FileSpreadsheet className="h-4 w-4" />} tone="green" />
          <Action label="More Actions" icon={<MoreHorizontal className="h-4 w-4" />} />
        </div>
      </section>
    </AppShell>
  );
}

function MetaPill({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md bg-slate-100 px-3 py-2">
      <span className="text-slate-400">{label}: </span>
      <span className="font-bold text-slate-700">{value || "-"}</span>
    </div>
  );
}

function InfoPanel({ title, rows }: { title: string; rows: Array<[string, string | undefined]> }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <h2 className="font-bold text-slate-950">{title}</h2>
      <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2 md:grid-cols-1">
        {rows.map(([label, value]) => (
          <Field key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-1 truncate font-bold text-slate-900">{value || "-"}</div>
    </div>
  );
}

function CheckRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{value || "-"}</span>
      <CheckPill>OK</CheckPill>
    </div>
  );
}

function Action({ label, icon, tone }: { label: string; icon: ReactNode; tone?: "purple" | "green" }) {
  const className = tone === "purple" ? "bg-purple-50 text-purple-700" : tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-white text-slate-700";
  return (
    <button className={`flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-3 text-sm font-bold ${className}`}>
      {icon}
      {label}
    </button>
  );
}
