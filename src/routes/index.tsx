import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { banks } from "@/lib/bankslot-data";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const setDraft = useBooking((s) => s.set);
  const reset = useBooking((s) => s.reset);

  const filtered = useMemo(
    () => banks.filter((b) => b.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  const choose = (id: string) => {
    reset();
    setDraft({ bankId: id });
    navigate({ to: "/branch" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Skip the queue.
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Book your bank visit in seconds.
          </span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Pick your bank to book an appointment at a branch near you in Bengaluru.
        </p>
      </section>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for your bank…"
          className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((b) => (
          <button
            key={b.id}
            onClick={() => choose(b.id)}
            className="group relative overflow-hidden rounded-2xl bg-card border border-border p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: b.color }}
            />
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-xl grid place-items-center font-bold text-lg shadow-sm shrink-0"
                style={{ backgroundColor: b.color, color: b.fg }}
              >
                {b.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm leading-tight truncate">{b.short}</div>
                <div className="text-xs text-muted-foreground truncate">{b.name}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">No banks match "{q}".</p>
      )}
    </div>
  );
}
