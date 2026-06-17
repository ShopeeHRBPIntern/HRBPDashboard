import { ArrowLeft, CalendarDays, FileSpreadsheet, Mail, MoreHorizontal, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell, CheckPill } from "@/components/AppShell";
import { ProgressStepper } from "@/components/ProgressStepper";
import { StatusBadge } from "@/components/StatusBadge";
import { getInternalTransferDetail, getInternalTransferCases } from "@/lib/data";

export default async function InternalTransferDetailPage({ params }: { params: { caseId: string } }) {
  const detail = await getInternalTransferDetail(params.caseId);
  if (!detail) notFound();

  const counts = { "internal-transfer": (await getInternalTransferCases()).total };

  const initials = detail.candidateName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell active="internal-transfer" title="Internal Transfer" subtitle="Case detail and workflow status." counts={counts}>
      <Link href="/internal-transfer" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
        <ArrowLeft className="h-4 w-4" />
        Back to Open Cases
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{detail.caseId}</h1>
            <StatusBadge label={detail.statusLabel} />
          </div>
          <p className="mt-2 text-sm text-slate-500">Submitted on {detail.submittedAt} <span className="mx-2 text-orange-400">-</span> Updated 20 May 2024 11:30</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-line bg-white px-5 py-3 text-sm font-bold text-slate-700">Edit</button>
          <button className="rounded-lg border border-line bg-white px-4 py-3 text-slate-600" aria-label="More">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1.1fr_0.55fr_0.55fr_1.75fr] gap-5">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <div className="flex gap-5">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 text-3xl font-bold text-brand">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-bold">{detail.candidateName}</h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4" /> {detail.candidateEmail}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4" /> 081-234-5678</p>
              <p className="mt-5 text-sm text-slate-600">{detail.roleTitle}</p>
              <p className="font-semibold">{detail.currentDepartment} Department</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2 text-xs">
            <span className="rounded-md bg-slate-100 px-3 py-2">Employee ID: {detail.employeeId}</span>
            <span className="rounded-md bg-slate-100 px-3 py-2">Service: {detail.serviceMonths}</span>
            <span className="rounded-md bg-slate-100 px-3 py-2">Grade: {detail.grade}</span>
          </div>
        </section>

        <InfoPanel title="Current Position" rows={[["Department", detail.currentDepartment], ["Entity", detail.currentEntity], ["Manager", detail.manager]]} />
        <InfoPanel title="Target Position" rows={[["Department", detail.targetDepartment], ["Entity", detail.targetEntity], ["Hiring Manager", detail.hiringManager]]} />
        <ProgressStepper events={detail.progress} />
      </div>

      <div className="mt-6 flex gap-8 border-b border-line text-sm font-bold">
        {["Overview", "Process & Timeline", "Documents", "History", "Sheet Sync Log"].map((tab, index) => (
          <span key={tab} className={`pb-4 ${index === 0 ? "border-b-2 border-brand text-brand" : "text-slate-600"}`}>{tab}</span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-[1.2fr_0.9fr_1fr] gap-5">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="font-bold">Transfer Information</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 text-sm">
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
          <h2 className="font-bold">Eligibility Check (Auto-Screen)</h2>
          <div className="mt-5 space-y-4 text-sm">
            <CheckRow label="Performance Grade (>= B+)" value={detail.grade} />
            <CheckRow label="Length of Service (>= 11 months)" value={detail.serviceMonths} />
            <CheckRow label="Rank Requirement" value="Pass" />
            <CheckRow label="Cross-Entity Rule (1st of month)" value="Eligible" />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <span className="font-bold">Result</span>
              <CheckPill>Eligible</CheckPill>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <h2 className="font-bold">Latest Activity</h2>
            <div className="mt-5 space-y-4">
              {detail.latestActivity.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-brand">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.occurredAt}</p>
                  </div>
                  <span className="text-xs text-slate-500">{item.actor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <h2 className="font-bold">Quick Actions</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Action label="Message P'Tae" icon={<Mail className="h-4 w-4" />} tone="purple" />
              <Action label="View Interview Schedule" icon={<CalendarDays className="h-4 w-4" />} />
              <Action label="View in Sheet 1" icon={<FileSpreadsheet className="h-4 w-4" />} tone="green" />
              <Action label="More Actions" icon={<MoreHorizontal className="h-4 w-4" />} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function InfoPanel({ title, rows }: { title: string; rows: Array<[string, string | undefined]> }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <h2 className="font-bold">{title}</h2>
      <div className="mt-5 space-y-5 text-sm">
        {rows.map(([label, value]) => (
          <Field key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-1 font-bold">{value || "-"}</div>
    </div>
  );
}

function CheckRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold">{value || "-"}</span>
      <span className="text-emerald-600">OK</span>
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
