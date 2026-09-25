import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  HeartPulse,
  LogOut,
  MapPin,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  getQueue,
  updateQueueEntry,
} from "../utils/smartCareStorage";

import {
  getStaffSession,
  logoutStaff,
} from "../utils/smartCareAuth";

import "./StaffDashboard.css";

/* =========================================================
   DEMO PATIENTS
   ========================================================= */

const demoPatients = [
  {
    id: "demo-1",
    token: "ER-042",
    name: "Emergency Patient",
    department: "Emergency",
    priority: "Emergency",
    priorityClass: "emergency",
    wait: "Now",
    status: "Waiting",
    symptoms: "Breathing difficulty",
    time: "10:42 AM",
    phone: "+91 XXXXX XXXXX",
    location: "SmartCare Main Hospital",
    floor: "Ground Floor",
    room: "ER — 01",
    queuePosition: 1,
    createdAt: "2026-09-17T10:42:00",
  },

  {
    id: "demo-2",
    token: "U-084",
    name: "Patient U-084",
    department: "General Medicine",
    priority: "Urgent",
    priorityClass: "urgent",
    wait: "12 min",
    status: "Waiting",
    symptoms: "Severe pain",
    time: "10:47 AM",
    phone: "+91 XXXXX XXXXX",
    location: "SmartCare Main Hospital",
    floor: "Ground Floor",
    room: "OPD — 02",
    queuePosition: 1,
    createdAt: "2026-09-17T10:47:00",
  },

  {
    id: "demo-3",
    token: "A-127",
    name: "Patient A-127",
    department: "General Medicine",
    priority: "Routine",
    priorityClass: "routine",
    wait: "21 min",
    status: "Waiting",
    symptoms: "General pain",
    time: "10:53 AM",
    phone: "+91 XXXXX XXXXX",
    location: "SmartCare Main Hospital",
    floor: "Ground Floor",
    room: "OPD — 04",
    queuePosition: 1,
    createdAt: "2026-09-17T10:53:00",
  },

  {
    id: "demo-4",
    token: "A-128",
    name: "Patient A-128",
    department: "Cardiology",
    priority: "Routine",
    priorityClass: "routine",
    wait: "24 min",
    status: "Waiting",
    symptoms: "Chest discomfort",
    time: "10:56 AM",
    phone: "+91 XXXXX XXXXX",
    location: "SmartCare Main Hospital",
    floor: "First Floor",
    room: "OPD — 05",
    queuePosition: 2,
    createdAt: "2026-09-17T10:56:00",
  },

  {
    id: "demo-5",
    token: "U-085",
    name: "Patient U-085",
    department: "Orthopedics",
    priority: "Urgent",
    priorityClass: "urgent",
    wait: "15 min",
    status: "Waiting",
    symptoms: "Severe pain",
    time: "11:01 AM",
    phone: "+91 XXXXX XXXXX",
    location: "SmartCare Main Hospital",
    floor: "First Floor",
    room: "OPD — 03",
    queuePosition: 2,
    createdAt: "2026-09-17T11:01:00",
  },

  {
    id: "demo-6",
    token: "A-129",
    name: "Patient A-129",
    department: "Pediatrics",
    priority: "Routine",
    priorityClass: "routine",
    wait: "31 min",
    status: "Waiting",
    symptoms: "Fever",
    time: "11:05 AM",
    phone: "+91 XXXXX XXXXX",
    location: "SmartCare Main Hospital",
    floor: "Second Floor",
    room: "OPD — 06",
    queuePosition: 3,
    createdAt: "2026-09-17T11:05:00",
  },
];

/* =========================================================
   PRIORITY ORDER
   ========================================================= */

const priorityWeight = {
  Emergency: 1,
  Urgent: 2,
  Routine: 3,
};

/* =========================================================
   LOAD STORED PATIENTS
   ========================================================= */

