  import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

/* ─── Google Fonts ─────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("cb-fonts")) {
  const link = document.createElement("link");
  link.id = "cb-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

/* ─── Global CSS ────────────────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:     #0f1f3d;
    --navy-lt:  #162848;
    --amber:    #f59e0b;
    --amber-dk: #d97706;
    --amber-lt: #fffbeb;
    --white:    #ffffff;
    --off:      #f8f9fc;
    --ink:      #0f1f3d;
    --ink-50:   rgba(15,31,61,0.5);
    --ink-20:   rgba(15,31,61,0.12);
    --radius:   8px;
  }

  body { background: var(--off); }

  /* ── Page shell ── */
  .cbr-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    font-family: 'DM Sans', sans-serif;
  }

  /* ══════════════════════════════════════════
     LEFT — brand panel
  ══════════════════════════════════════════ */
  .cbr-panel {
    position: relative;
    background: var(--navy);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3rem;
    min-height: 100vh;
  }

  /* dot-grid texture */
  .cbr-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  /* large amber arc */
  .cbr-panel::after {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    border: 1.5px solid rgba(245,158,11,0.15);
    bottom: -200px; right: -200px;
    pointer-events: none;
  }

  .cbr-arc2 {
    position: absolute;
    width: 380px; height: 380px;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.08);
    bottom: -80px; right: -60px;
    pointer-events: none;
  }

  /* top logo */
  .cbr-panel-logo {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .cbr-logo-icon {
    width: 36px; height: 36px;
    background: var(--amber);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .cbr-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
  }

  .cbr-logo-name span { color: var(--amber); }

  /* ── Floating step cards ── */
  .cbr-card {
    position: absolute;
    z-index: 2;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    backdrop-filter: blur(6px);
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .cbr-card-1 { top: 20%; right: 8%;  animation: floatA 5s ease-in-out infinite; }
  .cbr-card-2 { top: 40%; left: 6%;  animation: floatB 6s ease-in-out infinite 0.8s; }
  .cbr-card-3 { top: 60%; right: 12%; animation: floatA 7s ease-in-out infinite 1.5s; }

  @keyframes floatA {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-7px); }
  }

  .cbr-card-dot {
    width: 34px; height: 34px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .cbr-dot-amber { background: rgba(245,158,11,0.15); }
  .cbr-dot-green { background: rgba(52,211,153,0.15); }
  .cbr-dot-blue  { background: rgba(96,165,250,0.15); }

  .cbr-card-text { display: flex; flex-direction: column; gap: 0.1rem; }
  .cbr-card-label { font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase; }
  .cbr-card-value { font-size: 0.85rem; font-weight: 500; color: var(--white); }

  /* bottom copy */
  .cbr-panel-copy { position: relative; z-index: 2; }

  .cbr-steps {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .cbr-step {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .cbr-step-num {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(245,158,11,0.15);
    border: 1px solid rgba(245,158,11,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--amber);
    flex-shrink: 0;
  }

  .cbr-step-txt { font-size: 0.82rem; color: rgba(255,255,255,0.55); font-weight: 400; }
  .cbr-step-txt strong { color: rgba(255,255,255,0.85); font-weight: 600; }

  .cbr-panel-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
    font-weight: 800;
    color: var(--white);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }

  .cbr-panel-headline span { color: var(--amber); }

  .cbr-panel-sub {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    font-weight: 300;
    max-width: 320px;
  }

  /* ══════════════════════════════════════════
     RIGHT — form panel
  ══════════════════════════════════════════ */
  .cbr-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
    background: var(--white);
    min-height: 100vh;
  }

  .cbr-form-inner {
    width: 100%;
    max-width: 380px;
    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cbr-form-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.75rem;
  }

  /* mobile-only logo */
  .cbr-mobile-logo {
    display: none;
    align-items: center;
    gap: 0.5rem;
  }

  .cbr-mobile-logo-icon {
    width: 28px; height: 28px;
    background: var(--amber);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
  }

  .cbr-mobile-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
  }

  .cbr-mobile-logo-name span { color: var(--amber); }

  .cbr-help-link {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--ink-50);
    text-decoration: none;
    transition: color 0.2s;
  }

  .cbr-help-link:hover { color: var(--amber-dk); }

  /* step badge */
  .cbr-step-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    background: var(--amber-lt);
    border: 1px solid rgba(245,158,11,0.3);
    border-radius: 100px;
    padding: 0.3rem 0.75rem;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--amber-dk);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .cbr-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--ink);
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 0.35rem;
  }

  .cbr-form-subtitle {
    font-size: 0.875rem;
    color: var(--ink-50);
    font-weight: 400;
    margin-bottom: 1.75rem;
  }

  .cbr-form-subtitle a {
    color: var(--amber-dk);
    font-weight: 600;
    text-decoration: none;
  }

  .cbr-form-subtitle a:hover { text-decoration: underline; }

  /* progress dots */
  .cbr-progress {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    margin-bottom: 1.75rem;
  }

  .cbr-progress-dot {
    height: 4px;
    border-radius: 4px;
    background: var(--ink-20);
    transition: background 0.3s, width 0.3s;
  }

  .cbr-progress-dot.active {
    background: var(--amber);
    width: 24px !important;
  }

  /* two-col grid for name + hostel */
  .cbr-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  /* fields */
  .cbr-field { margin-bottom: 0.9rem; }

  .cbr-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 0.4rem;
  }

  .cbr-input-wrap { position: relative; }

  .cbr-input-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.95rem;
    pointer-events: none;
    opacity: 0.4;
  }

  .cbr-input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.4rem;
    border: 1.5px solid var(--ink-20);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.93rem;
    font-weight: 400;
    color: var(--ink);
    background: var(--off);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    caret-color: var(--amber);
  }

  .cbr-input.no-icon {
    padding-left: 1rem;
  }

  .cbr-input::placeholder { color: rgba(15,31,61,0.28); }

  .cbr-input:hover {
    border-color: rgba(245,158,11,0.4);
    background: var(--white);
  }

  .cbr-input:focus {
    border-color: var(--amber);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
  }

  /* password strength bar */
  .cbr-strength {
    margin-top: 0.45rem;
    display: flex;
    gap: 0.3rem;
    align-items: center;
  }

  .cbr-strength-bar {
    flex: 1;
    height: 3px;
    border-radius: 3px;
    background: var(--ink-20);
    transition: background 0.3s;
  }

  .cbr-strength-bar.weak   { background: #ef4444; }
  .cbr-strength-bar.medium { background: var(--amber); }
  .cbr-strength-bar.strong { background: #10b981; }

  .cbr-strength-label {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink-50);
    min-width: 40px;
    text-align: right;
  }

  /* terms row */
  .cbr-terms {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin: 1rem 0 1.25rem;
  }

  .cbr-terms input[type="checkbox"] {
    width: 16px; height: 16px;
    accent-color: var(--amber);
    margin-top: 2px;
    flex-shrink: 0;
    cursor: pointer;
  }

  .cbr-terms-text {
    font-size: 0.78rem;
    color: var(--ink-50);
    line-height: 1.5;
  }

  .cbr-terms-text a {
    color: var(--amber-dk);
    font-weight: 600;
    text-decoration: none;
  }

  .cbr-terms-text a:hover { text-decoration: underline; }

  /* submit */
  .cbr-submit {
    width: 100%;
    padding: 0.88rem;
    background: var(--navy);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(15,31,61,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  .cbr-submit::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.25s ease;
    transform-origin: left;
  }

  .cbr-submit:hover:not(:disabled) {
    background: var(--navy-lt);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15,31,61,0.3);
  }

  .cbr-submit:hover:not(:disabled)::after { transform: scaleX(1); }

  .cbr-submit:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(15,31,61,0.2);
  }

  .cbr-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .cbr-submit:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 3px;
  }

  .cbr-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.55s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* trust strip */
  .cbr-trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 1.5rem;
    font-size: 0.7rem;
    color: var(--ink-50);
  }

  .cbr-trust-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--ink-20);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .cbr-page { grid-template-columns: 1fr; }
    .cbr-panel { display: none; }
    .cbr-form-panel { padding: 2rem 1.5rem; align-items: flex-start; padding-top: 3rem; }
    .cbr-mobile-logo { display: flex; }
    .cbr-field-row { grid-template-columns: 1fr; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("cbr-css")) {
  const tag = document.createElement("style");
  tag.id = "cbr-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

/* ── Password strength helper ── */
const getStrength = (pwd) => {
  if (!pwd) return { level: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))            score++;
  if (/[0-9]/.test(pwd))            score++;
  if (/[^A-Za-z0-9]/.test(pwd))    score++;
  if (score <= 1) return { level: 1, label: "Weak" };
  if (score <= 2) return { level: 2, label: "Medium" };
  return { level: 3, label: "Strong" };
};

