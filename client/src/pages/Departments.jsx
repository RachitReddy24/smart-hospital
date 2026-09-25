/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  HeartPulse,
  RefreshCw,
  Users,
} from "lucide-react";

import { getQueue } from "../utils/smartCareStorage";

import "./Departments.css";

const departmentConfig = [
  {
    id: "emergency",
    name: "Emergency Department",
    short: "Emergency",
    rooms: 6,
    staff: 18,
    accent: "emergency",
  },
  {
    id: "general",
    name: "General Medicine",
    short: "General",
    rooms: 8,
    staff: 14,
    accent: "cyan",
  },
  {
    id: "cardiology",
    name: "Cardiology",
    short: "Cardiology",
    rooms: 5,
    staff: 10,
    accent: "blue",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    short: "Orthopedics",
    rooms: 4,
    staff: 8,
    accent: "violet",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    short: "Pediatrics",
    rooms: 5,
    staff: 9,
    accent: "green",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    short: "Dermatology",
    rooms: 3,
    staff: 6,
    accent: "amber",
  },
  {
    id: "ent",
    name: "ENT",
    short: "ENT",
    rooms: 3,
    staff: 6,
    accent: "teal",
  },
];

const demoDepartmentLoad = {
  emergency: {
    waiting: 2,
    called: 1,
    wait: 4,
  },
  general: {
    waiting: 5,
    called: 1,
    wait: 18,
  },
  cardiology: {
    waiting: 3,
    called: 1,
    wait: 22,
  },
  orthopedics: {
    waiting: 2,
    called: 0,
    wait: 16,
  },
  pediatrics: {
    waiting: 4,
    called: 1,
    wait: 14,
  },
  dermatology: {
    waiting: 1,
    called: 0,
    wait: 10,
  },
  ent: {
    waiting: 2,
    called: 0,
    wait: 12,
  },
};

