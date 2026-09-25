import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Clock3,
  HeartPulse,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";

import {
  getPatient,
  getQueue,
  getTriage,
  getQueueEntry,
} from "../utils/smartCareStorage";

import "./PatientStatus.css";

const DEMO_QUEUE = [
  {
    id: "demo-1",
    token: "ER-043",
    name: "Emergency Patient",
    age: 34,
    gender: "Male",
    department: "Emergency",
    departmentCode: "ER",
    priority: "Emergency",
    priorityClass: "emergency",
    symptoms: ["Breathing difficulty", "Chest discomfort"],
    painLevel: 8,
    condition: "Immediate attention required",
    location: "Emergency Wing",
    floor: "Ground Floor",
    room: "ER-01",
    queuePosition: 1,
    wait: 0,
    status: "Called",
    time: "10:42 AM",
  },
  {
    id: "demo-2",
    token: "U-085",
    name: "Demo Patient",
    age: 28,
    gender: "Female",
    department: "Cardiology",
    departmentCode: "CAR",
    priority: "Urgent",
    priorityClass: "urgent",
    symptoms: ["Severe chest discomfort"],
    painLevel: 6,
    condition: "Priority review required",
    location: "Main Block",
    floor: "2nd Floor",
    room: "C-204",
    queuePosition: 2,
    wait: 12,
    status: "Waiting",
    time: "10:48 AM",
  },
  {
    id: "demo-3",
    token: "A-128",
    name: "Sample Patient",
    age: 41,
    gender: "Male",
    department: "General Medicine",
    departmentCode: "GM",
    priority: "Routine",
    priorityClass: "routine",
    symptoms: ["Fever", "Fatigue"],
    painLevel: 3,
    condition: "Standard consultation",
    location: "OPD Block",
    floor: "1st Floor",
    room: "G-112",
    queuePosition: 3,
    wait: 25,
    status: "Waiting",
    time: "10:52 AM",
  },
];

