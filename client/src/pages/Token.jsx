/* eslint-disable no-useless-assignment */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  Bell,
  CalendarClock,
  Check,
  CircleAlert,
  Clock3,
  HeartPulse,
  MapPin,
  MonitorPlay,
  RefreshCw,
  ShieldCheck,
  Siren,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  addQueueEntry,
  generateToken,
  getPatient,
  getQueue,
  getQueueEntry,
  getTriage,
  updatePatient,
  updateQueueEntry,
} from "../utils/smartCareStorage";

import "./Token.css";

/* =========================================================
   DEPARTMENT LABELS
   ========================================================= */

const departmentLabels = {
  emergency: "Emergency Department",
  general: "General Medicine",
  cardiology: "Cardiology",
  orthopedics: "Orthopedics",
  pediatrics: "Pediatrics",
  dermatology: "Dermatology",
  ent: "ENT",
};

/* =========================================================
   LOCATION LABELS
   ========================================================= */

const locationLabels = {
  main: "SmartCare Main Hospital",
  city: "SmartCare City Center",
  north: "SmartCare North Wing",
};

/* =========================================================
   PRIORITY WEIGHT
   ========================================================= */

const priorityWeight = {
  Emergency: 0,
  Urgent: 1,
  Routine: 2,
};

/* =========================================================
   TOKEN PAGE
   ========================================================= */

