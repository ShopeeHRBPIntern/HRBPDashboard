import { Check } from "lucide-react";
import type { TimelineEvent } from "@/types/dashboard";

export function ProgressStepper({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <h2 className="font-bold">Current Status & Progress</h2>
      <div className="mt-7 grid grid-cols-7 gap-2">
        {events.map((event, index) => {
          const done = event.status === "done";
          const pending = event.status === "pending";
          return (
            <div key={event.id} className="relative text-center">
              {index > 0 ? <div className="absolute right-1/2 top-4 h-px w-full bg-blue-200" /> : null}
              <div
                className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  done ? "border-brand bg-brand text-white" : pending ? "border-brand bg-white text-brand" : "border-slate-300 bg-white text-slate-500"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <p className="mt-3 text-xs font-bold">{event.title}</p>
              {event.occurredAt ? <p className="mt-1 text-[11px] leading-tight text-slate-500">{event.occurredAt}</p> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
