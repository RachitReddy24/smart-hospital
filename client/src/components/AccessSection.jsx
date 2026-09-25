import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  UserRound,
  Stethoscope,
  Activity,
  Users,
} from "lucide-react";

function AccessSection() {
  const navigate = useNavigate();

  return (
    <section
      id="portal-access"
      className="access-section"
    >
      <div className="access-bg-glow access-bg-glow-one"></div>
      <div className="access-bg-glow access-bg-glow-two"></div>

      <div className="access-container">
        {/* =================================================
            HEADER
           ================================================= */}

        <div className="access-heading">
          <div className="access-eyebrow">
            <span></span>
            SMARTCARE ACCESS
          </div>

          <h2>
            One platform.
            <span>Two experiences.</span>
          </h2>

          <p>
            Choose the experience that matches your role.
            Patients can join the care queue, while hospital
            staff can manage patient flow.
          </p>
        </div>

        {/* =================================================
            CARDS
           ================================================= */}

        <div className="access-grid">
          {/* =================================================
              PATIENT
             ================================================= */}

          <article className="access-card patient-access">
            <div className="access-card-glow"></div>

            <div className="access-card-top">
              <div className="access-card-icon">
                <UserRound size={24} />
              </div>

              <div className="access-card-tag">
                PATIENT
              </div>
            </div>

            <div className="access-card-content">
              <small>FOR PATIENTS</small>

              <h3>
                Start your
                <span>care journey.</span>
              </h3>

              <p>
                Register, complete the prototype triage
                flow, receive your queue token and follow
                your position in the hospital queue.
              </p>
            </div>

            <div className="access-mini-stats">
              <div>
                <HeartPulse size={15} />
                Registration
              </div>

              <div>
                <Activity size={15} />
                Smart Triage
              </div>

              <div>
                <Users size={15} />
                Queue Token
              </div>
            </div>

            <button
              type="button"
              className="access-card-button patient-button"
              onClick={() =>
                navigate("/patient/register")
              }
            >
              Register as Patient
              <ArrowRight size={17} />
            </button>
          </article>

          {/* =================================================
              STAFF
             ================================================= */}

          <article className="access-card staff-access">
            <div className="access-card-glow"></div>

            <div className="access-card-top">
              <div className="access-card-icon staff-icon">
                <Stethoscope size={24} />
              </div>

              <div className="access-card-tag staff-tag">
                HOSPITAL STAFF
              </div>
            </div>

            <div className="access-card-content">
              <small>FOR HOSPITAL STAFF</small>

              <h3>
                Manage patient
                <span>flow smarter.</span>
              </h3>

              <p>
                Access the operations dashboard to view
                active patients, monitor priorities and
                coordinate the hospital queue.
              </p>
            </div>

            <div className="access-mini-stats">
              <div>
                <ShieldCheck size={15} />
                Secure Access
              </div>

              <div>
                <Activity size={15} />
                Live Queue
              </div>

              <div>
                <Users size={15} />
                Patient Flow
              </div>
            </div>

            <button
              type="button"
              className="access-card-button staff-button"
              onClick={() =>
                navigate("/staff/login")
              }
            >
              Open Staff Portal
              <ArrowRight size={17} />
            </button>
          </article>
        </div>

        {/* =================================================
            SECURITY NOTE
           ================================================= */}

        <div className="access-security">
          <ShieldCheck size={16} />

          <span>
            SmartCare prototype access • Patient and staff
            experiences are separated for clearer workflows.
          </span>
        </div>
      </div>
    </section>
  );
}

export default AccessSection;