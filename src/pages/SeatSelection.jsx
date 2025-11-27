import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";
import { Armchair, X } from "lucide-react";
import { toast } from "sonner";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      const res = await axios.get(`${API}/shows/${showId}`);
      setShow(res.data);
    } catch (err) {
      toast.error("Failed to load show details");
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNumber) => {
    if (show?.booked_seats?.includes(seatNumber)) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 10) {
        toast.error("Maximum 10 seats can be selected");
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    setBooking(true);

    try {
      const res = await axios.post(`${API}/bookings`, {
        show_id: showId,
        seats: selectedSeats,
        payment_method: "mock",
      });

      toast.success("Booking confirmed!");
      navigate(`/booking-confirmation/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center pt-20">
        <div className="loading"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center pt-20">
        <p className="text-gray-400">Show not found</p>
      </div>
    );
  }

  const totalAmount = selectedSeats.length * show.price;

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* MOVIE INFO */}
        <div className="bg-zinc-900/70 border border-zinc-800 p-8 rounded-2xl mb-12">
          <h1
            className="text-3xl font-bold text-yellow-500 mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {show.movie?.title}
          </h1>
          <p className="text-gray-400">
            {show.theater?.name} • Screen {show.screen_number} •{" "}
            {show.show_date} • {show.show_time}
          </p>
          <p className="text-yellow-500 text-xl font-bold mt-3">
            ₹{show.price}{" "}
            <span className="text-gray-400 text-sm font-light">per seat</span>
          </p>
        </div>

        {/* SCREEN INDICATOR */}
        <div className="mb-10">
          <div className="h-1.5 w-full bg-gradient-to-b from-yellow-500/60 to-transparent rounded-full mb-3"></div>
          <p className="text-center text-gray-400 tracking-widest text-xs">
            SCREEN THIS WAY
          </p>
        </div>

        {/* SEAT LAYOUT */}
        <div className="bg-zinc-900/70 border border-zinc-800 p-8 rounded-2xl">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {rows.map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-center mb-3"
                >
                  <span className="w-8 text-center text-gray-500 font-semibold">
                    {row}
                  </span>

                  <div className="flex gap-2">
                    {Array.from({ length: seatsPerRow }, (_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const booked = show.booked_seats?.includes(seatId);
                      const selected = selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={booked}
                          className={`
                            w-9 h-9 flex items-center justify-center rounded-md transition
                            border
                            ${
                              booked
                                ? "bg-red-500/20 border-red-500/40 text-red-300 cursor-not-allowed"
                                : selected
                                ? "bg-yellow-500 text-black border-yellow-400 shadow-[0_0_12px_rgba(255,200,0,0.4)]"
                                : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                            }
                          `}
                        >
                          {booked ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <Armchair className="w-5 h-5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <span className="w-8 text-center text-gray-500 font-semibold">
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 pt-6 border-t border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700"></div>
              <span className="text-sm text-gray-400">Available</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-yellow-500 border border-yellow-400"></div>
              <span className="text-sm text-gray-400">Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-500/40 border border-red-500"></div>
              <span className="text-sm text-gray-400">Booked</span>
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        {selectedSeats.length > 0 && (
          <div className="bg-zinc-900/70 border border-zinc-800 p-8 rounded-2xl mt-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div>
                <p className="text-gray-400 mb-2 text-sm">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                <p className="text-yellow-500 text-3xl font-bold mb-4">
                  ₹{totalAmount}
                </p>

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold shadow-[0_0_15px_rgba(255,200,0,0.4)] hover:scale-[1.03] transition"
                >
                  {booking ? (
                    <span className="loading"></span>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;
