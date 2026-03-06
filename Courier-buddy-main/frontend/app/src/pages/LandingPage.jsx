import { useNavigate } from "react-router-dom";

if (typeof document !== "undefined" && !document.getElementById("lp2-fonts")) {
  const link = document.createElement("link");
  link.id = "lp2-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { scroll-behavior: smooth; width: 100%; max-width: 100%; overflow-x: hidden; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0f1f3d; color: #fff; }
  #root { width: 100%; overflow-x: hidden; }

  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 6%; height: 70px; width: 100%;
    background: rgba(10,18,35,0.95);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(245,158,11,0.12);
  }
  .lp-logo { display: flex; align-items: center; gap: 10px; }
  .lp-logo-box { width: 36px; height: 36px; background: #f59e0b; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .lp-logo-text { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; white-space: nowrap; }
  .lp-logo-text span { color: #f59e0b; }
  .lp-nav-right { display: flex; align-items: center; gap: 12px; }
  .lp-nav-register { padding: 9px 20px; background: transparent; color: rgba(255,255,255,0.7); border: 1.5px solid rgba(255,255,255,0.2); border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .lp-nav-register:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
  .lp-nav-login { padding: 9px 24px; background: #f59e0b; color: #0f1f3d; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .lp-nav-login:hover { background: #d97706; transform: translateY(-1px); }

  .lp-hero {
    min-height: 100vh; width: 100%;
    background: linear-gradient(160deg, #0a1223 0%, #0f1f3d 50%, #0d1a30 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 100px 6% 60px;
    position: relative; overflow: hidden;
  }
  .lp-hero-bg-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px);
    background-size: 50px 50px; pointer-events: none;
  }
  .lp-hero-glow-top { position: absolute; width: 800px; height: 500px; border-radius: 50%; background: radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 60%); top: -100px; left: 50%; transform: translateX(-50%); pointer-events: none; }
  .lp-hero-glow-bot { position: absolute; width: 600px; height: 400px; border-radius: 50%; background: radial-gradient(ellipse, rgba(30,52,96,0.8) 0%, transparent 70%); bottom: -100px; right: -100px; pointer-events: none; }
  .lp-hero-content { position: relative; z-index: 1; max-width: 860px; width: 100%; }

  .lp-hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3);
    color: #f59e0b; font-size: 0.82rem; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 8px 18px; border-radius: 100px; margin-bottom: 2.5rem;
    animation: lpUp 0.6s cubic-bezier(0.22,1,0.36,1) both; max-width: 100%;
  }
  .lp-hero-tag-dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; animation: lpPulse 2s infinite; }
  @keyframes lpPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

  .lp-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 800; color: #fff;
    letter-spacing: -0.04em; line-height: 1.02;
    margin-bottom: 2rem;
    animation: lpUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.07s both;
  }
  .lp-hero-title .hl { color: #f59e0b; }

  .lp-hero-desc {
    font-size: clamp(1.05rem, 2.2vw, 1.25rem);
    color: rgba(255,255,255,0.65); font-weight: 400; line-height: 1.8;
    max-width: 640px; margin: 0 auto 3rem;
    animation: lpUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.14s both;
  }
  .lp-hero-desc strong { color: #fff; font-weight: 600; }

  .lp-hero-btns {
    display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
    animation: lpUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.21s both;
    margin-bottom: 4rem;
  }
  .lp-btn-main { padding: 16px 36px; background: #f59e0b; color: #0f1f3d; border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 28px rgba(245,158,11,0.35); }
  .lp-btn-main:hover { background: #d97706; transform: translateY(-2px); box-shadow: 0 14px 36px rgba(245,158,11,0.45); }
  .lp-btn-outline { padding: 16px 36px; background: transparent; color: rgba(255,255,255,0.8); border: 1.5px solid rgba(255,255,255,0.2); border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .lp-btn-outline:hover { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.05); }

  .lp-stats-bar {
    display: flex; gap: 0; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; overflow: hidden; background: rgba(255,255,255,0.03);
    animation: lpUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.28s both;
    width: 100%; max-width: 560px; margin: 0 auto;
  }
  .lp-stat { flex: 1; padding: 22px 10px; text-align: center; border-right: 1px solid rgba(255,255,255,0.08); min-width: 0; }
  .lp-stat:last-child { border-right: none; }
  .lp-stat-num { font-family: 'Syne', sans-serif; font-size: clamp(1.3rem, 4vw, 1.9rem); font-weight: 800; color: #f59e0b; line-height: 1; margin-bottom: 6px; }
  .lp-stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

  @keyframes lpUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .lp-section { padding: 80px 6%; width: 100%; }
  .lp-max { max-width: 1100px; margin: 0 auto; }
  .lp-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #f59e0b; margin-bottom: 14px; text-align: center; }
  .lp-heading { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 4.5vw, 3rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; text-align: center; margin-bottom: 18px; }
  .lp-heading.dark { color: #0f1f3d; }
  .lp-heading.light { color: #fff; }
  .lp-body-text { font-size: 1.05rem; color: rgba(255,255,255,0.5); text-align: center; max-width: 580px; margin: 0 auto 56px; line-height: 1.75; }
  .lp-body-text.dark { color: rgba(15,31,61,0.6); }

  .lp-explainer {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px; padding: 56px 48px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;
    margin-bottom: 24px;
  }
  .lp-explainer-text h3 { font-family: 'Syne', sans-serif; font-size: 1.9rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 20px; }
  .lp-explainer-text h3 span { color: #f59e0b; }
  .lp-explainer-text p { font-size: 1.05rem; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 16px; }
  .lp-explainer-text p strong { color: #fff; }
  .lp-explainer-visual { display: flex; flex-direction: column; gap: 14px; }

  .lp-flow-card {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    transition: background 0.2s, border-color 0.2s;
  }
  .lp-flow-card:hover { background: rgba(245,158,11,0.07); border-color: rgba(245,158,11,0.2); }
  .lp-flow-card-icon { width: 44px; height: 44px; border-radius: 11px; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
  .lp-flow-card-text strong { display: block; font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 3px; }
  .lp-flow-card-text span { font-size: 0.82rem; color: rgba(255,255,255,0.45); line-height: 1.5; }
  .lp-flow-arrow { text-align: center; color: rgba(245,158,11,0.4); font-size: 1.2rem; }

  .lp-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .lp-step {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 32px 24px;
    position: relative; overflow: hidden;
    transition: transform 0.2s, border-color 0.2s, background 0.2s;
  }
  .lp-step:hover { transform: translateY(-5px); border-color: rgba(245,158,11,0.25); background: rgba(245,158,11,0.05); }
  .lp-step-num { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; color: rgba(245,158,11,0.1); line-height: 1; position: absolute; top: 16px; right: 20px; }
  .lp-step-emoji { font-size: 2.2rem; margin-bottom: 16px; display: block; }
  .lp-step-title { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #fff; margin-bottom: 10px; line-height: 1.3; }
  .lp-step-desc { font-size: 0.88rem; color: rgba(255,255,255,0.5); line-height: 1.7; }
  .lp-step-line { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #f59e0b, transparent); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; border-radius: 18px 18px 0 0; }
  .lp-step:hover .lp-step-line { transform: scaleX(1); }

  .lp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .lp-feat {
    background: #fff; border-radius: 18px; padding: 32px 28px;
    border-left: 4px solid transparent;
    transition: all 0.2s; box-shadow: 0 2px 12px rgba(15,31,61,0.06);
  }
  .lp-feat:hover { border-left-color: #f59e0b; transform: translateY(-4px); box-shadow: 0 16px 40px rgba(15,31,61,0.12); }
  .lp-feat-icon { width: 52px; height: 52px; border-radius: 14px; background: #f4f6fb; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 16px; transition: background 0.2s; }
  .lp-feat:hover .lp-feat-icon { background: #fffbeb; }
  .lp-feat-title { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #0f1f3d; margin-bottom: 8px; }
  .lp-feat-desc { font-size: 0.88rem; color: rgba(15,31,61,0.6); line-height: 1.7; }

  .lp-cta-wrap {
    background: linear-gradient(135deg, #0a1223 0%, #162848 100%);
    border-radius: 28px; padding: 72px 48px; text-align: center;
    position: relative; overflow: hidden;
    border: 1px solid rgba(245,158,11,0.12);
  }
  .lp-cta-glow { position: absolute; width: 500px; height: 300px; border-radius: 50%; background: radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 65%); top: -100px; left: 50%; transform: translateX(-50%); pointer-events: none; }
  .lp-cta-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
  .lp-cta-inner { position: relative; z-index: 1; }
  .lp-cta-title { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.15; }
  .lp-cta-title span { color: #f59e0b; }
  .lp-cta-sub { font-size: 1.05rem; color: rgba(255,255,255,0.5); margin-bottom: 36px; line-height: 1.75; max-width: 520px; margin-left: auto; margin-right: auto; }
  .lp-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

  .lp-footer { background: #080d1a; border-top: 1px solid rgba(255,255,255,0.06); padding: 28px 6%; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; width: 100%; }
  .lp-footer-logo { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 800; color: rgba(255,255,255,0.3); }
  .lp-footer-logo span { color: #f59e0b; }
  .lp-footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.2); }
  .lp-footer-links { display: flex; gap: 20px; }
  .lp-footer-link { font-size: 0.78rem; color: rgba(255,255,255,0.25); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color 0.2s; }
  .lp-footer-link:hover { color: rgba(255,255,255,0.6); }

  @media (max-width: 900px) {
    .lp-explainer { grid-template-columns: 1fr; padding: 36px 28px; }
    .lp-steps { grid-template-columns: 1fr 1fr; }
    .lp-features-grid { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 600px) {
    .lp-nav { padding: 0 4%; height: 60px; }
    .lp-nav-register { display: none; }
    .lp-hero { padding: 80px 4% 48px; min-height: 100svh; }
    .lp-hero-title { font-size: clamp(1.75rem, 8vw, 2.4rem); }
    .lp-hero-desc { font-size: 0.97rem; }
    .lp-hero-btns { flex-direction: column; align-items: center; gap: 10px; }
    .lp-btn-main, .lp-btn-outline { width: 100%; max-width: 320px; padding: 14px 24px; font-size: 0.95rem; }
    .lp-stats-bar { max-width: 100%; }
    .lp-stat { padding: 16px 8px; }
    .lp-steps { grid-template-columns: 1fr; }
    .lp-features-grid { grid-template-columns: 1fr; }
    .lp-section { padding: 48px 4%; }
    .lp-explainer { padding: 28px 20px; }
    .lp-cta-wrap { padding: 40px 20px; border-radius: 20px; }
    .lp-cta-btns { flex-direction: column; align-items: center; }
    .lp-cta-btns .lp-btn-main,
    .lp-cta-btns .lp-btn-outline { width: 100%; max-width: 320px; }
    .lp-footer { flex-direction: column; align-items: flex-start; padding: 24px 4%; }
    .lp-footer-copy { order: 3; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("lp2-css")) {
  const tag = document.createElement("style");
  tag.id = "lp2-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

const LandingPage = () => {
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#0f1f3d", width: "100%", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav className="lp-nav">
        <div className="lp-logo">
          <div className="lp-logo-box">🚀</div>
          <span className="lp-logo-text">Courier<span>Buddy</span></span>
        </div>
        <div className="lp-nav-right">
          <button className="lp-nav-register" onClick={() => navigate("/register")}>Register</button>
          <button className="lp-nav-login" onClick={() => navigate("/login")}>Login →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg-grid" />
        <div className="lp-hero-glow-top" />
        <div className="lp-hero-glow-bot" />
        <div className="lp-hero-content">
          <div className="lp-hero-tag">
            <span className="lp-hero-tag-dot" />
            Student-to-Student Delivery Network
          </div>
          <h1 className="lp-hero-title">
            Get Your Parcel<br />
            <span className="hl">Delivered by a</span><br />
            <span className="hl">Fellow Student</span>
          </h1>
          <p className="lp-hero-desc">
            Someone is already going to the mall.<br />
            <strong>Why not let them bring your parcel back too?</strong><br />
            CourierBuddy connects students — no fees, no companies, just trust.
          </p>
          <div className="lp-hero-btns">
            <button className="lp-btn-main" onClick={() => navigate("/register")}>
              Join CourierBuddy Free →
            </button>
            <button className="lp-btn-outline" onClick={() => scrollTo("how")}>
              See How It Works ↓
            </button>
          </div>
          <div className="lp-stats-bar">
            <div className="lp-stat">
              <div className="lp-stat-num">100%</div>
              <div className="lp-stat-label">Student Run</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-num">₹0</div>
              <div className="lp-stat-label">Zero Fees</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-num">ID</div>
              <div className="lp-stat-label">Verified Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IS IT ── */}
      <section className="lp-section" style={{ background: "#0c1628" }}>
        <div className="lp-max">
          <div className="lp-label">What is CourierBuddy?</div>
          <h2 className="lp-heading light">The Problem We Solve</h2>
          <p className="lp-body-text">
            You ordered something online. It's at the mall. You can't go pick it up today but your classmate is already heading there.
          </p>

          {/* ── THIS IS THE FIXED EXPLAINER — lp-explainer wrapper restored ── */}
          <div className="lp-explainer">

            <div className="lp-explainer-text">
              <h3>Not in the mood to go to the mall <span>just for a parcel?</span></h3>
              <p>
                Your eKart parcel is sitting at the mall. You don't want to go. But <strong>someone else is already heading there</strong> to pick up their own order.
              </p>
              <p>
                What if that student could bring yours too, since they're passing right by your place anyway? That's exactly what CourierBuddy makes possible.
              </p>
              <p>
                Post a delivery request. A verified fellow student at the mall accepts it, picks up your parcel on their way back, and delivers it to you. As a thank-you, <strong>pay them a fair amount</strong> based on the parcel's weight and size, they deserve it for the help.
              </p>
              <p style={{ color: "rgba(245,158,11,0.8)", fontSize: "0.9rem", fontStyle: "italic" }}>
                🤝 Trust works both ways: be fair, be honest, be a good campus citizen.
              </p>
              <button className="lp-btn-main" style={{ marginTop: "8px" }} onClick={() => navigate("/register")}>
                Get Started →
              </button>
            </div>

            <div className="lp-explainer-visual">
              <div className="lp-flow-card">
                <div className="lp-flow-card-icon">🛍️</div>
                <div className="lp-flow-card-text">
                  <strong>Arun is going to Mall</strong>
                  <span>He checks CourierBuddy for delivery requests nearby</span>
                </div>
              </div>
              <div className="lp-flow-arrow">↓</div>
              <div className="lp-flow-card">
                <div className="lp-flow-card-icon">📲</div>
                <div className="lp-flow-card-text">
                  <strong>Arjun posted a request</strong>
                  <span>His parcel is at the same mall. Arun accepts it on his way</span>
                </div>
              </div>
              <div className="lp-flow-arrow">↓</div>
              <div className="lp-flow-card">
                <div className="lp-flow-card-icon">📦</div>
                <div className="lp-flow-card-text">
                  <strong>Parcel delivered to Arjun's hostel</strong>
                  <span>Both users rate each other. Trust builds. Community grows.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-section" id="how" style={{ background: "#0f1f3d" }}>
        <div className="lp-max">
          <div className="lp-label">Step by Step</div>
          <h2 className="lp-heading light">How It Works</h2>
          <p className="lp-body-text">Four simple steps from parcel request to delivery, handled entirely by your fellow students.</p>
          <div className="lp-steps">
            {[
              { n:"01", e:"📝", t:"Post a Request", d:"Need your parcel picked up? Post a delivery request with the location, your hostel address, and timing. Takes 30 seconds." },
              { n:"02", e:"🙋", t:"A Student Accepts", d:"Any verified student who is already heading that way can see and accept your request. Their route, your parcel." },
              { n:"03", e:"🤝", t:"Coordinate Directly", d:"Connect with each other on the platform. Confirm pickup time, describe the parcel, and agree on handoff details." },
              { n:"04", e:"⭐", t:"Deliver & Rate", d:"Parcel delivered safely to your door. Both parties rate each other, building a trust reputation across campus." },
            ].map((s, i) => (
              <div className="lp-step" key={i}>
                <div className="lp-step-line" />
                <div className="lp-step-num">{s.n}</div>
                <span className="lp-step-emoji">{s.e}</span>
                <div className="lp-step-title">{s.t}</div>
                <div className="lp-step-desc">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section" style={{ background: "#f4f6fb" }}>
        <div className="lp-max">
          <div className="lp-label" style={{ color: "#d97706" }}>Why CourierBuddy</div>
          <h2 className="lp-heading dark">Built for campus life</h2>
          <p className="lp-body-text dark">Everything designed around how students actually live, move, and help each other.</p>
          <div className="lp-features-grid">
            {[
              { i:"🔒", t:"ID-Verified Members",    d:"Every user submits a college ID and selfie before joining. You always know who is carrying your parcel — no strangers, only verified campus members." },
              { i:"💸", t:"Completely Free",         d:"No delivery charges. No platform fees. No hidden costs. CourierBuddy runs entirely on the goodwill of students helping each other." },
              { i:"⚡", t:"Match by Route",          d:"Requests are matched to students who are already heading in the right direction. Deliveries happen naturally, fitting into existing journeys." },
              { i:"⭐", t:"Trust Ratings",           d:"After every delivery, both users rate each other. High-rated members earn more trust and become the most reliable helpers on campus." },
              { i:"🏫", t:"Campus-First Design",     d:"Not a generic delivery app. CourierBuddy is built specifically around how college campuses work — hostels, malls, and shared spaces." },
              { i:"🤝", t:"No Middlemen Ever",       d:"There is no company between you and your delivery. Just two students, one platform, and a shared belief in helping each other out." },
            ].map((f, i) => (
              <div className="lp-feat" key={i}>
                <div className="lp-feat-icon">{f.i}</div>
                <div className="lp-feat-title">{f.t}</div>
                <div className="lp-feat-desc">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-section" style={{ background: "#f4f6fb" }}>
        <div className="lp-max">
          <div className="lp-cta-wrap">
            <div className="lp-cta-glow" />
            <div className="lp-cta-grid" />
            <div className="lp-cta-inner">
              <h2 className="lp-cta-title">
                Ready to join<br /><span>CourierBuddy?</span>
              </h2>
              <p className="lp-cta-sub">
                Create your free account, get verified with your college ID, and start helping, or getting help, from your fellow students today.
              </p>
              <div className="lp-cta-btns">
                <button className="lp-btn-main" onClick={() => navigate("/register")}>
                  Create Free Account →
                </button>
                <button className="lp-btn-outline" onClick={() => navigate("/login")}>
                  Already have an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">Courier<span>Buddy</span></div>
        <div className="lp-footer-copy">Built by students, for students. Zero fees. Pure trust.</div>
        <div className="lp-footer-links">
          <button className="lp-footer-link" onClick={() => navigate("/login")}>Login</button>
          <button className="lp-footer-link" onClick={() => navigate("/register")}>Register</button>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
