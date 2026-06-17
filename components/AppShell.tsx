import {
  ArrowRight,
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
  children
}: {
  active: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-soft text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-line bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-line px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">S</div>
          <div>
            <p className="font-bold leading-tight">Smart HR Ops</p>
            <p className="text-xs text-slate-500">Automation Platform</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Processes</p>
          <nav className="mt-2 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const selected = active === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${
                    selected ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{item.count}</span>
                </Link>
              );
            })}
          </nav>

          <div className="my-6 border-t border-line" />
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Operations</p>
          <div className="mt-2 space-y-1">
            {ops.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-line p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-brand">HR</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">HRBP</p>
              <p className="truncate text-xs text-slate-500">hrbp@company.com</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </aside>

      <main className="pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-line bg-white/90 px-8 backdrop-blur">
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
