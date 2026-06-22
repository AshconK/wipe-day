// app/page.tsx
import Link from "next/link";
import Reveal from "./Reveal";
import { news } from "@/lib/news";
import Scramble from "./Scramble";
import Parallax from "./Parallax";

const heroStyle = {
  backgroundImage: `radial-gradient(120% 110% at 50% -10%, rgba(201,71,43,0.20), transparent 55%), linear-gradient(180deg, rgba(22,20,15,0.55), rgba(22,20,15,0.92)), url(/scenes/hero.gif)`,
};

const stats = [
  { num: "AI", label: "Tailored base advice" },
  { num: "5", label: "Explosives in the calculator" },
  { num: "3", label: "Group-size tiers" },
  { num: "Free", label: "No account needed" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="home-hero" style={heroStyle}>
        <div className="dot-grid" />
        <div className="home-hero-content">
          <h1>
            Raid smarter.<br />
            Build <Scramble text="UNBREAKABLE" className="accent" />.
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

      {/* Inside Wipe Day showcase */}
      <section className="showcase-section" style={{ position: "relative" }}>
        <Parallax speed={0.08}><div className="parallax-layer" /></Parallax>
        <Reveal>
          <div className="showcase-head">
            <span className="eyebrow">Inside Wipe Day</span>
            <h2>Every tool, built to win the wipe.</h2>
          </div>
        </Reveal>

        {/* 01 Assistant */}
        <Reveal>
          <div className="showcase-row">
            <div className="showcase-copy">
              <div className="sc-index">01</div>
              <span className="sc-label">Assistant</span>
              <h3>Ask. Get a base. Build it.</h3>
              <p>
                Tell it your group size and server, ask for a base, and it pulls up a
                guided, step-by-step build — not a wall of text.
              </p>
              <Link href="/assistant" className="sc-link">Open the Assistant →</Link>
            </div>
            <div className="sc-preview">
              <div className="sc-chips">
                <span className="sc-chip live">Live</span>
                <span className="sc-chip">Solo</span>
                <span className="sc-chip">Vanilla</span>
              </div>
              <div className="sc-bubble-user">give me a starter base</div>
              <div className="sc-bubble-ai">
                Here&apos;s a solid solo starter — follow the steps below.
                <div className="sc-steps"><span></span><span></span><span></span><span></span></div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 02 Base Designs */}
        <Reveal>
          <div className="showcase-row reverse">
            <div className="showcase-copy">
              <div className="sc-index">02</div>
              <span className="sc-label">Base Designs</span>
              <h3>Your own base library.</h3>
              <p>
                Save the builds you like to your personal hub and revisit the
                step-by-step guide any time — your bases, all in one place.
              </p>
              <Link href="/bases" className="sc-link">View My Bases →</Link>
            </div>
            <div className="sc-preview">
              <div className="sc-chips">
                <span className="sc-chip">Saved</span>
                <span className="sc-chip">Solo</span>
              </div>
              <div className="sc-minicard">
                <div className="sc-thumb"></div>
                <div>
                  <div className="nm">Bunker Base</div>
                  <div className="sc-steps"><span></span><span></span><span></span></div>
                </div>
              </div>
              <div className="sc-minicard">
                <div className="sc-thumb"></div>
                <div>
                  <div className="nm">2x2 Starter</div>
                  <div className="sc-steps"><span></span><span></span><span></span><span></span></div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 03 Raid Calculator */}
        <Reveal>
          <div className="showcase-row">
            <div className="showcase-copy">
              <div className="sc-index">03</div>
              <span className="sc-label">Raid Calculator</span>
              <h3>Know the cost before you boom.</h3>
              <p>
                Pick what you&apos;re breaking and your explosive — it totals the
                explosives and raw resources you need, no guessing.
              </p>
              <Link href="/raid" className="sc-link">Open the Calculator →</Link>
            </div>
            <div className="sc-preview">
              <div className="sc-chips">
                <span className="sc-chip live">Target</span>
                <span className="sc-chip">Sheet Metal Door</span>
              </div>
              <div className="sc-line"><span>Rockets</span><span className="val">4</span></div>
              <div className="sc-line"><span>Satchels</span><span className="val">10</span></div>
              <div className="sc-total"><span>Sulfur</span><span>5,600</span></div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal>
        <div className="home-cta">
          <h2>Gear up for wipe day.</h2>
          <p>Plan your base, price your raids, and build smarter — free to start.</p>
          <Link href="/assistant" className="cta-primary">Open the Assistant</Link>
        </div>
      </Reveal>

      {/* News */}
      <Reveal>
        <h2 className="section-title">Latest news</h2>
        <div>
          {news.map((n) => (
            <div key={n.id} className="news-item">
              <span className={"news-tag " + n.type}>{n.type === "rust" ? "Rust" : "Site"}</span>
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