import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Music3,
  Clock3,
  Sparkles,
  Ticket,
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

  // 11 upcoming events (including the original Sunburn event)
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

  const displayDate = eventShow?.show_date
    ? new Date(eventShow.show_date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : event.date;

  const displayTime = eventShow?.show_time || event.time;

  const venueName = eventShow?.theater?.name
    ? `${eventShow.theater.name}, ${eventShow.theater.city}`
    : event.venue;

  const venueAddress = eventShow?.theater?.address
    ? `${eventShow.theater.address}, ${eventShow.theater.city}`
    : event.venueAddress;

  const mapQuery = eventShow?.theater?.name
    ? `${eventShow.theater.name} ${eventShow.theater.city}`
    : "Mahalaxmi Race Course Mumbai";

  const resolvedMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapQuery
  )}`;

  const heroImage =
    eventShow?.movie?.poster_url && eventShow.movie.poster_url.trim().length > 0
      ? eventShow.movie.poster_url
      : event.image;

  const ticketTiers = [
    {
      key: "General",
      title: "General Access",
      subtitle: "Standing arena",
      price: "₹1,500",
    },
    {
      key: "VIP",
      title: "VIP Access",
      subtitle: "Front row + F&B",
      price: "₹3,500",
    },
  ];

  const normalizeSeats = (seats) => {
    if (Array.isArray(seats)) return seats;
    if (seats && typeof seats === "object" && Array.isArray(seats.set)) {
      return seats.set;
    }
    return [];
  };

  const extractShow = (payload) => {
    if (Array.isArray(payload)) return payload[0];
    if (Array.isArray(payload?.shows)) return payload.shows[0];
    return null;
  };

  useEffect(() => {
    const fetchEventShow = async () => {
      setShowLoading(true);
      try {
        const currentEvent = upcomingEvents[selectedEventIndex];
        // Search for the event movie
        const movieResponse = await axios.get(`/movies?search=${currentEvent.searchTerm}`);
        // Handle new API response format: { movies: [], total, page, totalPages }
        const movieList = Array.isArray(movieResponse.data)
          ? movieResponse.data
          : movieResponse.data?.movies || [];

        // Find movie matching the event
        const movie = movieList.find((m) =>
          m.title?.toLowerCase().includes(currentEvent.searchTerm.toLowerCase())
        );

        if (!movie) {
          // For demo purposes, create a mock show if movie not found
          // In production, you'd want to seed all events
          console.warn(`Event movie not found for ${currentEvent.title}. Using mock data.`);
          setEventShow({
            id: `mock-${selectedEventIndex}`,
            movie_id: `mock-movie-${selectedEventIndex}`,
            movie: {
              title: currentEvent.title,
              poster_url: currentEvent.image,
            },
            theater: {
              name: currentEvent.venue.split(':')[0],
              city: currentEvent.venue.split(':')[1] || "Mumbai",
              address: currentEvent.venueAddress,
            },
            show_date: new Date(currentEvent.date),
            show_time: currentEvent.time,
            total_seats: 5000,
            price: 1500,
            booked_seats: [],
          });
          setShowLoading(false);
          return;
        }

        // Fetch shows for this movie
        const showResponse = await axios.get(`/shows?movie_id=${movie.id}`);
        // Shows endpoint returns array directly
        const showsList = Array.isArray(showResponse.data)
          ? showResponse.data
          : [];

        // Find the first available show for this event
        let show = showsList.find((s) => {
          // Match by movie_id or nested movie object
          const matchesMovie =
            s.movie_id === movie.id ||
            s.movie?.id === movie.id ||
            s.movie?.title?.toLowerCase().includes(currentEvent.searchTerm.toLowerCase());

          // Prefer shows that haven't sold out (optional check)
          const bookedCount = normalizeSeats(s.booked_seats || []).length;
          const hasAvailability = bookedCount < (s.total_seats || 5000);

          return matchesMovie && hasAvailability;
        });

        // If no show found, try to get any show for this movie
        if (!show && showsList.length > 0) {
          show = showsList.find(
            (s) =>
              s.movie_id === movie.id ||
              s.movie?.id === movie.id ||
              s.movie?.title?.toLowerCase().includes(currentEvent.searchTerm.toLowerCase())
          );
        }

        if (!show) {
          console.warn(`No scheduled show found for ${currentEvent.title}`);
          setEventShow(null);
          return;
        }

        // Normalize booked_seats and set the show
        setEventShow({
          ...show,
          booked_seats: normalizeSeats(show.booked_seats || []),
        });
      } catch (err) {
        console.error("Error fetching event show:", err);
        toast.error("Unable to load event availability. Please try again later.");
        setEventShow(null);
      } finally {
        setShowLoading(false);
      }
    };

    fetchEventShow();
  }, [selectedEventIndex]);

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

    // Validate ticket quantity
    if (ticketQuantity < 1 || ticketQuantity > maxTickets) {
      toast.error(`Please select between 1 and ${maxTickets} tickets`);
      return;
    }

    setLoading(true);
    try {
      const currentSeats = normalizeSeats(eventShow.booked_seats || []);
      const taken = new Set(currentSeats);
      const seatsToBook = [];

      // Generate unique seat codes
      for (let i = 0; i < ticketQuantity; i += 1) {
        const seatCode = generateSeatCode(ticketType, taken);
        taken.add(seatCode);
        seatsToBook.push(seatCode);
      }

      // Calculate total amount
      const totalAmount = ticketPrice * ticketQuantity;

      console.log("Creating booking:", {
        show_id: eventShow.id,
        seats: seatsToBook,
        payment_method: "mock",
        total_amount: totalAmount,
      });

      // Check if it's a mock show (for events not seeded in DB)
      if (eventShow.id && eventShow.id.startsWith("mock-")) {
        // Use the special event booking endpoint that creates everything
        const currentEvent = upcomingEvents[selectedEventIndex];
        const venueParts = currentEvent.venue.split(':');
        const venueName = venueParts[0].trim();
        const venueCity = venueParts[1]?.trim() || "Mumbai";

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

        if (!response.data || !response.data.id) {
          throw new Error("Invalid booking response");
        }

        toast.success(
          `Booking confirmed for ${seatsToBook.length} ${seatsToBook.length > 1 ? "tickets" : "ticket"}!`
        );

        // Update local state with new booked seats and real show ID
        setEventShow((prev) =>
          prev
            ? {
              ...prev,
              id: response.data.show_id,
              booked_seats: [...currentSeats, ...seatsToBook],
            }
            : prev
        );

        // Navigate to confirmation page with real booking ID
        navigate(`/booking-confirmation/${response.data.id}`);
        return;
      }

      // For real events, make API call
      try {
        const response = await axios.post("/bookings", {
          show_id: eventShow.id,
          seats: seatsToBook,
          payment_method: "mock",
          total_amount: totalAmount,
        });

        if (!response.data || !response.data.id) {
          throw new Error("Invalid booking response");
        }

        toast.success(
          `Booking confirmed for ${seatsToBook.length} ${seatsToBook.length > 1 ? "tickets" : "ticket"}!`
        );

        // Update local state with new booked seats
        setEventShow((prev) =>
          prev
            ? {
              ...prev,
              booked_seats: [...currentSeats, ...seatsToBook],
            }
            : prev
        );

        // Navigate to confirmation page
        navigate(`/booking-confirmation/${response.data.id}`);
        return; // Success, exit function
      } catch (apiError) {
        // If API call fails, check if it's a validation error or server error
        console.error("API booking error:", apiError);

        // If show doesn't exist in DB but we have eventShow, treat as mock
        if (apiError.response?.status === 404 || apiError.response?.status === 400) {
          console.warn("Show not found in database, treating as mock booking");
          const mockBookingId = `mock-booking-${Date.now()}`;

          toast.success(
            `Booking confirmed for ${seatsToBook.length} ${seatsToBook.length > 1 ? "tickets" : "ticket"}!`
          );

          setEventShow((prev) =>
            prev
              ? {
                ...prev,
                booked_seats: [...currentSeats, ...seatsToBook],
              }
              : prev
          );

          navigate(`/booking-confirmation/${mockBookingId}`);
        } else {
          // Re-throw to be caught by outer catch
          throw apiError;
        }
      }

      toast.success(
        `Booking confirmed for ${seatsToBook.length} ${seatsToBook.length > 1 ? "tickets" : "ticket"}!`
      );

      // Update local state with new booked seats
      setEventShow((prev) =>
        prev
          ? {
            ...prev,
            booked_seats: [...currentSeats, ...seatsToBook],
          }
          : prev
      );

      // Navigate to confirmation page
      navigate(`/booking-confirmation/${response.data.id}`);
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Booking failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-black text-white">
      {/* UPCOMING EVENTS LIST */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-red-500" style={{ fontFamily: "Cormorant Garamond, serif" }}>
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {upcomingEvents.map((evt, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedEventIndex(index);
                setTicketQuantity(1);
                setTicketType("General");
              }}
              className={`text-left p-4 rounded-xl border transition-all ${selectedEventIndex === index
                ? "border-red-500 bg-red-600/10 shadow-lg shadow-red-500/20"
                : "border-white/10 bg-black/40 hover:border-red-400/60"
                }`}
            >
              <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs text-gray-300 font-semibold truncate">{evt.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Calendar className="w-3 h-3" />
                <span>{evt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{evt.venue.split(':')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div
        className="relative h-[460px] w-full overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(125deg, rgba(0,0,0,0.85), rgba(0,0,0,0.4)), url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute -right-32 top-[-80px] h-96 w-96 rounded-full bg-red-600/30 blur-[120px]" />
          <div className="absolute -left-20 bottom-[-120px] h-72 w-72 rounded-full bg-red-500/20 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex items-end pb-10">
          <div className="flex flex-col md:flex-row gap-8 md:items-end w-full">
            <div className="space-y-5 flex-1">
              <p className="uppercase tracking-[0.4em] text-xs text-red-300">
                Event of the season
              </p>
              <h1
                className="text-4xl md:text-6xl font-bold leading-tight"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-400" />
                  {displayDate} • {displayTime}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  {venueName}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                {event.highlights.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="px-4 py-2 rounded-full border border-white/15 text-sm text-gray-200 flex items-center gap-2 bg-black/20 backdrop-blur"
                  >
                    <Icon className="w-4 h-4 text-red-400" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 max-w-xs">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
                Scan & join
              </p>
              <div className="mt-3 w-32 h-32 rounded-2xl bg-white p-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(event.title)}`}
                  alt="QR code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Use the QR to access event FAQs & travel guide.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-12">

          {/* ABOUT */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-3">About the Event</h2>
            <p className="leading-relaxed text-lg text-gray-300">
              {event.description}
            </p>
            <p className="leading-relaxed mt-4 text-gray-300">
              Join thousands of fans as we celebrate music, life, and unity.
              Featuring state-of-the-art production, immersive visuals, and a lineup that will keep you dancing all night long.
            </p>
          </section>

          {/* ARTIST LINEUP (Mock) */}
          <section>
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-500 pl-3">Artist Lineup</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[150px] text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-3 overflow-hidden border-2 border-red-500/50 bg-zinc-800">
                    <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Artist" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold">DJ Name {i}</h3>
                  <p className="text-xs text-gray-400">Electronic</p>
                </div>
              ))}
            </div>
          </section>

          {/* VENUE */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-3">Venue Details</h2>
            <div className="p-6 rounded-2xl border flex gap-4 items-start bg-black/40 border-white/10">
              <MapPin className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">{venueName}</h3>
                <p className="mt-1 text-gray-400">{venueAddress}</p>
                <button
                  onClick={handleMapClick}
                  className="mt-4 text-sm text-red-400 hover:text-red-200 underline underline-offset-4 transition"
                >
                  View on Map
                </button>
              </div>
            </div>
          </section>

          {/* TERMS */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-3">Terms & Conditions</h2>
            <ul className="space-y-3">
              {[
                "Age Limit: 15+",
                "Internet handling fee per ticket may be levied. Please check your total amount before payment.",
                "Tickets once booked cannot be exchanged or refunded.",
                "We recommend that you arrive at least 20 minutes prior at the venue to pick up your physical tickets.",
              ].map((term, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-400">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  {term}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* RIGHT SIDEBAR (BOOKING CARD) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10">
            <h3 className="text-2xl font-bold mb-2">Book Tickets</h3>
            <p className="text-sm mb-6 text-gray-400">
              {showLoading
                ? "Checking availability..."
                : eventShow
                  ? "Select your preferred category"
                  : "Currently unavailable"}
            </p>

            <div className="space-y-4 mb-8">
              {ticketTiers.map((tier) => (
                <button
                  key={tier.key}
                  onClick={() => setTicketType(tier.key)}
                  disabled={!eventShow}
                  className={`w-full text-left p-4 rounded-2xl border transition flex justify-between items-center ${ticketType === tier.key
                    ? "bg-red-600/15 border-red-400 shadow-[0_0_20px_rgba(229,9,20,0.25)]"
                    : "bg-black/40 border-white/10 hover:border-red-400/60"
                    } ${!eventShow ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                >
                  <div>
                    <p className="font-semibold">{tier.title}</p>
                    <p className="text-xs text-gray-400">{tier.subtitle}</p>
                  </div>
                  <p className="font-bold text-red-400">{tier.price}</p>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-2">
                Quantity
              </p>
              <div className="flex gap-2">
                {Array.from({ length: maxTickets }, (_, idx) => idx + 1).map(
                  (qty) => (
                    <button
                      key={qty}
                      onClick={() => setTicketQuantity(qty)}
                      disabled={!eventShow}
                      className={`w-10 h-10 rounded-lg border text-sm font-semibold transition ${ticketQuantity === qty
                        ? "bg-red-600/20 border-red-500 text-red-300"
                        : "border-white/10 text-gray-400 hover:border-red-400/60"
                        } ${!eventShow ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {qty}
                    </button>
                  )
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {eventShow
                  ? `₹${ticketPrice * ticketQuantity} total`
                  : "Tickets unavailable"}
              </p>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading || showLoading || !eventShow}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-500/30 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Proceed to Pay"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3 h-3 text-green-500" /> 100% Secure
              Payment
            </div>
            {!eventShow && !showLoading && (
              <p className="text-xs text-center text-red-400 mt-4">
                Tickets are currently unavailable. Please check back later.
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Events;
