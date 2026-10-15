import { useState } from "react";
import { Plus, X } from "lucide-react";
import { CATEGORIES } from "../data/samplePolls";
import { useToast } from "../hooks/useToast";
import { btn, createId, inputClass, validatePoll } from "../utils/votes";

const MAX_OPTIONS = 8;

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label} {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function CreatePoll({ onCreate, navigate }) {
  const toast = useToast();
  const [form, setForm] = useState({ question: "", description: "", category: "", closesAt: "", creator: "", options: ["", ""] });
  const [errors, setErrors] = useState({});

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setOption = (i, v) => update("options", form.options.map((o, j) => (j === i ? v : o)));

  const submit = (e) => {
    e.preventDefault();
    const found = validatePoll(form);
    setErrors(found);
    if (Object.keys(found).length) return toast("Please fix the highlighted fields.", "error");

    const poll = {
      id: createId(),
      question: form.question.trim(),
      description: form.description.trim(),
      category: form.category,
      creator: form.creator.trim() || "You",
      createdAt: new Date().toISOString(),
      closesAt: form.closesAt ? new Date(form.closesAt).toISOString() : null,
      options: form.options.map((t) => t.trim()).filter(Boolean).map((text, i) => ({ id: `o${i + 1}`, text, votes: 0 })),
    };
    onCreate(poll);
    toast("Poll created!");
    navigate(`/poll/${poll.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold">Create a poll</h1>
      <p className="mb-8 text-muted-foreground">Ask a clear question and give people at least two choices.</p>

      <form onSubmit={submit} noValidate className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <Field id="question" label="Question" error={errors.question}>
          <input id="question" className={inputClass} value={form.question} maxLength={140}
            aria-invalid={!!errors.question} aria-describedby={errors.question ? "question-error" : undefined}
            onChange={(e) => update("question", e.target.value)} placeholder="e.g. Where should we go for the team offsite?" />
        </Field>

        <Field id="description" label="Description" hint="(optional)">
          <textarea id="description" rows={3} className={inputClass} value={form.description} maxLength={300}
            onChange={(e) => update("description", e.target.value)} placeholder="Add context for voters" />
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold">Answer options</legend>
          <div className="space-y-2">
            {form.options.map((o, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputClass} value={o} maxLength={80} aria-label={`Option ${i + 1}`}
                  onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${i + 1}`} />
                {form.options.length > 2 && (
                  <button type="button" className={btn.icon} aria-label={`Remove option ${i + 1}`}
                    onClick={() => update("options", form.options.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {errors.options && <p role="alert" className="mt-1.5 text-sm text-destructive">{errors.options}</p>}
          {form.options.length < MAX_OPTIONS && (
            <button type="button" onClick={() => update("options", [...form.options, ""])}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline">
              <Plus className="h-4 w-4" aria-hidden /> Add option
            </button>
          )}
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="category" label="Category" error={errors.category}>
            <select id="category" className={inputClass} value={form.category} aria-invalid={!!errors.category}
              onChange={(e) => update("category", e.target.value)}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field id="closesAt" label="Closing date" hint="(optional)" error={errors.closesAt}>
            <input id="closesAt" type="datetime-local" className={inputClass} value={form.closesAt}
              aria-invalid={!!errors.closesAt} onChange={(e) => update("closesAt", e.target.value)} />
          </Field>
        </div>

        <Field id="creator" label="Your name" hint="(optional)">
          <input id="creator" className={inputClass} value={form.creator} maxLength={40}
            onChange={(e) => update("creator", e.target.value)} placeholder="Shown on the poll card" />
        </Field>

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate("/")} className={btn.ghost}>Cancel</button>
          <button type="submit" className={btn.primary}>Create poll</button>
        </div>
      </form>
    </div>
  );
}
