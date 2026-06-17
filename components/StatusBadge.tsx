const toneMap: Record<string, string> = {
  "HR Screening": "bg-cyan-50 text-cyan-700",
  "Salary Check": "bg-orange-50 text-orange-600",
  Interviewing: "bg-blue-50 text-blue-700",
  Decision: "bg-purple-50 text-purple-700",
  "HOD Approval": "bg-red-50 text-red-600",
  "HOC Approval": "bg-purple-50 text-purple-700",
  "Ready for Sheet Update": "bg-emerald-50 text-emerald-700",
  Completed: "bg-emerald-50 text-emerald-700"
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${toneMap[label] ?? "bg-slate-100 text-slate-700"}`}>
      {label}
    </span>
  );
}
