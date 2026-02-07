import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "../api";
import { Filter, Star, ChevronLeft, ChevronRight, Play, Plus, Info } from "lucide-react";
import { MovieCardSkeleton } from "../components/MovieCardSkeleton";

const Movies = () => {
  const { search } = useOutletContext();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    language: "",
    sort_by: "releaseDate",
    page: 1,
  });
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12; // Increased slightly for grid

  const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"];
  const languages = ["English", "Hindi", "Tamil", "Telugu", "Malayalam"];

  // Sync global search to local filters
  useEffect(() => {
    if (search !== filters.search) {
      setFilters((prev) => ({ ...prev, search: search, page: 1 }));
    }
  }, [search]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: filters.page,
          limit: pageSize,
          search: filters.search,
          genre: filters.genre,
          language: filters.language,
          sort_by: filters.sort_by,
          category: "MOVIE",
        }).toString();

        const response = await axios.get(`/movies?${queryParams}`);
        setMovies(response.data?.movies || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      
      {/* 1. Header / Filter Bar */}
      <div className="sticky top-[64px] z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-6 px-4 md:px-16 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
             Explore Movies
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
             <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 mr-2">
                <Filter className="w-4 h-4 text-red-600" />
                Refine
             </div>

             {/* Genre Dropdown */}
             <select
                value={filters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-red-600 focus:bg-white/10 transition cursor-pointer appearance-none hover:bg-white/10"
             >
                <option value="" className="bg-[#121212]">All Genres</option>
                {genres.map(g => <option key={g} value={g} className="bg-[#121212]">{g}</option>)}
             </select>

             {/* Language Dropdown */}
             <select
                value={filters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-red-600 focus:bg-white/10 transition cursor-pointer appearance-none hover:bg-white/10"
             >
                <option value="" className="bg-[#121212]">All Languages</option>
                {languages.map(l => <option key={l} value={l} className="bg-[#121212]">{l}</option>)}
             </select>

             {/* Sort Dropdown */}
             <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange("sort_by", e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-full px-4 py-2 outline-none focus:border-red-600 focus:bg-white/10 transition cursor-pointer appearance-none hover:bg-white/10"
             >
               <option value="releaseDate" className="bg-[#121212]">Newest First</option>
               <option value="rating" className="bg-[#121212]">Top Rated</option>
               <option value="title" className="bg-[#121212]">A-Z</option>
             </select>
          </div>
        </div>
      </div>

      {/* 2. Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-16 pt-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {movies.map((movie) => (
                <Link 
                  to={`/movies/${movie.id}`} 
                  key={movie.id}
                  className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900 border border-white/5 shadow-lg hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-500 hover:scale-[1.02] hover:z-10"
                >
                  <img
                    src={movie.posterUrl || "https://placehold.co/300x450?text=No+Poster"}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="font-bold text-white text-lg leading-tight mb-1">{movie.title}</h3>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-300 mb-3 font-medium">
                              <span className="text-green-400">{movie.rating ? `${Math.round(movie.rating * 10)}% Match` : "New"}</span>
                              <span>{movie.duration} min</span>
                              <span className="border border-white/20 px-1 rounded text-[10px]">HD</span>
                          </div>

                          <div className="flex gap-2">
                             <button className="flex-1 bg-white text-black py-2 rounded font-bold text-xs hover:bg-gray-200 transition flex items-center justify-center gap-1">
                                <Play className="w-3 h-3 fill-black" /> Play
                             </button>
                             <button className="p-2 border border-gray-400 rounded-full hover:border-white hover:bg-white/10 transition">
                                <Plus className="w-4 h-4 text-white" />
                             </button>
                          </div>
                      </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="mt-16 flex justify-center items-center gap-4">
                 <button
                   onClick={() => handlePageChange(filters.page - 1)}
                   disabled={filters.page === 1}
                   className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 
                 <div className="text-sm font-medium text-gray-400">
                    Page <span className="text-white mx-1">{filters.page}</span> of {totalPages}
                 </div>

                 <button
                   onClick={() => handlePageChange(filters.page + 1)}
                   disabled={filters.page === totalPages}
                   className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
                 >
                   <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                 <Filter className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
            <button 
                onClick={() => setFilters({search: "", genre: "", language: "", sort_by: "releaseDate", page: 1})}
                className="mt-6 text-red-500 hover:text-red-400 text-sm font-semibold hover:underline"
            >
                Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
