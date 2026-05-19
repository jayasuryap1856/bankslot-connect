import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Wallet, HandCoins, FileCheck, KeyRound, CreditCard, Building2, ChevronRight } from "lucide-react";
import { services } from "@/lib/bankslot-data";
import { useBooking } from "@/lib/booking-store";
import { useEffect } from "react";

export const Route = createFileRoute("/service")({
  component: ServicePage,
});

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  account: Wallet,
  loan: HandCoins,
  kyc: FileCheck,
  locker: KeyRound,
  card: CreditCard,
  general: Building2,
};

function ServicePage() {
  const navigate = useNavigate();
  const { draft, set } = useBooking();

  useEffect(() => {
    if (!draft.bankId || !draft.branchId) navigate({ to: "/" });
  }, [draft, navigate]);

  const choose = (id: string) => {
    set({ serviceId: id });
    navigate({ to: "/slot" });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <Link to="/branch" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div>
        <h1 className="text-2xl font-bold">What do you need help with?</h1>
        <p className="text-sm text-muted-foreground">Pick the service you'd like to book.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => {
          const Icon = icons[s.id];
          return (
            <button
              key={s.id}
              onClick={() => choose(s.id)}
              className="group flex items-center gap-3 rounded-xl bg-card border border-border p-4 text-left hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