function getStoredPatients() {
  const queue = getQueue();

  return queue.map((patient) => ({
    ...patient,

    name:
      patient.name ||
      "SmartCare Patient",

    department:
      patient.department ||
      "General Medicine",

    priority:
      patient.priority ||
      "Routine",

    priorityClass:
      patient.priorityClass ||
      patient.priority?.toLowerCase() ||
      "routine",

    wait:
      patient.wait ||
      "Waiting",

    status:
      patient.status ||
      "Waiting",

    symptoms:
      patient.symptoms ||
      "No symptoms selected",

    time:
      patient.time ||
      "Just now",

    phone:
      patient.phone ||
      "+91 XXXXX XXXXX",

    location:
      patient.location ||
      "SmartCare Main Hospital",

    floor:
      patient.floor ||
      "Ground Floor",

    room:
      patient.room ||
      "OPD — 04",

    queuePosition:
      Number(patient.queuePosition) ||
      1,

    createdAt:
      patient.createdAt ||
      new Date().toISOString(),
  }));
}

/* =========================================================
   MERGE DEMO + STORED PATIENTS
   ========================================================= */

function loadPatients() {
  const storedPatients =
    getStoredPatients();

  const merged = [
    ...demoPatients,
    ...storedPatients,
  ];

  const uniquePatients = [];

  merged.forEach((patient) => {
    const exists =
      uniquePatients.some(
        (item) =>
          item.id === patient.id
      );

    if (!exists) {
      uniquePatients.push(
        patient
      );
    }
  });

  return uniquePatients;
}

/* =========================================================
   SORT QUEUE
   ========================================================= */

function sortQueue(patients) {
  return [...patients].sort(
    (a, b) => {
      if (
        a.status === "Completed" &&
        b.status !== "Completed"
      ) {
        return 1;
      }

      if (
        a.status !== "Completed" &&
        b.status === "Completed"
      ) {
        return -1;
      }

      const priorityA =
        priorityWeight[
          a.priority
        ] || 3;

      const priorityB =
        priorityWeight[
          b.priority
        ] || 3;

      if (
        priorityA !== priorityB
      ) {
        return priorityA - priorityB;
      }

      const positionA =
        Number(a.queuePosition) ||
        9999;

      const positionB =
        Number(b.queuePosition) ||
        9999;

      if (
        positionA !== positionB
      ) {
        return positionA - positionB;
      }

      return (
        new Date(
          a.createdAt
        ).getTime() -
        new Date(
          b.createdAt
        ).getTime()
      );
    }
  );
}

/* =========================================================
   COMPONENT
   ========================================================= */

