
import React, { useState, useEffect, useContext } from "react";
import axios from "../api";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  DollarSign,
  Ticket,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Film,
  Plus,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

import { OrganizationDashboardSkeleton } from "../components/OrganizationDashboardSkeleton";

export default function OrganizationDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview"); // overview | movies
  
  // Stats State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Movies State
  const [myMovies, setMyMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (user?.verificationStatus === "APPROVED") {
      fetchStats();
      if (activeTab === "movies") {
        fetchMyMovies();
      }
    } else {
        setLoading(false);
    }
  }, [user, activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/dashboard/org-stats");
      setStats(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyMovies = async () => {
    setMoviesLoading(true);
    try {
      // Fetch movies owned by this org
      const { data } = await axios.get(`/movies?ownerId=${user.id}&limit=100`);
      setMyMovies(data.movies || []);
    } catch (err) {
      toast.error("Failed to load your movies");
    } finally {
      setMoviesLoading(false);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`/movies/${id}`);
      toast.success("Movie deleted");
      fetchMyMovies();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  // ----------------------------------------------------------------------------------
  // PENDING STATE
  // ----------------------------------------------------------------------------------
  if (user?.verificationStatus !== "APPROVED") {
     return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
            <div className="max-w-2xl text-center space-y-6">
                <div className="bg-yellow-500/10 p-4 rounded-full inline-block">
                    <AlertTriangle className="w-16 h-16 text-yellow-500" />
                </div>
                <h1 className="text-4xl font-bold">Verification Pending</h1>
                <p className="text-gray-400 text-lg">
                    Thank you for registering your organization, <span className="text-white font-semibold">{user?.organizationDetails?.organizationName}</span>.
                    <br />
                    Your account is currently under review by our administrators.
                </p>
                <div className="bg-gray-800 p-6 rounded-xl text-left inline-block w-full">
                    <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-4">Submitted Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm">Owner</p>
                            <p className="font-semibold">{user?.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Contact</p>
                            <p className="font-semibold">{user?.organizationDetails?.contactNumber}</p>
                        </div>
                        <div className="col-span-2">
                             <p className="text-gray-400 text-sm">Status</p>
                             <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded mt-1 font-bold">
                                {user?.verificationStatus}
                             </span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    If you have questions, please contact support@movieday.com
                </p>
            </div>
        </div>
     )
  }

  if (loading) return <OrganizationDashboardSkeleton />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // ----------------------------------------------------------------------------------
  // APPROVED DASHBOARD
  // ----------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------
  // APPROVED DASHBOARD
  // ----------------------------------------------------------------------------------
  return (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-red-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 p-6 border-r border-white/10 bg-[#000000] sticky top-0 h-screen hidden md:block">
        <h1
          className="text-3xl font-bold mb-10 text-red-600 tracking-wider"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          MOVIEDAY <span className="text-xs text-gray-500 block font-sans tracking-normal font-normal mt-1">PARTNER PORTAL</span>
        </h1>

        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === "overview" 
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${activeTab === 'overview' ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} /> 
            <span className="font-medium">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("movies")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === "movies" 
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Film className={`w-5 h-5 ${activeTab === 'movies' ? 'text-white' : 'text-gray-500 group-hover:text-white transition-colors'}`} /> 
            <span className="font-medium">My Movies</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Logged in as</p>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold border border-white/10">
                        {user?.organizationDetails?.organizationName?.substring(0,2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.organizationDetails?.organizationName}</p>
                        <Link to="/" className="text-xs text-red-400 hover:text-red-300 transition-colors">Sign Out</Link>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black">
        <div className="flex justify-between items-end mb-10">
            <div>
                 <p className="text-gray-400 text-sm font-medium mb-1">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                 </p>
                 <h1 className="text-4xl font-bold tracking-tight text-white">
                    {activeTab === "overview" ? "Dashboard Overview" : "Manage Your Movies"}
                 </h1>
            </div>
            
            {activeTab === "movies" && (
                <button 
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                    <Plus className="w-5 h-5" /> Add New Movie
                </button>
            )}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 {/* STATS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${stats?.totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="w-6 h-6 text-green-400" />}
                        trend={12.5}
                        color="green"
                    />
                    <StatsCard
                        title="Tickets Sold"
                        value={stats?.totalTicketsSold}
                        icon={<Ticket className="w-6 h-6 text-blue-400" />}
                        trend={4.3}
                        color="blue"
                    />
                    <StatsCard
                        title="Avg. Occupancy"
                        value={`${stats?.occupancyRate}%`}
                        icon={<Users className="w-6 h-6 text-purple-400" />}
                        trend={0}
                        color="purple"
                    />
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>
                                <p className="text-sm text-gray-400 mt-1">Daily revenue performance over the last 30 days</p>
                            </div>
                            <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-red-500">
                                <option>Last 30 Days</option>
                                <option>Last 7 Days</option>
                            </select>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E50914" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#6B7280" 
                                    tick={{ fontSize: 11 }} 
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#6B7280" 
                                    tick={{ fontSize: 11 }} 
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                    tickFormatter={(val) => `₹${val/1000}k`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: "rgba(0,0,0,0.9)", 
                                        border: "1px solid rgba(255,255,255,0.1)", 
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
                                    }} 
                                    labelStyle={{ color: "#9CA3AF", marginBottom: "5px" }}
                                    itemStyle={{ color: "#fff", fontWeight: "bold" }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="sales" 
                                    stroke="#E50914" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#000', stroke: '#E50914', strokeWidth: 2 }} 
                                    activeDot={{ r: 6, fill: '#E50914', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RECENT ACTIVITY / KEY METRICS */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-xl backdrop-blur-sm flex flex-col justify-between">
                         <div>
                            <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-xl">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Top Performing Movie</p>
                                        <p className="font-semibold text-white mt-1">Interstellar</p>
                                        <p className="text-xs text-green-400 mt-0.5">+24% ticket sales</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Users className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Customer Satisfaction</p>
                                        <p className="font-semibold text-white mt-1">4.8/5.0</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Based on 120 reviews</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-xl">
                                        <MapPin className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Top Location</p>
                                        <p className="font-semibold text-white mt-1">PVR Cyber Hub</p>
                                        <p className="text-xs text-gray-500 mt-0.5">85% occupancy avg</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                         
                         <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors mt-6 border border-white/5">
                            View Detailed Report
                         </button>
                    </div>
                </div>
            </div>
        )}

        {/* MOVIES TAB */}
        {activeTab === "movies" && (
            <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                {moviesLoading ? (
                    <div className="p-20 text-center">
                        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
                        <p className="text-gray-400 animate-pulse">Loading your cinematic universe...</p>
                    </div>
                ) : myMovies.length === 0 ? (
                    <div className="p-20 text-center text-gray-500 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Film className="w-8 h-8 opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Movies Added Yet</h3>
                        <p className="max-w-xs mx-auto mb-8">Start building your portfolio by adding your first movie.</p>
                        <button 
                            onClick={() => { setEditingItem(null); setShowModal(true); }}
                            className="text-red-500 hover:text-white font-semibold transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Movie Now
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="p-6">Movie Title</th>
                                <th className="p-6">Genre & Details</th>
                                <th className="p-6">Performance</th>
                                <th className="p-6 text-right">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {myMovies.map(movie => (
                                <tr key={movie.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-gray-800 rounded-lg overflow-hidden shadow-md group-hover:shadow-red-900/40 relative">
                                                {movie.poster_url ? (
                                                    <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                                                        <Film className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-lg group-hover:text-red-500 transition-colors">{movie.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(movie.release_date).getFullYear()} • {movie.language}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((g, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-gray-300 font-medium border border-white/5">
                                                    {g}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-xs line-clamp-1">{movie.director}</p>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold flex items-center gap-1">
                                                ★ {movie.rating}
                                            </div>
                                            <span className="text-xs text-gray-500">Avg Rating</span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setEditingItem(movie); setShowModal(true); }}
                                                className="p-2 rounded-lg hover:bg-white/10 text-blue-400 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteMovie(movie.id)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}

      </main>

      {/* MODAL FOR ADD/EDIT MOVIE */}
      {showModal && (
        <MovieFormModal 
            onClose={() => { setShowModal(false); setEditingItem(null); }} 
            onSuccess={() => { setShowModal(false); setEditingItem(null); fetchMyMovies(); }}
            editingItem={editingItem}
        />
      )}

    </div>
  );
}

function StatsCard({ title, value, icon, trend, color }) {
  const isPositive = trend > 0;
  
  return (
    <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all shadow-xl backdrop-blur-sm group">
      <div className="flex items-start justify-between mb-4">
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-bold text-white mt-1 group-hover:scale-105 transition-transform origin-left">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
            {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
         {trend !== 0 && (
            <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
                {Math.abs(trend)}%
            </span>
         )}
         <span className="text-xs text-gray-500 font-medium">
            {trend === 0 ? "No change this week" : "vs last month"}
         </span>
      </div>
      
      {/* Decorative Gradient BG */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-500/5 to-transparent rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  );
}

// Separate Component for Form to keep main file clean-ish
function MovieFormModal({ onClose, onSuccess, editingItem }) {
    const [formData, setFormData] = useState(
      editingItem
        ? {
            ...editingItem,
            genre: Array.isArray(editingItem.genre) ? editingItem.genre.join(", ") : editingItem.genre || "",
            cast: Array.isArray(editingItem.cast) ? editingItem.cast.join(", ") : editingItem.cast || "",
            release_date: editingItem.release_date ? new Date(editingItem.release_date).toISOString().split("T")[0] : "",
          }
        : {
            title: "", description: "", genre: "", language: "", duration: "",
            rating: "", poster_url: "", trailer_url: "", release_date: "", director: "", cast: "",
          }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("DEBUG: Submit button clicked");
      
      try {
        console.log("DEBUG: Converting form data...");
        
        // Safety checks for inputs
        const genreList = formData.genre ? formData.genre.split(",").map(g => g.trim()).filter(g => g) : [];
        const castList = formData.cast ? formData.cast.split(",").map(c => c.trim()).filter(c => c) : [];
        
        // Safe Date Parsing
        let formattedDate = null;
        if (formData.release_date) {
            try {
                formattedDate = new Date(formData.release_date).toISOString();
            } catch (dateErr) {
                console.error("Date parsing error:", dateErr);
                toast.error("Invalid release date");
                return;
            }
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            language: formData.language,
            director: formData.director,
            duration: Number(formData.duration) || 0,
            rating: Number(formData.rating) || 0,
            genre: genreList,
            cast: castList,
            releaseDate: formattedDate,
            posterUrl: formData.poster_url,
            trailerUrl: formData.trailer_url || "",
        };

        console.log("DEBUG: Final Payload:", payload);

        if (editingItem) {
          await axios.put(`/movies/${editingItem.id}`, payload);
          toast.success("Movie updated");
        } else {
          await axios.post(`/movies`, payload);
          toast.success("Movie added");
        }
        
        console.log("DEBUG: API Call Successful");
        onSuccess();
      } catch (err) {
        console.error("Movie Save Error:", err);
        console.error("Response Data:", err.response?.data);
        toast.error(err.response?.data?.error || "Operation failed. Check console.");
      }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-white">
                        {editingItem ? "Edit Movie" : "Add New Movie"}
                    </h2>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                     <input placeholder="Movie Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none transition" required />
                     
                     <textarea placeholder="Description" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none transition" required />

                     <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Genre (comma separated)" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" required />
                        <input placeholder="Language" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" required />
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                        <input placeholder="Duration (min)" type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" required />
                        <input placeholder="Rating (0-10)" type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" required />
                        <input type="date" value={formData.release_date} onChange={e => setFormData({...formData, release_date: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" required />
                     </div>

                     <input placeholder="Poster URL" value={formData.poster_url} onChange={e => setFormData({...formData, poster_url: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" required />
                     
                     <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Director" value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" />
                        <input placeholder="Cast (comma separated)" value={formData.cast} onChange={e => setFormData({...formData, cast: e.target.value})} className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:border-red-500 outline-none" />
                     </div>

                     <div className="pt-4 flex gap-3">
                        <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
                            {editingItem ? "Update Movie" : "Add Movie"}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition">
                            Cancel
                        </button>
                     </div>
                </form>
            </div>
        </div>
    )
}
