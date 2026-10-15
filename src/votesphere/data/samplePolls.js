export const CATEGORIES = ["Technology", "Design", "Lifestyle", "Work", "Entertainment", "Sports"];

const DAY = 86400000;
const ago = (days) => new Date(Date.now() - days * DAY).toISOString();
const ahead = (days) => new Date(Date.now() + days * DAY).toISOString();

const opts = (pairs) => pairs.map(([text, votes], i) => ({ id: `o${i + 1}`, text, votes }));

export const samplePolls = [
  {
    id: "frontend-2026",
    question: "Which frontend framework will you use for your next project?",
    description: "Thinking about greenfield projects starting this year.",
    category: "Technology",
    creator: "Aisha Khan",
    createdAt: ago(2),
    closesAt: ahead(12),
    options: opts([["React", 184], ["Vue", 76], ["Svelte", 58], ["Angular", 31]]),
  },
  {
    id: "remote-work",
    question: "What is your ideal work setup?",
    description: "",
    category: "Work",
    creator: "Daniel Ortiz",
    createdAt: ago(5),
    closesAt: null,
    options: opts([["Fully remote", 142], ["Hybrid", 121], ["In the office", 27]]),
  },
  {
    id: "design-tool",
    question: "Favorite tool for UI design?",
    description: "Pick the one you open first every morning.",
    category: "Design",
    creator: "Mei Tanaka",
    createdAt: ago(1),
    closesAt: ahead(6),
    options: opts([["Figma", 63], ["Penpot", 12], ["Sketch", 9], ["Framer", 15]]),
  },
  {
    id: "morning-drink",
    question: "Coffee or tea to start the day?",
    description: "",
    category: "Lifestyle",
    creator: "Fatiha Ansari",
    createdAt: ago(9),
    closesAt: ago(1),
    options: opts([["Coffee", 98], ["Tea", 74], ["Neither", 18]]),
  },
  {
    id: "streaming-genre",
    question: "Which genre do you stream the most?",
    description: "",
    category: "Entertainment",
    creator: "Lucas Meyer",
    createdAt: ago(3),
    closesAt: ahead(20),
    options: opts([["Sci‑fi", 34], ["Comedy", 41], ["Documentary", 22], ["Thriller", 29]]),
  },
  {
    id: "world-cup",
    question: "Who wins the next football World Cup?",
    description: "Bragging rights only.",
    category: "Sports",
    creator: "Omar Haddad",
    createdAt: ago(0),
    closesAt: null,
    options: opts([["Brazil", 0], ["France", 0], ["Argentina", 0], ["Spain", 0]]),
  },
];
