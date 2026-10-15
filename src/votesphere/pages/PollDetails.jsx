import { useState } from "react";
import { ArrowLeft, CalendarClock, Check, FileQuestion, Link2, Lock, Trash2 } from "lucide-react";
import { StatusBadge } from "../components/PollCard";
import { ConfirmDialog, EmptyState, ResultBars } from "../components/Common";
import { useToast } from "../hooks/useToast";
import { btn, formatDate, isClosed, totalVotes } from "../utils/votes";

export default function PollDetails({ poll, loaded, votedOption, onVote, onDelete, navigate }) {
  const toast = useToast();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!loaded) return <div className="h-96 animate-pulse rounded-2xl bg-card" aria-label="Loading poll" />;
  if (!poll)
    return (
      <EmptyState
        icon={FileQuestion}
        title="Poll not found"
        text="It may have been deleted, or it was created in another browser."
        action={<button onClick={() => navigate("/")} className={btn.primary}>Back to dashboard</button>}
      />
    );

  const closed = isClosed(poll);
  const total = totalVotes(poll);
  const showResults = Boolean(votedOption) || closed;

  const submit = (e) => {
    e.preventDefault();
    if (!selected) return setError("Please select an option before voting.");
    if (onVote(poll.id, selected)) toast("Your vote was recorded. Thanks!");
    else toast("You have already voted on this poll.", "error");
  };

  const copyLink = async () => {
    try {
      if (!navigator.clipboard) throw new Error("unsupported");
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard.");
    } catch {
      toast("Couldn't copy automatically — copy the address bar URL instead.", "error");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate("/")} className="mb-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
      </button>

      <article className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">{poll.category}</span>
          <StatusBadge poll={poll} />
        </div>
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{poll.question}</h1>
        {poll.description && <p className="mb-3 text-muted-foreground">{poll.description}</p>}
        <p className="mb-8 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>by {poll.creator} · {formatDate(poll.createdAt)}</span>
          {poll.closesAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-4 w-4" aria-hidden /> {closed ? "Closed" : "Closes"} {formatDate(poll.closesAt)}
            </span>
          )}
        </p>

        {showResults ? (
          <div>
            <div className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${closed && !votedOption ? "bg-secondary" : "bg-success/12 text-success"}`}>
              {closed && !votedOption ? <Lock className="h-4 w-4" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
              {votedOption ? "You've already voted on this poll. Here are the current results." : "This poll is closed. Final results are shown below."}
            </div>
            {total === 0 ? (
              <p className="text-sm text-muted-foreground">No votes were cast on this poll.</p>
            ) : (
              <ResultBars options={poll.options} total={total} highlight={votedOption} />
            )}
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold">Choose one option</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {poll.options.map((o) => (
                  <label
                    key={o.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                      selected === o.id ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={o.id}
                      checked={selected === o.id}
                      onChange={() => { setSelected(o.id); setError(""); }}
                      className="sr-only"
                    />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected === o.id ? "border-primary bg-primary" : "border-border"}`}>
                      {selected === o.id && <Check className="h-3 w-3 text-primary-foreground" aria-hidden />}
                    </span>
                    <span className="font-medium">{o.text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
            <button type="submit" className={`${btn.primary} mt-6 w-full sm:w-auto`}>Submit vote</button>
          </form>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground"><strong className="text-foreground">{total.toLocaleString()}</strong> total votes</p>
          <div className="flex gap-2">
            <button onClick={copyLink} className={btn.ghost}><Link2 className="h-4 w-4" aria-hidden /> Copy link</button>
            <button onClick={() => setConfirmOpen(true)} className={`${btn.ghost} text-destructive`}><Trash2 className="h-4 w-4" aria-hidden /> Delete</button>
          </div>
        </div>
      </article>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Votes are saved in this browser only and are not shared with other people.
      </p>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this poll?"
        text="The poll and its votes will be removed from this browser. This can't be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { onDelete(poll.id); toast("Poll deleted."); navigate("/"); }}
      />
    </div>
  );
}
