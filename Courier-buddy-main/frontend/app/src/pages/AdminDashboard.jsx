import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ── Complaint Card sub-component ── */
const ISSUE_LABELS = {
    wrong_item:    "Wrong Item Received",
    not_delivered: "Parcel Not Delivered",
    damaged:       "Parcel Damaged",
    late_delivery: "Late Delivery",
    stolen:        "Parcel Stolen / Missing",
    other:         "Other Issue",
};

const ComplaintCard = ({ c, i, updatingId, onUpdate }) => {
    const [status, setStatus] = useState(c.status);
    const [note, setNote]     = useState("");

    return (
        <div className="ad-c-card" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="ad-c-top">
                <span className="ad-c-issue">{ISSUE_LABELS[c.issueType] || c.issueType}</span>
                <span className={`ad-c-pill ${c.status}`}>{c.status.replace("_", " ")}</span>
            </div>
            <div className="ad-c-meta">
                From: <strong>{c.userName}</strong> · {c.userPhone} &nbsp;|&nbsp;
                Accepter: <strong>{c.accepterName}</strong> · {c.accepterPhone} &nbsp;|&nbsp;
                {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>
            <div className="ad-c-detail">{c.productDetails}</div>
            {c.adminNote && (
                <div className="ad-c-existing-note">💬 Previous note: {c.adminNote}</div>
            )}
            <div className="ad-c-actions">
                <select className="ad-c-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="open">Open</option>
                    <option value="in_review">In Review</option>
                    <option value="resolved">Resolved</option>
                </select>
                <input
                    className="ad-c-note-input"
                    type="text"
                    placeholder="Add a note to user…"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
                <button
                    className="ad-c-save"
                    disabled={updatingId === c._id}
                    onClick={() => onUpdate(c._id, status, note || c.adminNote)}
                >
                    {updatingId === c._id ? "Saving…" : "Save"}
                </button>
            </div>
        </div>
    );
};

/* ── Main AdminDashboard ── */
const AdminDashboard = () => {
    const [allUsers, setAllUsers]       = useState([]);
    const [error, setError]             = useState(null);
    const [loadingIds, setLoadingIds]   = useState({});
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [blockModal, setBlockModal]   = useState(null);
    const [blockReason, setBlockReason] = useState("");
    const [search, setSearch]           = useState("");
    const [complaints, setComplaints]   = useState([]);
    const [activeTab, setActiveTab]     = useState("users");
    const [updatingId, setUpdatingId]   = useState(null);
    const { logout } = useContext(AuthContext);
    const navigate   = useNavigate();

    /* ── Data fetching ── */
    const fetchAllUsers = async () => {
        try {
            setError(null);
            const res = await axios.get("/api/admin/all-users");
            setAllUsers(res.data);
        } catch (err) {
            setError(err.message || "Failed to fetch users");
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await axios.get("/api/complaints/all");
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllUsers();
        fetchComplaints();
    }, []);

    /* ── User actions ── */
    const approveUser = async (id) => {
        setLoadingIds(prev => ({ ...prev, [id]: "approving" }));
        try {
            await axios.put(`/api/admin/approve/${id}`);
            fetchAllUsers();
        } catch {
            alert("Error approving user");
        } finally {
            setLoadingIds(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
    };

    const openRejectModal  = (userId) => { setRejectReason(""); setRejectModal({ userId }); };
    const closeRejectModal = () => { setRejectModal(null); setRejectReason(""); };

    const confirmReject = async () => {
        if (!rejectReason.trim()) return;
        const id     = rejectModal.userId;
        const reason = rejectReason.trim();
        setLoadingIds(prev => ({ ...prev, [id]: "rejecting" }));
        closeRejectModal();
        try {
            await axios.put(`/api/admin/reject/${id}`, { reason }, { headers: { "Content-Type": "application/json" } });
            fetchAllUsers();
        } catch (err) {
            alert(`Error rejecting user: ${err?.response?.data?.message || err?.message}`);
        } finally {
            setLoadingIds(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
    };

    const openBlockModal  = (userId, userName) => { setBlockReason(""); setBlockModal({ userId, userName }); };
    const closeBlockModal = () => { setBlockModal(null); setBlockReason(""); };

    const confirmBlock = async () => {
        if (!blockReason.trim()) return;
        const id     = blockModal.userId;
        const reason = blockReason.trim();
        setLoadingIds(prev => ({ ...prev, [id]: "blocking" }));
        closeBlockModal();
        try {
            await axios.put(`/api/admin/block/${id}`, { reason }, { headers: { "Content-Type": "application/json" } });
            fetchAllUsers();
        } catch (err) {
            alert(`Error blocking user: ${err?.response?.data?.message || err?.message}`);
        } finally {
            setLoadingIds(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
    };

    const unblockUser = async (id) => {
        setLoadingIds(prev => ({ ...prev, [id]: "unblocking" }));
        try {
            await axios.put(`/api/admin/unblock/${id}`);
            fetchAllUsers();
        } catch (err) {
            alert(`Error unblocking user: ${err?.response?.data?.message || err?.message}`);
        } finally {
            setLoadingIds(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
    };

    /* ── Complaint actions ── */
    const updateComplaint = async (id, status, adminNote) => {
        setUpdatingId(id);
        try {
            await axios.put(`/complaints/update/${id}`, { status, adminNote });
            fetchComplaints();
        } catch {
            alert("Failed to update complaint");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleLogout = () => { logout(); navigate("/"); };

    /* ── Derived state ── */
    const q = search.trim().toLowerCase();
    const filteredUsers = q
        ? allUsers.filter(u =>
            u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.phone?.toLowerCase().includes(q)
          )
        : allUsers;

    const count         = allUsers.length;
    const pendingCount  = allUsers.filter(u => u.verificationStatus === "pending").length;
    const approvedCount = allUsers.filter(u => u.verificationStatus === "approved").length;
    const blockedCount  = allUsers.filter(u => u.isBlocked).length;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                :root {
                    --bg: #f4f1ec; --surface: #ffffff; --border: #e4dfd7;
                    --text: #1a1714; --muted: #8a8480;
                    --accent: #2d5f3f; --accent-lt: #e8f2ec;
                    --danger: #c0392b; --danger-lt: #fdf0ef;
                    --blocked: #7c3aed; --blocked-lt: #f3f0ff;
                }

                /* Layout */
                .ad-layout { display: grid; grid-template-columns: 240px 1fr; grid-template-rows: auto 1fr; min-height: 100vh; font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); }

                /* Sidebar */
                .ad-sidebar { grid-row: 1/-1; background: var(--text); color: #e8e4de; display: flex; flex-direction: column; padding: 36px 0; position: sticky; top: 0; height: 100vh; }
                .ad-logo { padding: 0 28px 32px; border-bottom: 1px solid #2e2b28; }
                .ad-logo h1 { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.3px; }
                .ad-logo span { font-size: 11px; font-weight: 300; color: #6a6660; display: block; margin-top: 3px; letter-spacing: 1.5px; text-transform: uppercase; }
                .ad-nav { flex: 1; padding: 24px 16px; display: flex; flex-direction: column; gap: 4px; }
                .ad-nav-section { font-size: 10px; text-transform: uppercase; letter-spacing: 1.8px; color: #3e3b38; padding: 16px 14px 6px; font-weight: 500; }
                .ad-nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; font-size: 14px; color: #6a6660; cursor: pointer; transition: all 0.18s; text-decoration: none; }
                .ad-nav-item:hover { background: #242220; color: #ccc7c0; }
                .ad-nav-item.active { background: #2a2724; color: #fff; font-weight: 500; }
                .ad-sidebar-footer { padding: 20px 16px 0; border-top: 1px solid #2e2b28; }
                .ad-logout-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 11px 14px; border-radius: 10px; background: transparent; border: none; color: #6a6660; font-family: 'Outfit', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.18s; }
                .ad-logout-btn:hover { background: #242220; color: #e07070; }

                /* Topbar */
                .ad-topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; }
                .ad-topbar-left h2 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; letter-spacing: -0.4px; }
                .ad-topbar-left p { font-size: 13px; color: var(--muted); margin-top: 2px; font-weight: 300; }
                .ad-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-lt); color: var(--accent); font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; border: 1px solid #c2dcc9; }
                .ad-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: adPulse 2s infinite; }
                @keyframes adPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

                /* Main */
                .ad-main { padding: 36px 40px; overflow-y: auto; }

                /* Stats */
                .ad-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
                .ad-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px 28px; }
                .ad-stat .ad-lbl { font-size: 11.5px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); font-weight: 500; margin-bottom: 10px; }
                .ad-stat .ad-val { font-family: 'Playfair Display', serif; font-size: 38px; color: var(--text); line-height: 1; margin-bottom: 6px; }
                .ad-stat .ad-val.accent  { color: var(--accent); }
                .ad-stat .ad-val.blocked { color: var(--blocked); }
                .ad-stat .ad-sub { font-size: 12.5px; color: var(--muted); font-weight: 300; }

                /* Error */
                .ad-error { background: var(--danger-lt); border: 1px solid #f2c0bc; border-radius: 10px; padding: 14px 20px; color: var(--danger); font-size: 13.5px; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }

                /* Tabs */
                .ad-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
                .ad-tab { padding: 9px 20px; border-radius: 9px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: 1.5px solid var(--border); background: transparent; color: var(--muted); transition: all 0.18s; display: flex; align-items: center; gap: 7px; }
                .ad-tab:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }
                .ad-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 600; }
                .ad-tab-badge { background: rgba(255,255,255,0.25); font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 100px; }
                .ad-tab:not(.active) .ad-tab-badge { background: var(--border); color: var(--muted); }

                /* Section header */
                .ad-section-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
                .ad-section-hdr h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 1.8px; color: var(--muted); font-weight: 500; }
                .ad-refresh-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 12.5px; padding: 6px 14px; border-radius: 7px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.18s; }
                .ad-refresh-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }

                /* Search */
                .ad-search-wrap { margin-bottom: 20px; position: relative; }
                .ad-search-input { width: 100%; padding: 11px 16px 11px 42px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text); background: var(--surface); outline: none; transition: border-color 0.18s, box-shadow 0.18s; }
                .ad-search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,95,63,0.1); }
                .ad-search-input::placeholder { color: #bbb5af; }
                .ad-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
                .ad-search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--muted); cursor: pointer; font-size: 16px; line-height: 1; padding: 2px 4px; border-radius: 4px; transition: color 0.15s; }
                .ad-search-clear:hover { color: var(--danger); }
                .ad-no-results { text-align: center; padding: 60px 0; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; color: var(--muted); font-size: 14px; font-weight: 300; }

                /* Empty */
                .ad-empty { text-align: center; padding: 80px 0; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; }
                .ad-empty-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--accent-lt); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
                .ad-empty p { color: var(--muted); font-size: 14.5px; font-weight: 300; }

                /* User cards */
                .ad-user-list { display: flex; flex-direction: column; gap: 14px; }
                .ad-user-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px 28px; display: grid; grid-template-columns: auto 1fr auto; gap: 20px; align-items: center; transition: box-shadow 0.2s, border-color 0.2s; animation: adSlideIn 0.3s ease both; }
                .ad-user-card.is-blocked { background: #faf9ff; border-color: #ddd6fe; }
                .ad-user-card:hover { border-color: #d4cfc8; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
                .ad-user-card.is-blocked:hover { border-color: #c4b5fd; }
                @keyframes adSlideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                .ad-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg,#e8f2ec,#c8dfd0); border: 2px solid #c2dcc9; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: var(--accent); flex-shrink: 0; }
                .ad-avatar.blocked-avatar { background: linear-gradient(135deg,#ede9fe,#ddd6fe); border-color: #c4b5fd; color: var(--blocked); }
                .ad-user-meta h3 { font-size: 15.5px; font-weight: 600; color: var(--text); letter-spacing: -0.2px; margin-bottom: 3px; }
                .ad-user-meta .ad-email { font-size: 13px; color: var(--muted); margin-bottom: 10px; font-weight: 300; }
                .ad-status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
                .ad-status-pill { display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
                .ad-status-pill.approved { background: var(--accent-lt); color: var(--accent); border: 1px solid #c2dcc9; }
                .ad-status-pill.pending  { background: #fefce8; color: #b45309; border: 1px solid #fde68a; }
                .ad-status-pill.rejected { background: var(--danger-lt); color: var(--danger); border: 1px solid #f2c0bc; }
                .ad-status-pill.blocked  { background: var(--blocked-lt); color: var(--blocked); border: 1px solid #ddd6fe; }
                .ad-user-images { display: flex; gap: 10px; }
                .ad-img-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; }
                .ad-img-wrap img { width: 68px; height: 68px; object-fit: cover; border-radius: 10px; border: 1.5px solid var(--border); cursor: zoom-in; transition: transform 0.2s, box-shadow 0.2s; }
                .ad-img-wrap img:hover { transform: scale(1.06); box-shadow: 0 6px 20px rgba(0,0,0,0.12); }
                .ad-img-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }

                /* Action buttons */
                .ad-actions { display: flex; flex-direction: column; gap: 8px; min-width: 130px; }
                .ad-btn { width: 100%; padding: 10px 0; border-radius: 9px; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500; cursor: pointer; border: none; transition: all 0.18s; letter-spacing: 0.2px; }
                .ad-btn:disabled { opacity: 0.45; cursor: not-allowed; }
                .ad-btn-approve { background: var(--accent); color: #fff; }
                .ad-btn-approve:hover:not(:disabled) { background: #245233; box-shadow: 0 4px 14px rgba(45,95,63,0.3); transform: translateY(-1px); }
                .ad-btn-reject { background: transparent; border: 1.5px solid var(--border); color: var(--muted); }
                .ad-btn-reject:hover:not(:disabled) { border-color: var(--danger); color: var(--danger); background: var(--danger-lt); }
                .ad-btn-block { background: transparent; border: 1.5px solid #ddd6fe; color: var(--blocked); }
                .ad-btn-block:hover:not(:disabled) { background: var(--blocked-lt); border-color: #c4b5fd; box-shadow: 0 4px 14px rgba(124,58,237,0.15); transform: translateY(-1px); }
                .ad-btn-unblock { background: var(--blocked); color: #fff; }
                .ad-btn-unblock:hover:not(:disabled) { background: #6d28d9; box-shadow: 0 4px 14px rgba(124,58,237,0.3); transform: translateY(-1px); }

                /* Complaint cards */
                .ad-c-list { display: flex; flex-direction: column; gap: 12px; }
                .ad-c-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 24px; animation: adSlideIn 0.3s ease both; }
                .ad-c-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .ad-c-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
                .ad-c-issue { font-size: 14.5px; font-weight: 600; color: var(--text); }
                .ad-c-pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.5px; }
                .ad-c-pill.open      { background: var(--danger-lt); color: var(--danger); border: 1px solid #f2c0bc; }
                .ad-c-pill.in_review { background: #fefce8; color: #b45309; border: 1px solid #fde68a; }
                .ad-c-pill.resolved  { background: var(--accent-lt); color: var(--accent); border: 1px solid #c2dcc9; }
                .ad-c-meta { font-size: 12.5px; color: var(--muted); margin-bottom: 8px; font-weight: 300; line-height: 1.6; }
                .ad-c-detail { font-size: 13px; color: var(--text); background: var(--bg); border-radius: 8px; padding: 8px 12px; margin-bottom: 12px; line-height: 1.5; }
                .ad-c-existing-note { font-size: 12.5px; color: var(--muted); background: var(--accent-lt); border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; padding: 6px 12px; margin-bottom: 12px; }
                .ad-c-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
                .ad-c-select { padding: 7px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--text); background: var(--surface); outline: none; cursor: pointer; }
                .ad-c-select:focus { border-color: var(--accent); }
                .ad-c-note-input { flex: 1; padding: 7px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--text); background: var(--surface); outline: none; min-width: 160px; }
                .ad-c-note-input:focus { border-color: var(--accent); }
                .ad-c-save { padding: 7px 16px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
                .ad-c-save:hover:not(:disabled) { background: #245233; transform: translateY(-1px); }
                .ad-c-save:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Modals */
                .ad-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: adFadeIn 0.18s ease; }
                @keyframes adFadeIn { from{opacity:0} to{opacity:1} }
                .ad-modal { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 32px 32px 28px; width: 100%; max-width: 440px; box-shadow: 0 24px 60px rgba(0,0,0,0.15); animation: adSlideUp 0.22s cubic-bezier(0.22,1,0.36,1); }
                @keyframes adSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .ad-modal-icon { width: 46px; height: 46px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
                .ad-modal-icon.danger { background: var(--danger-lt); border: 1px solid #f2c0bc; }
                .ad-modal-icon.block  { background: var(--blocked-lt); border: 1px solid #ddd6fe; }
                .ad-modal h3 { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 600; color: var(--text); margin-bottom: 6px; letter-spacing: -0.3px; }
                .ad-modal p { font-size: 13.5px; color: var(--muted); font-weight: 300; margin-bottom: 22px; line-height: 1.6; }
                .ad-modal-label { font-size: 11.5px; text-transform: uppercase; letter-spacing: 1.3px; font-weight: 500; color: var(--muted); margin-bottom: 8px; display: block; }
                .ad-modal-textarea { width: 100%; min-height: 100px; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text); background: var(--bg); resize: vertical; transition: border-color 0.18s; outline: none; margin-bottom: 6px; }
                .ad-modal-textarea:focus { border-color: var(--danger); background: #fff; }
                .ad-modal-textarea::placeholder { color: #bbb5af; }
                .ad-modal-char { font-size: 11.5px; color: var(--muted); text-align: right; margin-bottom: 22px; display: block; }
                .ad-modal-actions { display: flex; gap: 10px; }
                .ad-modal-cancel { flex: 1; padding: 11px 0; border-radius: 9px; border: 1.5px solid var(--border); background: transparent; color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; }
                .ad-modal-cancel:hover { background: var(--bg); color: var(--text); }
                .ad-modal-confirm { flex: 1; padding: 11px 0; border-radius: 9px; border: none; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
                .ad-modal-confirm.danger { background: var(--danger); color: #fff; }
                .ad-modal-confirm.danger:hover:not(:disabled) { background: #a93226; box-shadow: 0 4px 14px rgba(192,57,43,0.3); transform: translateY(-1px); }
                .ad-modal-confirm.block  { background: var(--blocked); color: #fff; }
                .ad-modal-confirm.block:hover:not(:disabled) { background: #6d28d9; box-shadow: 0 4px 14px rgba(124,58,237,0.3); transform: translateY(-1px); }
                .ad-modal-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

                @media (max-width: 900px) {
                    .ad-layout { grid-template-columns: 1fr; }
                    .ad-sidebar { display: none; }
                    .ad-stats { grid-template-columns: 1fr 1fr; }
                    .ad-user-card { grid-template-columns: auto 1fr; }
                    .ad-actions { flex-direction: row; grid-column: 1/-1; flex-wrap: wrap; }
                    .ad-modal { margin: 0 16px; }
                }
            `}</style>

            {/* ── Reject Modal ── */}
            {rejectModal && (
                <div className="ad-modal-overlay" onClick={closeRejectModal}>
                    <div className="ad-modal" onClick={e => e.stopPropagation()}>
                        <div className="ad-modal-icon danger">
                            <svg width="20" height="20" fill="none" stroke="#c0392b" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <h3>Reject Verification</h3>
                        <p>Please provide a reason for rejection. This will be shown to the user so they can re-submit correctly.</p>
                        <label className="ad-modal-label">Rejection Reason</label>
                        <textarea
                            className="ad-modal-textarea"
                            placeholder="e.g. ID photo is blurry, face not clearly visible…"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            maxLength={300}
                            autoFocus
                        />
                        <span className="ad-modal-char">{rejectReason.length} / 300</span>
                        <div className="ad-modal-actions">
                            <button className="ad-modal-cancel" onClick={closeRejectModal}>Cancel</button>
                            <button className="ad-modal-confirm danger" onClick={confirmReject} disabled={!rejectReason.trim()}>
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Block Modal ── */}
            {blockModal && (
                <div className="ad-modal-overlay" onClick={closeBlockModal}>
                    <div className="ad-modal" onClick={e => e.stopPropagation()}>
                        <div className="ad-modal-icon block">
                            <svg width="20" height="20" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                            </svg>
                        </div>
                        <h3>Block User</h3>
                        <p>
                            You are about to block <strong>{blockModal.userName}</strong>. Please provide a reason — this will be shown to the user when they try to log in.
                        </p>
                        <label className="ad-modal-label">Block Reason</label>
                        <textarea
                            className="ad-modal-textarea"
                            placeholder="e.g. Suspicious activity, Terms of service violation…"
                            value={blockReason}
                            onChange={e => setBlockReason(e.target.value)}
                            maxLength={300}
                            autoFocus
                        />
                        <span className="ad-modal-char">{blockReason.length} / 300</span>
                        <div className="ad-modal-actions">
                            <button className="ad-modal-cancel" onClick={closeBlockModal}>Cancel</button>
                            <button className="ad-modal-confirm block" onClick={confirmBlock} disabled={!blockReason.trim()}>
                                Block User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Layout ── */}
            <div className="ad-layout">

                {/* Sidebar */}
                <aside className="ad-sidebar">
                    <div className="ad-logo">
                        <h1>CourierBuddy</h1>
                        <span>Admin Portal</span>
                    </div>
                    <nav className="ad-nav">
                        <div className="ad-nav-section">Main</div>
                        <a className="ad-nav-item active" href="#">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9"/></svg>
                            Dashboard
                        </a>
                        <a className="ad-nav-item" href="#">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                            All Users
                        </a>
                        <a className="ad-nav-item" href="#">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Approved
                        </a>
                        <a className="ad-nav-item" href="#">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Rejected
                        </a>
                        <div className="ad-nav-section" style={{ marginTop: "12px" }}>Settings</div>
                        <a className="ad-nav-item" href="#">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                            Settings
                        </a>
                    </nav>
                    <div className="ad-sidebar-footer">
                        <button className="ad-logout-btn" onClick={handleLogout}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"/></svg>
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Topbar */}
                <header className="ad-topbar">
                    <div className="ad-topbar-left">
                        <h2>Admin Dashboard</h2>
                        <p>Manage users, verifications and complaints</p>
                    </div>
                    <span className="ad-badge">
                        <span className="ad-badge-dot" />
                        {count} Total Users
                    </span>
                </header>

                {/* Main */}
                <main className="ad-main">

                    {/* Stats */}
                    <div className="ad-stats">
                        <div className="ad-stat">
                            <div className="ad-lbl">Total Users</div>
                            <div className="ad-val accent">{count}</div>
                            <div className="ad-sub">registered accounts</div>
                        </div>
                        <div className="ad-stat">
                            <div className="ad-lbl">Approved</div>
                            <div className="ad-val">{approvedCount}</div>
                            <div className="ad-sub">verified users</div>
                        </div>
                        <div className="ad-stat">
                            <div className="ad-lbl">Pending</div>
                            <div className="ad-val" style={{ color: pendingCount > 0 ? "#b8860b" : "#2d5f3f" }}>{pendingCount}</div>
                            <div className="ad-sub">awaiting review</div>
                        </div>
                        <div className="ad-stat">
                            <div className="ad-lbl">Blocked</div>
                            <div className="ad-val blocked">{blockedCount}</div>
                            <div className="ad-sub">restricted accounts</div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="ad-error">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {error}
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="ad-tabs">
                        <button className={`ad-tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                            👥 Users <span className="ad-tab-badge">{count}</span>
                        </button>
                        <button className={`ad-tab ${activeTab === "complaints" ? "active" : ""}`} onClick={() => setActiveTab("complaints")}>
                            📩 Complaints <span className="ad-tab-badge">{complaints.length}</span>
                        </button>
                    </div>

                    {/* ── Complaints Tab ── */}
                    {activeTab === "complaints" && (
                        <div>
                            <div className="ad-section-hdr">
                                <h3>All Complaints</h3>
                                <button className="ad-refresh-btn" onClick={fetchComplaints}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                                    Refresh
                                </button>
                            </div>
                            {complaints.length === 0 ? (
                                <div className="ad-empty">
                                    <div className="ad-empty-icon">
                                        <svg width="24" height="24" fill="none" stroke="#2d5f3f" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <p>No complaints submitted yet.</p>
                                </div>
                            ) : (
                                <div className="ad-c-list">
                                    {complaints.map((c, i) => (
                                        <ComplaintCard key={c._id} c={c} i={i} updatingId={updatingId} onUpdate={updateComplaint} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Users Tab ── */}
                    {activeTab === "users" && (
                        <div>
                            {/* Search */}
                            <div className="ad-search-wrap">
                                <svg className="ad-search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                <input
                                    className="ad-search-input"
                                    type="text"
                                    placeholder="Search by name, email or phone…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button className="ad-search-clear" onClick={() => setSearch("")}>✕</button>
                                )}
                            </div>

                            <div className="ad-section-hdr">
                                <h3>{search ? `Results for "${search}"` : "All Users"}</h3>
                                <button className="ad-refresh-btn" onClick={fetchAllUsers}>
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                                    Refresh
                                </button>
                            </div>

                            {count === 0 ? (
                                <div className="ad-empty">
                                    <div className="ad-empty-icon">
                                        <svg width="24" height="24" fill="none" stroke="#2d5f3f" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <p>No users registered yet.</p>
                                </div>
                            ) : (
                                <div className="ad-user-list">
                                    {filteredUsers.length === 0 ? (
                                        <div className="ad-no-results">
                                            No users found matching <strong>"{search}"</strong>
                                        </div>
                                    ) : filteredUsers.map((user, i) => (
                                        <div
                                            className={`ad-user-card ${user.isBlocked ? "is-blocked" : ""}`}
                                            key={user._id}
                                            style={{ animationDelay: `${i * 0.07}s` }}
                                        >
                                            <div className={`ad-avatar ${user.isBlocked ? "blocked-avatar" : ""}`}>
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="ad-user-meta">
                                                <h3>{user.name}</h3>
                                                <p className="ad-email">{user.email}</p>
                                                <div className="ad-status-row">
                                                    <span className={`ad-status-pill ${user.verificationStatus}`}>
                                                        {user.verificationStatus === "approved" ? "✓" : user.verificationStatus === "rejected" ? "✕" : "⏳"} {user.verificationStatus}
                                                    </span>
                                                    {user.isBlocked && (
                                                        <span className="ad-status-pill blocked">🚫 Blocked</span>
                                                    )}
                                                </div>
                                                {user.verificationStatus === "rejected" && user.rejectionReason && (
                                                    <p style={{ fontSize:"12px", color:"#c0392b", background:"#fdf0ef", border:"1px solid #f2c0bc", borderRadius:"7px", padding:"6px 10px", marginBottom:"10px" }}>
                                                        Reason: {user.rejectionReason}
                                                    </p>
                                                )}
                                                {user.isBlocked && user.blockReason && (
                                                    <p style={{ fontSize:"12px", color:"#7c3aed", background:"#f3f0ff", border:"1px solid #ddd6fe", borderRadius:"7px", padding:"6px 10px", marginBottom:"10px" }}>
                                                        Block reason: {user.blockReason}
                                                    </p>
                                                )}
                                                <div className="ad-user-images">
                                                    {user.selfieImage && (
                                                        <div className="ad-img-wrap">
                                                            <img src={`http://localhost:5000/${user.selfieImage}`} alt="selfie" />
                                                            <span className="ad-img-label">Selfie</span>
                                                        </div>
                                                    )}
                                                    {user.collegeIdImage && (
                                                        <div className="ad-img-wrap">
                                                            <img src={`http://localhost:5000/${user.collegeIdImage}`} alt="ID" />
                                                            <span className="ad-img-label">College ID</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ad-actions">
                                                {user.verificationStatus === "pending" && !user.isBlocked && (
                                                    <>
                                                        <button className="ad-btn ad-btn-approve" onClick={() => approveUser(user._id)} disabled={!!loadingIds[user._id]}>
                                                            {loadingIds[user._id] === "approving" ? "Approving…" : "Approve"}
                                                        </button>
                                                        <button className="ad-btn ad-btn-reject" onClick={() => openRejectModal(user._id)} disabled={!!loadingIds[user._id]}>
                                                            {loadingIds[user._id] === "rejecting" ? "Rejecting…" : "Reject"}
                                                        </button>
                                                    </>
                                                )}
                                                {!user.isBlocked && user.role !== "admin" && (
                                                    <button className="ad-btn ad-btn-block" onClick={() => openBlockModal(user._id, user.name)} disabled={!!loadingIds[user._id]}>
                                                        {loadingIds[user._id] === "blocking" ? "Blocking…" : "Block"}
                                                    </button>
                                                )}
                                                {user.isBlocked && (
                                                    <button className="ad-btn ad-btn-unblock" onClick={() => unblockUser(user._id)} disabled={!!loadingIds[user._id]}>
                                                        {loadingIds[user._id] === "unblocking" ? "Unblocking…" : "Unblock"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default AdminDashboard;
