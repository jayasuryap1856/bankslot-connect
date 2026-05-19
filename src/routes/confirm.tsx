import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Download, Share2, Calendar, MapPin, Building2, User } from "lucide-react";
import { useEffect } from "react";
import { banks, branches, services } from "@/lib/bankslot-data";
import { useBooking } from "@/lib/booking-store";
import { toast } from "sonner";

export const Route = createFileRoute("/confirm")({
  component: ConfirmPage,
});

function ConfirmPage() {
  const navigate = useNavigate();
  const { draft, reset } = useBooking();

  useEffect(() => {
    if (!draft.bookingId) navigate({ to: "/" });
  }, [draft.bookingId, navigate]);

  if (!draft.bookingId) return null;

  const bank = banks.find((b) => b.id === draft.bankId)!;
  const branch = branches.find((b) => b.id === draft.branchId)!;
  const service = services.find((s) => s.id === draft.serviceId)!;
  const dateLabel = new Date(draft.date!).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const summary = `BankSlot Booking ${draft.bookingId}
Bank: ${bank.name}
Branch: ${branch.name}, ${branch.address}
Service: ${service.name}
Date: ${dateLabel}
Time: ${draft.slot}
Name: ${draft.name}
Phone: +91 ${draft.phone}
Email: ${draft.email}${draft.note ? `\nNote: ${draft.note}` : ""}`;

  const download = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BankSlot-${draft.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Confirmation downloaded");
  };

  const share = async () => {
    const data = { title: "BankSlot Booking", text: summary };
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      await navigator.clipboard.writeText(summary);
      toast.success("Confirmation copied to clipboard");
    }
  };

  const bookAnother = () => {
    reset();
    navigate({ to: "/" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 rounded-full bg-success/15 text-success items-center justify-center mb-3">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="text-2xl font-bold">Booking confirmed!</h1>
        <p className="text-sm text-muted-foreground mt-1">We've reserved your slot. See you at the branch.</p>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-md">
        <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: bank.color, color: bank.fg }}>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-white/20 grid place-items-center font-bold">{bank.initials}</div>
            <span className="font-semibold">{bank.short}</span>
          </div>
          <span className="text-xs font-mono opacity-90">{draft.bookingId}</span>
        </div>
        <div className="p-5 space-y-4">
          <Row icon={Building2} label="Bank" value={bank.name} />
          <Row icon={MapPin} label="Branch" value={`${branch.name}`} sub={branch.address} />
          <Row icon={User} label="Service" value={service.name} />
          <Row icon={Calendar} label="Appointment" value={dateLabel} sub={`at ${draft.slot}`} />
          <div className="border-t border-border pt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Name</div>
              <div className="font-medium">{draft.name}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="font-medium">+91 {draft.phone}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-medium truncate">{draft.email}</div>
            </div>
            {draft.note && (
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground">Note</div>
                <div className="font-medium">{draft.note}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={download} className="h-11 rounded-xl bg-card border border-border font-medium text-sm inline-flex items-center justify-center gap-2 hover:bg-accent transition-colors">
          <Download className="h-4 w-4" /> Download
        </button>
        <button onClick={share} className="h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>

      <button onClick={bookAnother} className="w-full text-sm text-muted-foreground hover:text-foreground py-2">
        Book another appointment
      </button>
    </div>
  );
}

function Row({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string }) {
  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-lg bg-accent grid place-items-center shrink-0">
        <Icon className="h-4 w-4 text-accent-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold text-sm">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}
