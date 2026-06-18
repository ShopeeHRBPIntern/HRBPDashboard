"use client";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Home,
  RefreshCcw,
  Settings,
  UserPlus,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Overall Dashboard", key: "dashboard", icon: Home, count: "17" },
  { href: "/internal-transfer", label: "Internal Transfer", key: "internal-transfer", icon: BriefcaseBusiness, count: "12" },
  { href: "/conversion", label: "Conversion", key: "conversion", icon: RefreshCcw, count: "4" },
  { href: "/onboarding", label: "Onboarding", key: "onboarding", icon: UserPlus, count: "8" }
];

const ops = [
  { label: "Reports", icon: BarChart3 },
  { label: "Calendar", icon: CalendarDays },
  { label: "Settings", icon: Settings }
];

export function AppShell({
  active,
  title,
  subtitle,
  children,
  counts
}: {
  active: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  counts?: { dashboard?: number; "internal-transfer"?: number; conversion?: number; onboarding?: number };
}) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("appShell.collapsed");
      setCollapsed(saved === null ? false : saved === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("appShell.collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-soft text-ink">
      <aside className={`hidden lg:flex fixed inset-y-0 left-0 z-20 flex-col border-r border-line bg-white ${collapsed ? "w-16" : "w-64"} transition-all duration-200 ease-in-out` }>
        <div className="relative flex h-16 items-center gap-3 border-b border-line px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg overflow-visible">
            <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 object-cover" />
          </div>
          {!collapsed ? (
            <div>
              <p className="font-bold leading-tight">Smart HR Ops</p>
              <p className="text-xs text-slate-500">Automation Platform</p>
            </div>
          ) : null}
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((s) => !s)}
            className={`rounded p-1 text-slate-400 hover:bg-slate-50 transition-transform duration-200 ${collapsed ? "absolute right-2" : "ml-auto"}`}
          >
            {collapsed ? <ChevronRight className="h-4 w-4 transform transition-transform duration-200" /> : <ChevronLeft className="h-4 w-4 transform transition-transform duration-200" />}
          </button>
        </div>
        <div className="flex-1 overflow-visible px-3 py-5">
          {!collapsed ? <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Processes</p> : null}
          <nav className="mt-2 space-y-1">
            {[
              { href: "/", label: "Overall Dashboard", key: "dashboard", icon: Home, count: counts?.dashboard ?? "-" },
              { href: "/internal-transfer", label: "Internal Transfer", key: "internal-transfer", icon: BriefcaseBusiness, count: counts?.["internal-transfer"] ?? "-" },
              { href: "/conversion", label: "Conversion", key: "conversion", icon: RefreshCcw, count: counts?.conversion ?? "-" },
              { href: "/onboarding", label: "Onboarding", key: "onboarding", icon: UserPlus, count: counts?.onboarding ?? "-" }
            ].map((item) => {
              const Icon = item.icon as any;
              const selected = active === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${selected ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50"} transition-colors duration-150`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed ? (
                    <>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{item.count}</span>
                    </>
                  ) : null}
                  {collapsed ? (
                    <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100">
                      {item.label}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="my-6 border-t border-line" />
        </div>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden bg-blue-100 font-bold text-brand">HR</div>
            {!collapsed ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">HRBP</p>
                <p className="truncate text-xs text-slate-500">hrbp@shopee.com</p>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      <main className={`${collapsed ? "lg:pl-16" : "lg:pl-64"} transition-all duration-200 ease-in-out`}>
        <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-line bg-white/90 px-4 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-0">
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full bg-red-50 p-2 text-red-500" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">NA</div>
              <span className="text-sm font-bold">HRBP</span>
            </div>
          </div>
        </header>
        <section className="p-8">{children}</section>
      </main>
    </div>
  );
}

export function SmallProgress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <span key={index} className={`h-2 flex-1 rounded-full ${index < done ? "bg-brand" : "bg-slate-200"}`} />
      ))}
    </div>
  );
}

export function CheckPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 className="h-3 w-3" />
      {children}
    </span>
  );
}

export function EmptyPanel({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center text-sm text-slate-500">{children}</div>;
}
