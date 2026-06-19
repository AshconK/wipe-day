// app/faq/page.tsx
import Hero from "../Hero";

const faqs = [
  {
    q: "Are the costs accurate?",
    a: "Build and raid costs come from a verified data table, not the AI, so the numbers stay exact. We re-check them against current Rust data and show a verified date on the Raid Calculator.",
  },
  {
    q: "Does the assistant know the latest patch?",
    a: "It tailors advice to your group and goal, and can check current patch info for things outside its core data. For exact costs it always uses the verified table.",
  },
  {
    q: "Is this affiliated with Facepunch?",
    a: "No. This is a fan-made tool and is not affiliated with or endorsed by Facepunch Studios. Rust is a trademark of Facepunch Studios.",
  },
  {
    q: "Do I need an account?",
    a: "Not for the free tools. Accounts and Pro plans are coming soon for higher limits and extra features.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Hero title="FAQ" subtitle="Common questions about the tools and the data behind them." image="/scenes/faq.gif" />
      {faqs.map((f, i) => (
        <div key={i} className="faq-item">
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </main>
  );
}