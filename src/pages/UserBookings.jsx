
import { useState, useEffect } from "react";
import axios from "../api";
import { Link } from "react-router-dom";
import { format, isValid } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  XCircle, 
  Film, 
  QrCode, 
  Search,
  ChevronRight,
  Ticket
} from "lucide-react";
import { toast } from "sonner";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // 'upcoming', 'past', 'cancelled'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQrBooking, setSelectedQrBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/bookings");
      
      // Sort: Newest first. Handle missing dates safely.
      const sorted = data.sort((a, b) => {
         const dateA = a.show?.showDate ? new Date(a.show.showDate) : new Date(0);
         const dateB = b.show?.showDate ? new Date(b.show.showDate) : new Date(0);
         return dateB - dateA;
      });
      setBookings(sorted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket? This action cannot be undone.")) return;

    try {
      await axios.post(`/bookings/${bookingId}/cancel`);
      toast.success("Ticket cancelled successfully.");
      fetchBookings(); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to cancel booking");
    }
  };

  // Robust helper to determine status
  const getBookingState = (booking) => {
    if (booking.bookingStatus === 'cancelled') return 'cancelled';
    
    // Safety check: if fields missing, default to upcoming so user can see it
    const show = booking.show || {};
    const dateStr = show.showDate || show.show_date;
    
    if (!dateStr) return 'upcoming'; 

    const showDate = new Date(dateStr);
    if (!isValid(showDate)) return 'upcoming';

    const now = new Date();
    // Compare dates (end of day)
    showDate.setHours(23, 59, 59); 
    
    return showDate < now ? 'past' : 'upcoming';
  };

  const filteredBookings = bookings.filter(booking => {
     // 1. Status Filter
     const state = getBookingState(booking);
     
     if (filter === 'cancelled' && state !== 'cancelled') return false;
     
     // For 'past', we want confirmed past bookings
     if (filter === 'past' && (state !== 'past' || booking.bookingStatus === 'cancelled')) return false;
     
     // For 'upcoming', we want confirmed upcoming bookings
     if (filter === 'upcoming' && (state !== 'upcoming' || booking.bookingStatus === 'cancelled')) return false;

     // 2. Search Filter
     if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const title = (booking.show?.movie?.title || "").toLowerCase();
        const theater = (booking.show?.theater?.name || "").toLowerCase();
        return title.includes(query) || theater.includes(query);
     }

     return true;
  });

  const getStats = () => {
    const total = bookings.length;
    // Count carefully to avoid crash
    const upcoming = bookings.filter(b => {
        try {
            return getBookingState(b) === 'upcoming' && b.bookingStatus !== 'cancelled';
        } catch { return false; }
    }).length;
    return { total, upcoming };
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-[#050505] flex justify-center items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pt-24 pb-20 relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E50914] opacity-5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 opacity-5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in-up">
            <div>
                <h1 className="text-4xl font-bold font-serif mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">My Bookings</h1>
                <p className="text-gray-400 flex items-center gap-2">
                    You have <span className="text-[#E50914] font-semibold">{getStats().upcoming} upcoming</span> shows.
                </p>
            </div>
            <Link to="/">
                <button className="px-6 py-3 bg-[#E50914] hover:bg-[#b20710] text-white rounded-xl font-medium shadow-[0_4px_20px_rgba(229,9,20,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                    <Ticket className="w-5 h-5" /> Book New Ticket
                </button>
            </Link>
        </div>

        {/* Controls: Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-30 bg-[#050505]/80 backdrop-blur-xl p-4 -mx-4 md:mx-0 md:p-0 md:bg-transparent md:backdrop-filter-none border-b border-white/10 md:border-none animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Search */}
            <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search movie or theater..." 
                    className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#121212] p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
                {['upcoming', 'past', 'cancelled'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                            filter === f 
                            ? 'bg-white text-black shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Grid */}
        {filteredBookings.length === 0 ? (
            <div className="text-center py-24 bg-[#121212] rounded-3xl border border-white/5 animate-fade-in-up">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Film className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No {filter} bookings found</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">Looks like you haven't booked any shows yet. Why not explore what's playing?</p>
                <Link to="/">
                    <button className="text-[#E50914] hover:text-white font-medium flex items-center gap-2 mx-auto transition-colors">
                        Browse Movies <ChevronRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {filteredBookings.map((booking, idx) => (
                    <BookingCard 
                        key={booking.id} 
                        booking={booking} 
                        index={idx}
                        onCancel={() => handleCancel(booking.id)}
                        onShowQr={() => setSelectedQrBooking(booking)}
                    />
                ))}
            </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQrBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#121212] border border-white/10 rounded-3xl max-w-sm w-full p-8 relative shadow-2xl animate-scale-in">
                <button 
                    onClick={() => setSelectedQrBooking(null)}
                    className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition"
                >
                    <XCircle className="w-6 h-6 text-gray-400" />
                </button>

                <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-1">{selectedQrBooking.show?.movie?.title || "Event / Movie"}</h3>
                    <p className="text-gray-400 text-sm mb-6">Scan this QR code at the venue</p>
                    
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto relative overflow-hidden group mb-6">
                        <QrCode className="w-48 h-48 text-black" />
                        <div className="absolute w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] top-0 left-0 animate-[scan_2s_ease-in-out_infinite]" />
                    </div>

                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Booking ID</p>
                    <p className="font-mono text-[#E50914] bg-[#E50914]/10 py-2 px-4 rounded-lg inline-block border border-[#E50914]/20">
                        {selectedQrBooking.id.slice(-8).toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, index, onCancel, onShowQr }) {
  // Defensive checks for all accessed properties
  const show = booking.show || {};
  const movie = show.movie || {};
  const theater = show.theater || {};
  const bookingStatus = booking.bookingStatus;
  
  // Safe helpers
  const getVal = (obj, k1, k2) => obj?.[k1] || obj?.[k2];
  const showDateVal = getVal(show, 'showDate', 'show_date');
  let showTimeVal = getVal(show, 'showTime', 'show_time') || "TBD";
  const posterUrl = getVal(movie, 'posterUrl', 'poster_url');
  const title = movie.title || "Unknown Title";
  const theaterName = theater.name || "Unknown Venue";
  const theaterCity = theater.city || "City";
  const seats = booking.seats || [];
  const totalAmount = booking.totalAmount || 0;
  
  // Date Formatting
  let formattedDate = "Date TBD";
  let isPast = false;
  let isCancellable = false;

  try {
      if (showDateVal) {
        const showDate = new Date(showDateVal);
        if (isValid(showDate)) {
            formattedDate = format(showDate, "MMM d, yyyy");
            
            // Logic for past/cancellable
            const now = new Date();
            let combinedDate = new Date(showDateVal);
            // Try parsing time if exists
            if (showTimeVal && showTimeVal !== "TBD") {
                const [time, modifier] = showTimeVal.split(' ');
                if (time && modifier) {
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') hours = '00';
                    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
                    combinedDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);
                }
            } else {
                // If TBD time, just use end of day for past check
                combinedDate.setHours(23, 59, 59);
            }

            const diffMs = combinedDate - now;
            const diffHours = diffMs / (1000 * 60 * 60);
            
            isCancellable = bookingStatus !== 'cancelled' && diffHours >= 2;
            isPast = diffHours < 0;
        }
      } else {
          // No date = upcoming event usually
          isCancellable = bookingStatus !== 'cancelled'; 
      }
  } catch (e) {
      console.error("Date parsing error", e);
  }

  return (
    <div 
        className="group relative bg-[#121212] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex flex-col h-full"
    >
        {/* Poster Background Blur */}
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity duration-700"
            style={{ 
                backgroundImage: `url(${posterUrl})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                filter: 'blur(20px)'
            }} 
        />
        
        <div className="relative z-10 flex flex-col h-full bg-gradient-to-b from-[#121212]/80 to-[#121212] p-5">
            {/* Top Row: Poster & Basic Info */}
            <div className="flex gap-4 mb-4">
                <div className="w-20 h-28 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0">
                    <img 
                        src={posterUrl || "/placeholder-movie.jpg"} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                </div>
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-white truncate pr-2 group-hover:text-[#E50914] transition-colors">{title}</h3>
                        {/* Status Badge */}
                        {bookingStatus === 'cancelled' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/20">CANCELLED</span>
                        ) : isPast ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-700 text-gray-300">ENDED</span>
                        ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500 border border-green-500/20">CONFIRMED</span>
                        )}
                    </div>
                    <p className="text-gray-400 text-xs mb-3 truncate">{theaterName}, {theaterCity}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs">
                         <div className="flex items-center gap-1 text-gray-300 bg-white/5 px-2 py-1 rounded-md">
                            <Calendar className="w-3 h-3 text-[#E50914]" /> {formattedDate}
                         </div>
                         <div className="flex items-center gap-1 text-gray-300 bg-white/5 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 text-[#E50914]" /> {showTimeVal}
                         </div>
                    </div>
                </div>
            </div>

            {/* Dashed Line */}
            <div className="border-b border-dashed border-white/10 my-2 relative">
                 <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] rounded-full" />
                 <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#050505] rounded-full" />
            </div>

            {/* Bottom Details */}
            <div className="pt-2 space-y-3 flex-1">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Seats</span>
                    <span className="font-mono font-medium text-white">{seats.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">Order Total</span>
                    <span className="font-bold text-[#E50914]">₹{totalAmount}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-5">
                <button 
                    onClick={onShowQr}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5"
                >
                    <QrCode className="w-4 h-4" /> View QR
                </button>
                
                {bookingStatus === 'cancelled' || isPast ? (
                     <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800/50 text-gray-500 text-sm font-medium cursor-not-allowed border border-white/5">
                        <XCircle className="w-4 h-4" /> {bookingStatus === 'cancelled' ? 'Cancelled' : 'Completed'}
                     </button>
                ) : (
                    <button 
                        onClick={onCancel}
                        disabled={!isCancellable}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                            isCancellable 
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20' 
                            : 'bg-gray-800/50 text-gray-600 border-white/5 cursor-not-allowed'
                        }`}
                    >
                        <XCircle className="w-4 h-4" /> Cancel
                    </button>
                )}
            </div>
        </div>
    </div>
  );
}
