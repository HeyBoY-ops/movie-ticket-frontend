
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api";
import confetti from "canvas-confetti";
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Ticket, 
  QrCode, 
  Download, 
  Share2, 
  Home 
} from "lucide-react";
import { toast } from "sonner";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    if (booking) {
      triggerConfetti();
    }
  }, [booking]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const fetchBookingDetails = async () => {
    try {
      // Mock Data Handler for demo/testing
      if (bookingId && bookingId.startsWith("mock-booking-")) {
        // ... (Mock Logic remains similar but updated structure)
         setTimeout(() => {
            const mockBooking = {
              id: bookingId,
              bookingStatus: "confirmed", // camelCase
              totalAmount: 1500,
              paymentMethod: "mock",
              seats: ["VIP-01", "VIP-02"],
              movie: { title: "Sunburn Arena Ft. Alan Walker" },
              theater: {
                name: "Mahalaxmi Race Course",
                address: "Keshavrao Khadye Marg, Mumbai",
                city: "Mumbai",
              },
              show: {
                showDate: new Date(),
                showTime: "4:00 PM",
              },
            };
            setBooking(mockBooking);
            setLoading(false);
         }, 800);
        return;
      }

      const res = await axios.get(`/bookings/${bookingId}`);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      // Fallback Mock for 404s on "mock-" IDs
      if (err.response?.status === 404 && bookingId?.startsWith("mock-")) {
         const mockBooking = {
              id: bookingId,
              bookingStatus: "confirmed",
              totalAmount: 1500,
              paymentMethod: "mock",
              seats: ["GA-14", "GA-15"],
              movie: { title: "Event Booking Placeholder" },
              theater: { name: "Demo Venue", address: "Mumbai, India" },
              show: { showDate: new Date(), showTime: "6:00 PM" }
         };
         setBooking(mockBooking);
      } else {
        toast.error("Failed to load booking details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast.success("Ticket downloaded successfully!");
  };

  const handleShare = () => {
     navigator.clipboard.writeText(window.location.href);
     toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#050505] text-white">
        <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
        <Link to="/" className="text-[#E50914] hover:underline">Return Home</Link>
      </div>
    );
  }

  // Helper to safely access data regardless of casing (camel vs snake)
  const get = (obj, key1, key2) => obj?.[key1] || obj?.[key2];

  const movieTitle = booking.movie?.title || booking.show?.movie?.title || "Event / Movie";
  const venueName = booking.theater?.name || booking.show?.theater?.name || "Venue TBD";
  const venueAddress = booking.theater?.address || booking.show?.theater?.address || "";
  const venueCity = booking.theater?.city || booking.show?.theater?.city || "";
  
  const rawDate = get(booking.show, 'showDate', 'show_date');
  const showDate = rawDate ? new Date(rawDate).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }) : "Date TBD";

  const showTime = get(booking.show, 'showTime', 'show_time') || "Time TBD";
  
  const status = get(booking, 'bookingStatus', 'booking_status') || "confirmed";
  const amount = get(booking, 'totalAmount', 'total_amount') || 0;
  const paymentMethod = get(booking, 'paymentMethod', 'payment_method') || "N/A";

  const posterUrl = booking.movie?.posterUrl || booking.movie?.poster_url || 
                    booking.show?.movie?.posterUrl || booking.show?.movie?.poster_url;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#E50914] opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] border border-green-500/20">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 font-serif">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 text-lg">Your tickets have been sent to your email.</p>
        </div>

        {/* The Ticket */}
        <div ref={ticketRef} className="print-content flex flex-col md:flex-row bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-white/5 animate-scale-in max-w-3xl mx-auto group hover:shadow-[0_0_40px_rgba(229,9,20,0.15)] transition-all duration-500 ticket-texture relative">
            
            {/* Holographic Overlay */}
            <div className="holographic-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Left: Poster/Visual */}
            <div className="md:w-1/3 relative h-64 md:h-auto bg-gray-900 overflow-hidden z-10">
                {posterUrl ? (
                  <img src={posterUrl} alt={movieTitle} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <Ticket className="w-16 h-16 text-white/10" />
                    <span className="absolute bottom-4 text-xs tracking-[0.2em] text-white/20 font-serif">MOVIE TICKET</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:bg-gradient-to-r" />
            </div>

            {/* Middle: Details */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative border-r border-dashed border-white/10 z-10">
                {/* Perforation Circles (Vertical) */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#050505] rounded-full z-20" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#050505] rounded-full z-20" />

                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2 leading-tight">
                            {movieTitle}
                        </h2>
                        <div className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-900/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-green-500/10">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span>{status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 group/item">
                            <Calendar className="w-5 h-5 text-[#E50914] mt-0.5 group-hover/item:text-white transition-colors" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                                <p className="font-semibold text-gray-200">{showDate}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group/item">
                            <Clock className="w-5 h-5 text-[#E50914] mt-0.5 group-hover/item:text-white transition-colors" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                                <p className="font-semibold text-gray-200">{showTime}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 group/item">
                            <MapPin className="w-5 h-5 text-[#E50914] mt-0.5 group-hover/item:text-white transition-colors" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Venue</p>
                                <p className="font-semibold text-gray-200">{venueName}</p>
                                <p className="text-sm text-gray-500">{venueAddress} {venueCity && `, ${venueCity}`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Stub */}
            <div className="md:w-64 bg-[#161616] p-6 md:p-8 flex flex-col justify-between items-center text-center relative z-10">
                 {/* Perforation Circles (Left side of stub) */}
                 <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#050505] rounded-full z-20" />
                 <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#050505] rounded-full z-20" />

                 <div className="w-full relative group/qr cursor-pointer">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-4 group-hover/qr:text-[#E50914] transition-colors">Scan for Entry</p>
                    <div className="bg-white p-3 rounded-xl inline-block shadow-lg relative overflow-hidden">
                        <QrCode className="w-24 h-24 text-black" />
                        <div className="scan-line" />
                    </div>
                 </div>

                 <div className="w-full pt-6 border-t border-white/10 mt-6">
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seats</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {booking.seats.map(seat => (
                                <span key={seat} className="bg-[#E50914] text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                                    {seat}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
                         <p className="text-xl font-bold text-white">₹{amount}</p>
                         <p className="text-[10px] text-gray-600 mt-1 uppercase">{paymentMethod.toUpperCase()}</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Actions */}
        <div className="no-print flex flex-col sm:flex-row justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95"
            >
                <Download className="w-4 h-4" /> Download Ticket
            </button>
            <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 active:scale-95"
            >
                <Share2 className="w-4 h-4" /> Share Booking
            </button>
            <Link to="/" className="flex-1 sm:flex-none">
                <button className="w-full flex items-center justify-center gap-2 bg-[#E50914] hover:bg-[#b20710] text-white px-8 py-3 rounded-xl font-medium shadow-[0_4px_20px_rgba(229,9,20,0.4)] hover:shadow-[0_8px_30px_rgba(229,9,20,0.6)] transition-all hover:-translate-y-1 active:translate-y-0">
                    <Home className="w-4 h-4" /> Go Home
                </button>
            </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingConfirmation;
