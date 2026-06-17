import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { CaseSummary } from "@/types/dashboard";
import { StatusBadge } from "./StatusBadge";

export function CaseCard({ item }: { item: CaseSummary }) {
  const initials = item.candidateName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge label={item.statusLabel} />
        <MoreHorizontal className="h-4 w-4 text-slate-400" />
      </div>

      <div className="mt-3 flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-brand ring-1 ring-blue-100">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-bold">{item.candidateName}</h3>
          <p className="truncate text-xs text-slate-500">{item.roleTitle ?? "HR Specialist"}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <p className="truncate text-slate-700">
          {item.currentDepartment ?? "-"} <span className="text-slate-400">-&gt;</span> {item.targetDepartment ?? "-"}
        </p>
        <p className="truncate text-slate-500">
          {item.currentEntity ?? "-"} <span className="text-slate-400">-&gt;</span> {item.targetEntity ?? "-"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-xs">
        <div>
          <p className="font-semibold text-slate-500">Pending By</p>
          <p className="mt-1 font-bold">{item.pendingActor}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-500">Due Date</p>
          <p className={`mt-1 font-bold ${item.isOverdue ? "text-red-500" : "text-slate-700"}`}>{item.dueDate ?? "-"}</p>
        </div>
      </div>

      <Link href={`/internal-transfer/${item.caseId}`} className="mt-2 inline-block text-xs font-bold text-brand">
        View Details
      </Link>
    </article>
  );
}
