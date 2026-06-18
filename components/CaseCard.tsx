import { CalendarDays, ChevronRight, Clock3, MoreVertical, UserRound } from "lucide-react";
import Link from "next/link";
import type { CaseSummary } from "@/types/dashboard";
import { HrbpOwnerBadge } from "./HrbpOwnerBadge";
import { StatusBadge } from "./StatusBadge";

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function displayDate(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function actorLabel(value?: string) {
  if (!value) return "-";
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part[0] + part.slice(1).toLowerCase())
    .join(" ");
}

function parseOwners(value?: string) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
  } catch {}
  return value.split(/[,;|]/).map((item) => item.trim()).filter(Boolean);
}

export function CaseCard({ item, variant = "grid" }: { item: CaseSummary; variant?: "grid" | "list" }) {
  const initials = initialsFrom(item.candidateName);
  const ownerBadges =
    item.hrbpOwners?.length
      ? item.hrbpOwners
      : parseOwners(item.hrbpCase).map((owner) => ({
          id: owner,
          name: owner,
          nickname: owner,
          initials: initialsFrom(owner)
        }));

  return (
    <article className={`${variant === "list" ? "relative grid gap-4 p-4 pr-12 lg:grid-cols-[1.2fr_1fr_0.8fr_auto] lg:items-center" : "min-h-[258px] p-4"} rounded-lg border border-line bg-white shadow-[0_8px_24px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:shadow-panel`}>
      <div className={variant === "list" ? "min-w-0" : ""}>
        <div className="flex items-start justify-between gap-3">
          <StatusBadge label={item.statusLabel} />
          {variant === "grid" ? (
            <button className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-600" aria-label="Case actions">
              <MoreVertical className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
            {initials || <UserRound className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-950">{item.candidateName}</h3>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{item.currentRole ?? "Internal Transfer"}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">HRBP Owner</span>
        <div className="flex min-w-0 items-center justify-end">
          {ownerBadges.length ? (
            <>
              {ownerBadges.slice(0, 4).map((owner, index) => (
                <span key={owner.id} className="relative inline-flex" style={{ marginLeft: index ? -7 : 0 }}>
                  <HrbpOwnerBadge owner={owner} compact />
                </span>
              ))}
              {ownerBadges.length > 4 ? <span className="-ml-1 inline-flex h-6 items-center rounded-full bg-slate-100 px-1.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">+{ownerBadges.length - 4}</span> : null}
            </>
          ) : (
            <span className="text-xs font-semibold text-slate-400">Unassigned</span>
          )}
        </div>
      </div>

      <div className={`${variant === "list" ? "mt-0" : "mt-4"} space-y-2 text-xs font-semibold`}>
        <p className="truncate text-slate-600">
          {item.currentRole ?? "-"} <span className="px-1 text-slate-300">-&gt;</span> {item.targetRole ?? "-"}
        </p>
        <p className="truncate text-slate-500">
          {item.currentEntity ?? "-"} <span className="px-1 text-slate-300">-&gt;</span> {item.targetEntity ?? "-"}
        </p>
      </div>

      <div className={`${variant === "list" ? "mt-0 border-l border-line pl-4" : "mt-4 border-t border-line pt-3"} grid grid-cols-3 gap-2 text-[10px] font-semibold text-slate-500`}>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">Submitted</span>
          </div>
          <p className="mt-1 truncate text-slate-700">{displayDate(item.submittedAt)}</p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <Clock3 className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">Pending By</span>
          </div>
          <p className="mt-1 truncate text-slate-700">{actorLabel(item.pendingActor)}</p>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3 shrink-0 text-red-400" />
            <span className="truncate">Due Date</span>
          </div>
          <p className={`mt-1 truncate ${item.isOverdue ? "text-red-500" : "text-slate-700"}`}>{displayDate(item.dueDate)}</p>
        </div>
      </div>

      <Link href={`/internal-transfer/${item.caseId}`} className={`${variant === "list" ? "mt-0 justify-end gap-2 self-center border-l border-line pl-4" : "mt-4 justify-between border-t border-line pt-3"} flex items-center text-xs font-bold text-brand`}>
        <span>View Details</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
      {variant === "list" ? (
        <button className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 hover:text-slate-600" aria-label="Case actions">
          <MoreVertical className="h-4 w-4" />
        </button>
      ) : null}
    </article>
  );
}
