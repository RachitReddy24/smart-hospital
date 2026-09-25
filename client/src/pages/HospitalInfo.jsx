import {
  Activity,
  ArrowLeft,
  Bell,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  MapPin,
  Phone,
  ShieldCheck,
  Siren,
  Stethoscope,
  Users,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "./HospitalInfo.css";

const departments = [
  {
    id: "emergency",
    name: "Emergency Department",
    description:
      "Priority care and emergency assessment services.",
    floor: "Emergency Floor",
    room: "ER — 01",
    availability: "24 / 7",
    icon: <Siren size={19} />,
    className: "emergency",
  },
  {
    id: "general",
    name: "General Medicine",
    description:
      "Routine consultations and general medical services.",
    floor: "Ground Floor",
    room: "OPD — 04",
    availability: "08:00 AM – 08:00 PM",
    icon: <Stethoscope size={19} />,
    className: "cyan",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    description:
      "Cardiac consultations and diagnostic services.",
    floor: "First Floor",
    room: "OPD — 05",
    availability: "09:00 AM – 06:00 PM",
    icon: <HeartPulse size={19} />,
    className: "blue",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    description:
      "Musculoskeletal consultations and support.",
    floor: "First Floor",
    room: "OPD — 03",
    availability: "09:00 AM – 06:00 PM",
    icon: <Activity size={19} />,
    className: "violet",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    description:
      "Healthcare services for children and adolescents.",
    floor: "Second Floor",
    room: "OPD — 06",
    availability: "09:00 AM – 07:00 PM",
    icon: <Users size={19} />,
    className: "green",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    description:
      "Skin, hair and nail consultation services.",
    floor: "Second Floor",
    room: "OPD — 07",
    availability: "10:00 AM – 05:00 PM",
    icon: <HeartPulse size={19} />,
    className: "amber",
  },
  {
    id: "ent",
    name: "ENT",
    description:
      "Ear, nose and throat consultation services.",
    floor: "Second Floor",
    room: "OPD — 08",
    availability: "10:00 AM – 05:00 PM",
    icon: <Activity size={19} />,
    className: "teal",
  },
];

const facilities = [
  "Emergency response area",
  "Patient registration desk",
  "Smart queue management",
  "Diagnostic services",
  "Pharmacy support",
  "Waiting areas",
];

const locations = [
  {
    name: "SmartCare Main Hospital",
    address:
      "Central Hospital Campus",
    floor:
      "Multiple departments",
    status: "Main facility",
  },
  {
    name: "SmartCare City Center",
    address:
      "City Center Medical Wing",
    floor:
      "Outpatient services",
    status: "City facility",
  },
  {
    name: "SmartCare North Wing",
    address:
      "North Hospital Wing",
    floor:
      "Specialty services",
    status: "North facility",
  },
];

function HospitalInfo() {
  const navigate = useNavigate();

  return (
    <div className="hospital-info-page">
      <div className="hospital-info-grid"></div>

      <div className="hospital-info-glow hospital-glow-one"></div>
      <div className="hospital-info-glow hospital-glow-two"></div>

      {/* HEADER */}

      <header className="hospital-info-header">
        <button
          type="button"
          className="hospital-info-back"
          onClick={() =>
            navigate("/")
          }
        >
          <ArrowLeft size={17} />
          Back to Home
        </button>

        <div className="hospital-info-brand">
          <div className="hospital-info-brand-icon">
            <HeartPulse size={20} />
          </div>

          <div>
            <strong>
              SmartCare
            </strong>

            <small>
              HOSPITAL INFORMATION
            </small>
          </div>
        </div>

        <button
          type="button"
          className="hospital-register-button"
          onClick={() =>
            navigate(
              "/patient/register"
            )
          }
        >
          Start Registration
          <ChevronRight size={15} />
        </button>
      </header>

      <main className="hospital-info-main">
        {/* HERO */}

        <section className="hospital-info-hero">
          <div className="hospital-hero-copy">
            <div className="hospital-eyebrow">
              <span></span>
              PATIENT INFORMATION CENTER
            </div>

            <h1>
              Know your
              <span>SmartCare hospital.</span>
            </h1>

            <p>
              Find departments, hospital facilities,
              care locations and operating information
              before starting your queue journey.
            </p>
          </div>

          <div className="hospital-hero-status">
            <div className="hospital-status-icon">
              <Building2 size={22} />
            </div>

            <div>
              <small>
                HOSPITAL STATUS
              </small>

              <strong>
                SmartCare Main Hospital
              </strong>

              <span>
                <span className="status-live-dot"></span>
                Operations available
              </span>
            </div>
          </div>
        </section>

        {/* QUICK ACCESS */}

        <section className="hospital-quick-grid">
          <QuickCard
            icon={
              <Siren size={19} />
            }
            title="Emergency"
            text="Priority emergency pathway"
            value="24 / 7"
            className="emergency"
          />

          <QuickCard
            icon={
              <Clock3 size={19} />
            }
            title="Outpatient Hours"
            text="General OPD services"
            value="08:00 AM – 08:00 PM"
            className="cyan"
          />

          <QuickCard
            icon={
              <Phone size={19} />
            }
            title="Patient Support"
            text="Hospital information desk"
            value="Available"
            className="blue"
          />

          <QuickCard
            icon={
              <Bell size={19} />
            }
            title="Smart Queue"
            text="Live patient queue system"
            value="Active"
            className="green"
          />
        </section>

        {/* DEPARTMENTS */}

        <section className="hospital-section">
          <div className="hospital-section-heading">
            <div>
              <span>
                CLINICAL SERVICES
              </span>

              <h2>
                Departments
              </h2>

              <p>
                Browse the main departments available
                in the SmartCare prototype hospital.
              </p>
            </div>

            <div className="hospital-section-count">
              {departments.length}
              <small>
                departments
              </small>
            </div>
          </div>

          <div className="hospital-department-grid">
            {departments.map(
              (department) => (
                <DepartmentCard
                  key={
                    department.id
                  }
                  department={
                    department
                  }
                  onRegister={() =>
                    navigate(
                      "/patient/register"
                    )
                  }
                />
              )
            )}
          </div>
        </section>

        {/* PATIENT JOURNEY */}

        <section className="hospital-journey-card">
          <div className="journey-left">
            <div className="hospital-section-label">
              PATIENT JOURNEY
            </div>

            <h2>
              Start care without
              <span>the queue confusion.</span>
            </h2>

            <p>
              SmartCare combines registration,
              prototype triage and queue management
              into one guided patient flow.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/patient/register"
                )
              }
            >
              Begin Patient Journey
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="journey-steps">
            <JourneyStep
              number="01"
              title="Register"
              text="Enter patient information."
              active
            />

            <div className="journey-connector"></div>

            <JourneyStep
              number="02"
              title="Triage"
              text="Complete the prototype assessment."
            />

            <div className="journey-connector"></div>

            <JourneyStep
              number="03"
              title="Token"
              text="Receive your queue token."
            />

            <div className="journey-connector"></div>

            <JourneyStep
              number="04"
              title="Queue"
              text="Track your live position."
            />
          </div>
        </section>

        {/* FACILITIES + HOURS */}

        <section className="hospital-two-column">
          <div className="hospital-facilities-card">
            <div className="hospital-card-heading">
              <div>
                <span>
                  FACILITIES
                </span>

                <h2>
                  Available Services
                </h2>
              </div>

              <Building2 size={18} />
            </div>

            <div className="hospital-facility-list">
              {facilities.map(
                (facility) => (
                  <div
                    key={
                      facility
                    }
                    className="facility-item"
                  >
                    <CheckCircle2
                      size={15}
                    />

                    <span>
                      {facility}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="hospital-hours-card">
            <div className="hospital-card-heading">
              <div>
                <span>
                  SERVICE HOURS
                </span>

                <h2>
                  Operating Information
                </h2>
              </div>

              <CalendarClock
                size={18}
              />
            </div>

            <div className="hours-list">
              <HoursRow
                label="Emergency"
                value="24 / 7"
                emergency
              />

              <HoursRow
                label="General Medicine"
                value="08:00 AM – 08:00 PM"
              />

              <HoursRow
                label="Specialty OPD"
                value="09:00 AM – 06:00 PM"
              />

              <HoursRow
                label="Information Desk"
                value="08:00 AM – 08:00 PM"
              />
            </div>
          </div>
        </section>

        {/* LOCATIONS */}

        <section className="hospital-section">
          <div className="hospital-section-heading">
            <div>
              <span>
                CARE LOCATIONS
              </span>

              <h2>
                SmartCare Locations
              </h2>

              <p>
                Prototype locations available for
                patient selection during registration.
              </p>
            </div>
          </div>

          <div className="hospital-location-grid">
            {locations.map(
              (location) => (
                <LocationCard
                  key={
                    location.name
                  }
                  location={
                    location
                  }
                />
              )
            )}
          </div>
        </section>

        {/* EMERGENCY NOTICE */}

        <section className="hospital-emergency-notice">
          <div className="hospital-emergency-icon">
            <Siren size={21} />
          </div>

          <div>
            <small>
              EMERGENCY INFORMATION
            </small>

            <h2>
              Emergency situations require
              qualified medical attention.
            </h2>

            <p>
              SmartCare is a frontend prototype.
              Queue priorities and estimated wait
              times shown by the interface do not
              replace clinical assessment or hospital
              instructions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/patient/triage"
              )
            }
          >
            Emergency Triage
            <ChevronRight size={15} />
          </button>
        </section>

        {/* FOOTER */}

        <footer className="hospital-info-footer">
          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Hospital information • Patient services •
            Smart queue
          </span>

          <div>
            <ShieldCheck size={14} />
            Frontend Prototype
          </div>
        </footer>
      </main>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  text,
  value,
  className,
}) {
  return (
    <div
      className={`hospital-quick-card ${className}`}
    >
      <div className="quick-icon">
        {icon}
      </div>

      <div className="quick-content">
        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {text}
        </small>
      </div>
    </div>
  );
}

