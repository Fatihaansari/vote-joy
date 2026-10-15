import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { ConfirmDialog } from "./components/Common";
import Dashboard from "./pages/Dashboard";
import CreatePoll from "./pages/CreatePoll";
import PollDetails from "./pages/PollDetails";
import About from "./pages/About";
import { samplePolls } from "./data/samplePolls";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ToastProvider, useToast } from "./hooks/useToast";
import { castVote } from "./utils/votes";

/** Hash routing keeps deep links working on any static host without server config. */
function parseHash(hash) {
  const path = hash.replace(/^#/, "") || "/";
  const poll = path.match(/^\/poll\/([\w-]+)/);
  if (poll) return { name: "poll", id: poll[1] };
  if (path === "/create") return { name: "create" };
  if (path === "/about") return { name: "about" };
  return { name: "dashboard" };
}

function Shell() {
  const toast = useToast();
  const [route, setRoute] = useState({ name: "dashboard" });
  const [polls, setPolls, loaded] = useLocalStorage("votesphere:polls", samplePolls);
  const [voted, setVoted] = useLocalStorage("votesphere:voted", {});
  const [theme, setTheme] = useLocalStorage("votesphere:theme", "dark");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    const onHash = () => { setRoute(parseHash(window.location.hash)); window.scrollTo(0, 0); };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const navigate = useCallback((path) => {
    window.location.hash = path;
    setMenuOpen(false);
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    if (route.name !== "dashboard") navigate("/");
  };

  const vote = (pollId, optionId) => {
    if (voted[pollId]) return false;
    setPolls((ps) => ps.map((p) => (p.id === pollId ? castVote(p, optionId) : p)));
    setVoted((v) => ({ ...v, [pollId]: optionId }));
    return true;
  };

  const deletePoll = (id) => {
    setPolls((ps) => ps.filter((p) => p.id !== id));
    setVoted((v) => { const next = { ...v }; delete next[id]; return next; });
  };

  const resetDemo = () => {
    setPolls(samplePolls);
    setVoted({});
    setResetOpen(false);
    setMenuOpen(false);
    toast("Demo data restored.");
    navigate("/");
  };

  const poll = route.name === "poll" ? polls.find((p) => p.id === route.id) : null;

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <Sidebar route={route} navigate={navigate} onReset={() => setResetOpen(true)} mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Topbar
          search={search}
          onSearch={handleSearch}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          onMenu={() => setMenuOpen(true)}
          navigate={navigate}
        />
        <main id="main" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          {route.name === "dashboard" && (
            <Dashboard polls={polls} voted={voted} loaded={loaded} search={search} setSearch={setSearch} navigate={navigate} />
          )}
          {route.name === "create" && <CreatePoll onCreate={(p) => setPolls((ps) => [p, ...ps])} navigate={navigate} />}
          {route.name === "poll" && (
            <PollDetails key={route.id} poll={poll} loaded={loaded} votedOption={voted[route.id]} onVote={vote} onDelete={deletePoll} navigate={navigate} />
          )}
          {route.name === "about" && <About />}
        </main>
      </div>
      <ConfirmDialog
        open={resetOpen}
        title="Reset demo data?"
        text="This replaces all polls and votes in this browser with the original sample polls."
        confirmLabel="Reset"
        onCancel={() => setResetOpen(false)}
        onConfirm={resetDemo}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Shell />
    </ToastProvider>
  );
}
