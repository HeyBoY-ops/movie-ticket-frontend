import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";
import { Star, Clock, Calendar, MapPin, Play } from "lucide-react";
import { toast } from "sonner";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMovieDetails();
    fetchShows();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      // ❗ FIXED — no `${API}`
      const res = await axios.get(`/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      // ❗ FIXED — no `${API}`
      const res = await axios.get(`/shows?movie_id=${id}`);
      setShows(res.data || []);

      if (res.data?.length > 0) {
        setSelectedDate(res.data[0].show_date);
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

  const uniqueDates = [...new Set(shows.map((s) => s.show_date))].sort();
  const filteredShows = shows.filter((s) => s.show_date === selectedDate);

  const showsByTheater = filteredShows.reduce((acc, show) => {
    const tid = show.theater?.id;
    if (!acc[tid]) acc[tid] = { theater: show.theater, shows: [] };
    acc[tid].shows.push(show);
    return acc;
  }, {});

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
          style={{ backgroundImage: `url(${movie.poster_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* CONTENT */}
        <div className="relative max-w-7xl mx-auto h-full px-4 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-10 items-end">
            {/* POSTER */}
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-64 h-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] object-cover"
            />

            {/* DETAILS */}
            <div className="pb-4">
              <h1
                className="text-5xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(255,200,0,0.4)] mb-4"
                style={{ fontFamily: "Cormorant Garamond, serif" }}
              >
                {movie.title}
              </h1>

              {/* Rating / Duration / Language */}
              <div className="flex flex-wrap gap-5 text-lg mb-4">
                <span className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{movie.rating}/10</span>
                </span>

                <span className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  {movie.duration} min
                </span>

                <span className="px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                  {movie.language}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-3 mb-4">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-4 py-2 rounded-full bg-zinc-900/70 border border-zinc-700 text-sm"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Trailer */}
              {movie.trailer_url && (
                <a
                  href={movie.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 inline-flex items-center gap-2 rounded-xl bg-yellow-500 text-black font-semibold shadow-[0_0_15px_rgba(255,200,0,0.5)] hover:scale-[1.03] transition"
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
            className="text-3xl font-bold text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(255,200,0,0.3)]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            About the Movie
          </h2>

          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {movie.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            {movie.director && (
              <div>
                <h3 className="text-sm text-gray-400">Director</h3>
                <p className="text-lg">{movie.director}</p>
              </div>
            )}

            {movie.cast?.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-400">Cast</h3>
                <p className="text-lg">{movie.cast.join(", ")}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm text-gray-400">Release Date</h3>
              <p className="text-lg">
                {new Date(movie.release_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* SHOW TIMES */}
        <div className="bg-zinc-900/70 p-8 rounded-2xl border border-zinc-800">
          <h2
            className="text-3xl font-bold text-yellow-500 mb-6 drop-shadow-[0_0_10px_rgba(255,200,0,0.3)]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
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
                        ? "bg-yellow-500 text-black font-semibold shadow-[0_0_12px_rgba(255,200,0,0.4)]"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </button>
                ))}
              </div>

              {/* SHOWS GROUPED BY THEATER */}
              <div className="space-y-8">
                {Object.values(showsByTheater).map((item) => (
                  <div
                    key={item.theater?.id}
                    className="bg-zinc-900/60 border border-zinc-700 p-6 rounded-2xl"
                  >
                    <div className="flex items-start gap-3 mb-5">
                      <MapPin className="w-6 h-6 text-yellow-500 mt-1" />
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
                          className="px-6 py-3 border border-zinc-700 rounded-xl bg-zinc-800 hover:bg-yellow-500/20 hover:border-yellow-500 transition shadow-md"
                        >
                          <div className="text-lg font-semibold">
                            {show.show_time}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {show.available_seats} seats • ₹{show.price}
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

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { API } from "../api";
// import { Star, Clock, Calendar, MapPin, Play } from "lucide-react";
// import { toast } from "sonner";

// const MovieDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [movie, setMovie] = useState(null);
//   const [shows, setShows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchMovieDetails();
//     fetchShows();
//   }, [id]);

//   const fetchMovieDetails = async () => {
//     try {
//       const res = await axios.get(`${API}/movies/${id}`);
//       setMovie(res.data);
//     } catch (err) {
//       toast.error("Failed to load movie details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchShows = async () => {
//     try {
//       const res = await axios.get(`${API}/shows?movie_id=${id}`);
//       setShows(res.data || []);

//       if (res.data?.length > 0) {
//         setSelectedDate(res.data[0].show_date);
//       }
//     } catch (err) {
//       toast.error("Failed to load shows");
//     }
//   };

//   const handleShowClick = (showId) => {
//     if (!token) {
//       toast.error("Please login to book tickets");
//       navigate("/login");
//       return;
//     }
//     navigate(`/shows/${showId}/seats`);
//   };

//   const uniqueDates = [...new Set(shows.map((s) => s.show_date))].sort();
//   const filteredShows = shows.filter((s) => s.show_date === selectedDate);

//   const showsByTheater = filteredShows.reduce((acc, show) => {
//     const tid = show.theater?.id;
//     if (!acc[tid]) acc[tid] = { theater: show.theater, shows: [] };
//     acc[tid].shows.push(show);
//     return acc;
//   }, {});

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-black text-white pt-20 flex justify-center items-center">
//         <div className="loading"></div>
//       </div>
//     );
//   }

//   if (!movie) {
//     return (
//       <div className="min-h-screen bg-black text-white pt-20 flex justify-center items-center">
//         <p className="text-gray-400">Movie not found</p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen bg-black text-white"
//       data-testid="movie-details-page"
//     >
//       {/* HERO BANNER */}
//       <div className="relative h-[520px] overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center scale-110 blur-[14px] brightness-[0.3]"
//           style={{ backgroundImage: `url(${movie.poster_url})` }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

//         {/* CONTENT */}
//         <div className="relative max-w-7xl mx-auto h-full px-4 flex items-end pb-12">
//           <div className="flex flex-col md:flex-row gap-10 items-end">
//             {/* POSTER */}
//             <img
//               src={movie.poster_url}
//               alt={movie.title}
//               className="w-64 h-96 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] object-cover"
//             />

//             {/* DETAILS */}
//             <div className="pb-4">
//               <h1
//                 className="text-5xl font-bold text-yellow-500 drop-shadow-[0_0_10px_rgba(255,200,0,0.4)] mb-4"
//                 style={{ fontFamily: "Cormorant Garamond, serif" }}
//               >
//                 {movie.title}
//               </h1>

//               {/* Rating / Duration / Language */}
//               <div className="flex flex-wrap gap-5 text-lg mb-4">
//                 <span className="flex items-center gap-2">
//                   <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
//                   <span className="font-semibold">{movie.rating}/10</span>
//                 </span>

//                 <span className="flex items-center gap-2 text-gray-300">
//                   <Clock className="w-5 h-5" />
//                   {movie.duration} min
//                 </span>

//                 <span className="px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
//                   {movie.language}
//                 </span>
//               </div>

//               {/* Genres */}
//               <div className="flex flex-wrap gap-3 mb-4">
//                 {movie.genre.map((g) => (
//                   <span
//                     key={g}
//                     className="px-4 py-2 rounded-full bg-zinc-900/70 border border-zinc-700 text-sm"
//                   >
//                     {g}
//                   </span>
//                 ))}
//               </div>

//               {/* Trailer button */}
//               {movie.trailer_url && (
//                 <a
//                   href={movie.trailer_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-6 py-3 inline-flex items-center gap-2 rounded-xl bg-yellow-500 text-black font-semibold shadow-[0_0_15px_rgba(255,200,0,0.5)] hover:scale-[1.03] transition"
//                 >
//                   <Play className="w-5 h-5" />
//                   Watch Trailer
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ABOUT MOVIE */}
//       <div className="max-w-7xl mx-auto px-4 py-12">
//         <div className="bg-zinc-900/70 p-8 rounded-2xl border border-zinc-800 mb-10">
//           <h2
//             className="text-3xl font-bold text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(255,200,0,0.3)]"
//             style={{ fontFamily: "Cormorant Garamond, serif" }}
//           >
//             About the Movie
//           </h2>

//           <p className="text-gray-300 text-lg mb-6 leading-relaxed">
//             {movie.description}
//           </p>

//           <div className="grid md:grid-cols-2 gap-6 text-gray-300">
//             {movie.director && (
//               <div>
//                 <h3 className="text-sm text-gray-400">Director</h3>
//                 <p className="text-lg">{movie.director}</p>
//               </div>
//             )}

//             {movie.cast?.length > 0 && (
//               <div>
//                 <h3 className="text-sm text-gray-400">Cast</h3>
//                 <p className="text-lg">{movie.cast.join(", ")}</p>
//               </div>
//             )}

//             <div>
//               <h3 className="text-sm text-gray-400">Release Date</h3>
//               <p className="text-lg">
//                 {new Date(movie.release_date).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* SHOW TIMES */}
//         <div className="bg-zinc-900/70 p-8 rounded-2xl border border-zinc-800">
//           <h2
//             className="text-3xl font-bold text-yellow-500 mb-6 drop-shadow-[0_0_10px_rgba(255,200,0,0.3)]"
//             style={{ fontFamily: "Cormorant Garamond, serif" }}
//           >
//             Book Tickets
//           </h2>

//           {uniqueDates.length > 0 ? (
//             <>
//               {/* DATE SELECTOR */}
//               <div className="flex gap-4 overflow-x-auto pb-3 mb-8">
//                 {uniqueDates.map((date) => (
//                   <button
//                     key={date}
//                     onClick={() => setSelectedDate(date)}
//                     className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
//                       selectedDate === date
//                         ? "bg-yellow-500 text-black font-semibold shadow-[0_0_12px_rgba(255,200,0,0.4)]"
//                         : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
//                     }`}
//                   >
//                     {new Date(date).toLocaleDateString("en-US", {
//                       weekday: "short",
//                       month: "short",
//                       day: "numeric",
//                     })}
//                   </button>
//                 ))}
//               </div>

//               {/* SHOW TIMES BY THEATER */}
//               <div className="space-y-8">
//                 {Object.values(showsByTheater).map((item) => (
//                   <div
//                     key={item.theater?.id}
//                     className="bg-zinc-900/60 border border-zinc-700 p-6 rounded-2xl"
//                   >
//                     <div className="flex items-start gap-3 mb-5">
//                       <MapPin className="w-6 h-6 text-yellow-500 mt-1" />
//                       <div>
//                         <h3 className="text-xl font-semibold">
//                           {item.theater?.name}
//                         </h3>
//                         <p className="text-gray-400 text-sm">
//                           {item.theater?.address}, {item.theater?.city}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-4">
//                       {item.shows.map((show) => (
//                         <button
//                           key={show.id}
//                           onClick={() => handleShowClick(show.id)}
//                           className="px-6 py-3 border border-zinc-700 rounded-xl bg-zinc-800 hover:bg-yellow-500/20 hover:border-yellow-500 transition shadow-md"
//                         >
//                           <div className="text-lg font-semibold">
//                             {show.show_time}
//                           </div>
//                           <div className="text-xs text-gray-400 mt-1">
//                             {show.available_seats} seats • ₹{show.price}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-12 text-gray-400">
//               No shows available for this movie yet.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;
