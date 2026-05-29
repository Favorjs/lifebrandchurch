import { useState, useEffect, useRef } from "react";
import { HashRouter as Router, useNavigate, useLocation } from "react-router-dom";
import AppRouter from "./AppRouter.jsx";

// ─── Data ───────────────────────────────────────────────────────────────────









const SERVICES = [
  { day: "Sunday", time: "8:00 AM",   name: "First Service",       desc: "Traditional morning worship — hymns, prayer and the preaching of God's Word." },
  { day: "Sunday", time: "10:30 AM",  name: "Second Service",      desc: "Contemporary praise and worship with live music, powerful ministry and fellowship." },
  { day: "Wednesday", time: "6:30 PM",name: "Midweek Bible Study", desc: "Deep scripture study, intercession and community prayer for every believer." },
];

const EVENTS = [
  { month: "JUN", day: "01", title: "Sunday Worship Service",   desc: "Join us for powerful praise, worship and the preaching of God's Word." },
  { month: "JUN", day: "14", title: "Youth Prayer Rally",       desc: "A special prayer and revival meeting for teens and young adults aged 13–25." },
  { month: "JUN", day: "22", title: "Community Outreach Day",   desc: "Serving our Ogba-Ikeja community with love, food and practical care." },
  { month: "JUL", day: "06", title: "Choir & Arts Festival",    desc: "Celebrating God through music, dance and creative arts ministry." },
];