function DepartmentCard({
  department,
  onRegister,
}) {
  return (
    <article
      className={`hospital-department-card ${department.className}`}
    >
      <div className="department-card-icon">
        {department.icon}
      </div>

      <div className="department-card-title">
        <h3>
          {department.name}
        </h3>

        <span>
          {department.availability}
        </span>
      </div>

      <p>
        {department.description}
      </p>

      <div className="department-card-meta">
        <span>
          <MapPin size={12} />
          {department.floor}
        </span>

        <span>
          <Stethoscope
            size={12}
          />
          {department.room}
        </span>
      </div>

      <button
        type="button"
        onClick={onRegister}
      >
        Select Department
        <ChevronRight size={14} />
      </button>
    </article>
  );
}

function JourneyStep({
  number,
  title,
  text,
  active = false,
}) {
  return (
    <div
      className={`journey-step ${
        active ? "active" : ""
      }`}
    >
      <div className="journey-number">
        {number}
      </div>

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>
      </div>
    </div>
  );
}

function HoursRow({
  label,
  value,
  emergency = false,
}) {
  return (
    <div className="hours-row">
      <div>
        <span
          className={
            emergency
              ? "hours-dot emergency"
              : "hours-dot"
          }
        ></span>

        <strong>
          {label}
        </strong>
      </div>

      <span>
        {value}
      </span>
    </div>
  );
}

function LocationCard({
  location,
}) {
  return (
    <div className="hospital-location-card">
      <div className="location-card-top">
        <div className="location-icon">
          <MapPin size={17} />
        </div>

        <span>
          {location.status}
        </span>
      </div>

      <h3>
        {location.name}
      </h3>

      <p>
        {location.address}
      </p>

      <div className="location-meta">
        <Building2 size={12} />
        {location.floor}
      </div>
    </div>
  );
}

export default HospitalInfo;