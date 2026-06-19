// app/pricing/page.tsx
import Hero from "../Hero";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    featured: false,
    cta: "Current plan",
    features: ["Raid calculator", "Limited AI questions per day", "Base blueprints", "Community data"],
  },
  {
    name: "Pro",
    price: "$5",
    period: "/ month",
    featured: true,
    cta: "Coming soon",
    features: ["Everything in Free", "Unlimited AI questions", "Saved bases & loadouts", "Priority answers", "No ads"],
  },
  {
    name: "Clan",
    price: "$15",
    period: "/ month",
    featured: false,
    cta: "Coming soon",
    features: ["Everything in Pro", "Up to 10 members", "Shared raid plans", "Team base library"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Hero title="Pricing" subtitle="Simple plans. Subscriptions aren't live yet — this is a preview of what's coming." image="/scenes/pricing.jpg" />
      <div className="price-grid">
        {plans.map((p) => (
          <div key={p.name} className={"price-card" + (p.featured ? " featured" : "")}>
            <div className="price-name">{p.name}</div>
            <div className="price-amount">
              {p.price} <span>{p.period}</span>
            </div>
            <ul className="price-features">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="price-cta">{p.cta}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-500 mt-6 text-center">
        Plans and prices are placeholders for layout and aren&apos;t active yet.
      </p>
    </main>
  );
}