const MINISTRIES = [
  {
    title: "Glorify God",
    desc: "Everything we do — worship, work, and witness — is to bring honour and glory to God in all things.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: "Believe the Bible",
    desc: "We stand on the authority of Scripture as the inspired and infallible Word of God — our guide for life.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    title: "Love the Community",
    desc: "Serving Ogba, Ikeja and beyond through outreach, care, and practical acts of compassion.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    title: "Love People",
    desc: "Every person matters. We welcome all into a family where they are known, loved, and valued.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

const STATS = [
  { value: 20,  suffix: "+", label: "Years of Ministry" },
  { value: 500, suffix: "+", label: "Church Members" },
  { value: 12,  suffix: "",  label: "Active Ministries" },
  { value: 100, suffix: "+", label: "Volunteers" },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export function useCounter(target, active, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

// ─── Shared Components ───────────────────────────────────────────────────────

export function FadeIn({ children, delay = 0, className = "", slideUp = true }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : slideUp ? "translateY(36px)" : "translateY(0)",
        transition: `opacity 0.85s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.85s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export function StatCounter({ value, suffix, label }) {
  const [ref, visible] = useInView(0.3);
  const count = useCounter(value, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(2.4rem, 4vw, 3.6rem)", fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 8 }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(91,163,222,0.85)" }}>
        {label}
      </div>
    </div>
  );
}

export function PageHero({ image, title, subtitle, breadcrumb }) {
  const ref = useRef(null);
  const [torch, setTorch] = useState({ x: 50, y: 50 });
  const [on, setOn] = useState(false);
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTorch({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{ position: "relative", minHeight: 380, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", overflow: "hidden", background: "var(--charcoal)" }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${image}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.28 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.6))" }} />
      <TorchOverlay x={torch.x} y={torch.y} on={on} />
      <div style={{ position: "relative", zIndex: 2, padding: "120px 24px 60px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-light)" }}>{breadcrumb}</span>
        </div>
        <h1 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 200, color: "var(--white)", marginBottom: 12 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Shared torch overlay (used by DarkSection + PageHero + hero) ──
function TorchOverlay({ x, y, on }) {
  return (
    <>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        opacity: on ? 1 : 0,
        transition: on ? "opacity 0.15s" : "opacity 1.4s",
        animation: on ? "torch-flicker 2.8s ease-in-out infinite" : "none",
        background: on
          ? `radial-gradient(circle 170px at ${x}% ${y}%, rgba(255,240,180,0.22) 0%, rgba(255,150,50,0.14) 28%, rgba(229,69,43,0.1) 52%, transparent 72%),
             radial-gradient(circle 440px at ${x}% ${y}%, rgba(229,69,43,0.07) 0%, rgba(0,70,140,0.03) 55%, transparent 82%)`
          : "transparent",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        opacity: on ? 1 : 0,
        transition: on ? "opacity 0.25s" : "opacity 1.6s",
        background: on
          ? `radial-gradient(circle 400px at ${x}% ${y}%, transparent 0%, rgba(4,8,18,0.2) 60%, rgba(4,8,18,0.45) 100%)`
          : "transparent",
      }} />
    </>
  );
}

// ── DarkSection — drop-in replacement for <section> on dark backgrounds ──
export function DarkSection({ children, id, style, as: Tag = "section" }) {
  const ref = useRef(null);
  const [torch, setTorch] = useState({ x: 50, y: 50 });
  const [on, setOn] = useState(false);
  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTorch({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <Tag
      ref={ref}
      id={id}
      onMouseMove={onMove}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <TorchOverlay x={torch.x} y={torch.y} on={on} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </Tag>
  );
}

// ─── Global CSS ──────────────────────────────────────────────────────────────

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200;0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,300;1,8..60,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; font-size: 16px; }
  body { overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  :root {
    --gold:        #0066cc;
    --gold-dark:   #00468c;
    --gold-light:  #5ba3de;
    --red:         #e5452b;
    --red-light:   #ff6b4a;
    --cream:       #f4f8fd;
    --cream-dim:   #e8f0f8;
    --stone:       #c8d8ec;
    --charcoal:    #0a1628;
    --charcoal-2:  #0d1e36;
    --sage:        #4a72a0;
    --text:        #1a2d4a;
    --text-muted:  #5a7a9e;
    --white:       #ffffff;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 3px; }

  .nav-link {
    font-family: 'DM Sans', sans-serif; font-size: 0.76rem; font-weight: 500;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-muted);
    background: none; border: none; cursor: pointer; padding: 4px 0;
    position: relative; transition: color 0.3s;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1.5px;
    background: var(--red); transition: width 0.3s cubic-bezier(.22,1,.36,1);
  }
  .nav-link:hover, .nav-link.active { color: var(--text); }
  .nav-link:hover::after, .nav-link.active::after { width: 100%; }

  .btn-primary {
    font-family: 'DM Sans', sans-serif; font-size: 0.76rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; background: var(--gold-dark);
    color: var(--white); border: none; padding: 14px 32px; cursor: pointer;
    border-radius: 2px; transition: all 0.35s cubic-bezier(.22,1,.36,1);
    position: relative; overflow: hidden;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,70,140,0.38); background: var(--gold); }

  .btn-red {
    font-family: 'DM Sans', sans-serif; font-size: 0.76rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; background: var(--red);
    color: var(--white); border: none; padding: 14px 32px; cursor: pointer;
    border-radius: 2px; transition: all 0.35s cubic-bezier(.22,1,.36,1);
  }
  .btn-red:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(229,69,43,0.38); background: var(--red-light); }

  .btn-ghost {
    font-family: 'DM Sans', sans-serif; font-size: 0.76rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; background: transparent;
    color: var(--white); border: 1px solid rgba(255,255,255,0.35); padding: 14px 32px;
    cursor: pointer; border-radius: 2px; transition: all 0.35s cubic-bezier(.22,1,.36,1);
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); transform: translateY(-2px); }

  .btn-outline {
    font-family: 'DM Sans', sans-serif; font-size: 0.76rem; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase; background: transparent;
    color: var(--gold-dark); border: 1.5px solid var(--gold-dark); padding: 12px 28px;
    cursor: pointer; border-radius: 2px; transition: all 0.35s cubic-bezier(.22,1,.36,1);
  }
  .btn-outline:hover { background: var(--gold-dark); color: var(--white); transform: translateY(-2px); }

  .label {
    font-family: 'DM Sans', sans-serif; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase; color: var(--red);
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .label::before { content: ''; display: inline-block; width: 22px; height: 1.5px; background: var(--red); }

  .label-blue {
    font-family: 'DM Sans', sans-serif; font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.24em; text-transform: uppercase; color: var(--gold-light);
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .label-blue::before { content: ''; display: inline-block; width: 22px; height: 1.5px; background: var(--gold); }

  .section-title {
    font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(1.9rem, 4vw, 3rem);
    font-weight: 300; line-height: 1.15; color: var(--charcoal);
  }
  .section-title-light {
    font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(1.9rem, 4vw, 3rem);
    font-weight: 300; line-height: 1.15; color: var(--white);
  }

  /* ── Hero ── */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    text-align: center; overflow: hidden; background: var(--charcoal);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(0,102,204,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,204,0.05) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  .hero-glow { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }

  @keyframes float-slow { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6} 50%{transform:translate(-50%,-50%) scale(1.2);opacity:.25} }
  @keyframes float-slower { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.3} 50%{transform:translate(-50%,-50%) scale(1.3);opacity:.12} }
  @keyframes hero-drift { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
  @keyframes spin-slow { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes fade-up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .hero-ring { position:absolute; top:50%; left:50%; border-radius:50%; border:1px solid rgba(0,102,204,0.1); pointer-events:none; }
  .hero-ring-1 { width:320px;height:320px;animation:float-slow 8s ease-in-out infinite; }
  .hero-ring-2 { width:520px;height:520px;animation:float-slower 10s ease-in-out infinite 1.5s; }
  .hero-ring-3 { width:720px;height:720px;border-color:rgba(0,102,204,0.05);animation:spin-slow 40s linear infinite; }
  .hero-cross-v { position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1px;height:60vh;background:linear-gradient(to bottom,transparent,rgba(0,102,204,0.25),rgba(229,69,43,0.2),transparent);pointer-events:none; }
  .hero-cross-h { position:absolute;top:38%;left:50%;transform:translate(-50%,-50%);height:1px;width:50vw;background:linear-gradient(to right,transparent,rgba(0,102,204,0.2),transparent);pointer-events:none; }

  /* ── Cards ── */
  .glass-card {
    background:rgba(255,255,255,0.04); border:1px solid rgba(0,102,204,0.18); border-radius:4px;
    backdrop-filter:blur(12px); transition:all 0.4s cubic-bezier(.22,1,.36,1); position:relative; overflow:hidden;
  }
  .glass-card::before { content:''; position:absolute; top:0;left:0;right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,102,204,0.6),transparent); opacity:0; transition:opacity 0.4s; }
  .glass-card:hover { background:rgba(255,255,255,0.07); border-color:rgba(0,102,204,0.38); transform:translateY(-4px); }
  .glass-card:hover::before { opacity:1; }

  .ministry-card { padding:40px 32px; background:var(--white); border:1px solid var(--stone); border-radius:4px; transition:all 0.45s cubic-bezier(.22,1,.36,1); position:relative; overflow:hidden; cursor:default; }
  .ministry-card-accent { position:absolute; bottom:0;left:0;right:0; height:3px; background:linear-gradient(90deg,var(--red),var(--gold-dark)); transform:scaleX(0); transform-origin:left; transition:transform 0.45s cubic-bezier(.22,1,.36,1); }
  .ministry-card:hover { transform:translateY(-8px); box-shadow:0 20px 56px rgba(10,22,40,0.1); }
  .ministry-card:hover .ministry-card-accent { transform:scaleX(1); }

  /* ── Sermon & Blog cards ── */
  .sermon-card { background:var(--white); border:1px solid var(--stone); border-radius:4px; overflow:hidden; transition:all 0.4s cubic-bezier(.22,1,.36,1); cursor:pointer; }
  .sermon-card:hover { transform:translateY(-6px); box-shadow:0 18px 48px rgba(10,22,40,0.1); }
  .blog-card { background:var(--white); border:1px solid var(--stone); border-radius:4px; overflow:hidden; transition:all 0.4s cubic-bezier(.22,1,.36,1); }
  .blog-card:hover { transform:translateY(-4px); box-shadow:0 14px 40px rgba(10,22,40,0.08); }
  .blog-card img { width:100%; height:200px; object-fit:cover; transition:transform 0.5s cubic-bezier(.22,1,.36,1); }
  .blog-card:hover img { transform:scale(1.04); }

  /* ── Tag ── */
  .tag {
    font-family:'DM Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.16em;
    text-transform:uppercase; padding:4px 10px; border-radius:2px;
    background:rgba(0,70,140,0.08); color:var(--gold-dark); display:inline-block;
  }
  .tag-red { background:rgba(229,69,43,0.08); color:var(--red); }

  /* ── Gallery ── */
  .gallery-item { overflow:hidden; border-radius:4px; position:relative; cursor:pointer; }
  .gallery-item img { width:100%; aspect-ratio:4/3; object-fit:cover; transition:transform 0.5s cubic-bezier(.22,1,.36,1),filter 0.5s; filter:brightness(0.9); display:block; }
  .gallery-item:hover img { transform:scale(1.07); filter:brightness(1.05); }
  .gallery-item-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,70,140,0.6) 0%,transparent 50%); opacity:0; transition:opacity 0.4s; display:flex; align-items:flex-end; padding:16px; }
  .gallery-item:hover .gallery-item-overlay { opacity:1; }
  .filter-btn { font-family:'DM Sans',sans-serif; font-size:0.72rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; background:transparent; border:1.5px solid var(--stone); color:var(--text-muted); padding:8px 18px; cursor:pointer; border-radius:2px; transition:all 0.3s; }
  .filter-btn:hover, .filter-btn.active { background:var(--gold-dark); color:var(--white); border-color:var(--gold-dark); }
  .filter-btn.active { background:var(--red); border-color:var(--red); }

  /* ── Form ── */
  .form-field { display:flex; flex-direction:column; gap:8px; }
  .form-label { font-family:'DM Sans',sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(250,248,244,0.5); }
  .form-input { font-family:'DM Sans',sans-serif; font-size:0.93rem; background:rgba(255,255,255,0.04); border:1px solid rgba(0,102,204,0.18); border-radius:2px; padding:13px 16px; color:var(--cream); outline:none; transition:border-color 0.3s,background 0.3s; width:100%; }
  .form-input::placeholder { color:rgba(250,248,244,0.22); }
  .form-input:focus { border-color:rgba(229,69,43,0.5); background:rgba(255,255,255,0.06); }
  textarea.form-input { resize:vertical; min-height:120px; }

  /* ── Mobile menu ── */
  .mobile-menu-overlay { position:fixed; inset:0; background:rgba(10,22,40,0.65); backdrop-filter:blur(4px); z-index:90; }
  .mobile-menu-panel { position:fixed; top:0;right:0; width:min(320px,90vw); height:100vh; background:var(--charcoal-2); border-left:1px solid rgba(0,102,204,0.15); z-index:95; display:flex; flex-direction:column; padding:32px; animation:slide-in 0.35s cubic-bezier(.22,1,.36,1); }
  @keyframes slide-in { from{transform:translateX(100%)} to{transform:translateX(0)} }

  /* ── Event row ── */
  .event-item { display:grid; grid-template-columns:72px 1fr; gap:24px; align-items:start; padding:24px 0; border-bottom:1px solid var(--stone); transition:all 0.3s; }
  .event-item:last-child { border-bottom:none; }
  .event-item:hover { padding-left:10px; }

  /* ── Social icons ── */
  .social-icon { width:38px;height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.05); transition:all 0.3s; cursor:pointer; text-decoration:none; }
  .social-icon:hover { background:var(--red); border-color:var(--red); transform:translateY(-3px); }

  /* ── Lightbox ── */
  .lightbox-overlay { position:fixed; inset:0; background:rgba(5,10,20,0.95); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; animation:fade-up 0.2s ease; }
  .lightbox-img { max-width:90vw; max-height:85vh; object-fit:contain; border-radius:4px; }
  .lightbox-close { position:absolute; top:20px;right:28px; background:none; border:none; color:var(--white); font-size:2rem; cursor:pointer; opacity:0.7; transition:opacity 0.3s; }
  .lightbox-close:hover { opacity:1; }
  .lightbox-nav { position:absolute; top:50%; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:50%; width:44px;height:44px; display:flex;align-items:center;justify-content:center; cursor:pointer; transition:all 0.3s; color:var(--white); }
  .lightbox-nav:hover { background:var(--red); border-color:var(--red); }
  .lightbox-prev { left:16px; transform:translateY(-50%); }
  .lightbox-next { right:16px; transform:translateY(-50%); }

  /* ── Team card ── */
  .team-card { border-radius:4px; overflow:hidden; background:var(--white); border:1px solid var(--stone); transition:all 0.4s cubic-bezier(.22,1,.36,1); }
  .team-card:hover { transform:translateY(-6px); box-shadow:0 18px 48px rgba(10,22,40,0.1); }
  .team-card img { width:100%; height:260px; object-fit:cover; transition:transform 0.5s; }
  .team-card:hover img { transform:scale(1.04); }

  /* ── Video player ── */
  .video-container { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:4px; }
  .video-container iframe { position:absolute; top:0;left:0; width:100%;height:100%; }
  .video-thumbnail { position:relative; cursor:pointer; border-radius:4px; overflow:hidden; }
  .video-thumbnail img { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; }
  .play-btn { position:absolute; top:50%;left:50%;transform:translate(-50%,-50%); width:64px;height:64px; background:var(--red); border-radius:50%; display:flex;align-items:center;justify-content:center; transition:all 0.3s; box-shadow:0 0 0 12px rgba(229,69,43,0.2); }
  .video-thumbnail:hover .play-btn { transform:translate(-50%,-50%) scale(1.12); box-shadow:0 0 0 18px rgba(229,69,43,0.15); }

  /* ── Torch light effect ── */
  @keyframes torch-flicker {
    0%,100% { opacity:1; transform:scale(1); }
    20%     { opacity:0.94; transform:scale(0.992); }
    40%     { opacity:1;    transform:scale(1.004); }
    60%     { opacity:0.97; transform:scale(0.997); }
    80%     { opacity:1;    transform:scale(1.002); }
  }
  @keyframes badge-pulse {
    0%,100% { box-shadow:0 0 0 0 rgba(229,69,43,0); }
    50%     { box-shadow:0 0 24px 8px rgba(229,69,43,0.35); }
  }
  .torch-light {
    pointer-events: none;
    position: absolute; inset: 0; z-index: 6;
    transition: opacity 0.25s ease;
  }
  .torch-light.active { animation: torch-flicker 2.8s ease-in-out infinite; }
  .giving-light-badge { transition: box-shadow 0.4s, border-color 0.4s !important; }
  .giving-light-badge.torch-near { animation: badge-pulse 1.8s ease-in-out infinite; border-color: rgba(229,69,43,0.7) !important; }

  /* ── Responsive ── */
  @media (max-width:768px) {
    .desktop-nav { display:none !important; }
    .mobile-toggle { display:flex !important; }
    .main-nav { padding-left:20px !important; padding-right:20px !important; }
    .stats-grid { grid-template-columns:1fr 1fr !important; gap:36px !important; }
    .about-grid { grid-template-columns:1fr !important; }
    .gallery-grid-3 { grid-template-columns:1fr 1fr !important; }
    .gallery-grid-4 { grid-template-columns:1fr 1fr !important; }
    .footer-grid { grid-template-columns:1fr !important; }
    .sermons-grid { grid-template-columns:1fr !important; }
    .blog-grid { grid-template-columns:1fr !important; }
  }
  @media (min-width:769px) { .mobile-toggle { display:none !important; } }
`;

// ─── Nav ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = ["Home", "About", "Gallery", "Sermons", "Events", "Contact"];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (item) => {
    setMenuOpen(false);
    if (item === "Home") {
      navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "About") {
      navigate("/about"); window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "Gallery") {
      navigate("/gallery"); window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "Sermons") {
      navigate("/sermons"); window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "Events") {
      navigate("/events"); window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item === "Contact") {
      navigate("/contact"); window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isActive = (item) => {
    if (item === "Home") return location.pathname === "/";
    if (item === "About") return location.pathname === "/about";
    if (item === "Gallery") return location.pathname === "/gallery";
    if (item === "Sermons") return location.pathname === "/sermons";
    if (item === "Events")  return location.pathname === "/events";
    if (item === "Contact") return location.pathname === "/contact";
    return false;
  };

  const isHome = location.pathname === "/";

  return (
    <>
      <nav
        className="main-nav"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 80,
          padding: scrolled ? "10px 48px" : "22px 48px",
          background: scrolled ? "rgba(244,248,253,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,70,140,0.1)" : "none",
          transition: "all 0.45s cubic-bezier(.22,1,.36,1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <button onClick={() => handleNav("Home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
          <img
            src="/images/header/logo.png"
            alt="Life Brand Church"
            style={{ height: 40, objectFit: "contain" }}
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
          />
          <span style={{ display: "none", fontFamily: "'Source Serif 4', serif", fontSize: "1.1rem", fontWeight: 600, color: scrolled ? "var(--charcoal)" : "var(--white)" }}>
            Life Brand<span style={{ fontWeight: 300, color: "var(--gold-light)" }}> Church</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={`nav-link${isActive(item) ? " active" : ""}`}
              style={{ color: (scrolled || !isHome) ? undefined : "rgba(255,255,255,0.65)" }}
              onClick={() => handleNav(item)}
            >
              {item}
            </button>
          ))}
          <button className="btn-red" onClick={() => handleNav("Contact")} style={{ padding: "10px 22px", fontSize: "0.72rem" }}>
            Visit Us
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "none", border: "none", cursor: "pointer",
            width: 44, height: 44, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 6, zIndex: 96,
            flexShrink: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "block",
              width: i === 1 ? (menuOpen ? 0 : 20) : 26,
              height: 2,
              borderRadius: 2,
              background: scrolled ? "var(--charcoal)" : "var(--white)",
              transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
              transformOrigin: "center",
              transform: menuOpen
                ? i === 0 ? "translateY(8px) rotate(45deg)"
                : i === 2 ? "translateY(-8px) rotate(-45deg)"
                : "scaleX(0)"
                : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <>
          <div
            className="mobile-menu-overlay"
            onClick={() => setMenuOpen(false)}
          />
          <div className="mobile-menu-panel">
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
              <img
                src="/images/header/logo.png"
                alt="Life Brand Church"
                style={{ height: 36, objectFit: "contain" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <button
                onClick={() => setMenuOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "1.5rem", lineHeight: 1, padding: 4 }}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {NAV_ITEMS.map((item, i) => (
                <button
                  key={item}
                  onClick={() => handleNav(item)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", padding: "16px 0",
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: "1.45rem", fontWeight: 300,
                    color: isActive(item) ? "var(--red-light)" : "rgba(250,248,244,0.8)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    transition: "color 0.25s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--white)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive(item) ? "var(--red-light)" : "rgba(250,248,244,0.8)"; }}
                >
                  {isActive(item) && (
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
                  )}
                  {item}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <button
              className="btn-red"
              onClick={() => handleNav("Contact")}
              style={{ width: "100%", marginTop: 32, padding: "15px" }}
            >
              Visit Us
            </button>

            {/* Tagline */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 20 }}>
              Giving Light
            </p>
          </div>
        </>
      )}
    </>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    name: "Facebook", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  },
  {
    name: "Twitter", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  },
  {
    name: "Instagram", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  },
  {
    name: "YouTube", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
  },
  {
    name: "WhatsApp", href: "#",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
  },
];

function Footer({ onNav }) {
  return (
    <DarkSection as="footer" style={{ background: "var(--charcoal)", color: "var(--cream)" }}>
      {/* Google Maps */}
      <div style={{ width: "100%", height: 300, background: "var(--charcoal-2)" }}>
        <iframe
          src="https://maps.google.com/maps?q=Ogba+Ikeja+Lagos+Nigeria&output=embed&hl=en"
          width="100%" height="300"
          style={{ border: 0, display: "block" }}
          allowFullScreen loading="lazy"
          title="Life Brand Church – Ogba, Ikeja, Lagos"
        />
      </div>

      {/* Main footer content */}
      <div style={{ padding: "72px 48px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
          {/* Brand col */}
          <div>
            <img src="/images/header/logo.png" alt="Life Brand Church" style={{ height: 50, objectFit: "contain", marginBottom: 20 }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.3rem", fontWeight: 600, color: "var(--white)", marginBottom: 20, display: "block" }}>
              Life Brand<span style={{ fontWeight: 300, color: "var(--gold-light)" }}> Church</span>
            </span>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(255,255,255,0.45)", marginBottom: 28, maxWidth: 260 }}>
              Giving light to Ogba, Ikeja and beyond — a community rooted in faith, love and the Word of God.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.name} href={s.href} className="social-icon" title={s.name} aria-label={s.name} style={{ color: "rgba(255,255,255,0.7)" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 20 }}>
              Quick Links
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Home", "About", "Gallery", "Sermons", "Events", "Contact"].map((item) => (
                <button key={item} onClick={() => onNav(item)} style={{
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.45)", transition: "color 0.3s", padding: 0,
                }}
                  onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.45)")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Service Times */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 20 }}>
              Service Times
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { day: "Sunday", time: "8:00 AM & 10:30 AM" },
                { day: "Wednesday", time: "6:30 PM" },
              ].map((s) => (
                <div key={s.day}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>{s.day}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--red-light)" }}>{s.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 20 }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📍", val: "No 34, Ijaiye Road, Carterpillar Bus Stop, Ogba, Ikeja, Lagos, Nigeria" },
                { icon: "📞", val: "+61 3 8376 6284" },
                { icon: "✉️", val: "godlove@lifebrandchurch.com" },
              ].map((c) => (
                <div key={c.icon} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
                  <span style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{c.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(0,102,204,0.12)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.22)" }}>
            © 2026 Life Brand Church — Giving Light. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms", "Copyright Policy"].map((t) => (
              <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", cursor: "pointer" }}
                onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.2)")}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DarkSection>
  );
}

