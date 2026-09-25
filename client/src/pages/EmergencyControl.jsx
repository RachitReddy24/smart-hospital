import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertOctagon,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  Phone,
  RefreshCw,
  ShieldAlert,
  Siren,
  Stethoscope,
  UserRound,
} from "lucide-react";

import {
  getQueue,
  updateQueueEntry,
} from "../utils/smartCareStorage";

import "./EmergencyControl.css";

const demoEmergencyPatients = [
  {
    id: "emergency-demo-1",
    token: "ER-042",
    name: "Emergency Patient",
    age: "54",
    gender: "Male",
    phone: "+91 XXXXX XXXXX",
    department: "Emergency Department",
    priority: "Emergency",
    priorityClass: "emergency",
    symptoms:
      "Chest discomfort, breathing difficulty",
    painLevel: "8",
    condition: "Worsening",
    location: "SmartCare Main Hospital",
    floor: "Emergency Floor",
    room: "ER — 01",
    queuePosition: 1,
    wait: "Now",
    status: "Waiting",
    time: "10:42 AM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "emergency-demo-2",
    token: "ER-043",
    name: "Emergency Patient",
    age: "31",
    gender: "Female",
    phone: "+91 XXXXX XXXXX",
    department: "Emergency Department",
    priority: "Emergency",
    priorityClass: "emergency",
    symptoms:
      "Heavy bleeding, severe pain",
    painLevel: "9",
    condition: "Worsening",
    location: "SmartCare Main Hospital",
    floor: "Emergency Floor",
    room: "ER — 02",
    queuePosition: 2,
    wait: "Immediate",
    status: "Waiting",
    time: "10:45 AM",
    createdAt: new Date().toISOString(),
  },
];

