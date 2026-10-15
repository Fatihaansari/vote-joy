import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const toast = useCallback(
    (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className="animate-fade-up flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm shadow-soft">
            {t.type === "error" ? (
              <AlertCircle className="h-5 w-5 shrink-0 text-destructive" aria-hidden />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden />
            )}
            <p className="flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
