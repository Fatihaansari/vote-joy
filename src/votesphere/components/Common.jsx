import { useEffect, useRef, useState } from "react";
import { SearchX } from "lucide-react";
import { btn, percent } from "../utils/votes";

export function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="font-display text-2xl font-bold">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = SearchX, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="mb-5 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-5" aria-hidden>
      <div className="mb-4 h-4 w-24 rounded bg-secondary" />
      <div className="mb-2 h-5 w-full rounded bg-secondary" />
      <div className="mb-6 h-5 w-2/3 rounded bg-secondary" />
      <div className="h-2 w-full rounded bg-secondary" />
    </div>
  );
}

export function ResultBars({ options, total, highlight }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const max = Math.max(...options.map((o) => o.votes), 0);

  return (
    <ul className="space-y-4">
      {options.map((o) => {
        const pct = percent(o.votes, total);
        const isTop = o.votes === max && max > 0;
        return (
          <li key={o.id}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className={`font-medium ${highlight === o.id ? "text-primary" : ""}`}>
                {o.text}
                {highlight === o.id && <span className="ml-2 text-xs font-semibold">(your vote)</span>}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                <strong className="text-foreground">{pct}%</strong> · {o.votes.toLocaleString()}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={o.text}>
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${isTop ? "bg-primary" : "bg-primary/45"}`}
                style={{ width: ready ? `${pct}%` : 0 }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ConfirmDialog({ open, title, text, confirmLabel = "Delete", onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="absolute inset-0 bg-overlay" onClick={onCancel} />
      <div className="animate-fade-up relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 id="confirm-title" className="mb-2 text-lg font-semibold">{title}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{text}</p>
        <div className="flex justify-end gap-2">
          <button ref={cancelRef} onClick={onCancel} className={btn.ghost}>Cancel</button>
          <button onClick={onConfirm} className={btn.danger}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