// ─── HomePage ────────────────────────────────────────────────────────────────

export function HomePage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const location = useLocation();
  const navigate = useNavigate();

  // ── Torch light effect state ──
  const heroRef = useRef(null);
  const [torch, setTorch] = useState({ x: 50, y: 50 });
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document.getElementById(location.state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }, [location.state]);

  const onHeroMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTorch({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Is the torch cursor near the "Giving Light" badge? (top-centre of hero)
  const badgeNear = torchOn && torch.y < 40 && Math.abs(torch.x - 50) < 22;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We'll be in touch soon. God bless you.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="hero"
        id="home"
        onMouseMove={onHeroMouseMove}
        onMouseEnter={() => setTorchOn(true)}
        onMouseLeave={() => setTorchOn(false)}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/header/slider_img.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.22 }} />
        <div className="hero-grid" />
        <div className="hero-glow" style={{ width: 600, height: 600, top: "30%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(0,102,204,0.14) 0%, transparent 70%)" }} />
        <div className="hero-glow" style={{ width: 300, height: 300, top: "65%", left: "15%", background: "radial-gradient(circle, rgba(229,69,43,0.08) 0%, transparent 70%)" }} />
        <div className="hero-ring hero-ring-1" /><div className="hero-ring hero-ring-2" /><div className="hero-ring hero-ring-3" />
        <div className="hero-cross-v" /><div className="hero-cross-h" />
        {[{size:4,top:"20%",left:"15%",delay:"0s"},{size:3,top:"35%",left:"82%",delay:"1.5s"},{size:5,top:"70%",left:"10%",delay:"2.5s"},{size:3,top:"65%",left:"88%",delay:"0.8s"},{size:4,top:"85%",left:"55%",delay:"3s"}].map((p,i)=>(
          <div key={i} style={{ position:"absolute",top:p.top,left:p.left,width:p.size,height:p.size,borderRadius:"50%",background:"rgba(229,69,43,0.4)",animation:`hero-drift ${6+i}s ease-in-out infinite`,animationDelay:p.delay,pointerEvents:"none" }} />
        ))}

        {/* ── TORCH LIGHT ── warm radial glow follows cursor */}
        <div
          className={`torch-light${torchOn ? " active" : ""}`}
          style={{
            opacity: torchOn ? 1 : 0,
            background: torchOn
              ? `
                radial-gradient(circle 180px at ${torch.x}% ${torch.y}%,
                  rgba(255,240,180,0.28) 0%,
                  rgba(255,160,60,0.18) 28%,
                  rgba(229,69,43,0.12) 52%,
                  transparent 72%
                ),
                radial-gradient(circle 480px at ${torch.x}% ${torch.y}%,
                  rgba(229,69,43,0.07) 0%,
                  rgba(0,70,140,0.04) 55%,
                  transparent 80%
                )
              `
              : "transparent",
          }}
        />
        {/* Subtle vignette that torch cuts through */}
        <div
          style={{
            pointerEvents: "none", position: "absolute", inset: 0, zIndex: 6,
            opacity: torchOn ? 1 : 0,
            transition: torchOn ? "opacity 0.3s" : "opacity 1.2s",
            background: torchOn
              ? `radial-gradient(circle 420px at ${torch.x}% ${torch.y}%, transparent 0%, rgba(4,8,18,0.22) 65%, rgba(4,8,18,0.48) 100%)`
              : "transparent",
          }}
        />

        <div style={{ position: "relative", zIndex: 7, maxWidth: 740, padding: "0 24px" }}>
          {/* "Giving Light" badge — glows when torch is nearby */}
          <div
            className={`giving-light-badge${badgeNear ? " torch-near" : ""}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "8px 20px",
              border: "1px solid rgba(229,69,43,0.35)",
              borderRadius: "100px",
              background: "rgba(229,69,43,0.1)",
              backdropFilter: "blur(8px)",
              marginBottom: 34,
              animation: "fade-up 0.8s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "var(--red)",
              boxShadow: badgeNear
                ? "0 0 16px 4px rgba(255,200,80,0.7), 0 0 6px rgba(229,69,43,0.9)"
                : "0 0 8px rgba(229,69,43,0.8)",
              transition: "box-shadow 0.3s",
            }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: badgeNear ? "rgba(255,230,150,0.95)" : "var(--red-light)",
              transition: "color 0.3s",
              textShadow: badgeNear ? "0 0 20px rgba(255,200,80,0.6)" : "none",
            }}>
              Giving Light
            </span>
          </div>

          <h1 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: "clamp(2.8rem, 7vw, 5.2rem)", fontWeight: 200, lineHeight: 1.05, color: "var(--white)", marginBottom: 26, animation: "fade-up 0.9s cubic-bezier(.22,1,.36,1) 0.15s both" }}>
            Your Church is<br /><span style={{ fontStyle: "italic", fontWeight: 300, color: "var(--gold-light)" }}>Your House</span>
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "rgba(255,255,255,0.55)", maxWidth: 510, margin: "0 auto 44px", animation: "fade-up 0.9s cubic-bezier(.22,1,.36,1) 0.3s both" }}>
            We come to serving and believing God's Word and Spirit — a community rooted in faith, love and the light of Christ.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", animation: "fade-up 0.9s cubic-bezier(.22,1,.36,1) 0.45s both" }}>
            <button className="btn-red" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>Join a Service</button>
            <button className="btn-ghost" onClick={() => document.getElementById("about-story")?.scrollIntoView({ behavior: "smooth" })}>Our Story</button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "fade-up 1s cubic-bezier(.22,1,.36,1) 1s both", opacity: 0.4, zIndex: 7 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-light)" }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--gold-light), transparent)" }} />
        </div>
      </section>

      {/* ── STORY ── */}
      <section id="about-story" style={{ padding: "110px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <FadeIn>
              <div style={{ position: "relative", borderRadius: 4, overflow: "hidden" }}>
                <img src="/images/content/pst_Ajao.jpg" alt="Life Brand Church community" style={{ width: "100%", minHeight: 380, objectFit: "cover", borderRadius: 4, display: "block" }} onError={(e) => { e.target.style.background = "var(--cream-dim)"; e.target.style.minHeight = "380px"; }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,70,140,0.3), transparent)", borderRadius: 4, pointerEvents: "none" }} />
                {/* Red accent badge */}
                <div style={{ position: "absolute", bottom: 20, left: 20, background: "var(--red)", color: "var(--white)", padding: "10px 18px", borderRadius: 2 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 2 }}>Lead Pastor</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.98rem", fontWeight: 400 }}>Oyebola Ajao</div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div>
                <div className="label">About Our Story</div>
                <h2 className="section-title" style={{ marginBottom: 24 }}>Welcome to<br /><span style={{ fontStyle: "italic", color: "var(--gold-dark)" }}>Life Brand Church</span></h2>
                <div style={{ width: 40, height: 3, background: "linear-gradient(to right, var(--red), var(--gold-dark))", marginBottom: 24, borderRadius: 2 }} />
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1rem, 1.8vw, 1.18rem)", fontWeight: 300, lineHeight: 1.85, color: "var(--text)", marginBottom: 18 }}>
                  Life Brand Church is a vibrant, Spirit-filled community in the heart of Ogba, Ikeja, Lagos. Under the leadership of{" "}
                  <em style={{ color: "var(--red)", fontStyle: "normal", fontWeight: 600 }}>Pastor Oyebola Ajao</em>, we are committed to giving light — shining God's love into every corner of our community.
                </p>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--text-muted)", marginBottom: 32 }}>
                  We gather not because we have it all figured out, but because we believe love transforms everything — and transformation begins in community with God.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
                  {["Glorify God", "Believe Bible", "Love Community", "Love People"].map((v) => (
                    <div key={v} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", fontWeight: 600, color: "var(--text)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => { window.location.hash = "/about"; window.scrollTo(0, 0); }}>Learn More About Us</button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <DarkSection style={{ background: "var(--charcoal-2)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {STATS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}><StatCounter value={s.value} suffix={s.suffix} label={s.label} /></FadeIn>
            ))}
          </div>
        </div>
      </DarkSection>

      {/* ── SERVICES ── */}
      <DarkSection id="services" style={{ background: "var(--charcoal)", padding: "110px 24px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div className="label-blue">Worship With Us</div>
            <h2 className="section-title-light" style={{ marginBottom: 52 }}>Service Times</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="glass-card" style={{ padding: "44px 32px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--red-light)", marginBottom: 14 }}>{s.day}</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(2rem, 3vw, 2.6rem)", fontWeight: 200, color: "var(--white)", marginBottom: 10 }}>{s.time}</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>{s.name}</div>
                  <div style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.32)", lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}>
            <div style={{ marginTop: 44, padding: "24px 32px", border: "1px solid rgba(229,69,43,0.2)", borderLeft: "3px solid var(--red)", borderRadius: "0 4px 4px 0", background: "rgba(229,69,43,0.05)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--red-light)" strokeWidth="1.5" width="22" height="22"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                No 34, Ijaiye Road, Carterpillar Bus Stop, Btw Stanbic IBTC Bank &amp; LG Office, Ogba, Ikeja, Lagos, Nigeria
              </div>
            </div>
          </FadeIn>
        </div>
      </DarkSection>

      {/* ── MINISTRIES ── */}
      <section id="ministries" style={{ padding: "110px 24px", background: "var(--cream-dim)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="label" style={{ justifyContent: "center" }}>Get Involved</div>
              <h2 className="section-title">Our Ministries</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {MINISTRIES.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="ministry-card">
                  <div className="ministry-card-accent" />
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, rgba(229,69,43,0.1), rgba(0,70,140,0.05))", border: "1px solid rgba(229,69,43,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "var(--red)" }}>
                    {m.icon}
                  </div>
                  <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.2rem", fontWeight: 600, marginBottom: 10, color: "var(--charcoal)" }}>{m.title}</h3>
                  <p style={{ fontSize: "0.86rem", lineHeight: 1.72, color: "var(--text-muted)" }}>{m.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCRIPTURE ── */}
      <DarkSection style={{ padding: "90px 24px", background: "var(--charcoal)", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(229,69,43,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, transparent, rgba(229,69,43,0.5))", margin: "0 auto 36px" }} />
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.25rem, 2.5vw, 1.9rem)", fontWeight: 200, fontStyle: "italic", lineHeight: 1.78, color: "rgba(255,255,255,0.85)", maxWidth: 650, margin: "0 auto 18px" }}>
            "For where two or three gather in my name,<br />there am I with them."
          </p>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--red-light)" }}>Matthew 18:20</span>
        </FadeIn>
      </DarkSection>

      {/* ── EVENTS PREVIEW ── */}
      <section id="events" style={{ padding: "110px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 44 }}>
              <div>
                <div className="label">What's Happening</div>
                <h2 className="section-title">Upcoming Events</h2>
              </div>
              <button
                className="btn-outline"
                style={{ fontSize: "0.7rem", padding: "10px 22px" }}
                onClick={() => { navigate("/events"); window.scrollTo(0, 0); }}
              >
                View All Events →
              </button>
            </div>
          </FadeIn>
          {EVENTS.slice(0, 3).map((e, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="event-item">
                <div style={{ background: "var(--charcoal)", borderRadius: 4, padding: "10px 8px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--red-light)", marginBottom: 3 }}>{e.month}</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.55rem", fontWeight: 300, lineHeight: 1, color: "var(--white)" }}>{e.day}</div>
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 5 }}>{e.title}</div>
                  <div style={{ fontSize: "0.86rem", lineHeight: 1.65, color: "var(--text-muted)" }}>{e.desc}</div>
                </div>
              </div>
            </FadeIn>
          ))}
          <FadeIn delay={0.28}>
            <div style={{ marginTop: 36, textAlign: "center" }}>
              <button
                className="btn-red"
                onClick={() => { navigate("/events"); window.scrollTo(0, 0); }}
              >
                See All Upcoming Events
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <DarkSection id="contact" style={{ background: "var(--charcoal)", padding: "110px 24px 72px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 72, marginBottom: 72 }}>
            <FadeIn>
              <div>
                <div className="label-blue">Reach Out</div>
                <h2 className="section-title-light" style={{ marginBottom: 18 }}>We'd Love to<br />Meet You</h2>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.78, color: "rgba(255,255,255,0.42)", marginBottom: 36 }}>
                  Whether you're exploring faith for the first time or looking for a church home, you are welcome here exactly as you are.
                </p>
                {/* Pastor card */}
                <div style={{ padding: "18px 22px", background: "rgba(229,69,43,0.08)", border: "1px solid rgba(229,69,43,0.2)", borderLeft: "3px solid var(--red)", borderRadius: "0 4px 4px 0", marginBottom: 30 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--red-light)", marginBottom: 5 }}>Lead Pastor</div>
                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.05rem", color: "var(--white)" }}>Pastor Oyebola Ajao</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[
                    { label: "Address", value: "No 34, Ijaiye Road, Carterpillar Bus Stop,\nBtw Stanbic IBTC Bank & LG Office,\nOgba, Ikeja, Lagos, Nigeria" },
                    { label: "Phone",   value: "+61 3 8376 6284\n+61 3 2555 682 458" },
                    { label: "Email",   value: "godlove@lifebrandchurch.com" },
                  ].map((c) => (
                    <div key={c.label}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 5 }}>{c.label}</div>
                      <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{c.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div className="form-field"><label className="form-label">Your Name</label>
                  <input className="form-input" type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-field"><label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="form-field"><label className="form-label">Message</label>
                  <textarea className="form-input" placeholder="How can we help you?" value={formData.message} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} required />
                </div>
                <button className="btn-red" type="submit" style={{ width: "100%", marginTop: 4, padding: "15px" }}>Send Message</button>
              </form>
            </FadeIn>
          </div>
        </div>
      </DarkSection>
    </div>
  );
}

// ─── ScrollToTop ─────────────────────────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// ─── App ─────────────────────────────────────────────────────────────────────

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dismiss the HTML loading screen once React has painted the first frame
  useEffect(() => {
    const MIN_MS = 1600; // keep it visible long enough for animations to play
    const start = performance.now();
    const dismiss = () => {
      const elapsed = performance.now() - start;
      const delay = Math.max(0, MIN_MS - elapsed);
      setTimeout(() => {
        const el = document.getElementById("ls");
        if (!el) return;
        el.classList.add("hide");
        setTimeout(() => { if (el.parentNode) el.remove(); }, 750);
      }, delay);
    };
    // Wait for the browser to finish painting before measuring elapsed time
    requestAnimationFrame(() => requestAnimationFrame(dismiss));
  }, []);

  const handleNav = (item) => {
    if (item === "Home") { navigate("/"); window.scrollTo(0, 0); }
    else if (item === "About") { navigate("/about"); window.scrollTo(0, 0); }
    else if (item === "Gallery") { navigate("/gallery"); window.scrollTo(0, 0); }
    else if (item === "Sermons") { navigate("/sermons"); window.scrollTo(0, 0); }
    else if (item === "Events") { navigate("/events"); window.scrollTo(0, 0); }
    else if (item === "Contact") {
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: "contact" } });
      } else {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text)", background: "var(--cream)" }}>
      <ScrollToTop />
      <Nav />
      <AppRouter />
      <Footer onNav={handleNav} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <style>{GLOBAL_CSS}</style>
      <AppContent />
    </Router>
  );
}
