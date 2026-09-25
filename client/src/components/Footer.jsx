import {
  HeartPulse,
  Mail,
  ArrowUp,
} from "lucide-react";

function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="footer-container">


        {/* Brand */}

        <div className="footer-brand">

          <div className="footer-logo">
            <HeartPulse size={22} />
          </div>

          <div>

            <h3>
              Smart<span>Care</span>
            </h3>

            <p>
              Smart Hospital Queue & Triage
            </p>

          </div>

        </div>


        {/* Navigation */}

        <div className="footer-column">

          <h4>
            Navigation
          </h4>

          <button onClick={scrollTop}>
            Home
          </button>

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#triage">
            Emergency
          </a>

        </div>


        {/* Project */}

        <div className="footer-column">

          <h4>
            Project
          </h4>

          <span>
            Tech Core
          </span>

          <span>
            Smart Healthcare
          </span>

          <span>
            PBL Project
          </span>

          <span>
            SmartCare
          </span>

        </div>


        {/* Contact */}

        <div className="footer-column">

          <h4>
            Contact
          </h4>

          <a href="mailto:team@techcore.com">

            <Mail size={14} />

            Team Tech Core

          </a>

          <span>
            Healthcare Innovation
          </span>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 Tech Core. All rights reserved.
        </span>

        <span>
          SmartCare — Smart Hospital Queue & Triage
        </span>

        <button
          onClick={scrollTop}
          className="back-top"
          aria-label="Back to top"
        >
          <ArrowUp size={16} />
        </button>

      </div>

    </footer>
  );
}

export default Footer;