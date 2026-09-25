import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Bell,
  Clock3,
  HeartPulse,
  MonitorPlay,
  RefreshCw,
  Users,
  Volume2,
} from "lucide-react";

import { getQueue } from "../utils/smartCareStorage";

import "./QueueDisplay.css";

const demoQueue = [
  {
    id: "demo-1",
    token: "ER-042",
    name: "Emergency Desk",
    department: "Emergency Department",
    priority: "Emergency",
    status: "Called",
    room: "Emergency Room 01",
    queuePosition: 1,
    wait: "Now",
  },
  {
    id: "demo-2",
    token: "U-084",
    name: "Patient",
    department: "General Medicine",
    priority: "Urgent",
    status: "Waiting",
    room: "OPD Room 04",
    queuePosition: 2,
    wait: "08 min",
  },
  {
    id: "demo-3",
    token: "U-085",
    name: "Patient",
    department: "Cardiology",
    priority: "Urgent",
    status: "Waiting",
    room: "OPD Room 06",
    queuePosition: 3,
    wait: "15 min",
  },
  {
    id: "demo-4",
    token: "A-127",
    name: "Patient",
    department: "Orthopedics",
    priority: "Routine",
    status: "Waiting",
    room: "OPD Room 09",
    queuePosition: 4,
    wait: "21 min",
  },
  {
    id: "demo-5",
    token: "A-128",
    name: "Patient",
    department: "General Medicine",
    priority: "Routine",
    status: "Waiting",
    room: "OPD Room 04",
    queuePosition: 5,
    wait: "27 min",
  },
];

const priorityWeight = {
  Emergency: 1,
  Urgent: 2,
  Routine: 3,
};

