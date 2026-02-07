import React, { useState, useEffect } from "react";
import axios from "../api"; // Use the configured axios instance
import {
  Plus,
  Edit,
  Trash2,
  Film,
  Building2,
  CalendarDays,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Shield,
  Phone,
  Mail,
  Loader2,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";

const OrganizationDetails = ({ org }) => {
  // Console logging for verification
  console.log("Rendering OrganizationDetails for:", org?.name);

  // 1. Critical Safety Check
  if (!org) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No organization selected or data is loading...</p>
      </div>
    );
  }

  // 2. Safe Property Access
  const details = org.organizationDetails || {};
  const safeName = org.name || "Unknown Organization";
  const safeEmail = org.email || "No Email Provided";
  const initials = safeName.substring(0, 2).toUpperCase();
  
  // 3. Helper for "Not Provided" text
  const getVal = (val) => val || <span className="text-gray-600 italic">Not Provided</span>;

  return (
    <div className="space-y-6 text-white">
        {/* Header Section */}
        <div className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xl font-bold shadow-lg ring-2 ring-white/10">
                {initials}
            </div>
            <div>
                <h3 className="text-2xl font-bold tracking-tight">{safeName}</h3>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {safeEmail}
                </p>
                 <span className={`inline-flex mt-3 items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        org.verificationStatus === 'APPROVED' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : org.verificationStatus === 'REJECTED'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                             org.verificationStatus === 'APPROVED' ? 'bg-green-400' :
                             org.verificationStatus === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'
                        }`}></span>
                        {org.verificationStatus}
                  </span>
            </div>
        </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Aadhar Number</span>
             </div>
             <p className="font-mono text-lg tracking-wider text-white bg-black/20 p-2 rounded border border-white/5">
                {getVal(details.aadharNumber)}
             </p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider">GST Number</span>
             </div>
             <p className="font-mono text-lg tracking-wider text-white bg-black/20 p-2 rounded border border-white/5">
                {getVal(details.gstNumber)}
             </p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-3 mb-2 text-gray-400">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Contact Number</span>
             </div>
             <p className="text-lg text-white font-medium pl-1">
                {getVal(details.contactNumber)}
             </p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-3 mb-2 text-gray-400">
                <User className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Owner Name</span>
             </div>
             <p className="text-lg text-white font-medium pl-1">
                {safeName}
             </p>
        </div>
      </div>
    
      {/* Address Full Width */}
      <div className="bg-white/5 p-5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-3 text-gray-400">
                <MapPin className="w-4 h-4 text-red-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Registered Address</span>
             </div>
            <p className="text-gray-200 leading-relaxed text-sm pl-1">
                {getVal(details.address)}
            </p>
      </div>

    </div>
  );
};

