import { Navigate, useLocation } from "react-router-dom";
import { isStaffLoggedIn } from "../utils/smartCareAuth";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const authenticated =
    isStaffLoggedIn();

  if (!authenticated) {
    return (
      <Navigate
        to="/staff/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;