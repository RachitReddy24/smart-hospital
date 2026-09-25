import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

/* =========================================================
   PATIENT PAGES
   ========================================================= */

import PatientRegistration from "../pages/PatientRegistration";
import Triage from "../pages/Triage";
import Token from "../pages/Token";
import TokenPass from "../pages/TokenPass";
import PatientStatus from "../pages/PatientStatus";

/* =========================================================
   HOSPITAL / QUEUE PAGES
   ========================================================= */

import HospitalInfo from "../pages/HospitalInfo";
import QueueDisplay from "../pages/QueueDisplay";

/* =========================================================
   STAFF PAGES
   ========================================================= */

import StaffLogin from "../pages/StaffLogin";
import StaffDashboard from "../pages/StaffDashboard";
import EmergencyControl from "../pages/EmergencyControl";
import Departments from "../pages/Departments";
import StaffSettings from "../pages/StaffSettings";
import Analytics from "../pages/Analytics";

/* =========================================================
   ROUTE GUARD
   ========================================================= */

import ProtectedRoute from "./ProtectedRoute";

/* =========================================================
   NOT FOUND
   ========================================================= */

import NotFound from "../pages/NotFound";

function AppRoutes({
  darkMode,
  setDarkMode,
}) {
  return (
    <Routes>

      {/* =====================================================
          HOME
         ===================================================== */}

      <Route
        path="/"
        element={
          <Home
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        }
      />

      {/* =====================================================
          PATIENT FLOW
         ===================================================== */}

      <Route
        path="/patient/register"
        element={
          <PatientRegistration />
        }
      />

      <Route
        path="/patient/triage"
        element={
          <Triage />
        }
      />

      <Route
        path="/patient/token"
        element={
          <Token />
        }
      />

      <Route
        path="/patient/token/pass"
        element={
          <TokenPass />
        }
      />

      <Route
        path="/patient/status"
        element={
          <PatientStatus />
        }
      />

      {/* =====================================================
          HOSPITAL INFORMATION
         ===================================================== */}

      <Route
        path="/hospital"
        element={
          <HospitalInfo />
        }
      />

      {/* =====================================================
          PUBLIC LIVE QUEUE
         ===================================================== */}

      <Route
        path="/queue/display"
        element={
          <QueueDisplay />
        }
      />

      {/* =====================================================
          STAFF LOGIN
         ===================================================== */}

      <Route
        path="/staff/login"
        element={
          <StaffLogin />
        }
      />

      {/* =====================================================
          PROTECTED STAFF DASHBOARD
         ===================================================== */}

      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PROTECTED EMERGENCY CONTROL
         ===================================================== */}

      <Route
        path="/staff/emergency"
        element={
          <ProtectedRoute>
            <EmergencyControl />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PROTECTED DEPARTMENTS
         ===================================================== */}

      <Route
        path="/staff/departments"
        element={
          <ProtectedRoute>
            <Departments />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PROTECTED STAFF SETTINGS
         ===================================================== */}

      <Route
        path="/staff/settings"
        element={
          <ProtectedRoute>
            <StaffSettings />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          PROTECTED ANALYTICS
         ===================================================== */}

      <Route
        path="/staff/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* =====================================================
          404 FALLBACK
         ===================================================== */}

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>
  );
}

export default AppRoutes;