function QueueDisplay() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(
    new Date()
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState("all");

  const loadQueue = () => {
    const storedQueue = getQueue();

    if (storedQueue.length > 0) {
      setQueue(storedQueue);
    } else {
      setQueue(demoQueue);
    }

    setLastUpdated(new Date());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQueue();

    const interval = setInterval(() => {
      loadQueue();
    }, 3000);

    const handleStorage = () => {
      loadQueue();
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

  const departments = useMemo(() => {
    const values = queue
      .map((item) => item.department)
      .filter(Boolean);

    return ["all", ...new Set(values)];
  }, [queue]);

  const filteredQueue = useMemo(() => {
    const active = queue.filter(
      (item) => item.status !== "Completed"
    );

    const filtered =
      selectedDepartment === "all"
        ? active
        : active.filter(
            (item) =>
              item.department === selectedDepartment
          );

    return [...filtered].sort((a, b) => {
      if (a.status === "Called" && b.status !== "Called") {
        return -1;
      }

      if (b.status === "Called" && a.status !== "Called") {
        return 1;
      }

      const priorityDifference =
        (priorityWeight[a.priority] || 3) -
        (priorityWeight[b.priority] || 3);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        (a.queuePosition || 999) -
        (b.queuePosition || 999)
      );
    });
  }, [queue, selectedDepartment]);

  const currentPatient = useMemo(
    () =>
      filteredQueue.find(
        (item) => item.status === "Called"
      ) || null,
    [filteredQueue]
  );

  const waitingPatients = useMemo(
    () =>
      filteredQueue.filter(
        (item) => item.status === "Waiting"
      ),
    [filteredQueue]
  );

  const activePatients = filteredQueue.length;

  const emergencyCount = filteredQueue.filter(
    (item) => item.priority === "Emergency"
  ).length;

  const urgentCount = filteredQueue.filter(
    (item) => item.priority === "Urgent"
  ).length;

  const avgWait = useMemo(() => {
    const waits = waitingPatients
      .map((item) => {
        const numeric = String(item.wait || "")
          .replace(/[^\d]/g, "");

        return numeric ? Number(numeric) : null;
      })
      .filter((value) => value !== null);

    if (!waits.length) return "—";

    const total = waits.reduce(
      (sum, value) => sum + value,
      0
    );

    return `${Math.round(total / waits.length)} min`;
  }, [waitingPatients]);

  return (
    <div className="queue-display-page">
      <div className="queue-display-grid"></div>

      <div className="queue-orbit queue-orbit-one"></div>
      <div className="queue-orbit queue-orbit-two"></div>

      <header className="queue-display-header">
        <div className="queue-display-brand">
          <div className="queue-display-brand-icon">
            <HeartPulse size={23} />
          </div>

          <div>
            <strong>SmartCare</strong>
            <span>LIVE QUEUE DISPLAY</span>
          </div>
        </div>

        <div className="queue-display-header-right">
          <div className="queue-live-indicator">
            <span></span>
            System Live
          </div>

          <button
            type="button"
            className="queue-icon-button"
            onClick={loadQueue}
            title="Refresh queue"
          >
            <RefreshCw size={17} />
          </button>

          <button
            type="button"
            className="queue-back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Home
          </button>
        </div>
      </header>

      <main className="queue-display-main">
        <section className="queue-display-top">
          <div>
            <div className="queue-eyebrow">
              <span></span>
              PATIENT QUEUE
            </div>

            <h1>
              Live Queue
              <span>Display</span>
            </h1>

            <p>
              Follow your token status and stay informed
              while SmartCare manages the hospital queue.
            </p>
          </div>

          <div className="queue-controls">
            <label htmlFor="queueDepartment">
              Department
            </label>

            <select
              id="queueDepartment"
              value={selectedDepartment}
              onChange={(event) =>
                setSelectedDepartment(
                  event.target.value
                )
              }
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item === "all"
                    ? "All Departments"
                    : item}
                </option>
              ))}
            </select>

            <div className="queue-updated">
              <Clock3 size={14} />
              Updated{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        </section>

        <section className="queue-current-card">
          <div className="current-card-glow"></div>

          <div className="current-card-left">
            <div className="current-label">
              <Bell size={15} />
              NOW SERVING
            </div>

            {currentPatient ? (
              <>
                <div className="current-token">
                  {currentPatient.token}
                </div>

                <div className="current-patient-name">
                  Please proceed to{" "}
                  <strong>
                    {currentPatient.room ||
                      "the assigned room"}
                  </strong>
                </div>

                <div className="current-department">
                  {currentPatient.department ||
                    "Hospital Services"}
                </div>
              </>
            ) : (
              <>
                <div className="current-token idle">
                  —
                </div>

                <div className="current-patient-name">
                  Waiting for the next patient
                </div>

                <div className="current-department">
                  Please remain seated.
                </div>
              </>
            )}
          </div>

          <div className="current-card-right">
            <div className="speaker-orb">
              <Volume2 size={27} />
            </div>

            <span>Queue announcement</span>

            <small>
              Your token will appear here when called.
            </small>
          </div>
        </section>

        <section className="queue-stat-grid">
          <QueueStat
            icon={<Users size={18} />}
            label="Active Patients"
            value={activePatients}
          />

          <QueueStat
            icon={<MonitorPlay size={18} />}
            label="Emergency"
            value={emergencyCount}
            accent="danger"
          />

          <QueueStat
            icon={<HeartPulse size={18} />}
            label="Urgent"
            value={urgentCount}
            accent="warning"
          />

          <QueueStat
            icon={<Clock3 size={18} />}
            label="Average Wait"
            value={avgWait}
          />
        </section>

        <section className="queue-content-grid">
          <div className="queue-list-card">
            <div className="queue-card-header">
              <div>
                <span>UP NEXT</span>
                <h2>Waiting Queue</h2>
              </div>

              <div className="queue-count-pill">
                {waitingPatients.length} waiting
              </div>
            </div>

            <div className="queue-card-divider"></div>

            {waitingPatients.length > 0 ? (
              <div className="queue-list">
                {waitingPatients
                  .slice(0, 8)
                  .map((patient, index) => (
                    <QueueRow
                      key={patient.id}
                      patient={patient}
                      position={index + 1}
                    />
                  ))}
              </div>
            ) : (
              <div className="queue-empty-state">
                <div className="queue-empty-icon">
                  <MonitorPlay size={23} />
                </div>

                <h3>No patients waiting</h3>
                <p>
                  The waiting queue is currently clear.
                </p>
              </div>
            )}
          </div>

          <aside className="queue-side-card">
            <div className="queue-side-header">
              <span>STATUS</span>
              <div className="mini-live-dot"></div>
            </div>

            <div className="queue-status-heading">
              <h2>Queue Flow</h2>
              <p>
                Priority-based patient movement
              </p>
            </div>

            <div className="queue-flow">
              <FlowStep
                number="01"
                title="Emergency"
                text="Handled first"
                className="emergency"
              />

              <div className="flow-line"></div>

              <FlowStep
                number="02"
                title="Urgent"
                text="Priority care"
                className="urgent"
              />

              <div className="flow-line"></div>

              <FlowStep
                number="03"
                title="Routine"
                text="Standard queue"
                className="routine"
              />
            </div>

            <div className="queue-side-notice">
              <Bell size={17} />
              <div>
                <strong>Please stay alert</strong>
                <span>
                  Listen for your token or watch this
                  display for updates.
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section className="queue-display-footer">
          <div>
            <HeartPulse size={16} />
            <strong>SmartCare</strong>
            <span>
              Smart Hospital Queue Management System
            </span>
          </div>

          <span>
            Prototype interface • Medical decisions
            remain with qualified staff
          </span>
        </section>
      </main>
    </div>
  );
}

function QueueStat({
  icon,
  label,
  value,
  accent = "",
}) {
  return (
    <div
      className={`queue-stat-card ${
        accent ? `accent-${accent}` : ""
      }`}
    >
      <div className="queue-stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function QueueRow({ patient, position }) {
  const priorityClass =
    patient.priorityClass ||
    patient.priority?.toLowerCase() ||
    "routine";

  return (
    <div className="queue-row">
      <div className="queue-position">
        {String(position).padStart(2, "0")}
      </div>

      <div className="queue-token">
        {patient.token}
      </div>

      <div className="queue-patient">
        <strong>
          {patient.name || "Patient"}
        </strong>

        <span>
          {patient.department || "Hospital Services"}
        </span>
      </div>

      <div
        className={`queue-priority ${priorityClass}`}
      >
        {patient.priority || "Routine"}
      </div>

      <div className="queue-wait">
        <Clock3 size={13} />
        {patient.wait || "—"}
      </div>
    </div>
  );
}

function FlowStep({
  number,
  title,
  text,
  className,
}) {
  return (
    <div className={`flow-step ${className}`}>
      <div className="flow-number">{number}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default QueueDisplay;