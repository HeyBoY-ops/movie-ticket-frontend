import React, { useEffect, useState } from "react";
import axios from "../api";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/bookings`);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await axios.post(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      console.error("Cancel booking error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to cancel booking";
      toast.error(errorMessage);
    }
  };

  // Helper function to normalize date for comparison (compare only date, not time)
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;
      // Set to midnight UTC for consistent comparison
      date.setUTCHours(0, 0, 0, 0);
      return date;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };

  // Get today's date at midnight UTC for consistent comparison
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Filter bookings: upcoming = confirmed AND show_date >= today
  const upcoming = bookings.filter((b) => {
    // Only show confirmed bookings
    if (b.booking_status !== "confirmed") return false;

    const showDate = normalizeDate(b.show?.show_date);
    if (!showDate) {
      // If no date, don't include in upcoming
      return false;
    }

    // Show date must be today or in the future
    return showDate.getTime() >= today.getTime();
  });

  // Filter bookings: past = cancelled OR show_date < today
  const past = bookings.filter((b) => {
    // Always show cancelled bookings in history
    if (b.booking_status === "cancelled") return true;

    // Only include confirmed bookings with past dates
    if (b.booking_status !== "confirmed") return false;

    const showDate = normalizeDate(b.show?.show_date);
    if (!showDate) {
      // If no date, don't include in past
      return false;
    }

    // Show date must be before today
    return showDate.getTime() < today.getTime();
  });

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-10 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-zinc-900/70 border border-zinc-800 backdrop-blur-lg p-8 rounded-3xl shadow-xl mb-12">
          <h1
            className="text-4xl font-bold text-red-500 mb-6 drop-shadow-[0_0_10px_rgba(220,38,38,0.4)]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            My Profile
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-red-600/20 flex items-center justify-center text-4xl font-bold text-red-500 shadow-inner">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-3xl font-semibold">{user.name}</h2>
              <p className="text-gray-400 text-lg">{user.email}</p>
              <p className="text-gray-400">
                Role:{" "}
                <span className="text-red-500 font-semibold">
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* UPCOMING BOOKINGS */}
        <div className="mb-16">
          <h2
            className="text-3xl font-bold text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(229,9,20,0.35)]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Upcoming Bookings
          </h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="loading"></div>
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {upcoming.map((b) => (
                <div
                  key={b.id}
                  className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(220,38,38,0.15)] transition"
                >
                  {/* Title */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{b.show?.movie?.title}</h3>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                      {b.booking_status}
                    </span>
                  </div>

                  {/* Theater */}
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-1" />
                    <p className="text-gray-300 text-sm">
                      {b.show?.theater?.name}, {b.show?.theater?.city}
                    </p>
                  </div>

                  {/* Date / Time */}
                  <div className="flex items-center gap-6 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span className="text-sm">
                        {b.show?.show_date
                          ? new Date(b.show.show_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{b.show?.show_time}</span>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="flex items-start gap-2 mb-4">
                    <Ticket className="w-4 h-4 text-red-500 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {b.seats.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-zinc-700 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-xs">Total Amount</p>
                      <p className="text-2xl font-bold text-red-500">
                        ₹{b.total_amount}
                      </p>
                    </div>

                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/70 border border-zinc-800 p-12 rounded-2xl text-center text-gray-400">
              No upcoming bookings.
            </div>
          )}
        </div>

        {/* PAST BOOKINGS */}
        <div>
          <h2
            className="text-3xl font-bold text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(229,9,20,0.35)]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Booking History
          </h2>

          {past.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {past.map((b) => (
                <div
                  key={b.id}
                  className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(220,38,38,0.15)] transition opacity-80 hover:opacity-100"
                >
                  {/* Title */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white truncate pr-4" title={b.show?.movie?.title}>
                      {b.show?.movie?.title || "Event / Movie"}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${b.booking_status === "cancelled"
                        ? "bg-red-500/10 border-red-500 text-red-500"
                        : "bg-green-500/10 border-green-500 text-green-500"
                        }`}
                    >
                      {b.booking_status}
                    </span>
                  </div>

                  {/* Theater / Venue */}
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-1" />
                    <p className="text-gray-300 text-sm">
                      {b.show?.theater?.name}, {b.show?.theater?.city}
                    </p>
                  </div>

                  {/* Date / Time */}
                  <div className="flex items-center gap-6 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-300">
                        {b.show?.show_date
                          ? new Date(b.show.show_date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-300">{b.show?.show_time}</span>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="flex items-start gap-2 mb-4">
                    <Ticket className="w-4 h-4 text-red-500 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {b.seats && b.seats.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-1 bg-red-600/20 text-red-300 rounded text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-zinc-700 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-xs">Total Amount</p>
                      <p className="text-2xl font-bold text-red-500">
                        ₹{b.total_amount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/70 border border-zinc-800 p-12 rounded-2xl text-center text-gray-400">
              No booking history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
