import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../api";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { search } = useOutletContext();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API}/movies`);
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (error) {
        console.error("Failed to load movies", error);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    if (!search) return movies;
    const term = search.toLowerCase();
    return movies.filter((movie) =>
      movie.title?.toLowerCase().includes(term)
    );
  }, [movies, search]);

  const heroMovies = useMemo(() => {
    const source = filteredMovies.length ? filteredMovies : movies;
    return source.slice(0, 3);
  }, [filteredMovies, movies]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    setHeroIndex(0);
  }, [heroMovies.length]);

  useEffect(() => {
    if (!heroMovies.length) return;
    if (heroIndex >= heroMovies.length) {
      setHeroIndex(0);
    }
  }, [heroMovies.length, heroIndex]);

  useEffect(() => {
    if (heroMovies.length < 2) return undefined;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const heroMovie = heroMovies[heroIndex] || heroMovies[0];
  const heroImage =
    heroMovie?.backdrop_url ||
    heroMovie?.banner_url ||
    heroMovie?.poster_url ||
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80";
  const newThisWeek = filteredMovies.slice(0, 8);
  const trending = filteredMovies.slice(8, 16);
  const international = filteredMovies.slice(16, 24);
  const eventMovies = useMemo(() => {
    const events = movies.filter((movie) =>
      (Array.isArray(movie.genre) ? movie.genre : [])
        .map((g) => g?.toLowerCase())
        .some((g) => g && (g.includes("event") || g.includes("concert")))
    );
    return events.length ? events.slice(0, 8) : movies.slice(0, 8);
  }, [movies]);

  const handleTrailer = (movie) => {
    if (!movie) return;
    const trailerUrl = movie.trailer_url?.trim();
    const url =
      trailerUrl && trailerUrl.startsWith("http")
        ? trailerUrl
        : `https://www.youtube.com/results?search_query=${encodeURIComponent(
          `${movie.title} trailer`
        )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const renderRow = (title, list, ctaLink = "/movies") => {
    if (!list.length) return null;
    return (
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-2xl font-semibold tracking-wide">{title}</h2>
          <Link
            to={ctaLink}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            View all
          </Link>
        </div>
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto px-4 pb-2 netflix-scroll">
            {list.map((movie) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="flex-shrink-0 w-48 h-64 rounded-lg overflow-hidden bg-zinc-900 border border-white/5 hover:border-white/20 transition"
              >
                <img
                  src={
                    movie.poster_url ||
                    "https://via.placeholder.com/300x450?text=No+Poster"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white">
      {/* HERO */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {heroMovie && (
          <>
            <img
              src={heroImage}
              alt={heroMovie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-transparent to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-16 space-y-6 max-w-2xl transition-all duration-700">
              <p className="uppercase text-red-500 tracking-[0.5em] text-xs">
                Featured
              </p>
              <h1 className="text-5xl sm:text-6xl font-black drop-shadow-xl">
                {heroMovie.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-200 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {heroMovie.rating || "N/A"}
                </span>
                <span>{heroMovie.language}</span>
                <span>{heroMovie.duration} min</span>
              </div>
              <p className="text-lg text-gray-200 line-clamp-3">
                {heroMovie.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={heroMovie ? `/movies/${heroMovie.id}` : "/movies"}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition"
                >
                  <Play className="w-5 h-5" /> Play
                </Link>
                <button
                  type="button"
                  onClick={() => handleTrailer(heroMovie)}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-md font-semibold hover:bg-white/30 transition"
                >
                  <Info className="w-5 h-5" /> Watch Trailer
                </button>
              </div>
              {heroMovies.length > 1 && (
                <div className="absolute bottom-10 right-10 flex gap-2">
                  {heroMovies.map((movie, idx) => (
                    <button
                      key={movie.id || idx}
                      onClick={() => setHeroIndex(idx)}
                      className={`w-3 h-3 rounded-full transition ${idx === heroIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/60"
                        }`}
                      aria-label={`Show ${movie.title}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {heroMovies.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                <button
                  className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2 border border-white/20 transition"
                  onClick={() =>
                    setHeroIndex((prev) =>
                      prev === 0 ? heroMovies.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous featured title"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2 border border-white/20 transition"
                  onClick={() =>
                    setHeroIndex((prev) => (prev + 1) % heroMovies.length)
                  }
                  aria-label="Next featured title"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <main className="-mt-24 relative z-20 bg-gradient-to-b from-[#010101]/80 via-[#010101] to-black pt-10 pb-20">
        {heroMovie && (
          <div className="px-6 lg:px-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-gray-300 uppercase tracking-[0.3em]">
                Because you watched
              </h2>
              {!user && (
                <Link
                  to="/signup"
                  className="text-sm text-white border border-white/40 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
                >
                  Join now
                </Link>
              )}
            </div>
            <div className="mt-4 flex gap-4 text-sm text-gray-400">
              {Array.isArray(heroMovie.genre) &&
                heroMovie.genre.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/10"
                  >
                    {genre}
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="mt-10 space-y-10">
          {renderRow("New this week", newThisWeek)}
          {renderRow("Trending Now", trending)}
          {renderRow("International Hits", international)}
          {renderRow("Live Events & Concerts", eventMovies, "/events")}
        </div>
      </main>
    </div>
  );
}
