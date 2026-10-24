import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../Hooks/useAuth";
import { useNavigate } from "react-router";

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const FEATURES = [
  "Real-time attendance tracking",
  "Leave request management",
  "Task and project monitoring",
  "Team announcements hub",
];

const AVATARS = [
  { initials: "SJ", cls: "bg-indigo-100 text-indigo-700" },
  { initials: "AR", cls: "bg-green-100 text-green-700" },
  { initials: "MK", cls: "bg-amber-100 text-amber-700" },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const {
    loading: isLoading,
    error: formError,
  } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleLogin({ email, password });
      const loggedInUser = response?.user ?? response;
      const accountType = loggedInUser?.permissions ?? loggedInUser?.role;

      if (accountType === "admin" || accountType === "superadmin" || loggedInUser?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (accountType === "candidate" || loggedInUser?.role === "candidate") {
        navigate("/candidate/dashboard", { replace: true });
      }
    } catch {
      // The hook stores the login error in Redux for the form to display.
    }
  };



  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>

      {/* ══════════════════════
          LEFT PANEL
      ══════════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: "420px",
          flexShrink: 0,
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          padding: "48px 40px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px", height: "36px",
              borderRadius: "8px",
              backgroundColor: "#4f46e5",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", flexShrink: 0,
            }}
          >
            <BuildingIcon />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937", lineHeight: 1.3 }}>Genius Network</p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>Attendance Portal</p>
          </div>
        </div>

        {/* Hero copy */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 0" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#4f46e5", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>
            Attendance Management
          </p>

          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#111827", lineHeight: 1.3, letterSpacing: "-0.02em", margin: 0 }}>
            A clearer view of<br />the work that matters.
          </h1>

          <p style={{ marginTop: "14px", fontSize: "14px", lineHeight: 1.7, color: "#6b7280" }}>
            One connected space for attendance, time off, tasks, and team updates.
          </p>

          {/* Features */}
          <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            {FEATURES.map((f) => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: "#eef2ff", color: "#4f46e5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon />
                </span>
                <span style={{ fontSize: "13px", color: "#374151" }}>{f}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div
            style={{
              marginTop: "32px",
              display: "flex", alignItems: "center", gap: "12px",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex" }}>
              {AVATARS.map(({ initials, cls }, i) => (
                <span
                  key={initials}
                  className={cls}
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    border: "2px solid #fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 600,
                    marginLeft: i > 0 ? "-8px" : 0,
                  }}
                >
                  {initials}
                </span>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
              <span style={{ fontWeight: 600, color: "#1f2937" }}>48 team members</span>
              {" "}staying aligned every day
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0 }}>
          © 2026 Genius Network. Built for better workdays.
        </p>
      </div>

      {/* ══════════════════════
          RIGHT PANEL
      ══════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          overflowY: "auto",
        }}
      >
        {/* Mobile logo */}
        <div
          className="lg:hidden"
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}
        >
          <div
            style={{
              width: "36px", height: "36px", borderRadius: "8px",
              backgroundColor: "#4f46e5",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}
          >
            <BuildingIcon />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937", lineHeight: 1.3, margin: 0 }}>Genius Network</p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Attendance Portal</p>
          </div>
        </div>

        {/* Form card */}
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            padding: "36px 36px",
          }}
        >
          {/* Heading */}
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#4f46e5", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px 0" }}>
              Welcome back
            </p>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827", margin: "0 0 6px 0", letterSpacing: "-0.02em" }}>
              Sign in to your workspace
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Use your work credentials to access the portal.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}
              >
                Work email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@genius.net"
                required
                onInput={(e) => setEmail(e.target.value)}
                className="focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "10px 14px",
                  fontSize: "14px", color: "#111827",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              />
            </div>

            {/* Password field */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <label
                  htmlFor="password"
                  style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  style={{
                    fontSize: "12px", fontWeight: 500, color: "#4f46e5",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  onInput={(e) => setPassword(e.target.value)}
                  className="focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "10px 42px 10px 14px",
                    fontSize: "14px", color: "#111827",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    outline: "none",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, color: "#9ca3af", display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            {/* Error */}
            {formError && (
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  backgroundColor: "#fff1f2",
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                  padding: "10px 14px",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px", color: "#f43f5e", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p role="alert" style={{ fontSize: "13px", color: "#e11d48", margin: 0 }}>{formError}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "11px 16px",
                backgroundColor: isLoading ? "#818cf8" : "#4f46e5",
                color: "#fff",
                fontSize: "14px", fontWeight: 600,
                border: "none",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#4338ca"; }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#4f46e5"; }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" }}>
            <span style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#9ca3af" }}>
              <ShieldIcon />
              Secure workplace access
            </span>
            <span style={{ flex: 1, height: "1px", backgroundColor: "#f3f4f6" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>
            By signing in, you agree to use this portal responsibly and keep your account credentials secure.
          </p>
        </div>

        {/* Below-card link */}
        <p style={{ marginTop: "20px", fontSize: "12px", color: "#9ca3af", textAlign: "center" }}>
          Need help?{" "}
          <button
            type="button"
            style={{ fontSize: "12px", fontWeight: 500, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Contact your administrator
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