function EmergencyControl() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] =
    useState(null);
  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  const loadEmergencyQueue = () => {
    const storedQueue = getQueue();

    const emergencyStored =
      storedQueue.filter(
        (item) =>
          item.priority === "Emergency" &&
          item.status !== "Completed"
      );

    const source =
      emergencyStored.length > 0
        ? emergencyStored
        : demoEmergencyPatients;

    const sorted = [...source].sort(
      (a, b) =>
        (a.queuePosition || 999) -
        (b.queuePosition || 999)
    );

    setPatients(sorted);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmergencyQueue();

    const interval = setInterval(() => {
      loadEmergencyQueue();
    }, 3000);

    const handleStorage = () => {
      loadEmergencyQueue();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  const waitingCount = patients.filter(
    (patient) => patient.status === "Waiting"
  ).length;

  const calledCount = patients.filter(
    (patient) => patient.status === "Called"
  ).length;

  const severeCount = patients.filter(
    (patient) =>
      Number(patient.painLevel || 0) >= 8
  ).length;

  const activePatient = useMemo(
    () =>
      patients.find(
        (patient) =>
          patient.status === "Called"
      ) || null,
    [patients]
  );

  const callPatient = (patient) => {
    const updated = {
      ...patient,
      status: "Called",
      wait: "Now",
      calledAt: new Date().toISOString(),
    };

    updateQueueEntry(
      patient.id,
      updated
    );

    setPatients((current) =>
      current.map((item) =>
        item.id === patient.id
          ? updated
          : item
      )
    );

    setSelectedPatient(updated);
  };

  const markCompleted = (patient) => {
    const updated = {
      ...patient,
      status: "Completed",
      completedAt: new Date().toISOString(),
    };

    updateQueueEntry(
      patient.id,
      updated
    );

    setPatients((current) =>
      current.filter(
        (item) => item.id !== patient.id
      )
    );

    setSelectedPatient(null);
  };

  return (
    <div className="emergency-control-page">
      <div className="emergency-control-grid"></div>

      <div className="emergency-control-glow glow-one"></div>
      <div className="emergency-control-glow glow-two"></div>

      <header className="emergency-header">
        <div className="emergency-brand">
          <div className="emergency-brand-icon">
            <HeartPulse size={21} />
          </div>

          <div>
            <strong>SmartCare</strong>
            <small>EMERGENCY CONTROL CENTER</small>
          </div>
        </div>

        <div className="emergency-header-actions">
          <div className="emergency-live">
            <span></span>
            Emergency System Live
          </div>

          <button
            type="button"
            className="emergency-refresh"
            onClick={loadEmergencyQueue}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="emergency-back"
            onClick={() =>
              navigate("/staff/dashboard")
            }
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </header>

      <main className="emergency-main">
        <section className="emergency-hero">
          <div>
            <div className="emergency-eyebrow">
              <span></span>
              PRIORITY RESPONSE
            </div>

            <h1>
              Emergency
              <span>Control Center</span>
            </h1>

            <p>
              Monitor emergency-priority patients,
              coordinate queue movement, and keep
              critical cases visible to the care team.
            </p>
          </div>

          <div className="emergency-alert-card">
            <ShieldAlert size={23} />

            <div>
              <strong>Emergency queue active</strong>
              <span>
                {waitingCount} patient
                {waitingCount === 1 ? "" : "s"} waiting
                for priority assessment.
              </span>
            </div>
          </div>
        </section>

        <section className="emergency-stat-grid">
          <EmergencyStat
            icon={<Siren size={19} />}
            label="Emergency Cases"
            value={patients.length}
            danger
          />

          <EmergencyStat
            icon={<Clock3 size={19} />}
            label="Waiting"
            value={waitingCount}
          />

          <EmergencyStat
            icon={<Activity size={19} />}
            label="In Progress"
            value={calledCount}
          />

          <EmergencyStat
            icon={<AlertOctagon size={19} />}
            label="Severe Pain"
            value={severeCount}
            danger
          />
        </section>

        <section className="emergency-current">
          <div className="emergency-current-header">
            <div>
              <span>ACTIVE RESPONSE</span>
              <h2>
                {activePatient
                  ? activePatient.token
                  : "No patient currently called"}
              </h2>
            </div>

            <div className="emergency-active-badge">
              <span></span>
              LIVE
            </div>
          </div>

          {activePatient ? (
            <div className="emergency-current-body">
              <div className="current-patient-block">
                <div className="current-avatar">
                  <UserRound size={23} />
                </div>

                <div>
                  <strong>
                    {activePatient.name ||
                      "Emergency Patient"}
                  </strong>

                  <span>
                    {activePatient.department}
                  </span>
                </div>
              </div>

              <div className="current-room">
                <small>ASSIGNED ROOM</small>
                <strong>
                  {activePatient.room || "ER — 01"}
                </strong>
              </div>

              <div className="current-condition">
                <small>REPORTED CONDITION</small>
                <strong>
                  {activePatient.condition ||
                    "Emergency"}
                </strong>
              </div>
            </div>
          ) : (
            <div className="emergency-current-empty">
              <Bell size={20} />
              <span>
                Call a patient below to begin active
                emergency response.
              </span>
            </div>
          )}
        </section>

        <section className="emergency-content">
          <div className="emergency-queue-card">
            <div className="emergency-card-heading">
              <div>
                <span>EMERGENCY QUEUE</span>
                <h2>Priority Patients</h2>
              </div>

              <div className="emergency-count">
                {patients.length} active
              </div>
            </div>

            <div className="emergency-divider"></div>

            {patients.length > 0 ? (
              <div className="emergency-patient-list">
                {patients.map(
                  (patient, index) => (
                    <EmergencyPatientCard
                      key={patient.id}
                      patient={patient}
                      index={index}
                      onSelect={() =>
                        setSelectedPatient(
                          patient
                        )
                      }
                      onCall={() =>
                        callPatient(patient)
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="emergency-empty">
                <CheckCircle2 size={25} />
                <h3>
                  Emergency queue clear
                </h3>
                <p>
                  No active emergency-priority
                  patients are currently waiting.
                </p>
              </div>
            )}
          </div>

          <aside className="emergency-side">
            <div className="emergency-side-header">
              <span>RESPONSE PROTOCOL</span>
              <Siren size={17} />
            </div>

            <div className="response-step">
              <div className="response-number">
                01
              </div>
              <div>
                <strong>Review symptoms</strong>
                <span>
                  Confirm reported emergency
                  symptoms.
                </span>
              </div>
            </div>

            <div className="response-line"></div>

            <div className="response-step">
              <div className="response-number">
                02
              </div>
              <div>
                <strong>Call patient</strong>
                <span>
                  Assign the patient to the
                  emergency response area.
                </span>
              </div>
            </div>

            <div className="response-line"></div>

            <div className="response-step">
              <div className="response-number">
                03
              </div>
              <div>
                <strong>Complete case</strong>
                <span>
                  Mark the queue record when
                  staff workflow is complete.
                </span>
              </div>
            </div>

            <div className="emergency-notice">
              <ShieldAlert size={17} />

              <div>
                <strong>
                  Prototype notice
                </strong>
                <span>
                  Triage priorities shown here are
                  generated by the SmartCare PBL
                  prototype and do not replace
                  qualified clinical judgment.
                </span>
              </div>
            </div>

            <div className="emergency-update-time">
              <RefreshCw size={13} />
              Last updated{" "}
              {lastUpdated.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              )}
            </div>
          </aside>
        </section>
      </main>

      {selectedPatient && (
        <div
          className="emergency-modal-overlay"
          onClick={() =>
            setSelectedPatient(null)
          }
        >
          <div
            className="emergency-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="emergency-modal-header">
              <div>
                <span>EMERGENCY PATIENT</span>
                <h2>
                  {selectedPatient.token}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPatient(null)
                }
              >
                ×
              </button>
            </div>

            <div className="emergency-profile">
              <div className="emergency-modal-avatar">
                <UserRound size={23} />
              </div>

              <div>
                <strong>
                  {selectedPatient.name ||
                    "Emergency Patient"}
                </strong>

                <span>
                  {selectedPatient.age
                    ? `${selectedPatient.age} years`
                    : "Age unavailable"}
                  {" • "}
                  {selectedPatient.gender ||
                    "Gender unavailable"}
                </span>
              </div>
            </div>

            <div className="emergency-detail-grid">
              <EmergencyDetail
                icon={<Stethoscope size={15} />}
                label="Department"
                value={
                  selectedPatient.department
                }
              />

              <EmergencyDetail
                icon={<Clock3 size={15} />}
                label="Queue Position"
                value={
                  `#${selectedPatient.queuePosition || 1}`
                }
              />

              <EmergencyDetail
                icon={<AlertOctagon size={15} />}
                label="Pain Level"
                value={
                  selectedPatient.painLevel
                    ? `${selectedPatient.painLevel}/10`
                    : "Not recorded"
                }
              />

              <EmergencyDetail
                icon={<MapPin size={15} />}
                label="Location"
                value={
                  selectedPatient.location ||
                  "Emergency Floor"
                }
              />
            </div>

            <div className="emergency-symptoms">
              <small>REPORTED SYMPTOMS</small>
              <p>
                {selectedPatient.symptoms ||
                  "No symptoms recorded"}
              </p>
            </div>

            <div className="emergency-contact">
              <Phone size={15} />
              <span>
                {selectedPatient.phone ||
                  "Phone unavailable"}
              </span>
            </div>

            <div className="emergency-modal-actions">
              {selectedPatient.status !==
                "Called" && (
                <button
                  type="button"
                  className="emergency-call-button"
                  onClick={() =>
                    callPatient(
                      selectedPatient
                    )
                  }
                >
                  <Siren size={16} />
                  Call Patient
                </button>
              )}

              <button
                type="button"
                className="emergency-complete-button"
                onClick={() =>
                  markCompleted(
                    selectedPatient
                  )
                }
              >
                <CheckCircle2 size={16} />
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmergencyStat({
  icon,
  label,
  value,
  danger = false,
}) {
  return (
    <div
      className={`emergency-stat ${
        danger ? "danger" : ""
      }`}
    >
      <div className="emergency-stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function EmergencyPatientCard({
  patient,
  index,
  onSelect,
  onCall,
}) {
  return (
    <div
      className="emergency-patient-card"
      onClick={onSelect}
    >
      <div className="emergency-patient-position">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="emergency-patient-main">
        <div className="emergency-patient-top">
          <strong>
            {patient.token}
          </strong>

          <span className="emergency-priority-pill">
            EMERGENCY
          </span>
        </div>

        <h3>
          {patient.name ||
            "Emergency Patient"}
        </h3>

        <p>
          {patient.symptoms ||
            "No symptoms recorded"}
        </p>

        <div className="emergency-patient-meta">
          <span>
            <Clock3 size={12} />
            {patient.wait || "Immediate"}
          </span>

          <span>
            <MapPin size={12} />
            {patient.room || "ER — 01"}
          </span>
        </div>
      </div>

      <div className="emergency-patient-action">
        <span
          className={`emergency-status ${
            patient.status === "Called"
              ? "called"
              : "waiting"
          }`}
        >
          {patient.status}
        </span>

        {patient.status !== "Called" && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCall();
            }}
          >
            Call
          </button>
        )}
      </div>
    </div>
  );
}

function EmergencyDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="emergency-detail">
      <div>{icon}</div>

      <span>{label}</span>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}

export default EmergencyControl;