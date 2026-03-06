import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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

/* ─── CSS ─────────────────────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:      #0f1f3d;
    --navy-lt:   #162848;
    --navy-pale: #1e3460;
    --amber:     #f59e0b;
    --amber-dk:  #d97706;
    --amber-lt:  #fffbeb;
    --white:     #ffffff;
    --off:       #f4f6fb;
    --ink:       #0f1f3d;
    --ink-60:    rgba(15,31,61,0.6);
    --ink-30:    rgba(15,31,61,0.18);
    --ink-10:    rgba(15,31,61,0.07);
    --green:     #10b981;
    --red:       #ef4444;
    --radius:    10px;
    --sidebar-w: 240px;
  }

  body { background: var(--off); font-family: 'DM Sans', sans-serif; }

  .cbd-shell { display: grid; grid-template-columns: var(--sidebar-w) 1fr; min-height: 100vh; }

  .cbd-sidebar { background: var(--navy); display: flex; flex-direction: column; padding: 0; position: sticky; top: 0; height: 100vh; overflow: hidden; }
  .cbd-sidebar::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 24px 24px; pointer-events: none; }
  .cbd-sidebar::after { content: ''; position: absolute; width: 360px; height: 360px; border-radius: 50%; border: 1px solid rgba(245,158,11,0.1); bottom: -140px; right: -140px; pointer-events: none; }

  .cbd-sidebar-inner { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; padding: inherit; }

  .cbd-logo { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 2.5rem; text-decoration: none; }
  .cbd-logo-icon { width: 34px; height: 34px; background: var(--amber); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .cbd-logo-name { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: var(--white); letter-spacing: -0.02em; }
  .cbd-logo-name span { color: var(--amber); }

  .cbd-nav-label { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 0.5rem; padding: 0 0.5rem; }
  .cbd-nav { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; }
  .cbd-nav-item { display: flex; align-items: center; gap: 0.7rem; padding: 0.65rem 0.75rem; border-radius: var(--radius); font-size: 0.875rem; font-weight: 500; color: rgba(255,255,255,0.5); cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; transition: background 0.18s, color 0.18s; font-family: 'DM Sans', sans-serif; text-decoration: none; }
  .cbd-nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .cbd-nav-item.active { background: rgba(245,158,11,0.12); color: var(--amber); font-weight: 600; }
  .cbd-nav-icon { font-size: 1rem; opacity: 0.5; flex-shrink: 0; width: 20px; text-align: center; }
  .cbd-nav-item.active .cbd-nav-icon, .cbd-nav-item:hover .cbd-nav-icon { opacity: 1; }

  .cbd-user-card { margin-top: auto; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); padding: 0.9rem; display: flex; align-items: center; gap: 0.7rem; }
  .cbd-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 800; color: #0f1f3d; flex-shrink: 0; }
  .cbd-user-info { flex: 1; min-width: 0; }
  .cbd-user-name { font-size: 0.82rem; font-weight: 600; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cbd-user-email { font-size: 0.7rem; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cbd-user-actions { display: flex; align-items: center; gap: 0.2rem; flex-shrink: 0; }
  .cbd-icon-btn { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 0.85rem; padding: 0.2rem; transition: color 0.2s; line-height: 1; }
  .cbd-icon-btn:hover { color: rgba(255,255,255,0.8); }
  .cbd-icon-btn.danger:hover { color: #ef4444; }

  .cbd-main { display: flex; flex-direction: column; min-height: 100vh; overflow: hidden; }

  .cbd-topbar { background: var(--white); border-bottom: 1px solid var(--ink-10); padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; position: sticky; top: 0; z-index: 10; }
  .cbd-topbar-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; }
  .cbd-topbar-right { display: flex; align-items: center; gap: 0.75rem; }
  .cbd-notif-btn { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid var(--ink-30); background: transparent; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; cursor: pointer; transition: background 0.2s; position: relative; }
  .cbd-notif-btn:hover { background: var(--off); }
  .cbd-notif-dot { position: absolute; top: 4px; right: 4px; width: 7px; height: 7px; border-radius: 50%; background: var(--amber); border: 1.5px solid var(--white); }
  .cbd-cta-btn { display: flex; align-items: center; gap: 0.45rem; padding: 0.55rem 1rem; background: var(--navy); color: var(--white); border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; position: relative; overflow: hidden; }
  .cbd-cta-btn::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2.5px; background: var(--amber); transform: scaleX(0); transition: transform 0.25s ease; transform-origin: left; }
  .cbd-cta-btn:hover { background: var(--navy-lt); transform: translateY(-1px); }
  .cbd-cta-btn:hover::after { transform: scaleX(1); }

  .cbd-body { padding: 2rem; flex: 1; }
  .cbd-welcome { margin-bottom: 2rem; animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  .cbd-welcome-eyebrow { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-60); margin-bottom: 0.3rem; }
  .cbd-welcome-title { font-family: 'Syne', sans-serif; font-size: 1.65rem; font-weight: 800; color: var(--ink); letter-spacing: -0.02em; line-height: 1.2; }
  .cbd-welcome-title span { color: var(--amber); }

  .cbd-banner { display: flex; align-items: center; gap: 1rem; background: #fff7ed; border: 1.5px solid rgba(245,158,11,0.3); border-radius: var(--radius); padding: 1rem 1.25rem; margin-bottom: 2rem; animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .cbd-banner-icon { width: 38px; height: 38px; border-radius: 50%; background: rgba(245,158,11,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
  .cbd-banner-text { flex: 1; }
  .cbd-banner-title { font-size: 0.88rem; font-weight: 600; color: var(--ink); margin-bottom: 0.15rem; }
  .cbd-banner-sub { font-size: 0.78rem; color: var(--ink-60); }
  .cbd-banner-btn { padding: 0.5rem 1rem; background: var(--amber); color: var(--navy); border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.2s, transform 0.15s; flex-shrink: 0; }
  .cbd-banner-btn:hover { background: var(--amber-dk); color: var(--white); transform: translateY(-1px); }
  .cbd-banner.rejected { background: #fff1f2; border-color: rgba(239,68,68,0.3); align-items: flex-start; }
  .cbd-banner.rejected .cbd-banner-icon { background: rgba(239,68,68,0.12); }
  .cbd-banner.rejected .cbd-banner-btn { background: var(--red); color: var(--white); margin-top: 0.15rem; }
  .cbd-banner.rejected .cbd-banner-btn:hover { background: #dc2626; }
  .cbd-banner-reason { font-size: 0.75rem; color: var(--red); font-weight: 500; margin-top: 0.2rem; }
  .cbd-banner-timer { font-size: 0.72rem; color: var(--ink-60); margin-top: 0.15rem; }

  .cbd-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
  .cbd-action-card { background: var(--white); border: 1px solid var(--ink-10); border-radius: var(--radius); padding: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; text-align: left; border-left: 3px solid transparent; }
  .cbd-action-card:nth-child(1) { animation-delay: 0.26s; }
  .cbd-action-card:nth-child(2) { animation-delay: 0.32s; }
  .cbd-action-card:hover { box-shadow: 0 10px 30px rgba(15,31,61,0.1); transform: translateY(-3px); border-left-color: var(--amber); }
  .cbd-action-icon-wrap { width: 46px; height: 46px; border-radius: 12px; background: var(--off); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 0.25rem; transition: background 0.2s; }
  .cbd-action-card:hover .cbd-action-icon-wrap { background: var(--amber-lt); }
  .cbd-action-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }
  .cbd-action-desc { font-size: 0.8rem; color: var(--ink-60); line-height: 1.5; font-weight: 400; }
  .cbd-action-arrow { margin-top: 0.5rem; font-size: 0.78rem; font-weight: 600; color: var(--amber-dk); display: flex; align-items: center; gap: 0.3rem; transition: gap 0.2s; }
  .cbd-action-card:hover .cbd-action-arrow { gap: 0.5rem; }

  .cbd-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .cbd-section-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; }
  .cbd-see-all { font-size: 0.75rem; font-weight: 600; color: var(--amber-dk); background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; transition: opacity 0.2s; }
  .cbd-see-all:hover { opacity: 0.7; }

  .cbd-activity { background: var(--white); border: 1px solid var(--ink-10); border-radius: var(--radius); overflow: hidden; animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.36s both; }
  .cbd-activity-row { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--ink-10); transition: background 0.15s; }
  .cbd-activity-row:last-child { border-bottom: none; }
  .cbd-activity-row:hover { background: var(--off); }
  .cbd-act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .cbd-act-dot.delivered { background: var(--green); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
  .cbd-act-dot.transit { background: var(--amber); box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
  .cbd-act-dot.pending { background: var(--ink-30); box-shadow: 0 0 0 3px var(--ink-10); }
  .cbd-act-info { flex: 1; }
  .cbd-act-title { font-size: 0.83rem; font-weight: 500; color: var(--ink); }
  .cbd-act-time { font-size: 0.72rem; color: var(--ink-60); margin-top: 0.1rem; }
  .cbd-act-badge { font-size: 0.68rem; font-weight: 600; padding: 0.2rem 0.55rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.04em; }
  .cbd-act-badge.delivered { background: rgba(16,185,129,0.1); color: var(--green); }
  .cbd-act-badge.transit { background: rgba(245,158,11,0.1); color: var(--amber-dk); }
  .cbd-act-badge.pending { background: var(--ink-10); color: var(--ink-60); }

  @media (max-width: 900px) { .cbd-actions { grid-template-columns: 1fr; } }
  @media (max-width: 700px) { .cbd-shell { grid-template-columns: 1fr; } .cbd-sidebar { display: none; } .cbd-body { padding: 1.25rem; } .cbd-topbar { padding: 0.9rem 1.25rem; } }

  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalSlideUp { from { opacity: 0; transform: translateY(28px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
  @keyframes toastSlideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .pm-input:focus { outline: none; border-color: #f59e0b !important; background: #ffffff !important; box-shadow: 0 0 0 3px rgba(245,158,11,0.15) !important; }
  .pm-save-btn:hover:not(:disabled) { background: #162848 !important; transform: translateY(-1px); }
  .pm-cancel-btn:hover { border-color: #0f1f3d !important; color: #0f1f3d !important; background: #ffffff !important; }
  .pm-close-btn:hover { background: rgba(239,68,68,0.2) !important; border-color: rgba(239,68,68,0.4) !important; color: #fca5a5 !important; }
`;

if (typeof document !== "undefined" && !document.getElementById("cbd-css")) {
  const tag = document.createElement("style");
  tag.id = "cbd-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

const S = {
  overlay: { position:"fixed",inset:0,background:"rgba(10,20,40,0.6)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",animation:"overlayIn 0.22s ease both",fontFamily:"'DM Sans', sans-serif" },
  modal: { background:"#ffffff",borderRadius:"18px",width:"100%",maxWidth:"460px",overflow:"hidden",boxShadow:"0 40px 100px rgba(10,20,40,0.28)",animation:"modalSlideUp 0.3s cubic-bezier(0.22,1,0.36,1) both" },
  header: { background:"linear-gradient(135deg, #0f1f3d 0%, #1a3260 100%)",padding:"1.6rem 1.75rem 1.4rem",position:"relative",overflow:"hidden" },
  headerBgDot: { position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",backgroundSize:"22px 22px",pointerEvents:"none" },
  headerArc1: { position:"absolute",width:"260px",height:"260px",borderRadius:"50%",border:"1px solid rgba(245,158,11,0.14)",top:"-110px",right:"-70px",pointerEvents:"none" },
  headerArc2: { position:"absolute",width:"140px",height:"140px",borderRadius:"50%",background:"radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",bottom:"-40px",left:"-30px",pointerEvents:"none" },
  headerInner: { position:"relative",zIndex:1 },
  headerTopRow: { display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.25rem" },
  eyebrow: { fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:"#f59e0b",marginBottom:"0.25rem",fontFamily:"'DM Sans', sans-serif" },
  modalTitle: { fontFamily:"'Syne', sans-serif",fontSize:"1.3rem",fontWeight:800,color:"#ffffff",letterSpacing:"-0.025em",lineHeight:1.1 },
  closeBtn: { width:"34px",height:"34px",borderRadius:"9px",border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.55)",fontSize:"0.9rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.18s",flexShrink:0,marginTop:"2px",fontFamily:"sans-serif" },
  avatarRow: { display:"flex",alignItems:"center",gap:"1rem",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"0.85rem 1rem" },
  bigAvatar: { width:"50px",height:"50px",borderRadius:"50%",background:"linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne', sans-serif",fontSize:"1.15rem",fontWeight:800,color:"#0f1f3d",flexShrink:0,border:"2px solid rgba(255,255,255,0.18)",boxShadow:"0 4px 12px rgba(245,158,11,0.3)" },
  avatarName: { fontSize:"0.92rem",fontWeight:600,color:"#ffffff",fontFamily:"'DM Sans', sans-serif",lineHeight:1.2 },
  avatarRole: { fontSize:"0.72rem",color:"rgba(255,255,255,0.42)",marginTop:"0.2rem",fontFamily:"'DM Sans', sans-serif" },
  body: { padding:"1.6rem 1.75rem 1.25rem" },
  sectionLabel: { fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(15,31,61,0.45)",marginBottom:"0.9rem",fontFamily:"'DM Sans', sans-serif" },
  field: { marginBottom:"1rem" },
  label: { display:"block",fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(15,31,61,0.5)",marginBottom:"0.4rem",fontFamily:"'DM Sans', sans-serif" },
  input: { width:"100%",padding:"0.72rem 0.95rem",border:"1.5px solid rgba(15,31,61,0.1)",borderRadius:"9px",fontFamily:"'DM Sans', sans-serif",fontSize:"0.875rem",color:"#0f1f3d",background:"#f4f6fb",transition:"all 0.2s",outline:"none",boxSizing:"border-box" },
  inputDisabled: { width:"100%",padding:"0.72rem 0.95rem",border:"1.5px solid rgba(15,31,61,0.06)",borderRadius:"9px",fontFamily:"'DM Sans', sans-serif",fontSize:"0.875rem",color:"rgba(15,31,61,0.4)",background:"rgba(15,31,61,0.03)",outline:"none",boxSizing:"border-box",cursor:"not-allowed" },
  hint: { fontSize:"0.7rem",color:"rgba(15,31,61,0.45)",marginTop:"0.3rem",display:"flex",alignItems:"center",gap:"0.3rem",fontFamily:"'DM Sans', sans-serif" },
  divider: { border:"none",borderTop:"1px solid rgba(15,31,61,0.07)",margin:"1.1rem 0" },
  footer: { display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"0.65rem",padding:"1rem 1.75rem 1.4rem",borderTop:"1px solid rgba(15,31,61,0.07)",background:"#f8f9fc" },
  cancelBtn: { padding:"0.65rem 1.2rem",border:"1.5px solid rgba(15,31,61,0.18)",borderRadius:"9px",background:"transparent",fontFamily:"'DM Sans', sans-serif",fontSize:"0.83rem",fontWeight:600,color:"rgba(15,31,61,0.55)",cursor:"pointer",transition:"all 0.18s" },
  saveBtn: { padding:"0.65rem 1.35rem",border:"none",borderRadius:"9px",background:"#0f1f3d",fontFamily:"'DM Sans', sans-serif",fontSize:"0.83rem",fontWeight:700,color:"#ffffff",cursor:"pointer",transition:"all 0.18s",display:"flex",alignItems:"center",gap:"0.45rem",position:"relative",overflow:"hidden" },
  saveBtnAccent: { position:"absolute",bottom:0,left:0,right:0,height:"2px",background:"#f59e0b" },
  toast: { position:"fixed",bottom:"1.75rem",right:"1.75rem",zIndex:10000,background:"#0f1f3d",color:"#ffffff",borderRadius:"10px",padding:"0.85rem 1.2rem",display:"flex",alignItems:"center",gap:"0.65rem",fontSize:"0.83rem",fontWeight:500,boxShadow:"0 16px 40px rgba(15,31,61,0.22)",borderLeft:"3px solid #10b981",animation:"toastSlideUp 0.3s cubic-bezier(0.22,1,0.36,1) both",fontFamily:"'DM Sans', sans-serif" },
};

/* ─── Component ─────────────────────────────────────────────────────── */
const Dashboard = () => {
  const { user: ctxUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ── fetch fresh user from DB on mount ──
     The context user is set at login and never updates, so rejectionReason
     and verificationStatus changes made by admin won't show without this fetch. */
  const [freshUser, setFreshUser] = useState(null);
  const user = freshUser || ctxUser;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile");
        const fetchedUser = res.data.user;
        // If admin has blocked this user, log them out immediately
        if (fetchedUser?.isBlocked) {
          logout();
          navigate("/");
          return;
        }
        setFreshUser(fetchedUser);
      } catch (err) {
        // If 403, likely blocked — force logout
        if (err?.response?.status === 403) {
          logout();
          navigate("/");
        }
        console.error("Failed to fetch fresh profile:", err);
      }
    };
    fetchProfile();
  }, []);

  /* ── profile modal state ── */
  const [showProfile, setShowProfile] = useState(false);
  const [email, setEmail]   = useState("");
  const [phone, setPhone]   = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState(false);

  /* sync modal fields whenever user data arrives */
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  /* ── updateProfile ── */
  const updateProfile = async () => {
    setSaving(true);
    try {
      await axios.put("/api/user/update-profile", { email, phone });
      setShowProfile(false);
      setToast(true);
      const res = await axios.get("/api/user/profile");
      setFreshUser(res.data.user);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.log("FULL ERROR:", err);
      alert(err.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "CB";

  const isVerified = user?.verificationStatus === "approved";
  const isRejected = user?.verificationStatus === "rejected";

  const verificationBadge = isVerified
    ? { icon: "✅", text: "Verified account",     color: "#10b981" }
    : isRejected
    ? { icon: "❌", text: "Verification rejected", color: "#ef4444" }
    : { icon: "⚠️", text: "Unverified account",   color: "#f59e0b" };

  return (
    <>
      <div className="cbd-shell">

        {/* ══ SIDEBAR ══ */}
        <aside className="cbd-sidebar">
          <div className="cbd-sidebar-inner">
            <div className="cbd-logo">
              <div className="cbd-logo-icon">🚀</div>
              <span className="cbd-logo-name">Courier<span>Buddy</span></span>
            </div>

            <div className="cbd-nav-label">Menu</div>
            <nav className="cbd-nav">
              <button className="cbd-nav-item active">
                <span className="cbd-nav-icon">🏠</span> Dashboard
              </button>
              <button className="cbd-nav-item" onClick={() => navigate("/create-delivery")}>
                <span className="cbd-nav-icon">📦</span> New Delivery
              </button>
              <button className="cbd-nav-item" onClick={() => navigate("/deliveries")}>
                <span className="cbd-nav-icon">🚚</span> My Deliveries
              </button>
              <button className="cbd-nav-item" onClick={() => navigate("/user-guide")}>
                <span className="cbd-nav-icon">📖</span> User Guide
              </button>
              {/* ── Contact Us nav item ── */}
              <button className="cbd-nav-item" onClick={() => navigate("/contact")}>
                <span className="cbd-nav-icon">📩</span> Contact Us
              </button>
            </nav>

            {!isVerified && (
              <>
                <div className="cbd-nav-label">Account</div>
                <nav className="cbd-nav">
                  <button className="cbd-nav-item" onClick={() => navigate("/verify")}>
                    <span className="cbd-nav-icon">{isRejected ? "❌" : "⚠️"}</span> Verify Account
                  </button>
                </nav>
              </>
            )}

            <div className="cbd-user-card">
              <div className="cbd-avatar">{initials}</div>
              <div className="cbd-user-info">
                <div className="cbd-user-name">{user?.name || "User"}</div>
                <div className="cbd-user-email">{user?.email || ""}</div>
              </div>
              <div className="cbd-user-actions">
                <button className="cbd-icon-btn" onClick={() => setShowProfile(true)} title="Edit Profile" aria-label="Edit Profile">✏️</button>
                <button className="cbd-icon-btn danger" onClick={handleLogout} title="Logout" aria-label="Logout">↩</button>
              </div>
            </div>
          </div>
        </aside>

        {/* ══ MAIN ══ */}
        <div className="cbd-main">
          <header className="cbd-topbar">
            <span className="cbd-topbar-title">Dashboard</span>
            <div className="cbd-topbar-right">
              <button className="cbd-notif-btn" aria-label="Notifications">
                🔔 <span className="cbd-notif-dot" />
              </button>
              <button className="cbd-cta-btn" onClick={() => navigate("/create-delivery")}>
                + New Delivery
              </button>
            </div>
          </header>

          <div className="cbd-body">
            <div className="cbd-welcome">
              <div className="cbd-welcome-eyebrow">Good to see you back 👋</div>
              <h1 className="cbd-welcome-title">
                Welcome, <span>{user?.name?.split(" ")[0] || "there"}</span>
              </h1>
            </div>

            {/* ── Rejected banner — shows reason from fresh DB data ── */}
            {isRejected && (
              <div className="cbd-banner rejected" role="alert">
                <div className="cbd-banner-icon">❌</div>
                <div className="cbd-banner-text">
                  <div className="cbd-banner-title">Verification rejected</div>
                  {user?.rejectionReason && (
                    <div className="cbd-banner-reason">Reason: {user.rejectionReason}</div>
                  )}
                  <div className="cbd-banner-timer">⏳ Please reverify within 12 hours.</div>
                </div>
                <button className="cbd-banner-btn" onClick={() => navigate("/verify")}>
                  Reverify now →
                </button>
              </div>
            )}

            {/* ── Pending banner ── */}
            {!isVerified && !isRejected && (
              <div className="cbd-banner" role="alert">
                <div className="cbd-banner-icon">⚠️</div>
                <div className="cbd-banner-text">
                  <div className="cbd-banner-title">Your account isn't verified yet</div>
                  <div className="cbd-banner-sub">Complete verification to unlock all delivery features.</div>
                </div>
                <button className="cbd-banner-btn" onClick={() => navigate("/verify")}>
                  Verify now →
                </button>
              </div>
            )}

            <div className="cbd-actions">
              <button className="cbd-action-card" onClick={() => navigate("/create-delivery")}>
                <div className="cbd-action-icon-wrap">📦</div>
                <div className="cbd-action-title">Create Delivery</div>
                <div className="cbd-action-desc">Send a new parcel. Set pickup, destination, and preferences instantly.</div>
                <div className="cbd-action-arrow">Get started →</div>
              </button>
              <button className="cbd-action-card" onClick={() => navigate("/deliveries")}>
                <div className="cbd-action-icon-wrap">🗂️</div>
                <div className="cbd-action-title">View Deliveries</div>
                <div className="cbd-action-desc">Track all your active and past deliveries with live status updates.</div>
                <div className="cbd-action-arrow">View all →</div>
              </button>
              <button className="cbd-action-card" onClick={() => navigate("/user-guide")} style={{ gridColumn: "1 / -1" }}>
                <div className="cbd-action-icon-wrap">📖</div>
                <div className="cbd-action-title">User Guide</div>
                <div className="cbd-action-desc">New here? Learn how CourierBuddy works, our community values, and how to be a trusted member of the platform.</div>
                <div className="cbd-action-arrow">Read the guide →</div>
              </button>
              {/* ── Contact Us action card ── */}
              <button className="cbd-action-card" onClick={() => navigate("/contact")} style={{ gridColumn: "1 / -1" }}>
                <div className="cbd-action-icon-wrap">📩</div>
                <div className="cbd-action-title">Contact Us</div>
                <div className="cbd-action-desc">Facing a delivery issue? Report it to our team and we'll look into it right away.</div>
                <div className="cbd-action-arrow">Report an issue →</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {/* ══ PROFILE EDIT MODAL ══ */}
      {showProfile && (
        <div style={S.overlay} role="dialog" aria-modal="true" aria-labelledby="pm-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowProfile(false); }}>
          <div style={S.modal}>

            <div style={S.header}>
              <div style={S.headerBgDot} />
              <div style={S.headerArc1} />
              <div style={S.headerArc2} />
              <div style={S.headerInner}>
                <div style={S.headerTopRow}>
                  <div>
                    <div style={S.eyebrow}>Account Settings</div>
                    <div style={S.modalTitle} id="pm-title">Edit Profile</div>
                  </div>
                  <button style={S.closeBtn} className="pm-close-btn" onClick={() => setShowProfile(false)} aria-label="Close">✕</button>
                </div>
                <div style={S.avatarRow}>
                  <div style={S.bigAvatar}>{initials}</div>
                  <div>
                    <div style={S.avatarName}>{user?.name || "User"}</div>
                    <div style={{ ...S.avatarRole, color: verificationBadge.color }}>
                      {verificationBadge.icon} {verificationBadge.text}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={S.body}>
              <div style={S.sectionLabel}>Personal Information</div>

              <div style={S.field}>
                <label style={S.label}>Full Name</label>
                <input style={S.inputDisabled} type="text" value={user?.name || ""} disabled />
                <div style={S.hint}><span>🔒</span> Name changes require contacting support.</div>
              </div>

              <hr style={S.divider} />

              <div style={S.field}>
                <label style={S.label}>Email Address</label>
                <input style={S.input} className="pm-input" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div style={{ ...S.field, marginBottom: 0 }}>
                <label style={S.label}>Phone Number</label>
                <input style={S.input} className="pm-input" type="tel" placeholder="+1 000 000 0000"
                  value={phone} onChange={(e) => { const d = e.target.value.replace(/\D/g,"").slice(0,10); setPhone(d); }} maxLength={10} />
                <div style={{ display:"flex",alignItems:"center",gap:"0.35rem",marginTop:"0.45rem",fontSize:"0.86rem",fontFamily:"'DM Sans', sans-serif",color:"#d97706",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:"6px",padding:"0.4rem 0.65rem" }}>
                  <span style={{ fontSize:"0.8rem" }}>⚠️</span>
                  <span>You can change your details <strong>only 3 times</strong>. Use this carefully.</span>
                </div>
              </div>
            </div>

            <div style={S.footer}>
              <button style={S.cancelBtn} className="pm-cancel-btn" onClick={() => setShowProfile(false)}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} className="pm-save-btn" onClick={updateProfile} disabled={saving}>
                <span style={S.saveBtnAccent} />
                {saving ? "⏳ Saving…" : "💾 Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SUCCESS TOAST ══ */}
      {toast && <div style={S.toast} role="status">✅ Profile updated successfully</div>}
    </>
  );
};


export default Dashboard;
