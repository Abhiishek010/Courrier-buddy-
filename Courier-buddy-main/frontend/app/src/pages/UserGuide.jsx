import { useNavigate } from "react-router-dom";

/* ─── Google Fonts ─────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("ug-fonts")) {
  const link = document.createElement("link");
  link.id = "ug-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:      #0f1f3d;
    --navy-lt:   #162848;
    --amber:     #f59e0b;
    --amber-dk:  #d97706;
    --amber-lt:  #fffbeb;
    --white:     #ffffff;
    --off:       #f4f6fb;
    --ink:       #0f1f3d;
    --ink-60:    rgba(15,31,61,0.6);
    --ink-10:    rgba(15,31,61,0.07);
    --green:     #10b981;
    --green-lt:  #ecfdf5;
    --radius:    12px;
  }

  body { background: var(--off); font-family: 'DM Sans', sans-serif; }

  /* ── Page shell ── */
  .ug-page {
    min-height: 100vh;
    background: var(--off);
    padding-bottom: 6rem;
  }

  /* ── Hero ── */
  .ug-hero {
    background: var(--navy);
    position: relative;
    overflow: hidden;
    padding: 4rem 2rem 5rem;
    text-align: center;
  }

  .ug-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .ug-hero-arc {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.12);
    pointer-events: none;
  }

  .ug-hero-arc.a1 { width: 500px; height: 500px; top: -200px; right: -100px; }
  .ug-hero-arc.a2 { width: 300px; height: 300px; bottom: -150px; left: -80px; border-color: rgba(245,158,11,0.08); }

  .ug-hero-inner { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }

  .ug-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    cursor: pointer;
    margin-bottom: 2rem;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }

  .ug-back-btn:hover { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); }

  .ug-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(245,158,11,0.15);
    border: 1px solid rgba(245,158,11,0.3);
    color: var(--amber);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.4rem 1rem;
    border-radius: 100px;
    margin-bottom: 1.5rem;
  }

  .ug-hero-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--amber);
    animation: ugPulse 2s infinite;
  }

  @keyframes ugPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .ug-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 1.25rem;
  }

  .ug-hero-title span { color: var(--amber); }

  .ug-hero-sub {
    font-size: 1rem;
    color: rgba(255,255,255,0.5);
    line-height: 1.7;
    font-weight: 300;
    max-width: 520px;
    margin: 0 auto;
  }

  /* ── Content wrapper ── */
  .ug-content {
    max-width: 780px;
    margin: -2.5rem auto 0;
    padding: 0 1.5rem;
    position: relative;
    z-index: 2;
  }

  /* ── Intro card ── */
  .ug-intro-card {
    background: var(--white);
    border: 1px solid var(--ink-10);
    border-radius: 20px;
    padding: 2.5rem 2.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 40px rgba(15,31,61,0.08);
    animation: ugSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes ugSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ug-intro-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--amber-dk);
    margin-bottom: 0.75rem;
  }

  .ug-intro-heading {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 1.25rem;
  }

  .ug-intro-heading span { color: var(--amber); }

  .ug-intro-text {
    font-size: 0.95rem;
    color: var(--ink-60);
    line-height: 1.85;
    font-weight: 400;
  }

  .ug-intro-text + .ug-intro-text { margin-top: 1rem; }

  /* ── Section title ── */
  .ug-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .ug-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ink-10);
  }

  /* ── Value cards grid ── */
  .ug-values-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    animation: ugSlideUp 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  }

  .ug-value-card {
    background: var(--white);
    border: 1px solid var(--ink-10);
    border-radius: var(--radius);
    padding: 1.5rem;
    transition: box-shadow 0.2s, transform 0.2s;
    border-left: 3px solid transparent;
  }

  .ug-value-card:hover {
    box-shadow: 0 8px 30px rgba(15,31,61,0.08);
    transform: translateY(-2px);
  }

  .ug-value-card.amber { border-left-color: var(--amber); }
  .ug-value-card.green { border-left-color: var(--green); }
  .ug-value-card.navy  { border-left-color: var(--navy); }
  .ug-value-card.rose  { border-left-color: #f43f5e; }

  .ug-value-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 0.85rem;
  }

  .ug-value-card.amber .ug-value-icon { background: var(--amber-lt); }
  .ug-value-card.green .ug-value-icon { background: var(--green-lt); }
  .ug-value-card.navy  .ug-value-icon { background: rgba(15,31,61,0.06); }
  .ug-value-card.rose  .ug-value-icon { background: #fff1f2; }

  .ug-value-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--ink);
    margin-bottom: 0.4rem;
    letter-spacing: -0.01em;
  }

  .ug-value-desc {
    font-size: 0.8rem;
    color: var(--ink-60);
    line-height: 1.6;
    font-weight: 400;
  }

  /* ── How it works steps ── */
  .ug-steps {
    background: var(--white);
    border: 1px solid var(--ink-10);
    border-radius: 20px;
    padding: 2rem 2.5rem;
    margin-bottom: 2rem;
    animation: ugSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  }

  .ug-step {
    display: flex;
    gap: 1.25rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--ink-10);
  }

  .ug-step:last-child { border-bottom: none; padding-bottom: 0; }
  .ug-step:first-child { padding-top: 0; }

  .ug-step-num {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--navy);
    color: var(--amber);
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .ug-step-body {}

  .ug-step-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.01em;
    margin-bottom: 0.3rem;
  }

  .ug-step-desc {
    font-size: 0.82rem;
    color: var(--ink-60);
    line-height: 1.65;
  }

  /* ── Rules card ── */
  .ug-rules {
    background: var(--navy);
    border-radius: 20px;
    padding: 2.5rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    animation: ugSlideUp 0.65s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }

  .ug-rules::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }

  .ug-rules-arc {
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.1);
    bottom: -130px; right: -80px;
    pointer-events: none;
  }

  .ug-rules-inner { position: relative; z-index: 1; }

  .ug-rules-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 0.6rem;
  }

  .ug-rules-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
    margin-bottom: 1.5rem;
  }

  .ug-rule-item {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    margin-bottom: 1rem;
  }

  .ug-rule-item:last-child { margin-bottom: 0; }

  .ug-rule-icon {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(245,158,11,0.15);
    border: 1px solid rgba(245,158,11,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .ug-rule-text {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.65;
    font-weight: 300;
  }

  .ug-rule-text strong { color: var(--white); font-weight: 600; }

  /* ── Closing quote ── */
  .ug-quote {
    background: linear-gradient(135deg, var(--amber-lt), #fef3c7);
    border: 1.5px solid rgba(245,158,11,0.25);
    border-radius: 20px;
    padding: 2.5rem;
    text-align: center;
    animation: ugSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both;
  }

  .ug-quote-mark {
    font-family: 'Syne', sans-serif;
    font-size: 4rem;
    font-weight: 800;
    color: var(--amber);
    opacity: 0.3;
    line-height: 0.8;
    margin-bottom: 1rem;
  }

  .ug-quote-text {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.01em;
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }

  .ug-quote-sub {
    font-size: 0.82rem;
    color: var(--ink-60);
    font-weight: 400;
  }

  /* ── CTA ── */
  .ug-cta {
    text-align: center;
    margin-top: 2.5rem;
    animation: ugSlideUp 0.75s cubic-bezier(0.22,1,0.36,1) 0.3s both;
  }

  .ug-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    background: var(--navy);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .ug-cta-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2.5px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.25s ease;
    transform-origin: left;
  }

  .ug-cta-btn:hover { background: var(--navy-lt); transform: translateY(-1px); }
  .ug-cta-btn:hover::after { transform: scaleX(1); }

  @media (max-width: 640px) {
    .ug-values-grid { grid-template-columns: 1fr; }
    .ug-intro-card, .ug-steps, .ug-rules, .ug-quote { padding: 1.5rem; }
    .ug-content { padding: 0 1rem; }
    .ug-hero { padding: 3rem 1rem 4rem; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("ug-css")) {
  const tag = document.createElement("style");
  tag.id = "ug-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

const steps = [
  {
    num: "01",
    title: "Create Your Account & Get Verified",
    desc: "Sign up with your personal/college email, upload your selfie and college ID card. Our team reviews your submission within a short time. Verification ensures every person on the platform is a real, trusted member of your campus community.",
  },
  {
    num: "02",
    title: "Post or Accept a Delivery Request",
    desc: "If you're receiving a parcel, post a delivery request with pickup location, destination, and timing. If you want to help, browse open requests and accept one that fits your route. It's that simple  no complicated logistics.",
  },
  {
    num: "03",
    title: "Coordinate & Communicate",
    desc: "Once matched, coordinate with your fellow student directly. Confirm the handoff details, agree on a time and place, and make it happen. Clear communication is the backbone of every successful delivery.",
  },
  {
    num: "04",
    title: "Complete the Delivery",
    desc: "Hand over the parcel safely and mark the delivery as complete. Both parties can rate each other, building a reputation system based on trust, reliability, and kindness within your campus community.",
  },
  {
    num: "05",
    title: "Grow Together",
    desc: "Every delivery you complete builds your campus reputation. High-rated members unlock more opportunities, earn peer respect, and become pillars of the CourierBuddy community. Your effort today creates value for everyone tomorrow.",
  },
];

const values = [
  { color: "amber", icon: "🤝", title: "Built on Trust",       desc: "Every interaction on CourierBuddy is a vote of confidence. When you deliver a parcel safely, you're not just completing a task, you're earning trust that lasts." },
  { color: "green", icon: "🌱", title: "Grow Together",         desc: "This is a community where everyone rises together. When you help a fellow student, you strengthen the entire network that will one day help you back." },
  { color: "navy",  icon: "🔒", title: "Stay Ethical",          desc: "Handle every parcel as if it were your own. Respect privacy, honour commitments, and never compromise the safety of items entrusted to you." },
  { color: "rose",  icon: "💬", title: "Build Connections",     desc: "Beyond parcels, CourierBuddy is about meeting people, forming friendships, and creating a support system that outlives any single delivery." },
];

const rules = [
  { icon: "✓", text: <><strong>Never tamper with or open</strong> a parcel that isn't yours. It's a matter of basic respect and integrity.</> },
  { icon: "✓", text: <><strong>Always confirm delivery</strong> in person or with a clear acknowledgment. Ghost deliveries damage trust and the community.</> },
  { icon: "✓", text: <><strong>Communicate proactively.</strong> If you're running late or can't complete a delivery, notify the other person immediately, don't go silent.</> },
  { icon: "✓", text: <><strong>Be punctual and reliable.</strong> Someone is depending on you. Treat every request with the same seriousness you'd want for your own parcel.</> },
  { icon: "✓", text: <><strong>Respect every member equally.</strong> No hierarchy, no entitlement. We are all students helping each other navigate campus life a little easier.</> },
  { icon: "✓", text: <><strong>Report suspicious activity.</strong> If something feels wrong, flag it. Protecting the community is a shared responsibility.</> },
];

const UserGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="ug-page">

      {/* ── Hero ── */}
      <div className="ug-hero">
        <div className="ug-hero-arc a1" />
        <div className="ug-hero-arc a2" />
        <div className="ug-hero-inner">
          <button className="ug-back-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
          <div className="ug-hero-badge">
            <span className="ug-hero-badge-dot" />
            User Guide
          </div>
          <h1 className="ug-hero-title">
            Welcome to<br /><span>CourierBuddy</span>
          </h1>
          <p className="ug-hero-sub">
            Everything you need to know about using the platform with trust, integrity, and community spirit.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="ug-content">

        {/* Intro card */}
        <div className="ug-intro-card">
          <div className="ug-intro-eyebrow">What is CourierBuddy?</div>
          <h2 className="ug-intro-heading">
            A platform built by students,<br /><span>for students</span>
          </h2>
          <p className="ug-intro-text">
            CourierBuddy is not a courier website, it is a community. It was born from a simple observation: students on campus are constantly moving, and a parcel that needs to travel from mall to hostel doesn't need a professional delivery service. It needs a trusted fellow student willing to lend a hand.
          </p>
          <p className="ug-intro-text">
            This platform runs entirely on the goodwill, integrity, and mutual respect of its members. There are no paid employees, no corporate policies, no middlemen  just students helping students. That is both our greatest strength and our greatest responsibility. Every experience on CourierBuddy is shaped by the people who use it, which means the quality of this community is entirely in your hands.
          </p>
          <p className="ug-intro-text">
            When you join CourierBuddy, you are not just signing up for a service, you are becoming part of something larger. A network of trust. A community of people who believe that small acts of kindness compound into something extraordinary over time.
          </p>
        </div>

        {/* Our Values */}
        <div className="ug-section-title">🌟 Our Core Values</div>
        <div className="ug-values-grid">
          {values.map((v, i) => (
            <div className={`ug-value-card ${v.color}`} key={i}>
              <div className="ug-value-icon">{v.icon}</div>
              <div className="ug-value-title">{v.title}</div>
              <div className="ug-value-desc">{v.desc}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="ug-section-title">🚀 How It Works</div>
        <div className="ug-steps">
          {steps.map((s, i) => (
            <div className="ug-step" key={i}>
              <div className="ug-step-num">{s.num}</div>
              <div className="ug-step-body">
                <div className="ug-step-title">{s.title}</div>
                <div className="ug-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Rules */}
        <div className="ug-rules">
          <div className="ug-rules-arc" />
          <div className="ug-rules-inner">
            <div className="ug-rules-eyebrow">Community Standards</div>
            <div className="ug-rules-title">The CourierBuddy Code</div>
            {rules.map((r, i) => (
              <div className="ug-rule-item" key={i}>
                <div className="ug-rule-icon">{r.icon}</div>
                <div className="ug-rule-text">{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing quote */}
        <div className="ug-quote">
          <div className="ug-quote-mark">"</div>
          <div className="ug-quote-text">
            Today, your help carries someone else's parcel.<br />
            Tomorrow, the community carries you.
          </div>
          <div className="ug-quote-sub">
            Be ethical. Be helpful. Be the reason someone trusts this platform.
          </div>
        </div>

        {/* CTA */}
        <div className="ug-cta">
          <button className="ug-cta-btn" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserGuide;
