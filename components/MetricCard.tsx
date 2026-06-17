import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "blue"
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "blue" | "cyan" | "orange" | "green" | "purple" | "red";
}) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700",
    cyan: "bg-cyan-50 text-cyan-700",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-600"
  }[tone];

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className={`mt-1 text-3xl font-bold leading-none ${toneClass.split(" ")[1]}`}>{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneClass}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>
    </div>
  );
}
