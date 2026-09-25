import {
  UserPlus,
  ClipboardCheck,
  Ticket,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register",
    text: "Enter your basic information and select a department.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Triage",
    text: "Complete the emergency assessment.",
  },
  {
    number: "03",
    icon: Ticket,
    title: "Get Token",
    text: "Receive your digital token and estimated wait.",
  },
  {
    number: "04",
    icon: Stethoscope,
    title: "Get Care",
    text: "Track your queue and proceed when called.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="how-section"
    >

      <div className="section-container">

        <div className="section-heading">

          <div className="section-eyebrow">
            <span></span>
            HOW IT WORKS
          </div>

          <h2>
            From registration
            <br />
            to <span>consultation.</span>
          </h2>

          <p>
            Four simple steps connect the patient to
            the right hospital service.
          </p>

        </div>


        <div className="steps-grid">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (
              <div
                className="step-card"
                key={step.number}
              >

                <span className="step-number">
                  {step.number}
                </span>

                <div className="step-icon-box">
                  <Icon size={27} />
                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.text}
                </p>


                {index < steps.length - 1 && (
                  <div className="step-connector">
                    <ArrowRight size={15} />
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;