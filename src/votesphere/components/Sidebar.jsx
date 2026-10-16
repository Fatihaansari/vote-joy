import { Info, LayoutDashboard, PlusCircle, RotateCcw, Vote, X } from "lucide-react";

const NAV = [
  { name: "dashboard", path: "/", label: "Dashboard", icon: LayoutDashboard },
  { name: "create", path: "/create", label: "Create poll", icon: PlusCircle },
  { name: "about", path: "/about", label: "About & privacy", icon: Info },
];

function NavContent({ route, navigate, onReset, onClose }) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-8 flex items-center justify-between">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Vote className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold">VoteSphere</span>
        </a>
        {onClose && (
          <button onClick={onClose} aria-label="Close menu" className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav aria-label="Main" className="flex flex-col gap-1">
        {NAV.map(({ name, path, label, icon: Icon }) => {
          const active = route.name === name;
          return (
            <a
              key={name}
              href={`#${path}`}
              onClick={(e) => { e.preventDefault(); navigate(path); }}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden />
              {label}
            </a>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-border bg-hero p-4 text-xs text-muted-foreground">
        <p className="mb-3">Frontend demo — votes are stored only in this browser.</p>
        <button onClick={onReset} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset demo data
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Designed &amp; developed by <span className="font-semibold text-foreground">Fatiha Ansari</span>
      </p>
    </div>
  );
}

export default function Sidebar({ route, navigate, onReset, mobileOpen, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-sidebar lg:block">
        <NavContent route={route} navigate={navigate} onReset={onReset} />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-overlay" onClick={onClose} />
          <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 border-r border-border bg-sidebar">
            <NavContent route={route} navigate={navigate} onReset={onReset} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
