import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0C0B09;
    --surface: #131210;
    --border:  #252320;
    --text:    #EDE9E2;
    --muted:   #B8B0A6;
    --accent:  #2A5441;
    --gold:    #9A7B3A;
    --goldL:   #C4A96A;
    --serif:   'Cormorant Garamond', Georgia, serif;
    --sans:    'DM Sans', sans-serif;
  }

  * { cursor: none !important; }

  #cursor {
    position: fixed; z-index: 9999; pointer-events: none;
    width: 10px; height: 10px;
    border: 1px solid var(--goldL);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.25s, height 0.25s, background 0.25s;
  }
  #cursor.hovering {
    width: 36px; height: 36px;
    background: rgba(154,123,58,0.08);
  }

  html, body {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 300;
    overflow-x: hidden;
  }

  /* ── PROGRESS BAR ── */
  .progress-bar {
    position: fixed; top: 0; left: 0; right: 0;
    height: 1px; z-index: 100;
    background: var(--border);
  }
  .progress-fill {
    height: 100%;
    background: var(--gold);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 90;
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 48px;
  }
  .nav-back {
    display: flex; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--muted);
    text-decoration: none; transition: color 0.2s;
    cursor: none;
  }
  .nav-back:hover { color: var(--goldL); }
  .nav-back-arrow { font-size: 16px; }
  .nav-logo {
    font-family: var(--serif); font-size: 18px;
    font-weight: 400; color: var(--muted);
    letter-spacing: 0.04em;
  }

  /* ── STAGE WRAPPER ── */
  .stage {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 140px 48px 120px;
    position: relative;
  }

  /* ── INTRO SCREEN ── */
  .intro {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
    max-width: 640px;
    animation: fadeUp 0.8s ease both;
  }
  .intro-eyebrow {
    font-size: 11px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 32px;
  }
  .intro-title {
    font-family: var(--serif);
    font-size: clamp(52px, 8vw, 88px);
    font-weight: 300; line-height: 0.95;
    letter-spacing: -0.02em; margin-bottom: 36px;
  }
  .intro-title em { font-style: italic; color: var(--goldL); }
  .intro-body {
    font-size: 16px; color: var(--muted);
    line-height: 1.75; margin-bottom: 56px;
    max-width: 520px;
  }
  .intro-rule {
    width: 40px; height: 1px;
    background: var(--gold); margin-bottom: 32px;
  }
  .intro-note {
    font-size: 12px; color: var(--muted);
    letter-spacing: 0.1em; margin-bottom: 48px;
    font-style: italic;
  }

  /* ── COMMITMENT SCREEN ── */
  .commitment {
    display: flex; flex-direction: column;
    max-width: 760px; width: 100%;
    animation: fadeUp 0.7s ease both;
  }
  .commitment-meta {
    display: flex; align-items: center; gap: 20px;
    margin-bottom: 48px;
  }
  .commitment-num {
    font-family: var(--serif);
    font-size: clamp(80px, 12vw, 120px);
    font-weight: 300; line-height: 1;
    color: #2A2720;
    user-select: none;
  }
  .commitment-meta-right {}
  .commitment-label {
    font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 10px;
  }
  .commitment-title {
    font-family: var(--serif);
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 400; line-height: 1.15;
    color: var(--text);
  }
  .commitment-body {
    font-size: 16px; color: var(--muted);
    line-height: 1.8; margin-bottom: 40px;
    border-left: 1px solid var(--border);
    padding-left: 28px;
  }
  .commitment-covenant {
    padding: 24px 28px;
    background: rgba(42,84,65,0.06);
    border: 1px solid var(--accent);
    margin-bottom: 48px;
  }
  .covenant-label {
    font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--goldL);
    margin-bottom: 10px;
  }
  .covenant-text {
    font-family: var(--serif);
    font-size: 18px; font-weight: 400;
    font-style: italic; line-height: 1.55;
    color: var(--text);
  }

  /* ── CLOSING SCREEN ── */
  .closing {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
    max-width: 640px;
    animation: fadeUp 0.8s ease both;
  }
  .closing-mark {
    font-family: var(--serif); font-size: 64px;
    color: var(--accent); margin-bottom: 32px;
    line-height: 1;
  }
  .closing-title {
    font-family: var(--serif);
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 300; line-height: 1.15;
    margin-bottom: 28px;
  }
  .closing-body {
    font-size: 15px; color: var(--muted);
    line-height: 1.8; margin-bottom: 48px;
  }
  .closing-actions {
    display: flex; gap: 16px; flex-wrap: wrap;
    justify-content: center;
  }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--sans); font-size: 12px;
    font-weight: 400; letter-spacing: 0.14em;
    text-transform: uppercase;
    background: var(--accent); color: var(--text);
    border: 1px solid var(--accent);
    padding: 16px 28px; cursor: none;
    transition: all 0.25s; text-decoration: none;
  }
  .btn-primary:hover { background: #345F4D; border-color: #345F4D; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--sans); font-size: 12px;
    font-weight: 400; letter-spacing: 0.14em;
    text-transform: uppercase;
    background: transparent; color: var(--muted);
    border: 1px solid var(--border);
    padding: 16px 28px; cursor: none;
    transition: all 0.25s; text-decoration: none;
  }
  .btn-ghost:hover { border-color: var(--muted); color: var(--text); }

  .btn-advance {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: var(--sans); font-size: 12px;
    font-weight: 400; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--goldL);
    border: 1px solid var(--gold);
    background: transparent;
    padding: 16px 28px; cursor: none;
    transition: all 0.25s;
    align-self: flex-start;
  }
  .btn-advance:hover {
    background: rgba(154,123,58,0.08);
    border-color: var(--goldL);
  }
  .btn-advance .arrow {
    transition: transform 0.2s;
  }
  .btn-advance:hover .arrow { transform: translateX(4px); }

  /* ── STEP DOTS ── */
  .step-dots {
    position: fixed; bottom: 40px; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 10px; align-items: center;
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--border); transition: all 0.3s;
    cursor: none;
  }
  .dot.active {
    background: var(--gold);
    width: 24px; border-radius: 3px;
  }
  .dot.done { background: var(--accent); }

  /* ── BG DECORATION ── */
  .bg-num {
    position: fixed;
    right: -20px; bottom: -40px;
    font-family: var(--serif);
    font-size: clamp(200px, 30vw, 340px);
    font-weight: 300; color: rgba(255,255,255,0.015);
    line-height: 1; user-select: none; pointer-events: none;
    transition: opacity 0.6s;
    z-index: 0; overflow: hidden;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-exit {
    animation: fadeDown 0.4s ease forwards;
  }
  @keyframes fadeDown {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(-16px); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .stage { padding: 100px 24px 80px; }
    .commitment-num { font-size: 72px; }
    .commitment-body { padding-left: 16px; }
    .btn-advance { align-self: center; }
  }
`;

const commitments = [
  {
    num: "I",
    label: "The First Commitment",
    title: "Structure as a Gift",
    body: "Structure is not bureaucracy. Structure is clarity. When a founder resists building formal roles, accountability systems, and documented processes, they may feel they are preserving agility. What they are actually doing is making themselves the only load-bearing wall in the building. A building with one load-bearing wall is not strong. It is fragile. The moment that wall shifts through illness, burnout, or simply the natural limits of a human being's attention, everything collapses. The brands that last do not survive because their founder was extraordinary. They survive because their founder built systems that made extraordinary outcomes ordinary.",
    covenant: "A founder who gives their team structure is not losing control. They are multiplying their ability to execute their vision. Structure is the founder's greatest act of generosity to the people who believe in what they are building."
  },
  {
    num: "II",
    label: "The Second Commitment",
    title: "Equitable Compensation",
    body: "There is a hidden financial model that quietly destroys brands from the inside: the model where the cost of operations is subsidized by the under-compensation of the people doing the work. When an employee is paid for one role but performs three, the brand is not running lean. It is running on borrowed time. That employee is subsidizing the brand's operations with their own labor, often without knowing it. The moment they realize it, and they always do, they leave. And with them goes not just their labor, but their institutional knowledge, their relationships, and their trust. Replacing a skilled employee costs between 100% and 200% of their annual salary. Brands that underpay are not saving money. They are paying a much higher price on a delayed timeline.",
    covenant: "Every role in this organization deserves a clear title, a documented scope of responsibilities, and compensation that reflects the actual value being delivered. If someone is doing the work of three people, the response is not to add a fourth task. It is to hire, redistribute, or compensate accordingly."
  },
  {
    num: "III",
    label: "The Third Commitment",
    title: "Budgeting as a Foundation",
    body: "A brand that does not budget is not running lean. It is making decisions by accident. Every month without a budget is a month of financial outcomes that cannot be analyzed, learned from, or improved upon. It is strategy replaced by instinct, and instinct without data is just hope. The most consistent finding across brands that fail is not that they lacked revenue. It is that they lacked the financial architecture to understand where that revenue went, where it was being lost, and how to course-correct before it was too late. A budget is not a constraint. It is a compass. It tells you not just what you have, but what is possible.",
    covenant: "A financial plan is not optional for a brand that intends to last. Beginning with even a simple monthly budget is the single highest-leverage action a founder can take to protect everything they have built."
  },
  {
    num: "IV",
    label: "The Fourth Commitment",
    title: "Delegation Without Abdication",
    body: "There is a pattern that quietly undermines even well-intentioned founders: they recognize that something needs to be done, they assign it to someone, and then consider it handled. But assignment without authority, resources, and accountability is not delegation. It is offloading. And offloading to someone who is already carrying too much is not leadership. True delegation requires three things: the right person, the right resources, and the right accountability. Without all three, the task does not get done, the person feels set up to fail, and the founder eventually concludes that no one can do this but them. That conclusion becomes a self-fulfilling prophecy.",
    covenant: "Delegation is only complete when the person receiving the task has the ability, the authority, and the bandwidth to execute it. Assigning a task to a person who is already overwhelmed is not a solution. It is a postponement of the problem."
  },
  {
    num: "V",
    label: "The Fifth Commitment",
    title: "Being the First Steward",
    body: "The Stewardship model only works if the founder embraces it first and most fully. You cannot ask your team to uphold a Brand Code that you yourself bypass. You cannot ask employees to respect systems you refuse to follow. The founder sets the cultural ceiling of the organization and the cultural floor. Every brand built for 100 years has a founder story that includes a moment of personal sacrifice for the mission: a choice to protect the brand's integrity over short-term personal gain. These are not just noble stories. They are the strategic pivots that made longevity possible.",
    covenant: "The founder is not just the brand's originator. They are its first steward. And stewardship means sometimes the brand's needs come before the founder's preferences. That is not a loss. It is the definition of building something that lasts."
  }
];

export default function CovenantPage() {
  const [screen, setScreen] = useState("intro"); // intro | commitment | closing
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = fonts + css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onHover = () => setHovering(true);
    const onLeave = () => setHovering(false);
    const els = document.querySelectorAll("button, a, .dot");
    els.forEach(el => {
      el.addEventListener("mouseenter", onHover);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => els.forEach(el => {
      el.removeEventListener("mouseenter", onHover);
      el.removeEventListener("mouseleave", onLeave);
    });
  });

  const advance = (toScreen, toIndex = 0) => {
    setExiting(true);
    setTimeout(() => {
      setScreen(toScreen);
      setIndex(toIndex);
      setExiting(false);
    }, 380);
  };

  const handleAdvance = () => {
    if (screen === "intro") {
      advance("commitment", 0);
    } else if (screen === "commitment") {
      if (index < commitments.length - 1) {
        advance("commitment", index + 1);
      } else {
        advance("closing");
      }
    }
  };

  const progressPct = screen === "intro"
    ? 0
    : screen === "closing"
    ? 100
    : ((index + 1) / commitments.length) * 100;

  const current = commitments[index];

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <div
        id="cursor"
        className={hovering ? "hovering" : ""}
        style={{ left: cursor.x, top: cursor.y, position: "fixed" }}
      />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Nav */}
      <nav>
        <Link to="/" className="nav-back">
          <span className="nav-back-arrow">←</span>
          Back to 100Long
        </Link>
        <div
          className="nav-logo"
          onClick={() => advance("intro")}
          style={{ cursor: "none", transition: "color 0.2s" }}
          onMouseEnter={e => e.target.style.color = "var(--goldL)"}
          onMouseLeave={e => e.target.style.color = "var(--muted)"}
        >
          The Founder's Covenant
        </div>
      </nav>

      {/* Background large numeral */}
      {screen === "commitment" && (
        <div className="bg-num" style={{ opacity: exiting ? 0 : 1 }}>
          {current.num}
        </div>
      )}

      {/* Main stage */}
      <div className="stage">

        {/* INTRO */}
        {screen === "intro" && (
          <div className={`intro ${exiting ? "fade-exit" : ""}`}>
            <div className="intro-eyebrow">100Long Framework</div>
            <h1 className="intro-title">
              The Founder's<br /><em>Covenant</em>
            </h1>
            <p className="intro-body">
              Before any org chart, any system, or any strategy takes hold, 
              one thing must happen: the founder must make a personal commitment 
              to the idea that the brand is bigger than they are.
            </p>
            <div className="intro-rule" />
            <p className="intro-note">Five commitments. Read each one fully before advancing.</p>
            <button className="btn-advance" onClick={handleAdvance}>
              Begin <span className="arrow">→</span>
            </button>
          </div>
        )}

        {/* COMMITMENT */}
        {screen === "commitment" && (
          <div className={`commitment ${exiting ? "fade-exit" : ""}`} key={index}>
            <div className="commitment-meta">
              <div className="commitment-num">{current.num}</div>
              <div className="commitment-meta-right">
                <div className="commitment-label">{current.label}</div>
                <h2 className="commitment-title">{current.title}</h2>
              </div>
            </div>
            <p className="commitment-body">{current.body}</p>
            <div className="commitment-covenant">
              <div className="covenant-label">The Commitment</div>
              <div className="covenant-text">{current.covenant}</div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              {index === 0 ? (
                <button className="btn-ghost" onClick={() => advance("intro")}>
                  ← Introduction
                </button>
              ) : (
                <button className="btn-ghost" onClick={() => advance("commitment", index - 1)}>
                  ← {commitments[index - 1].title}
                </button>
              )}
              <button className="btn-advance" onClick={handleAdvance}>
                {index < commitments.length - 1
                  ? `Next: ${commitments[index + 1].title}`
                  : "Complete the Covenant"
                }
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* CLOSING */}
        {screen === "closing" && (
          <div className={`closing ${exiting ? "fade-exit" : ""}`}>
            <div className="closing-mark">◈</div>
            <h2 className="closing-title">
              The covenant is made.<br />Now build accordingly.
            </h2>
            <p className="closing-body">
              Every 100-year brand begins with a founder who accepted that 
              the brand was bigger than themselves. You have read what that 
              acceptance requires. The framework is ready when you are.
            </p>
            <div className="closing-actions">
              <button className="btn-ghost" onClick={() => advance("commitment", commitments.length - 1)}>
                ← Back to Commitment V
              </button>
              <Link to="/" className="btn-primary">Return to 100Long →</Link>
              <a href="/Brand_Strategy_Compendium_Expanded.pdf" className="btn-ghost" target="_blank" rel="noreferrer">Download the Compendium</a>
            </div>
          </div>
        )}
      </div>

      {/* Step dots */}
      {screen === "commitment" && (
        <div className="step-dots">
          {commitments.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === index ? "active" : i < index ? "done" : ""}`}
              onClick={() => i <= index && advance("commitment", i)}
              style={{ cursor: i <= index ? "none" : "none", opacity: i > index ? 0.3 : 1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
