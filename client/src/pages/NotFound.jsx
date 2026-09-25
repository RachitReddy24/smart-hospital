import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-code">404</div>

        <div className="not-found-icon" aria-hidden="true">
          ⚕
        </div>

        <p className="not-found-kicker">SMARTCARE NAVIGATION</p>

        <h1>Page Not Found</h1>

        <p className="not-found-message">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            Return Home
          </Link>

          <button
            type="button"
            className="not-found-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotFound;