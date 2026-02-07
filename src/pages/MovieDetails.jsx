import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";
import { Star, Clock, Calendar, MapPin, Play } from "lucide-react";
import { toast } from "sonner";

import { useOutletContext } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location } = useOutletContext(); // Get location from Layout

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const defaultTheme = useMemo(
    () => ({
      primary: "#facc15",
      accent: "#fde047",
      badgeBg: "rgba(250, 204, 21, 0.15)",
      badgeBorder: "rgba(250, 204, 21, 0.35)",
      buttonShadow: "0 0 25px rgba(250, 204, 21, 0.35)",
      tint: "rgba(250, 204, 21, 0.15)",
      textOnPrimary: "#0f0f0f",
    }),
    []
  );
  const [theme, setTheme] = useState(defaultTheme);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMovieDetails();
    fetchShows();
  }, [id]);

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex.length === 3 ? cleanHex.repeat(2) : cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (val) => val.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const adjustColor = (hex, amount) => {
    const { r, g, b } = hexToRgb(hex);
    const clamp = (value) => Math.max(0, Math.min(255, value));
    return rgbToHex(clamp(r + amount), clamp(g + amount), clamp(b + amount));
  };

  const rgba = (hex, alpha) => {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const extractDominantColor = (imageUrl) =>
    new Promise((resolve) => {
      if (!imageUrl) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src =
        imageUrl + (imageUrl.includes("?") ? "&" : "?") + "palette=" + Date.now();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });
        const width = (canvas.width = 50);
        const height = (canvas.height = 50);
        context.drawImage(img, 0, 0, width, height);
        const data = context.getImageData(0, 0, width, height).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 20) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }
        if (count === 0) {
          resolve(null);
          return;
        }
        resolve(rgbToHex(Math.round(r / count), Math.round(g / count), Math.round(b / count)));
      };
      img.onerror = () => resolve(null);
    });

  const fetchMovieDetails = async () => {
    try {
      const res = await axios.get(`${API}/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      const res = await axios.get(`${API}/shows?movie_id=${id}`);
      setShows(res.data || []);

      if (res.data?.length > 0) {
        setSelectedDate(new Date(res.data[0].showDate).toDateString());
      }
    } catch (err) {
      toast.error("Failed to load shows");
    }
  };

  const handleShowClick = (showId) => {
    if (!token) {
      toast.error("Please login to book tickets");
      navigate("/login");
      return;
    }
    navigate(`/shows/${showId}/seats`);
  };

  // Filter shows by selected city FIRST
  const cityShows = shows.filter(
    (s) => s.theater?.city === (location.city || "Mumbai")
  );

  const uniqueDates = [
    ...new Set(cityShows.map((s) => new Date(s.showDate).toDateString())),
  ].sort((a, b) => new Date(a) - new Date(b));

  const filteredShows = cityShows.filter(
    (s) => new Date(s.showDate).toDateString() === selectedDate
  );

  const showsByTheater = filteredShows.reduce((acc, show) => {
    const tid = show.theater?.id;
    if (!acc[tid]) acc[tid] = { theater: show.theater, shows: [] };
    acc[tid].shows.push(show);
    return acc;
  }, {});

  const formatTimeRange = (timeStr, duration) => {
    if (!timeStr || !duration) return timeStr;
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + duration * 60000);
    
    return `${timeStr} - ${endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  };

  useEffect(() => {
    let mounted = true;
    if (!movie?.posterUrl) return;

    extractDominantColor(movie.posterUrl).then((color) => {
      if (!mounted || !color) {
        setTheme(defaultTheme);
        return;
      }
      const accent = adjustColor(color, 25);
      const badgeBg = rgba(color, 0.18);
      const badgeBorder = rgba(color, 0.4);
      const tint = rgba(color, 0.2);
      const { r, g, b } = hexToRgb(color);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const textOnPrimary = brightness > 180 ? "#0f0f0f" : "#ffffff";
      setTheme({
        primary: color,
        accent,
        badgeBg,
        badgeBorder,
        buttonShadow: `0 0 25px ${rgba(color, 0.45)}`,
        tint,
        textOnPrimary,
      });
    });

    return () => {
      mounted = false;
    };
  }, [movie?.posterUrl, defaultTheme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex justify-center items-center">
        <div className="loading"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex justify-center items-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white"
      data-testid="movie-details-page"
    >
      {/* HERO BANNER */}
      <div className="relative h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-[14px] brightness-[0.3]"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div
          className="absolute inset-0 mix-blend-screen opacity-70"
          style={{ background: `radial-gradient(circle, ${theme.tint}, transparent 65%)` }}
        />

        {/* CONTENT */}
        <div className="relative max-w-7xl mx-auto h-full px-4 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-10 items-end">
            {/* POSTER */}
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-64 h-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] object-cover"
            />

            {/* DETAILS */}
            <div className="pb-4">
              <h1
                className="text-5xl font-bold mb-4 drop-shadow-[0_0_15px_rgba(0,0,0,0.45)]"
                style={{ fontFamily: "Cormorant Garamond, serif", color: theme.primary }}
              >
                {movie.title}
              </h1>

              {/* Rating / Duration / Language */}
              <div className="flex flex-wrap gap-5 text-lg mb-4">
                <span className="flex items-center gap-2">
                  <Star
                    className="w-6 h-6"
                    style={{ color: theme.primary, fill: theme.primary }}
                  />
                  <span className="font-semibold">{movie.rating}/10</span>
                </span>

                <span className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  {movie.duration} min
                </span>

                <span
                  className="px-4 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: theme.badgeBg,
                    color: theme.primary,
                    border: `1px solid ${theme.badgeBorder}`,
                  }}
                >
                  {movie.language}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-3 mb-4">
                {movie.genre && Array.isArray(movie.genre) && movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-4 py-2 rounded-full bg-zinc-900/70 border border-zinc-700 text-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Trailer */}
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 inline-flex items-center gap-2 rounded-xl font-semibold hover:scale-[1.03] transition"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.textOnPrimary,
                    boxShadow: theme.buttonShadow,
                  }}
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT MOVIE */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-zinc-900/70 p-8 rounded-2xl border border-zinc-800 mb-10">
          <h2
            className="text-3xl font-bold mb-4 drop-shadow-[0_0_12px_rgba(0,0,0,0.3)]"
            style={{ fontFamily: "Cormorant Garamond, serif", color: theme.primary }}
          >
            About the Movie
          </h2>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {movie.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-sm text-gray-400">Director</h3>
              <p className="text-lg">{movie.director || "Unknown"}</p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400">Cast</h3>
              <p className="text-lg">
                {movie.cast && Array.isArray(movie.cast)
                  ? movie.cast.join(", ")
                  : "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-400">Release Date</h3>
              <p className="text-lg">
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* SHOW TIMES */}
        <div className="bg-zinc-900/70 p-8 rounded-2xl border border-zinc-800">
          <h2
            className="text-3xl font-bold mb-6 drop-shadow-[0_0_12px_rgba(0,0,0,0.3)]"
            style={{ fontFamily: "Cormorant Garamond, serif", color: theme.primary }}
          >
            Book Tickets
          </h2>

          {uniqueDates.length > 0 ? (
            <>
              {/* DATE SELECTOR */}
              <div className="flex gap-4 overflow-x-auto pb-3 mb-8">
                {uniqueDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                      selectedDate === date
                        ? "font-semibold shadow-lg"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                    style={
                      selectedDate === date
                        ? {
                            backgroundColor: theme.primary,
                            color: theme.textOnPrimary,
                            boxShadow: theme.buttonShadow,
                          }
                        : undefined
                    }
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>

              {/* SHOW TIMES BY THEATER */}
              <div className="space-y-8">
                {Object.values(showsByTheater).map((item) => (
                  <div
                    key={item.theater?.id}
                    className="bg-zinc-900/60 border border-zinc-700 p-6 rounded-2xl"
                  >
                    <div className="flex items-start gap-3 mb-5">
                      <MapPin className="w-6 h-6 mt-1" style={{ color: theme.primary }} />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.theater?.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {item.theater?.address}, {item.theater?.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {item.shows.map((show) => (
                        <button
                          key={show.id}
                          onClick={() => handleShowClick(show.id)}
                          className="px-6 py-3 rounded-xl bg-zinc-900 border transition shadow-md hover:scale-[1.01]"
                          style={{
                            borderColor: theme.badgeBorder,
                            backgroundColor: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <div className="text-lg font-semibold">
                            {formatTimeRange(show.showTime, movie.duration)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {show.availableSeats || show.totalSeats} seats • ₹{show.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No shows available for this movie yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
