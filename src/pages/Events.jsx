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
  const ticketPrice = ticketType === "VIP" ? 3500 : 1500;
  const maxTickets = 6;

  const event = {
    title: "Sunburn Arena Ft. Alan Walker - Mumbai",
    date: "Sat, 14 Dec 2024",
    time: "4:00 PM Onwards",
    venue: "Mahalaxmi Race Course: Mumbai",
    venueAddress:
      "Keshavrao Khadye Marg, Royal Western India Turf Club, Mahalakshmi, Mumbai, Maharashtra 400034",
    mapLink:
      "https://www.google.com/maps/search/?api=1&query=Mahalaxmi+Race+Course+Mumbai",
    image:
      "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?auto=format&fit=crop&w=1800&q=80",
    description:
      "Get ready for the biggest musical extravaganza of the year! Sunburn Arena brings you the legendary Alan Walker for a night of electrifying beats and unforgettable memories.",
    terms: [
      "Age Limit: 15+",
      "Internet handling fee per ticket may be levied. Please check your total amount before payment.",
      "Tickets once booked cannot be exchanged or refunded.",
      "We recommend that you arrive at least 20 minutes prior at the venue to pick up your physical tickets.",
    ],
    highlights: [
      { icon: Music3, label: "12+ International Artists" },
      { icon: Clock3, label: "8 Hours • Non-stop" },
      { icon: Sparkles, label: "Immersive Visual FX" },
    ],
  };

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
        const movieResponse = await axios.get("/movies?search=Sunburn");
        const movieList = Array.isArray(movieResponse.data)
          ? movieResponse.data
          : movieResponse.data?.movies || [];
        const movie = movieList.find((m) =>
          m.title?.toLowerCase().includes("sunburn")
        );
        if (!movie) {
          toast.error("Event movie data not found");
          setEventShow(null);
          return;
        }

        const showResponse = await axios.get(`/shows?movie_id=${movie.id}`);
        let show = extractShow(showResponse.data);

        if (!show) {
          const fallbackResponse = await axios.get("/shows");
          const showList = Array.isArray(fallbackResponse.data)
            ? fallbackResponse.data
            : fallbackResponse.data?.shows || [];
          show = showList.find(
            (s) =>
              s.movie_id === movie.id ||
              s.movie?.id === movie.id ||
              s.movie?.title?.toLowerCase().includes("sunburn")
          );
        }

        if (!show) {
          toast.error("No scheduled show found for this event");
        }
        setEventShow(
          show
            ? {
              ...show,
              booked_seats: normalizeSeats(show.booked_seats),
            }
            : null
        );
      } catch (err) {
        console.error(err);
        toast.error("Unable to load event availability");
        setEventShow(null);
      } finally {
        setShowLoading(false);
      }
    };

    fetchEventShow();
  }, []);

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

    if (!eventShow) {
      toast.error("Event tickets are currently unavailable.");
      return;
    }

    setLoading(true);
    try {
      const currentSeats = normalizeSeats(eventShow.booked_seats);
      const taken = new Set(currentSeats);
      const seatsToBook = [];
      for (let i = 0; i < ticketQuantity; i += 1) {
        const seatCode = generateSeatCode(ticketType, taken);
        taken.add(seatCode);
        seatsToBook.push(seatCode);
      }

      const response = await axios.post("/bookings", {
        show_id: eventShow.id,
        seats: seatsToBook,
        payment_method: "mock",
        total_amount: ticketPrice * ticketQuantity,
      });

      toast.success(
        `Booking confirmed for ${seatsToBook.length} ${seatsToBook.length > 1 ? "tickets" : "ticket"
        }!`
      );
      setEventShow((prev) =>
        prev
          ? {
            ...prev,
            booked_seats: [...currentSeats, ...seatsToBook],
          }
          : prev
      );
      navigate(`/booking-confirmation/${response.data.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-black text-white">
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
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SunburnArena"
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
              {event.terms.map((term, idx) => (
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
