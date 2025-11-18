import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../api";
import { Search, Filter, Star, ChevronLeft, ChevronRight } from "lucide-react";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    language: "",
    sort_by: "release_date",
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.language) params.append("language", filters.language);
      params.append("sort_by", filters.sort_by);
      params.append("page", filters.page);
      params.append("limit", 12);

      const response = await axios.get(`${API}/movies?${params.toString()}`);
      setMovies(response.data.movies || []);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-black text-white pt-24 pb-10 transition-colors duration-500"
      data-testid="movies-page"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* PAGE TITLE */}
        <h1
          className="text-5xl font-bold mb-10 text-yellow-500 drop-shadow-[0_0_10px_rgba(255,200,0,0.4)]"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Browse Movies
        </h1>

        {/* FILTERS CONTAINER */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl mb-14 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-12 py-3 w-full rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
              />
            </div>

            {/* Genre */}
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
              className="py-3 px-4 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            {/* Language */}
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              className="py-3 px-4 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Languages</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange("sort_by", e.target.value)}
              className="py-3 px-4 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white focus:ring-2 focus:ring-yellow-500"
            >
              <option value="release_date">Release Date</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
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
              {movies.map((movie) => (
                <Link to={`/movies/${movie.id}`} key={movie.id}>
                  <div className="relative rounded-2xl overflow-hidden group shadow-[0_0_25px_rgba(255,200,0,0.05)] hover:shadow-[0_0_35px_rgba(255,200,0,0.25)] transition">
                    {/* POSTER */}
                    <img
                      src={movie.poster_url}
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
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          {movie.rating}
                        </span>
                        <span className="text-gray-200">{movie.language}</span>
                        <span className="text-gray-200">
                          {movie.duration} min
                        </span>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2">
                        {(movie.genre || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs"
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
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <span className="text-gray-300 text-lg">
                  Page {filters.page} / {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="px-4 py-2 rounded-xl bg-zinc-800/60 border border-zinc-700 disabled:opacity-50"
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
