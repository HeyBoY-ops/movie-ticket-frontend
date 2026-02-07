import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  AlertCircle,
  Music3,
  Clock3,
  Sparkles,
  Ticket,
  ChevronRight,
  Info
} from "lucide-react";
import { toast } from "sonner";
import axios from "../api";

const Events = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ticketType, setTicketType] = useState("General");
  const [eventShow, setEventShow] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  const ticketPrice = ticketType === "VIP" ? 3500 : 1500;
  const maxTickets = 6;

  // ----------------------------------------------------------------
  // DATA: 11 Upcoming Events
  // ----------------------------------------------------------------
  const upcomingEvents = [
    {
      title: "Sunburn Arena Ft. Alan Walker - Mumbai",
      date: "Sat, 14 Dec 2024",
      time: "4:00 PM Onwards",
      venue: "Mahalaxmi Race Course: Mumbai",
      venueAddress: "Keshavrao Khadye Marg, Royal Western India Turf Club, Mahalakshmi, Mumbai, Maharashtra 400034",
      image: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1800&q=80",
      description: "Get ready for the biggest musical extravaganza of the year! Sunburn Arena brings you the legendary Alan Walker for a night of electrifying beats and unforgettable memories.",
      highlights: [
        { icon: Music3, label: "12+ International Artists" },
        { icon: Clock3, label: "8 Hours • Non-stop" },
        { icon: Sparkles, label: "Immersive Visual FX" },
      ],
      searchTerm: "Sunburn",
    },
    {
      title: "NH7 Weekender - Pune",
      date: "Fri, 20 Dec 2024",
      time: "2:00 PM Onwards",
      venue: "Mahalaxmi Lawns: Pune",
      venueAddress: "Mahalaxmi Lawns, Koregaon Park, Pune, Maharashtra 411001",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=80",
      description: "India's happiest music festival returns! Experience the best of indie, rock, and electronic music across multiple stages.",
      highlights: [
        { icon: Music3, label: "50+ Artists" },
        { icon: Clock3, label: "3 Days • Multi-stage" },
        { icon: Sparkles, label: "Food & Art Installations" },
      ],
      searchTerm: "NH7",
    },
    {
      title: "Coldplay: Music of the Spheres World Tour - Delhi",
      date: "Sat, 28 Dec 2024",
      time: "7:00 PM",
      venue: "Jawaharlal Nehru Stadium: Delhi",
      venueAddress: "Jawaharlal Nehru Stadium, Lodhi Road, New Delhi, Delhi 110003",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=80",
      description: "Coldplay brings their spectacular Music of the Spheres World Tour to India. A night of hits, lights, and unforgettable moments.",
      highlights: [
        { icon: Music3, label: "Coldplay Live" },
        { icon: Clock3, label: "2.5 Hours" },
        { icon: Sparkles, label: "Stunning Visuals" },
      ],
      searchTerm: "Coldplay",
    },
    {
      title: "Bollywood Night - Shah Rukh Khan Special - Mumbai",
      date: "Sun, 5 Jan 2025",
      time: "6:00 PM Onwards",
      venue: "Mumbai Metropolitan Region: Mumbai",
      venueAddress: "BKC Ground, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=80",
      description: "A star-studded Bollywood night featuring Shah Rukh Khan and special performances by top Bollywood artists.",
      highlights: [
        { icon: Music3, label: "SRK + 10+ Stars" },
        { icon: Clock3, label: "4 Hours" },
        { icon: Sparkles, label: "Bollywood Magic" },
      ],
      searchTerm: "Bollywood",
    },
    {
      title: "EDM Festival - Bangalore",
      date: "Sat, 11 Jan 2025",
      time: "5:00 PM Onwards",
      venue: "Palace Grounds: Bangalore",
      venueAddress: "Palace Grounds, Vasanth Nagar, Bangalore, Karnataka 560052",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1800&q=80",
      description: "Bangalore's biggest EDM festival featuring world-renowned DJs and producers. Get ready to dance the night away!",
      highlights: [
        { icon: Music3, label: "20+ DJs" },
        { icon: Clock3, label: "10 Hours" },
        { icon: Sparkles, label: "State-of-the-art Sound" },
      ],
      searchTerm: "EDM",
    },
    {
      title: "Jazz & Blues Festival - Goa",
      date: "Fri, 17 Jan 2025",
      time: "7:00 PM Onwards",
      venue: "Goa International Centre: Goa",
      venueAddress: "Goa International Centre, Dona Paula, Goa 403004",
      image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1800&q=80",
      description: "Experience the smooth sounds of jazz and blues in the beautiful setting of Goa. International and local artists come together.",
      highlights: [
        { icon: Music3, label: "15+ Jazz Artists" },
        { icon: Clock3, label: "5 Hours" },
        { icon: Sparkles, label: "Beachside Venue" },
      ],
      searchTerm: "Jazz",
    },
    {
      title: "Rock Fest India - Hyderabad",
      date: "Sat, 25 Jan 2025",
      time: "4:00 PM Onwards",
      venue: "HITEX Exhibition Centre: Hyderabad",
      venueAddress: "HITEX Exhibition Centre, Izzatnagar, Hyderabad, Telangana 500032",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=80",
      description: "India's premier rock music festival featuring the best rock bands from across the country and international headliners.",
      highlights: [
        { icon: Music3, label: "30+ Rock Bands" },
        { icon: Clock3, label: "8 Hours" },
        { icon: Sparkles, label: "High Energy" },
      ],
      searchTerm: "Rock",
    },
    {
      title: "Classical Music Evening - Chennai",
      date: "Sun, 2 Feb 2025",
      time: "6:30 PM",
      venue: "Music Academy: Chennai",
      venueAddress: "Music Academy, TTK Road, Chennai, Tamil Nadu 600014",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1800&q=80",
      description: "An evening of classical music featuring renowned maestros. Experience the rich heritage of Indian classical music.",
      highlights: [
        { icon: Music3, label: "5 Maestros" },
        { icon: Clock3, label: "3 Hours" },
        { icon: Sparkles, label: "Acoustic Excellence" },
      ],
      searchTerm: "Classical",
    },
    {
      title: "Hip Hop & Rap Showcase - Delhi",
      date: "Sat, 8 Feb 2025",
      time: "8:00 PM Onwards",
      venue: "DLF Cyber Hub: Delhi",
      venueAddress: "DLF Cyber Hub, DLF Cyber City, Gurgaon, Haryana 122002",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=80",
      description: "India's biggest hip hop and rap showcase featuring top artists from the underground and mainstream scenes.",
      highlights: [
        { icon: Music3, label: "25+ Rappers" },
        { icon: Clock3, label: "6 Hours" },
        { icon: Sparkles, label: "Urban Vibes" },
      ],
      searchTerm: "Hip Hop",
    },
    {
      title: "Folk & Fusion Festival - Rajasthan",
      date: "Fri, 14 Feb 2025",
      time: "6:00 PM Onwards",
      venue: "Jaisalmer Fort: Rajasthan",
      venueAddress: "Jaisalmer Fort, Jaisalmer, Rajasthan 345001",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=80",
      description: "Experience the rich folk traditions of Rajasthan blended with modern fusion. A unique cultural experience under the stars.",
      highlights: [
        { icon: Music3, label: "Folk Artists" },
        { icon: Clock3, label: "4 Hours" },
        { icon: Sparkles, label: "Fort Setting" },
      ],
      searchTerm: "Folk",
    },
    {
      title: "Electronic Music Night - Mumbai",
      date: "Sat, 22 Feb 2025",
      time: "9:00 PM Onwards",
      venue: "Kitty Su: Mumbai",
      venueAddress: "Kitty Su, The LaLiT Mumbai, Andheri East, Mumbai, Maharashtra 400069",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1800&q=80",
      description: "An exclusive electronic music night featuring international DJs and cutting-edge sound systems. The ultimate clubbing experience.",
      highlights: [
        { icon: Music3, label: "Top DJs" },
        { icon: Clock3, label: "Till Late" },
        { icon: Sparkles, label: "Premium Experience" },
      ],
      searchTerm: "Electronic",
    },
  ];

  const event = upcomingEvents[selectedEventIndex];

  // ----------------------------------------------------------------
  // HELPERS
  // ----------------------------------------------------------------
  const displayDate = eventShow?.showDate
    ? new Date(eventShow.showDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : event.date;

  const displayTime = eventShow?.showTime || event.time;

  const venueName = eventShow?.theater?.name
    ? `${eventShow.theater.name}, ${eventShow.theater.city}`
    : event.venue;

  const venueAddress = eventShow?.theater?.address
    ? `${eventShow.theater.address}, ${eventShow.theater.city}`
    : event.venueAddress;

  const mapQuery = eventShow?.theater?.name
    ? `${eventShow.theater.name} ${eventShow.theater.city}`
    : "Mahalaxmi Race Course Mumbai";

  const resolvedMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  const heroImage =
    eventShow?.movie?.posterUrl && eventShow.movie.posterUrl.trim().length > 0
      ? eventShow.movie.posterUrl
      : event.image;

  const ticketTiers = [
    {
      key: "General",
      title: "General Access",
      subtitle: "Standing arena",
      price: "₹1,500",
      color: "border-gray-500",
    },
    {
      key: "VIP",
      title: "VIP Access",
      subtitle: "Front row + F&B",
      price: "₹3,500",
      color: "border-amber-400",
    },
  ];

  const normalizeSeats = (seats) => {
    if (Array.isArray(seats)) return seats;
    if (seats && typeof seats === "object" && Array.isArray(seats.set)) {
      return seats.set;
    }
    return [];
  };

  // ----------------------------------------------------------------
  // EFFECTS: Fetch Show Details
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchEventShow = async () => {
      setShowLoading(true);
      try {
        const currentEvent = upcomingEvents[selectedEventIndex];
        const movieResponse = await axios.get(`/movies?search=${currentEvent.searchTerm}&category=EVENT`);
        const movieList = Array.isArray(movieResponse.data)
          ? movieResponse.data
          : movieResponse.data?.movies || [];

        const movie = movieList.find((m) =>
          m.title?.toLowerCase().includes(currentEvent.searchTerm.toLowerCase())
        );

        if (!movie) {
          // Mock data fallback
          setEventShow({
            id: `mock-${selectedEventIndex}`,
            movieId: `mock-movie-${selectedEventIndex}`,
            movie: {
              title: currentEvent.title,
              posterUrl: currentEvent.image,
            },
            theater: {
              name: currentEvent.venue.split(':')[0],
              city: currentEvent.venue.split(':')[1] || "Mumbai",
              address: currentEvent.venueAddress,
            },
            showDate: new Date(currentEvent.date),
            showTime: currentEvent.time,
            totalSeats: 5000,
            price: 1500,
            bookedSeats: [],
          });
          setShowLoading(false);
          return;
        }

        const showResponse = await axios.get(`/shows?movie_id=${movie.id}`);
        const showsList = Array.isArray(showResponse.data) ? showResponse.data : [];

        let show = showsList.find((s) => {
          const matchesMovie =
            s.movie_id === movie.id ||
            s.movie?.id === movie.id ||
            s.movie?.title?.toLowerCase().includes(currentEvent.searchTerm.toLowerCase());

          const bookedCount = normalizeSeats(s.bookedSeats || []).length;
          const hasAvailability = bookedCount < (s.totalSeats || 5000);

          return matchesMovie && hasAvailability;
        });

        if (!show && showsList.length > 0) {
          show = showsList.find(
            (s) =>
              s.movie_id === movie.id ||
              s.movie?.id === movie.id ||
              s.movie?.title?.toLowerCase().includes(currentEvent.searchTerm.toLowerCase())
          );
        }

        if (!show) {
          setEventShow(null);
          return;
        }

        setEventShow({
          ...show,
          bookedSeats: normalizeSeats(show.bookedSeats || []),
        });
      } catch (err) {
        console.error("Error fetching event show:", err);
        setEventShow(null);
      } finally {
        setShowLoading(false);
      }
    };

    fetchEventShow();
  }, [selectedEventIndex]);

  // ----------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------
  const handleMapClick = () => {
    window.open(resolvedMapLink, "_blank", "noopener,noreferrer");
  };

  const generateSeatCode = (type, taken) => {
    let attempts = 0;
    let seat;
    do {
      const suffix = Math.floor(Math.random() * 90 + 10);
      seat = `${type === "VIP" ? "V" : "GA"}-${suffix}`;
      attempts += 1;
    } while (taken.has(seat) && attempts < 100);

    if (taken.has(seat)) {
      seat = `${type === "VIP" ? "V" : "GA"}-${taken.size + 1}`;
    }

    return seat;
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to reserve tickets");
      navigate("/login");
      return;
    }

    if (showLoading) {
      toast.error("Fetching event availability. Please wait.");
      return;
    }

    if (!eventShow || !eventShow.id) {
      toast.error("Event tickets are currently unavailable.");
      return;
    }

    if (ticketQuantity < 1 || ticketQuantity > maxTickets) {
      toast.error(`Please select between 1 and ${maxTickets} tickets`);
      return;
    }

    setLoading(true);
    try {
      const currentSeats = normalizeSeats(eventShow.bookedSeats || []);
      const taken = new Set(currentSeats);
      const seatsToBook = [];

      for (let i = 0; i < ticketQuantity; i += 1) {
        const seatCode = generateSeatCode(ticketType, taken);
        taken.add(seatCode);
        seatsToBook.push(seatCode);
      }

      const totalAmount = ticketPrice * ticketQuantity;


      const currentEvent = upcomingEvents[selectedEventIndex];
      const venueParts = currentEvent.venue.split(':');
      const venueName = venueParts[0].trim();
      const venueCity = venueParts[1]?.trim() || "Mumbai";

      // Uniform booking flow for both new (mock) and existing events
      // The backend /bookings/event endpoint handles find-or-create logic for Movie/Show
      try {
        const response = await axios.post("/bookings/event", {
          event_title: currentEvent.title,
          event_description: currentEvent.description,
          event_image: currentEvent.image,
          event_date: currentEvent.date,
          event_time: currentEvent.time,
          venue_name: venueName,
          venue_city: venueCity,
          venue_address: currentEvent.venueAddress,
          seats: seatsToBook,
          payment_method: "mock",
          total_amount: totalAmount,
        });

        if (!response.data || !response.data.id) throw new Error("Invalid booking response");

        toast.success(`Booking confirmed for ${seatsToBook.length} tickets!`);

        setEventShow((prev) => prev ? {
             ...prev,
             id: response.data.showId || prev.id, // Ensure we keep ID or update it
             bookedSeats: [...currentSeats, ...seatsToBook],
           } : prev
        );
        navigate(`/booking-confirmation/${response.data.id}`);
      } catch (apiError) {
        throw apiError;
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      
      {/* 1. HERO SECTION (Selected Event) */}
      <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Overlay */}
        <div 
           className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
           style={{ backgroundImage: `url('${heroImage}')` }}
        >
           <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-20 md:pb-32">
           <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
              
              {/* Text Info */}
              <div className="max-w-2xl space-y-6 animate-fade-in-up">
                 <div className="flex items-center gap-2 text-red-500 font-bold tracking-widest uppercase text-xs">
                     <Sparkles className="w-4 h-4" />
                     <span>Premium Experience</span>
                 </div>
                 
                 <h1 className="text-4xl md:text-7xl font-bold leading-[0.9]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {event.title}
                 </h1>

                 {/* Icons Row */}
                 <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-5 h-5 text-red-500" />
                       <span className="font-medium text-white">{displayDate}</span>
                       <span className="text-gray-500">|</span>
                       <span>{displayTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <MapPin className="w-5 h-5 text-red-500" />
                       <span className="font-medium text-white">{venueName}</span>
                    </div>
                 </div>

                 {/* Highlights Pills */}
                 <div className="flex flex-wrap gap-3">
                    {event.highlights.map((h, i) => (
                      <div key={i} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs flex items-center gap-2">
                         <h.icon className="w-3 h-3 text-gray-400" />
                         {h.label}
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT COLUMN: Details */}
            <div className="lg:col-span-2 space-y-16">
               
               {/* About */}
               <section>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                     <Info className="w-6 h-6 text-red-500" />
                     About the Event
                  </h3>
                  <p className="text-lg text-gray-400 leading-relaxed">
                     {event.description}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                     {[1,2].map(i => (
                        <div key={i} className="h-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                           <img src={`https://source.unsplash.com/random/800x600?concert,party&sig=${i+selectedEventIndex}`} alt="Vibe" className="w-full h-full object-cover hover:scale-110 transition duration-700" />
                        </div>
                     ))}
                  </div>
               </section>

               {/* Lineup */}
               <section>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                     <Music3 className="w-6 h-6 text-red-500" />
                     Artist Lineup
                  </h3>
                  <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                     {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[140px] text-center group">
                           <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-red-500 transition mb-4">
                              <img src={`https://i.pravatar.cc/150?img=${i + 15}`} alt="Artist" className="w-full h-full object-cover" />
                           </div>
                           <p className="font-bold">DJ Artist {i}</p>
                           <p className="text-xs text-gray-500">Techno / House</p>
                        </div>
                     ))}
                  </div>
               </section>
               
               {/* Terms */}
               <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6">
                  <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                     <AlertCircle className="w-5 h-5" /> Important Info
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                     <li>• Age Limit: 18+ for VIP areas, 16+ for General Access.</li>
                     <li>• Valid government ID required for entry.</li>
                     <li>• No refund policy applies.</li>
                  </ul>
               </div>

            </div>

            {/* RIGHT COLUMN: Sticky Booking Card */}
            <div className="lg:col-span-1">
               <div className="sticky top-28 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-bold">Book Tickets</h3>
                     {eventShow ? (
                        <span className="text-xs font-bold px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-500/30">
                           AVAILABLE
                        </span>
                     ) : (
                        <span className="text-xs font-bold px-2 py-1 bg-red-900/30 text-red-400 rounded border border-red-500/30">
                           SOLD OUT
                        </span>
                     )}
                  </div>

                  {/* Date/Time Row */}
                  <div className="flex gap-4 mb-6 border-b border-white/5 pb-6">
                      <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                         <p className="text-xs text-gray-500 uppercase">Date</p>
                         <p className="font-bold">{displayDate.split(',')[0]} (Today)</p>
                      </div>
                      <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
                         <p className="text-xs text-gray-500 uppercase">Time</p>
                         <p className="font-bold">{displayTime.split(' ')[0]}</p>
                      </div>
                  </div>

                  {/* Tiers */}
                  <div className="space-y-3 mb-8">
                     {ticketTiers.map((tier) => (
                        <div 
                           key={tier.key}
                           onClick={() => setTicketType(tier.key)}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                              ticketType === tier.key 
                              ? `bg-white/10 ${tier.color} shadow-lg` 
                              : "border-white/5 bg-black hover:border-white/20"
                           }`}
                        >
                           <div>
                              <p className="font-bold text-sm">{tier.title}</p>
                              <p className="text-[10px] text-gray-400">{tier.subtitle}</p>
                           </div>
                           <p className="font-bold font-mono">{tier.price}</p>
                        </div>
                     ))}
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-between items-center mb-8">
                     <p className="text-sm text-gray-400">Quantity</p>
                     <div className="flex items-center gap-3 bg-black rounded-lg p-1 border border-white/10">
                        <button 
                           onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                           className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                        >
                           -
                        </button>
                        <span className="w-4 text-center font-bold text-sm">{ticketQuantity}</span>
                        <button 
                           onClick={() => setTicketQuantity(Math.min(maxTickets, ticketQuantity + 1))}
                           className="w-8 h-8 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                        >
                           +
                        </button>
                     </div>
                  </div>

                  {/* Total & Action */}
                  <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Amount</span>
                        <span className="font-bold text-xl">₹{(ticketPrice * ticketQuantity).toLocaleString()}</span>
                     </div>
                     <button
                        onClick={handleBooking}
                        disabled={loading || !eventShow}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                     >
                        {loading ? "Processing..." : "Confirm Booking"}
                     </button>
                     <p className="text-[10px] text-center text-gray-500">
                        By booking, you agree to the Terms & Conditions.
                     </p>
                  </div>

               </div>
            </div>
         </div>

         {/* 3. DISCOVER MORE EVENTS */}
         <div className="pt-20 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: "Cormorant Garamond, serif" }}>
               Discover More Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingEvents.map((evt, idx) => (
                   <div 
                      key={idx}
                      onClick={() => {
                         setSelectedEventIndex(idx);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`group cursor-pointer rounded-2xl overflow-hidden border border-white/5 bg-[#101010] hover:border-red-500/50 transition-all duration-300 ${
                         selectedEventIndex === idx ? 'ring-2 ring-red-500' : ''
                      }`}
                   >
                      <div className="relative aspect-[4/3] overflow-hidden">
                         <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                         <div className="absolute bottom-4 left-4 right-4">
                            <h4 className="font-bold text-sm leading-tight mb-1 truncate">{evt.title}</h4>
                            <p className="text-xs text-gray-400">{evt.venue.split(':')[0]}</p>
                         </div>
                      </div>
                      <div className="p-4 flex justify-between items-center bg-[#101010]">
                         <span className="text-xs text-red-400 font-bold">{evt.date}</span>
                         <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition" />
                      </div>
                   </div>
                ))}
            </div>
         </div>

      </div>
    </div>
  );
};

export default Events;
