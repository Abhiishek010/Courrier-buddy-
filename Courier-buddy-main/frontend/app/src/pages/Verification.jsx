  import { useRef, useState } from "react";
import Webcam from "react-webcam";
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
    --navy:     #0f1f3d;
    --navy-lt:  #162848;
    --amber:    #f59e0b;
    --amber-dk: #d97706;
    --amber-lt: #fffbeb;
    --white:    #ffffff;
    --off:      #f4f6fb;
    --ink:      #0f1f3d;
    --ink-60:   rgba(15,31,61,0.6);
    --ink-20:   rgba(15,31,61,0.13);
    --ink-08:   rgba(15,31,61,0.06);
    --green:    #10b981;
    --red:      #ef4444;
    --radius:   10px;
  }

  body { background: var(--off); font-family: 'DM Sans', sans-serif; }

  /* ── Page wrapper ── */
  .cbv-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem 1.5rem 4rem;
    background: var(--off);
    animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Top bar ── */
  .cbv-topbar {
    width: 100%;
    max-width: 740px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }

  .cbv-logo {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    text-decoration: none;
  }

  .cbv-logo-icon {
    width: 32px; height: 32px;
    background: var(--amber);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem;
  }

  .cbv-logo-name {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ink);
    letter-spacing: -0.02em;
  }

  .cbv-logo-name span { color: var(--amber); }

  .cbv-back-btn {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink-60);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.2s;
  }

  .cbv-back-btn:hover { color: var(--amber-dk); }

  /* ── Card ── */
  .cbv-card {
    width: 100%;
    max-width: 740px;
    background: var(--white);
    border: 1px solid var(--ink-20);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(15,31,61,0.07);
  }

  /* ── Card header ── */
  .cbv-card-header {
    background: var(--navy);
    padding: 2rem 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .cbv-card-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }

  .cbv-card-header::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(245,158,11,0.15);
    top: -120px; right: -80px;
    pointer-events: none;
  }

  .cbv-header-inner { position: relative; z-index: 1; }

  .cbv-header-badge {
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
    margin-bottom: 0.75rem;
  }

  .cbv-header-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
  }

  .cbv-header-sub {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.5);
    font-weight: 300;
    max-width: 420px;
    line-height: 1.6;
  }

  /* progress steps */
  .cbv-steps {
    display: flex;
    align-items: center;
    gap: 0;
    margin-top: 1.75rem;
  }

  .cbv-step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cbv-step-num {
    width: 26px; height: 26px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
    flex-shrink: 0;
    transition: background 0.3s, color 0.3s;
  }

  .cbv-step-num.done    { background: var(--green); color: var(--white); }
  .cbv-step-num.active  { background: var(--amber); color: var(--navy); }
  .cbv-step-num.waiting { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.35); }

  .cbv-step-label {
    font-size: 0.72rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .cbv-step-label.done    { color: rgba(255,255,255,0.6); }
  .cbv-step-label.active  { color: var(--white); font-weight: 600; }
  .cbv-step-label.waiting { color: rgba(255,255,255,0.3); }

  .cbv-step-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.12);
    margin: 0 0.5rem;
    min-width: 24px;
  }

  .cbv-step-line.done { background: var(--green); }

  /* ── Card body ── */
  .cbv-card-body { padding: 2rem 2.5rem; }

  /* ── Two-col grid ── */
  .cbv-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.75rem;
  }

  /* ── Section label ── */
  .cbv-section-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-60);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .cbv-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--ink-20);
  }

  /* ── Webcam box ── */
  .cbv-cam-wrap {
    position: relative;
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--navy);
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cbv-cam-wrap video,
  .cbv-cam-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* corner brackets */
  .cbv-cam-corner {
    position: absolute;
    width: 20px; height: 20px;
    pointer-events: none;
    z-index: 3;
  }

  .cbv-cam-corner.tl { top: 10px;  left: 10px;  border-top: 2px solid var(--amber); border-left: 2px solid var(--amber); }
  .cbv-cam-corner.tr { top: 10px;  right: 10px; border-top: 2px solid var(--amber); border-right: 2px solid var(--amber); }
  .cbv-cam-corner.bl { bottom: 10px; left: 10px;  border-bottom: 2px solid var(--amber); border-left: 2px solid var(--amber); }
  .cbv-cam-corner.br { bottom: 10px; right: 10px; border-bottom: 2px solid var(--amber); border-right: 2px solid var(--amber); }

  /* live badge */
  .cbv-live-badge {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px;
    padding: 0.2rem 0.6rem;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
  }

  .cbv-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--red);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }

  /* captured overlay */
  .cbv-captured-tag {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(16,185,129,0.85);
    border-radius: 100px;
    padding: 0.2rem 0.65rem;
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    backdrop-filter: blur(4px);
  }

  /* retake dim overlay */
  .cbv-retake-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15,31,61,0.55);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 14px;
    z-index: 5;
    opacity: 0;
    transition: opacity 0.22s;
  }

  .cbv-cam-wrap:hover .cbv-retake-overlay { opacity: 1; }

  .cbv-retake-hint {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--white);
    background: rgba(0,0,0,0.5);
    border-radius: 100px;
    padding: 0.3rem 0.75rem;
    backdrop-filter: blur(4px);
  }

  /* capture button */
  .cbv-capture-btn {
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: var(--navy);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    transition: background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .cbv-capture-btn::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2.5px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.25s ease;
    transform-origin: left;
  }

  .cbv-capture-btn:hover { background: var(--navy-lt); transform: translateY(-1px); }
  .cbv-capture-btn:hover::after { transform: scaleX(1); }

  .cbv-capture-btn.retake {
    background: transparent;
    color: var(--ink-60);
    border: 1.5px solid var(--ink-20);
    box-shadow: none;
  }

  .cbv-capture-btn.retake:hover {
    background: var(--off);
    color: var(--ink);
    border-color: var(--ink-20);
  }

  /* ── ID upload ── */
  .cbv-upload-zone {
    aspect-ratio: 4/3;
    border: 2px dashed var(--ink-20);
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    overflow: hidden;
    background: var(--off);
    text-align: center;
    padding: 1rem;
  }

  .cbv-upload-zone:hover,
  .cbv-upload-zone.has-file {
    border-color: rgba(245,158,11,0.5);
    background: var(--amber-lt);
  }

  .cbv-upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 4; /* ✅ FIXED: was 2, now 4 — sits above the overlay (z-index: 3) */
  }

  .cbv-upload-zone img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--radius) - 2px);
  }

  .cbv-upload-icon {
    font-size: 2rem;
    opacity: 0.4;
  }

  .cbv-upload-title {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--ink);
  }

  .cbv-upload-sub {
    font-size: 0.72rem;
    color: var(--ink-60);
  }

  .cbv-upload-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15,31,61,0.5);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 12px;
    z-index: 3;
    opacity: 0;
    transition: opacity 0.2s;
    border-radius: calc(var(--radius) - 2px);
  }

  .cbv-upload-zone.has-file:hover .cbv-upload-overlay { opacity: 1; }

  .cbv-upload-replace {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--white);
    background: rgba(0,0,0,0.5);
    border-radius: 100px;
    padding: 0.25rem 0.7rem;
    backdrop-filter: blur(4px);
  }

  .cbv-upload-filename {
    margin-top: 0.65rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--green);
    font-weight: 500;
  }

  /* ── Info notice ── */
  .cbv-notice {
    display: flex;
    gap: 0.75rem;
    background: var(--amber-lt);
    border: 1px solid rgba(245,158,11,0.25);
    border-radius: var(--radius);
    padding: 1rem 1.25rem;
    margin-bottom: 1.75rem;
  }

  .cbv-notice-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }

  .cbv-notice-text { font-size: 0.8rem; color: var(--ink-60); line-height: 1.6; }
  .cbv-notice-text strong { color: var(--ink); }

  /* ── Submit button ── */
  .cbv-submit {
    width: 100%;
    padding: 0.95rem;
    background: var(--navy);
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
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

  .cbv-submit::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: var(--amber);
    transform: scaleX(0);
    transition: transform 0.28s ease;
    transform-origin: left;
  }

  .cbv-submit:hover:not(:disabled) {
    background: var(--navy-lt);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15,31,61,0.28);
  }

  .cbv-submit:hover:not(:disabled)::after { transform: scaleX(1); }

  .cbv-submit:active:not(:disabled) { transform: translateY(0); }

  .cbv-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  .cbv-submit:focus-visible { outline: 2px solid var(--amber); outline-offset: 3px; }

  .cbv-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.55s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* readiness pills */
  .cbv-readiness {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  .cbv-pill {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.3rem 0.7rem;
    border-radius: 100px;
  }

  .cbv-pill.ready   { background: rgba(16,185,129,0.1); color: var(--green); }
  .cbv-pill.missing { background: var(--ink-08); color: var(--ink-60); }

  .cbv-pill-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
  }

  .cbv-pill.ready   .cbv-pill-dot { background: var(--green); }
  .cbv-pill.missing .cbv-pill-dot { background: var(--ink-20); }

  /* ── Responsive ── */
  @media (max-width: 620px) {
    .cbv-cols { grid-template-columns: 1fr; }
    .cbv-card-body { padding: 1.5rem; }
    .cbv-card-header { padding: 1.5rem; }
  }
