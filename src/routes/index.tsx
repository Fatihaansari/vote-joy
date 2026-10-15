import { createFileRoute } from "@tanstack/react-router";
import App from "@/votesphere/App.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoteSphere — Create Polls & See Results" },
      { name: "description", content: "Create polls, vote once per poll and explore animated results in a modern dashboard." },
      { property: "og:title", content: "VoteSphere — Create Polls & See Results" },
      { property: "og:description", content: "Create polls, vote once per poll and explore animated results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});
