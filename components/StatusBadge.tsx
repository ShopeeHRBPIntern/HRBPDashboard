const toneMap: Record<string, string> = {
  "HR Screening": "bg-cyan-50 text-cyan-700",
  "HRBP Criteria": "bg-cyan-50 text-cyan-700",
  "Salary Check": "bg-orange-50 text-orange-600",
  "Manager Result": "bg-indigo-50 text-indigo-700",
  "Manager Approval": "bg-indigo-50 text-indigo-700",
  Interviewing: "bg-blue-50 text-blue-700",
  "Effective Date": "bg-amber-50 text-amber-700",
  Decision: "bg-purple-50 text-purple-700",
  "HOD Approval": "bg-red-50 text-red-600",
  "HOC Approval": "bg-purple-50 text-purple-700",
  "Ready for Sheet Update": "bg-emerald-50 text-emerald-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Pass: "bg-emerald-50 text-emerald-700",
  Pending: "bg-blue-50 text-blue-700",
  Rejected: "bg-red-50 text-red-600",
  Failed: "bg-red-50 text-red-600"
};

const labelMap: Record<string, string> = {
  HR_SCREENING: "HR Screening",
  HR_SCREENING_PENDING: "HR Screening",
  HRBP_CRITERIA_PENDING: "HRBP Criteria",
  SALARY_CHECK_PENDING: "Salary Check",
  CURRENT_MANAGER_PENDING: "Manager Result",
  CURRENT_MANAGER_APPROVAL_PENDING: "Manager Approval",
  EFFECTIVE_DATE_PENDING: "Effective Date",
  INTERVIEWING: "Interviewing",
  DECISION: "Decision",
  HOD_APPROVAL_PENDING: "HOD Approval",
  CONVERSION_WAITING_HOC_APPROVAL: "HOC Approval",
  CONVERSION_READY_FOR_SHEET_UPDATE: "Ready for Sheet Update",
  APPROVED: "Approved",
  PASS: "Pass",
  PENDING: "Pending",
  REJECT: "Rejected",
  REJECTED: "Rejected",
  FAIL: "Failed",
  FAILED: "Failed"
};

function normalizeLabel(label: string) {
  const key = label.trim().toUpperCase();
  return labelMap[key] ?? label.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function StatusBadge({ label }: { label: string }) {
  const normalized = normalizeLabel(label);
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${toneMap[normalized] ?? "bg-slate-100 text-slate-700"}`}>
      {normalized}
    </span>
  );
}
