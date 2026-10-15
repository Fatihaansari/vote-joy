import { ArrowRight, CalendarDays, CheckCircle2, Flame, Users } from "lucide-react";
import { formatDate, isClosed, isTrending, leadingOption, percent, totalVotes } from "../utils/votes";

export function StatusBadge({ poll }) {
  const closed = isClosed(poll);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        closed ? "bg-secondary text-muted-foreground" : "bg-success/15 text-success"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${closed ? "bg-muted-foreground" : "bg-success"}`} />
      {closed ? "Closed" : "Active"}
    </span>
  );
}

export default function PollCard({ poll, voted, navigate }) {
  const total = totalVotes(poll);
  const lead = leadingOption(poll);
  const leadPct = lead ? percent(lead.votes, total) : 0;

  return (
    <article className="animate-fade-up group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/50">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">{poll.category}</span>
        <StatusBadge poll={poll} />
        {isTrending(poll) && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
            <Flame className="h-3.5 w-3.5" aria-hidden /> Trending
          </span>
        )}
      </div>
      <h3 className="mb-2 text-base font-semibold leading-snug">{poll.question}</h3>
      <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>by {poll.creator}</span>
        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden />{formatDate(poll.createdAt)}</span>
      </p>

      <div className="mb-5 mt-auto">
        {total > 0 && lead ? (
          <>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="font-medium">Leading: {lead.text}</span>
              <span className="text-muted-foreground">{leadPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${leadPct}%` }} />
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No votes yet — be the first.</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" aria-hidden /> {total.toLocaleString()} votes
          {voted && <CheckCircle2 className="ml-1 h-4 w-4 text-success" aria-label="You voted" />}
        </span>
        <a
          href={`#/poll/${poll.id}`}
          onClick={(e) => { e.preventDefault(); navigate(`/poll/${poll.id}`); }}
          className="inline-flex items-center gap-1 rounded-md text-sm font-semibold text-primary"
          aria-label={`Open poll: ${poll.question}`}
        >
          {voted || isClosed(poll) ? "Results" : "Vote"}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </a>
      </div>
    </article>
  );
}
