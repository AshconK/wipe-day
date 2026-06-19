// app/page.tsx
import Link from "next/link";
import Reveal from "./Reveal";
import { news } from "@/lib/news";

const heroStyle = {
  backgroundImage: `radial-gradient(120% 110% at 50% -10%, rgba(201,71,43,0.20), transparent 55%), linear-gradient(180deg, rgba(22,20,15,0.55), rgba(22,20,15,0.92)), url(/scenes/hero.gif)`,
};

const stats = [
  { num: "AI", label: "Tailored base advice" },
  { num: "5", label: "Explosives in the calculator" },
  { num: "3", label: "Group-size tiers" },
  { num: "Free", label: "No account needed" },
];

const features = [
  {
    title: "Tailored to your group",
    body: "Advice fits your group size, server type, and the goal you describe — not generic tips.",
  },
  {
    title: "Costs you can trust",
    body: "Build and raid numbers come from a verified data table, not the AI's guesses.",
  },
  {
    title: "Visual base library",
    body: "Real base screenshots, picked at random from the right tier for your group.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Parallax hero */}
      <section className="home-hero parallax" style={heroStyle}>
        <div className="home-hero-content">
          <div className="ember-bar" />
          <h1>
            Raid smarter.<br />
            Build <span className="accent">unbreakable</span>.
          </h1>
          <p>
            Your Rust command center — tailored base plans, expansion strategy,
            electricity help, and exact raid costs, all in one place.
          </p>
          <div className="hero-cta-row">
            <Link href="/assistant" className="cta-primary">Open the Assistant</Link>
            <Link href="/raid" className="cta-ghost">Raid Calculator</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Reveal>
        <div className="stats-strip">
          {stats.map((s) => (
            <div key={s.label} className="stat-tile">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Features */}
      <Reveal>
        <h2 className="section-title">Why use it</h2>
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature">
              <svg className="feature-icon" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3 6 6 .9-4.5 4.3 1 6L12 17l-5.5 3 1-6L3 8.9 9 8z" />
              </svg>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Tools */}
      <Reveal>
        <h2 className="section-title">Tools</h2>
      </Reveal>
      <div className="tool-grid home-section">
        {[
          { href: "/assistant", title: "AI Assistant", body: "Tailored base, expansion and electricity advice for your group and goal." },
          { href: "/raid", title: "Raid Calculator", body: "Pick what you're breaking and your explosive — exact resources, no guessing." },
          { href: "/pricing", title: "Go Pro", body: "Higher limits and premium features. See the plans." },
        ].map((t, i) => (
          <Reveal key={t.href} delay={i * 120}>
            <Link href={t.href} className="tool-card">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* News */}
      <Reveal>
        <h2 className="section-title">Latest news</h2>
        <div>
          {news.map((n) => (
            <div key={n.id} className="news-item">
              <span className={"news-tag " + n.type}>
                {n.type === "rust" ? "Rust" : "Site"}
              </span>
              <span className="news-date">{n.date}</span>
              <h4>{n.title}</h4>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </main>
  );
}