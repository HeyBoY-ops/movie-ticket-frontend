import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import AdminDashboard from "./pages/AdminDashboard";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import Events from "./pages/Events";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import DashboardRouter from "./components/DashboardRouter";
import UserBookings from "./pages/UserBookings";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import RegisterOrganization from "./pages/RegisterOrganization";
import { Toaster } from "sonner";
import { Navigate } from "react-router-dom";

export default function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Router>
        <Routes>
          {/* PUBLIC ROUTES (No Layout) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/register-org"
            element={
              <PublicRoute>
                <RegisterOrganization />
              </PublicRoute>
            }
          />

          {/* PROTECTED ROUTES (With Layout) */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <Movies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movies/:id"
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/my-bookings"
              element={
                <ProtectedRoute>
                  <UserBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/business-analytics"
              element={
                <ProtectedRoute>
                  <OrganizationDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin-overview"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard/admin-overview" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shows/:showId/seats"
              element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation/:bookingId"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