function Departments() {
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  const loadDepartments = () => {
    setQueue(getQueue());
    setLastUpdated(new Date());
  };

  useEffect(() => {
    loadDepartments();

    const interval = setInterval(
      loadDepartments,
      3000
    );

    const handleStorage = () => {
      loadDepartments();
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

  const departmentData = useMemo(() => {
    return departmentConfig.map((department) => {
      const storedPatients = queue.filter(
        (patient) =>
          patient.departmentCode === department.id ||
          patient.department === department.name
      );

      const activePatients =
        storedPatients.filter(
          (patient) =>
            patient.status !== "Completed"
        );

      const waiting = activePatients.filter(
        (patient) =>
          patient.status === "Waiting"
      ).length;

      const called = activePatients.filter(
        (patient) =>
          patient.status === "Called"
      ).length;

      const waitValues = activePatients
        .map((patient) => {
          const value = String(
            patient.wait || ""
          ).match(/\d+/);

          return value
            ? Number(value[0])
            : null;
        })
        .filter(
          (value) => value !== null
        );

      const calculatedWait =
        waitValues.length > 0
          ? Math.round(
              waitValues.reduce(
                (sum, value) =>
                  sum + value,
                0
              ) / waitValues.length
            )
          : null;

      const demo =
        demoDepartmentLoad[
          department.id
        ] || {
          waiting: 0,
          called: 0,
          wait: 0,
        };

      const useDemo =
        storedPatients.length === 0;

      return {
        ...department,
        waiting: useDemo
          ? demo.waiting
          : waiting,
        called: useDemo
          ? demo.called
          : called,
        wait: useDemo
          ? demo.wait
          : calculatedWait || 0,
        active:
          useDemo
            ? demo.waiting + demo.called
            : activePatients.length,
      };
    });
  }, [queue]);

  const totalWaiting = departmentData.reduce(
    (sum, department) =>
      sum + department.waiting,
    0
  );

  const totalCalled = departmentData.reduce(
    (sum, department) =>
      sum + department.called,
    0
  );

  const totalRooms = departmentConfig.reduce(
    (sum, department) =>
      sum + department.rooms,
    0
  );

  const totalStaff = departmentConfig.reduce(
    (sum, department) =>
      sum + department.staff,
    0
  );

  const busiestDepartment =
    [...departmentData].sort(
      (a, b) =>
        b.waiting - a.waiting
    )[0];

  return (
    <div className="departments-page">
      <div className="departments-grid"></div>

      <div className="departments-glow glow-left"></div>
      <div className="departments-glow glow-right"></div>

      <header className="departments-header">
        <div className="departments-brand">
          <div className="departments-brand-icon">
            <HeartPulse size={21} />
          </div>

          <div>
            <strong>SmartCare</strong>
            <small>
              DEPARTMENT MANAGEMENT
            </small>
          </div>
        </div>

        <div className="departments-header-actions">
          <div className="department-live-status">
            <span></span>
            System Live
          </div>

          <button
            type="button"
            className="department-refresh"
            onClick={loadDepartments}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="department-back"
            onClick={() =>
              navigate("/staff/dashboard")
            }
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>
      </header>

      <main className="departments-main">
        <section className="departments-heading">
          <div>
            <div className="departments-eyebrow">
              <span></span>
              HOSPITAL OPERATIONS
            </div>

            <h1>
              Department
              <span>Overview</span>
            </h1>

            <p>
              Monitor patient load and queue activity
              across every SmartCare department from
              a single operations view.
            </p>
          </div>

          <div className="department-time">
            <Clock3 size={14} />
            Updated{" "}
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </section>

        <section className="department-summary-grid">
          <SummaryCard
            icon={<Users size={19} />}
            label="Patients Waiting"
            value={totalWaiting}
          />

          <SummaryCard
            icon={<Activity size={19} />}
            label="Currently Called"
            value={totalCalled}
          />

          <SummaryCard
            icon={<Building2 size={19} />}
            label="Available Rooms"
            value={totalRooms}
          />

          <SummaryCard
            icon={<HeartPulse size={19} />}
            label="Clinical Staff"
            value={totalStaff}
          />
        </section>

        <section className="department-alert">
          <div className="department-alert-icon">
            <Activity size={19} />
          </div>

          <div>
            <small>
              CURRENT LOAD
            </small>

            <strong>
              {busiestDepartment
                ? `${busiestDepartment.name} currently has the highest waiting load.`
                : "Department load is currently stable."}
            </strong>

            <span>
              Queue values are synchronized with the
              SmartCare frontend prototype.
            </span>
          </div>
        </section>

        <section className="department-grid-cards">
          {departmentData.map(
            (department) => (
              <DepartmentCard
                key={department.id}
                department={department}
              />
            )
          )}
        </section>

        <section className="department-bottom">
          <div className="department-capacity-card">
            <div className="department-bottom-heading">
              <div>
                <span>CAPACITY</span>
                <h2>Hospital Snapshot</h2>
              </div>

              <Building2 size={19} />
            </div>

            <div className="capacity-row">
              <div>
                <span>Active departments</span>
                <strong>
                  {departmentConfig.length}
                </strong>
              </div>

              <div>
                <span>Total rooms</span>
                <strong>
                  {totalRooms}
                </strong>
              </div>

              <div>
                <span>Clinical staff</span>
                <strong>
                  {totalStaff}
                </strong>
              </div>
            </div>
          </div>

          <div className="department-prototype-card">
            <CheckCircle2 size={20} />

            <div>
              <small>
                PROTOTYPE STATUS
              </small>

              <strong>
                Department monitoring is active
              </strong>

              <span>
                Backend-connected live room and staff
                availability will replace demo values
                during integration.
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="department-summary-card">
      <div className="summary-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function DepartmentCard({
  department,
}) {
  const capacity =
    department.rooms * 2;

  const loadPercent =
    Math.min(
      100,
      Math.round(
        (department.active /
          capacity) *
          100
      )
    );

  const status =
    loadPercent >= 80
      ? "High Load"
      : loadPercent >= 50
      ? "Moderate"
      : "Available";

  return (
    <article
      className={`department-card ${department.accent}`}
    >
      <div className="department-card-top">
        <div className="department-symbol">
          <HeartPulse size={18} />
        </div>

        <span
          className={`department-status ${
            loadPercent >= 80
              ? "high"
              : loadPercent >= 50
              ? "moderate"
              : "available"
          }`}
        >
          {status}
        </span>
      </div>

      <h2>
        {department.name}
      </h2>

      <div className="department-stat-line">
        <div>
          <small>WAITING</small>
          <strong>
            {department.waiting}
          </strong>
        </div>

        <div>
          <small>CALLED</small>
          <strong>
            {department.called}
          </strong>
        </div>

        <div>
          <small>AVG WAIT</small>
          <strong>
            {department.wait > 0
              ? `${department.wait}m`
              : "—"}
          </strong>
        </div>
      </div>

      <div className="department-load">
        <div className="department-load-header">
          <span>Queue Load</span>
          <strong>
            {loadPercent}%
          </strong>
        </div>

        <div className="department-load-track">
          <div
            className="department-load-fill"
            style={{
              width: `${loadPercent}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="department-card-footer">
        <span>
          <Building2 size={12} />
          {department.rooms} Rooms
        </span>

        <span>
          <Users size={12} />
          {department.staff} Staff
        </span>
      </div>
    </article>
  );
}

export default Departments;