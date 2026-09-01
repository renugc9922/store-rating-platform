import { Navigate } from "react-router-dom";
import { getDashboardPath, getStoredUser } from "../utils/auth";

function ProtectedRoute({ allowedRoles, children }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
