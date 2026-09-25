import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowRight,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  const goToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section
      id="home"
      className="hero-section"
    >

      <div className="hero-grid"></div>

      <div className="hero-glow hero-glow-left"></div>

      <div className="hero-glow hero-glow-right"></div>


      <div className="hero-container">


        {/* ===================================
            LEFT
        ==================================== */}

        <div className="hero-content">

          <div className="hero-badge">

            <span className="live-dot"></span>

            <Activity size={15} />

            SMART HEALTHCARE TECHNOLOGY

          </div>


          <h1 className="hero-title">

            <span className="white-word">
              Smarter
            </span>

            <span className="blue-word">
              Queues.
            </span>

            <br />

            <span className="white-word">
              Faster
            </span>

            <span className="blue-word">
              Care.
            </span>

          </h1>


          <p className="hero-description">

            SmartCare transforms hospital patient flow
            with intelligent queue management and
            emergency triage prioritization.

          </p>


          <div className="hero-buttons">

            <button
              className="hero-primary"
              onClick={() =>
                navigate("/patient/register")
              }
            >

              Register as Patient

              <ArrowRight size={19} />

            </button>


            <button
              className="hero-secondary"
              onClick={goToFeatures}
            >

              <span className="play-circle">
                ▶
              </span>

              Explore SmartCare

            </button>

          </div>


          <div className="hero-trust">

            <div className="trust-item">

              <ShieldCheck size={22} />

              <div>

                <strong>
                  Secure
                </strong>

                <small>
                  Your data is safe
                </small>

              </div>

            </div>


            <div className="trust-item">

              <Clock3 size={22} />

              <div>

                <strong>
                  Real-time
                </strong>

                <small>
                  Live queue updates
                </small>

              </div>

            </div>


            <div className="trust-item">

              <HeartPulse size={22} />

              <div>

                <strong>
                  Healthcare
                </strong>

                <small>
                  Better patient experience
                </small>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================
            RIGHT — 3D DASHBOARD
        ==================================== */}

        <div className="hero-visual">

          <div className="big-orbit"></div>

          <div className="big-orbit orbit-two"></div>


          {/* Medical Orb */}

          <div className="medical-orb">

            <div className="orb-ring"></div>

            <div className="orb-ring ring-2"></div>

            <div className="orb-core">

              <HeartPulse size={39} />

            </div>

          </div>


          {/* Dashboard */}

          <div className="dashboard-3d">

            <div className="dashboard-top">

              <div className="dashboard-brand">

                <div className="mini-logo">
                  <HeartPulse size={14} />
                </div>

                SMARTCARE

              </div>

              <div className="dashboard-live">

                <span></span>

                LIVE

              </div>

            </div>


            <div className="dashboard-heading">

              <div>

                <small>
                  HOSPITAL QUEUE
                </small>

                <h2>
                  Emergency Center
                </h2>

              </div>

              <div className="dashboard-alert">

                <Siren size={20} />

              </div>

            </div>


            <QueueItem
              number="01"
              token="E-003"
              title="Emergency"
              subtitle="Immediate attention"
              type="emergency"
            />


            <QueueItem
              number="02"
              token="U-014"
              title="Urgent"
              subtitle="Priority consultation"
              type="urgent"
            />


            <QueueItem
              number="03"
              token="G-021"
              title="Normal"
              subtitle="Routine consultation"
              type="normal"
            />


            <div className="dashboard-bottom">

              <div className="dashboard-stat">

                <small>
                  WAIT TIME
                </small>

                <div className="dashboard-stat-value">

                  <Clock3 size={20} />

                  <strong>
                    08 min
                  </strong>

                </div>

              </div>


              <div className="dashboard-stat serving">

                <small>
                  NOW SERVING
                </small>

                <strong>
                  E-002
                </strong>

              </div>


              <div className="room">

                <small>
                  ROOM
                </small>

                <strong>
                  04
                </strong>

              </div>

            </div>

          </div>


          {/* Floating emergency */}

          <div className="floating-emergency">

            <Siren size={15} />

            Emergency Priority

          </div>


          {/* Floating wait */}

          <div className="floating-wait">

            <Clock3 size={20} />

            <div>

              <small>
                WAIT TIME
              </small>

              <strong>
                08 min
              </strong>

            </div>

          </div>


          {/* Floating patients */}

          <div className="floating-patients">

            <Users size={24} />

            <div>

              <strong>
                24
              </strong>

              <small>
                Patients Today
              </small>

            </div>

          </div>

        </div>

      </div>


      {/* Scroll */}

      <button
        className="scroll-indicator"
        onClick={goToFeatures}
      >

        <span>
          ↓
        </span>

        Scroll to explore

      </button>

    </section>
  );
}


/* Queue item */

function QueueItem({
  number,
  token,
  title,
  subtitle,
  type,
}) {
  return (
    <div
      className={`hero-queue-item ${type}`}
    >

      <span className="queue-number">
        {number}
      </span>


      <div className="queue-token">
        {token}
      </div>


      <div className="queue-text">

        <strong>
          {title}
        </strong>

        <small>
          {subtitle}
        </small>

      </div>


      <span className="queue-arrow">
        →
      </span>

    </div>
  );
}

export default Hero;