import React, { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "../api"; // Use configured axios
import { Filter, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Movies = () => {
  const { search } = useOutletContext(); // Get global search

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    language: "",
    sort_by: "release_date",
    page: 1,
  });
  const pageSize = 12;

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];
  const languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam"];

  // Sync global search to local filters
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: search, page: 1 }));
  }, [search]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/movies?limit=200`);
        setMovies(response.data?.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    const safePage = Math.min(Math.max(newPage, 1), totalPages);
    setFilters({
      ...filters,
      page: safePage,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredMovies = useMemo(() => {
    const normalizeGenres = (value) => {
      if (!value) return [];
      if (Array.isArray(value))
        return value.map((g) => g?.toLowerCase()).filter(Boolean);
      if (typeof value === "string") {
        return value
          .split(",")
          .map((g) => g.trim().toLowerCase())
          .filter(Boolean);
      }
      return [];
    };

    let list = [...movies];
    if (filters.search?.trim()?.length) {
      const term = filters.search.toLowerCase();
      list = list.filter((movie) => movie.title?.toLowerCase().includes(term));
    }

    if (filters.genre) {
      const target = filters.genre.toLowerCase();
      list = list.filter((movie) =>
        normalizeGenres(movie.genre).includes(target)
      );
    }

    if (filters.language) {
      const lang = filters.language.toLowerCase();
      list = list.filter((movie) => movie.language?.toLowerCase() === lang);
    }

    list.sort((a, b) => {
      if (filters.sort_by === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (filters.sort_by === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      const dateA = new Date(a.release_date || a.created_at || 0);
      const dateB = new Date(b.release_date || b.created_at || 0);
      return dateB - dateA;
    });

    return list;
  }, [movies, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));
  const currentPage = Math.min(filters.page, totalPages);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div
      className="min-h-screen bg-black text-white pt-24 pb-10 transition-colors duration-500"
      data-testid="movies-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PAGE TITLE */}
        <div className="flex flex-col gap-3 mb-10">
          <h1
            className="text-5xl font-bold text-red-500 drop-shadow-[0_0_25px_rgba(229,9,20,0.35)]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Browse Movies
          </h1>
          <p className="text-gray-400 text-base">
            Dive into the catalogue and fine-tune by genre, language, and
            release.
          </p>
        </div>

        {/* FILTERS CONTAINER */}
        <div className="bg-gradient-to-br from-zinc-900/80 via-black/70 to-zinc-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl mb-14 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gray-500 mb-6">
            <Filter className="w-4 h-4 text-red-500" />
            Refine
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Genre",
                value: filters.genre,
                handler: (value) => handleFilterChange("genre", value),
                placeholder: "All Genres",
                options: genres,
              },
              {
                label: "Language",
                value: filters.language,
                handler: (value) => handleFilterChange("language", value),
                placeholder: "All Languages",
                options: languages,
              },
              {
                label: "Sort By",
                value: filters.sort_by,
                handler: (value) => handleFilterChange("sort_by", value),
                placeholder: "Release Date",
                options: [
                  { label: "Release Date", value: "release_date" },
                  { label: "Rating", value: "rating" },
                  { label: "Title", value: "title" },
                ],
                custom: true,
              },
            ].map((config) => (
              <div key={config.label} className="space-y-2 text-sm">
                <p className="text-gray-400 uppercase tracking-[0.2em]">
                  {config.label}
                </p>
                <select
                  value={config.value}
                  onChange={(e) => config.handler(e.target.value)}
                  className="py-3 px-4 rounded-xl bg-black/60 border border-white/10 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                >
                  <option value="">{config.placeholder}</option>
                  {(config.custom
                    ? config.options
                    : config.options.map((opt) => ({ label: opt, value: opt }))
                  ).map((option) => (
                    <option
                      key={typeof option === "string" ? option : option.value}
                      value={typeof option === "string" ? option : option.value}
                    >
                      {typeof option === "string" ? option : option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-400">
            {filters.genre && (
              <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-500/40 text-red-300">
                Genre: {filters.genre}
              </span>
            )}
            {filters.language && (
              <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-500/40 text-red-300">
                Language: {filters.language}
              </span>
            )}
            {!filters.genre && !filters.language && (
              <span className="px-3 py-1 rounded-full border border-white/10 text-gray-500">
                Showing all movies
              </span>
            )}
          </div>
        </div>

        {/* MOVIES GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loading"></div>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-14">
              {paginatedMovies.map((movie) => (
                <Link to={`/movies/${movie.id}`} key={movie.id}>
                  <div className="relative rounded-2xl overflow-hidden group shadow-[0_0_25px_rgba(229,9,20,0.15)] hover:shadow-[0_0_35px_rgba(229,9,20,0.35)] transition">
                    {/* POSTER */}
                    <img
                      src={
                        movie.poster_url ||
                        "https://via.placeholder.com/300x450"
                      }
                      alt={movie.title}
                      className="w-full h-[430px] object-cover rounded-2xl"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-5">
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        {movie.title}
                      </h3>

                      {/* Rating + Language + Duration */}
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span className="flex items-center gap-1 text-red-400">
                          <Star className="w-4 h-4 fill-red-500" />
                          {movie.rating || "N/A"}
                        </span>
                        <span className="text-gray-200">
                          {movie.language || "Unknown"}
                        </span>
                        <span className="text-gray-200">
                          {movie.duration ? `${movie.duration} min` : ""}
                        </span>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(movie.genre)
                          ? movie.genre
                          : [movie.genre]
                        )
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((g) => (
                            <span
                              key={g}
                              className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs"
                            >
                              {g}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 disabled:opacity-40 hover:border-red-500 transition"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <span className="text-gray-300 text-lg">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 disabled:opacity-40 hover:border-red-500 transition"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No movies found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