function PatientStatus() {
  const navigate = useNavigate();

  const patient = getPatient();
  const triage = getTriage();

  const [queue, setQueue] = useState([]);
  const [tokenInput, setTokenInput] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  /* =========================================================
     LOAD QUEUE
     ========================================================= */

  const loadQueue = () => {
    const storedQueue = getQueue();

    setQueue(
      storedQueue.length > 0
        ? storedQueue
        : DEMO_QUEUE
    );

    setLastUpdated(new Date());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQueue();
  }, []);

  /* =========================================================
     AUTO REFRESH
     ========================================================= */

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const interval = setInterval(() => {
      loadQueue();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [autoRefresh]);

  /* =========================================================
     STORAGE EVENT
     ========================================================= */

  useEffect(() => {
    const handleStorage = () => {
      loadQueue();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =========================================================
     AUTOMATIC PATIENT ENTRY
     ========================================================= */

  useEffect(() => {
    if (!queue.length) {
      return;
    }

    let patientEntry = null;

    if (patient?.id) {
      patientEntry = queue.find(
        (item) =>
          item.patientId === patient.id ||
          item.name === patient.fullName
      );
    }

    if (!patientEntry && patient?.token) {
      patientEntry = queue.find(
        (item) =>
          item.token === patient.token
      );
    }

    if (!patientEntry && triage?.token) {
      patientEntry = queue.find(
        (item) =>
          item.token === triage.token
      );
    }

    if (!patientEntry) {
      const storedToken = localStorage.getItem(
        "smartcare_last_token"
      );

      if (storedToken) {
        patientEntry = queue.find(
          (item) =>
            item.token === storedToken
        );
      }
    }

    if (patientEntry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedEntry(patientEntry);
      setTokenInput(patientEntry.token);
    }
  }, [queue, patient, triage]);

  /* =========================================================
     CURRENT QUEUE ENTRY
     ========================================================= */

  const currentEntry = useMemo(() => {
    return selectedEntry;
  }, [selectedEntry]);

  /* =========================================================
     SEARCH TOKEN
     ========================================================= */

  const searchToken = () => {
    const normalizedToken =
      tokenInput.trim().toUpperCase();

    if (!normalizedToken) {
      setSelectedEntry(null);
      return;
    }

    const found = queue.find(
      (item) =>
        String(item.token).toUpperCase() ===
        normalizedToken
    );

    setSelectedEntry(found || null);
  };

  /* =========================================================
     REFRESH
     ========================================================= */

  const handleRefresh = () => {
    loadQueue();

    if (currentEntry?.token) {
      const refreshedEntry =
        getQueueEntry(currentEntry.id);

      if (refreshedEntry) {
        setSelectedEntry(refreshedEntry);
      }
    }
  };

  /* =========================================================
     NAVIGATION
     ========================================================= */

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  const goToRegistration = () => {
    navigate("/patient/register");
  };

  const goToLiveQueue = () => {
    navigate("/queue/display");
  };

  /* =========================================================
     QUEUE STATUS HELPERS
     ========================================================= */

  const statusClass =
    currentEntry?.status
      ?.toLowerCase()
      .replace(/\s+/g, "-") || "waiting";

  const priorityClass =
    currentEntry?.priorityClass ||
    currentEntry?.priority?.toLowerCase() ||
    "routine";

  const queuePosition =
    Number(currentEntry?.queuePosition) || 1;

  const estimatedWait =
    Number(currentEntry?.wait) || 0;

  const progress =
    currentEntry?.status === "Completed"
      ? 100
      : currentEntry?.status === "Called"
        ? 85
        : Math.max(
            10,
            Math.min(
              80,
              100 - queuePosition * 8
            )
          );

  return (
    <div className="patient-status-page">

      {/* =====================================================
          TOP BAR
         ===================================================== */}

      <header className="patient-status-header">
        <div className="patient-status-header-inner">

          <button
            type="button"
            className="patient-status-brand"
            onClick={goHome}
          >
            <div className="patient-status-brand-icon">
              <HeartPulse size={22} />
            </div>

            <div>
              <strong>
                Smart<span>Care</span>
              </strong>

              <small>
                Patient Queue
              </small>
            </div>
          </button>

          <div className="patient-status-header-actions">
            <button
              type="button"
              className="patient-status-live-btn"
              onClick={goToLiveQueue}
            >
              <Activity size={16} />
              Live Queue
            </button>

            <button
              type="button"
              className="patient-status-back-btn"
              onClick={goBack}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="patient-status-main">

        {/* HERO */}

        <section className="patient-status-hero">
          <div className="patient-status-hero-copy">

            <div className="patient-status-eyebrow">
              <span></span>
              SMART QUEUE TRACKING
            </div>

            <h1>
              Track your
              <strong> queue status.</strong>
            </h1>

            <p>
              Monitor your token, queue position,
              estimated waiting time, and consultation
              status in real time.
            </p>
          </div>

          <div className="patient-status-live-indicator">
            <span className="live-dot"></span>
            Live updates enabled
          </div>
        </section>

        {/* =================================================
            TOKEN SEARCH
           ================================================= */}

        <section className="token-search-card">

          <div className="token-search-copy">
            <div className="token-search-icon">
              <Search size={21} />
            </div>

            <div>
              <h2>
                Find your token
              </h2>

              <p>
                Enter the token number printed on
                your SmartCare token pass.
              </p>
            </div>
          </div>

          <div className="token-search-form">
            <input
              type="text"
              value={tokenInput}
              onChange={(event) =>
                setTokenInput(
                  event.target.value.toUpperCase()
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchToken();
                }
              }}
              placeholder="Example: U-085"
              aria-label="Token number"
            />

            <button
              type="button"
              onClick={searchToken}
            >
              Search
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* =================================================
            NO TOKEN SELECTED
           ================================================= */}

        {!currentEntry && (
          <section className="status-empty-card">

            <div className="status-empty-icon">
              <Users size={36} />
            </div>

            <h2>
              No queue entry selected
            </h2>

            <p>
              Enter your SmartCare token above
              to view your live queue status.
            </p>

            <button
              type="button"
              onClick={goToRegistration}
            >
              Start Patient Registration
              <ArrowRight size={17} />
            </button>
          </section>
        )}

        {/* =================================================
            CURRENT TOKEN STATUS
           ================================================= */}

        {currentEntry && (
          <>
            <section
              className={`status-overview-card priority-${priorityClass}`}
            >
              <div className="status-overview-top">

                <div>
                  <span className="status-label">
                    YOUR TOKEN
                  </span>

                  <div className="status-token">
                    {currentEntry.token}
                  </div>

                  <div className="status-department">
                    <Stethoscope size={15} />
                    {currentEntry.department ||
                      "General Medicine"}
                  </div>
                </div>

                <div className="status-state-box">
                  <span className="status-state-label">
                    CURRENT STATUS
                  </span>

                  <strong
                    className={`status-state ${statusClass}`}
                  >
                    {currentEntry.status ||
                      "Waiting"}
                  </strong>

                  <small>
                    Updated just now
                  </small>
                </div>
              </div>

              <div className="queue-progress-wrapper">

                <div className="queue-progress-header">
                  <span>
                    Queue progress
                  </span>

                  <strong>
                    {Math.round(progress)}%
                  </strong>
                </div>

                <div className="queue-progress-track">
                  <div
                    className="queue-progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* PRIORITY */}

              <div className="priority-strip">
                <ShieldCheck size={17} />

                <div>
                  <strong>
                    {currentEntry.priority ||
                      "Routine"}{" "}
                    Priority
                  </strong>

                  <span>
                    Queue order is managed using
                    triage priority and arrival time.
                  </span>
                </div>
              </div>
            </section>

            {/* =================================================
                KEY METRICS
               ================================================= */}

            <section className="status-metrics-grid">

              <div className="status-metric-card">
                <div className="metric-icon position">
                  <Users size={19} />
                </div>

                <div>
                  <span>
                    Queue Position
                  </span>

                  <strong>
                    #{queuePosition}
                  </strong>

                  <small>
                    Current place in queue
                  </small>
                </div>
              </div>

              <div className="status-metric-card">
                <div className="metric-icon wait">
                  <Clock3 size={19} />
                </div>

                <div>
                  <span>
                    Estimated Wait
                  </span>

                  <strong>
                    {estimatedWait === 0
                      ? "Now"
                      : `${estimatedWait} min`}
                  </strong>

                  <small>
                    Approximate waiting time
                  </small>
                </div>
              </div>

              <div className="status-metric-card">
                <div className="metric-icon patient">
                  <UserRound size={19} />
                </div>

                <div>
                  <span>
                    Patient
                  </span>

                  <strong>
                    {currentEntry.name ||
                      "Patient"}
                  </strong>

                  <small>
                    {currentEntry.age
                      ? `${currentEntry.age} years`
                      : "Registered patient"}
                  </small>
                </div>
              </div>

              <div className="status-metric-card">
                <div className="metric-icon location">
                  <MapPin size={19} />
                </div>

                <div>
                  <span>
                    Consultation
                  </span>

                  <strong>
                    {currentEntry.room ||
                      "Assigned"}
                  </strong>

                  <small>
                    {currentEntry.floor ||
                      "Hospital floor"}
                  </small>
                </div>
              </div>
            </section>

            {/* =================================================
                INFORMATION GRID
               ================================================= */}

            <section className="status-information-grid">

              {/* PATIENT */}

              <article className="status-info-card">

                <div className="status-info-heading">
                  <UserRound size={18} />

                  <div>
                    <span>
                      PATIENT PROFILE
                    </span>

                    <h3>
                      Patient Information
                    </h3>
                  </div>
                </div>

                <div className="status-info-list">

                  <div>
                    <span>
                      Name
                    </span>

                    <strong>
                      {currentEntry.name ||
                        "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Age
                    </span>

                    <strong>
                      {currentEntry.age
                        ? `${currentEntry.age} years`
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Gender
                    </span>

                    <strong>
                      {currentEntry.gender ||
                        "—"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Department
                    </span>

                    <strong>
                      {currentEntry.department ||
                        "—"}
                    </strong>
                  </div>
                </div>
              </article>

              {/* LOCATION */}

              <article className="status-info-card">

                <div className="status-info-heading">
                  <MapPin size={18} />

                  <div>
                    <span>
                      CONSULTATION LOCATION
                    </span>

                    <h3>
                      Where to go
                    </h3>
                  </div>
                </div>

                <div className="location-display">

                  <div className="location-main">
                    <strong>
                      {currentEntry.location ||
                        "Main Hospital"}
                    </strong>

                    <span>
                      {currentEntry.floor ||
                        "Main Floor"}
                    </span>
                  </div>

                  <div className="room-badge">
                    {currentEntry.room ||
                      "To be assigned"}
                  </div>
                </div>

                <div className="location-note">
                  <ShieldCheck size={15} />

                  Please remain available until
                  your token is called.
                </div>
              </article>
            </section>

            {/* =================================================
                SYMPTOMS
               ================================================= */}

            {currentEntry.symptoms?.length > 0 && (
              <section className="status-symptoms-card">

                <div className="status-info-heading">
                  <HeartPulse size={18} />

                  <div>
                    <span>
                      TRIAGE INFORMATION
                    </span>

                    <h3>
                      Registered Symptoms
                    </h3>
                  </div>
                </div>

                <div className="symptom-tags">
                  {currentEntry.symptoms.map(
                    (symptom, index) => (
                      <span key={`${symptom}-${index}`}>
                        {symptom}
                      </span>
                    )
                  )}
                </div>

                {currentEntry.painLevel !==
                  undefined && (
                  <div className="pain-summary">
                    <span>
                      Reported pain level
                    </span>

                    <strong>
                      {currentEntry.painLevel}
                      /10
                    </strong>
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                QUEUE TIMELINE
               ================================================= */}

            <section className="status-timeline-card">

              <div className="status-info-heading">
                <Activity size={18} />

                <div>
                  <span>
                    SMARTCARE JOURNEY
                  </span>

                  <h3>
                    Queue Timeline
                  </h3>
                </div>
              </div>

              <div className="status-timeline">

                <div className="timeline-step completed">
                  <div className="timeline-node">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Registration completed
                    </strong>

                    <span>
                      Patient registered with
                      SmartCare.
                    </span>
                  </div>
                </div>

                <div className="timeline-line"></div>

                <div className="timeline-step completed">
                  <div className="timeline-node">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Triage completed
                    </strong>

                    <span>
                      Priority assigned:
                      {currentEntry.priority ||
                        "Routine"}
                    </span>
                  </div>
                </div>

                <div className="timeline-line"></div>

                <div
                  className={`timeline-step ${
                    currentEntry.status ===
                      "Waiting"
                      ? "current"
                      : "completed"
                  }`}
                >
                  <div className="timeline-node">
                    {currentEntry.status ===
                    "Waiting"
                      ? "3"
                      : "✓"}
                  </div>

                  <div>
                    <strong>
                      Waiting in queue
                    </strong>

                    <span>
                      Position #
                      {queuePosition}
                    </span>
                  </div>
                </div>

                <div className="timeline-line"></div>

                <div
                  className={`timeline-step ${
                    currentEntry.status ===
                    "Called"
                      ? "current"
                      : ""
                  }`}
                >
                  <div className="timeline-node">
                    4
                  </div>

                  <div>
                    <strong>
                      Consultation called
                    </strong>

                    <span>
                      Proceed when your token
                      is displayed.
                    </span>
                  </div>
                </div>

                <div className="timeline-line"></div>

                <div className="timeline-step">
                  <div className="timeline-node">
                    5
                  </div>

                  <div>
                    <strong>
                      Consultation complete
                    </strong>

                    <span>
                      Queue journey completed.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* =====================================================
            FOOTER CONTROLS
           ===================================================== */}

        <section className="status-controls">

          <div className="status-refresh">

            <div className="refresh-status">
              <span className="refresh-dot"></span>

              Last updated{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} />
              Refresh Status
            </button>
          </div>

          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) =>
                setAutoRefresh(
                  event.target.checked
                )
              }
            />

            <span className="toggle-track"></span>

            Auto refresh
          </label>
        </section>

        {/* DISCLAIMER */}

        <div className="patient-status-disclaimer">
          <ShieldCheck size={15} />

          <p>
            SmartCare queue information is a frontend
            prototype and estimated timings may change
            based on patient priority, clinical needs,
            and hospital operations. Always follow
            instructions from qualified hospital staff.
          </p>
        </div>
      </main>
    </div>
  );
}

export default PatientStatus;