"use client";
import { useEffect, useRef, useState } from "react";
import { UsersRound } from "lucide-react";
import type { HrbpOwner } from "@/types/dashboard";

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function HrbpOwnerBadge({ owner }: { owner: HrbpOwner }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
        className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        aria-label={`HRBP owner ${owner.nickname}`}
      >
        {owner.initials || initialsFrom(owner.name )}
      </button>
      {visible ? (
        <div className="absolute left-1/2 top-full z-20 mt-2 w-48 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              {owner.initials || initialsFrom(owner.name)}
            </span>
            <div className="truncate">
              <p className="font-semibold text-slate-900">{owner.nickname || owner.nickname}</p>
              <p className="truncate text-xs text-slate-500">{owner.nickname}</p>
            </div>
          </div>
          {owner.email ? <p className="mt-2 text-xs text-slate-500">{owner.email}</p> : null}
        </div>
      ) : null}
    </div>
  );
}