/** Voting & poll helpers — pure functions, easy to test. */

export const totalVotes = (poll) => poll.options.reduce((sum, o) => sum + (o.votes || 0), 0);

export const percent = (votes, total) => (total > 0 ? Math.round((votes / total) * 100) : 0);

export const isClosed = (poll, now = Date.now()) =>
  Boolean(poll.closesAt) && new Date(poll.closesAt).getTime() <= now;

export const TRENDING_THRESHOLD = 100;
export const isTrending = (poll) => !isClosed(poll) && totalVotes(poll) >= TRENDING_THRESHOLD;

export const leadingOption = (poll) =>
  poll.options.reduce((best, o) => (!best || o.votes > best.votes ? o : best), null);

export const castVote = (poll, optionId) => ({
  ...poll,
  options: poll.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
});

export const createId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function validatePoll({ question, options, category, closesAt }) {
  const errors = {};
  if (question.trim().length < 5) errors.question = "Question must be at least 5 characters.";
  const filled = options.map((o) => o.trim()).filter(Boolean);
  if (filled.length < 2) errors.options = "Add at least two answer options.";
  else if (new Set(filled.map((o) => o.toLowerCase())).size !== filled.length)
    errors.options = "Each option must be unique.";
  if (!category) errors.category = "Choose a category.";
  if (closesAt && new Date(closesAt).getTime() <= Date.now())
    errors.closesAt = "Closing date must be in the future.";
  return errors;
}

export const inputClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-primary transition";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition hover:brightness-110",
  icon: "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card transition hover:bg-secondary",
};
