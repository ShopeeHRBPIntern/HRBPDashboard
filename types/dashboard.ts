export type ProcessCode = "internal_transfer" | "conversion" | "onboarding";

export type Health = "healthy" | "attention" | "blocked";

export type ProcessSummary = {
  process: ProcessCode;
  label: string;
  openCount: number;
  overdueCount: number;
  completedThisMonth: number;
  errorCount: number;
  health: Health;
};

export type CaseSummary = {
  caseId: string;
  uniqueJobId?: string;
  process: ProcessCode;
  candidateName: string;
  candidateEmail?: string;
  employeeId?: string;
  currentDepartment?: string;
  targetDepartment?: string;
  currentEntity?: string;
  targetEntity?: string;
  roleTitle?: string;
  status: string;
  statusLabel: string;
  pendingActor: string;
  nextAction: string;
  submittedAt?: string;
  updatedAt?: string;
  dueDate?: string;
  isOverdue: boolean;
  lastError?: string;
  message?: string;
  channelCode?: string;
  hrbpCase?: string;
};

export type TimelineEvent = {
  id: string;
  caseId: string;
  process: ProcessCode;
  title: string;
  actor: string;
  status: "done" | "pending" | "error";
  occurredAt?: string;
  detail?: string;
};

export type InternalTransferDetail = CaseSummary & {
  serviceMonths?: string;
  grade?: string;
  manager?: string;
  hiringManager?: string;
  currentRank?: string;
  targetRole?: string;
  transferType?: string;
  progress: TimelineEvent[];
  latestActivity: TimelineEvent[];
};

export type OnboardingJoinerSummary = {
  rowInFte?: string;
  stepTracker: string;
  previousStepTracker?: string;
  nextStepTracker?: string;
  onboardingCompleted: boolean;
  dbKey: string;
  fullName: string;
  nickname?: string;
  companyEmail?: string;
  personalEmail?: string;
  mobile?: string;
  buddyEmail?: string;
  hrbpName?: string;
  hrbpEmail?: string;
  onboardingSession?: string;
  department?: string;
  legalEntity?: string;
  team?: string;
  rank?: string;
  speJobTitle?: string;
  dateOfJoin?: string;
  endOfProbation?: string;
  speReportingManager?: string;
  speReportingManagerEmail?: string;
  location?: string;
  recruiter?: string;
  ageDays?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DashboardSummaryResponse = {
  processes: ProcessSummary[];
  metrics: {
    openCases: number;
    overdueTasks: number;
    pendingHRBP: number;
    pendingExternal: number;
    errors: number;
  };
  recentActivity: TimelineEvent[];
  generatedAt: string;
  source?: "google_sheets" | "mock";
};
