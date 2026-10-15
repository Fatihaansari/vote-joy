import { describe, expect, it } from "vitest";
import { castVote, isClosed, percent, totalVotes, validatePoll } from "./votes";

const poll = { closesAt: null, options: [{ id: "a", votes: 3 }, { id: "b", votes: 1 }] };

describe("votes utils", () => {
  it("handles zero-vote polls", () => expect(percent(0, 0)).toBe(0));
  it("counts and casts votes", () => {
    expect(totalVotes(castVote(poll, "b"))).toBe(5);
  });
  it("closes polls past their date", () => {
    expect(isClosed({ closesAt: "2000-01-01" })).toBe(true);
  });
  it("requires two unique options", () => {
    expect(validatePoll({ question: "Hello?", options: ["A", "a"], category: "Work", closesAt: "" }).options).toBeTruthy();
  });
});
