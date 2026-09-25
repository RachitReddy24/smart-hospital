import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  isStaffLoggedIn,
  loginStaff,
} from "../utils/smartCareAuth";

import "./StaffLogin.css";

function StaffLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] =
    useState(false);

  const [staffId, setStaffId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================================================
     ALREADY LOGGED IN
     ========================================================= */

  useEffect(() => {
    if (isStaffLoggedIn()) {
      const destination =
        location.state?.from ||
        "/staff/dashboard";

      const safeDestination =
        destination === "/staff/login"
          ? "/staff/dashboard"
          : destination;

      navigate(
        safeDestination,
        {
          replace: true,
        }
      );
    }
  }, [
    navigate,
    location.state,
  ]);

  /* =========================================================
     LOGIN
     ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const cleanStaffId =
      staffId.trim();

    const cleanPassword =
      password.trim();

    /* -------------------------------------------------------
       VALIDATION
       ------------------------------------------------------- */

    if (
      !cleanStaffId &&
      !cleanPassword
    ) {
      setError(
        "Please enter your staff ID and password."
      );
      return;
    }

    if (!cleanStaffId) {
      setError(
        "Please enter your staff ID."
      );
      return;
    }

    if (!cleanPassword) {
      setError(
        "Please enter your password."
      );
      return;
    }

    /* -------------------------------------------------------
       LOGIN STATE
       ------------------------------------------------------- */

    setLoading(true);

    const session = loginStaff({
      staffId: cleanStaffId,
      name: "Hospital Operator",
      role: "Hospital Staff",
    });

    if (!session) {
      setLoading(false);

      setError(
        "Unable to create staff session."
      );

      return;
    }

    /* -------------------------------------------------------
       RETURN TO REQUESTED STAFF PAGE
       ------------------------------------------------------- */

    const requestedPath =
      location.state?.from;

    const destination =
      requestedPath &&
      requestedPath.startsWith(
        "/staff/"
      ) &&
      requestedPath !==
        "/staff/login"
        ? requestedPath
        : "/staff/dashboard";

    setTimeout(() => {
      navigate(
        destination,
        {
          replace: true,
        }
      );

      setLoading(false);
    }, 300);
  };

  /* =========================================================
     HOME
     ========================================================= */

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="staff-login-page">

      {/* =====================================================
          BACKGROUND
         ===================================================== */}

      <div className="staff-login-grid"></div>

      <div className="staff-login-glow staff-login-glow-one"></div>

      <div className="staff-login-glow staff-login-glow-two"></div>

      <div className="staff-login-orbit staff-login-orbit-one"></div>

      <div className="staff-login-orbit staff-login-orbit-two"></div>

      {/* =====================================================
          TOP BAR
         ===================================================== */}

      <header className="staff-login-topbar">

        <button
          type="button"
          className="staff-login-back"
          onClick={goHome}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="staff-login-brand">

          <div className="staff-login-brand-icon">
            <HeartPulse size={20} />
          </div>

          <div>
            <strong>
              Smart<span>Care</span>
            </strong>

            <small>
              Hospital Staff Portal
            </small>
          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="staff-login-main">

        {/* ===================================================
            LOGIN CARD
           =================================================== */}

        <section className="staff-login-card">

          <div className="staff-login-card-top">

            <div className="staff-login-status">
              <span></span>
              SECURE STAFF ACCESS
            </div>

            <div className="staff-login-shield">
              <ShieldCheck size={19} />
            </div>

          </div>

          {/* =================================================
              HEADING
             ================================================= */}

          <div className="staff-login-heading">

            <h1>
              Welcome
              <span>
                back.
              </span>
            </h1>

            <p>
              Sign in to access the SmartCare hospital
              operations dashboard.
            </p>

          </div>

          {/* =================================================
              FORM
             ================================================= */}

          <form
            className="staff-login-form"
            onSubmit={handleSubmit}
          >

            {/* STAFF ID */}

            <div className="staff-login-field">

              <label htmlFor="staffId">
                Staff ID
              </label>

              <div className="staff-login-input-wrap">

                <UserRound size={17} />

                <input
                  id="staffId"
                  name="staffId"
                  type="text"
                  placeholder="Enter your staff ID"
                  value={staffId}
                  onChange={(event) => {
                    setStaffId(
                      event.target.value
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="username"
                  autoFocus
                />

              </div>
            </div>

            {/* PASSWORD */}

            <div className="staff-login-field">

              <label htmlFor="staffPassword">
                Password
              </label>

              <div className="staff-login-input-wrap">

                <LockKeyhole size={17} />

                <input
                  id="staffPassword"
                  name="staffPassword"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="staff-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="staff-login-error"
                role="alert"
              >
                <span></span>
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="staff-login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="staff-login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* =================================================
              DIVIDER
             ================================================= */}

          <div className="staff-login-divider">
            <span></span>
            <small>
              PROTOTYPE ACCESS
            </small>
            <span></span>
          </div>

          {/* =================================================
              DEMO INFO
             ================================================= */}

          <div className="staff-login-demo">

            <ShieldCheck size={16} />

            <div>
              <strong>
                Frontend prototype mode
              </strong>

              <span>
                Any non-empty Staff ID and password
                can be used for this demo.
              </span>
            </div>

          </div>

        </section>

        {/* ===================================================
            SIDE INFORMATION
           =================================================== */}

        <aside className="staff-login-info">

          <div className="staff-login-info-badge">
            <HeartPulse size={15} />
            SMARTCARE OPERATIONS
          </div>

          <h2>
            Smarter hospital
            <span>
              coordination.
            </span>
          </h2>

          <p>
            Give hospital staff a clear view of patient
            flow, queue priorities and emergency cases
            from one centralized interface.
          </p>

          <div className="staff-login-features">

            <Feature
              number="01"
              title="Live Queue"
              description="Monitor active patient flow."
            />

            <Feature
              number="02"
              title="Priority Tracking"
              description="See emergency and urgent cases."
            />

            <Feature
              number="03"
              title="Patient Coordination"
              description="Manage queue progress efficiently."
            />

          </div>

        </aside>

      </main>

      {/* =====================================================
          FOOTER
         ===================================================== */}

      <footer className="staff-login-footer">

        <div>
          <HeartPulse size={14} />
          SmartCare
        </div>

        <span>
          Hospital operations • Smart queue • Patient flow
        </span>

      </footer>

    </div>
  );
}

/* =========================================================
   FEATURE COMPONENT
   ========================================================= */

function Feature({
  number,
  title,
  description,
}) {
  return (
    <div className="staff-login-feature">

      <div className="staff-login-feature-number">
        {number}
      </div>

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

    </div>
  );
}

export default StaffLogin;