function Token() {
  const navigate = useNavigate();
  const location = useLocation();

  const patient = getPatient();

  const storedTriage = getTriage();

  const triageData =
    location.state || storedTriage;

  /* =======================================================
     CREATE / LOAD QUEUE ENTRY
     ======================================================= */

  const createQueueEntry = () => {
    if (!patient) {
      return null;
    }

    if (!triageData) {
      return null;
    }

    /* -----------------------------------------------
       Check whether this patient already has a token
       ----------------------------------------------- */

    const existingEntry =
      getQueueEntry(patient.id);

    if (existingEntry) {
      return existingEntry;
    }

    const priority =
      triageData.priority || "Routine";

    const queue = getQueue();

    const activeQueue = queue.filter(
      (item) => item.status !== "Completed"
    );

    /* -----------------------------------------------
       Calculate people ahead
       ----------------------------------------------- */

    const peopleAhead =
      activeQueue.filter((item) => {
        const itemWeight =
          priorityWeight[item.priority] ?? 2;

        const currentWeight =
          priorityWeight[priority] ?? 2;

        return itemWeight <= currentWeight;
      }).length;

    const queuePosition =
      peopleAhead + 1;

    /* -----------------------------------------------
       Wait time
       ----------------------------------------------- */

    let wait = "Standard queue";

    if (priority === "Emergency") {
      wait = "Immediate assessment";
    } else if (priority === "Urgent") {
      wait =
        queuePosition <= 1
          ? "Priority assessment"
          : `~${queuePosition * 3} min`;
    } else {
      wait =
        queuePosition <= 1
          ? "Standard queue"
          : `~${queuePosition * 3} min`;
    }

    /* -----------------------------------------------
       Generate token
       ----------------------------------------------- */

    const token =
      generateToken(priority);

    /* -----------------------------------------------
       Human-readable data
       ----------------------------------------------- */

    const department =
      departmentLabels[patient.department] ||
      patient.department ||
      "General Medicine";

    const hospital =
      locationLabels[patient.location] ||
      patient.location ||
      "SmartCare Main Hospital";

    const symptomLabels = {
      breathing: "Breathing difficulty",
      chest: "Chest discomfort",
      bleeding: "Heavy bleeding",
      unconscious:
        "Fainting or unconsciousness",
      stroke:
        "Sudden neurological symptoms",
      fever: "Fever or chills",
      pain: "General pain",
      other: "Other symptoms",
    };

    const symptoms =
      Array.isArray(triageData.symptoms) &&
      triageData.symptoms.length > 0
        ? triageData.symptoms
            .map(
              (item) =>
                symptomLabels[item] || item
            )
            .join(", ")
        : "No symptoms selected";

    /* -----------------------------------------------
       Queue record
       ----------------------------------------------- */

    const entry = {
      id: patient.id,

      token,

      name:
        patient.fullName ||
        "SmartCare Patient",

      age:
        patient.age || "",

      gender:
        patient.gender || "",

      phone:
        patient.phone || "",

      department,

      departmentCode:
        patient.department || "",

      priority,

      priorityClass:
        triageData.priorityClass ||
        priority.toLowerCase(),

      symptoms,

      symptomIds:
        triageData.symptoms || [],

      painLevel:
        triageData.painLevel || "",

      condition:
        triageData.condition || "",

      location: hospital,

      floor:
        priority === "Emergency"
          ? "Emergency Floor"
          : "Ground Floor",

      room:
        priority === "Emergency"
          ? "ER — 01"
          : priority === "Urgent"
          ? "OPD — 02"
          : "OPD — 04",

      queuePosition,

      wait,

      status: "Waiting",

      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),

      createdAt:
        new Date().toISOString(),
    };

    addQueueEntry(entry);

    updatePatient({
      status: "Queued",
      token,
      priority,
    });

    return entry;
  };

  /* =======================================================
     PERSISTENT QUEUE STATE
     ======================================================= */

  const [queueEntry, setQueueEntry] =
    useState(createQueueEntry);

  const [lastUpdated, setLastUpdated] =
    useState("Just now");

  /* =======================================================
     NO DATA STATE
     ======================================================= */

  if (!patient || !triageData) {
    return (
      <div className="token-page">
        <div className="token-grid"></div>

        <div className="token-glow token-glow-one"></div>

        <div className="token-glow token-glow-two"></div>

        <main
          className="token-main"
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            className="token-number-card"
            style={{
              width: "min(500px, 100%)",
              minHeight: "auto",
            }}
          >
            <div className="token-status-pill">
              <span></span>
              SESSION NOT FOUND
            </div>

            <div
              className="token-number-label"
              style={{
                marginTop: "30px",
              }}
            >
              SMARTCARE
            </div>

            <h1
              style={{
                margin: "10px 0 12px",
                color: "#f5fbff",
              }}
            >
              Let's restart your
              <br />
              care journey.
            </h1>

            <p
              style={{
                color: "#7892af",
                fontSize: "12px",
                lineHeight: 1.6,
              }}
            >
              The patient registration or triage
              information could not be found.
              Start again to create a new queue token.
            </p>

            <button
              type="button"
              className="token-dashboard-button"
              style={{
                marginTop: "20px",
                width: "100%",
                justifyContent: "center",
              }}
              onClick={() =>
                navigate("/patient/register")
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

  /* =======================================================
     QUEUE DATA
     ======================================================= */

  const activePosition =
    queueEntry?.queuePosition || 1;

  const activePriority =
    queueEntry?.priority || "Routine";

  const estimatedWait = useMemo(() => {
    if (
      activePriority ===
      "Emergency"
    ) {
      return "Now";
    }

    if (activePosition <= 1) {
      return "Now";
    }

    return `~${activePosition * 3} min`;
  }, [
    activePosition,
    activePriority,
  ]);

  const queueProgress = Math.min(
    94,
    Math.max(
      28,
      100 - activePosition * 7
    )
  );

  /* =======================================================
     REFRESH QUEUE
     ======================================================= */

  const refreshQueue = () => {
    if (!queueEntry) {
      return;
    }

    if (
      queueEntry.status ===
      "Completed"
    ) {
      return;
    }

    const queue = getQueue();

    const activeOthers =
      queue.filter(
        (item) =>
          item.id !== queueEntry.id &&
          item.status !== "Completed"
      );

    let newPosition =
      queueEntry.queuePosition || 1;

    if (
      activePriority ===
      "Emergency"
    ) {
      newPosition = Math.max(
        1,
        newPosition - 1
      );
    } else {
      const peopleBefore =
        activeOthers.filter(
          (item) => {
            const itemWeight =
              priorityWeight[
                item.priority
              ] ?? 2;

            const currentWeight =
              priorityWeight[
                activePriority
              ] ?? 2;

            return (
              itemWeight <
                currentWeight ||
              (
                itemWeight ===
                  currentWeight &&
                item.queuePosition <
                  newPosition
              )
            );
          }
        ).length;

      newPosition = Math.max(
        1,
        peopleBefore + 1
      );
    }

    const updatedEntry = {
      ...queueEntry,

      queuePosition:
        newPosition,

      wait:
        activePriority ===
        "Emergency"
          ? "Immediate assessment"
          : newPosition <= 1
          ? "Now"
          : `~${newPosition * 3} min`,
    };

    updateQueueEntry(
      queueEntry.id,
      updatedEntry
    );

    setQueueEntry(
      updatedEntry
    );

    setLastUpdated(
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      )
    );
  };

  /* =======================================================
     OPEN LIVE QUEUE DISPLAY
     ======================================================= */

  const openLiveQueue = () => {
    navigate("/queue/display");
  };

  /* =======================================================
     OPEN PATIENT STATUS
     ======================================================= */

  const openPatientStatus = () => {
    navigate("/patient/status");
  };

  /* =======================================================
     BACK TO TRIAGE
     ======================================================= */

  const backToTriage = () => {
    navigate(
      "/patient/triage",
      {
        state: triageData,
      }
    );
  };

  /* =======================================================
     RETURN HOME
     ======================================================= */

  const returnHome = () => {
    navigate("/");
  };

  /* =======================================================
     PRIORITY TITLE
     ======================================================= */

  const priorityTitle =
    activePriority ===
    "Emergency"
      ? "Emergency"
      : activePriority ===
        "Urgent"
      ? "Urgent"
      : "Routine";

  /* =======================================================
     PRIORITY ICON
     ======================================================= */

  const priorityIcon =
    activePriority ===
    "Emergency" ? (
      <Siren size={22} />
    ) : activePriority ===
      "Urgent" ? (
      <CircleAlert size={22} />
    ) : (
      <Clock3 size={22} />
    );

  return (
    <div className="token-page">

      {/* =====================================================
          BACKGROUND
         ===================================================== */}

      <div className="token-grid"></div>

      <div className="token-glow token-glow-one"></div>

      <div className="token-glow token-glow-two"></div>

      <div className="token-orbit token-orbit-one"></div>

      <div className="token-orbit token-orbit-two"></div>

      {/* =====================================================
          TOP BAR
         ===================================================== */}

      <header className="token-topbar">
        <button
          type="button"
          className="token-back"
          onClick={backToTriage}
        >
          <ArrowLeft size={17} />
          Back to Triage
        </button>

        <div className="token-brand">
          <div className="token-brand-icon">
            <HeartPulse size={20} />
          </div>

          <div>
            <strong>
              SmartCare
            </strong>

            <small>
              Smart Queue System
            </small>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="token-main">

        {/* ===================================================
            PROGRESS
           =================================================== */}

        <div className="token-progress">
          <TokenProgress
            number="01"
            title="Registration"
            complete
          />

          <div className="token-progress-line"></div>

          <TokenProgress
            number="02"
            title="Triage"
            complete
          />

          <div className="token-progress-line"></div>

          <TokenProgress
            number="03"
            title="Token"
            active
          />
        </div>

        {/* ===================================================
            HEADING
           =================================================== */}

        <section className="token-heading">
          <div className="token-eyebrow">
            <span></span>
            QUEUE CONFIRMED
          </div>

          <h1>
            Your care journey
            <span>
              starts here.
            </span>
          </h1>

          <p>
            Your SmartCare queue token has been
            generated from your registration and
            prototype triage flow.
          </p>
        </section>

        {/* ===================================================
            PRIORITY BANNER
           =================================================== */}

        <div
          className={`token-priority-banner ${queueEntry.priorityClass}`}
        >
          <div className="token-priority-left">
            <div className="token-priority-icon">
              {priorityIcon}
            </div>

            <div>
              <small>
                TRIAGE RESULT
              </small>

              <strong>
                {priorityTitle} Priority
              </strong>
            </div>
          </div>

          <div className="token-priority-text">
            This queue priority comes from the
            predefined SmartCare prototype rules.
          </div>
        </div>

        {/* ===================================================
            DASHBOARD
           =================================================== */}

        <section className="token-dashboard">

          {/* =================================================
              TOKEN CARD
             ================================================= */}

          <div
            className={`token-number-card ${queueEntry.priorityClass}`}
          >
            <div className="token-card-glow"></div>

            <div className="token-status-pill">
              <span></span>

              {queueEntry.status ===
              "Completed"
                ? "COMPLETED"
                : "QUEUE ACTIVE"}
            </div>

            <div className="token-number-label">
              YOUR TOKEN
            </div>

            <div className="token-number">
              {queueEntry.token}
            </div>

            <div className="token-department">
              <Stethoscope size={16} />

              {queueEntry.department}
            </div>

            <div className="token-token-divider"></div>

            <div className="token-basic-info">
              <div>
                <small>
                  PATIENT
                </small>

                <strong>
                  {queueEntry.name}
                </strong>
              </div>

              <div>
                <small>
                  ROOM
                </small>

                <strong>
                  {queueEntry.room}
                </strong>
              </div>
            </div>

            <div className="token-location">
              <MapPin size={14} />

              {queueEntry.location}
              {" • "}
              {queueEntry.floor}
            </div>
          </div>

          {/* =================================================
              QUEUE CARD
             ================================================= */}

          <div className="queue-status-card">

            <div className="queue-card-header">
              <div>
                <small>
                  LIVE QUEUE
                </small>

                <h2>
                  Your position
                </h2>
              </div>

              <button
                type="button"
                className="queue-refresh"
                onClick={refreshQueue}
                title="Refresh queue"
              >
                <RefreshCw size={17} />
              </button>
            </div>

            <div className="queue-position-area">

              <div className="queue-position">
                <strong>
                  {activePosition}
                </strong>

                <span>
                  people ahead
                </span>
              </div>

              <div className="queue-live-indicator">
                <Activity size={15} />
                Live
              </div>
            </div>

            <div className="queue-progress">

              <div className="queue-progress-track">
                <div
                  className="queue-progress-fill"
                  style={{
                    width: `${queueProgress}%`,
                  }}
                ></div>
              </div>

              <div className="queue-progress-labels">
                <span>
                  Now
                </span>

                <span>
                  Being processed
                </span>

                <span>
                  Your turn
                </span>
              </div>
            </div>

            <div className="queue-metrics">

              <div className="queue-metric">
                <Clock3 size={17} />

                <div>
                  <small>
                    Estimated Wait
                  </small>

                  <strong>
                    {estimatedWait}
                  </strong>
                </div>
              </div>

              <div className="queue-metric">
                <Users size={17} />

                <div>
                  <small>
                    Queue Position
                  </small>

                  <strong>
                    #{activePosition}
                  </strong>
                </div>
              </div>

              <div className="queue-metric">
                <CalendarClock size={17} />

                <div>
                  <small>
                    Status
                  </small>

                  <strong>
                    {queueEntry.status}
                  </strong>
                </div>
              </div>
            </div>

            <div className="queue-updated">
              <span>
                <span className="updated-dot"></span>

                Queue updated
              </span>

              <span>
                {lastUpdated}
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            PATIENT INFORMATION
           =================================================== */}

        <section className="token-lower-grid">

          <div className="next-step-card">

            <div className="next-step-icon">
              <Bell size={21} />
            </div>

            <div className="next-step-content">
              <small>
                NEXT STEP
              </small>

              <h3>
                Stay nearby for your call
              </h3>

              <p>
                Keep your token available and follow
                the latest queue status. Hospital staff
                instructions should take precedence over
                this prototype interface.
              </p>
            </div>
          </div>

          <div className="token-support-card">

            <div className="support-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <small>
                PATIENT RECORD
              </small>

              <strong>
                Queue record successfully assigned
              </strong>

              <span>
                Token {queueEntry.token}
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            ACTIONS
           =================================================== */}

        <div className="token-actions">

          {/* RETURN HOME */}

          <button
            type="button"
            className="token-home-button"
            onClick={returnHome}
          >
            Return Home
          </button>

          {/* LIVE QUEUE */}

          <button
            type="button"
            className="token-live-queue-button"
            onClick={openLiveQueue}
          >
            <MonitorPlay size={16} />
            View Live Queue
          </button>

          {/* PATIENT QUEUE STATUS */}

          <button
            type="button"
            className="token-status-button"
            onClick={openPatientStatus}
          >
            <Activity size={16} />
            Track My Queue
          </button>

          {/* REFRESH */}

          <button
            type="button"
            className="token-dashboard-button"
            onClick={refreshQueue}
          >
            Refresh Queue
            <RefreshCw size={16} />
          </button>
        </div>

        {/* ===================================================
            DISCLAIMER
           =================================================== */}

        <div className="token-disclaimer">
          <ShieldCheck size={16} />

          <span>
            This token, queue position and estimated
            wait time are generated for the SmartCare
            PBL prototype. Actual hospital workflows
            may differ and should be confirmed with
            qualified hospital staff.
          </span>
        </div>

        {/* ===================================================
            FOOTER
           =================================================== */}

        <div className="token-footer">

          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Smarter queues • Faster care • Better
            coordination
          </span>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PROGRESS COMPONENT
   ========================================================= */

function TokenProgress({
  number,
  title,
  active = false,
  complete = false,
}) {
  return (
    <div
      className={
        active
          ? "token-progress-step active"
          : complete
          ? "token-progress-step complete"
          : "token-progress-step"
      }
    >
      <div className="token-progress-circle">
        {complete ? (
          <Check size={14} />
        ) : (
          number
        )}
      </div>

      <span>
        {title}
      </span>
    </div>
  );
}

export default Token;