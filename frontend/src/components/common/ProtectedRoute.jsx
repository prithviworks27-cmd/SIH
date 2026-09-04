import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getPostLoginRedirect } from "../../utils/roleRedirect";
import LoadingState from "./LoadingState";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState fullScreen label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRole = user.role?.trim().toLowerCase();

  if (allowedRoles && !allowedRoles.includes(normalizedRole)) {
    // Send the user to wherever their own role belongs, never back into
    // this same guard (a hardcoded "/dashboard" here would infinite-loop
    // for any non-student role, since /dashboard is student-only).
    return <Navigate to={getPostLoginRedirect(normalizedRole)} replace />;
  }

  return children;
}
