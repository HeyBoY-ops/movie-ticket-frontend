import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";
import { ChevronLeft, Info, Calendar, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { 
  initBooking, 
  toggleSeat, 
  selectSelectedSeats, 
  selectTotalPrice 
} from "../slices/bookingSlice";
import Seat from "../components/Seat";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const selectedSeats = useSelector(selectSelectedSeats);
  const totalPrice = useSelector(selectTotalPrice);

  // Local state
  const [show, setShow] = useState(null);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12; // Split into 2 groups of 6 for better layout
  const pollInterval = useRef(null);
  
  const selectedSeatsRef = useRef(selectedSeats);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  useEffect(() => {
    if (showId) {
        dispatch(initBooking({ showId }));
    }
    fetchShowDetails();
    startPolling();

    return () => stopPolling();
  }, [showId, dispatch]);

  const startPolling = () => {
    stopPolling();
    pollInterval.current = setInterval(fetchSeatStatus, 3000);
  };

  const stopPolling = () => {
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  const fetchShowDetails = async () => {
    try {
      const res = await axios.get(`${API}/shows/${showId}`);
      setShow(res.data);
      fetchSeatStatus();
    } catch (err) {
      toast.error("Failed to load show details");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeatStatus = async () => {
    try {
      const res = await axios.get(`${API}/bookings/status/${showId}`);
      setBookedSeats(res.data.booked || []);
      setLockedSeats(res.data.locked || []);
    } catch (err) {
      console.error("Failed to fetch seat status", err);
    }
  };

  const handleSeatClick = useCallback((seatNumber) => {
    const currentSelected = selectedSeatsRef.current;
    
    if (!currentSelected.includes(seatNumber) && currentSelected.length >= 10) {
        toast.error("Maximum 10 seats can be selected");
        return;
    }
    
    const price = show?.price || 0;
    dispatch(toggleSeat({ seatId: seatNumber, price }));

  }, [dispatch, show]); 

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
    stopPolling(); 

    try {
      const holdRes = await axios.post(
        `${API}/bookings/hold`,
        { showId: showId, seatNumbers: selectedSeats },
        { headers: { Authorization: token } }
      );

      const { lockIds } = holdRes.data;

      const confirmRes = await axios.post(
        `${API}/bookings/confirm`,
        { showId: showId, lockIds: lockIds, payment_method: "mock" },
        { headers: { Authorization: token } }
      );

      toast.success("Booking confirmed!");
      navigate(`/booking-confirmation/${confirmRes.data.id}`);

    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
          toast.error("Some selected seats were just taken. Screen refreshed.");
          fetchSeatStatus();
      } else {
          toast.error(err.response?.data?.error || "Booking failed");
      }
      startPolling(); 
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <div className="text-gray-400 mb-4">Show information not available.</div>
        <button onClick={() => navigate(-1)} className="text-yellow-500 hover:text-yellow-400">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
        
      {/* Background Blur */}
      {show.movie?.posterUrl && (
          <div className="absolute inset-0 z-0 opacity-10 blur-3xl pointer-events-none">
              <img src={show.movie.posterUrl} alt="" className="w-full h-full object-cover" />
          </div>
      )}
      
      {/* HEADER */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between action-bar-glass sticky top-0">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-white/10 transition text-gray-300 hover:text-white"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">{show.movie?.title}</h2>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
                {show.theater?.name} • {show.show_time}
            </p>
        </div>
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* STAGE AREA */}
      <div className="flex-1 relative z-10 overflow-y-auto no-scrollbar pb-32">
        <div className="max-w-4xl mx-auto px-4 pt-10">
            
            {/* Screen */}
            <div className="mb-16 relative perspective-container">
                <div className="screen-glow mx-auto max-w-2xl bg-gradient-to-b from-white/20 to-transparent"></div>
                <p className="text-center text-xs text-gray-500 mt-4 tracking-[0.2em] font-medium uppercase">All eyes this way</p>
            </div>

            {/* Seats */}
            <div className="w-full overflow-x-auto no-scrollbar pb-12">
              <div className="min-w-[600px] flex flex-col items-center gap-4 seat-perspective origin-bottom">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-6 md:gap-8">
                    <span className="w-6 text-sm font-medium text-gray-500">{row}</span>
                    
                    {/* Left Bank */}
                    <div className="flex gap-2 md:gap-3">
                        {Array.from({ length: seatsPerRow / 2 }, (_, i) => {
                            const seatId = `${row}${i + 1}`;
                            return <SeatWrapper key={seatId} seatId={seatId} booked={bookedSeats} locked={lockedSeats} selected={selectedSeats} onSelect={handleSeatClick} />;
                        })}
                    </div>

                    {/* Aisle Spacer */}
                    <div className="w-4 md:w-8"></div>

                    {/* Right Bank */}
                    <div className="flex gap-2 md:gap-3">
                        {Array.from({ length: seatsPerRow / 2 }, (_, i) => {
                            const seatId = `${row}${i + 1 + (seatsPerRow/2)}`;
                            return <SeatWrapper key={seatId} seatId={seatId} booked={bookedSeats} locked={lockedSeats} selected={selectedSeats} onSelect={handleSeatClick} />;
                        })}
                    </div>

                    <span className="w-6 text-sm font-medium text-gray-500 text-right">{row}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center flex-wrap gap-6 md:gap-10 mt-16 pb-8">
                <LegendItem color="fill-zinc-800 stroke-zinc-600" label="Available" />
                <LegendItem color="fill-yellow-500 stroke-yellow-400" label="Selected" />
                <LegendItem color="fill-zinc-800/50 stroke-zinc-700 opacity-50" label="Sold" />
            </div>

        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 action-bar-glass pb-safe">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                  <div className="text-xs text-gray-400 mb-1">Total Price</div>
                  <div className="text-2xl font-bold text-white">₹{totalPrice}</div>
                  <div className="text-xs text-gray-500">{selectedSeats.length} seats selected</div>
              </div>
              
              <button
                  onClick={handleBooking}
                  disabled={booking || selectedSeats.length === 0}
                  className={`
                    px-8 py-3 rounded-xl font-bold text-black transition-all transform
                    ${selectedSeats.length > 0 
                        ? 'bg-yellow-500 hover:bg-yellow-400 shadow-[0_4px_20px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95' 
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                  `}
              >
                  {booking ? "Processing..." : "Confirm Seats"}
              </button>
          </div>
      </div>

    </div>
  );
};

// Helper Wrapper to keep clean main render
const SeatWrapper = ({ seatId, booked, locked, selected, onSelect }) => {
    const isBooked = booked.includes(seatId);
    const isLocked = locked.includes(seatId);
    const isSelected = selected.includes(seatId);
    
    let status = 'available';
    if (isBooked) status = 'booked';
    else if (isLocked) status = 'locked';

    return (
        <Seat
            seatNumber={seatId}
            status={status}
            isSelected={isSelected}
            onSelect={onSelect}
        />
    );
};

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-3">
        <svg width="20" height="20" viewBox="0 0 100 100" className={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M20 30 Q20 10 50 10 Q80 10 80 30 V60 H20 Z" strokeWidth="4" />
            <rect x="15" y="60" width="70" height="20" rx="5" strokeWidth="4" />
            <path d="M15 60 V75" strokeWidth="6" strokeLinecap="round" />
            <path d="M85 60 V75" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-gray-400 font-medium">{label}</span>
    </div>
);

export default SeatSelection;

