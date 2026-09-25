const STAFF_SESSION_KEY =
  "smartcare_staff_session";

/* =========================================================
   GET STAFF SESSION
   ========================================================= */

export function getStaffSession() {
  try {
    const value = localStorage.getItem(
      STAFF_SESSION_KEY
    );

    return value
      ? JSON.parse(value)
      : null;
  } catch {
    return null;
  }
}

/* =========================================================
   CHECK LOGIN
   ========================================================= */

export function isStaffLoggedIn() {
  const session = getStaffSession();

  return Boolean(
    session &&
      session.loggedIn === true
  );
}

/* =========================================================
   LOGIN
   Frontend prototype only.
   ========================================================= */

export function loginStaff({
  staffId,
  name = "Hospital Operator",
  role = "Hospital Staff",
}) {
  const session = {
    loggedIn: true,
    staffId,
    name,
    role,
    loginTime:
      new Date().toISOString(),
  };

  localStorage.setItem(
    STAFF_SESSION_KEY,
    JSON.stringify(session)
  );

  return session;
}

/* =========================================================
   LOGOUT
   ========================================================= */

export function logoutStaff() {
  localStorage.removeItem(
    STAFF_SESSION_KEY
  );

  window.dispatchEvent(
    new Event("smartcare:staff-logout")
  );
}

/* =========================================================
   CLEAR EVERYTHING STAFF RELATED
   ========================================================= */

export function clearStaffSession() {
  logoutStaff();
}