import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

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
  .cb-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    font-family: 'DM Sans', sans-serif;
  }

  /* ══════════════════════════════════════════
     LEFT — brand panel (changed justify-content)
  ══════════════════════════════════════════ */
  .cb-panel {
    position: relative;
    background: var(--navy);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;      /* ← changed from space-between */
    padding: 3rem;
    min-height: 100vh;
    gap: 4rem;                        /* ← added breathing room */
  }

  /* subtle dot-grid texture */
  .cb-panel::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  /* large amber arc */
  .cb-panel::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border: 1.5px solid rgba(245,158,11,0.15);
    bottom: -200px;
    right: -200px;
    pointer-events: none;
  }

  /* second arc */
  .cb-arc2 {
    position: absolute;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.08);
    bottom: -80px;
    right: -60px;
    pointer-events: none;
  }

  /* ── Panel top: logo ── */
  .cb-panel-logo {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .cb-logo-icon {
    width: 36px;
    height: 36px;
    background: var(--amber);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .cb-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
  }

  .cb-logo-name span { color: var(--amber); }

  /* ── Floating parcel cards ── */
  .cb-card {
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
    max-width: 220px;
  }

  .cb-card-1 {
    top: 16%;
    right: 7%;
    animation: floatA 5s ease-in-out infinite;
  }

  .cb-card-2 {
    top: 34%;
    left: 6%;
    animation: floatB 6s ease-in-out infinite 0.8s;
  }

  @keyframes floatA {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }

  @keyframes floatB {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-9px); }
  }

  .cb-card-dot {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .cb-dot-green  { background: rgba(52,211,153,0.15); }
  .cb-dot-amber  { background: rgba(245,158,11,0.15); }
  .cb-dot-blue   { background: rgba(96,165,250,0.15); }

  .cb-card-text { display: flex; flex-direction: column; gap: 0.1rem; }
  .cb-card-label { font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.45); letter-spacing: 0.06em; text-transform: uppercase; }
  .cb-card-value { font-size: 0.85rem; font-weight: 500; color: var(--white); }

  /* ── Panel bottom: copy (now centered better) ── */
  .cb-panel-copy { 
    position: relative; 
    z-index: 2; 
    text-align: center;
    margin-top: auto;               /* ← pushes toward center when space allows */
    padding-top: 2rem;
  }

  .cb-panel-headline {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
    font-weight: 800;
    color: var(--white);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
    text-align: center;
  }

  .cb-panel-headline span { color: var(--amber); }

  .cb-panel-sub {
    font-size: 0.88rem;
    color: rgba(255,255,255,0.45);
    line-height: 1.7;
    font-weight: 300;
    max-width: 320px;
    margin: 0 auto 0.55rem;
  }

  .cb-panel-sub-2 {
    font-size: 0.82rem;
    color: rgba(245,158,11,0.6);
    font-weight: 500;
    font-style: italic;
    max-width: 320px;
    margin: 0 auto;
  }

  /* ══════════════════════════════════════════
     RIGHT — form panel (unchanged)
  ══════════════════════════════════════════ */
  .cb-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
    background: var(--white);
    min-height: 100vh;
  }

  .cb-form-inner {
    width: 100%;
    max-width: 360px;
    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ... rest of the form CSS remains 100% unchanged ... */
  .cb-form-nav {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 2.75rem;
  }

  .cb-mobile-logo {
    display: none;
    align-items: center;
    gap: 0.5rem;
  }

  .cb-mobile-logo-icon {
    width: 28px; height: 28px;
    background: var(--amber);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
  }

  .cb-mobile-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
  }

  .cb-mobile-logo-name span { color: var(--amber); }

  .cb-step-badge {
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

  .cb-step-badge svg { flex-shrink: 0; }

  .cb-form-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.9rem;
    font-weight: 800;
    color: var(--ink);
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 0.35rem;
  }

  .cb-form-subtitle {
    font-size: 0.875rem;
    color: var(--ink-50);
    font-weight: 400;
    margin-bottom: 2rem;
  }

  .cb-form-subtitle a {
    color: var(--amber-dk);
    font-weight: 600;
    text-decoration: none;
  }

  .cb-form-subtitle a:hover { text-decoration: underline; }

  .cb-field { margin-bottom: 1rem; }

  .cb-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 0.4rem;
  }

  .cb-input {
    width: 100%;
    padding: 0.8rem 1rem;
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

  .cb-input::placeholder { color: rgba(15,31,61,0.28); }

  .cb-input:hover {
    border-color: rgba(245,158,11,0.4);
    background: var(--white);
  }

  .cb-input:focus {
    border-color: var(--amber);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
  }

  .cb-field-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.4rem;
  }

  .cb-forgot {
    font-size: 0.73rem;
    color: var(--ink-50);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .cb-forgot:hover { color: var(--amber-dk); }

  .cb-submit {
    width: 100%;
    padding: 0.88rem;
    margin-top: 0.5rem;
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

  .cb-submit::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.25s ease;
    transform-origin: left;
  }

  .cb-submit:hover:not(:disabled) {
    background: var(--navy-lt);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15,31,61,0.3);
  }

  .cb-submit:hover:not(:disabled)::after {
    transform: scaleX(1);
  }

  .cb-submit:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(15,31,61,0.2);
  }

  .cb-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .cb-submit:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 3px;
  }

  .cb-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.55s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .cb-or {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin: 1.3rem 0;
    font-size: 0.72rem;
    color: var(--ink-50);
    font-weight: 500;
  }

  .cb-or::before, .cb-or::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ink-20);
  }

  .cb-social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }

  .cb-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.7rem;
    border: 1.5px solid var(--ink-20);
    border-radius: var(--radius);
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ink);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
  }

  .cb-social-btn:hover {
    border-color: rgba(245,158,11,0.35);
    background: var(--amber-lt);
    transform: translateY(-1px);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .cb-page { grid-template-columns: 1fr; }
    .cb-panel { display: none; }
    .cb-form-panel { padding: 2rem 1.5rem; align-items: flex-start; padding-top: 3rem; }
    .cb-mobile-logo { display: flex; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("cb-css")) {
  const tag = document.createElement("style");
  tag.id = "cb-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

/* ─── Component ─────────────────────────────────────────────────────── */
const Login = () => {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      console.log("LOGIN RESPONSE 🔥", res.data);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      login(res.data.user, res.data.token);
      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cb-page">

      {/* LEFT — brand panel */}
      <aside className="cb-panel" aria-hidden="true">
        <span className="cb-arc2" />

        {/* floating status cards */}
        <div className="cb-card cb-card-1">
          <div className="cb-card-dot cb-dot-green">📦</div>
          <div className="cb-card-text">
            <span className="cb-card-label">Package #4821</span>
            <span className="cb-card-value">Out for delivery</span>
          </div>
        </div>

        <div className="cb-card cb-card-2">
          <div className="cb-card-dot cb-dot-amber">🚚</div>
          <div className="cb-card-text">
            <span className="cb-card-label">ETA</span>
            <span className="cb-card-value">Today, 2:30 PM</span>
          </div>
        </div>

        {/* top logo */}
        <div className="cb-panel-logo">
          <div className="cb-logo-icon">🚀</div>
          <span className="cb-logo-name">Courier<span>Buddy</span></span>
        </div>

        {/* headline section — now better centered */}
        <div className="cb-panel-copy">
          <h2 className="cb-panel-headline">
            Easy and Ethical<br /><span>Delivery System.</span>
          </h2>
          <p className="cb-panel-sub">
            Connecting campus users, helping each other grow.
          </p>
          <p className="cb-panel-sub" style={{ marginBottom: "0.55rem" }}>
            Stay ethical. Someone is depending on you.
          </p>
          <p className="cb-panel-sub-2">
            Together we make campus life easier.
          </p>
        </div>
      </aside>

      {/* RIGHT — form panel (unchanged) */}
      <main className="cb-form-panel">
        <div className="cb-form-inner">

          <nav className="cb-form-nav">
            <div className="cb-mobile-logo">
              <div className="cb-mobile-logo-icon">🚀</div>
              <span className="cb-mobile-logo-name">Courier<span>Buddy</span></span>
            </div>
          </nav>

          <div className="cb-step-badge">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#d97706" strokeWidth="1.5"/>
              <circle cx="5" cy="5" r="2" fill="#d97706"/>
            </svg>
            Courier Portal
          </div>

          <h1 className="cb-form-title">Sign in to<br />your account</h1>
          <p className="cb-form-subtitle">
            New here? <a href="/register">Create a free account</a>
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="cb-field">
              <label htmlFor="cb-email" className="cb-label">Email address</label>
              <input
                id="cb-email"
                className="cb-input"
                type="email"
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-required="true"
              />
            </div>

            <div className="cb-field">
              <div className="cb-field-meta">
                <label htmlFor="cb-password" className="cb-label" style={{ marginBottom: 0 }}>
                  Password
                </label>
              </div>
              <input
                id="cb-password"
                className="cb-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="cb-submit"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading
                ? <><span className="cb-spinner" /> Signing in…</>
                : "Sign in →"
              }
            </button>
          </form>

        </div>
      </main>
    </div>
  );
};

export default Login;
