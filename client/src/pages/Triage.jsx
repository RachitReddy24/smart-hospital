import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Siren,
  Stethoscope,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Brain,
  Bone,
} from "lucide-react";

import "./Triage.css";

function Triage() {
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [painLevel, setPainLevel] = useState("");
  const [condition, setCondition] = useState("");

  /* =========================================================
     SYMPTOMS
     ========================================================= */

  const symptoms = [
    {
      id: "breathing",
      title: "Breathing difficulty",
      description:
        "Difficulty or unusual discomfort while breathing",
      icon: <Wind size={21} />,
    },
    {
      id: "chest",
      title: "Chest discomfort",
      description:
        "Chest pain, pressure, or unusual discomfort",
      icon: <HeartPulse size={21} />,
    },
    {
      id: "bleeding",
      title: "Heavy bleeding",
      description:
        "Bleeding that appears difficult to control",
      icon: <Droplets size={21} />,
    },
    {
      id: "unconscious",
      title: "Fainting or unconsciousness",
      description:
        "Loss of consciousness or inability to respond normally",
      icon: <Brain size={21} />,
    },
    {
      id: "stroke",
      title: "Sudden neurological symptoms",
      description:
        "Sudden weakness, speech difficulty, or similar symptoms",
      icon: <Activity size={21} />,
    },
    {
      id: "fever",
      title: "Fever or chills",
      description:
        "Fever, chills, or feeling unusually unwell",
      icon: <Thermometer size={21} />,
    },
    {
      id: "pain",
      title: "General pain",
      description:
        "Pain or discomfort affecting another area",
      icon: <Bone size={21} />,
    },
    {
      id: "other",
      title: "Other symptoms",
      description:
        "Another concern not listed above",
      icon: <Stethoscope size={21} />,
    },
  ];

  /* =========================================================
     TOGGLE SYMPTOM
     ========================================================= */

  const toggleSymptom = (id) => {
    setSelectedSymptoms((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  /* =========================================================
     PROTOTYPE PRIORITY RULES
     ========================================================= */

  const priority = useMemo(() => {
    const criticalSymptoms = [
      "breathing",
      "chest",
      "bleeding",
      "unconscious",
      "stroke",
    ];

    const hasCritical = selectedSymptoms.some((item) =>
      criticalSymptoms.includes(item)
    );

    /* Emergency */
    if (hasCritical) {
      return {
        level: "Emergency",
        className: "emergency",
        description:
          "This prototype has detected a high-priority response based on the selected demo rules.",
        icon: <Siren size={22} />,
        wait: "Immediate assessment",
      };
    }

    /* Urgent */
    if (
      condition === "rapid-worsening" ||
      painLevel === "severe" ||
      selectedSymptoms.length >= 3
    ) {
      return {
        level: "Urgent",
        className: "urgent",
        description:
          "This prototype has marked the case for faster assessment based on the selected demo inputs.",
        icon: <CircleAlert size={22} />,
        wait: "Priority assessment",
      };
    }

    /* Routine */
    if (
      condition === "stable" ||
      painLevel === "mild" ||
      painLevel === "moderate" ||
      selectedSymptoms.length > 0
    ) {
      return {
        level: "Routine",
        className: "routine",
        description:
          "This prototype has placed the case in the routine queue based on the selected demo inputs.",
        icon: <Clock3 size={22} />,
        wait: "Standard queue",
      };
    }

    return null;
  }, [selectedSymptoms, painLevel, condition]);

  /* =========================================================
     CONTINUE TO TOKEN
     ========================================================= */

  const handleContinue = (event) => {
    event.preventDefault();

    if (!priority) {
      return;
    }

    navigate("/patient/token", {
      state: {
        priority: priority.level,
        priorityClass: priority.className,
        symptoms: selectedSymptoms,
        painLevel,
        condition,
      },
    });
  };

  return (
    <div className="triage-page">
      {/* =====================================================
          BACKGROUND
         ===================================================== */}

      <div className="triage-grid"></div>

      <div className="triage-glow triage-glow-one"></div>

      <div className="triage-glow triage-glow-two"></div>

      {/* =====================================================
          TOP BAR
         ===================================================== */}

      <header className="triage-topbar">
        <button
          type="button"
          className="triage-back"
          onClick={() =>
            navigate("/patient/register")
          }
        >
          <ArrowLeft size={17} />
          Back to Registration
        </button>

        <div className="triage-brand">
          <div className="triage-brand-icon">
            <HeartPulse size={20} />
          </div>

          <div>
            <strong>SmartCare</strong>
            <small>Emergency Triage</small>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
         ===================================================== */}

      <main className="triage-main">
        {/* ===================================================
            PROGRESS
           =================================================== */}

        <div className="triage-progress">
          <TriageProgress
            number="01"
            title="Registration"
            complete
          />

          <div className="triage-progress-line"></div>

          <TriageProgress
            number="02"
            title="Triage"
            active
          />

          <div className="triage-progress-line"></div>

          <TriageProgress
            number="03"
            title="Token"
          />
        </div>

        {/* ===================================================
            HEADING
           =================================================== */}

        <section className="triage-heading">
          <div className="triage-eyebrow">
            <span></span>
            EMERGENCY TRIAGE
          </div>

          <h1>
            Tell us how
            <span>you're feeling.</span>
          </h1>

          <p>
            Select the symptoms that best describe your
            current situation. SmartCare will use
            predefined prototype rules to demonstrate
            queue prioritisation.
          </p>
        </section>

        {/* ===================================================
            TRIAGE FORM
           =================================================== */}

        <form
          className="triage-layout"
          onSubmit={handleContinue}
        >
          {/* =================================================
              CURRENT SYMPTOMS
             ================================================= */}

          <section className="triage-card symptoms-card">
            <div className="triage-card-header">
              <div>
                <small>STEP 02A</small>
                <h2>Current Symptoms</h2>
              </div>

              <div className="triage-count">
                {selectedSymptoms.length} selected
              </div>
            </div>

            <div className="triage-divider"></div>

            <div className="symptom-grid">
              {symptoms.map((symptom) => {
                const selected =
                  selectedSymptoms.includes(
                    symptom.id
                  );

                return (
                  <button
                    key={symptom.id}
                    type="button"
                    className={
                      selected
                        ? "symptom-card selected"
                        : "symptom-card"
                    }
                    onClick={() =>
                      toggleSymptom(symptom.id)
                    }
                  >
                    <div
                      className={
                        selected
                          ? "symptom-icon selected-icon"
                          : "symptom-icon"
                      }
                    >
                      {symptom.icon}
                    </div>

                    <div className="symptom-content">
                      <strong>
                        {symptom.title}
                      </strong>

                      <span>
                        {symptom.description}
                      </span>
                    </div>

                    <div
                      className={
                        selected
                          ? "symptom-check checked"
                          : "symptom-check"
                      }
                    >
                      {selected && (
                        <Check size={13} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* =================================================
              RIGHT SIDE
             ================================================= */}

          <aside className="triage-side">
            {/* ===============================================
                ADDITIONAL DETAILS
               =============================================== */}

            <section className="triage-card question-card">
              <div className="triage-card-header">
                <div>
                  <small>STEP 02B</small>
                  <h2>Additional Details</h2>
                </div>
              </div>

              <div className="triage-divider"></div>

              {/* Pain */}
              <div className="triage-question">
                <label>
                  How would you describe the pain or
                  discomfort?
                </label>

                <div className="choice-list">
                  <ChoiceButton
                    label="Mild"
                    value="mild"
                    current={painLevel}
                    onClick={setPainLevel}
                  />

                  <ChoiceButton
                    label="Moderate"
                    value="moderate"
                    current={painLevel}
                    onClick={setPainLevel}
                  />

                  <ChoiceButton
                    label="Severe"
                    value="severe"
                    current={painLevel}
                    onClick={setPainLevel}
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="triage-question">
                <label>
                  How is your condition changing?
                </label>

                <div className="choice-list">
                  <ChoiceButton
                    label="Stable"
                    value="stable"
                    current={condition}
                    onClick={setCondition}
                  />

                  <ChoiceButton
                    label="Getting worse"
                    value="rapid-worsening"
                    current={condition}
                    onClick={setCondition}
                  />
                </div>
              </div>
            </section>

            {/* ===============================================
                PRIORITY STATUS
               =============================================== */}

            <section
              className={
                priority
                  ? `priority-card ${priority.className}`
                  : "priority-card"
              }
            >
              <div className="priority-top">
                <div className="priority-icon">
                  {priority ? (
                    priority.icon
                  ) : (
                    <ShieldCheck size={22} />
                  )}
                </div>

                <div>
                  <small>
                    PROTOTYPE QUEUE STATUS
                  </small>

                  <h3>
                    {priority
                      ? priority.level
                      : "Awaiting Input"}
                  </h3>
                </div>
              </div>

              <p>
                {priority
                  ? priority.description
                  : "Complete the questions above to see the demo queue priority."}
              </p>

              <div className="priority-meta">
                <span>
                  <Clock3 size={14} />

                  {priority
                    ? priority.wait
                    : "Not calculated"}
                </span>

                <span>
                  <Check size={14} />

                  Rule-based demo
                </span>
              </div>
            </section>
          </aside>
        </form>

        {/* ===================================================
            ACTION AREA
           =================================================== */}

        <div className="triage-bottom">
          <div className="triage-disclaimer">
            <ShieldCheck size={17} />

            <span>
              <strong>
                Prototype notice:
              </strong>{" "}
              This interface demonstrates predefined
              queue rules for the PBL project. It does
              not diagnose conditions or replace
              assessment by qualified medical staff.
            </span>
          </div>

          <button
            type="button"
            className={
              priority
                ? "triage-submit ready"
                : "triage-submit"
            }
            onClick={handleContinue}
            disabled={!priority}
          >
            Review Priority
            <ArrowRight size={18} />
          </button>
        </div>

        {/* ===================================================
            FOOTER
           =================================================== */}

        <div className="triage-footer-note">
          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Intelligent patient flow • Faster
            hospital coordination
          </span>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   PROGRESS COMPONENT
   ========================================================= */

function TriageProgress({
  number,
  title,
  active = false,
  complete = false,
}) {
  return (
    <div
      className={
        active
          ? "triage-progress-step active"
          : complete
          ? "triage-progress-step complete"
          : "triage-progress-step"
      }
    >
      <div className="triage-progress-circle">
        {complete ? (
          <Check size={14} />
        ) : (
          number
        )}
      </div>

      <span>{title}</span>
    </div>
  );
}

/* =========================================================
   CHOICE BUTTON
   ========================================================= */

function ChoiceButton({
  label,
  value,
  current,
  onClick,
}) {
  const selected = current === value;

  return (
    <button
      type="button"
      className={
        selected
          ? "choice-button selected"
          : "choice-button"
      }
      onClick={() => onClick(value)}
    >
      <span>{label}</span>

      {selected && <Check size={14} />}
    </button>
  );
}

export default Triage;