"use client";
import { useEffect, useRef, useState } from "react";
import type { HrbpOwner } from "@/types/dashboard";

function initialsFrom(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ownerLabel(owner: HrbpOwner) {
  return owner.nickname || owner.name || owner.email || owner.id;
}

export function HrbpOwnerBadge({ owner, compact = false }: { owner: HrbpOwner; compact?: boolean }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = ownerLabel(owner);
  const initials = owner.initials || initialsFrom(label);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className={`${compact ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-[11px]"} inline-flex items-center justify-center rounded-full border-2 border-white bg-blue-100 font-bold text-blue-700 shadow-sm ring-1 ring-blue-200 transition hover:z-10 hover:scale-105 hover:bg-blue-200`}
        aria-label={`HRBP owner ${label}`}
        title={label}
      >
        {initials}
      </button>
      {visible ? (
        <div className="absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-md border border-slate-200 bg-white p-3 text-sm shadow-[0_12px_32px_rgba(9,30,66,0.18)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-1 ring-blue-200">{initials}</span>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900">{label}</p>
              {owner.email ? <p className="truncate text-xs font-semibold text-slate-500">{owner.email}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
