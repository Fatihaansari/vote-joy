import { useMemo, useState } from "react";
import { BarChart3, CircleDot, Flame, Inbox, ListChecks, Plus } from "lucide-react";
import PollCard from "../components/PollCard";
import { EmptyState, SkeletonCard, StatCard } from "../components/Common";
import { CATEGORIES } from "../data/samplePolls";
import { btn, isClosed, isTrending, totalVotes } from "../utils/votes";

const FILTERS = ["All", "Active", "Trending", "Closed"];
const selectClass =
  "rounded-lg border border-input bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

export default function Dashboard({ polls, voted, loaded, search, setSearch, navigate }) {
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const stats = useMemo(
    () => ({
      total: polls.length,
      votes: polls.reduce((s, p) => s + totalVotes(p), 0),
      active: polls.filter((p) => !isClosed(p)).length,
      trending: polls.filter(isTrending).length,
    }),
    [polls],
  );

  const trending = useMemo(
    () => polls.filter(isTrending).sort((a, b) => totalVotes(b) - totalVotes(a)).slice(0, 3),
    [polls],
  );
  const recent = useMemo(
    () => [...polls].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [polls],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return polls
      .filter((p) => !q || p.question.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .filter((p) => category === "All" || p.category === category)
      .filter((p) =>
        filter === "Active" ? !isClosed(p) : filter === "Closed" ? isClosed(p) : filter === "Trending" ? isTrending(p) : true,
      )
      .sort((a, b) =>
        sort === "votes" ? totalVotes(b) - totalVotes(a) : new Date(b.createdAt) - new Date(a.createdAt),
      );
  }, [polls, search, category, filter, sort]);

  const clearFilters = () => { setFilter("All"); setCategory("All"); setSearch(""); };

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-border bg-hero p-6 sm:p-8">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Welcome back to VoteSphere</h1>
        <p className="max-w-xl text-muted-foreground">
          Ask questions, gather opinions and watch the results take shape. Create a poll in seconds and share it with your team.
        </p>
      </section>

      <section aria-label="Statistics" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ListChecks} label="Total polls" value={stats.total} />
        <StatCard icon={BarChart3} label="Total votes" value={stats.votes} />
        <StatCard icon={CircleDot} label="Active polls" value={stats.active} />
        <StatCard icon={Flame} label="Trending polls" value={stats.trending} />
      </section>

      {loaded && !search && polls.length > 0 && (
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Flame className="h-5 w-5 text-warning" aria-hidden /> Trending now
            </h2>
            {trending.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {trending.slice(0, 2).map((p) => <PollCard key={p.id} poll={p} voted={voted[p.id]} navigate={navigate} />)}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No trending polls yet. Polls with 100+ votes appear here.</p>
            )}
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Recently created</h2>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-soft">
              {recent.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#/poll/${p.id}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/poll/${p.id}`); }}
                    className="block rounded-2xl px-4 py-3 transition hover:bg-secondary"
                  >
                    <p className="line-clamp-1 text-sm font-medium">{p.question}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {totalVotes(p)} votes</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-semibold">{search ? `Results for “${search}”` : "Browse polls"}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div role="tablist" aria-label="Filter polls" className="flex rounded-lg border border-border bg-card p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <label>
              <span className="sr-only">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                <option value="All">All categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                <option value="newest">Newest</option>
                <option value="votes">Most votes</option>
              </select>
            </label>
          </div>
        </div>

        {!loaded ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : polls.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No polls yet"
            text="Create your first poll to start collecting votes."
            action={<button onClick={() => navigate("/create")} className={btn.primary}><Plus className="h-4 w-4" /> Create poll</button>}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No polls match"
            text="Try a different search term, category or filter."
            action={<button onClick={clearFilters} className={btn.ghost}>Clear filters</button>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => <PollCard key={p.id} poll={p} voted={voted[p.id]} navigate={navigate} />)}
          </div>
        )}
      </section>
    </div>
  );
}
