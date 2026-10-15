import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoteBox — Create Polls & Vote" },
      { name: "description", content: "Create a poll, cast votes and watch live results." },
      { property: "og:title", content: "VoteBox — Create Polls & Vote" },
      { property: "og:description", content: "Create a poll, cast votes and watch live results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Option = { id: string; text: string; votes: number };
type Poll = { id: string; question: string; options: Option[]; voted?: string };

const uid = () => Math.random().toString(36).slice(2, 9);
const seed: Poll[] = [
  {
    id: "p1",
    question: "Best frontend framework?",
    options: [
      { id: "a", text: "React", votes: 12 },
      { id: "b", text: "Vue", votes: 7 },
      { id: "c", text: "Svelte", votes: 5 },
    ],
  },
];

function Index() {
  const [polls, setPolls] = useState<Poll[]>(seed);
  const [loaded, setLoaded] = useState(false);
  const [q, setQ] = useState("");
  const [opts, setOpts] = useState(["", ""]);

  useEffect(() => {
    const s = localStorage.getItem("votebox");
    if (s) setPolls(JSON.parse(s));
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem("votebox", JSON.stringify(polls));
  }, [polls, loaded]);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = opts.map((o) => o.trim()).filter(Boolean);
    if (!q.trim() || clean.length < 2) return;
    setPolls([{ id: uid(), question: q.trim(), options: clean.map((text) => ({ id: uid(), text, votes: 0 })) }, ...polls]);
    setQ("");
    setOpts(["", ""]);
  };

  const vote = (pid: string, oid: string) =>
    setPolls(polls.map((p) =>
      p.id !== pid || p.voted ? p : { ...p, voted: oid, options: p.options.map((o) => (o.id === oid ? { ...o, votes: o.votes + 1 } : o)) },
    ));

  const card = "rounded-xl border-2 border-border bg-card p-6 shadow-brutal";
  const input = "w-full rounded-lg border-2 border-border bg-background px-3 py-2 outline-none focus:bg-accent/30";
  const btn = "rounded-lg border-2 border-border px-4 py-2 font-semibold shadow-brutal transition active:translate-x-1 active:translate-y-1 active:shadow-none";

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="font-display text-6xl text-primary">VoteBox</h1>
        <p className="mt-2 text-muted-foreground">Ask anything. Count every voice.</p>
      </header>

      <form onSubmit={create} className={`${card} mb-10 space-y-3`}>
        <h2 className="font-display text-xl">New poll</h2>
        <input className={input} placeholder="Your question…" value={q} onChange={(e) => setQ(e.target.value)} />
        {opts.map((o, i) => (
          <div key={i} className="flex gap-2">
            <input className={input} placeholder={`Option ${i + 1}`} value={o}
              onChange={(e) => setOpts(opts.map((x, j) => (j === i ? e.target.value : x)))} />
            {opts.length > 2 && (
              <button type="button" className={`${btn} bg-muted`} onClick={() => setOpts(opts.filter((_, j) => j !== i))}>✕</button>
            )}
          </div>
        ))}
        <div className="flex gap-3">
          <button type="button" className={`${btn} bg-accent text-accent-foreground`} onClick={() => setOpts([...opts, ""])}>+ Option</button>
          <button type="submit" className={`${btn} bg-primary text-primary-foreground`}>Create poll</button>
        </div>
      </form>

      <div className="space-y-6">
        {polls.map((p) => {
          const total = p.options.reduce((s, o) => s + o.votes, 0);
          return (
            <section key={p.id} className={card}>
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl">{p.question}</h3>
                <button className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setPolls(polls.filter((x) => x.id !== p.id))}>Delete</button>
              </div>
              <div className="space-y-3">
                {p.options.map((o) => {
                  const pct = total ? Math.round((o.votes / total) * 100) : 0;
                  return (
                    <button key={o.id} disabled={!!p.voted} onClick={() => vote(p.id, o.id)}
                      className={`relative w-full overflow-hidden rounded-lg border-2 border-border bg-background px-4 py-3 text-left ${p.voted ? "" : "hover:bg-accent/40"}`}>
                      {p.voted && <span className="absolute inset-y-0 left-0 bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />}
                      <span className="relative flex justify-between font-semibold">
                        <span>{o.text} {p.voted === o.id && "✓"}</span>
                        {p.voted && <span>{pct}% · {o.votes}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{total} votes{!p.voted && " · tap an option to vote"}</p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
