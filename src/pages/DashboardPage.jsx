import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:      #0C0B09;
    --surface: #131210;
    --border:  #252320;
    --text:    #EDE9E2;
    --muted:   #B8B0A6;
    --accent:  #2A5441;
    --accentL: #345F4D;
    --gold:    #9A7B3A;
    --goldL:   #C4A96A;
    --serif:   'Cormorant Garamond', Georgia, serif;
    --sans:    'DM Sans', sans-serif;
  }
  * { cursor: none !important; }
  #cursor {
    position: fixed; z-index: 9999; pointer-events: none;
    width: 10px; height: 10px;
    border: 1px solid var(--goldL); border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width .25s, height .25s, background .25s;
  }
  #cursor.hov { width: 36px; height: 36px; background: rgba(154,123,58,.08); }

  html, body {
    background: var(--bg); color: var(--text);
    font-family: var(--sans); font-weight: 300;
    line-height: 1.6; overflow-x: hidden;
  }

  /* NAV */
  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    background: rgba(12,11,9,.92); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-back {
    display: flex; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: .16em; text-transform: uppercase;
    color: var(--muted); text-decoration: none; transition: color .2s;
  }
  .nav-back:hover { color: var(--goldL); }
  .nav-logo { font-family: var(--serif); font-size: 20px; font-weight: 400; }

  /* HERO */
  .hero {
    padding: 80px 48px 60px;
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 20px;
    max-width: 900px;
  }
  .eyebrow {
    font-size: 11px; letter-spacing: .2em;
    text-transform: uppercase; color: var(--gold);
  }
  .hero-title {
    font-family: var(--serif);
    font-size: clamp(42px,6vw,80px);
    font-weight: 300; line-height: 1;
    letter-spacing: -.02em;
  }
  .hero-title em { font-style: italic; color: var(--goldL); }
  .hero-sub {
    font-size: 15px; color: var(--muted);
    max-width: 560px; line-height: 1.75;
  }
  .hero-cta {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--goldL); border: 1px solid var(--gold);
    padding: 14px 24px; background: transparent;
    transition: all .25s; margin-top: 12px; align-self: flex-start;
  }
  .hero-cta:hover { background: rgba(154,123,58,.08); border-color: var(--goldL); }

  /* METRICS GRID */
  .metrics-section { padding: 60px 48px; }
  .section-header { margin-bottom: 40px; }
  .section-title {
    font-family: var(--serif); font-size: clamp(28px,4vw,44px);
    font-weight: 300; margin-bottom: 8px;
  }
  .section-sub { font-size: 14px; color: var(--muted); max-width: 480px; }

  .category-block { margin-bottom: 48px; }
  .category-label {
    font-size: 11px; letter-spacing: .18em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 16px;
    padding-bottom: 12px; border-bottom: 1px solid var(--border);
  }
  .metrics-grid {
    display: grid; grid-template-columns: repeat(2,1fr); gap: 2px;
  }
  .metric-card {
    background: var(--surface); border: 1px solid var(--border);
    padding: 24px 24px;
  }
  .metric-name {
    font-size: 13px; font-weight: 500; margin-bottom: 6px;
  }
  .metric-def { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 12px; }
  .metric-target {
    display: inline-block; font-size: 11px; letter-spacing: .1em;
    text-transform: uppercase; color: var(--goldL);
    border: 1px solid rgba(154,123,58,.3); padding: 4px 10px;
  }

  /* ASSESSMENT */
  .assessment-wrap { padding: 0 48px 80px; }
  .assess-header {
    padding: 40px 0 32px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 40px;
  }
  .brand-input-row {
    display: flex; align-items: center; gap: 16px;
    margin-top: 24px; flex-wrap: wrap;
  }
  .brand-input-label {
    font-size: 12px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--muted);
  }
  .brand-input {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); font-family: var(--serif);
    font-size: 22px; font-weight: 300;
    padding: 10px 16px; outline: none;
    width: 280px; transition: border-color .2s;
  }
  .brand-input:focus { border-color: var(--accent); }
  .brand-input::placeholder { color: var(--border); }

  /* PROGRESS */
  .assess-progress {
    display: flex; align-items: center; gap: 16px; margin-bottom: 36px;
  }
  .assess-progress-bar {
    flex: 1; height: 2px; background: var(--border);
  }
  .assess-progress-fill {
    height: 100%; background: var(--gold);
    transition: width .5s cubic-bezier(.4,0,.2,1);
  }
  .assess-progress-label {
    font-size: 11px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--muted);
    white-space: nowrap;
  }

  /* QUESTION */
  .question-card {
    background: var(--surface); border: 1px solid var(--border);
    padding: 40px; max-width: 760px;
    animation: fadeUp .5s ease both;
  }
  .q-category {
    font-size: 10px; letter-spacing: .2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 16px;
  }
  .q-text {
    font-family: var(--serif); font-size: clamp(20px,3vw,28px);
    font-weight: 300; line-height: 1.3; margin-bottom: 36px;
  }
  .q-options { display: flex; flex-direction: column; gap: 10px; }
  .q-option {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 16px 20px;
    background: var(--bg); border: 1px solid var(--border);
    transition: all .2s; text-align: left;
    font-family: var(--sans); font-size: 13px;
    color: var(--muted); line-height: 1.5;
  }
  .q-option:hover { border-color: rgba(154,123,58,.4); color: var(--text); }
  .q-option.selected {
    border-color: var(--accent); background: rgba(42,84,65,.08);
    color: var(--text);
  }
  .q-option-score {
    font-family: var(--serif); font-size: 22px;
    font-weight: 300; color: var(--accent); flex-shrink: 0;
    width: 28px; text-align: center;
  }
  .q-option.selected .q-option-score { color: var(--goldL); }

  .q-nav { display: flex; align-items: center; gap: 16px; margin-top: 28px; }
  .btn-next {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--goldL); border: 1px solid var(--gold);
    padding: 14px 24px; background: transparent; transition: all .25s;
  }
  .btn-next:hover { background: rgba(154,123,58,.08); border-color: var(--goldL); }
  .btn-next:disabled { opacity: .35; pointer-events: none; }
  .btn-back-q {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); border: 1px solid var(--border);
    padding: 14px 24px; background: transparent; transition: all .25s;
  }
  .btn-back-q:hover { border-color: var(--muted); color: var(--text); }

  /* RESULTS */
  .results-wrap { padding: 0 48px 80px; }
  .results-header { padding: 40px 0 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
  .results-brand {
    font-family: var(--serif); font-size: clamp(36px,5vw,60px);
    font-weight: 300; margin-bottom: 8px;
  }
  .results-brand em { font-style: italic; color: var(--goldL); }
  .results-sub { font-size: 14px; color: var(--muted); }

  .results-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
    align-items: start;
  }

  /* RADAR */
  .radar-wrap {
    background: var(--surface); border: 1px solid var(--border);
    padding: 32px; display: flex; flex-direction: column; gap: 20px;
  }
  .radar-title {
    font-size: 11px; letter-spacing: .16em;
    text-transform: uppercase; color: var(--gold);
  }

  /* SCORE CARDS */
  .score-cards { display: flex; flex-direction: column; gap: 2px; }
  .score-card {
    background: var(--surface); border: 1px solid var(--border);
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
  }
  .score-card-left {}
  .score-card-cat {
    font-size: 10px; letter-spacing: .16em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 4px;
  }
  .score-card-name {
    font-family: var(--serif); font-size: 20px; font-weight: 400;
  }
  .score-card-verdict {
    font-size: 12px; color: var(--muted); margin-top: 4px;
  }
  .score-circle {
    width: 56px; height: 56px; border-radius: 50%;
    border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; position: relative;
  }
  .score-circle-num {
    font-family: var(--serif); font-size: 22px;
    font-weight: 300; line-height: 1;
  }

  .overall-score {
    padding: 28px 32px;
    border: 1px solid var(--accent);
    background: rgba(42,84,65,.06);
    display: flex; align-items: center;
    justify-content: space-between; gap: 24px;
    margin-top: 2px;
  }
  .overall-label {
    font-size: 11px; letter-spacing: .16em;
    text-transform: uppercase; color: var(--goldL); margin-bottom: 4px;
  }
  .overall-brand { font-family: var(--serif); font-size: 22px; font-weight: 300; }
  .overall-num {
    font-family: var(--serif); font-size: 56px;
    font-weight: 300; color: var(--goldL); line-height: 1;
  }

  .results-actions {
    display: flex; gap: 12px; flex-wrap: wrap; margin-top: 36px;
  }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
    background: var(--accent); color: var(--text);
    border: 1px solid var(--accent); padding: 14px 24px;
    transition: all .25s; text-decoration: none;
  }
  .btn-primary:hover { background: var(--accentL); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); padding: 14px 24px;
    transition: all .25s; text-decoration: none;
  }
  .btn-ghost:hover { border-color: var(--muted); color: var(--text); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: none; }
  }

  @media (max-width: 768px) {
    nav, .hero, .metrics-section, .assessment-wrap, .results-wrap { padding-left: 24px; padding-right: 24px; }
    .metrics-grid { grid-template-columns: 1fr; }
    .results-grid { grid-template-columns: 1fr; }
  }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────

