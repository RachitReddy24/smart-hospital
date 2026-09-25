import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  HeartPulse,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Building2,
  Activity,
} from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  /* =========================================================
     CLOSE MENUS WHEN ROUTE CHANGES
     ========================================================= */
  useEffect(() => {
    setMobileMenu(false);
    setServicesOpen(false);
  }, [location.pathname]);

  /* =========================================================
     CLOSE DROPDOWN WITH ESCAPE
     ========================================================= */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileMenu(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =========================================================
     SCROLL TO HOME SECTION
     Works even when user is on another page.
     ========================================================= */
  const scrollTo = (id) => {
    const goToSection = () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        goToSection();
      }, 120);
    } else {
      goToSection();
    }

    setMobileMenu(false);
    setServicesOpen(false);
  };

  /* =========================================================
     PATIENT REGISTRATION
     ========================================================= */
  const goToRegistration = () => {
    navigate("/patient/register");

    setMobileMenu(false);
    setServicesOpen(false);
  };

  /* =========================================================
     STAFF LOGIN
     ========================================================= */
  const goToStaffLogin = () => {
    navigate("/staff/login");

    setMobileMenu(false);
    setServicesOpen(false);
  };

  /* =========================================================
     HOSPITAL INFORMATION
     ========================================================= */
  const goToHospital = () => {
    navigate("/hospital");

    setMobileMenu(false);
    setServicesOpen(false);
  };

  /* =========================================================
     LIVE QUEUE
     ========================================================= */
  const goToQueue = () => {
    navigate("/queue/display");

    setMobileMenu(false);
    setServicesOpen(false);
  };

  /* =========================================================
     PATIENT TRIAGE
     ========================================================= */
  const goToTriage = () => {
    navigate("/patient/triage");

    setMobileMenu(false);
    setServicesOpen(false);
  };

  /* =========================================================
     HOME
     ========================================================= */
  const goHome = () => {
    navigate("/");

    setMobileMenu(false);
    setServicesOpen(false);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  /* =========================================================
     TOGGLE MOBILE MENU
     ========================================================= */
  const toggleMobileMenu = () => {
    setMobileMenu((value) => !value);
    setServicesOpen(false);
  };

  /* =========================================================
     TOGGLE SERVICES
     ========================================================= */
  const toggleServices = () => {
    setServicesOpen((value) => !value);
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* =====================================================
            LOGO
           ===================================================== */}

        <button
          type="button"
          className="logo"
          onClick={goHome}
          aria-label="SmartCare Home"
        >
          <div className="logo-icon">
            <HeartPulse
              size={24}
              strokeWidth={2.5}
            />
          </div>

          <div className="logo-text">
            <strong>
              Smart<span>Care</span>
            </strong>

            <small>
              Smart Hospital System
            </small>
          </div>
        </button>

        {/* =====================================================
            DESKTOP NAVIGATION
           ===================================================== */}

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {/* HOME */}

          <button
            type="button"
            className={
              location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={goHome}
          >
            Home
          </button>

          {/* FEATURES */}

          <button
            type="button"
            className="nav-link"
            onClick={() => scrollTo("features")}
          >
            Features
          </button>

          {/* =================================================
              SERVICES DROPDOWN
             ================================================= */}

          <div className="nav-dropdown">
            <button
              type="button"
              className="nav-link dropdown-trigger"
              onClick={toggleServices}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services

              <ChevronDown
                size={14}
                className={
                  servicesOpen
                    ? "chevron open"
                    : "chevron"
                }
              />
            </button>

            {servicesOpen && (
              <div className="dropdown-menu">

                {/* EMERGENCY TRIAGE */}

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={goToTriage}
                >
                  <div className="dropdown-icon red">
                    <HeartPulse size={16} />
                  </div>

                  <div>
                    <strong>
                      Emergency Triage
                    </strong>

                    <small>
                      Priority assessment
                    </small>
                  </div>
                </button>

                {/* SMART QUEUE */}

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={goToQueue}
                >
                  <div className="dropdown-icon blue">
                    <Activity size={16} />
                  </div>

                  <div>
                    <strong>
                      Smart Queue
                    </strong>

                    <small>
                      Live patient flow
                    </small>
                  </div>
                </button>

                {/* HOSPITAL INFO */}

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={goToHospital}
                >
                  <div className="dropdown-icon blue">
                    <Building2 size={16} />
                  </div>

                  <div>
                    <strong>
                      Hospital Information
                    </strong>

                    <small>
                      Departments & facilities
                    </small>
                  </div>
                </button>

                {/* STAFF PORTAL */}

                <button
                  type="button"
                  className="dropdown-item"
                  onClick={goToStaffLogin}
                >
                  <div className="dropdown-icon staff">
                    <ShieldCheck size={16} />
                  </div>

                  <div>
                    <strong>
                      Staff Portal
                    </strong>

                    <small>
                      Hospital operations
                    </small>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* HOW IT WORKS */}

          <button
            type="button"
            className="nav-link"
            onClick={() => scrollTo("how-it-works")}
          >
            How It Works
          </button>

          {/* EMERGENCY */}

          <button
            type="button"
            className="nav-link emergency-nav"
            onClick={goToTriage}
          >
            Emergency
          </button>
        </nav>

        {/* =====================================================
            RIGHT ACTIONS
           ===================================================== */}

        <div className="nav-actions">

          {/* SEARCH */}

          <button
            type="button"
            className="search-button"
            aria-label="Search SmartCare"
            onClick={() => scrollTo("features")}
          >
            <Search size={19} />
          </button>

          {/* DAY / NIGHT */}

          <button
            type="button"
            className="theme-switch"
            onClick={() =>
              setDarkMode((value) => !value)
            }
            aria-label={
              darkMode
                ? "Switch to day mode"
                : "Switch to night mode"
            }
            aria-pressed={darkMode}
          >
            <Sun
              size={16}
              className="theme-sun"
            />

            <span className="theme-toggle-circle"></span>

            <Moon
              size={16}
              className="theme-moon"
            />
          </button>

          {/* STAFF PORTAL */}

          <button
            type="button"
            className="nav-staff"
            onClick={goToStaffLogin}
          >
            <ShieldCheck size={15} />

            Staff
          </button>

          {/* PATIENT REGISTRATION */}

          <button
            type="button"
            className="nav-cta"
            onClick={goToRegistration}
          >
            Get Started

            <ArrowRight size={17} />
          </button>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label={
              mobileMenu
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* =======================================================
          MOBILE MENU
         ======================================================= */}

      {mobileMenu && (
        <div
          className="mobile-menu"
          aria-label="Mobile navigation"
        >

          {/* HOME */}

          <button
            type="button"
            onClick={goHome}
          >
            Home

            <ArrowRight size={15} />
          </button>

          {/* FEATURES */}

          <button
            type="button"
            onClick={() => scrollTo("features")}
          >
            Features

            <ArrowRight size={15} />
          </button>

          {/* HOW IT WORKS */}

          <button
            type="button"
            onClick={() => scrollTo("how-it-works")}
          >
            How It Works

            <ArrowRight size={15} />
          </button>

          {/* HOSPITAL INFO */}

          <button
            type="button"
            onClick={goToHospital}
          >
            Hospital Information

            <Building2 size={16} />
          </button>

          {/* LIVE QUEUE */}

          <button
            type="button"
            onClick={goToQueue}
          >
            Live Queue

            <Activity size={16} />
          </button>

          {/* EMERGENCY TRIAGE */}

          <button
            type="button"
            onClick={goToTriage}
          >
            Emergency Triage

            <HeartPulse size={16} />
          </button>

          {/* STAFF */}

          <button
            type="button"
            className="mobile-staff"
            onClick={goToStaffLogin}
          >
            Staff Portal

            <ShieldCheck size={16} />
          </button>

          {/* REGISTER */}

          <button
            type="button"
            className="mobile-start"
            onClick={goToRegistration}
          >
            Register as Patient

            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;