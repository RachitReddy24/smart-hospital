import {
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
} from "lucide-react";

function TriageSection() {
  return (
    <section
      id="triage"
      className="triage-section"
    >

      <div className="triage-container">


        {/* Left */}

        <div className="triage-content">

          <div className="triage-eyebrow">

            <AlertTriangle size={17} />

            EMERGENCY TRIAGE

          </div>


          <h2>
            Prioritize patients
            <span> by urgency.</span>
          </h2>


          <p>
            SmartCare organizes the prototype queue
            around predefined urgency levels so staff can
            quickly identify cases that require greater priority.
          </p>


          <div className="priority-list">

            <Priority
              color="red"
              title="Emergency"
              text="Immediate attention required"
            />

            <Priority
              color="yellow"
              title="Urgent"
              text="Needs timely medical attention"
            />

            <Priority
              color="green"
              title="Normal"
              text="Routine consultation"
            />

          </div>


          <button className="hero-primary">

            Start Assessment

            <ArrowRight size={18} />

          </button>

        </div>


        {/* Right */}

        <div className="triage-visual">

          <div className="triage-card">

            <div className="triage-card-top">

              <span>
                TRIAGE STATUS
              </span>

              <span className="triage-live">
                ● LIVE
              </span>

            </div>


            <div className="triage-main">

              <div className="triage-circle">

                <strong>
                  03
                </strong>

                <span>
                  Cases
                </span>

              </div>


              <div>

                <small>
                  PRIORITY QUEUE
                </small>

                <h3>
                  Emergency
                </h3>

                <p>
                  Patients requiring
                  immediate attention
                </p>

              </div>

            </div>


            <div className="triage-stats">

              <div>
                <strong>
                  02
                </strong>

                <span>
                  Emergency
                </span>
              </div>

              <div>
                <strong>
                  04
                </strong>

                <span>
                  Urgent
                </span>
              </div>

              <div>
                <strong>
                  18
                </strong>

                <span>
                  Normal
                </span>
              </div>

            </div>


            <div className="triage-live-bar">

              <Activity size={15} />

              Live queue monitoring

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


function Priority({
  color,
  title,
  text,
}) {
  return (
    <div className="priority-row">

      <span
        className={`priority-dot ${color}`}
      ></span>

      <CheckCircle2 size={17} />

      <div>

        <strong>
          {title}
        </strong>

        <small>
          {text}
        </small>

      </div>

    </div>
  );
}

export default TriageSection;