// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Navbar from "../components/Navbar";

// export default function Home() {
//   const { user } = useContext(AuthContext);

//   const [movies, setMovies] = useState([]);
//   const [search, setSearch] = useState("");
//   const [darkMode, setDarkMode] = useState(true);
//   const [location, setLocation] = useState({ state: "", city: "" });

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const res = await fetch("http://localhost:5050/api/movies");
//         const data = await res.json();
//         setMovies(data);
//       } catch (err) {
//         console.error("Error fetching movies:", err);
//       }
//     };
//     fetchMovies();
//   }, []);

//   const filteredMovies = movies.filter((movie) =>
//     movie.title.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div
//       className={`min-h-screen ${
//         darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"
//       } transition-colors duration-500`}
//     >
//       <Navbar
//         darkMode={darkMode}
//         toggleTheme={() => setDarkMode((p) => !p)}
//         search={search}
//         setSearch={setSearch}
//         location={location}
//         setLocation={setLocation}
//       />

//       {/* Movies */}
//       <div className="flex flex-col items-center px-4 py-10">
//         {filteredMovies.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredMovies.map((movie) => (
//               <div
//                 key={movie.id}
//                 className={`rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 ${
//                   darkMode ? "bg-zinc-900" : "bg-white"
//                 }`}
//               >
//                 <img
//                   src={movie.poster_url}
//                   alt={movie.title}
//                   className="w-full h-72 object-cover"
//                 />
//                 <div className="p-4">
//                   <h2 className="text-xl font-semibold mb-1">
//                     {movie.title}
//                   </h2>
//                   <p className="text-sm text-gray-400 mb-2">{movie.genre}</p>
//                   <button className="bg-[#ff004c] w-full py-2 rounded-lg font-semibold hover:bg-[#e60045] transition">
//                     Book Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 mt-10">No movies found 🎥</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Star, Calendar, TrendingUp } from "lucide-react";

export default function Home() {
  const { user } = useContext(AuthContext);

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [location, setLocation] = useState({ state: "", city: "" });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/movies");
        const data = await res.json();
        setMovies(data.movies || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#0a0a1a] text-white" : "bg-gray-100 text-gray-900"
      } transition-colors duration-500`}
    >
      <Navbar
        darkMode={darkMode}
        toggleTheme={() => setDarkMode((p) => !p)}
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
      />

      {/* HERO SECTION */}
      <div className="relative h-[600px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-[#0f0c29]"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-yellow-400"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Experience Cinema <br /> Like Never Before
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Book your favorite movies instantly. Choose your seats, select
            showtimes, and enjoy the magic of cinema.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/movies">
              <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
                Browse Movies
              </button>
            </Link>

            <Link to="/signup">
              <button className="border border-yellow-500 px-6 py-3 rounded-xl hover:bg-yellow-600 hover:text-black transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2
          className="text-4xl font-bold text-center mb-12 text-yellow-400"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className={`p-8 rounded-2xl text-center shadow-lg ${
              darkMode ? "bg-[#131327]" : "bg-white"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
            <p className="text-gray-400">
              Select your movie, choose your seats, and book instantly.
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl text-center shadow-lg ${
              darkMode ? "bg-[#131327]" : "bg-white"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Experience</h3>
            <p className="text-gray-400">
              Smooth booking with real-time seat updates.
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl text-center shadow-lg ${
              darkMode ? "bg-[#131327]" : "bg-white"
            }`}
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Latest Movies</h3>
            <p className="text-gray-400">
              Access the newest blockbusters & timeless classics.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURED MOVIES */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-4xl font-bold text-yellow-400"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Featured Movies
          </h2>

          <Link to="/movies">
            <button className="border border-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 hover:text-black transition">
              View All
            </button>
          </Link>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <Link to={`/movies/${movie.id}`} key={movie.id}>
                <div
                  className={`relative rounded-2xl overflow-hidden shadow-xl h-96 group ${
                    darkMode ? "bg-[#131327]" : "bg-white"
                  }`}
                >
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4 rounded-2xl">
                    <h3 className="text-xl font-bold mb-1">{movie.title}</h3>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {movie.rating}
                      </span>
                      <span>{movie.language}</span>
                      <span>{movie.duration} min</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {Array.isArray(movie.genre)
                        ? movie.genre.slice(0, 2).map((g) => (
                            <span
                              key={g}
                              className="px-3 py-1 bg-yellow-500/20 rounded-full text-xs"
                            >
                              {g}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg mt-10">
            No movies available.
          </p>
        )}
      </div>

      {/* CTA SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div
          className={`p-12 rounded-3xl shadow-lg ${
            darkMode ? "bg-[#131327]" : "bg-white"
          }`}
        >
          <h2
            className="text-4xl font-bold mb-4 text-yellow-400"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Ready to Book Your Next Movie?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of movie lovers who trust MovieDay.
          </p>

          <Link to="/signup">
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition">
              Sign Up Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
