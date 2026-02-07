import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Play, Info, Star, ChevronLeft, ChevronRight, Check, Plus, ThumbsUp } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api";

const CATEGORIES = ["All", "Movies", "TV Shows", "Sports", "Events"];

export default function Home() {
  const { user } = useContext(AuthContext);
  const { search } = useOutletContext();
  const [movies, setMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroIndex, setHeroIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get("/movies");
        setMovies(data.movies || []);
      } catch (error) {
        console.error("Failed to load movies", error);
      }
    };
    fetchMovies();
  }, []);

  // --- SCROLL LISTENER ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- FILTERING ---
  const filteredMovies = useMemo(() => {
    let result = movies;
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((m) => m.title?.toLowerCase().includes(term));
    }
    if (activeCategory !== "All") {
      // Simple genre matching for demo purposes
      if (activeCategory === "Movies") result = result.filter(m => !m.genre?.includes("Event"));
      if (activeCategory === "Events") result = result.filter(m => m.genre?.includes("Event") || m.genre?.includes("Concert"));
      // Add more logic as needed
    }
    return result;
  }, [movies, search, activeCategory]);

  // --- HERO LOGIC ---
  const heroMovies = useMemo(() => movies.slice(0, 5), [movies]);
  
  useEffect(() => {
    if (heroMovies.length < 2) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const heroMovie = heroMovies[heroIndex];

  // --- RENDER HELPERS ---
  const renderHero = () => {
    if (!heroMovie) return null;
    const bgImage = heroMovie.backdropUrl || heroMovie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80";

    return (
      <header className="relative h-[90vh] w-full overflow-hidden group">
        {/* Background Image with Crossfade Support (Conceptual) */}
        <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
             <img src={bgImage} alt={heroMovie.title} className="w-full h-full object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-[20s]" />
        </div>
        
        {/* Radiant Gradient Overlays for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_120%)]" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-16 max-w-3xl space-y-6 pt-20">
             {/* Text Animation Wrapper */}
             <div key={heroMovie.id} className="animate-fade-in-up space-y-6">
                <div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl leading-[1.1]">
                        {heroMovie.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-4 text-gray-300 font-medium text-sm md:text-base">
                        <span className="text-green-400 font-bold">
                            {heroMovie.rating ? `${Math.round(heroMovie.rating * 10)}% Match` : "New"}
                        </span>
                        <span>{new Date(heroMovie.release_date).getFullYear()}</span>
                        <span className="px-2 py-0.5 border border-gray-500 rounded text-xs bg-black/30 backdrop-blur-sm">HD</span>
                        <span>{heroMovie.duration} min</span>
                    </div>
                </div>

                <p className="text-lg text-gray-200 line-clamp-3 md:line-clamp-2 max-w-2xl leading-relaxed text-shadow">
                    {heroMovie.description}
                </p>

                <div className="flex flex-wrap gap-4">
                    <Link 
                        to={`/movies/${heroMovie.id}`}
                        className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-lg font-bold hover:bg-white/90 transition transform hover:scale-105"
                    >
                        <Play className="w-6 h-6 fill-black" /> Play
                    </Link>
                    <button className="flex items-center gap-3 bg-gray-500/30 backdrop-blur-md text-white px-8 py-3.5 rounded-lg font-bold hover:bg-gray-500/40 transition transform hover:scale-105">
                        <Info className="w-6 h-6" /> More Info
                    </button>
                </div>
             </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute right-8 bottom-1/3 flex flex-col gap-3 z-20">
            {heroMovies.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === heroIndex ? "bg-red-600 scale-125" : "bg-white/50 hover:bg-white"}`}
                />
            ))}
        </div>
      </header>
    );
  };

  const MovieCard = ({ movie }) => (
    <Link 
        to={`/movies/${movie.id}`}
        className="flex-shrink-0 w-40 md:w-56 aspect-[2/3] relative rounded-lg overflow-hidden bg-gray-800 border border-white/5 group transition-all duration-300 hover:z-20 hover:scale-110 hover:shadow-2xl hover:shadow-black/50"
    >
        <img 
            src={movie.posterUrl || "https://placehold.co/300x450?text=No+Poster"} 
            alt={movie.title} 
            className="w-full h-full object-cover" 
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
             <div className="flex gap-2 mb-3">
                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition">
                     <Play className="w-4 h-4 fill-black text-black" />
                 </div>
                 <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition">
                     <Plus className="w-4 h-4" />
                 </div>
                 <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition ml-auto">
                     <ChevronRight className="w-4 h-4" />
                 </div>
             </div>
             
             <h4 className="font-bold text-white text-sm leading-tight mb-1">{movie.title}</h4>
             <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium">
                 <span className="text-green-400">{movie.rating} Rating</span>
                 <span>{movie.duration}m</span>
             </div>
             <div className="flex gap-1 mt-2 flex-wrap">
                 {(Array.isArray(movie.genre) ? movie.genre : movie.genre?.split(',') || []).slice(0, 2).map((g, i) => (
                     <span key={i} className="text-[9px] text-gray-300">• {g}</span>
                 ))}
             </div>
        </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      {/* 1. HERO SECTION */}
      {renderHero()}

      <main className="relative z-10 -mt-24 space-y-12 pb-20">
        
        {/* 2. CATEGORY FILTER (Sticky) */}
        {/* 2. CATEGORY FILTER (Sticky) */}
        <div className={`sticky top-[64px] z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'py-4 bg-[#050505]/95 backdrop-blur-xl shadow-2xl shadow-black/50 border-b border-white/5' : 'py-6'}`}>
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-16">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                            activeCategory === cat 
                            ? "bg-white text-black" 
                            : "bg-black/40 backdrop-blur border border-white/30 text-white hover:bg-white/10"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* 3. MOVIE ROWS */}
        <section>
            <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-16 flex items-center gap-2 group cursor-pointer">
                Trending Now 
                <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline">Explore All &gt;</span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-8 px-4 md:px-16 netflix-scroll mask-right">
                {filteredMovies.slice(0, 10).map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
        </section>

        <section>
             <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-16">New Releases</h2>
             <div className="flex gap-4 overflow-x-auto pb-8 px-4 md:px-16 netflix-scroll mask-right">
                {filteredMovies.slice(5, 15).map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
        </section>

        <section>
             <h2 className="text-xl font-bold text-white mb-4 px-4 md:px-16">Top Rated Dramas</h2>
             <div className="flex gap-4 overflow-x-auto pb-8 px-4 md:px-16 netflix-scroll mask-right">
                {filteredMovies.filter(m => m.genre?.includes("Drama") || m.rating > 7).map(m => <MovieCard key={m.id} movie={m} />)}
            </div>
        </section>

      </main>
    </div>
  );
}

