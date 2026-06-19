import { AlertTriangle, Check, Clock3 } from "lucide-react";
import type { TimelineEvent } from "@/types/dashboard";

export function ProgressStepper({ events }: { events: TimelineEvent[] }) {
  const lastDoneIndex = events.reduce((latest, event, index) => (event.status === "done" ? index : latest), -1);

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-950">Current Status & Progress</h2>
        <span className="text-xs font-semibold text-slate-500">{events.length} steps</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event, index) => {
          const handledError = event.status === "error" && index < lastDoneIndex;
          const done = event.status === "done" || handledError;
          const error = event.status === "error" && !handledError;
          const pending = event.status === "pending";
          return (
            <div key={event.id} className={`rounded-lg border p-3 ${done ? "border-blue-100 bg-blue-50/60" : error ? "border-red-100 bg-red-50/70" : "border-line bg-white"}`}>
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-brand text-white" : error ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : error ? <AlertTriangle className="h-4 w-4" /> : pending ? <Clock3 className="h-4 w-4" /> : index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-950">{event.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {handledError ? "Handled and continued" : done ? "Done" : error ? "Needs review" : "Pending"} {event.actor ? `by ${event.actor}` : ""}
                  </p>
                  {event.occurredAt ? <p className="mt-1 text-[11px] leading-tight text-slate-500">{event.occurredAt}</p> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