/* ─── Component ─────────────────────────────────────────────────────── */
const Register = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel]     = useState("");
  const [agreed, setAgreed]     = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/auth/register", { name, email, phone, password, hostel });
      alert("Registration successful");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cbr-page">

      {/* ══ LEFT — brand panel ══ */}
      <aside className="cbr-panel" aria-hidden="true">
        <span className="cbr-arc2" />

        {/* floating cards */}
        <div className="cbr-card cbr-card-1">
          <div className="cbr-card-dot cbr-dot-amber">📋</div>
          <div className="cbr-card-text">
            <span className="cbr-card-label">Step 1</span>
            <span className="cbr-card-value">Create your account</span>
          </div>
        </div>

        <div className="cbr-card cbr-card-2">
          <div className="cbr-card-dot cbr-dot-green">🏠</div>
          <div className="cbr-card-text">
            <span className="cbr-card-label">Step 2</span>
            <span className="cbr-card-value">Set your hostel</span>
          </div>
        </div>

        <div className="cbr-card cbr-card-3">
          <div className="cbr-card-dot cbr-dot-blue">🚀</div>
          <div className="cbr-card-text">
            <span className="cbr-card-label">Step 3</span>
            <span className="cbr-card-value">Start tracking!</span>
          </div>
        </div>

        {/* top logo */}
        <div className="cbr-panel-logo">
          <div className="cbr-logo-icon">🚀</div>
          <span className="cbr-logo-name">Courier<span>Buddy</span></span>
        </div>

        {/* bottom copy */}
        <div className="cbr-panel-copy">
          <div className="cbr-steps">
            <div className="cbr-step">
              <div className="cbr-step-num">1</div>
              <span className="cbr-step-txt"><strong>Fill in your details</strong> — name, email, password</span>
            </div>
            <div className="cbr-step">
              <div className="cbr-step-num">2</div>
              <span className="cbr-step-txt"><strong>Add your hostel</strong> — so we know where to deliver</span>
            </div>
            <div className="cbr-step">
              <div className="cbr-step-num">3</div>
              <span className="cbr-step-txt"><strong>Track packages</strong> — in real time, right away</span>
            </div>
          </div>
          <h2 className="cbr-panel-headline">
            Join thousands of<br /><span>happy recipients.</span>
          </h2>
          <p className="cbr-panel-sub">
            Free to join. No hidden fees. Get parcel alerts, live tracking, and delivery confirmations instantly.
          </p>
        </div>
      </aside>

      {/* ══ RIGHT — form panel ══ */}
      <main className="cbr-form-panel">
        <div className="cbr-form-inner">

          <nav className="cbr-form-nav">
            <div className="cbr-mobile-logo">
              <div className="cbr-mobile-logo-icon">🚀</div>
              <span className="cbr-mobile-logo-name">Courier<span>Buddy</span></span>
            </div>
            <a href="/" className="cbr-help-link">← Back to login</a>
          </nav>

          <div className="cbr-step-badge">
            ✦ New account
          </div>

          <h1 className="cbr-form-title">Create your<br />account</h1>
          <p className="cbr-form-subtitle">
            Already registered? <a href="/">Sign in here</a>
          </p>

          {/* progress dots */}
          <div className="cbr-progress" aria-hidden="true">
            {[28, 8, 8, 8].map((w, i) => (
              <div
                key={i}
                className={`cbr-progress-dot${i === 0 ? " active" : ""}`}
                style={{ width: `${w}px` }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* name + hostel row */}
            <div className="cbr-field-row">
              <div className="cbr-field">
                <label htmlFor="cbr-name" className="cbr-label">Full name</label>
                <div className="cbr-input-wrap">
                  <span className="cbr-input-icon">👤</span>
                  <input
                    id="cbr-name"
                    className="cbr-input"
                    type="text"
                    placeholder="Alex Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="cbr-field">
                <label htmlFor="cbr-hostel" className="cbr-label">Hostel</label>
                <div className="cbr-input-wrap">
                  <span className="cbr-input-icon">🏠</span>
                  <input
                    id="cbr-hostel"
                    className="cbr-input"
                    type="text"
                    placeholder="Block A"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            {/* email */}
            <div className="cbr-field">
              <label htmlFor="cbr-email" className="cbr-label">Email address</label>
              <div className="cbr-input-wrap">
                <span className="cbr-input-icon">✉️</span>
                <input
                  id="cbr-email"
                  className="cbr-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  aria-required="true"
                />
              </div>
            </div>

            {/* phone number */}
            <div className="cbr-field">
              <label htmlFor="cbr-phone" className="cbr-label">Phone Number</label>
              <div className="cbr-input-wrap">
                <span className="cbr-input-icon">📱</span>
                <input
                  id="cbr-phone"
                  className="cbr-input"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(digits);
                  }}
                  required
                  autoComplete="tel"
                  aria-required="true"
                  maxLength={10}
                />
              </div>
            </div>

            {/* password + strength */}
            <div className="cbr-field">
              <label htmlFor="cbr-password" className="cbr-label">Password</label>
              <div className="cbr-input-wrap">
                <span className="cbr-input-icon">🔒</span>
                <input
                  id="cbr-password"
                  className="cbr-input"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-required="true"
                />
              </div>
              {password && (
                <div className="cbr-strength">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`cbr-strength-bar ${
                        strength.level >= n
                          ? strength.level === 1 ? "weak"
                          : strength.level === 2 ? "medium"
                          : "strong"
                          : ""
                      }`}
                    />
                  ))}
                  <span className="cbr-strength-label">{strength.label}</span>
                </div>
              )}
              {/* ⚠️ Password reset warning */}
              <p style={{ marginTop: "0.45rem", fontSize: "0.72rem", color: "#ef4444", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                ⚠️ Remember your password or set an easy one — we don't have a password reset option yet.
              </p>
            </div>

            {/* terms */}
            <div className="cbr-terms">
              <input
                type="checkbox"
                id="cbr-agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="cbr-agree" className="cbr-terms-text">
                I agree to the{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="cbr-submit"
              disabled={isLoading || !agreed}
              aria-busy={isLoading}
            >
              {isLoading
                ? <><span className="cbr-spinner" /> Creating account…</>
                : "Create account →"
              }
            </button>
          </form>

          <div className="cbr-trust">
            <span>Free forever</span>
            <span className="cbr-trust-dot" />
            <span>No credit card</span>
            <span className="cbr-trust-dot" />
            <span>Cancel anytime</span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Register;
