import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Clock3,
  HeartPulse,
  LogOut,
  PieChart,
  RefreshCw,
  ShieldCheck,
  Siren,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

import "./Analytics.css";

function Analytics() {
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState("7");
  const [department, setDepartment] = useState("All Departments");

  const weeklyData = [
    {
      day: "Mon",
      patients: 54,
      emergency: 6,
      urgent: 14,
      routine: 34,
    },
    {
      day: "Tue",
      patients: 67,
      emergency: 7,
      urgent: 18,
      routine: 42,
    },
    {
      day: "Wed",
      patients: 72,
      emergency: 9,
      urgent: 17,
      routine: 46,
    },
    {
      day: "Thu",
      patients: 64,
      emergency: 5,
      urgent: 16,
      routine: 43,
    },
    {
      day: "Fri",
      patients: 81,
      emergency: 10,
      urgent: 21,
      routine: 50,
    },
    {
      day: "Sat",
      patients: 76,
      emergency: 8,
      urgent: 19,
      routine: 49,
    },
    {
      day: "Sun",
      patients: 59,
      emergency: 5,
      urgent: 13,
      routine: 41,
    },
  ];

  const departmentData = [
    {
      name: "General Medicine",
      patients: 182,
      load: 82,
      wait: "18 min",
    },
    {
      name: "Emergency",
      patients: 74,
      load: 76,
      wait: "7 min",
    },
    {
      name: "Cardiology",
      patients: 61,
      load: 58,
      wait: "22 min",
    },
    {
      name: "Orthopedics",
      patients: 54,
      load: 51,
      wait: "24 min",
    },
    {
      name: "Pediatrics",
      patients: 48,
      load: 46,
      wait: "20 min",
    },
  ];

  const selectedRangeLabel =
    timeRange === "7"
      ? "Last 7 days"
      : timeRange === "30"
      ? "Last 30 days"
      : "Today";

  const stats = useMemo(() => {
    const total = weeklyData.reduce(
      (sum, item) => sum + item.patients,
      0
    );

    const emergency = weeklyData.reduce(
      (sum, item) => sum + item.emergency,
      0
    );

    const urgent = weeklyData.reduce(
      (sum, item) => sum + item.urgent,
      0
    );

    const routine = weeklyData.reduce(
      (sum, item) => sum + item.routine,
      0
    );

    const averageDaily = Math.round(
      total / weeklyData.length
    );

    return {
      total,
      emergency,
      urgent,
      routine,
      averageDaily,
    };
  }, []);

  const maxPatients = Math.max(
    ...weeklyData.map((item) => item.patients)
  );

  const filteredDepartments =
    department === "All Departments"
      ? departmentData
      : departmentData.filter(
          (item) => item.name === department
        );

  return (
    <div className="analytics-page">
      <div className="analytics-grid"></div>

      <div className="analytics-glow analytics-glow-one"></div>
      <div className="analytics-glow analytics-glow-two"></div>

      {/* =====================================================
          SIDEBAR
         ===================================================== */}

      <aside className="analytics-sidebar">
        <div className="analytics-brand">
          <div className="analytics-brand-icon">
            <HeartPulse size={22} />
          </div>

          <div>
            <strong>SmartCare</strong>
            <small>Hospital System</small>
          </div>
        </div>

        <nav className="analytics-nav">
          <button
            type="button"
            onClick={() =>
              navigate("/staff/dashboard")
            }
          >
            <Activity size={18} />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/staff/dashboard")
            }
          >
            <Users size={18} />
            Patient Queue
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/staff/dashboard")
            }
          >
            <Siren size={18} />
            Emergency
          </button>

          <button
            type="button"
            className="active"
          >
            <BarChart3 size={18} />
            Analytics
          </button>

          <button type="button">
            <Stethoscope size={18} />
            Departments
          </button>
        </nav>

        <div className="analytics-sidebar-bottom">
          <div className="analytics-account">
            <div className="analytics-account-icon">
              <ShieldCheck size={17} />
            </div>

            <div>
              <strong>Admin Portal</strong>
              <small>Hospital Management</small>
            </div>
          </div>

          <button
            type="button"
            className="analytics-return"
            onClick={() => navigate("/")}
          >
            <LogOut size={16} />
            Return Home
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
         ===================================================== */}

      <main className="analytics-content">
        {/* HEADER */}

        <header className="analytics-header">
          <div className="analytics-title">
            <button
              type="button"
              className="analytics-mobile-back"
              onClick={() =>
                navigate("/staff/dashboard")
              }
            >
              <ArrowLeft size={17} />
            </button>

            <div>
              <div className="analytics-eyebrow">
                <span></span>
                HOSPITAL INTELLIGENCE
              </div>

              <h1>Analytics Overview</h1>

              <p>
                Understand patient flow, queue demand and
                department activity.
              </p>
            </div>
          </div>

          <div className="analytics-header-actions">
            <div className="analytics-live">
              <span></span>
              Data Updated
            </div>

            <button
              type="button"
              className="analytics-refresh"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </header>

        {/* ===================================================
            FILTER BAR
           =================================================== */}

        <section className="analytics-filter-bar">
          <div className="analytics-date-filter">
            <CalendarDays size={16} />

            <select
              value={timeRange}
              onChange={(event) =>
                setTimeRange(event.target.value)
              }
            >
              <option value="1">
                Today
              </option>

              <option value="7">
                Last 7 Days
              </option>

              <option value="30">
                Last 30 Days
              </option>
            </select>

            <ChevronDown size={14} />
          </div>

          <div className="analytics-department-filter">
            <Stethoscope size={16} />

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
            >
              <option>
                All Departments
              </option>

              {departmentData.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <ChevronDown size={14} />
          </div>

          <div className="analytics-range-label">
            {selectedRangeLabel}
          </div>
        </section>

        {/* ===================================================
            KPI CARDS
           =================================================== */}

        <section className="analytics-kpi-grid">
          <AnalyticsStat
            label="Total Patients"
            value={stats.total}
            icon={<Users size={20} />}
            detail="+12.6% vs previous period"
            className="blue"
          />

          <AnalyticsStat
            label="Emergency Cases"
            value={stats.emergency}
            icon={<Siren size={20} />}
            detail="Priority queue activity"
            className="red"
          />

          <AnalyticsStat
            label="Urgent Cases"
            value={stats.urgent}
            icon={<TrendingUp size={20} />}
            detail="Priority assessment"
            className="amber"
          />

          <AnalyticsStat
            label="Average Daily"
            value={stats.averageDaily}
            icon={<Activity size={20} />}
            detail="Patients per day"
            className="cyan"
          />
        </section>

        {/* ===================================================
            CHART ROW
           =================================================== */}

        <section className="analytics-chart-grid">
          {/* PATIENT VOLUME */}

          <div className="analytics-card volume-card">
            <div className="analytics-card-header">
              <div>
                <small>PATIENT VOLUME</small>

                <h2>
                  Daily patient activity
                </h2>
              </div>

              <div className="analytics-card-icon">
                <BarChart3 size={17} />
              </div>
            </div>

            <div className="volume-chart">
              <div className="volume-axis">
                <span>
                  {maxPatients}
                </span>

                <span>
                  {Math.round(
                    maxPatients * 0.75
                  )}
                </span>

                <span>
                  {Math.round(
                    maxPatients * 0.5
                  )}
                </span>

                <span>
                  {Math.round(
                    maxPatients * 0.25
                  )}
                </span>

                <span>0</span>
              </div>

              <div className="volume-bars">
                {weeklyData.map((item) => (
                  <div
                    className="volume-day"
                    key={item.day}
                  >
                    <div className="volume-bar-area">
                      <div
                        className="volume-bar"
                        style={{
                          height: `${
                            (item.patients /
                              maxPatients) *
                            100
                          }%`,
                        }}
                        title={`${item.patients} patients`}
                      >
                        <span></span>
                      </div>
                    </div>

                    <small>{item.day}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="volume-summary">
              <div>
                <span></span>
                Patient registrations
              </div>

              <strong>
                {stats.total} total
              </strong>
            </div>
          </div>

          {/* PRIORITY BREAKDOWN */}

          <div className="analytics-card priority-breakdown">
            <div className="analytics-card-header">
              <div>
                <small>QUEUE COMPOSITION</small>

                <h2>
                  Priority breakdown
                </h2>
              </div>

              <div className="analytics-card-icon">
                <PieChart size={17} />
              </div>
            </div>

            <div className="priority-visual">
              <div className="priority-ring">
                <div className="priority-ring-inner">
                  <strong>
                    {stats.total}
                  </strong>

                  <span>
                    patients
                  </span>
                </div>
              </div>

              <div className="priority-legend">
                <PriorityLegend
                  label="Emergency"
                  value={stats.emergency}
                  total={stats.total}
                  className="emergency"
                />

                <PriorityLegend
                  label="Urgent"
                  value={stats.urgent}
                  total={stats.total}
                  className="urgent"
                />

                <PriorityLegend
                  label="Routine"
                  value={stats.routine}
                  total={stats.total}
                  className="routine"
                />
              </div>
            </div>

            <div className="priority-note">
              <Activity size={14} />

              <span>
                Queue composition is based on the
                current prototype dataset.
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            DEPARTMENT TABLE
           =================================================== */}

        <section className="analytics-card department-card">
          <div className="analytics-card-header">
            <div>
              <small>DEPARTMENT LOAD</small>

              <h2>
                Department performance
              </h2>
            </div>

            <div className="department-total">
              <Users size={15} />
              {departmentData.length} departments
            </div>
          </div>

          <div className="department-table-wrap">
            <table className="department-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Patients</th>
                  <th>Load</th>
                  <th>Avg. Wait</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.map(
                  (item) => (
                    <tr key={item.name}>
                      <td>
                        <div className="department-name">
                          <div className="department-icon">
                            <Stethoscope size={15} />
                          </div>

                          <strong>
                            {item.name}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="department-patients">
                          {item.patients}
                        </span>
                      </td>

                      <td>
                        <div className="department-load">
                          <div className="department-load-bar">
                            <span
                              style={{
                                width: `${item.load}%`,
                              }}
                            ></span>
                          </div>

                          <small>
                            {item.load}%
                          </small>
                        </div>
                      </td>

                      <td>
                        <span className="department-wait">
                          <Clock3 size={13} />
                          {item.wait}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.load >= 75
                              ? "department-status high"
                              : item.load >= 55
                              ? "department-status moderate"
                              : "department-status normal"
                          }
                        >
                          <span></span>

                          {item.load >= 75
                            ? "High Load"
                            : item.load >= 55
                            ? "Moderate"
                            : "Normal"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===================================================
            INSIGHT CARDS
           =================================================== */}

        <section className="analytics-insight-grid">
          <div className="analytics-insight emergency-insight">
            <div className="insight-icon">
              <Siren size={19} />
            </div>

            <div>
              <small>
                EMERGENCY ACTIVITY
              </small>

              <h3>
                {stats.emergency} emergency cases
                recorded
              </h3>

              <p>
                Emergency cases are represented separately
                in the prototype queue for faster staff review.
              </p>
            </div>
          </div>

          <div className="analytics-insight wait-insight">
            <div className="insight-icon">
              <Clock3 size={19} />
            </div>

            <div>
              <small>
                QUEUE OBSERVATION
              </small>

              <h3>
                Monitor waiting-time trends
              </h3>

              <p>
                Use queue activity and department load
                to identify periods of higher operational demand.
              </p>
            </div>
          </div>

          <div className="analytics-insight secure-insight">
            <div className="insight-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <small>
                SYSTEM MODE
              </small>

              <h3>
                Prototype analytics environment
              </h3>

              <p>
                This dashboard displays demonstration
                data and is not connected to live hospital records.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            FOOTER
           =================================================== */}

        <footer className="analytics-footer">
          <div>
            <HeartPulse size={15} />
            SmartCare
          </div>

          <span>
            Hospital intelligence • Queue analytics •
            Patient flow
          </span>
        </footer>
      </main>
    </div>
  );
}

/* =========================================================
   STAT COMPONENT
   ========================================================= */

function AnalyticsStat({
  label,
  value,
  icon,
  detail,
  className,
}) {
  return (
    <div
      className={`analytics-kpi ${className}`}
    >
      <div className="analytics-kpi-top">
        <div className="analytics-kpi-icon">
          {icon}
        </div>

        <span>Overview</span>
      </div>

      <strong className="analytics-kpi-value">
        {value}
      </strong>

      <div className="analytics-kpi-label">
        {label}
      </div>

      <small>{detail}</small>
    </div>
  );
}

/* =========================================================
   PRIORITY LEGEND
   ========================================================= */

function PriorityLegend({
  label,
  value,
  total,
  className,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div className="priority-legend-item">
      <div className="priority-legend-name">
        <span className={className}></span>
        {label}
      </div>

      <div className="priority-legend-value">
        <strong>{value}</strong>
        <small>{percentage}%</small>
      </div>
    </div>
  );
}

export default Analytics;