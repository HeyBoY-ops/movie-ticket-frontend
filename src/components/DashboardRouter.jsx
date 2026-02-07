import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function DashboardRouter() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user.role) {
    case "ORGANIZATION":
      return <Navigate to="/dashboard/business-analytics" replace />;
    case "admin": // Check if role is upper or lower case in DB. Schema says UPPER, but let's be safe or check AuthContext. 
    case "ADMIN":
    case "SUPER_ADMIN":
      return <Navigate to="/dashboard/admin-overview" replace />;
    case "USER":
    default:
      return <Navigate to="/dashboard/my-bookings" replace />;
  }
}