`;

if (typeof document !== "undefined" && !document.getElementById("cbv-css")) {
  const tag = document.createElement("style");
  tag.id = "cbv-css";
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

/* ─── Component ─────────────────────────────────────────────────────── */
const Verification = () => {
  const webcamRef    = useRef(null);
  const fileInputRef = useRef(null);
  const [selfie, setSelfie]       = useState(null);
  const [collegeId, setCollegeId] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /* ── original capture logic ── */
  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelfie(imageSrc);
  };

  const retakeSelfie = () => setSelfie(null);

  /* ── ID file change: also build preview URL ── */
  const handleIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCollegeId(file);
    setIdPreview(URL.createObjectURL(file));
    /* reset so same file can be re-selected next time */
    e.target.value = "";
  };

  const handleReplaceClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  /* ── original submit logic ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();

    if (selfie) {
      const blob = await fetch(selfie).then((res) => res.blob());
      formData.append("selfie", blob, "selfie.jpg");
    }

    formData.append("collegeId", collegeId);

    try {
      await axios.post("/api/verify/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Verification submitted successfully");
      navigate("/dashboard");
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── step state ── */
  const step = !selfie ? 1 : !collegeId ? 2 : 3;

  const canSubmit = selfie && collegeId && !isLoading;

  return (
    <div className="cbv-page">

      {/* top bar */}
      <div className="cbv-topbar">
        <div className="cbv-logo">
          <div className="cbv-logo-icon">🚀</div>
          <span className="cbv-logo-name">Courier<span>Buddy</span></span>
        </div>
        <button className="cbv-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to dashboard
        </button>
      </div>

      {/* main card */}
      <div className="cbv-card">

        {/* header */}
        <div className="cbv-card-header">
          <div className="cbv-header-inner">
            <div className="cbv-header-badge">🔐 Identity Verification</div>
            <h1 className="cbv-header-title">Verify your account</h1>
            <p className="cbv-header-sub">
              Take a selfie and upload your college ID to unlock all delivery features. Takes less than 2 minutes.
            </p>

            {/* step tracker */}
            <div className="cbv-steps">
              <div className="cbv-step">
                <div className={`cbv-step-num ${step > 1 ? "done" : "active"}`}>
                  {step > 1 ? "✓" : "1"}
                </div>
                <span className={`cbv-step-label ${step > 1 ? "done" : "active"}`}>Selfie</span>
              </div>
              <div className={`cbv-step-line ${step > 1 ? "done" : ""}`} />
              <div className="cbv-step">
                <div className={`cbv-step-num ${step > 2 ? "done" : step === 2 ? "active" : "waiting"}`}>
                  {step > 2 ? "✓" : "2"}
                </div>
                <span className={`cbv-step-label ${step > 2 ? "done" : step === 2 ? "active" : "waiting"}`}>
                  College ID
                </span>
              </div>
              <div className={`cbv-step-line ${step > 2 ? "done" : ""}`} />
              <div className="cbv-step">
                <div className={`cbv-step-num ${step === 3 ? "active" : "waiting"}`}>3</div>
                <span className={`cbv-step-label ${step === 3 ? "active" : "waiting"}`}>Submit</span>
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="cbv-card-body">

          {/* info notice */}
          <div className="cbv-notice">
            <span className="cbv-notice-icon">💡</span>
            <span className="cbv-notice-text">
              <strong>Tips for best results:</strong> Ensure good lighting, hold your ID flat, and keep your face clearly visible. All data is encrypted and stored securely.
            </span>
          </div>

          {/* two columns */}
          <div className="cbv-cols">

            {/* ── SELFIE ── */}
            <div>
              <div className="cbv-section-label">Step 1 — Selfie</div>

              <div className="cbv-cam-wrap">
                {/* corner brackets */}
                <span className="cbv-cam-corner tl" />
                <span className="cbv-cam-corner tr" />
                <span className="cbv-cam-corner bl" />
                <span className="cbv-cam-corner br" />

                {!selfie ? (
                  <>
                    <div className="cbv-live-badge">
                      <span className="cbv-live-dot" /> Live
                    </div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </>
                ) : (
                  <>
                    <div className="cbv-captured-tag">✓ Captured</div>
                    <img src={selfie} alt="Captured selfie" />
                    <div className="cbv-retake-overlay">
                      <span className="cbv-retake-hint">Hover to retake</span>
                    </div>
                  </>
                )}
              </div>

              {!selfie ? (
                <button className="cbv-capture-btn" onClick={captureSelfie} type="button">
                  📸 Capture Selfie
                </button>
              ) : (
                <button className="cbv-capture-btn retake" onClick={retakeSelfie} type="button">
                  ↺ Retake Photo
                </button>
              )}
            </div>

            {/* ── COLLEGE ID ── */}
            <div>
              <div className="cbv-section-label">Step 2 — College ID</div>

              {/* hidden input always mounted, controlled via ref */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleIdChange}
                aria-label="Upload college ID"
                style={{ display: "none" }}
              />

              <div
                className={`cbv-upload-zone ${idPreview ? "has-file" : ""}`}
                onClick={!idPreview ? handleReplaceClick : undefined}
              >
                {idPreview ? (
                  <>
                    <img src={idPreview} alt="College ID preview" />
                    <div className="cbv-upload-overlay">
                      <span className="cbv-upload-replace">Click button below to replace</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cbv-upload-icon">🪪</div>
                    <div className="cbv-upload-title">Upload College ID</div>
                    <div className="cbv-upload-sub">Click to browse · JPG, PNG · Max 10MB</div>
                    <div className="cbv-upload-sub" style={{ color: '#10b981', fontSize: '0.81rem' }}>You can blur your address in ID card and parents ph no, for privacy.</div>
                  </>
                )}
              </div>

              {collegeId && (
                <div className="cbv-upload-filename">
                  ✓ {collegeId.name}
                </div>
              )}

              {idPreview && (
                <button
                  type="button"
                  className="cbv-capture-btn retake"
                  onClick={handleReplaceClick}
                  style={{ marginTop: "0.75rem" }}
                >
                  🔄 Replace ID Photo
                </button>
              )}
            </div>
          </div>

          {/* readiness pills */}
          <div className="cbv-readiness">
            <div className={`cbv-pill ${selfie ? "ready" : "missing"}`}>
              <span className="cbv-pill-dot" />
              {selfie ? "Selfie captured" : "Selfie missing"}
            </div>
            <div className={`cbv-pill ${collegeId ? "ready" : "missing"}`}>
              <span className="cbv-pill-dot" />
              {collegeId ? "ID uploaded" : "College ID missing"}
            </div>
          </div>

          {/* submit */}
          <button
            className="cbv-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <><span className="cbv-spinner" /> Submitting…</>
            ) : (
              "Submit for verification →"
            )}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Verification;