const StatCard = ({ label, val, icon: Icon, color, bg }) => (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className={`absolute inset-0 bg-gradient-to-br ${bg.replace('bg-', 'from-').replace('/10','/5')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        <div className="flex justify-between items-start relative">
            <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${color.replace('text-', 'text-opacity-80 ')}`}>{label}</p>
                <p className="text-3xl font-bold text-white mt-2">{val}</p>
            </div>
            <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- ORG FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED
  
  const filteredOrganizations = organizations.filter(org => {
     const name = org.name || "";
     const email = org.email || "";
     const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           email.toLowerCase().includes(searchQuery.toLowerCase());
     const matchesStatus = statusFilter === "ALL" || org.verificationStatus === statusFilter;
     return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "movies") {
        const response = await axios.get(`/movies?limit=200`);
        setMovies(response.data.movies || []);
      } else if (activeTab === "theaters") {
        const response = await axios.get(`/theaters`);
        setTheaters(response.data || []);
      } else if (activeTab === "shows") {
        const response = await axios.get(`/shows`);
        setShows(response.data || []);
      } else if (activeTab === "organizations") {
        const response = await axios.get(`/admin/pending-organizations?_t=${Date.now()}`);
        setOrganizations(response.data || []);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      // Optimistic Update
      setOrganizations(organizations.filter(org => org.id !== id));
      
      await axios.patch(`/admin/verify-organization/${id}`, { status });
      toast.success(`Organization ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Verification failed");
      fetchData(); // Revert on failure
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;

    try {
      await axios.delete(`/${type}/${id}`);
      toast.success(`${type.slice(0, -1)} deleted successfully`);
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // -------------------------
  // MOVIE FORM
  // -------------------------
  const MovieForm = () => {
    const [formData, setFormData] = useState(
      editingItem
        ? {
            ...editingItem,

            genre: Array.isArray(editingItem.genre)
              ? editingItem.genre.join(", ")
              : editingItem.genre || "",

            cast: Array.isArray(editingItem.cast)
              ? editingItem.cast.join(", ")
              : editingItem.cast || "",

            release_date: editingItem.release_date
              ? new Date(editingItem.release_date).toISOString().split("T")[0]
              : "",
          }
        : {
            title: "",
            description: "",
            genre: "",
            language: "",
            duration: "",
            rating: "",
            poster_url: "",
            trailer_url: "",
            release_date: "",
            director: "",
            cast: "",
          }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const payload = {
          title: formData.title,
          description: formData.description,
          language: formData.language,
          duration: Number(formData.duration),
          rating: Number(formData.rating),
          poster_url: formData.poster_url,
          trailer_url: formData.trailer_url || null,
          director: formData.director,

          genre: formData.genre
            .split(",")
            .map((g) => g.trim())
            .filter((g) => g !== ""), // Send as Array

          cast: formData.cast
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c !== ""), // Send as Array

          release_date: formData.release_date
            ? new Date(formData.release_date).toISOString()
            : null,
        };

        if (editingItem) {
          await axios.put(`/movies/${editingItem.id}`, payload);
          toast.success("Movie updated");
        } else {
          await axios.post(`/movies`, payload);
          toast.success("Movie added");
        }

        setShowModal(false);
        setEditingItem(null);
        fetchData();
      } catch (err) {
        console.error(err);
        toast.error("Movie operation failed");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Movie Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-field w-full"
          required
        />

        <textarea
          placeholder="Description"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field w-full"
          required
        />

        <input
          placeholder="Genres (comma separated)"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="input-field w-full"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Language"
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            className="input-field w-full"
            required
          />

          <input
            placeholder="Duration (mins)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Rating (0-10)"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: e.target.value })
            }
            className="input-field w-full"
            required
          />

          <input
            type="date"
            value={formData.release_date}
            onChange={(e) =>
              setFormData({ ...formData, release_date: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        <input
          placeholder="Poster URL"
          value={formData.poster_url}
          onChange={(e) =>
            setFormData({ ...formData, poster_url: e.target.value })
          }
          className="input-field w-full"
          required
        />

        <input
          placeholder="Trailer URL (optional)"
          value={formData.trailer_url}
          onChange={(e) =>
            setFormData({ ...formData, trailer_url: e.target.value })
          }
          className="input-field w-full"
        />

        <input
          placeholder="Director"
          value={formData.director}
          onChange={(e) =>
            setFormData({ ...formData, director: e.target.value })
          }
          className="input-field w-full"
        />

        <input
          placeholder="Cast (comma separated)"
          value={formData.cast}
          onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
          className="input-field w-full"
        />

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingItem ? "Update Movie" : "Add Movie"}
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            type="button"
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const TheaterForm = () => {
    const [formData, setFormData] = useState(
      editingItem || { name: "", city: "", address: "", total_screens: "" }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ...formData,
          total_screens: parseInt(formData.total_screens),
        };

        if (editingItem) {
          await axios.put(`/theaters/${editingItem.id}`, payload);
          toast.success("Theater updated");
        } else {
          await axios.post(`/theaters`, payload);
          toast.success("Theater added");
        }

        setShowModal(false);
        setEditingItem(null);
        fetchData();
      } catch {
        toast.error("Operation failed");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Theater Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field w-full"
          required
        />

        <input
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="input-field w-full"
          required
        />

        <input
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="input-field w-full"
          required
        />

        <input
          placeholder="Total Screens"
          value={formData.total_screens}
          onChange={(e) =>
            setFormData({ ...formData, total_screens: e.target.value })
          }
          className="input-field w-full"
          required
        />

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingItem ? "Update Theater" : "Add Theater"}
          </button>

          <button
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            type="button"
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // -------------------------
  // SHOW FORM
  // -------------------------
  const ShowForm = () => {
    const [formData, setFormData] = useState(
      editingItem || {
        movie_id: "",
        theater_id: "",
        screen_number: "",
        show_date: "",
        show_time: "",
        total_seats: "100",
        price: "",
      }
    );

    const [moviesList, setMoviesList] = useState([]);
    const [theatersList, setTheatersList] = useState([]);

    useEffect(() => {
      const loadOptions = async () => {
        const [mRes, tRes] = await Promise.all([
          axios.get(`/movies?limit=200`),
          axios.get(`/theaters`),
        ]);

        setMoviesList(mRes.data.movies || []);
        setTheatersList(tRes.data || []);
      };

      loadOptions();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const payload = {
          ...formData,
          screen_number: parseInt(formData.screen_number),
          total_seats: parseInt(formData.total_seats),
          price: parseFloat(formData.price),
        };

        if (editingItem) {
          await axios.put(`/shows/${editingItem.id}`, payload);
          toast.success("Show updated");
        } else {
          await axios.post(`/shows`, payload);
          toast.success("Show added");
        }

        setShowModal(false);
        setEditingItem(null);
        fetchData();
      } catch {
        toast.error("Operation failed");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formData.movie_id}
          onChange={(e) =>
            setFormData({ ...formData, movie_id: e.target.value })
          }
          className="input-field w-full"
          required
        >
          <option value="">Select Movie</option>
          {moviesList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        <select
          value={formData.theater_id}
          onChange={(e) =>
            setFormData({ ...formData, theater_id: e.target.value })
          }
          className="input-field w-full"
          required
        >
          <option value="">Select Theater</option>
          {theatersList.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.city}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Screen Number"
            value={formData.screen_number}
            onChange={(e) =>
              setFormData({ ...formData, screen_number: e.target.value })
            }
            className="input-field w-full"
            required
          />

          <input
            placeholder="Total Seats"
            value={formData.total_seats}
            onChange={(e) =>
              setFormData({ ...formData, total_seats: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={formData.show_date}
            onChange={(e) =>
              setFormData({ ...formData, show_date: e.target.value })
            }
            className="input-field w-full"
            required
          />

          <input
            type="time"
            value={formData.show_time}
            onChange={(e) =>
              setFormData({ ...formData, show_time: e.target.value })
            }
            className="input-field w-full"
            required
          />
        </div>

        <input
          placeholder="Price (₹)"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input-field w-full"
          required
        />

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingItem ? "Update Show" : "Add Show"}
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            type="button"
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  // -------------------------
  // MAIN RETURN
  // -------------------------
  return (
    <div className="min-h-screen flex bg-black text-white font-sans">

      <aside className="w-64 p-6 border-r border-white/10 bg-[#000000] sticky top-0 h-screen">
        <h1
          className="text-3xl font-bold mb-10 text-red-600 tracking-wider"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          MOVIEDAY
        </h1>

        <nav className="space-y-3">
          <button
            onClick={() => setActiveTab("movies")}
            className={`sidebar-btn ${activeTab === "movies" ? "active" : ""}`}
          >
            <Film className="w-5 h-5" /> Movies
          </button>

          <button
            onClick={() => setActiveTab("theaters")}
            className={`sidebar-btn ${
              activeTab === "theaters" ? "active" : ""
            }`}
          >
            <Building2 className="w-5 h-5" /> Theaters
          </button>

          <button
            onClick={() => setActiveTab("shows")}
            className={`sidebar-btn ${activeTab === "shows" ? "active" : ""}`}
          >
            <CalendarDays className="w-5 h-5" /> Shows
          </button>

          <button
            onClick={() => setActiveTab("organizations")}
            className={`sidebar-btn ${activeTab === "organizations" ? "active" : ""}`}
          >
            <Building2 className="w-5 h-5" /> Organizations
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 text-gray-500 text-sm">
          © MovieDay Admin
        </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-4xl font-bold text-white tracking-tight"
          >
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>

          {activeTab !== "organizations" && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add {activeTab.slice(0, -1)}
            </button>
          )}
        </div>

        {/* TABLE / LIST */}
        <div className="glass p-6 rounded-3xl">
          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : (
            <>
              {/* Stats Overview for All Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {/* DYNAMIC STATS BASED ON TAB */}
                  {activeTab === 'movies' && [
                      { label: "Total Movies", val: movies.length, icon: Film, color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Top Rated", val: movies.filter(m => m.rating >= 8).length, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
                      { label: "Avg Duration", val: movies.length ? Math.round(movies.reduce((acc, m) => acc + (Number(m.duration) || 0), 0) / movies.length) + " min" : "0 min", icon: CalendarDays, color: "text-purple-400", bg: "bg-purple-500/10" }
                  ].map((stat, i) => (
                      <StatCard key={i} {...stat} />
                  ))}

                  {activeTab === 'theaters' && [
                      { label: "Total Theaters", val: theaters.length, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Total Screens", val: theaters.reduce((acc, t) => acc + (Number(t.total_screens) || 0), 0), icon: Film, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                      { label: "Cities Covered", val: new Set(theaters.map(t => t.city)).size, icon: MapPin, color: "text-red-400", bg: "bg-red-500/10" }
                  ].map((stat, i) => (
                      <StatCard key={i} {...stat} />
                  ))}

                  {activeTab === 'shows' && [
                      { label: "Today's Shows", val: shows.length, icon: CalendarDays, color: "text-orange-400", bg: "bg-orange-500/10" },
                      { label: "Active Theaters", val: new Set(shows.map(s => s.theater_id)).size, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Avg Price", val: "₹" + (shows.length ? Math.round(shows.reduce((acc, s) => acc + (Number(s.price) || 0), 0) / shows.length) : 0), icon: Loader2, color: "text-green-400", bg: "bg-green-500/10" }
                  ].map((stat, i) => (
                      <StatCard key={i} {...stat} />
                  ))}

                   {activeTab === 'organizations' && [
                      { label: "Total Organizations", val: organizations.length, icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10" },
                      { label: "Pending Review", val: organizations.filter(o => o.verificationStatus === 'PENDING').length, icon: Loader2, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                      { label: "Active Partners", val: organizations.filter(o => o.verificationStatus === 'APPROVED').length, icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" }
                  ].map((stat, i) => (
                      <StatCard key={i} {...stat} />
                  ))}
              </div>

              {activeTab === "movies" && (
                <MoviesTable
                  movies={movies}
                  setEditingItem={setEditingItem}
                  handleDelete={handleDelete}
                  setShowModal={setShowModal}
                />
              )}

              {activeTab === "theaters" && (
                <TheatersTable
                  theaters={theaters}
                  setEditingItem={setEditingItem}
                  handleDelete={handleDelete}
                  setShowModal={setShowModal}
                />
              )}

              {activeTab === "shows" && (
                <ShowsTable
                  shows={shows}
                  setEditingItem={setEditingItem}
                  handleDelete={handleDelete}
                  setShowModal={setShowModal}
                />
              )}

              {activeTab === "organizations" && (
                <div className="space-y-6">
                  {/* Filters & Search */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-1 rounded-xl border border-white/10">
                      <div className="relative w-full md:w-96">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="Search by name or email..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-transparent border-none rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:ring-0 focus:outline-none"
                          />
                      </div>
                      <div className="flex gap-1 p-1 w-full md:w-auto overflow-x-auto">
                          {["ALL", "PENDING", "APPROVED", "REJECTED"].map(status => (
                              <button
                                  key={status}
                                  onClick={() => setStatusFilter(status)}
                                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                                      statusFilter === status 
                                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                                  }`}
                              >
                                  {status}
                              </button>
                          ))}
                      </div>
                  </div>

                  <OrganizationsTable
                    organizations={filteredOrganizations}
                    handleVerify={handleVerify}
                    setShowModal={setShowModal}
                    setEditingItem={setEditingItem}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ---------------- Modal ---------------- */}
      {showModal && (
        <div className="modal-container">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-500">
                {activeTab === "organizations" 
                  ? "Organization Details" 
                  : (editingItem ? "Edit" : "Add") + " " + activeTab.slice(0, -1)
                }
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-6 h-6 text-gray-300 hover:text-white" />
              </button>
            </div>

            {activeTab === "movies" && <MovieForm />}
            {activeTab === "theaters" && <TheaterForm />}
            {activeTab === "shows" && <ShowForm />}
            {activeTab === "organizations" && <OrganizationDetails org={editingItem} />}
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------
// SMALLER COMPONENT TABLES
// -------------------------
const MoviesTable = ({
  movies,
  setEditingItem,
  setShowModal,
  handleDelete,
}) => (
  <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="p-4 rounded-tl-xl rounded-bl-xl">Movie Details</th>
            <th className="p-4">Genre</th>
            <th className="p-4">Language</th>
            <th className="p-4">Rating</th>
            <th className="p-4 text-right rounded-tr-xl rounded-br-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {movies.length === 0 ? (
             <tr>
              <td colSpan="5" className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 rounded-full">
                        <Film className="w-8 h-8 opacity-20" />
                    </div>
                    <p>No movies found.</p>
                </div>
              </td>
            </tr>
          ) : (
            movies.map((m) => (
                <tr key={m.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-gray-800 overflow-hidden shadow-lg border border-white/10 relative flex-shrink-0">
                            {m.poster_url ? (
                                <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Film className="w-5 h-5 text-gray-600" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg tracking-tight">{m.title}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <span>{m.duration} mins</span>
                                <span>•</span>
                                <span>{new Date(m.release_date).getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                        {(Array.isArray(m.genre) ? m.genre : m.genre?.split(',') || []).slice(0, 2).map((g, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/5 text-gray-300 border border-white/10">
                                {g.trim()}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="p-4 text-sm text-gray-300">{m.language}</td>
                <td className="p-4">
                    <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-bold ${m.rating >= 7 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {m.rating}
                        </span>
                        <span className="text-xs text-gray-500">/10</span>
                    </div>
                </td>
                <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        onClick={() => {
                            setEditingItem(m);
                            setShowModal(true);
                        }}
                        >
                        <Edit className="w-4 h-4" />
                        </button>

                        <button
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(m.id, "movies")}
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
                </tr>
            ))
          )}
        </tbody>
      </table>
  </div>
);

const TheatersTable = ({
  theaters,
  setEditingItem,
  setShowModal,
  handleDelete,
}) => (
 <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="p-4 rounded-tl-xl rounded-bl-xl">Theater Name</th>
            <th className="p-4">Location</th>
            <th className="p-4">Stats</th>
            <th className="p-4 text-right rounded-tr-xl rounded-br-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
             {theaters.length === 0 ? (
             <tr>
              <td colSpan="4" className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 rounded-full">
                        <Building2 className="w-8 h-8 opacity-20" />
                    </div>
                    <p>No theaters found.</p>
                </div>
              </td>
            </tr>
          ) : (
            theaters.map((t) => (
                <tr key={t.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-base">{t.name}</p>
                            <p className="text-xs text-indigo-400 mt-0.5 font-medium tracking-wide">THEATER ID: #{t.id.toString().slice(-4)}</p>
                        </div>
                    </div>
                </td>
                <td className="p-4">
                    <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{t.city}</span>
                        <span className="text-xs text-gray-500 truncate max-w-[200px]">{t.address}</span>
                    </div>
                </td>
                <td className="p-4">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-white border border-white/10">
                        <Film className="w-3 h-3 text-red-500" />
                        {t.total_screens} Screens
                     </span>
                </td>
                <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        onClick={() => {
                            setEditingItem(t);
                            setShowModal(true);
                        }}
                        >
                        <Edit className="w-4 h-4" />
                        </button>

                        <button
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(t.id, "theaters")}
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
                </tr>
            ))
          )}
        </tbody>
      </table>
  </div>
);

const ShowsTable = ({ shows, setEditingItem, setShowModal, handleDelete }) => (
  <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="p-4 rounded-tl-xl rounded-bl-xl">Movie Details</th>
            <th className="p-4">Theater Info</th>
            <th className="p-4">Showtime</th>
            <th className="p-4">Pricing</th>
            <th className="p-4 text-right rounded-tr-xl rounded-br-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
             {shows.length === 0 ? (
             <tr>
              <td colSpan="5" className="text-center py-12 text-gray-500">
                 <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 rounded-full">
                        <CalendarDays className="w-8 h-8 opacity-20" />
                    </div>
                    <p>No shows scheduled.</p>
                </div>
              </td>
            </tr>
          ) : (
            shows.map((s) => (
                <tr key={s.id} className="group hover:bg-white/5 transition-colors">
                <td className="p-4">
                     <p className="font-bold text-white text-base">{s.movie?.title || "Unknown Movie"}</p>
                     <p className="text-xs text-gray-400 mt-0.5">Screen {s.screen_number} • {s.total_seats} Seats</p>
                </td>
                <td className="p-4">
                     <div className="flex flex-col">
                        <span className="text-white text-sm">{s.theater?.name || "Unknown Theater"}</span>
                        <span className="text-xs text-gray-500">{s.theater?.city}</span>
                     </div>
                </td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-500/10 rounded text-red-400">
                             <CalendarDays className="w-4 h-4" />
                        </div>
                        <div>
                             <p className="text-sm font-bold text-white">{s.show_time}</p>
                             <p className="text-xs text-gray-500">{new Date(s.show_date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </td>
                <td className="p-4">
                     <span className="text-green-400 font-bold tracking-wide">₹{s.price}</span>
                </td>
                <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        onClick={() => {
                            setEditingItem(s);
                            setShowModal(true);
                        }}
                        >
                        <Edit className="w-4 h-4" />
                        </button>

                        <button
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        onClick={() => handleDelete(s.id, "shows")}
                        >
                        <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
                </tr>
            ))
          )}
        </tbody>
      </table>
  </div>
);

const OrganizationsTable = ({ organizations, handleVerify, setShowModal, setEditingItem }) => (
  <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
          <tr>
            <th className="p-4 rounded-tl-xl rounded-bl-xl">Organization</th>
            <th className="p-4">Status</th>
            <th className="p-4">Applied On</th>
            <th className="p-4 text-right rounded-tr-xl rounded-br-xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {organizations.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 rounded-full">
                        <Building2 className="w-8 h-8 opacity-20" />
                    </div>
                    <p>No organizations found matching your criteria.</p>
                </div>
              </td>
            </tr>
          ) : (
            organizations.map((org) => {
                const safeName = org.name || "Unknown";
                const initials = safeName.substring(0, 2).toUpperCase();
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
                const colorIndex = safeName.length % colors.length;
                
                return (
                  <tr key={org.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} text-white flex items-center justify-center font-bold shadow-lg`}>
                                {initials}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{org.name}</p>
                                <p className="text-gray-400 text-sm">{org.email}</p>
                            </div>
                        </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                        org.verificationStatus === 'APPROVED' 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : org.verificationStatus === 'REJECTED'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                             org.verificationStatus === 'APPROVED' ? 'bg-green-400' :
                             org.verificationStatus === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-400 animate-pulse'
                        }`}></span>
                        {org.verificationStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-sm font-medium">
                        {new Date(org.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                        })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="View Details"
                          onClick={() => {
                            setEditingItem(org);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {org.verificationStatus === 'PENDING' && (
                            <>
                              <button
                                className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                title="Approve"
                                onClick={() => handleVerify(org.id, "APPROVED")}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Reject"
                                onClick={() => handleVerify(org.id, "REJECTED")}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
            })
          )}
        </tbody>
      </table>
  </div>
);



export default AdminDashboard;
