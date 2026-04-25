"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [show, setShow]         = useState(false);
  const [mounted, setMounted]   = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Incorrect password. Try again.");
        setPassword("");
      }
    } catch {
      setError("Connection error. Is the server running?");
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-bg {
          min-height: 100vh;
          background: #050507;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animated background orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          pointer-events: none;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb1 { width: 400px; height: 400px; background: radial-gradient(circle, #6c63ff, transparent 70%); top: -100px; left: -100px; animation-delay: 0s; }
        .orb2 { width: 350px; height: 350px; background: radial-gradient(circle, #a78bfa, transparent 70%); bottom: -80px; right: -80px; animation-delay: -3s; }
        .orb3 { width: 250px; height: 250px; background: radial-gradient(circle, #7C3AED, transparent 70%); top: 50%; right: 20%; animation-delay: -5s; }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-30px) scale(1.08); }
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          margin: 0 24px;
          background: rgba(22, 27, 39, 0.85);
          border: 1px solid rgba(108, 99, 255, 0.25);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 40px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 1px 0 rgba(255,255,255,0.06);
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? "translateY(0)" : "translateY(20px)"};
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        /* Glowing top border */
        .card-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a78bfa, #6c63ff, #a78bfa, transparent);
          border-radius: 50%;
        }

        /* Logo area */
        .login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .logo-img-wrap {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          border: 1px solid rgba(108, 99, 255, 0.4);
          box-shadow: 0 0 28px rgba(108, 99, 255, 0.35);
          overflow: hidden;
          background: #0d0f14;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-title {
          font-size: 22px;
          font-weight: 800;
          color: #f1f0ff;
          text-align: center;
          letter-spacing: -0.3px;
        }

        .login-sub {
          font-size: 13px;
          color: #64748b;
          text-align: center;
          margin-top: -4px;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 7px;
        }

        .input-wrap {
          position: relative;
        }

        .pw-input {
          width: 100%;
          background: #0d0f14;
          border: 1px solid #2a3348;
          border-radius: 12px;
          padding: 13px 46px 13px 16px;
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          letter-spacing: 1px;
        }

        .pw-input:focus {
          border-color: #6c63ff;
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.18);
        }

        .pw-input::placeholder { color: #334155; letter-spacing: 0; }

        .toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #475569;
          font-size: 16px;
          padding: 2px;
          transition: color 0.15s;
          line-height: 1;
        }

        .toggle-btn:hover { color: #a78bfa; }

        /* Error */
        .error-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #fca5a5;
        }

        /* Submit */
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6c63ff, #a78bfa);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
          letter-spacing: 0.2px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(108, 99, 255, 0.45);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
          color: #2a3348;
          font-size: 11px;
        }

        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #1e2535;
        }

        /* Footer note */
        .login-note {
          text-align: center;
          font-size: 12px;
          color: #334155;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .back-link {
          color: #6c63ff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          transition: color 0.15s;
          display: block;
          text-align: center;
          margin-top: 14px;
        }

        .back-link:hover { color: #a78bfa; }
      `}</style>

      <div className="login-bg">
        {/* Background orbs */}
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        <div className="login-card">
          <div className="card-glow" />

          {/* Logo */}
          <div className="login-logo">
            <div className="logo-img-wrap">
              <Image src="/logo.png" alt="Ashu FX" width={72} height={72} style={{ objectFit: "cover" }} />
            </div>
            <div>
              <div className="login-title">Admin Panel</div>
              <div className="login-sub">Ashu FX · Thumbnail Manager</div>
            </div>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label className="field-label" htmlFor="password">Admin Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  className="pw-input"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShow(s => !s)}
                  tabIndex={-1}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-msg">
                <span>❌</span> {error}
              </div>
            )}

            <button className="submit-btn" type="submit" disabled={loading || !password}>
              {loading ? (
                <><div className="spinner" /> Logging in…</>
              ) : (
                <>🔐 Login to Admin</>
              )}
            </button>
          </form>

          <div className="login-note">
            🔒 Protected area — authorised access only
          </div>

          <a href="/" className="back-link">← Back to Portfolio</a>
        </div>
      </div>
    </>
  );
}
