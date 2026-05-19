import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { bookedSlots, generateSlots, next7Days } from "@/lib/bankslot-data";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/slot")({
  component: SlotPage,
});

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function SlotPage() {
  const navigate = useNavigate();
  const { draft, set } = useBooking();
  const days = useMemo(next7Days, []);
  const slots = useMemo(generateSlots, []);
  const [date, setDate] = useState<string>(draft.date ?? fmtDate(days[0]));
  const [slot, setSlot] = useState<string | undefined>(draft.slot);

  useEffect(() => {
    if (!draft.bankId || !draft.branchId || !draft.serviceId) navigate({ to: "/" });
  }, [draft, navigate]);

  const booked = useMemo(
    () => bookedSlots(`${draft.branchId}-${date}`),
    [draft.branchId, date],
  );

  const confirm = () => {
    if (!slot) return;
    set({ date, slot });
    navigate({ to: "/details" });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <Link to="/service" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Pick a date & time</h1>
        <p className="text-sm text-muted-foreground">Available 9:00 AM – 4:00 PM, every 30 minutes.</p>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Date</div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {days.map((d) => {
            const key = fmtDate(d);
            const active = key === date;
            return (
              <button
                key={key}
                onClick={() => { setDate(key); setSlot(undefined); }}
                className={`shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-card-foreground border-border hover:border-primary/40"
                }`}
              >
                <span className="text-[10px] uppercase font-semibold tracking-wide opacity-80">
                  {d.toLocaleDateString("en-IN", { weekday: "short" })}
                </span>
                <span className="text-xl font-bold">{d.getDate()}</span>
                <span className="text-[10px] opacity-80">
                  {d.toLocaleDateString("en-IN", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Time</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((s) => {
            const isBooked = booked.has(s);
            const active = slot === s;
            return (
              <button
                key={s}
                disabled={isBooked}
                onClick={() => setSlot(s)}
                className={`h-11 rounded-lg text-sm font-medium border transition-all ${
                  isBooked
                    ? "bg-muted text-muted-foreground border-border cursor-not-allowed line-through"
                    : active
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-success/10 text-success-foreground border-success/30 hover:bg-success/20"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success/40 border border-success/50" /> Available</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-muted border border-border" /> Booked</span>
        </div>
      </div>

      <button
        disabled={!slot}
        onClick={confirm}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm"
      >
        Continue
      </button>
    </div>
  );
}
