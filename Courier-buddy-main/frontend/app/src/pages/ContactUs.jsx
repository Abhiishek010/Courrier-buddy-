import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";

if (typeof document !== "undefined" && !document.getElementById("cb-fonts")) {
  const link = document.createElement("link");
  link.id = "cb-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
  document.head.appendChild(link);
}

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0f1f3d; --navy-lt: #162848; --amber: #f59e0b; --amber-dk: #d97706;
    --amber-lt: #fffbeb; --white: #ffffff; --off: #f4f6fb; --ink: #0f1f3d;
    --ink-60: rgba(15,31,61,0.6); --ink-30: rgba(15,31,61,0.18); --ink-10: rgba(15,31,61,0.07);
    --green: #10b981; --red: #ef4444; --radius: 10px; --sidebar-w: 200px;
  }
  body { background: var(--off); font-family: 'DM Sans', sans-serif; }

  .cu-shell { display: grid; grid-template-columns: var(--sidebar-w) 1fr; min-height: 100vh; }

  .cu-sidebar { background: var(--navy); display: flex; flex-direction: column; padding: 0; position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .cu-sidebar::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; }
  .cu-sidebar::after { content: ''; position: absolute; width: 360px; height: 360px; border-radius: 50%; border: 1px solid rgba(245,158,11,0.1); bottom: -140px; right: -140px; pointer-events: none; }
  .cu-sidebar-inner { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; padding: 2rem 1rem; }
  .cu-logo { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2.5rem; }
  .cu-logo-icon { width: 34px; height: 34px; background: var(--amber); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .cu-logo-name { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
  .cu-logo-name span { color: var(--amber); }
  .cu-nav-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 0.5rem; padding: 0 0.5rem; }
  .cu-nav { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; }
  .cu-nav-item { display: flex; align-items: center; gap: 0.7rem; padding: 0.65rem 0.75rem; border-radius: var(--radius); font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.5); cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: background 0.18s, color 0.18s; font-family: 'DM Sans', sans-serif; }
  .cu-nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .cu-nav-item.active { background: rgba(245,158,11,0.12); color: var(--amber); font-weight: 600; }
  .cu-nav-icon { font-size: 1rem; opacity: 0.5; flex-shrink: 0; width: 20px; text-align: center; }
  .cu-nav-item.active .cu-nav-icon, .cu-nav-item:hover .cu-nav-icon { opacity: 1; }
  .cu-user-card { margin-top: auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); padding: 0.9rem; display: flex; align-items: center; gap: 0.7rem; }
  .cu-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#f59e0b,#d97706); display: flex; align-items: center; justify-content: center; font-family: 'Syne',sans-serif; font-size: 0.85rem; font-weight: 800; color: #0f1f3d; flex-shrink: 0; }
  .cu-user-info { flex: 1; min-width: 0; }
  .cu-user-name { font-size: 0.82rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cu-user-email { font-size: 0.7rem; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cu-icon-btn { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 0.85rem; padding: 0.2rem; transition: color 0.2s; line-height: 1; }
  .cu-icon-btn:hover { color: rgba(255,255,255,0.8); }
  .cu-icon-btn.danger:hover { color: #ef4444; }

  .cu-main { display: flex; flex-direction: column; min-height: 100vh; overflow: hidden; }
  .cu-topbar { background: var(--white); border-bottom: 1px solid var(--ink-10); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; position: sticky; top: 0; z-index: 10; }
  .cu-topbar-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; }

  /* ── Back button ── */
  .cu-back-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; background: var(--navy); color: var(--white); border: none; border-radius: var(--radius); font-size: 1.1rem; cursor: pointer; flex-shrink: 0; transition: background 0.2s, transform 0.15s; position: relative; overflow: hidden; }
  .cu-back-btn::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2.5px; background: var(--amber); transform: scaleX(0); transition: transform 0.25s ease; transform-origin: left; }
  .cu-back-btn:hover { background: var(--navy-lt); transform: translateY(-1px); }
  .cu-back-btn:hover::after { transform: scaleX(1); }

  .cu-body { padding: 2rem; flex: 1; }

  .cu-welcome { margin-bottom: 2rem; animation: cuFadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes cuFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .cu-welcome-eyebrow { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-60); margin-bottom: 0.3rem; }
  .cu-welcome-title { font-family: 'Syne', sans-serif; font-size: 1.65rem; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; line-height: 1.2; }
  .cu-welcome-title span { color: var(--amber); }
  .cu-welcome-sub { font-size: 0.85rem; color: var(--ink-60); margin-top: 0.4rem; }

  .cu-card { background: var(--white); border: 1px solid var(--ink-10); border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; animation: cuFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .cu-card-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--ink-10); display: flex; align-items: center; gap: 0.5rem; }

  .cu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .cu-grid.full { grid-template-columns: 1fr; }
  .cu-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0; }
  .cu-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-60); }
  .cu-input { padding: 0.72rem 0.95rem; border: 1.5px solid var(--ink-10); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--ink); background: var(--off); transition: all 0.2s; outline: none; width: 100%; }
  .cu-input:focus { border-color: var(--amber); background: #fff; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
  .cu-input:disabled { color: var(--ink-60); cursor: not-allowed; opacity: 0.7; }
  .cu-input.select { appearance: none; cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%238a8480' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 2rem; }
  .cu-textarea { padding: 0.72rem 0.95rem; border: 1.5px solid var(--ink-10); border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: var(--ink); background: var(--off); transition: all 0.2s; outline: none; width: 100%; min-height: 110px; resize: vertical; line-height: 1.6; }
  .cu-textarea:focus { border-color: var(--amber); background: #fff; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
  .cu-hint { font-size: 0.7rem; color: var(--ink-60); display: flex; align-items: center; gap: 0.3rem; }

  .cu-submit { width: 100%; padding: 0.85rem; background: var(--navy); color: #fff; border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: background 0.2s, transform 0.15s; position: relative; overflow: hidden; margin-top: 0.5rem; }
  .cu-submit::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2.5px; background: var(--amber); transform: scaleX(0); transition: transform 0.25s; transform-origin: left; }
  .cu-submit:hover:not(:disabled) { background: var(--navy-lt); transform: translateY(-1px); }
  .cu-submit:hover:not(:disabled)::after { transform: scaleX(1); }
  .cu-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .cu-success { background: #ecfdf5; border: 1.5px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 3rem 2rem; text-align: center; animation: cuFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
  .cu-success-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(16,185,129,0.12); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 1.75rem; }
  .cu-success-title { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; margin-bottom: 0.5rem; }
  .cu-success-sub { font-size: 0.85rem; color: var(--ink-60); line-height: 1.6; margin-bottom: 1.5rem; }
  .cu-success-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.5rem; background: var(--navy); color: #fff; border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .cu-success-btn:hover { background: var(--navy-lt); }

  .cu-complaint-item { border: 1px solid var(--ink-10); border-radius: 12px; padding: 1.25rem; margin-bottom: 0.75rem; transition: box-shadow 0.2s; }
  .cu-complaint-item:hover { box-shadow: 0 4px 16px rgba(15,31,61,0.07); }
  .cu-complaint-item:last-child { margin-bottom: 0; }
  .cu-complaint-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
  .cu-complaint-issue { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
  .cu-status-pill { font-size: 0.68rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.05em; }
  .cu-status-pill.open       { background: rgba(239,68,68,0.1); color: #ef4444; }
  .cu-status-pill.in_review  { background: rgba(245,158,11,0.1); color: var(--amber-dk); }
  .cu-status-pill.resolved   { background: rgba(16,185,129,0.1); color: var(--green); }
  .cu-complaint-meta { font-size: 0.75rem; color: var(--ink-60); margin-bottom: 0.4rem; }
  .cu-complaint-note { font-size: 0.78rem; color: var(--ink-60); background: var(--off); border-radius: 7px; padding: 0.5rem 0.75rem; margin-top: 0.5rem; border-left: 3px solid var(--amber); }

  @media (max-width: 700px) {
    .cu-shell { grid-template-columns: 1fr; }
    .cu-sidebar { display: none; }
    .cu-body { padding: 1.25rem; }
    .cu-grid { grid-template-columns: 1fr; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("cu-css")) {
  const tag = document.createElement("style");
  tag.id = "cu-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

const ISSUE_LABELS = {
  wrong_item:    "Wrong Item Received",
  not_delivered: "Parcel Not Delivered",
  damaged:       "Parcel Damaged",
  late_delivery: "Late Delivery",
  stolen:        "Parcel Stolen / Missing",
  other:         "Other Issue",
};

const ContactUs = () => {
  const { user: ctxUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName:       ctxUser?.name  || "",
    userPhone:      ctxUser?.phone || "",
    issueType:      "",
    accepterName:   "",
    accepterPhone:  "",
    productDetails: "",
  });

  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("/complaints/mine");
        setMyComplaints(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "accepterPhone") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setForm(prev => ({ ...prev, accepterPhone: digits }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { userName, userPhone, issueType, accepterName, accepterPhone, productDetails } = form;
    if (!userName || !userPhone || !issueType || !accepterName || !accepterPhone || !productDetails) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("/complaints/submit", form);
      setSubmitted(true);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const initials = ctxUser?.name
    ? ctxUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "CB";

  return (
    <div className="cu-shell">

      {/* ── Sidebar ── */}
      <aside className="cu-sidebar">
        <div className="cu-sidebar-inner">
          <div className="cu-logo">
            <div className="cu-logo-icon">🚀</div>
            <span className="cu-logo-name">Courier<span>Buddy</span></span>
          </div>

          <div className="cu-nav-label">Menu</div>
          <nav className="cu-nav">
            <button className="cu-nav-item" onClick={() => navigate("/dashboard")}>
              <span className="cu-nav-icon">🏠</span> Dashboard
            </button>
            <button className="cu-nav-item" onClick={() => navigate("/create-delivery")}>
              <span className="cu-nav-icon">📦</span> New Delivery
            </button>
            <button className="cu-nav-item" onClick={() => navigate("/deliveries")}>
              <span className="cu-nav-icon">🚚</span> My Deliveries
            </button>
            <button className="cu-nav-item" onClick={() => navigate("/user-guide")}>
              <span className="cu-nav-icon">📖</span> User Guide
            </button>
          </nav>

          <div className="cu-nav-label">Support</div>
          <nav className="cu-nav">
            <button className="cu-nav-item active">
              <span className="cu-nav-icon">📩</span> Contact Us
            </button>
          </nav>

          <div className="cu-user-card">
            <div className="cu-avatar">{initials}</div>
            <div className="cu-user-info">
              <div className="cu-user-name">{ctxUser?.name || "User"}</div>
              <div className="cu-user-email">{ctxUser?.email || ""}</div>
            </div>
            <div style={{ display:"flex", gap:"0.2rem" }}>
              <button className="cu-icon-btn danger" onClick={handleLogout} title="Logout">↩</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="cu-main">
        <header className="cu-topbar">
          <span className="cu-topbar-title">Contact Us</span>
          {/* ── Back to Dashboard button ── */}
          <button className="cu-back-btn" onClick={() => navigate("/dashboard")} title="Back to Dashboard">
            🏠
          </button>
        </header>

        <div className="cu-body">
          <div className="cu-welcome">
            <div className="cu-welcome-eyebrow">We're here to help 💬</div>
            <h1 className="cu-welcome-title">Report a <span>Delivery Issue</span></h1>
            <p className="cu-welcome-sub">Fill in the details below and our team will look into it as soon as possible.</p>
          </div>

          {submitted ? (
            <div className="cu-success">
              <div className="cu-success-icon">✅</div>
              <div className="cu-success-title">Complaint Submitted!</div>
              <p className="cu-success-sub">
                Your complaint has been recorded and our admin team has been notified.<br />
                We'll review it and get back to you shortly.
              </p>
              <button className="cu-success-btn" onClick={() => { setSubmitted(false); setForm(prev => ({ ...prev, issueType:"", accepterName:"", accepterPhone:"", productDetails:"" })); }}>
                + Submit Another
              </button>
            </div>
          ) : (
            <>
              <div className="cu-card">
                <div className="cu-card-title">👤 Your Information</div>
                <div className="cu-grid">
                  <div className="cu-field">
                    <label className="cu-label">Your Name</label>
                    <input className="cu-input" type="text" name="userName" value={form.userName} onChange={handleChange} placeholder="Full name" />
                  </div>
                  <div className="cu-field">
                    <label className="cu-label">Your Phone</label>
                    <input className="cu-input" type="tel" name="userPhone" value={form.userPhone} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
                    <span className="cu-hint">🔒 Pre-filled from your account</span>
                  </div>
                </div>
              </div>

              <div className="cu-card">
                <div className="cu-card-title">⚠️ Issue Details</div>
                <div className="cu-grid full" style={{ gap:"1rem" }}>
                  <div className="cu-field">
                    <label className="cu-label">Type of Issue</label>
                    <select className="cu-input select" name="issueType" value={form.issueType} onChange={handleChange}>
                      <option value="">— Select an issue —</option>
                      <option value="wrong_item">Wrong Item Received</option>
                      <option value="not_delivered">Parcel Not Delivered</option>
                      <option value="damaged">Parcel Damaged</option>
                      <option value="late_delivery">Late Delivery</option>
                      <option value="stolen">Parcel Stolen / Missing</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>
                  <div className="cu-field">
                    <label className="cu-label">Product Details</label>
                    <textarea className="cu-textarea" name="productDetails" value={form.productDetails} onChange={handleChange} placeholder="Describe the product — what it is, estimated value, order ID if available…" />
                  </div>
                </div>
              </div>

              <div className="cu-card">
                <div className="cu-card-title">🚚 Accepter Information</div>
                <div className="cu-grid">
                  <div className="cu-field">
                    <label className="cu-label">Accepter Name</label>
                    <input className="cu-input" type="text" name="accepterName" value={form.accepterName} onChange={handleChange} placeholder="Person who accepted delivery" />
                  </div>
                  <div className="cu-field">
                    <label className="cu-label">Accepter Phone</label>
                    <input className="cu-input" type="tel" name="accepterPhone" value={form.accepterPhone} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
                  </div>
                </div>
              </div>

              <button className="cu-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "⏳ Submitting…" : "📩 Submit Complaint"}
              </button>
            </>
          )}

          {myComplaints.length > 0 && (
            <div className="cu-card" style={{ marginTop:"2rem" }}>
              <div className="cu-card-title">🗂️ Your Past Complaints</div>
              {loadingHistory ? (
                <p style={{ fontSize:"0.82rem", color:"var(--ink-60)" }}>Loading…</p>
              ) : (
                myComplaints.map(c => (
                  <div className="cu-complaint-item" key={c._id}>
                    <div className="cu-complaint-top">
                      <span className="cu-complaint-issue">{ISSUE_LABELS[c.issueType] || c.issueType}</span>
                      <span className={`cu-status-pill ${c.status}`}>{c.status.replace("_", " ")}</span>
                    </div>
                    <div className="cu-complaint-meta">
                      Accepter: {c.accepterName} · {c.accepterPhone} · {new Date(c.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </div>
                    <div className="cu-complaint-meta">{c.productDetails}</div>
                    {c.adminNote && (
                      <div className="cu-complaint-note">💬 Admin: {c.adminNote}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
