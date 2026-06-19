// lib/news.ts
export interface NewsItem {
  id: string;
  type: "rust" | "site";
  date: string; // e.g. "Jun 18, 2026"
  title: string;
  body: string;
}

export const news: NewsItem[] = [
  {
    id: "costs-verified",
    type: "site",
    date: "Jun 18, 2026",
    title: "Raid Calculator costs verified",
    body: "Every explosive's crafting cost has been checked against current data.",
  },
  {
    id: "assistant-memory",
    type: "site",
    date: "Jun 17, 2026",
    title: "Assistant now remembers your conversation",
    body: "Ask follow-ups and it keeps the thread, with free-text goals and tailored advice.",
  },
  {
    id: "wipe",
    type: "rust",
    date: "Jun 5, 2026",
    title: "Monthly force wipe is live",
    body: "Force wipe lands the first Thursday of each month. Replace this with real patch highlights.",
  },
];