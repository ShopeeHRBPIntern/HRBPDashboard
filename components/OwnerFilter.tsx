"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Search, UserRound, X } from "lucide-react";
import type { HrbpOwner } from "@/types/dashboard";

type OwnerFilterState = Record<string, string | undefined>;

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

export default function OwnerFilter({
  owners,
  selectedOwners,
  filters = {},
  basePath = "/internal-transfer",
  ownerParam = "owner",
  label = "HRBP"
}: {
  owners: HrbpOwner[];
  selectedOwners: string[];
  filters?: OwnerFilterState;
  basePath?: string;
  ownerParam?: string;
  label?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  const selectedOwnerDetails = selectedOwners.map((id) => owners.find((owner) => owner.id === id) ?? ({ id, name: id, initials: initialsFrom(id) } as HrbpOwner));

  const filteredOwners = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return owners;
    return owners.filter((owner) => [owner.name, owner.nickname, owner.email, owner.id].some((value) => (value ?? "").toLowerCase().includes(normalized)));
  }, [owners, query]);

  function pushSelection(next: string[]) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    next.forEach((value) => params.append(ownerParam, value));
    const url = params.toString();
    router.push(`${basePath}${url ? `?${url}` : ""}`);
  }

  function toggleOwner(id: string) {
    const next = selectedOwners.includes(id) ? selectedOwners.filter((value) => value !== id) : [...selectedOwners, id];
    pushSelection(next);
  }

  const active = selectedOwners.length > 0;

  return (
    <div ref={ref} className="relative min-w-0">
      <div className={`flex h-10 w-full items-center rounded-md border bg-white shadow-sm transition ${active ? "border-blue-300 ring-1 ring-blue-100" : "border-line hover:bg-slate-50"}`}>
        <button type="button" onClick={() => setOpen((current) => !current)} className="flex min-w-0 flex-1 items-center gap-2 px-3 text-left text-xs font-semibold text-slate-600" aria-expanded={open}>
          <span className="shrink-0">{label}</span>
          {active ? (
            <span className="flex min-w-0 items-center">
              {selectedOwnerDetails.slice(0, 3).map((owner, index) => (
                <span
                  key={owner.id}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-[10px] font-bold text-blue-700"
                  style={{ marginLeft: index ? -6 : 0 }}
                  title={ownerLabel(owner)}
                >
                  {owner.initials || initialsFrom(ownerLabel(owner))}
                </span>
              ))}
              {selectedOwnerDetails.length > 3 ? <span className="-ml-1 rounded-full bg-slate-100 px-1.5 text-[10px] font-bold text-slate-500">+{selectedOwnerDetails.length - 3}</span> : null}
            </span>
          ) : (
            <span className="min-w-0 truncate text-slate-400">All owners</span>
          )}
          <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {active ? (
          <button type="button" onClick={() => pushSelection([])} className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear HRBP owner filter">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="absolute left-0 z-30 mt-2 w-80 max-w-[calc(100vw-3rem)] overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_12px_32px_rgba(9,30,66,0.18)]">
          <div className="border-b border-slate-100 p-2">
            <label className="flex h-9 items-center gap-2 rounded border border-slate-200 bg-slate-50 px-2 text-sm text-slate-500 focus-within:border-blue-400 focus-within:bg-white">
              <Search className="h-4 w-4 shrink-0" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" placeholder="Search owners" />
            </label>
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            <button type="button" onClick={() => pushSelection([])} className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${!active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <UserRound className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 font-semibold">All owners</span>
              {!active ? <Check className="h-4 w-4 text-blue-600" /> : null}
            </button>

            {filteredOwners.map((owner) => {
              const selected = selectedOwners.includes(owner.id);
              return (
                <button key={owner.id} type="button" onClick={() => toggleOwner(owner.id)} className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${selected ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}>
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700 ring-1 ring-blue-200">
                    {owner.initials || initialsFrom(ownerLabel(owner))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{ownerLabel(owner)}</span>
                    {owner.email ? <span className="block truncate text-xs font-medium text-slate-400">{owner.email}</span> : null}
                  </span>
                  {selected ? <Check className="h-4 w-4 shrink-0 text-blue-600" /> : null}
                </button>
              );
            })}

            {!filteredOwners.length ? <p className="px-3 py-6 text-center text-sm font-semibold text-slate-400">No owners found</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
