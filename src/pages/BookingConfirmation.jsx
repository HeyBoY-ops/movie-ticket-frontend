import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api";
import { CheckCircle, Calendar, Clock, MapPin, Ticket } from "lucide-react";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // Check if it's a mock booking ID
      if (bookingId && bookingId.startsWith("mock-booking-")) {
        // Create mock booking data for demo events
        const mockBooking = {
          id: bookingId,
          booking_status: "confirmed",
          total_amount: 1500,
          payment_method: "mock",
          seats: ["GA-01", "GA-02"],
          movie: {
            title: "Event Booking",
          },
          theater: {
            name: "Event Venue",
            address: "Event Address",
            city: "Event City",
          },
          show: {
            show_date: new Date().toLocaleDateString(),
            show_time: "TBD",
          },
        };
        setBooking(mockBooking);
        setLoading(false);
        return;
      }

      const res = await axios.get(`/bookings/${bookingId}`);

      setBooking(res.data);
    } catch (err) {
      console.error(err);
      // If it's a 404 and looks like a mock booking, create mock data
      if (err.response?.status === 404 && bookingId?.startsWith("mock-")) {
        const mockBooking = {
          id: bookingId,
          booking_status: "confirmed",
          total_amount: 1500,
          payment_method: "mock",
          seats: ["GA-01"],
          movie: {
            title: "Event Booking",
          },
          theater: {
            name: "Event Venue",
            address: "Event Address",
            city: "Event City",
          },
          show: {
            show_date: new Date().toLocaleDateString(),
            show_time: "TBD",
          },
        };
        setBooking(mockBooking);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0a1a]">
        <div className="loading" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0a0a1a] text-gray-400">
        Booking Not Found
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 px-4 bg-[#0a0a1a] text-white"
      data-testid="booking-confirmation-page"
    >
      <div className="max-w-3xl mx-auto py-12">
        {/* HERO SUCCESS ICON */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/15 mb-6 shadow-[0_0_25px_rgba(0,255,120,0.3)]">
            <CheckCircle className="w-14 h-14 text-green-400" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff004c] to-[#ff8a00] bg-clip-text text-transparent">
            Booking Confirmed!
          </h1>

          <p className="text-gray-400 mt-2">Your tickets are ready 🎟️</p>
        </div>

        {/* BOOKING DETAILS */}
        <div className="glass p-8 rounded-3xl mb-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
            <h2
              className="text-3xl font-bold text-yellow-500"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {booking.movie?.title || booking.show?.movie?.title || "Event / Movie"}
            </h2>

            <span className="px-4 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
              {booking.booking_status.toUpperCase()}
            </span>
          </div>

          {/* LOCATION / VENUE */}
          <div className="bg-white/5 p-4 rounded-xl mb-6">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-400 text-sm mb-1">Location</p>
                <p className="font-semibold text-lg mb-1">
                  {booking.theater?.name || booking.show?.theater?.name || "Venue TBD"}
                </p>
                <p className="text-gray-400 text-sm">
                  {booking.theater?.address || booking.show?.theater?.address || ""}
                  {booking.theater?.city || booking.show?.theater?.city
                    ? `, ${booking.theater?.city || booking.show?.theater?.city}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="font-semibold">
                  {booking.show?.show_date
                    ? new Date(booking.show.show_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "TBD"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-gray-400 text-sm">Time</p>
                <p className="font-semibold">{booking.show?.show_time}</p>
              </div>
            </div>
          </div>

          {/* SEATS */}
          <div className="flex gap-3 mb-6">
            <Ticket className="w-5 h-5 text-yellow-500 mt-1" />
            <div>
              <p className="text-gray-400 text-sm mb-2">Seats</p>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <span
                    key={seat}
                    className="px-3 py-1 rounded-lg bg-yellow-500/20 font-semibold text-sm"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* BOOKING ID */}
          <div className="bg-white/5 p-4 rounded-xl mb-6">
            <p className="text-gray-400 text-sm mb-1">Booking ID</p>
            <p className="font-mono text-lg font-bold">{booking.id}</p>
          </div>

          {/* TOTAL AMOUNT */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-500/30">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-3xl font-bold text-yellow-400">
                ₹{booking.total_amount}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Payment Method: {booking.payment_method.toUpperCase()}
            </p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/profile" className="flex-1">
            <button className="btn-primary w-full py-3">
              View My Bookings
            </button>
          </Link>

          <Link to="/movies" className="flex-1">
            <button className="btn-secondary w-full py-3">
              Book More Tickets
            </button>
          </Link>
        </div>

        {/* NOTE */}
        <div className="mt-10 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-300 text-sm">
            <strong>Note:</strong> Please arrive 15 minutes early and carry a
            valid ID for verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