const metrics = [
  {
    category: "Brand Identity",
    pillar: "The Enduring Core",
    items: [
      { name: "Brand Code Compliance Rate", def: "Percentage of products, campaigns, and decisions audited as Brand Code-aligned.", target: "Target: >95%" },
      { name: "Customer Net Promoter Score (NPS)", def: "How likely are customers to recommend the brand.", target: "Target: >50" },
      { name: "Customer Lifetime Value (CLV)", def: "Average revenue per customer over their full relationship with the brand.", target: "Primary growth metric" },
      { name: "Repeat Purchase Rate", def: "Percentage of customers who purchase more than once.", target: "Target: >40% at Year 3" },
    ]
  },
  {
    category: "Operational Health",
    pillar: "The Adaptive Engine",
    items: [
      { name: "Sell-Through Rate", def: "Percentage of inventory sold at full price by Week 8.", target: "Target: >60%" },
      { name: "Sample Return Rate", def: "Percentage of loaned samples returned on time and in original condition.", target: "Target: >90%" },
      { name: "On-Time Delivery Rate", def: "Percentage of orders delivered on or before the promised date.", target: "Target: >95%" },
      { name: "Quality Return Rate", def: "Percentage of orders returned due to quality issues.", target: "Target: <2%" },
    ]
  },
  {
    category: "People & Culture",
    pillar: "Talent as Capital",
    items: [
      { name: "Employee NPS (eNPS)", def: "How likely are employees to recommend working here.", target: "Target: >40" },
      { name: "Employee Turnover Rate", def: "Percentage of employees who leave in a 12-month period.", target: "Target: <15%" },
      { name: "Role Clarity Score", def: "Percentage of employees who report a clear understanding of their role.", target: "Target: >85%" },
      { name: "Compensation Equity Index", def: "Percentage of roles compensated at or above the 50th percentile benchmark.", target: "Target: 100%" },
    ]
  },
  {
    category: "Financial Health",
    pillar: "The Financial Fortress",
    items: [
      { name: "Gross Margin", def: "Revenue minus cost of goods sold as a percentage of revenue.", target: "Benchmark: 50-65%" },
      { name: "Operating Reserve Status", def: "Current reserve versus 18-24 month target, tracked quarterly.", target: "Target: 18-24 months" },
      { name: "Budget Variance", def: "Actual versus budgeted performance by category.", target: "Variance >10% triggers review" },
      { name: "Revenue per Employee", def: "Total revenue divided by headcount. Indicator of operational efficiency.", target: "Track quarterly" },
    ]
  },
];

