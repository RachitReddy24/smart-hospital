import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  HeartPulse,
  MapPin,
  Printer,
  QrCode,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getPatient,
  getQueueEntry,
  getTriage,
} from "../utils/smartCareStorage";

import "./TokenPass.css";

const departmentLabels = {
  emergency:
    "Emergency Department",
  general:
    "General Medicine",
  cardiology:
    "Cardiology",
  orthopedics:
    "Orthopedics",
  pediatrics:
    "Pediatrics",
  dermatology:
    "Dermatology",
  ent:
    "ENT",
};

const locationLabels = {
  main:
    "SmartCare Main Hospital",
  city:
    "SmartCare City Center",
  north:
    "SmartCare North Wing",
};

function TokenPass() {
  const navigate = useNavigate();

  const patient = getPatient();
  const triage = getTriage();

  const queueEntry =
    patient
      ? getQueueEntry(patient.id)
      : null;

  if (!patient || !queueEntry) {
    return (
      <div className="token-pass-page">
        <div className="token-pass-grid"></div>

        <main className="token-pass-empty">
          <div className="token-pass-empty-card">
            <div className="token-pass-empty-icon">
              <QrCode size={24} />
            </div>

            <span>
              SMARTCARE
            </span>

            <h1>
              Token unavailable
            </h1>

            <p>
              No active SmartCare queue token
              could be found. Complete patient
              registration and triage first.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/patient/register"
                )
              }
            >
              Start Registration
              <ArrowLeft size={16} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const department =
    queueEntry.department ||
    departmentLabels[
      patient.department
    ] ||
    "General Medicine";

  const hospital =
    queueEntry.location ||
    locationLabels[
      patient.location
    ] ||
    "SmartCare Main Hospital";

  const token =
    queueEntry.token ||
    "A-000";

  const priority =
    queueEntry.priority ||
    triage?.priority ||
    "Routine";

  const queuePosition =
    queueEntry.queuePosition || 1;

  const wait =
    queueEntry.wait ||
    `~${queuePosition * 3} min`;

  const room =
    queueEntry.room ||
    "OPD — 04";

  const floor =
    queueEntry.floor ||
    "Ground Floor";

  const registeredTime =
    queueEntry.time ||
    new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="token-pass-page">
      <div className="token-pass-grid"></div>

      <div className="token-pass-glow token-pass-glow-one"></div>
      <div className="token-pass-glow token-pass-glow-two"></div>

      <header className="token-pass-header no-print">
        <button
          type="button"
          className="token-pass-back"
          onClick={() =>
            navigate(
              "/patient/token"
            )
          }
        >
          <ArrowLeft size={17} />
          Back to Token
        </button>

        <div className="token-pass-brand">
          <div className="token-pass-brand-icon">
            <HeartPulse size={20} />
          </div>

          <div>
            <strong>
              SmartCare
            </strong>

            <small>
              DIGITAL TOKEN PASS
            </small>
          </div>
        </div>

        <button
          type="button"
          className="token-pass-print-top"
          onClick={
            handlePrint
          }
        >
          <Printer size={16} />
          Print
        </button>
      </header>

      <main className="token-pass-main">
        <div className="token-pass-heading">
          <div className="token-pass-eyebrow">
            <span></span>
            PATIENT TOKEN
          </div>

          <h1>
            Your SmartCare
            <span>queue pass.</span>
          </h1>

          <p>
            Keep this pass available while you
            wait for your hospital queue turn.
          </p>
        </div>

        <section className="token-pass-card">
          <div className="token-pass-card-top">
            <div>
              <div className="pass-mini-brand">
                <HeartPulse size={15} />
                SMARTCARE
              </div>

              <span>
                HOSPITAL QUEUE PASS
              </span>
            </div>

            <div
              className={`pass-priority ${priority.toLowerCase()}`}
            >
              {priority}
            </div>
          </div>

          <div className="token-pass-divider"></div>

          <div className="token-pass-token-area">
            <div className="token-pass-token-side">
              <small>
                YOUR TOKEN
              </small>

              <strong>
                {token}
              </strong>

              <span>
                Queue Position #{queuePosition}
              </span>
            </div>

            <div className="token-pass-qr">
              <div className="qr-frame">
                <QrCode
                  size={24}
                />

                <div className="qr-pattern">
                  {Array.from(
                    {
                      length: 64,
                    }
                  ).map(
                    (_, index) => (
                      <span
                        key={index}
                        className={
                          (
                            index * 17 +
                            token.length * 7
                          ) %
                            5 <
                          2
                            ? "filled"
                            : ""
                        }
                      ></span>
                    )
                  )}
                </div>

                <div className="qr-center">
                  <HeartPulse
                    size={11}
                  />
                </div>
              </div>

              <span>
                SMARTCARE
              </span>
            </div>
          </div>

          <div className="token-pass-patient">
            <div className="pass-profile-icon">
              <UserRound size={19} />
            </div>

            <div>
              <small>
                PATIENT
              </small>

              <strong>
                {queueEntry.name}
              </strong>

              <span>
                {patient.age
                  ? `${patient.age} years`
                  : "Age not provided"}
                {" • "}
                {patient.gender ||
                  "Not specified"}
              </span>
            </div>
          </div>

          <div className="token-pass-details">
            <PassDetail
              icon={
                <Stethoscope
                  size={15}
                />
              }
              label="Department"
              value={department}
            />

            <PassDetail
              icon={
                <Clock3
                  size={15}
                />
              }
              label="Estimated Wait"
              value={wait}
            />

            <PassDetail
              icon={
                <MapPin
                  size={15}
                />
              }
              label="Hospital"
              value={hospital}
            />

            <PassDetail
              icon={
                <Users
                  size={15}
                />
              }
              label="Queue Position"
              value={`#${queuePosition}`}
            />

            <PassDetail
              icon={
                <CalendarDays
                  size={15}
                />
              }
              label="Registered"
              value={registeredTime}
            />

            <PassDetail
              icon={
                <MapPin
                  size={15}
                />
              }
              label="Room"
              value={room}
            />
          </div>

          <div className="token-pass-location">
            <div>
              <small>
                CARE LOCATION
              </small>

              <strong>
                {floor}
              </strong>
            </div>

            <span>
              Please follow hospital staff
              instructions when called.
            </span>
          </div>

          <div className="token-pass-security">
            <ShieldCheck size={15} />

            <span>
              Queue pass generated by the
              SmartCare frontend prototype.
            </span>
          </div>
        </section>

        <div className="token-pass-actions no-print">
          <button
            type="button"
            className="token-pass-secondary"
            onClick={() =>
              navigate(
                "/patient/token"
              )
            }
          >
            <ArrowLeft size={16} />
            Back to Queue
          </button>

          <button
            type="button"
            className="token-pass-primary"
            onClick={
              handlePrint
            }
          >
            <Printer size={17} />
            Print Token Pass
          </button>
        </div>

        <div className="token-pass-note no-print">
          <ShieldCheck size={15} />

          <span>
            This is a prototype token display.
            Actual queue timing and hospital
            instructions may differ.
          </span>
        </div>

        <footer className="token-pass-footer no-print">
          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Smarter queues • Better coordination
          </span>
        </footer>
      </main>
    </div>
  );
}

function PassDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="pass-detail">
      <div className="pass-detail-icon">
        {icon}
      </div>

      <div>
        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>
      </div>
    </div>
  );
}

export default TokenPass;