function StaffDashboard() {
  const navigate =
    useNavigate();

  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    department,
    setDepartment,
  ] = useState("all");

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState(null);

  const [
    patients,
    setPatients,
  ] = useState(loadPatients);

  const [
    staffSession,
    setStaffSession,
  ] = useState(
    getStaffSession()
  );

  /* =======================================================
     AUTH CHECK
     ======================================================= */

  useEffect(() => {
    const session =
      getStaffSession();

    if (
      !session ||
      session.loggedIn !== true
    ) {
      navigate(
        "/staff/login",
        {
          replace: true,
        }
      );

      return;
    }

    setStaffSession(session);
  }, [navigate]);

  /* =======================================================
     SYNC QUEUE
     ======================================================= */

  const syncQueue = () => {
    const freshPatients =
      sortQueue(
        loadPatients()
      );

    setPatients(
      freshPatients
    );

    /*
     * Keep the open patient drawer synchronized
     * with the newest queue data.
     */

    setSelectedPatient(
      (current) => {
        if (!current) {
          return null;
        }

        return (
          freshPatients.find(
            (patient) =>
              patient.id ===
              current.id
          ) || null
        );
      }
    );
  };

  useEffect(() => {
    syncQueue();

    const interval =
      setInterval(() => {
        syncQueue();
      }, 3000);

    const handleStorage =
      (event) => {
        if (
          !event.key ||
          event.key ===
            "smartcare_queue"
        ) {
          syncQueue();
        }
      };

    const handleQueueUpdate =
      () => {
        syncQueue();
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "smartcare:queue-updated",
      handleQueueUpdate
    );

    return () => {
      clearInterval(
        interval
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "smartcare:queue-updated",
        handleQueueUpdate
      );
    };
  }, []);

  /* =======================================================
     SORTED PATIENTS
     ======================================================= */

  const sortedPatients =
    useMemo(
      () =>
        sortQueue(
          patients
        ),
      [patients]
    );

  /* =======================================================
     STATS
     ======================================================= */

  const stats =
    useMemo(() => {
      const activePatients =
        sortedPatients.filter(
          (patient) =>
            patient.status !==
            "Completed"
        );

      return {
        total:
          activePatients.length,

        emergency:
          activePatients.filter(
            (patient) =>
              patient.priority ===
              "Emergency"
          ).length,

        urgent:
          activePatients.filter(
            (patient) =>
              patient.priority ===
              "Urgent"
          ).length,

        routine:
          activePatients.filter(
            (patient) =>
              patient.priority ===
              "Routine"
          ).length,

        called:
          activePatients.filter(
            (patient) =>
              patient.status ===
              "Called"
          ).length,
      };
    }, [sortedPatients]);

  /* =======================================================
     FILTERED PATIENTS
     ======================================================= */

  const filteredPatients =
    useMemo(() => {
      return sortedPatients.filter(
        (patient) => {
          let matchesFilter = true;

          if (
            activeFilter ===
            "emergency"
          ) {
            matchesFilter =
              patient.priority ===
              "Emergency";
          }

          if (
            activeFilter ===
            "urgent"
          ) {
            matchesFilter =
              patient.priority ===
              "Urgent";
          }

          if (
            activeFilter ===
            "routine"
          ) {
            matchesFilter =
              patient.priority ===
              "Routine";
          }

          if (
            activeFilter ===
            "called"
          ) {
            matchesFilter =
              patient.status ===
              "Called";
          }

          const patientDepartment =
            String(
              patient.department ||
                ""
            ).toLowerCase();

          const patientToken =
            String(
              patient.token || ""
            ).toLowerCase();

          const patientName =
            String(
              patient.name || ""
            ).toLowerCase();

          const patientSymptoms =
            String(
              patient.symptoms ||
                ""
            ).toLowerCase();

          const selectedDepartment =
            String(
              department || ""
            ).toLowerCase();

          const matchesDepartment =
            department === "all" ||
            patientDepartment.includes(
              selectedDepartment
            );

          const search =
            searchTerm
              .trim()
              .toLowerCase();

          const matchesSearch =
            !search ||
            patientToken.includes(
              search
            ) ||
            patientName.includes(
              search
            ) ||
            patientSymptoms.includes(
              search
            );

          return (
            matchesFilter &&
            matchesDepartment &&
            matchesSearch
          );
        }
      );
    }, [
      sortedPatients,
      activeFilter,
      department,
      searchTerm,
    ]);

  /* =======================================================
     CALL PATIENT
     ======================================================= */

  const callPatient = (
    patient
  ) => {
    const updatedPatient = {
      ...patient,

      status: "Called",

      wait: "Now",

      calledAt:
        new Date().toISOString(),
    };

    setPatients((current) =>
      current.map((item) =>
        item.id === patient.id
          ? updatedPatient
          : item
      )
    );

    updateQueueEntry(
      patient.id,
      {
        status: "Called",
        wait: "Now",
        calledAt:
          new Date().toISOString(),
      }
    );

    setSelectedPatient(
      updatedPatient
    );
  };

  /* =======================================================
     CALL NEXT PATIENT
     ======================================================= */

  const callNextPatient = () => {
    const nextPatient =
      sortedPatients.find(
        (patient) =>
          patient.status ===
          "Waiting"
      );

    if (!nextPatient) {
      return;
    }

    callPatient(
      nextPatient
    );
  };

  /* =======================================================
     COMPLETE PATIENT
     ======================================================= */

  const markCompleted = (
    id
  ) => {
    setPatients((current) =>
      current.map(
        (patient) =>
          patient.id === id
            ? {
                ...patient,
                status:
                  "Completed",
              }
            : patient
      )
    );

    updateQueueEntry(
      id,
      {
        status:
          "Completed",

        completedAt:
          new Date().toISOString(),
      }
    );

    setSelectedPatient(
      null
    );
  };

  /* =======================================================
     REFRESH
     ======================================================= */

  const refreshQueue = () => {
    syncQueue();
  };

  /* =======================================================
     LOGOUT
     ======================================================= */

  const handleLogout = () => {
    logoutStaff();

    setStaffSession(null);

    navigate(
      "/staff/login",
      {
        replace: true,
      }
    );
  };

  /* =======================================================
     NAVIGATION
     ======================================================= */

  const openEmergency = () => {
    navigate(
      "/staff/emergency"
    );
  };

  const openDepartments = () => {
    navigate(
      "/staff/departments"
    );
  };

  const openAnalytics = () => {
    navigate(
      "/staff/analytics"
    );
  };

  const openSettings = () => {
    navigate(
      "/staff/settings"
    );
  };

  return (
    <>
      <div className="staff-page">

        <div className="staff-grid"></div>

        <div className="staff-glow staff-glow-one"></div>

        <div className="staff-glow staff-glow-two"></div>

        {/* =================================================
            SIDEBAR
           ================================================= */}

        <aside className="staff-sidebar">

          <div className="staff-logo">

            <div className="staff-logo-icon">
              <HeartPulse
                size={22}
              />
            </div>

            <div>
              <strong>
                SmartCare
              </strong>

              <small>
                Hospital System
              </small>
            </div>

          </div>

          <nav className="staff-nav">

            {/* DASHBOARD */}

            <button
              type="button"
              className="staff-nav-item active"
              onClick={() => {
                setActiveFilter(
                  "all"
                );

                setDepartment(
                  "all"
                );
              }}
            >
              <Activity
                size={18}
              />

              Dashboard
            </button>

            {/* PATIENT QUEUE */}

            <button
              type="button"
              className="staff-nav-item"
              onClick={() => {
                setActiveFilter(
                  "all"
                );

                setDepartment(
                  "all"
                );

                setSearchTerm(
                  ""
                );
              }}
            >
              <Users size={18} />

              Patient Queue
            </button>

            {/* EMERGENCY */}

            <button
              type="button"
              className="staff-nav-item"
              onClick={
                openEmergency
              }
            >
              <Siren size={18} />

              Emergency

              <span className="staff-nav-badge">
                {stats.emergency}
              </span>
            </button>

            {/* ANALYTICS */}

            <button
              type="button"
              className="staff-nav-item"
              onClick={
                openAnalytics
              }
            >
              <BarChart3
                size={18}
              />

              Analytics
            </button>

            {/* DEPARTMENTS */}

            <button
              type="button"
              className="staff-nav-item"
              onClick={
                openDepartments
              }
            >
              <Building2
                size={18}
              />

              Departments
            </button>

            {/* CALLED */}

            <button
              type="button"
              className="staff-nav-item"
              onClick={() =>
                setActiveFilter(
                  "called"
                )
              }
            >
              <Bell size={18} />

              Called

              {stats.called >
                0 && (
                <span className="staff-nav-badge">
                  {stats.called}
                </span>
              )}
            </button>

          </nav>

          {/* =================================================
              STAFF ACCOUNT
             ================================================= */}

          <div className="staff-sidebar-bottom">

            <div className="staff-account">

              <div className="staff-avatar">
                <UserRound
                  size={17}
                />
              </div>

              <div>
                <strong>
                  {staffSession?.name ||
                    "Staff Portal"}
                </strong>

                <small>
                  {staffSession?.staffId
                    ? `ID: ${staffSession.staffId}`
                    : "Hospital Operator"}
                </small>
              </div>

            </div>

            {/* SETTINGS */}

            <button
              type="button"
              className="staff-logout"
              onClick={
                openSettings
              }
            >
              <Settings
                size={16}
              />

              Staff Settings
            </button>

            {/* LOGOUT */}

            <button
              type="button"
              className="staff-logout"
              onClick={
                handleLogout
              }
            >
              <LogOut size={16} />

              Logout
            </button>

          </div>
        </aside>

        {/* =================================================
            MAIN
           ================================================= */}

        <main className="staff-content">

          {/* HEADER */}

          <header className="staff-header">

            <div className="staff-header-title">

              <button
                type="button"
                className="staff-mobile-back"
                onClick={() =>
                  navigate("/")
                }
              >
                <ArrowLeft
                  size={17}
                />
              </button>

              <div>

                <div className="staff-eyebrow">
                  <span></span>
                  HOSPITAL OPERATIONS
                </div>

                <h1>
                  Queue Dashboard
                </h1>

                <p>
                  Monitor patient flow,
                  priority and queue
                  activity.
                </p>

              </div>
            </div>

            <div className="staff-header-actions">

              <button
                type="button"
                className="staff-refresh-button"
                onClick={
                  refreshQueue
                }
              >
                <RefreshCw
                  size={16}
                />

                Refresh
              </button>

              <div className="staff-online">
                <span></span>
                System Live
              </div>

            </div>
          </header>

          {/* =================================================
              STATS
             ================================================= */}

          <section className="staff-stat-grid">

            <StatCard
              label="Patients in Queue"
              value={
                stats.total
              }
              icon={
                <Users size={20} />
              }
              detail="Active patients"
              className="blue"
            />

            <StatCard
              label="Emergency"
              value={
                stats.emergency
              }
              icon={
                <Siren size={20} />
              }
              detail="Immediate attention"
              className="red"
            />

            <StatCard
              label="Urgent"
              value={
                stats.urgent
              }
              icon={
                <AlertTriangle
                  size={20}
                />
              }
              detail="Priority queue"
              className="amber"
            />

            <StatCard
              label="Called"
              value={
                stats.called
              }
              icon={
                <Bell size={20} />
              }
              detail="Patient called"
              className="cyan"
            />

          </section>

          {/* =================================================
              CONTROL BAR
             ================================================= */}

          <section className="staff-control-bar">

            <div className="staff-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search token, patient or symptom..."
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="staff-controls-right">

              <div className="staff-select-wrap">

                <select
                  value={
                    department
                  }
                  onChange={(
                    event
                  ) =>
                    setDepartment(
                      event.target.value
                    )
                  }
                >
                  <option value="all">
                    All Departments
                  </option>

                  <option value="Emergency">
                    Emergency
                  </option>

                  <option value="General Medicine">
                    General Medicine
                  </option>

                  <option value="Cardiology">
                    Cardiology
                  </option>

                  <option value="Orthopedics">
                    Orthopedics
                  </option>

                  <option value="Pediatrics">
                    Pediatrics
                  </option>

                  <option value="Dermatology">
                    Dermatology
                  </option>

                  <option value="ENT">
                    ENT
                  </option>
                </select>

                <ChevronDown
                  size={15}
                />

              </div>

              <button
                type="button"
                className="staff-call-next"
                onClick={
                  callNextPatient
                }
              >
                <Siren size={16} />

                Call Next Patient
              </button>

            </div>
          </section>

          {/* =================================================
              FILTERS
             ================================================= */}

          <div className="staff-filter-row">

            <div className="staff-filters">

              <FilterButton
                label="All"
                value="all"
                current={
                  activeFilter
                }
                onClick={
                  setActiveFilter
                }
              />

              <FilterButton
                label="Emergency"
                value="emergency"
                current={
                  activeFilter
                }
                onClick={
                  setActiveFilter
                }
              />

              <FilterButton
                label="Urgent"
                value="urgent"
                current={
                  activeFilter
                }
                onClick={
                  setActiveFilter
                }
              />

              <FilterButton
                label="Routine"
                value="routine"
                current={
                  activeFilter
                }
                onClick={
                  setActiveFilter
                }
              />

              <FilterButton
                label="Called"
                value="called"
                current={
                  activeFilter
                }
                onClick={
                  setActiveFilter
                }
              />

            </div>

            <span className="staff-result-count">
              Showing{" "}
              {
                filteredPatients.length
              }{" "}
              patients
            </span>

          </div>

          {/* =================================================
              QUEUE
             ================================================= */}

          <section className="staff-queue-card">

            <div className="staff-queue-header">

              <div>
                <small>
                  LIVE PATIENT QUEUE
                </small>

                <h2>
                  Patient Flow
                </h2>
              </div>

              <div className="staff-queue-live">
                <span></span>
                Live updates
              </div>

            </div>

            <div className="staff-table-wrap">

              <table className="staff-table">

                <thead>
                  <tr>
                    <th>
                      Position
                    </th>

                    <th>
                      Token
                    </th>

                    <th>
                      Patient
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Priority
                    </th>

                    <th>
                      Symptoms
                    </th>

                    <th>
                      Wait
                    </th>

                    <th>
                      Status
                    </th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {filteredPatients.map(
                    (
                      patient
                    ) => {

                      const queueIndex =
                        sortedPatients.findIndex(
                          (item) =>
                            item.id ===
                            patient.id
                        );

                      const displayPosition =
                        patient.status ===
                        "Completed"
                          ? "—"
                          : queueIndex +
                            1;

                      return (
                        <tr
                          key={
                            patient.id
                          }
                          className={
                            selectedPatient?.id ===
                            patient.id
                              ? "staff-row-selected"
                              : ""
                          }
                          onClick={() =>
                            setSelectedPatient(
                              patient
                            )
                          }
                        >

                          <td>
                            <span className="staff-position">
                              {
                                displayPosition
                              }
                            </span>
                          </td>

                          <td>
                            <span className="staff-token">
                              {
                                patient.token
                              }
                            </span>
                          </td>

                          <td>
                            <div className="staff-patient">

                              <div className="staff-patient-avatar">
                                <UserRound
                                  size={
                                    15
                                  }
                                />
                              </div>

                              <div>
                                <strong>
                                  {
                                    patient.name
                                  }
                                </strong>

                                <small>
                                  Registered{" "}
                                  {
                                    patient.time
                                  }
                                </small>
                              </div>

                            </div>
                          </td>

                          <td>
                            <span className="staff-department">
                              {
                                patient.department
                              }
                            </span>
                          </td>

                          <td>
                            <PriorityBadge
                              priority={
                                patient.priority
                              }
                            />
                          </td>

                          <td>
                            <span className="staff-symptoms">
                              {
                                patient.symptoms
                              }
                            </span>
                          </td>

                          <td>
                            <span className="staff-wait">
                              <Clock3
                                size={
                                  13
                                }
                              />

                              {
                                patient.wait
                              }
                            </span>
                          </td>

                          <td>
                            <StatusBadge
                              status={
                                patient.status
                              }
                            />
                          </td>

                          <td>
                            <div
                              className="staff-row-actions"
                              onClick={(
                                event
                              ) =>
                                event.stopPropagation()
                              }
                            >

                              {patient.status !==
                                "Completed" && (
                                <button
                                  type="button"
                                  className="staff-complete"
                                  onClick={() =>
                                    markCompleted(
                                      patient.id
                                    )
                                  }
                                  title="Mark completed"
                                >
                                  <Check
                                    size={
                                      15
                                    }
                                  />
                                </button>
                              )}

                              <button
                                type="button"
                                className="staff-more"
                                onClick={() =>
                                  setSelectedPatient(
                                    patient
                                  )
                                }
                                aria-label="View patient"
                              >
                                <MoreVertical
                                  size={
                                    16
                                  }
                                />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )}

                  {filteredPatients.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan="9"
                        className="staff-empty"
                      >
                        <Users
                          size={24}
                        />

                        <strong>
                          No patients found
                        </strong>

                        <span>
                          Try changing your
                          filters or search
                          term.
                        </span>
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </section>

          {/* =================================================
              BOTTOM PANELS
             ================================================= */}

          <section className="staff-bottom-grid">

            <div className="staff-alert-panel">

              <div className="staff-panel-icon emergency">
                <Siren size={20} />
              </div>

              <div>
                <small>
                  EMERGENCY MONITOR
                </small>

                <h3>
                  {stats.emergency}{" "}
                  active emergency{" "}
                  {
                    stats.emergency ===
                    1
                      ? "case"
                      : "cases"
                  }
                </h3>

                <p>
                  Emergency patients remain
                  at the top of the active
                  queue for staff review.
                </p>
              </div>

            </div>

            <div className="staff-security-panel">

              <ShieldCheck
                size={20}
              />

              <div>
                <small>
                  SYSTEM STATUS
                </small>

                <strong>
                  Queue service operational
                </strong>

                <span>
                  Frontend prototype
                </span>
              </div>

            </div>

          </section>

          {/* =================================================
              FOOTER
             ================================================= */}

          <footer className="staff-footer">

            <div>
              <HeartPulse
                size={15}
              />
              SmartCare
            </div>

            <span>
              Hospital operations • Smart
              queue • Patient flow
            </span>

          </footer>
        </main>
      </div>

      {/* =====================================================
          PATIENT DRAWER
         ===================================================== */}

      {selectedPatient && (
        <div
          className="patient-drawer-overlay"
          onClick={() =>
            setSelectedPatient(
              null
            )
          }
        >
          <aside
            className="patient-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="patient-drawer-header">

              <div>
                <small>
                  PATIENT DETAILS
                </small>

                <h2>
                  {
                    selectedPatient.token
                  }
                </h2>
              </div>

              <button
                type="button"
                className="patient-drawer-close"
                onClick={() =>
                  setSelectedPatient(
                    null
                  )
                }
                aria-label="Close patient details"
              >
                <X size={19} />
              </button>

            </div>

            <div className="drawer-status-row">

              <PriorityBadge
                priority={
                  selectedPatient.priority
                }
              />

              <StatusBadge
                status={
                  selectedPatient.status
                }
              />

            </div>

            <div className="drawer-profile">

              <div className="drawer-avatar">
                <UserRound
                  size={25}
                />
              </div>

              <div>
                <h3>
                  {
                    selectedPatient.name
                  }
                </h3>

                <p>
                  SmartCare patient record
                </p>
              </div>

            </div>

            {/* QUEUE INFORMATION */}

            <div className="drawer-section">

              <div className="drawer-section-title">
                <Activity
                  size={15}
                />
                Queue Information
              </div>

              <div className="drawer-info-grid">

                <InfoItem
                  label="Position"
                  value={
                    selectedPatient.status ===
                    "Completed"
                      ? "Completed"
                      : `#${
                          sortedPatients.findIndex(
                            (item) =>
                              item.id ===
                              selectedPatient.id
                          ) + 1
                        }`
                  }
                  icon={
                    <Users
                      size={15}
                    />
                  }
                />

                <InfoItem
                  label="Department"
                  value={
                    selectedPatient.department
                  }
                  icon={
                    <Stethoscope
                      size={15}
                    />
                  }
                />

                <InfoItem
                  label="Current Wait"
                  value={
                    selectedPatient.wait
                  }
                  icon={
                    <Clock3
                      size={15}
                    />
                  }
                />

                <InfoItem
                  label="Registered"
                  value={
                    selectedPatient.time
                  }
                  icon={
                    <CalendarDays
                      size={15}
                    />
                  }
                />

              </div>
            </div>

            {/* SYMPTOMS */}

            <div className="drawer-section">

              <div className="drawer-section-title">
                <HeartPulse
                  size={15}
                />
                Reported Symptoms
              </div>

              <div className="drawer-symptom">
                {
                  selectedPatient.symptoms
                }
              </div>

            </div>

            {/* LOCATION */}

            <div className="drawer-section">

              <div className="drawer-section-title">
                <MapPin
                  size={15}
                />
                Hospital Location
              </div>

              <div className="drawer-contact">
                <span>
                  Hospital
                </span>

                <strong>
                  {
                    selectedPatient.location
                  }
                </strong>
              </div>

              <div className="drawer-contact">
                <span>
                  Room
                </span>

                <strong>
                  {
                    selectedPatient.room
                  }
                </strong>
              </div>

              <div className="drawer-contact">
                <span>
                  Floor
                </span>

                <strong>
                  {
                    selectedPatient.floor
                  }
                </strong>
              </div>

            </div>

            {/* CONTACT */}

            <div className="drawer-section">

              <div className="drawer-section-title">
                <Phone
                  size={15}
                />
                Contact Information
              </div>

              <div className="drawer-contact">

                <span>
                  Phone
                </span>

                <strong>
                  {
                    selectedPatient.phone
                  }
                </strong>

              </div>
            </div>

            {/* ACTIONS */}

            <div className="drawer-actions">

              {selectedPatient.status !==
                "Called" &&
                selectedPatient.status !==
                  "Completed" && (
                  <button
                    type="button"
                    className="drawer-primary"
                    onClick={() =>
                      callPatient(
                        selectedPatient
                      )
                    }
                  >
                    <Bell
                      size={16}
                    />
                    Call Patient
                  </button>
                )}

              {selectedPatient.status !==
                "Completed" && (
                <button
                  type="button"
                  className="drawer-secondary"
                  onClick={() =>
                    markCompleted(
                      selectedPatient.id
                    )
                  }
                >
                  <Check
                    size={16}
                  />
                  Mark Completed
                </button>
              )}

            </div>

            <div className="drawer-notice">

              <ShieldCheck
                size={15}
              />

              <span>
                Prototype staff interface.
                Patient information should be
                handled according to applicable
                hospital privacy and security
                procedures.
              </span>

            </div>

          </aside>
        </div>
      )}
    </>
  );
}

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({
  label,
  value,
  icon,
  detail,
  className,
}) {
  return (
    <div
      className={`staff-stat-card ${className}`}
    >
      <div className="staff-stat-top">

        <div className="staff-stat-icon">
          {icon}
        </div>

        <span className="staff-stat-live">
          Live
        </span>

      </div>

      <div className="staff-stat-value">
        {value}
      </div>

      <strong>
        {label}
      </strong>

      <small>
        {detail}
      </small>
    </div>
  );
}

/* =========================================================
   FILTER BUTTON
   ========================================================= */

function FilterButton({
  label,
  value,
  current,
  onClick,
}) {
  return (
    <button
      type="button"
      className={
        current === value
          ? "staff-filter active"
          : "staff-filter"
      }
      onClick={() =>
        onClick(value)
      }
    >
      {label}
    </button>
  );
}

/* =========================================================
   PRIORITY BADGE
   ========================================================= */

function PriorityBadge({
  priority,
}) {
  return (
    <span
      className={`priority-badge ${
        priority?.toLowerCase() ||
        "routine"
      }`}
    >
      {priority ===
        "Emergency" && (
        <Siren size={12} />
      )}

      {priority ===
        "Urgent" && (
        <AlertTriangle
          size={12}
        />
      )}

      {priority ===
        "Routine" && (
        <Clock3
          size={12}
        />
      )}

      {priority}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
   ========================================================= */

function StatusBadge({
  status,
}) {
  return (
    <span
      className={`status-badge ${
        status?.toLowerCase() ||
        "waiting"
      }`}
    >
      <span></span>
      {status}
    </span>
  );
}

/* =========================================================
   DRAWER INFO
   ========================================================= */

function InfoItem({
  label,
  value,
  icon,
}) {
  return (
    <div className="drawer-info-item">

      <div className="drawer-info-icon">
        {icon}
      </div>

      <div>

        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>

      </div>
    </div>
  );
}

export default StaffDashboard;