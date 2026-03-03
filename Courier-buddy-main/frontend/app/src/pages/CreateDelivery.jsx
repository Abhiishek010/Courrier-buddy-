import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

/* ─── Google Fonts ─────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("cb-fonts")) {
  const link = document.createElement("link");
  link.id = "cb-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

/* ─── CSS ───────────────────────────────────────────────────────────── */
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
    --ink-20:    rgba(15,31,61,0.13);
    --ink-08:    rgba(15,31,61,0.06);
    --green:     #10b981;
    --radius:    10px;
  }

  body { background: var(--off); font-family: 'DM Sans', sans-serif; }

  /* ── Page ── */
  .ccd-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem 1.5rem 5rem;
    animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Top bar ── */
  .ccd-topbar {
    width: 100%;
    max-width: 780px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }

  .ccd-logo {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .ccd-logo-icon {
    width: 32px; height: 32px;
    background: var(--amber);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem;
  }

  .ccd-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
  }

  .ccd-logo-name span { color: var(--amber); }

  .ccd-back-btn {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink-60);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 0.3rem;
    transition: color 0.2s;
    padding: 0;
  }

  .ccd-back-btn:hover { color: var(--amber-dk); }

  /* ── Card ── */
  .ccd-card {
    width: 100%;
    max-width: 780px;
    background: var(--white);
    border: 1px solid var(--ink-20);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(15,31,61,0.07);
  }

  /* ── Card header ── */
  .ccd-header {
    background: var(--navy);
    padding: 2rem 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .ccd-header::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .ccd-header::after {
    content: '';
    position: absolute;
    width: 340px; height: 340px;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.15);
    top: -130px; right: -100px;
    pointer-events: none;
  }

  /* second arc */
  .ccd-arc2 {
    position: absolute;
    width: 200px; height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.08);
    bottom: -80px; left: -60px;
    pointer-events: none;
  }

  .ccd-header-inner {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .ccd-header-left {}

  .ccd-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(245,158,11,0.15);
    border: 1px solid rgba(245,158,11,0.3);
    border-radius: 100px;
    padding: 0.25rem 0.7rem;
    font-size: 0.68rem;
    font-weight: 700;
    color: var(--amber);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.7rem;
  }

  .ccd-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.65rem;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
    margin-bottom: 0.35rem;
    line-height: 1.2;
  }

  .ccd-header-sub {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.45);
    font-weight: 300;
    line-height: 1.6;
    max-width: 380px;
  }

  /* summary pill strip in header */
  .ccd-summary-pills {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .ccd-summary-pill {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 0.55rem 0.85rem;
    min-width: 160px;
  }

  .ccd-pill-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    background: rgba(245,158,11,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  .ccd-pill-text { display: flex; flex-direction: column; gap: 0.05rem; }
  .ccd-pill-label { font-size: 0.62rem; color: rgba(255,255,255,0.4); font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
  .ccd-pill-val   { font-size: 0.8rem;  color: rgba(255,255,255,0.85); font-weight: 600; }

  /* ── Body ── */
  .ccd-body { padding: 2rem 2.5rem; }

  /* section label */
  .ccd-sec-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-60);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .ccd-sec-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ink-20);
  }

  /* ── Grid sections ── */
  .ccd-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  .ccd-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  /* field */
  .ccd-field { display: flex; flex-direction: column; }
  .ccd-field.span-2 { grid-column: span 2; }

  .ccd-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 0.4rem;
  }

  .ccd-input-wrap { position: relative; }

  .ccd-input-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.9rem;
    pointer-events: none;
    opacity: 0.35;
  }

  .ccd-input {
    width: 100%;
    padding: 0.78rem 1rem 0.78rem 2.3rem;
    border: 1.5px solid var(--ink-20);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 400;
    color: var(--ink);
    background: var(--off);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    caret-color: var(--amber);
    appearance: none;
    -webkit-appearance: none;
  }

  .ccd-input.no-icon { padding-left: 1rem; }

  .ccd-input::placeholder { color: rgba(15,31,61,0.28); }

  .ccd-input:hover {
    border-color: rgba(245,158,11,0.4);
    background: var(--white);
  }

  .ccd-input:focus {
    border-color: var(--amber);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(245,158,11,0.12);
  }

  /* reward field — special amber highlight */
  .ccd-reward-wrap {
    position: relative;
  }

  .ccd-reward-prefix {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--amber-dk);
    pointer-events: none;
    z-index: 1;
  }

  .ccd-reward-input {
    padding-left: 1.75rem !important;
    border-color: rgba(245,158,11,0.3) !important;
    background: var(--amber-lt) !important;
    color: var(--ink) !important;
    font-weight: 600 !important;
  }

  .ccd-reward-input:focus {
    border-color: var(--amber) !important;
    box-shadow: 0 0 0 3px rgba(245,158,11,0.15) !important;
  }

  /* ── Company chips ── */
  .ccd-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .ccd-chip {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.8rem;
    border-radius: 100px;
    border: 1.5px solid var(--ink-20);
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ink-60);
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, color 0.18s;
  }

  .ccd-chip:hover {
    border-color: rgba(245,158,11,0.45);
    background: var(--amber-lt);
    color: var(--ink);
  }

  .ccd-chip.selected {
    border-color: var(--amber);
    background: var(--amber-lt);
    color: var(--amber-dk);
    font-weight: 600;
  }

  /* ── Route preview strip ── */
  .ccd-route {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--off);
    border: 1px solid var(--ink-20);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    margin-bottom: 1.75rem;
    min-height: 60px;
  }

  .ccd-route-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    flex: 1;
    min-width: 0;
  }

  .ccd-route-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ccd-route-dot.pickup  { background: var(--amber); box-shadow: 0 0 0 3px rgba(245,158,11,0.2); }
  .ccd-route-dot.dropoff { background: var(--navy);  box-shadow: 0 0 0 3px rgba(15,31,61,0.12); }

  .ccd-route-node-lbl {
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-60);
  }

  .ccd-route-node-val {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
    text-align: center;
  }

  .ccd-route-node-val.empty {
    color: rgba(15,31,61,0.25);
    font-style: italic;
    font-weight: 400;
  }

  .ccd-route-line {
    flex: 2;
    display: flex;
    align-items: center;
    gap: 0;
    position: relative;
    padding: 0 0.5rem;
  }

  .ccd-route-line::before {
    content: '';
    flex: 1;
    height: 1.5px;
    background: repeating-linear-gradient(
      to right,
      var(--ink-20) 0, var(--ink-20) 6px,
      transparent 6px, transparent 12px
    );
  }

  .ccd-route-truck {
    font-size: 1.1rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    animation: truckMove 2.5s ease-in-out infinite;
  }

  @keyframes truckMove {
    0%, 100% { transform: translateX(-50%) translateX(-6px); }
    50%       { transform: translateX(-50%) translateX(6px); }
  }

  /* ── Notice ── */
  .ccd-notice {
    display: flex;
    gap: 0.75rem;
    background: var(--amber-lt);
    border: 1px solid rgba(245,158,11,0.25);
    border-radius: var(--radius);
    padding: 0.9rem 1.1rem;
    margin-bottom: 1.75rem;
  }

  .ccd-notice-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
  .ccd-notice-text { font-size: 0.78rem; color: var(--ink-60); line-height: 1.6; }
  .ccd-notice-text strong { color: var(--ink); }

  /* ── Submit row ── */
  .ccd-submit-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .ccd-cancel-btn {
    flex-shrink: 0;
    padding: 0.88rem 1.4rem;
    background: transparent;
    border: 1.5px solid var(--ink-20);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--ink-60);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }

  .ccd-cancel-btn:hover { background: var(--off); color: var(--ink); border-color: var(--ink-20); }

  .ccd-submit {
    flex: 1;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(15,31,61,0.22);
    position: relative;
    overflow: hidden;
  }

  .ccd-submit::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.28s ease;
    transform-origin: left;
  }

  .ccd-submit:hover:not(:disabled) {
    background: var(--navy-lt);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15,31,61,0.28);
  }

  .ccd-submit:hover:not(:disabled)::after { transform: scaleX(1); }
  .ccd-submit:active:not(:disabled) { transform: translateY(0); }
  .ccd-submit:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
  .ccd-submit:focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }

  .ccd-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.55s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .ccd-body { padding: 1.5rem; }
    .ccd-header { padding: 1.5rem; }
    .ccd-grid-2,
    .ccd-grid-3 { grid-template-columns: 1fr; }
    .ccd-field.span-2 { grid-column: span 1; }
    .ccd-summary-pills { display: none; }
    .ccd-submit-row { flex-direction: column-reverse; }
    .ccd-cancel-btn { width: 100%; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("ccd-css")) {
  const tag = document.createElement("style");
  tag.id = "ccd-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

const COMPANIES = [
  { label: "Amazon",   icon: "📦" },
  { label: "Flipkart", icon: "🛍️" },
  { label: "Meesho",   icon: "👗" },
  { label: "Myntra",   icon: "👟" },
  { label: "Nykaa",    icon: "💄" },
  { label: "Other",    icon: "🏪" },
];

/* ─── Component ─────────────────────────────────────────────────────── */
const CreateDelivery = () => {
  const [productName,      setProductName]      = useState("");
  const [ecommerceCompany, setEcommerceCompany] = useState("");
  const [pickupLocation,   setPickupLocation]   = useState("");
  const [hostelName,       setHostelName]       = useState("");
  const [rewardAmount,     setRewardAmount]     = useState("");
  const [isLoading,        setIsLoading]        = useState(false);

  const navigate = useNavigate();

  /* ── original submit logic ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/delivery/create", {
        productName,
        ecommerceCompany,
        pickupLocation,
        hostelName,
        rewardAmount,
      });
      alert("Delivery request created");
      navigate("/dashboard");
    } catch (error) {
      alert("Error creating request");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit =
    productName && ecommerceCompany && pickupLocation && hostelName && rewardAmount && !isLoading;

  return (
    <div className="ccd-page">

      {/* top bar */}
      <div className="ccd-topbar">
        <div className="ccd-logo">
          <div className="ccd-logo-icon">🚀</div>
          <span className="ccd-logo-name">Courier<span>Buddy</span></span>
        </div>
        <button className="ccd-back-btn" type="button" onClick={() => navigate("/dashboard")}>
          ← Back to dashboard
        </button>
      </div>

      {/* card */}
      <div className="ccd-card">

        {/* header */}
        <div className="ccd-header">
          <span className="ccd-arc2" />
          <div className="ccd-header-inner">
            <div className="ccd-header-left">
              <div className="ccd-header-badge">📦 New Request</div>
              <h1 className="ccd-header-title">Create Delivery Request</h1>
              <p className="ccd-header-sub">
                Fill in your parcel details and set a reward for the courier. Your request goes live instantly.
              </p>
            </div>
            <div className="ccd-summary-pills">
              <div className="ccd-summary-pill">
                <div className="ccd-pill-icon">📦</div>
                <div className="ccd-pill-text">
                  <span className="ccd-pill-label">Product</span>
                  <span className="ccd-pill-val">{productName || "—"}</span>
                </div>
              </div>
              <div className="ccd-summary-pill">
                <div className="ccd-pill-icon">🏠</div>
                <div className="ccd-pill-text">
                  <span className="ccd-pill-label">Deliver to</span>
                  <span className="ccd-pill-val">{hostelName || "—"}</span>
                </div>
              </div>
              <div className="ccd-summary-pill">
                <div className="ccd-pill-icon">💰</div>
                <div className="ccd-pill-text">
                  <span className="ccd-pill-label">Reward</span>
                  <span className="ccd-pill-val">{rewardAmount ? `₹${rewardAmount}` : "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="ccd-body">

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Section 1: Package ── */}
            <div className="ccd-sec-label">📦 Package Details</div>
            <div className="ccd-grid-2" style={{ marginBottom: "0.5rem" }}>
              <div className="ccd-field">
                <label htmlFor="ccd-product" className="ccd-label">Product Name</label>
                <div className="ccd-input-wrap">
                  <span className="ccd-input-icon">🏷️</span>
                  <input
                    id="ccd-product"
                    className="ccd-input"
                    type="text"
                    placeholder="e.g. iPhone 15 Case"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ccd-field">
                <label className="ccd-label">E-commerce Company</label>
                <div className="ccd-input-wrap">
                  <span className="ccd-input-icon">🏪</span>
                  <input
                    id="ccd-company"
                    className="ccd-input"
                    type="text"
                    placeholder="e.g. Amazon"
                    value={ecommerceCompany}
                    onChange={(e) => setEcommerceCompany(e.target.value)}
                    required
                  />
                </div>
                {/* quick-fill chips */}
                <div className="ccd-chips">
                  {COMPANIES.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      className={`ccd-chip ${ecommerceCompany === c.label ? "selected" : ""}`}
                      onClick={() => setEcommerceCompany(c.label)}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Section 2: Route ── */}
            <div className="ccd-sec-label" style={{ marginTop: "1.5rem" }}>🗺️ Route</div>

            {/* live route preview */}
            <div className="ccd-route">
              <div className="ccd-route-node">
                <div className="ccd-route-dot pickup" />
                <span className="ccd-route-node-lbl">Pickup</span>
                <span className={`ccd-route-node-val ${!pickupLocation ? "empty" : ""}`}>
                  {pickupLocation || "Not set"}
                </span>
              </div>
              <div className="ccd-route-line">
                <span className="ccd-route-truck">🚚</span>
              </div>
              <div className="ccd-route-node">
                <div className="ccd-route-dot dropoff" />
                <span className="ccd-route-node-lbl">Deliver to</span>
                <span className={`ccd-route-node-val ${!hostelName ? "empty" : ""}`}>
                  {hostelName || "Not set"}
                </span>
              </div>
            </div>

            <div className="ccd-grid-2">
              <div className="ccd-field">
                <label htmlFor="ccd-pickup" className="ccd-label">Pickup Location</label>
                <div className="ccd-input-wrap">
                  <span className="ccd-input-icon">📍</span>
                  <input
                    id="ccd-pickup"
                    className="ccd-input"
                    type="text"
                    placeholder="e.g. Main Gate Post Office"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ccd-field">
                <label htmlFor="ccd-hostel" className="ccd-label">Hostel Name</label>
                <div className="ccd-input-wrap">
                  <span className="ccd-input-icon">🏠</span>
                  <input
                    id="ccd-hostel"
                    className="ccd-input"
                    type="text"
                    placeholder="e.g. Block B, Room 204"
                    value={hostelName}
                    onChange={(e) => setHostelName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* ── Section 3: Reward ── */}
            <div className="ccd-sec-label">💰 Courier Reward</div>

            <div className="ccd-notice">
              <span className="ccd-notice-icon">💡</span>
              <span className="ccd-notice-text">
                <strong>Set a fair reward</strong> — higher rewards attract couriers faster. The amount is paid on successful delivery.
              </span>
            </div>

            <div className="ccd-grid-3">
              {["10", "20", "50"].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`ccd-chip ${rewardAmount === amt ? "selected" : ""}`}
                  style={{ justifyContent: "center", padding: "0.6rem", borderRadius: "var(--radius)", fontSize: "0.85rem", fontWeight: 600 }}
                  onClick={() => setRewardAmount(amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="ccd-field" style={{ marginBottom: "1.75rem", marginTop: "0.75rem" }}>
              <label htmlFor="ccd-reward" className="ccd-label">Custom Amount (₹)</label>
              <div className="ccd-reward-wrap">
                <span className="ccd-reward-prefix">₹</span>
                <input
                  id="ccd-reward"
                  className="ccd-input ccd-reward-input"
                  type="number"
                  placeholder="Enter amount"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* ── Submit row ── */}
            <div className="ccd-submit-row">
              <button
                type="button"
                className="ccd-cancel-btn"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ccd-submit"
                disabled={!canSubmit}
                aria-busy={isLoading}
              >
                {isLoading
                  ? <><span className="ccd-spinner" /> Creating request…</>
                  : "Create delivery request →"
                }
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;
