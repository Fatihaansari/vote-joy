import { Github, ShieldAlert, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-border bg-hero p-6 sm:p-8">
        <Sparkles className="mb-4 h-8 w-8 text-primary" aria-hidden />
        <h1 className="mb-3 text-2xl font-bold">About VoteSphere</h1>
        <p className="text-muted-foreground">
          VoteSphere is a lightweight polling app built with React and Tailwind CSS. Create polls, vote once per poll and
          explore results with clear, animated breakdowns. It runs entirely in your browser — no account or API key needed.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <ShieldAlert className="h-5 w-5 text-warning" aria-hidden /> Privacy & demo notice
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>All polls, votes, your theme and the list of polls you voted on are stored in this browser's localStorage.</li>
          <li>Nothing is sent to a server. Results are not real-time and are not shared between users or devices.</li>
          <li>This is a frontend demo: localStorage can be edited or cleared, so it is not secure against vote manipulation.</li>
          <li>Clearing your browser data or using “Reset demo data” removes everything.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-soft sm:p-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Github className="h-5 w-5" aria-hidden /> Built with
        </h2>
        React · Vite · Tailwind CSS · Lucide icons
      </section>
    </div>
  );
}