const questions = [
  // Brand Identity
  { id: 1, category: "Brand Identity", pillar: 0, text: "Does your brand have a written Brand Code, a documented statement of your aesthetic limits and non-negotiables?", options: [
    { score: 1, label: "No. We operate on instinct and informal understanding." },
    { score: 2, label: "Partially. Some values are written down but not comprehensive or enforced." },
    { score: 3, label: "Mostly. We have a brand document but it is not consistently applied." },
    { score: 4, label: "Yes. We have a documented Brand Code that most decisions reference." },
    { score: 5, label: "Yes. It is formal, enforced, and every employee can cite it." },
  ]},
  { id: 2, category: "Brand Identity", pillar: 0, text: "Could a team member make a brand-aligned decision on your behalf without asking you?", options: [
    { score: 1, label: "No. Most decisions come back to me regardless of scale." },
    { score: 2, label: "Rarely. A few people can, but most still defer to me." },
    { score: 3, label: "Sometimes. Senior team members can but others cannot." },
    { score: 4, label: "Usually. Most team members have enough context to decide." },
    { score: 5, label: "Yes. The brand's values are clear enough that decisions happen without me." },
  ]},
  { id: 3, category: "Brand Identity", pillar: 0, text: "Do you have a permanent product line that will never be retired or discounted, a Signature Collection?", options: [
    { score: 1, label: "No. Everything is subject to discount or discontinuation." },
    { score: 2, label: "Informally. Some items are treated as permanent but nothing is formalized." },
    { score: 3, label: "Partially. We have core items but they occasionally go on sale." },
    { score: 4, label: "Yes. We have permanent items with an informal no-discount rule." },
    { score: 5, label: "Yes. A formal Protected Core List exists and is never compromised." },
  ]},

  // Operational Health
  { id: 4, category: "Operational Health", pillar: 1, text: "How many independent suppliers do you have for your most critical materials?", options: [
    { score: 1, label: "One. We have a single supplier for most critical materials." },
    { score: 2, label: "Two. We have a primary and one backup for most materials." },
    { score: 3, label: "Three. We have reasonable redundancy but gaps remain." },
    { score: 4, label: "Four or more for most critical materials." },
    { score: 5, label: "Four or more for all critical materials with documented contingency protocols." },
  ]},
  { id: 5, category: "Operational Health", pillar: 1, text: "Do you track sell-through rates by SKU on a regular basis and take action based on the data?", options: [
    { score: 1, label: "No. We do not track sell-through in a structured way." },
    { score: 2, label: "Occasionally. We check numbers but not on a set schedule." },
    { score: 3, label: "Yes, but tracking does not always translate into timely action." },
    { score: 4, label: "Yes. We track weekly and have defined benchmarks that trigger reviews." },
    { score: 5, label: "Yes. We have a formal Sell-Through Benchmark System with automated triggers." },
  ]},
  { id: 6, category: "Operational Health", pillar: 1, text: "Are your production and delivery timelines consistently met?", options: [
    { score: 1, label: "Rarely. Delays are common and often surprise us." },
    { score: 2, label: "Sometimes. About half of our timelines are met as planned." },
    { score: 3, label: "Usually. Most timelines are met but exceptions occur regularly." },
    { score: 4, label: "Mostly. We hit timelines consistently with minor exceptions." },
    { score: 5, label: "Yes. We have documented production calendars and consistently meet them." },
  ]},

  // People & Culture
  { id: 7, category: "People & Culture", pillar: 2, text: "Does every person on your team have a clearly written job description that reflects what they actually do?", options: [
    { score: 1, label: "No. Roles are understood informally and shift frequently." },
    { score: 2, label: "A few do. Key roles have descriptions but many do not." },
    { score: 3, label: "Most do, but they are not always current or accurate." },
    { score: 4, label: "Yes. All roles have written descriptions that are reviewed periodically." },
    { score: 5, label: "Yes. Every role has a current, accurate description tied to compensation." },
  ]},
  { id: 8, category: "People & Culture", pillar: 2, text: "Are your team's compensation levels benchmarked against industry standards for comparable roles?", options: [
    { score: 1, label: "No. Compensation is set by feel or negotiation without benchmarking." },
    { score: 2, label: "Rarely. We have checked informally but have no formal process." },
    { score: 3, label: "Partially. Some roles are benchmarked but not consistently." },
    { score: 4, label: "Yes. We benchmark regularly and aim to pay at market rate." },
    { score: 5, label: "Yes. All roles are benchmarked, pay bands exist, and equity is reviewed biannually." },
  ]},
  { id: 9, category: "People & Culture", pillar: 2, text: "How would your team describe their understanding of how decisions get made at your company?", options: [
    { score: 1, label: "Unclear. Decisions feel arbitrary and inconsistent." },
    { score: 2, label: "Somewhat clear. People understand some decisions but not others." },
    { score: 3, label: "Mostly clear. The process is understood at leadership level but not always below." },
    { score: 4, label: "Clear. Most people understand who owns what decisions." },
    { score: 5, label: "Very clear. We use a documented decision framework and it is widely understood." },
  ]},

  // Financial Health
  { id: 10, category: "Financial Health", pillar: 3, text: "Do you operate with a formal monthly budget that tracks actual versus projected performance?", options: [
    { score: 1, label: "No. Financial decisions are made without a formal budget." },
    { score: 2, label: "Informally. We track some numbers but not in a structured budget format." },
    { score: 3, label: "Partially. We have a budget but it is not consistently maintained or reviewed." },
    { score: 4, label: "Yes. We have a monthly budget that is reviewed and updated regularly." },
    { score: 5, label: "Yes. Full budget with actuals tracked monthly and reviewed by leadership." },
  ]},
  { id: 11, category: "Financial Health", pillar: 3, text: "How many months of operating costs do you currently have in cash reserve?", options: [
    { score: 1, label: "Less than one month. We are operating close to the edge." },
    { score: 2, label: "One to two months. Minimal buffer." },
    { score: 3, label: "Three to six months. Reasonable but below the target." },
    { score: 4, label: "Six to twelve months. Solid foundation." },
    { score: 5, label: "Twelve months or more. We are building toward the 18-24 month target." },
  ]},
  { id: 12, category: "Financial Health", pillar: 3, text: "Do you know your gross margin by product category and track it on a regular basis?", options: [
    { score: 1, label: "No. We do not track margin in a structured way." },
    { score: 2, label: "Roughly. We have a general sense but not precise category-level data." },
    { score: 3, label: "Partially. We track overall margin but not broken down by category." },
    { score: 4, label: "Yes. We track gross margin by category on a quarterly basis." },
    { score: 5, label: "Yes. We track monthly, benchmark against industry standards, and act on variances." },
  ]},
];

