import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/lib/booking-store";

export const Route = createFileRoute("/details")({
  component: DetailsPage,
});

function genId() {
  return "BKS-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function DetailsPage() {
  const navigate = useNavigate();
  const { draft, set } = useBooking();
  const [name, setName] = useState(draft.name ?? "");
  const [phone, setPhone] = useState(draft.phone ?? "");
  const [email, setEmail] = useState(draft.email ?? "");
  const [note, setNote] = useState(draft.note ?? "");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!draft.slot) navigate({ to: "/" });
  }, [draft.slot, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{10}$/.test(phone) || !/^\S+@\S+\.\S+$/.test(email)) {
      setErr("Please enter a valid name, 10-digit phone, and email.");
      return;
    }
    set({ name, phone, email, note, bookingId: genId() });
    navigate({ to: "/confirm" });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <Link to="/slot" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div>
        <h1 className="text-2xl font-bold">Your details</h1>
        <p className="text-sm text-muted-foreground">We'll send your booking confirmation here.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} required className="input" placeholder="Priya Sharma" />
        </Field>
        <Field label="Phone number">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-sm text-muted-foreground">+91</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required inputMode="numeric" className="input rounded-l-none" placeholder="98XXXXXXXX" />
          </div>
        </Field>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="you@example.com" />
        </Field>
        <Field label="Note (optional)">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="input resize-none" placeholder="Anything we should know?" />
        </Field>

        {err && <p className="text-sm text-destructive">{err}</p>}

        <button type="submit" className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          Confirm booking
        </button>
      </form>

      <style>{`
        .input {
          width: 100%;
          height: 2.75rem;
          padding: 0 0.875rem;
          border-radius: 0.625rem;
          border: 1px solid var(--color-input);
          background: var(--color-card);
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input:focus { box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-ring) 25%, transparent); border-color: var(--color-ring); }
        textarea.input { height: auto; padding: 0.625rem 0.875rem; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
