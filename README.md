# Wipe Day

A web app for the game **Rust** that helps players plan bases, expansions, electricity, and raids — with costs they can actually trust.

🔗 **Live demo:** https://wipe-day.vercel.app

## What it does

- **AI Assistant** — tailored base, expansion, and electricity advice based on your group size, server type, and goal, powered by the Anthropic API.
- **Base Designs** — step-by-step video build guides, organized by group-size tier.
- **Raid Calculator** — a deterministic tool that totals the explosives and raw resources needed for any raid.

## Why it's built this way

Game costs and raid math are facts, not opinions — so the app keeps them in a **verified data layer** and does the calculations in code, while the **AI handles open-ended advice**. This split keeps the numbers accurate instead of relying on the model to remember them, which it can't do reliably.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + custom theming
- **Anthropic API** (with web search) for the assistant
- React components for the interactive tools (step-through player, raid calculator, blueprint renderer)

## Running locally

```bash
npm install
```

Create a `.env.local` file in the root with your Anthropic API key:

```
ANTHROPIC_API_KEY=your_key_here
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).