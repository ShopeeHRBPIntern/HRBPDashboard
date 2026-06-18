"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { HrbpOwner } from "@/types/dashboard";

export default function OwnerFilter({ owners, selectedOwners, q, status }: { owners: HrbpOwner[]; selectedOwners: string[]; q?: string; status?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function updateSelection(next: string[]) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    next.forEach((value) => params.append("owner", value));
    setOpen(false);
    router.push(`/internal-transfer?${params.toString()}`);
  }

  function toggleOwner(id: string) {
    const next = selectedOwners.includes(id)
      ? selectedOwners.filter((value) => value !== id)
      : [...selectedOwners, id];
    updateSelection(next);
  }

  const label = selectedOwners.length ? `${selectedOwners.length} selected` : "All HRBP";

  return (
    <div ref={ref} className="relative w-full max-w-xs text-sm">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-left text-slate-700 transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/10"
      >
        {label}
      </button>
      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-xl border border-line bg-white shadow-lg">
          {owners.map((owner) => {
            const active = selectedOwners.includes(owner.id);
            return (
              <button
                key={owner.id}
                type="button"
                onClick={() => toggleOwner(owner.id)}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${active ? "bg-brand/10 text-brand" : "hover:bg-slate-50 text-slate-700"}`}
              >
                <span>{owner.nickname || owner.name}</span>
                {active ? <span className="text-xs font-semibold text-brand">Selected</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
      {/* Selected chips + owner-level clear */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {owners
          .filter((o) => selectedOwners.includes(o.id))
          .map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => toggleOwner(o.id)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">{o.initials}</span>
              <span className="truncate max-w-[8rem]">{o.nickname || o.name}</span>
              <span className="ml-1 text-slate-400">✕</span>
            </button>
          ))}
        {selectedOwners.length ? (
          <button
            type="button"
            onClick={() => updateSelection([])}
            className="ml-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