const pillarNames = ["Brand Identity", "Operational Health", "People & Culture", "Financial Health"];

const verdicts = (score) => {
  if (score >= 4.5) return "Strong foundation.";
  if (score >= 3.5) return "Solid, with room to formalize.";
  if (score >= 2.5) return "Developing. Key systems needed.";
  if (score >= 1.5) return "Early stage. Prioritize this pillar.";
  return "Needs immediate attention.";
};

const scoreColor = (score) => {
  if (score >= 4) return "#2A5441";
  if (score >= 3) return "#9A7B3A";
  if (score >= 2) return "#7A5C1E";
  return "#7A3030";
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [view, setView] = useState("info"); // info | assess | results
  const [brandName, setBrandName] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
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
    const on = () => setHovering(true);
    const off = () => setHovering(false);
    const els = document.querySelectorAll("button, a, .q-option");
    els.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  });

  // Restore selected answer when navigating back
  useEffect(() => {
    setSelected(answers[qIndex] ?? null);
  }, [qIndex]);

  const handleSelect = (score) => setSelected(score);

  const handleNext = () => {
    const updated = { ...answers, [qIndex]: selected };
    setAnswers(updated);
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setView("results");
    }
  };

  const handleBack = () => {
    if (qIndex === 0) {
      setView("info");
    } else {
      setAnswers({ ...answers, [qIndex]: selected });
      setQIndex(qIndex - 1);
    }
  };

  const startAssessment = () => {
    setQIndex(0);
    setAnswers({});
    setSelected(null);
    setView("assess");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Compute scores per pillar
  const pillarScores = [0,1,2,3].map(p => {
    const qs = questions.filter(q => q.pillar === p);
    const total = qs.reduce((sum, q, i) => {
      const globalIdx = questions.findIndex(qq => qq.id === q.id);
      return sum + (answers[globalIdx] || 0);
    }, 0);
    return Math.round((total / (qs.length * 5)) * 100);
  });

  const overallScore = Math.round(pillarScores.reduce((a, b) => a + b, 0) / 4);

  const radarData = pillarNames.map((name, i) => ({
    subject: name.split(" ")[0] + (name.split(" ")[1] ? " " + name.split(" ")[1].slice(0, 3) + "." : ""),
    score: pillarScores[i],
    fullMark: 100
  }));

  const q = questions[qIndex];
  const progress = ((qIndex) / questions.length) * 100;

  return (
    <div>
      <div id="cursor" className={hovering ? "hov" : ""} style={{ left: cursor.x, top: cursor.y, position: "fixed" }} />

      <nav>
        <Link to="/" className="nav-back">← Back to 100More</Link>
        <div
          className="nav-logo"
          onClick={() => setView("info")}
          style={{ transition: "color .2s" }}
          onMouseEnter={e => e.target.style.color = "var(--goldL)"}
          onMouseLeave={e => e.target.style.color = "var(--text)"}
        >
          Brand Health Dashboard
        </div>
      </nav>

      {/* ── INFO VIEW ── */}
      {view === "info" && (
        <>
          <div className="hero">
            <div className="eyebrow">100More Framework</div>
            <h1 className="hero-title">
              How healthy is<br />your <em>brand?</em>
            </h1>
            <p className="hero-sub">
              The Brand Health Dashboard is built around 16 structural metrics across the four pillars of the 100More framework. Review the benchmarks below, then unlock your personalized assessment.
            </p>
            <button className="hero-cta" onClick={startAssessment}>
              Begin Your Assessment →
            </button>
          </div>

          <div className="metrics-section">
            <div className="section-header">
              <div className="eyebrow" style={{ marginBottom: 12 }}>The Benchmarks</div>
              <h2 className="section-title">What healthy looks like</h2>
              <p className="section-sub">These are the metrics that tell you whether your brand is structurally sound or running on hope.</p>
            </div>

            {metrics.map((cat, i) => (
              <div className="category-block" key={i}>
                <div className="category-label">{cat.category} — {cat.pillar}</div>
                <div className="metrics-grid">
                  {cat.items.map((m, j) => (
                    <div className="metric-card" key={j}>
                      <div className="metric-name">{m.name}</div>
                      <div className="metric-def">{m.def}</div>
                      <span className="metric-target">{m.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <button className="hero-cta" onClick={startAssessment}>
                Begin Your Assessment →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── ASSESSMENT VIEW ── */}
      {view === "assess" && (
        <div className="assessment-wrap">
          <div className="assess-header">
            <div className="eyebrow">Personal Assessment</div>
            <h2 className="section-title" style={{ marginTop: 8 }}>
              {brandName ? `${brandName}'s Brand Health` : "Your Brand Health"}
            </h2>
            <div className="brand-input-row">
              <span className="brand-input-label">Brand Name</span>
              <input
                className="brand-input"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
              />
            </div>
          </div>

          <div className="assess-progress">
            <div className="assess-progress-bar">
              <div className="assess-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="assess-progress-label">
              {qIndex + 1} of {questions.length}
            </div>
          </div>

          <div className="question-card" key={qIndex}>
            <div className="q-category">{q.category}</div>
            <div className="q-text">{q.text}</div>
            <div className="q-options">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`q-option${selected === opt.score ? " selected" : ""}`}
                  onClick={() => handleSelect(opt.score)}
                >
                  <span className="q-option-score">{opt.score}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="q-nav">
              <button className="btn-back-q" onClick={handleBack}>
                ← {qIndex === 0 ? "Back to Dashboard" : "Previous"}
              </button>
              <button className="btn-next" onClick={handleNext} disabled={selected === null}>
                {qIndex < questions.length - 1 ? "Next Question →" : "See Your Results →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS VIEW ── */}
      {view === "results" && (
        <div className="results-wrap">
          <div className="results-header">
            <div className="eyebrow">Assessment Complete</div>
            <h2 className="results-brand">
              {brandName ? <><em>{brandName}</em>'s Brand Health</> : "Your Brand Health"}
            </h2>
            <p className="results-sub">Based on your responses across 12 questions and four structural pillars.</p>
          </div>

          <div className="results-grid">
            <div>
              <div className="radar-wrap">
                <div className="radar-title">Overall Structural Health</div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Score", value: overallScore },
                        { name: "Remaining", value: 100 - overallScore }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill={scoreColor(overallScore / 20)} />
                      <Cell fill="#1A1916" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ textAlign: "center", marginTop: -16 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 64, fontWeight: 300, color: scoreColor(overallScore / 20), lineHeight: 1 }}>
                    {overallScore}
                  </div>
                  <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginTop: 8 }}>
                    out of 100
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>
                    {verdicts(overallScore / 20)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="score-cards">
                {pillarNames.map((name, i) => (
                  <div className="score-card" key={i}>
                    <div className="score-card-left">
                      <div className="score-card-cat">Pillar {["I","II","III","IV"][i]}</div>
                      <div className="score-card-name">{name}</div>
                      <div className="score-card-verdict">{verdicts(pillarScores[i] / 20)}</div>
                    </div>
                    <div className="score-circle" style={{ borderColor: scoreColor(pillarScores[i] / 20) }}>
                      <span className="score-circle-num" style={{ color: scoreColor(pillarScores[i] / 20) }}>
                        {pillarScores[i]}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="overall-score">
                  <div>
                    <div className="overall-label">Overall Brand Health</div>
                    <div className="overall-brand">{brandName || "Your Brand"}</div>
                  </div>
                  <div className="overall-num">{overallScore}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="results-actions">
            <button className="btn-next" onClick={startAssessment}>Retake Assessment</button>
            <Link to="/" className="btn-primary">Explore the Framework →</Link>
            <Link to="/covenant" className="btn-ghost">Read the Founder's Covenant</Link>
          </div>
        </div>
      )}
    </div>
  );
}
