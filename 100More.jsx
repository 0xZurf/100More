import { useState, useEffect, useRef } from "react";

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0C0B09;
    --surface:  #131210;
    --border:   #252320;
    --text:     #EDE9E2;
    --muted:    #B8B0A6;
    --accent:   #2A5441;
    --gold:     #9A7B3A;
    --goldL:    #C4A96A;
    --danger:   #7A3030;
    --serif:    'Cormorant Garamond', Georgia, serif;
    --sans:     'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    font-weight: 300;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ── CURSOR ── */
  * { cursor: none !important; }
  #cursor {
    position: fixed; z-index: 9999; pointer-events: none;
    width: 10px; height: 10px;
    border: 1px solid var(--goldL);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.1s, width 0.25s, height 0.25s, background 0.25s;
  }
  #cursor.hovering {
    width: 40px; height: 40px;
    background: rgba(154,123,58,0.08);
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    border-bottom: 1px solid transparent;
    transition: border-color 0.4s, background 0.4s;
  }
  nav.scrolled {
    border-color: var(--border);
    background: rgba(12,11,9,0.92);
    backdrop-filter: blur(12px);
  }
  .nav-logo {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: var(--text);
  }
  .nav-links { display: flex; gap: 36px; }
  .nav-links a {
    font-size: 12px; font-weight: 400; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--goldL); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 120px 48px 80px;
    position: relative; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 70% 60% at 80% 50%, rgba(42,84,65,0.08) 0%, transparent 70%);
  }
  .hero-grain {
    position: absolute; inset: 0; z-index: 1; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
  }
  .hero-eyebrow {
    font-size: 11px; font-weight: 400; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 28px; position: relative; z-index: 2;
  }
  .hero-title {
    font-family: var(--serif);
    font-size: clamp(72px, 10vw, 140px);
    font-weight: 300; line-height: 0.92;
    letter-spacing: -0.02em;
    color: var(--text);
    position: relative; z-index: 2;
    margin-bottom: 40px;
  }
  .hero-title em {
    font-style: italic; color: var(--goldL);
  }
  .hero-sub {
    font-size: 16px; font-weight: 300;
    color: var(--muted); max-width: 460px;
    position: relative; z-index: 2;
    line-height: 1.7; margin-bottom: 56px;
  }
  .hero-rule {
    width: 1px; height: 80px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    position: relative; z-index: 2;
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

  /* ── FOUNDER SELECTOR ── */
  .selector-section {
    padding: 80px 48px 120px;
    border-top: 1px solid var(--border);
  }
  .selector-label {
    font-size: 11px; font-weight: 400; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 24px;
  }
  .selector-question {
    font-family: var(--serif);
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 300; line-height: 1.2;
    margin-bottom: 48px; max-width: 640px;
  }
  .selector-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px; max-width: 900px;
  }
  .selector-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 36px 28px;
    cursor: none;
    transition: all 0.3s;
    position: relative; overflow: hidden;
  }
  .selector-card::before {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: var(--accent);
    transform: scaleX(0); transition: transform 0.3s;
  }
  .selector-card:hover::before,
  .selector-card.active::before { transform: scaleX(1); }
  .selector-card:hover,
  .selector-card.active {
    background: rgba(42,84,65,0.06);
    border-color: var(--accent);
  }
  .selector-card.active .card-num { color: var(--goldL); }
  .card-num {
    font-family: var(--serif); font-size: 48px;
    font-weight: 300; color: #787068;
    line-height: 1; margin-bottom: 16px;
    transition: color 0.3s;
  }
  .card-title {
    font-size: 14px; font-weight: 500;
    letter-spacing: 0.04em; margin-bottom: 10px;
  }
  .card-desc {
    font-size: 13px; color: var(--muted); line-height: 1.6;
  }
  .selector-result {
    margin-top: 48px; padding: 28px 32px;
    background: rgba(42,84,65,0.06);
    border: 1px solid var(--accent);
    max-width: 640px;
    animation: fadeIn 0.4s ease;
  }
  .selector-result-label {
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--goldL);
    margin-bottom: 10px;
  }
  .selector-result-text {
    font-family: var(--serif); font-size: 20px;
    font-weight: 300; line-height: 1.5;
  }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  /* ── SECTION SHARED ── */
  .section {
    padding: 100px 48px;
    border-top: 1px solid var(--border);
  }
  .section-eyebrow {
    font-size: 11px; font-weight: 400; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 20px;
  }
  .section-title {
    font-family: var(--serif);
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 300; line-height: 1.1;
    margin-bottom: 16px;
  }
  .section-sub {
    font-size: 15px; color: var(--muted);
    max-width: 520px; line-height: 1.7;
    margin-bottom: 60px;
  }

  /* ── PILLARS ── */
  .pillars-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 2px;
  }
  .pillar-card {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 40px 36px;
    cursor: none; transition: all 0.3s;
    position: relative;
  }
  .pillar-card:hover { border-color: rgba(154,123,58,0.3); }
  .pillar-card.open {
    background: rgba(42,84,65,0.05);
    border-color: var(--accent);
    grid-column: span 2;
  }
  .pillar-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 20px;
  }
  .pillar-num {
    font-family: var(--serif); font-size: 72px;
    font-weight: 300; color: #787068;
    line-height: 0.9; flex-shrink: 0;
    transition: color 0.3s;
  }
  .pillar-card:hover .pillar-num,
  .pillar-card.open .pillar-num { color: rgba(154,123,58,0.3); }
  .pillar-info { flex: 1; }
  .pillar-tag {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 8px;
  }
  .pillar-name {
    font-family: var(--serif); font-size: 28px;
    font-weight: 400; line-height: 1.2;
    margin-bottom: 10px;
  }
  .pillar-teaser {
    font-size: 13px; color: var(--muted); line-height: 1.6;
  }
  .pillar-toggle {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 18px; color: var(--muted);
    transition: all 0.3s;
  }
  .pillar-card:hover .pillar-toggle {
    border-color: var(--gold); color: var(--goldL);
  }
  .pillar-body {
    margin-top: 36px; padding-top: 36px;
    border-top: 1px solid var(--border);
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    animation: fadeIn 0.35s ease;
  }
  .pillar-body-col h4 {
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--goldL);
    margin-bottom: 16px;
  }
  .pillar-item {
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .pillar-item:last-child { border-bottom: none; }
  .pillar-item-title {
    font-size: 14px; font-weight: 500;
    margin-bottom: 4px;
  }
  .pillar-item-desc {
    font-size: 13px; color: var(--muted); line-height: 1.6;
  }

  /* ── ROADMAP ── */
  .roadmap-track {
    display: flex; gap: 2px;
    margin-bottom: 2px;
  }
  .phase-btn {
    flex: 1; padding: 18px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted); font-family: var(--sans);
    font-size: 12px; font-weight: 400;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: none; transition: all 0.25s;
    text-align: left;
  }
  .phase-btn:hover { color: var(--text); border-color: rgba(154,123,58,0.3); }
  .phase-btn.active {
    background: rgba(42,84,65,0.1);
    border-color: var(--accent);
    color: var(--goldL);
  }
  .phase-label { font-family: var(--serif); font-size: 22px; display: block; margin-top: 4px; }
  .roadmap-content {
    background: var(--surface);
    border: 1px solid var(--accent);
    padding: 48px;
    animation: fadeIn 0.35s ease;
  }
  .roadmap-content-header {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 40px;
    margin-bottom: 40px;
  }
  .roadmap-phase-title {
    font-family: var(--serif); font-size: 40px;
    font-weight: 300; line-height: 1.15;
  }
  .roadmap-timeline {
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--gold);
    padding: 10px 16px;
    border: 1px solid var(--gold);
    white-space: nowrap; flex-shrink: 0;
    align-self: flex-start;
  }
  .roadmap-tasks {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 2px;
  }
  .roadmap-task {
    padding: 20px 24px;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    display: flex; gap: 16px; align-items: flex-start;
  }
  .task-num {
    font-family: var(--serif); font-size: 28px;
    font-weight: 300; color: var(--accent);
    line-height: 1; flex-shrink: 0;
  }
  .task-text { font-size: 13px; color: var(--muted); line-height: 1.65; }
  .roadmap-critical {
    margin-top: 32px; padding: 24px 28px;
    background: rgba(154,123,58,0.05);
    border: 1px solid rgba(154,123,58,0.2);
  }
  .critical-label {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--goldL);
    margin-bottom: 10px;
  }
  .critical-text {
    font-family: var(--serif); font-size: 18px;
    font-weight: 300; font-style: italic;
    line-height: 1.5; color: var(--text);
  }

  /* ── BRANDS ── */
  .brands-list { display: flex; flex-direction: column; gap: 2px; }
  .brand-row {
    background: var(--surface);
    border: 1px solid var(--border);
    cursor: none; transition: all 0.3s;
    overflow: hidden;
  }
  .brand-row:hover { border-color: rgba(154,123,58,0.3); }
  .brand-row.open { border-color: var(--accent); }
  .brand-row-header {
    padding: 36px 40px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 32px;
  }
  .brand-row-left { display: flex; align-items: center; gap: 32px; }
  .brand-year {
    font-family: var(--serif); font-size: 15px;
    color: var(--muted); font-style: italic;
    min-width: 60px;
  }
  .brand-name {
    font-family: var(--serif); font-size: 32px;
    font-weight: 400;
  }
  .brand-origin {
    font-size: 12px; color: var(--gold);
    letter-spacing: 0.1em;
  }
  .brand-lesson-preview {
    font-size: 13px; color: var(--muted);
    max-width: 400px; font-style: italic;
  }
  .brand-expand {
    font-size: 22px; color: var(--muted);
    transition: transform 0.3s, color 0.3s; flex-shrink: 0;
  }
  .brand-row.open .brand-expand { transform: rotate(45deg); color: var(--goldL); }
  .brand-body {
    padding: 0 40px 40px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 40px; animation: fadeIn 0.35s ease;
    border-top: 1px solid var(--border);
    padding-top: 32px;
  }
  .brand-body-text { font-size: 14px; color: var(--muted); line-height: 1.75; }
  .brand-pillars h4 {
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--goldL);
    margin-bottom: 16px;
  }
  .brand-pillar-tag {
    display: inline-block;
    padding: 6px 14px;
    border: 1px solid var(--accent);
    font-size: 12px; color: var(--text);
    margin: 0 6px 8px 0;
  }

  /* ── FRAMEWORK ── */
  .framework-section {
    padding: 100px 48px;
    border-top: 1px solid var(--border);
    background: var(--surface);
  }
  .framework-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px; margin-top: 60px;
  }
  .framework-card {
    padding: 48px 40px;
    background: var(--bg);
    border: 1px solid var(--border);
    transition: all 0.3s;
  }
  .framework-card:hover { border-color: rgba(154,123,58,0.4); }
  .framework-card.primary {
    background: rgba(42,84,65,0.06);
    border-color: var(--accent);
  }
  .fw-icon { font-size: 28px; margin-bottom: 20px; }
  .fw-title {
    font-family: var(--serif); font-size: 26px;
    font-weight: 400; margin-bottom: 12px;
  }
  .fw-desc {
    font-size: 13px; color: var(--muted);
    line-height: 1.7; margin-bottom: 28px;
  }
  .fw-btn {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--goldL);
    border: 1px solid var(--gold);
    padding: 12px 20px; text-decoration: none;
    transition: all 0.25s; cursor: none;
  }
  .fw-btn:hover {
    background: rgba(154,123,58,0.08);
    border-color: var(--goldL);
  }

  /* ── QUOTE ── */
  .quote-block {
    padding: 80px 48px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 40px;
  }
  .quote-rule { width: 2px; height: 80px; background: var(--gold); flex-shrink: 0; }
  .quote-text {
    font-family: var(--serif); font-size: clamp(22px, 3vw, 36px);
    font-weight: 300; font-style: italic;
    line-height: 1.35; max-width: 800px;
  }
  .quote-attr {
    font-size: 12px; color: var(--muted);
    letter-spacing: 0.12em; margin-top: 16px;
    text-transform: uppercase;
  }

  /* ── WORK WITH ── */
  .work-section {
    padding: 100px 48px;
    border-top: 1px solid var(--border);
  }
  .work-open-btn {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: var(--sans); font-size: 12px;
    font-weight: 400; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--goldL);
    border: 1px solid var(--gold); background: transparent;
    padding: 16px 28px; transition: all 0.25s; margin-top: 32px;
  }
  .work-open-btn:hover { background: rgba(154,123,58,0.08); border-color: var(--goldL); }

  .work-body {
    margin-top: 48px; animation: fadeIn 0.4s ease;
  }
  .services-grid {
    display: grid; grid-template-columns: repeat(2,1fr);
    gap: 2px; margin-bottom: 48px;
  }
  .service-card {
    background: var(--surface); border: 1px solid var(--border);
    padding: 32px 28px;
  }
  .service-num {
    font-family: var(--serif); font-size: 40px;
    font-weight: 300; color: #3A3530;
    line-height: 1; margin-bottom: 14px;
  }
  .service-name {
    font-family: var(--serif); font-size: 22px;
    font-weight: 400; margin-bottom: 10px;
  }
  .service-desc {
    font-size: 13px; color: var(--muted); line-height: 1.7;
  }

  .contact-form {
    background: var(--surface); border: 1px solid var(--border);
    padding: 40px; max-width: 680px;
  }
  .form-title {
    font-family: var(--serif); font-size: 28px;
    font-weight: 300; margin-bottom: 6px;
  }
  .form-sub {
    font-size: 13px; color: var(--muted);
    margin-bottom: 32px; line-height: 1.6;
  }
  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-bottom: 16px;
  }
  .form-field { display: flex; flex-direction: column; gap: 8px; }
  .form-field.full { grid-column: span 2; }
  .form-label {
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted);
  }
  .form-input, .form-select, .form-textarea {
    background: var(--bg); border: 1px solid var(--border);
    color: var(--text); font-family: var(--sans);
    font-size: 14px; font-weight: 300;
    padding: 12px 14px; outline: none;
    transition: border-color 0.2s; width: 100%;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--accent);
  }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--border); }
  .form-select { appearance: none; cursor: none; }
  .form-select option { background: var(--bg); }
  .form-textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
  .form-submit {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--accent); color: var(--text);
    border: 1px solid var(--accent); padding: 16px 32px;
    transition: all 0.25s; margin-top: 8px; width: 100%;
    justify-content: center; font-family: var(--sans); font-weight: 400;
  }
  .form-submit:hover { background: #345F4D; border-color: #345F4D; }
  .form-submitted {
    text-align: center; padding: 48px 32px;
    animation: fadeIn 0.4s ease;
  }
  .form-submitted-mark {
    font-family: var(--serif); font-size: 52px;
    color: var(--accent); margin-bottom: 20px;
  }
  .form-submitted-title {
    font-family: var(--serif); font-size: 28px;
    font-weight: 300; margin-bottom: 12px;
  }
  .form-submitted-sub { font-size: 14px; color: var(--muted); line-height: 1.7; }

  /* ── FOOTER ── */
  footer {
    padding: 48px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center;
    justify-content: space-between;
  }
  .footer-logo {
    font-family: var(--serif); font-size: 20px;
    font-weight: 300; color: var(--muted);
  }
  .footer-note {
    font-size: 12px; color: var(--muted);
    letter-spacing: 0.08em;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .nav-links { display: none; }
    .hero, .selector-section, .section { padding-left: 24px; padding-right: 24px; }
    .selector-cards { grid-template-columns: 1fr; }
    .pillars-grid { grid-template-columns: 1fr; }
    .pillar-card.open { grid-column: span 1; }
    .pillar-body { grid-template-columns: 1fr; }
    .roadmap-track { flex-direction: column; }
    .roadmap-tasks { grid-template-columns: 1fr; }
    .roadmap-content { padding: 28px 20px; }
    .roadmap-content-header { flex-direction: column; gap: 16px; }
    .brand-row-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    .brand-body { grid-template-columns: 1fr; }
    .framework-grid { grid-template-columns: 1fr; }
    .quote-block { flex-direction: column; gap: 20px; }
    footer { flex-direction: column; gap: 12px; }
  }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────

const founders = [
  {
    num: "01",
    title: "Building from zero",
    desc: "You have a vision and want to build it right from the start."
  },
  {
    num: "02",
    title: "Mid-build and scaling",
    desc: "You have something real and want the right structure to carry it forward."
  },
  {
    num: "03",
    title: "Established and seeking longevity",
    desc: "The brand exists and you are ready to build the systems that make it last 100 years."
  },
];

const founderResults = [
  "Start with The Pillars. Build the Foundation before the systems. The Brand Code, the Financial Fortress, and Role Clarity are your first three moves, in that order.",
  "Your Phase 2 and 3 are most relevant. You have momentum; now build the structure that protects it. Formalize roles, establish the budget, and implement OKRs so the vision scales without fracturing.",
  "Go directly to The Pillars and the Execution Roadmap. You have the foundation; this framework gives you the architecture to turn what you have built into something that outlasts you.",
];

const pillars = [
  {
    num: "I",
    tag: "Identity & Governance",
    name: "The Enduring Core",
    teaser: "What you stand for, codified. The immutable foundation that every future leader inherits.",
    items: [
      { title: "The Brand Code", desc: "A documented, binding statement of the brand's aesthetic and ethical limits. It governs every decision: product, partnerships, communication, and hiring." },
      { title: "The Signature Product Line", desc: "A permanent collection of iconic items that are never retired, never discounted, and never compromised. The brand's handshake with history." },
      { title: "The Archive & Heritage Team", desc: "Preserves every design, communication, and cultural artifact. Not nostalgia; institutional DNA for every future leader." },
      { title: "The Succession Model", desc: "A formal pipeline from apprentice to leader with mandatory 3–5 year transition overlaps. No leadership change should be a cliff-edge." },
    ],
    principle: "A brand without a documented identity is a brand whose identity is for sale."
  },
  {
    num: "II",
    tag: "Innovation & Production",
    name: "The Adaptive Engine",
    teaser: "Permanence without adaptability is calcification. How you evolve in form while staying constant in spirit.",
    items: [
      { title: "House of Heritage", desc: "Perfects and refines core products. Masters the brand's established aesthetic language. Anchors every launch." },
      { title: "House of Future", desc: "Handles experimentation and R&D. Operates with more freedom. Informs future brand directions without destabilizing the core." },
      { title: "Quad-Sourcing", desc: "Four independent suppliers for every critical material. No single dependency. Protection against geopolitical instability, natural disasters, and supplier failure." },
      { title: "Vertical Manufacturing", desc: "Owning small manufacturing facilities is a craft decision, not just an economic one. It protects quality standards and develops proprietary techniques." },
    ],
    principle: "The brands that last evolve in form while remaining constant in spirit."
  },
  {
    num: "III",
    tag: "Business Model",
    name: "The Financial Fortress",
    teaser: "Financial independence is not an aspiration. It is a prerequisite for mission integrity.",
    items: [
      { title: "The Perpetual Purpose Trust", desc: "Holds 100% voting control. Legally prohibits the sale of the company and mandates the Brand Code. Not a gentleman's agreement; a legal structure." },
      { title: "The Rainy Day Reserve", desc: "18–24 months of operating costs in cash reserve. Non-negotiable. The difference between a downturn and a brand-ending catastrophe." },
      { title: "Compensation Equity", desc: "All roles benchmarked against market data. If someone is performing the work of two roles, this is recognized within 90 days through compensation, reclassification, or redistribution." },
      { title: "The Slow Growth Mandate", desc: "Success measured by Customer Lifetime Value and quality, not volume. A customer who returns for 20 years outvalues ten acquired through discounting." },
    ],
    principle: "A brand with strong values and weak finances will eventually be forced to sell its values."
  },
  {
    num: "IV",
    tag: "Community & Legacy",
    name: "The Cultural Conduit",
    teaser: "A brand that does not invest in culture will eventually run out of cultural currency.",
    items: [
      { title: "The Craftsmanship School", desc: "Internal apprenticeship to train the next generation of artisans. A talent pipeline and a quality control mechanism in one." },
      { title: "Cultural Curation", desc: "Long-term patronage of artists, historians, and communities. Not for marketing exposure but for genuine investment in the culture that sustains the brand." },
      { title: "The Ethical Ledger", desc: "Annual public report on environmental and social impact. Creates accountability to customers, employees, and the brand itself." },
      { title: "The Customer Council", desc: "A rotating panel of long-term customers who advise on product evolution. Not a focus group. Partners." },
    ],
    principle: "Legacy is not what you leave behind. It is what you build for others to carry forward."
  },
];

const phases = [
  {
    label: "Foundation",
    timeline: "Months 1–3",
    title: "Clarity Before Systems",
    tasks: [
      "Conduct an honest role audit: document every function being performed and who is actually doing it.",
      "Write the first version of the Brand Code: the immutable statement of identity and ethics.",
      "Build the first monthly operating budget. Even a simple spreadsheet transforms clarity.",
      "Set up a project management system. All tasks live here. If it is not documented, it does not exist.",
      "Establish a weekly leadership sync with a fixed agenda.",
      "Identify every instance where one person is carrying responsibilities beyond their defined role.",
    ],
    critical: "The Brand Code must exist before anything else. Every system you build will reference it."
  },
  {
    label: "Structure",
    timeline: "Months 4–6",
    title: "Build the Load-Bearing Walls",
    tasks: [
      "Formalize job titles and written role descriptions for every person in the organization.",
      "Implement the bi-annual 360° Review Cycle starting with a calibration round for all current staff.",
      "Build the Compensation Equity Framework: create pay bands for every role.",
      "Develop the First 90 Days Onboarding Engine so new hires enter structure, not chaos.",
      "Launch the Brand Bible documentation project.",
      "Identify the Signature Products that will never be discounted: the Protected Core.",
    ],
    critical: "Structure is not bureaucracy. It is the most respectful thing you can give your team."
  },
  {
    label: "Systems",
    timeline: "Months 7–12",
    title: "Build the Operating System",
    tasks: [
      "Implement OKRs: set Company, Department, and Individual objectives for the next two quarters.",
      "Launch the DACI Decision Matrix for all high-stakes decisions.",
      "Build the Sell-Through Benchmark System into your inventory workflow.",
      "Establish the Voice of the Customer loop: first Pain Report, first NPS measurement.",
      "Document all key operational SOPs in a living Wiki.",
      "Begin systematic contributions toward a 3-month operating reserve.",
    ],
    critical: "Systems convert intention into execution. Without them, even motivated teams drift."
  },
  {
    label: "Depth",
    timeline: "Year 2",
    title: "Institutionalize the Culture",
    tasks: [
      "Launch the Cultural Recognition Protocol: tie recognition explicitly to Brand Code behavior.",
      "Begin the Customer Council: identify and invite the first cohort of long-term customers.",
      "Build the Craftsmanship School or equivalent internal training initiative.",
      "Establish the Post-Mortem process as standard practice after every major launch.",
      "Commission the first Annual Ethical Ledger report.",
      "Achieve 6-month operating reserve. Review and expand Compensation Equity.",
    ],
    critical: "Culture is what happens when no one is looking. This phase builds the infrastructure that makes it consistent."
  },
  {
    label: "Legacy",
    timeline: "Years 3–5",
    title: "Build the Institution",
    tasks: [
      "Evaluate readiness for the Stewardship Ownership Structure: Purpose Trust governance.",
      "Build the Succession Model: begin identifying and developing next-generation leadership.",
      "Launch the Dual Design Houses structure if scale supports it.",
      "Achieve 18–24 month operating reserve.",
      "Establish the Archive & Heritage Team as a formal function.",
      "Conduct the first Brand Code Audit across supply chain, product integrity, and communications.",
    ],
    critical: "At this phase, you are no longer building a brand. You are building an institution."
  },
];

const brands = [
  {
    name: "Patagonia",
    year: "est. 1973",
    origin: "Ventura, California",
    preview: "What happens when a founder loves the mission more than the company.",
    text: "Founded by Yvon Chouinard, Patagonia is perhaps the most studied example of mission-driven brand permanence. In 2022, Chouinard transferred ownership to a purpose trust and a non-profit, ensuring no future leader could sell the company or deviate from its environmental mission. He did not do this because it was profitable. He did it because the alternative was unacceptable. Patagonia's operational model mirrors every principle in this framework: low employee turnover through equitable pay, a supply chain built on certified ethical sourcing, a product line centered on permanent iconic items, and a Brand Code so clearly articulated that any employee can make a brand-aligned decision without asking permission.",
    lesson: "The depth of your structural commitment to your values is the exact depth of your brand's longevity.",
    pillars: ["The Financial Fortress", "The Enduring Core", "The Cultural Conduit"]
  },
  {
    name: "45R",
    year: "est. 1979",
    origin: "Osaka, Japan",
    preview: "What monozukuri, the art and soul of making things, looks like as an operating model.",
    text: "Founded by Yasuko and Toshikiyo Hirakawa, 45R embodies the Japanese concept of monozukuri, the art and soul of making things. Every piece is a study in material mastery: hand-dyed indigo, aged cotton, construction techniques refined over decades. What 45R demonstrates is the power of role clarity and craft ownership. Every person in the organization is a specialist who understands their function with depth. There is no task-stacking, no undefined roles. This precision is not bureaucracy; it is respect. 45R also demonstrates the value of the Slow Growth Mandate. They have intentionally limited their retail footprint, refusing to expand faster than their ability to maintain quality.",
    lesson: "Mastery of one's role is a source of pride. That is a culture, and it is built, not assumed.",
    pillars: ["The Adaptive Engine", "The Enduring Core", "The Slow Growth Mandate"]
  },
  {
    name: "Toraya",
    year: "est. c.1526",
    origin: "Kyoto, Japan",
    preview: "Five centuries of unbroken craft. What discipline actually looks like over time.",
    text: "Toraya has been operating since approximately 1526. It has served the Imperial household for nearly 500 years. It survived the Meiji Restoration, World War II, multiple economic crises, and the complete transformation of Japanese society. Toraya's longevity is built on three things: an absolute commitment to their core product that has never been diluted; a succession model that treats leadership transition as a craft unto itself; and a financial philosophy that prioritizes stability over growth. The Toraya lesson is the most important in this entire framework: longevity is not about ambition. It is about precision, consistency, and structural soundness.",
    lesson: "The brands that survive 500 years are not the ones that tried hardest to grow. They are the ones most disciplined about protecting what made them worth growing.",
    pillars: ["The Enduring Core", "The Succession Model", "The Financial Fortress"]
  },
];

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [workOpen, setWorkOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", brand: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedFounder, setSelectedFounder] = useState(null);
  const [openPillar, setOpenPillar] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [openBrand, setOpenBrand] = useState(null);
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = fonts + css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("button, a, .selector-card, .pillar-card, .brand-row, .phase-btn, .fw-btn");
    const on = () => setHovering(true);
    const off = () => setHovering(false);
    els.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  });

  const togglePillar = (i) => setOpenPillar(openPillar === i ? null : i);
  const toggleBrand = (i) => setOpenBrand(openBrand === i ? null : i);

  const phase = phases[activePhase];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Custom cursor */}
      <div id="cursor" className={hovering ? "hovering" : ""} style={{ left: cursor.x, top: cursor.y }} />

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo">100More</div>
        <div className="nav-links">
          <a href="#pillars">The Pillars</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#brands">Case Studies</a>
          <a href="#framework">Framework</a>
          <a href="#work">Work Together</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-eyebrow">A Framework for Brand Longevity</div>
        <h1 className="hero-title">
          Brands that<br />last <em>100 years</em><br />are not built<br />by accident.
        </h1>
        <p className="hero-sub">
          100More is a complete operational framework for building brand institutions,
          the kind that survive economic crises, leadership transitions, and trend cycles 
          by design, not by luck.
        </p>
        <div className="hero-rule" />
      </section>

      {/* Founder Selector */}
      <section className="selector-section">
        <div className="selector-label">Start Here</div>
        <h2 className="selector-question">Where are you in your build?</h2>
        <div className="selector-cards">
          {founders.map((f, i) => (
            <div
              key={i}
              className={`selector-card${selectedFounder === i ? " active" : ""}`}
              onClick={() => setSelectedFounder(selectedFounder === i ? null : i)}
            >
              <div className="card-num">{f.num}</div>
              <div className="card-title">{f.title}</div>
              <div className="card-desc">{f.desc}</div>
            </div>
          ))}
        </div>
        {selectedFounder !== null && (
          <div className="selector-result">
            <div className="selector-result-label">Your entry point</div>
            <div className="selector-result-text">{founderResults[selectedFounder]}</div>
          </div>
        )}
      </section>

      {/* Pillars */}
      <section className="section" id="pillars">
        <div className="section-eyebrow">The Framework</div>
        <h2 className="section-title">Four Pillars of<br />Brand Stewardship</h2>
        <p className="section-sub">
          Every brand that has outlasted its founder rests on these four structural commitments. 
          Click into each pillar to see the full system.
        </p>
        <div className="pillars-grid">
          {pillars.map((p, i) => (
            <div
              key={i}
              className={`pillar-card${openPillar === i ? " open" : ""}`}
              onClick={() => togglePillar(i)}
            >
              <div className="pillar-header">
                <div className="pillar-num">{p.num}</div>
                <div className="pillar-info">
                  <div className="pillar-tag">{p.tag}</div>
                  <div className="pillar-name">{p.name}</div>
                  <div className="pillar-teaser">{p.teaser}</div>
                </div>
                <div className="pillar-toggle">{openPillar === i ? "−" : "+"}</div>
              </div>
              {openPillar === i && (
                <div className="pillar-body">
                  <div className="pillar-body-col">
                    <h4>The Components</h4>
                    {p.items.map((item, j) => (
                      <div className="pillar-item" key={j}>
                        <div className="pillar-item-title">{item.title}</div>
                        <div className="pillar-item-desc">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pillar-body-col">
                    <h4>The Principle</h4>
                    <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontStyle: "italic", lineHeight: 1.5, color: "var(--text)", marginBottom: 32 }}>
                      "{p.principle}"
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <div className="quote-block">
        <div className="quote-rule" />
        <div>
          <div className="quote-text">
            A brand is not what you make. It is what you build around what you make.
          </div>
          <div className="quote-attr">100More Framework</div>
        </div>
      </div>

      {/* Roadmap */}
      <section className="section" id="roadmap">
        <div className="section-eyebrow">The Execution Plan</div>
        <h2 className="section-title">Five Phases.<br />One Institution.</h2>
        <p className="section-sub">
          Move through each phase in sequence. Each one builds the foundation for the next. 
          Select a phase to see what it requires.
        </p>
        <div className="roadmap-track">
          {phases.map((p, i) => (
            <button
              key={i}
              className={`phase-btn${activePhase === i ? " active" : ""}`}
              onClick={() => setActivePhase(i)}
            >
              Phase {i + 1}
              <span className="phase-label">{p.label}</span>
            </button>
          ))}
        </div>
        <div className="roadmap-content">
          <div className="roadmap-content-header">
            <div className="roadmap-phase-title">{phase.title}</div>
            <div className="roadmap-timeline">{phase.timeline}</div>
          </div>
          <div className="roadmap-tasks">
            {phase.tasks.map((t, i) => (
              <div className="roadmap-task" key={i}>
                <div className="task-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="task-text">{t}</div>
              </div>
            ))}
          </div>
          <div className="roadmap-critical">
            <div className="critical-label">Critical Insight</div>
            <div className="critical-text">{phase.critical}</div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section" id="brands">
        <div className="section-eyebrow">Proof of Concept</div>
        <h2 className="section-title">The Brands<br />This Is Built From</h2>
        <p className="section-sub">
          Three brands from three eras. Each one embodies a different dimension of this framework. 
          Click to see what they actually did.
        </p>
        <div className="brands-list">
          {brands.map((b, i) => (
            <div
              key={i}
              className={`brand-row${openBrand === i ? " open" : ""}`}
              onClick={() => toggleBrand(i)}
            >
              <div className="brand-row-header">
                <div className="brand-row-left">
                  <div className="brand-year">{b.year}</div>
                  <div>
                    <div className="brand-name">{b.name}</div>
                    <div className="brand-origin">{b.origin}</div>
                  </div>
                </div>
                <div className="brand-lesson-preview">{b.preview}</div>
                <div className="brand-expand">+</div>
              </div>
              {openBrand === i && (
                <div className="brand-body">
                  <div>
                    <div className="brand-body-text">{b.text}</div>
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--goldL)", marginBottom: 10 }}>The Lesson</div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontStyle: "italic", lineHeight: 1.6, color: "var(--text)" }}>"{b.lesson}"</div>
                    </div>
                  </div>
                  <div className="brand-pillars">
                    <h4>Pillars Embodied</h4>
                    {b.pillars.map((tag, j) => (
                      <span key={j} className="brand-pillar-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Framework Access */}
      <section className="framework-section" id="framework">
        <div className="section-eyebrow">The Full System</div>
        <h2 className="section-title">Take the<br />Framework With You</h2>
        <p className="section-sub">
          The complete 100More framework is available in full. Built to be read, shared, 
          translated, and executed by any founder, in any language.
        </p>
        <div className="framework-grid">
          <div className="framework-card primary">
            <div className="fw-icon">◈</div>
            <div className="fw-title">The Brand Strategy Compendium</div>
            <div className="fw-desc">The complete philosophical and operational framework. The Founder's Covenant, all four Pillars, organizational hierarchy, financial architecture, and the full execution roadmap.</div>
            <a href="#" className="fw-btn">Download the Compendium →</a>
          </div>
          <div className="framework-card">
            <div className="fw-icon">◇</div>
            <div className="fw-title">The Brand Health Dashboard</div>
            <div className="fw-desc">The metrics that tell you if your brand is structurally sound. Brand identity, operational health, people and culture, and financial benchmarks with real targets.</div>
            <a href="#" className="fw-btn">View the Dashboard →</a>
          </div>
          <div className="framework-card">
            <div className="fw-icon">○</div>
            <div className="fw-title">The Founder's Covenant</div>
            <div className="fw-desc">Five personal commitments every founder must make before any system can work. The most important section in the framework, and the most honest.</div>
            <a href="#" className="fw-btn">Read the Covenant →</a>
          </div>
          <div className={`framework-card${workOpen ? " primary" : ""}`} style={{ gridColumn: workOpen ? "span 2" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <div className="fw-icon">△</div>
                <div className="fw-title">Work With 100More</div>
                <div className="fw-desc">The framework exists. The execution is where most brands need support. Connect to bring this system into your organization with direct guidance.</div>
              </div>
            </div>
            <button className="fw-btn" onClick={() => setWorkOpen(!workOpen)}>
              {workOpen ? "Close ↑" : "Get in Touch ↓"}
            </button>
            {workOpen && (
              <div style={{ marginTop: 36, paddingTop: 36, borderTop: "1px solid var(--border)", animation: "fadeIn 0.35s ease" }} onClick={e => e.stopPropagation()}>
                <div className="services-grid" style={{ marginBottom: 36 }}>
                  {[
                    { num: "01", name: "Brand Health Assessment", desc: "A guided, in-depth version of the dashboard assessment. You receive a personalized written readout across all four pillars with prioritized recommendations specific to your brand's stage and structure." },
                    { num: "02", name: "Brand Audit", desc: "A structured review of your brand's identity, operations, people, and financial health. Delivered as a comprehensive report with clear findings and an actionable next-step plan." },
                    { num: "03", name: "Framework Implementation", desc: "Hands-on build-out of the 100More system inside your organization, phase by phase. From Brand Code to operational SOPs to compensation equity, we build it together." },
                    { num: "04", name: "Consulting Retainer", desc: "An ongoing strategic partnership for brands actively building toward longevity. Monthly touchpoints, real-time guidance, and a long-term commitment to the work." },
                  ].map((s, i) => (
                    <div className="service-card" key={i}>
                      <div className="service-num">{s.num}</div>
                      <div className="service-name">{s.name}</div>
                      <div className="service-desc">{s.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="contact-form">
                  {!submitted ? (
                    <>
                      <div className="form-title">Get in Touch</div>
                      <div className="form-sub">Tell us about your brand and what you are trying to build. We will follow up within two business days.</div>
                      <div className="form-grid">
                        <div className="form-field">
                          <label className="form-label">Your Name</label>
                          <input className="form-input" placeholder="Full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Brand Name</label>
                          <input className="form-input" placeholder="Your brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Email</label>
                          <input className="form-input" type="email" placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="form-field">
                          <label className="form-label">I am interested in</label>
                          <select className="form-select" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                            <option value="">Select a service</option>
                            <option value="assessment">Brand Health Assessment</option>
                            <option value="audit">Brand Audit</option>
                            <option value="implementation">Framework Implementation</option>
                            <option value="retainer">Consulting Retainer</option>
                            <option value="unsure">Not sure yet</option>
                          </select>
                        </div>
                        <div className="form-field full">
                          <label className="form-label">Tell us about your brand</label>
                          <textarea className="form-textarea" placeholder="Where are you in the build? What are you trying to solve?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                        </div>
                      </div>
                      <button className="form-submit" onClick={() => { if (formData.name && formData.email) setSubmitted(true); }} disabled={!formData.name || !formData.email}>
                        Send →
                      </button>
                    </>
                  ) : (
                    <div className="form-submitted">
                      <div className="form-submitted-mark">◈</div>
                      <div className="form-submitted-title">Message received.</div>
                      <div className="form-submitted-sub">
                        Thank you{formData.brand ? `, ${formData.brand}` : ""}. We will be in touch within two business days to talk about what you are building.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">100More</div>
        <div className="footer-note">A Framework for Brand Longevity · Built by JohnnyLeeXYZ</div>
      </footer>
    </div>
  );
}
