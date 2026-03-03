  import { useEffect, useState } from "react";
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
    --green-lt:  #ecfdf5;
    --blue:      #3b82f6;
    --blue-lt:   #eff6ff;
    --red:       #ef4444;
    --radius:    10px;
  }

  body { background: var(--off); font-family: 'DM Sans', sans-serif; }

  /* ── Page ── */
  .cdl-page {
    min-height: 100vh;
    padding: 2.5rem 1.5rem 5rem;
    max-width: 1100px;
    margin: 0 auto;
    animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Top bar ── */
  .cdl-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .cdl-logo {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .cdl-logo-icon {
    width: 32px; height: 32px;
    background: var(--amber);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem;
  }

  .cdl-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
  }

  .cdl-logo-name span { color: var(--amber); }

  .cdl-topbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .cdl-refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
    border: 1.5px solid var(--ink-20);
    border-radius: var(--radius);
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink-60);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
  }

  .cdl-refresh-btn:hover { background: var(--off); color: var(--ink); border-color: var(--ink-20); }

  .cdl-refresh-btn.spinning span { animation: spin 0.7s linear infinite; display: inline-block; }

  @keyframes spin { to { transform: rotate(360deg); } }

  .cdl-back-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.9rem;
    border: none;
    border-radius: var(--radius);
    background: var(--navy);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--white);
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .cdl-back-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.22s ease;
    transform-origin: left;
  }

  .cdl-back-btn:hover { background: var(--navy-lt); transform: translateY(-1px); }
  .cdl-back-btn:hover::after { transform: scaleX(1); }

  /* ── Page headline ── */
  .cdl-headline-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .cdl-headline {
    font-family: 'Syne', sans-serif;
    font-size: 1.7rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  .cdl-headline span { color: var(--amber); }

  .cdl-count-badge {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--ink-60);
    background: var(--off);
    border: 1px solid var(--ink-20);
    border-radius: 100px;
    padding: 0.3rem 0.75rem;
  }

  /* ── Filter tabs ── */
  .cdl-filters {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
  }

  .cdl-filter-tab {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: 100px;
    border: 1.5px solid var(--ink-20);
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink-60);
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, color 0.18s;
  }

  .cdl-filter-tab:hover { border-color: rgba(245,158,11,0.4); color: var(--ink); }

  .cdl-filter-tab.active {
    background: var(--navy);
    border-color: var(--navy);
    color: var(--white);
  }

  .cdl-filter-count {
    background: rgba(255,255,255,0.2);
    border-radius: 100px;
    padding: 0.05rem 0.4rem;
    font-size: 0.68rem;
  }

  .cdl-filter-tab:not(.active) .cdl-filter-count {
    background: var(--ink-08);
    color: var(--ink-60);
  }

  /* ── Grid ── */
  .cdl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.1rem;
  }

  /* ── Delivery card ── */
  .cdl-card {
    background: var(--white);
    border: 1px solid var(--ink-20);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
    animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }

  .cdl-card:hover {
    box-shadow: 0 10px 32px rgba(15,31,61,0.1);
    transform: translateY(-3px);
    border-color: rgba(245,158,11,0.3);
  }

  /* left accent bar */
  .cdl-card-bar {
    height: 4px;
    width: 100%;
  }

  .cdl-card-bar.pending   { background: linear-gradient(to right, var(--amber), var(--amber-dk)); }
  .cdl-card-bar.accepted  { background: linear-gradient(to right, var(--blue), #6366f1); }
  .cdl-card-bar.delivered { background: linear-gradient(to right, var(--green), #059669); }

  .cdl-card-inner { padding: 1.25rem 1.4rem; flex: 1; display: flex; flex-direction: column; gap: 1rem; }

  /* card top row */
  .cdl-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .cdl-card-icon-wrap {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .cdl-card-icon-wrap.pending   { background: var(--amber-lt); }
  .cdl-card-icon-wrap.accepted  { background: var(--blue-lt); }
  .cdl-card-icon-wrap.delivered { background: var(--green-lt); }

  .cdl-card-title-group { flex: 1; min-width: 0; }

  .cdl-card-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.2rem;
  }

  .cdl-card-company {
    font-size: 0.75rem;
    color: var(--ink-60);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  /* status badge */
  .cdl-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.25rem 0.6rem;
    border-radius: 100px;
    flex-shrink: 0;
  }

  .cdl-status-badge.pending   { background: var(--amber-lt);  color: var(--amber-dk); }
  .cdl-status-badge.accepted  { background: var(--blue-lt);   color: var(--blue); }
  .cdl-status-badge.delivered { background: var(--green-lt);  color: #059669; }

  .cdl-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cdl-status-dot.pending   { background: var(--amber-dk); animation: pulse 1.8s ease-in-out infinite; }
  .cdl-status-dot.accepted  { background: var(--blue); }
  .cdl-status-dot.delivered { background: var(--green); }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* info rows */
  .cdl-info-rows {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .cdl-info-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .cdl-info-icon {
    font-size: 0.85rem;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    opacity: 0.55;
  }

  .cdl-info-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink-60);
    width: 52px;
    flex-shrink: 0;
  }

  .cdl-info-val {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* route mini-strip */
  .cdl-route-strip {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--off);
    border-radius: 8px;
    padding: 0.6rem 0.85rem;
  }

  .cdl-route-from,
  .cdl-route-to {
    flex: 1;
    min-width: 0;
  }

  .cdl-route-lbl {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.15rem;
  }

  .cdl-route-lbl.from { color: var(--amber-dk); }
  .cdl-route-lbl.to   { color: #3b82f6; }

  .cdl-route-val {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cdl-route-arrow {
    font-size: 0.9rem;
    opacity: 0.35;
    flex-shrink: 0;
  }

  /* reward row */
  .cdl-reward-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid var(--ink-08);
    margin-top: auto;
  }

  .cdl-reward-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-60);
  }

  .cdl-reward-amount {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--amber-dk);
    letter-spacing: -0.01em;
  }

  /* action button */
  .cdl-action-btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 0 0 14px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    transition: filter 0.18s, transform 0.15s;
    border-top: 1px solid var(--ink-08);
  }

  .cdl-action-btn:hover:not(:disabled) { filter: brightness(1.06); transform: none; }
  .cdl-action-btn:active:not(:disabled) { filter: brightness(0.96); }

  .cdl-action-btn.accept {
    background: var(--navy);
    color: var(--white);
  }

  .cdl-action-btn.deliver {
    background: linear-gradient(135deg, var(--green) 0%, #059669 100%);
    color: var(--white);
  }

  .cdl-action-btn.done {
    background: var(--off);
    color: var(--ink-60);
    cursor: default;
    font-weight: 600;
  }

  /* spinner */
  .cdl-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.55s linear infinite;
    flex-shrink: 0;
  }

  /* ── Empty state ── */
  .cdl-empty {
    text-align: center;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .cdl-empty-icon {
    font-size: 3rem;
    opacity: 0.3;
    margin-bottom: 0.5rem;
  }

  .cdl-empty-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.01em;
  }

  .cdl-empty-sub {
    font-size: 0.85rem;
    color: var(--ink-60);
    max-width: 260px;
    line-height: 1.6;
  }

  /* ── Loading skeleton ── */
  .cdl-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.1rem;
  }

  .cdl-skeleton-card {
    background: var(--white);
    border: 1px solid var(--ink-20);
    border-radius: 14px;
    overflow: hidden;
  }

  .cdl-skeleton-bar {
    height: 4px;
    background: linear-gradient(90deg, var(--off) 25%, #e8ecf4 50%, var(--off) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  .cdl-skeleton-body { padding: 1.25rem 1.4rem; display: flex; flex-direction: column; gap: 0.75rem; }

  .cdl-skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--off) 25%, #e8ecf4 50%, var(--off) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Responsive ── */
  @media (max-width: 540px) {
    .cdl-page { padding: 1.5rem 1rem 4rem; }
    .cdl-grid  { grid-template-columns: 1fr; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("cdl-css")) {
  const tag = document.createElement("style");
  tag.id = "cdl-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

/* ─── Helpers ─────────────────────────────────────────────────────── */
const STATUS_META = {
  pending:   { icon: "📦", label: "Pending",   actionIcon: "🤝" },
  accepted:  { icon: "🚚", label: "In Transit", actionIcon: "✅" },
  delivered: { icon: "✅", label: "Delivered",  actionIcon: "✓" },
};

const FILTERS = ["all", "pending", "accepted", "delivered"];

const SkeletonCard = () => (
  <div className="cdl-skeleton-card">
    <div className="cdl-skeleton-bar" />
    <div className="cdl-skeleton-body">
      <div className="cdl-skeleton-line" style={{ width: "60%" }} />
      <div className="cdl-skeleton-line" style={{ width: "40%" }} />
      <div className="cdl-skeleton-line" style={{ width: "80%" }} />
      <div className="cdl-skeleton-line" style={{ width: "55%" }} />
    </div>
  </div>
);

/* ─── Component ─────────────────────────────────────────────────────── */
const DeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]         = useState("all");
  const [actionLoading, setActionLoading] = useState(null); // item._id

  const navigate = useNavigate();

  // ✅ Logged in user
const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;


  /* ── original fetch logic ── */
  const fetchDeliveries = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get("/api/delivery");
      setDeliveries(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDeliveries(); }, []);

  /* ── original accept logic ── */
  const acceptDelivery = async (id) => {
  setActionLoading(id);
  try {
    await axios.put(`/api/delivery/accept/${id}`);
    fetchDeliveries();
  } catch (error) {
    alert(error.response?.data?.message || "You must verify your account first.");
  } finally {
    setActionLoading(null);
  }
};

  /* ── original markDelivered logic ── */
/* ── cancel delivery ── */
const cancelDelivery = async (id) => {
  if (!window.confirm("Are you sure you want to cancel this delivery?")) return;

  setActionLoading(id);
  try {
    await axios.put(`/api/delivery/cancel/${id}`);
    fetchDeliveries();
  } catch (error) {
    alert("Error cancelling delivery");
  } finally {
    setActionLoading(null);
  }
};


/* ── markDelivered logic ── */
const markDelivered = async (id) => {
  setActionLoading(id);
  try {
    await axios.put(`/api/delivery/deliver/${id}`);
    fetchDeliveries();
  } catch (error) {
    alert("Error marking delivered");
  } finally {
    setActionLoading(null);
  }
};

/* ✅ NEW FUNCTION — paste here */
const markNotDelivered = async (id) => {
  setActionLoading(id);
  try {
    await axios.put(`/api/delivery/not-delivered/${id}`);
    fetchDeliveries();
  } catch (error) {
    alert("Error marking not delivered");
  } finally {
    setActionLoading(null);
  }
};


  /* ── filtered list ── */
  const filtered = filter === "all"
    ? deliveries
    : deliveries.filter((d) => d.status === filter);

  const countOf = (s) => deliveries.filter((d) => d.status === s).length;

  return (
    <div className="cdl-page">

      {/* ── Top bar ── */}
      <div className="cdl-topbar">
        <div className="cdl-logo">
          <div className="cdl-logo-icon">🚀</div>
          <span className="cdl-logo-name">Courier<span>Buddy</span></span>
        </div>
        <div className="cdl-topbar-right">
          <button
            className="cdl-back-btn"
            onClick={() => navigate("/dashboard")}
            type="button"
          >
            ← Dashboard
          </button>
          <button
            className={`cdl-refresh-btn ${refreshing ? "spinning" : ""}`}
            onClick={() => fetchDeliveries(true)}
            type="button"
            disabled={refreshing}
          >
            <span>↻</span> Refresh
          </button>
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="cdl-headline-row">
        <h1 className="cdl-headline">
          Available <span>Deliveries</span>
        </h1>
        <span className="cdl-count-badge">
          {filtered.length} {filter === "all" ? "total" : filter}
        </span>
      </div>

      {/* ── Filter tabs ── */}
      <div className="cdl-filters" role="tablist" aria-label="Filter deliveries">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`cdl-filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
            type="button"
          >
            {f === "all" ? "🗂 All" : f === "pending" ? "📦 Pending" : f === "accepted" ? "🚚 In Transit" : "✅ Delivered"}
            <span className="cdl-filter-count">
              {f === "all" ? deliveries.length : countOf(f)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="cdl-skeleton-grid">
          {[1,2,3,4,5,6].map((n) => <SkeletonCard key={n} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div className="cdl-empty">
          <div className="cdl-empty-icon">📭</div>
          <div className="cdl-empty-title">
            {filter === "all" ? "No deliveries yet" : `No ${filter} deliveries`}
          </div>
          <div className="cdl-empty-sub">
            {filter === "all"
              ? "Delivery requests will appear here once they're posted."
              : `There are currently no ${filter} deliveries to show.`}
          </div>
        </div>
      )}

      {/* ── Delivery grid ── */}
      {!loading && filtered.length > 0 && (
        <div className="cdl-grid">
          {filtered.map((item, idx) => {
  console.log("MAP RUNNING 🔥", item);

  console.log("Current User:", currentUserId);
  console.log("Posted By:", item.postedBy);

  const meta = STATUS_META[item.status] || STATUS_META.pending;
  const isActing = actionLoading === item._id;


            return (
              <div
                className="cdl-card"
                key={item._id}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* top accent bar */}
                <div className={`cdl-card-bar ${item.status}`} />

                <div className="cdl-card-inner">

                  {/* header row */}
                  <div className="cdl-card-top">
                    <div className={`cdl-card-icon-wrap ${item.status}`}>
                      {meta.icon}
                    </div>
                    <div className="cdl-card-title-group">
                      <div className="cdl-card-title">{item.productName}</div>
                      <div className="cdl-card-company">🏪 {item.ecommerceCompany}</div>
                    </div>
                    <div className={`cdl-status-badge ${item.status}`}>
                      <span className={`cdl-status-dot ${item.status}`} />
                      {meta.label}
                    </div>
                  </div>

                  {/* route strip */}
                  <div className="cdl-route-strip">
                    <div className="cdl-route-from">
                      <div className="cdl-route-lbl from">Pickup</div>
                      <div className="cdl-route-val">{item.pickupLocation}</div>
                    </div>
                    <span className="cdl-route-arrow">→</span>
                    <div className="cdl-route-to">
                      <div className="cdl-route-lbl to">Deliver to</div>
                      <div className="cdl-route-val">{item.hostelName}</div>
                    </div>
                  </div>

                  {/* reward */}
                  <div className="cdl-reward-row">
                    <span className="cdl-reward-label">Courier reward</span>
                    <span className="cdl-reward-amount">₹{item.rewardAmount}</span>
                  </div>

                </div>
                {/* ✅ Show accepter details only to owner */}
{item.status === "accepted" &&
 item.postedBy?._id === currentUserId && (
  <div style={{
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    background: "#ffffff",   // 🔥 make white
    border: "1px solid #e5e7eb"
  }}>
    <strong>Courier Assigned:</strong>

    <div style={{ marginTop: "6px", color: "#111" }}>
      👤 {item.accepterName}
    </div>

    <div style={{ color: "red", fontSize: "18px" }}>
  📞 {item.accepterPhone}
</div>

    {item.accepterProfile && (
      <img
        src={item.accepterProfile}
        alt="profile"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginTop: "6px"
        }}
      />
    )}
  </div>
)}

{/* ✅ Show owner details to courier (User B only) */}
{item.status === "accepted" &&
 item.acceptedBy?._id === currentUserId && (
  <div style={{
    marginTop: "10px",
    padding: "12px",
    borderRadius: "10px",
    background: "#ffffff",
    border: "1px solid #e5e7eb"
  }}>
    <strong>Parcel Owner:</strong>

    <div style={{ marginTop: "6px", color: "#111" }}>
      👤 {item.ownerName}
    </div>

    <div style={{ color: "#111" }}>
      📞 {item.ownerPhone}
    </div>

    {item.ownerProfile && (
      <img
        src={item.ownerProfile}
        alt="profile"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginTop: "6px"
        }}
      />
    )}
  </div>
)}



{/* ✅ NEW BUTTON LOGIC — paste here */}
{item.status === "accepted" && (
  <>
    {/* Owner → Mark Delivered */}
    {item.postedBy?._id === currentUserId && (
      <button
        className="cdl-action-btn deliver"
        onClick={() => markDelivered(item._id)}
        disabled={isActing}
        type="button"
      >
        {isActing
          ? <><span className="cdl-spinner" /> Updating…</>
          : "✅ Mark Delivered"}
      </button>
    )}

    {/* Courier → Not Delivered */}
    {item.acceptedBy?._id === currentUserId && (
      <button
        className="cdl-action-btn"
        style={{ background: "#ef4444", color: "white" }}
        onClick={() => markNotDelivered(item._id)}
        disabled={isActing}
        type="button"
      >
        {isActing
          ? <><span className="cdl-spinner" /> Updating…</>
          : "❌ Not Delivered"}
      </button>
    )}
  </>
)}

{/* action button — full width, flush bottom */}
{item.status === "pending" && (
  item.postedBy?._id === currentUserId ? (
    <button
      className="cdl-action-btn"
      style={{ background: "#ef4444", color: "white" }}
      onClick={() => cancelDelivery(item._id)}
      disabled={isActing}
      type="button"
    >
      {isActing
        ? <><span className="cdl-spinner" /> Cancelling…</>
        : "❌ Cancel Delivery"}
    </button>
  ) : (
    <button
      className="cdl-action-btn accept"
      onClick={() => acceptDelivery(item._id)}
      disabled={isActing}
      type="button"
    >
      {isActing
        ? <><span className="cdl-spinner" /> Accepting…</>
        : <>{meta.actionIcon} Accept Delivery</>}
    </button>
  )
)}




                {item.status === "delivered" && (
                  <div className="cdl-action-btn done">
                    ✓ Delivered
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default DeliveryList;
