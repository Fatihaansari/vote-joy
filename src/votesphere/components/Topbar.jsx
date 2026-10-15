import { Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { btn } from "../utils/votes";

export default function Topbar({ search, onSearch, theme, onToggleTheme, onMenu, navigate }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
      <button onClick={onMenu} className={`${btn.icon} lg:hidden`} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </button>
      <label className="relative flex-1 max-w-md">
        <span className="sr-only">Search polls</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search polls or categories…"
          className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
        />
      </label>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className={btn.icon}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button onClick={() => navigate("/create")} className={`${btn.primary} hidden sm:inline-flex`}>
          <Plus className="h-4 w-4" aria-hidden /> New poll
        </button>
      </div>
    </header>
  );
}
