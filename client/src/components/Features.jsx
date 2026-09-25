import {
  Ticket,
  Siren,
  Clock3,
  LayoutDashboard,
  BellRing,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Ticket,
    number: "01",
    tag: "QUEUE",
    title: "Digital Tokens",
    text: "Generate a digital queue token without standing in a physical line.",
  },
  {
    icon: Siren,
    number: "02",
    tag: "TRIAGE",
    title: "Emergency Triage",
    text: "Organize cases using predefined urgency levels.",
  },
  {
    icon: Clock3,
    number: "03",
    tag: "REAL-TIME",
    title: "Smart Wait Time",
    text: "Show patients their estimated waiting time.",
  },
  {
    icon: LayoutDashboard,
    number: "04",
    tag: "CONTROL",
    title: "Staff Command",
    text: "Manage patient queues from one centralized dashboard.",
  },
  {
    icon: BellRing,
    number: "05",
    tag: "ALERTS",
    title: "Queue Alerts",
    text: "Keep patients informed when their turn approaches.",
  },
  {
    icon: RefreshCw,
    number: "06",
    tag: "SMART",
    title: "Dynamic Priority",
    text: "Update patient priority when their condition changes.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="features-section"
    >

      <div className="section-container">

        <div className="section-heading">

          <div className="section-eyebrow">
            <span></span>
            SMARTCARE PLATFORM
          </div>

          <h2>
            Healthcare,
            <span> redesigned.</span>
          </h2>

          <p>
            A modern patient-flow system designed around
            speed, visibility and better hospital experiences.
          </p>

        </div>


        <div className="features-grid">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <article
                className="feature-card-3d"
                key={feature.number}
              >

                <span className="feature-number">
                  {feature.number}
                </span>


                <div className="feature-icon-box">
                  <Icon size={24} />
                </div>


                <span className="feature-tag">
                  {feature.tag}
                </span>


                <h3>
                  {feature.title}
                </h3>


                <p>
                  {feature.text}
                </p>


                <div className="feature-line"></div>

              </article>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Features;