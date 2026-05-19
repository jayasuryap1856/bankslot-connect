import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { MapPin, ChevronRight, ArrowLeft } from "lucide-react";
import { banks, branches } from "@/lib/bankslot-data";
import { useBooking } from "@/lib/booking-store";
import { useEffect } from "react";

export const Route = createFileRoute("/branch")({
  component: BranchPage,
});

function BranchPage() {
  const navigate = useNavigate();
  const { draft, set } = useBooking();
  const bank = banks.find((b) => b.id === draft.bankId);

  useEffect(() => {
    if (!draft.bankId) navigate({ to: "/" });
  }, [draft.bankId, navigate]);

  if (!bank) return null;

  const choose = (id: string) => {
    set({ branchId: id });
    navigate({ to: "/service" });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl grid place-items-center font-bold text-lg" style={{ backgroundColor: bank.color, color: bank.fg }}>
          {bank.initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{bank.name}</h1>
          <p className="text-sm text-muted-foreground">Choose a branch near you</p>
        </div>
      </div>

      <ul className="space-y-2">
        {branches.map((br) => (
          <li key={br.id}>
            <button
              onClick={() => choose(br.id)}
              className="w-full flex items-center gap-3 rounded-xl bg-card border border-border p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-accent grid place-items-center shrink-0">
                <MapPin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm">{br.name}</div>
                <div className="text-xs text-muted-foreground truncate">{br.address}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-medium text-foreground">{br.distance}</div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto mt-1" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
