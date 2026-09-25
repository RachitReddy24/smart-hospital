import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  HeartPulse,
  IdCard,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import "./PatientRegistration.css";

import {
  savePatient,
} from "../utils/smartCareStorage";

function PatientRegistration() {
  const navigate = useNavigate();

  /* =========================================================
     SUBMIT REGISTRATION
     ========================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget
    );

    const patient = {
      id:
        typeof crypto !== "undefined" &&
        crypto.randomUUID
          ? crypto.randomUUID()
          : `patient-${Date.now()}`,

      fullName:
        formData
          .get("fullName")
          ?.toString()
          .trim() || "",

      age:
        formData
          .get("age")
          ?.toString() || "",

      gender:
        formData
          .get("gender")
          ?.toString() || "",

      phone:
        formData
          .get("phone")
          ?.toString()
          .trim() || "",

      department:
        formData
          .get("department")
          ?.toString() || "",

      location:
        formData
          .get("location")
          ?.toString() || "",

      createdAt:
        new Date().toISOString(),

      status: "Registered",
    };

    savePatient(patient);

    navigate("/patient/triage");
  };

  return (
    <div className="registration-page">
      {/* =====================================================
          BACKGROUND
         ===================================================== */}

      <div className="registration-grid"></div>

      <div className="registration-glow registration-glow-one"></div>

      <div className="registration-glow registration-glow-two"></div>

      {/* =====================================================
          TOP BAR
         ===================================================== */}

      <div className="registration-topbar">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="registration-brand">
          <div className="registration-brand-icon">
            <HeartPulse size={20} />
          </div>

          <div>
            <strong>SmartCare</strong>

            <small>
              Patient Portal
            </small>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="registration-main">
        {/* ===================================================
            PROGRESS
           =================================================== */}

        <div className="registration-progress">
          <ProgressStep
            number="01"
            title="Registration"
            active
          />

          <div className="progress-line"></div>

          <ProgressStep
            number="02"
            title="Triage"
          />

          <div className="progress-line"></div>

          <ProgressStep
            number="03"
            title="Token"
          />
        </div>

        {/* ===================================================
            HEADING
           =================================================== */}

        <div className="registration-heading">
          <div className="registration-eyebrow">
            <span></span>
            PATIENT REGISTRATION
          </div>

          <h1>
            Let's get you
            <span>registered.</span>
          </h1>

          <p>
            Enter your basic information to start your
            SmartCare hospital journey.
          </p>
        </div>

        {/* ===================================================
            FORM
           =================================================== */}

        <form
          className="registration-card"
          onSubmit={handleSubmit}
        >
          {/* =================================================
              FORM HEADER
             ================================================= */}

          <div className="form-card-header">
            <div>
              <small>
                STEP 01
              </small>

              <h2>
                Patient Information
              </h2>
            </div>

            <div className="form-security">
              <Check size={15} />
              Secure
            </div>
          </div>

          <div className="form-divider"></div>

          {/* =================================================
              FULL NAME
             ================================================= */}

          <div className="form-group">
            <label htmlFor="fullName">
              Full Name
            </label>

            <div className="input-wrapper">
              <User size={17} />

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* =================================================
              AGE + GENDER
             ================================================= */}

          <div className="form-row">
            {/* AGE */}

            <div className="form-group">
              <label htmlFor="age">
                Age
              </label>

              <div className="input-wrapper">
                <CalendarDays size={17} />

                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Age"
                  required
                />
              </div>
            </div>

            {/* GENDER */}

            <div className="form-group">
              <label htmlFor="gender">
                Gender
              </label>

              <div className="input-wrapper">
                <IdCard size={17} />

                <select
                  id="gender"
                  name="gender"
                  defaultValue=""
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>

                  <option value="prefer-not">
                    Prefer not to say
                  </option>
                </select>

                <ChevronDown
                  className="select-arrow"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              PHONE
             ================================================= */}

          <div className="form-group">
            <label htmlFor="phone">
              Phone Number
            </label>

            <div className="input-wrapper">
              <Phone size={17} />

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
          </div>

          {/* =================================================
              DEPARTMENT
             ================================================= */}

          <div className="form-group">
            <label htmlFor="department">
              Department
            </label>

            <div className="input-wrapper">
              <HeartPulse size={17} />

              <select
                id="department"
                name="department"
                defaultValue=""
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select department
                </option>

                <option value="emergency">
                  Emergency Department
                </option>

                <option value="general">
                  General Medicine
                </option>

                <option value="cardiology">
                  Cardiology
                </option>

                <option value="orthopedics">
                  Orthopedics
                </option>

                <option value="pediatrics">
                  Pediatrics
                </option>

                <option value="dermatology">
                  Dermatology
                </option>

                <option value="ent">
                  ENT
                </option>
              </select>

              <ChevronDown
                className="select-arrow"
                size={16}
              />
            </div>
          </div>

          {/* =================================================
              LOCATION
             ================================================= */}

          <div className="form-group">
            <label htmlFor="location">
              Preferred Hospital Location
            </label>

            <div className="input-wrapper">
              <MapPin size={17} />

              <select
                id="location"
                name="location"
                defaultValue=""
                required
              >
                <option
                  value=""
                  disabled
                >
                  Select hospital
                </option>

                <option value="main">
                  SmartCare Main Hospital
                </option>

                <option value="city">
                  SmartCare City Center
                </option>

                <option value="north">
                  SmartCare North Wing
                </option>
              </select>

              <ChevronDown
                className="select-arrow"
                size={16}
              />
            </div>
          </div>

          {/* =================================================
              CONSENT
             ================================================= */}

          <label className="consent-row">
            <input
              type="checkbox"
              required
            />

            <span>
              I confirm that the information entered above
              is correct.
            </span>
          </label>

          {/* =================================================
              SUBMIT
             ================================================= */}

          <button
            type="submit"
            className="registration-submit"
          >
            Continue to Triage

            <ArrowRight size={18} />
          </button>

          <p className="form-note">
            This is a prototype interface. Emergency
            decisions should be made by qualified medical staff.
          </p>
        </form>

        {/* ===================================================
            HELP
           =================================================== */}

        <div className="registration-help">
          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Your next step is Emergency Triage
          </span>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PROGRESS STEP
   ========================================================= */

function ProgressStep({
  number,
  title,
  active = false,
}) {
  return (
    <div
      className={
        active
          ? "progress-step active"
          : "progress-step"
      }
    >
      <div className="progress-circle">
        {number}
      </div>

      <span>
        {title}
      </span>
    </div>
  );
}

export default PatientRegistration;