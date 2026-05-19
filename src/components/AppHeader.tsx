import { Link, useLocation } from "@tanstack/react-router";
import { Check } from "lucide-react";

const steps = [
  { path: "/", label: "Bank" },
  { path: "/branch", label: "Branch" },
  { path: "/service", label: "Service" },
  { path: "/slot", label: "Slot" },
  { path: "/details", label: "Details" },
  { path: "/confirm", label: "Confirm" },
];

export function Stepper() {
  const { pathname } = useLocation();
  const currentIdx = Math.max(
    0,
    steps.findIndex((s) => s.path === pathname),
  );

  return (
    <div className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={s.path} className="flex items-center gap-1 sm:gap-2 shrink-0">
              <div
                className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold transition-colors ${
                  done
                    ? "bg-success text-success-foreground"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="w-4 sm:w-8 h-px bg-border mx-0.5 sm:mx-1" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground font-bold shadow-sm">
            B
          </div>
          <span className="font-display font-bold text-lg tracking-tight">BankSlot</span>
        </Link>
        <span className="text-xs text-muted-foreground">Bengaluru</span>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-3">
        <Stepper />
      </div>
    </header>
  );
}
