import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../api";
import {
  Plus,
  Edit,
  Trash2,
  Film,
  Building2,
  CalendarDays,
  X,
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
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
            .filter((g) => g !== "")
            .join(","),

          cast: formData.cast
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c !== "")
            .join(","),

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
          className="input-field"
          required
        />

        <textarea
          placeholder="Description"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="input-field"
          required
        />

        <input
          placeholder="Genres (comma separated)"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="input-field"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Language"
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            className="input-field"
            required
          />

          <input
            placeholder="Duration (mins)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="input-field"
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
            className="input-field"
            required
          />

          <input
            type="date"
            value={formData.release_date}
            onChange={(e) =>
              setFormData({ ...formData, release_date: e.target.value })
            }
            className="input-field"
            required
          />
        </div>

        <input
          placeholder="Poster URL"
          value={formData.poster_url}
          onChange={(e) =>
            setFormData({ ...formData, poster_url: e.target.value })
          }
          className="input-field"
          required
        />

        <input
          placeholder="Trailer URL (optional)"
          value={formData.trailer_url}
          onChange={(e) =>
            setFormData({ ...formData, trailer_url: e.target.value })
          }
          className="input-field"
        />

        <input
          placeholder="Director"
          value={formData.director}
          onChange={(e) =>
            setFormData({ ...formData, director: e.target.value })
          }
          className="input-field"
        />

        <input
          placeholder="Cast (comma separated)"
          value={formData.cast}
          onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
          className="input-field"
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
          className="input-field"
          required
        />

        <input
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="input-field"
          required
        />

        <input
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="input-field"
          required
        />

        <input
          placeholder="Total Screens"
          value={formData.total_screens}
          onChange={(e) =>
            setFormData({ ...formData, total_screens: e.target.value })
          }
          className="input-field"
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
          className="input-field"
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
          className="input-field"
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
            className="input-field"
            required
          />

          <input
            placeholder="Total Seats"
            value={formData.total_seats}
            onChange={(e) =>
              setFormData({ ...formData, total_seats: e.target.value })
            }
            className="input-field"
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
            className="input-field"
            required
          />

          <input
            type="time"
            value={formData.show_time}
            onChange={(e) =>
              setFormData({ ...formData, show_time: e.target.value })
            }
            className="input-field"
            required
          />
        </div>

        <input
          placeholder="Price (₹)"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="input-field"
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
    <div className="min-h-screen flex bg-[#090c14] text-white">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-64 p-6 border-r border-white/10 bg-[#0c0f1c]/80 backdrop-blur-xl sticky top-0 h-screen">
        <h1
          className="text-3xl font-bold mb-10 text-yellow-500"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Admin Panel
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
        </nav>

        <div className="absolute bottom-6 left-6 text-gray-500 text-sm">
          © MovieDay Admin
        </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-4xl font-bold text-yellow-500"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>

          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* TABLE / LIST */}
        <div className="glass p-6 rounded-3xl">
          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>

      {/* ---------------- Modal ---------------- */}
      {showModal && (
        <div className="modal-container">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-500">
                {editingItem ? "Edit" : "Add"} {activeTab.slice(0, -1)}
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
  <table className="admin-table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Genre</th>
        <th>Language</th>
        <th>Rating</th>
        <th className="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {movies.map((m) => (
        <tr key={m.id}>
          <td>{m.title}</td>
          <td>{m.genre?.join(", ")}</td>
          <td>{m.language}</td>
          <td>{m.rating}</td>
          <td className="text-right space-x-3">
            <button
              className="text-yellow-500 hover:text-yellow-400"
              onClick={() => {
                setEditingItem(m);
                setShowModal(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              className="text-red-400 hover:text-red-300"
              onClick={() => handleDelete(m.id, "movies")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const TheatersTable = ({
  theaters,
  setEditingItem,
  setShowModal,
  handleDelete,
}) => (
  <table className="admin-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>City</th>
        <th>Address</th>
        <th>Screens</th>
        <th className="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {theaters.map((t) => (
        <tr key={t.id}>
          <td>{t.name}</td>
          <td>{t.city}</td>
          <td>{t.address}</td>
          <td>{t.total_screens}</td>
          <td className="text-right space-x-3">
            <button
              className="text-yellow-500 hover:text-yellow-400"
              onClick={() => {
                setEditingItem(t);
                setShowModal(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              className="text-red-400 hover:text-red-300"
              onClick={() => handleDelete(t.id, "theaters")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ShowsTable = ({ shows, setEditingItem, setShowModal, handleDelete }) => (
  <table className="admin-table">
    <thead>
      <tr>
        <th>Movie</th>
        <th>Theater</th>
        <th>Date</th>
        <th>Time</th>
        <th>Price</th>
        <th className="text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {shows.map((s) => (
        <tr key={s.id}>
          <td>{s.movie?.title}</td>
          <td>{s.theater?.name}</td>
          <td>{s.show_date}</td>
          <td>{s.show_time}</td>
          <td>₹{s.price}</td>
          <td className="text-right space-x-3">
            <button
              className="text-yellow-500 hover:text-yellow-400"
              onClick={() => {
                setEditingItem(s);
                setShowModal(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              className="text-red-400 hover:text-red-300"
              onClick={() => handleDelete(s.id, "shows")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { API } from "../api";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Film,
//   Building2,
//   CalendarDays,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("movies");
//   const [movies, setMovies] = useState([]);
//   const [theaters, setTheaters] = useState([]);
//   const [shows, setShows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, [activeTab]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       if (activeTab === "movies") {
//         const response = await axios.get(`${API}/movies?limit=200`);
//         setMovies(response.data.movies || []);
//       } else if (activeTab === "theaters") {
//         const response = await axios.get(`${API}/theaters`);
//         setTheaters(response.data || []);
//       } else if (activeTab === "shows") {
//         const response = await axios.get(`${API}/shows`);
//         setShows(response.data || []);
//       }
//     } catch {
//       toast.error("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id, type) => {
//     if (!window.confirm(`Are you sure you want to delete this ${type}?`))
//       return;

//     try {
//       await axios.delete(`${API}/${type}/${id}`);
//       toast.success(`${type.slice(0, -1)} deleted successfully`);

//       fetchData(); // refresh state
//     } catch (error) {
//       console.error(error);
//       toast.error("Delete failed");
//     }
//   };

//   // -------------------------
//   // MOVIE FORM
//   // -------------------------
//   const MovieForm = () => {
//     const [formData, setFormData] = useState(
//       editingItem
//         ? {
//             ...editingItem,

//             // Normalize genre to string for input
//             genre: Array.isArray(editingItem.genre)
//               ? editingItem.genre.join(", ")
//               : editingItem.genre || "",

//             // Normalize cast to string
//             cast: Array.isArray(editingItem.cast)
//               ? editingItem.cast.join(", ")
//               : editingItem.cast || "",

//             // Convert release_date to yyyy-mm-dd for input
//             release_date: editingItem.release_date
//               ? new Date(editingItem.release_date).toISOString().split("T")[0]
//               : "",
//           }
//         : {
//             title: "",
//             description: "",
//             genre: "",
//             language: "",
//             duration: "",
//             rating: "",
//             poster_url: "",
//             trailer_url: "",
//             release_date: "",
//             director: "",
//             cast: "",
//           }
//     );

//     const handleSubmit = async (e) => {
//       e.preventDefault();

//       try {
//         const payload = {
//           title: formData.title,
//           description: formData.description,
//           language: formData.language,
//           duration: Number(formData.duration),
//           rating: Number(formData.rating),
//           poster_url: formData.poster_url,
//           trailer_url: formData.trailer_url || null,
//           director: formData.director,

//           // Convert "1,2,3" → "1,2,3" (string always)
//           genre: formData.genre
//             .split(",")
//             .map((g) => g.trim())
//             .filter((g) => g !== "")
//             .join(","),

//           cast: formData.cast
//             .split(",")
//             .map((c) => c.trim())
//             .filter((c) => c !== "")
//             .join(","),

//           release_date: formData.release_date
//             ? new Date(formData.release_date).toISOString()
//             : null,
//         };

//         if (editingItem) {
//           await axios.put(`${API}/movies/${editingItem.id}`, payload);
//           toast.success("Movie updated");
//         } else {
//           await axios.post(`${API}/movies`, payload);
//           toast.success("Movie added");
//         }

//         setShowModal(false);
//         setEditingItem(null);
//         fetchData();
//       } catch (err) {
//         console.error(err);
//         toast.error("Movie operation failed");
//       }
//     };

//     return (
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Movie Title"
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//           className="input-field"
//           required
//         />

//         <textarea
//           placeholder="Description"
//           rows={3}
//           value={formData.description}
//           onChange={(e) =>
//             setFormData({ ...formData, description: e.target.value })
//           }
//           className="input-field"
//           required
//         />

//         <input
//           placeholder="Genres (comma separated)"
//           value={formData.genre}
//           onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
//           className="input-field"
//           required
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             placeholder="Language"
//             value={formData.language}
//             onChange={(e) =>
//               setFormData({ ...formData, language: e.target.value })
//             }
//             className="input-field"
//             required
//           />

//           <input
//             placeholder="Duration (mins)"
//             value={formData.duration}
//             onChange={(e) =>
//               setFormData({ ...formData, duration: e.target.value })
//             }
//             className="input-field"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             placeholder="Rating (0-10)"
//             value={formData.rating}
//             onChange={(e) =>
//               setFormData({ ...formData, rating: e.target.value })
//             }
//             className="input-field"
//             required
//           />

//           <input
//             type="date"
//             value={formData.release_date}
//             onChange={(e) =>
//               setFormData({ ...formData, release_date: e.target.value })
//             }
//             className="input-field"
//             required
//           />
//         </div>

//         <input
//           placeholder="Poster URL"
//           value={formData.poster_url}
//           onChange={(e) =>
//             setFormData({ ...formData, poster_url: e.target.value })
//           }
//           className="input-field"
//           required
//         />

//         <input
//           placeholder="Trailer URL (optional)"
//           value={formData.trailer_url}
//           onChange={(e) =>
//             setFormData({ ...formData, trailer_url: e.target.value })
//           }
//           className="input-field"
//         />

//         <input
//           placeholder="Director"
//           value={formData.director}
//           onChange={(e) =>
//             setFormData({ ...formData, director: e.target.value })
//           }
//           className="input-field"
//         />

//         <input
//           placeholder="Cast (comma separated)"
//           value={formData.cast}
//           onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
//           className="input-field"
//         />

//         <div className="flex gap-3">
//           <button type="submit" className="btn-primary flex-1">
//             {editingItem ? "Update Movie" : "Add Movie"}
//           </button>
//           <button
//             onClick={() => {
//               setShowModal(false);
//               setEditingItem(null);
//             }}
//             type="button"
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     );
//   };

//   const TheaterForm = () => {
//     const [formData, setFormData] = useState(
//       editingItem || { name: "", city: "", address: "", total_screens: "" }
//     );

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//         const payload = {
//           ...formData,
//           total_screens: parseInt(formData.total_screens),
//         };

//         if (editingItem) {
//           await axios.put(`${API}/theaters/${editingItem.id}`, payload);
//           toast.success("Theater updated");
//         } else {
//           await axios.post(`${API}/theaters`, payload);
//           toast.success("Theater added");
//         }

//         setShowModal(false);
//         setEditingItem(null);
//         fetchData();
//       } catch {
//         toast.error("Operation failed");
//       }
//     };

//     return (
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           placeholder="Theater Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="input-field"
//           required
//         />

//         <input
//           placeholder="City"
//           value={formData.city}
//           onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//           className="input-field"
//           required
//         />

//         <input
//           placeholder="Address"
//           value={formData.address}
//           onChange={(e) =>
//             setFormData({ ...formData, address: e.target.value })
//           }
//           className="input-field"
//           required
//         />

//         <input
//           placeholder="Total Screens"
//           value={formData.total_screens}
//           onChange={(e) =>
//             setFormData({ ...formData, total_screens: e.target.value })
//           }
//           className="input-field"
//           required
//         />

//         <div className="flex gap-3">
//           <button type="submit" className="btn-primary flex-1">
//             {editingItem ? "Update Theater" : "Add Theater"}
//           </button>

//           <button
//             onClick={() => {
//               setShowModal(false);
//               setEditingItem(null);
//             }}
//             type="button"
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     );
//   };

//   // -------------------------
//   // SHOW FORM
//   // -------------------------
//   const ShowForm = () => {
//     const [formData, setFormData] = useState(
//       editingItem || {
//         movie_id: "",
//         theater_id: "",
//         screen_number: "",
//         show_date: "",
//         show_time: "",
//         total_seats: "100",
//         price: "",
//       }
//     );

//     const [moviesList, setMoviesList] = useState([]);
//     const [theatersList, setTheatersList] = useState([]);

//     useEffect(() => {
//       const loadOptions = async () => {
//         const [mRes, tRes] = await Promise.all([
//           axios.get(`${API}/movies?limit=200`),
//           axios.get(`${API}/theaters`),
//         ]);

//         setMoviesList(mRes.data.movies || []);
//         setTheatersList(tRes.data || []);
//       };

//       loadOptions();
//     }, []);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       try {
//         const payload = {
//           ...formData,
//           screen_number: parseInt(formData.screen_number),
//           total_seats: parseInt(formData.total_seats),
//           price: parseFloat(formData.price),
//         };

//         if (editingItem) {
//           await axios.put(`${API}/shows/${editingItem.id}`, payload);
//           toast.success("Show updated");
//         } else {
//           await axios.post(`${API}/shows`, payload);
//           toast.success("Show added");
//         }

//         setShowModal(false);
//         setEditingItem(null);
//         fetchData();
//       } catch {
//         toast.error("Operation failed");
//       }
//     };

//     return (
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <select
//           value={formData.movie_id}
//           onChange={(e) =>
//             setFormData({ ...formData, movie_id: e.target.value })
//           }
//           className="input-field"
//           required
//         >
//           <option value="">Select Movie</option>
//           {moviesList.map((m) => (
//             <option key={m.id} value={m.id}>
//               {m.title}
//             </option>
//           ))}
//         </select>

//         <select
//           value={formData.theater_id}
//           onChange={(e) =>
//             setFormData({ ...formData, theater_id: e.target.value })
//           }
//           className="input-field"
//           required
//         >
//           <option value="">Select Theater</option>
//           {theatersList.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.name} — {t.city}
//             </option>
//           ))}
//         </select>

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             placeholder="Screen Number"
//             value={formData.screen_number}
//             onChange={(e) =>
//               setFormData({ ...formData, screen_number: e.target.value })
//             }
//             className="input-field"
//             required
//           />

//           <input
//             placeholder="Total Seats"
//             value={formData.total_seats}
//             onChange={(e) =>
//               setFormData({ ...formData, total_seats: e.target.value })
//             }
//             className="input-field"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="date"
//             value={formData.show_date}
//             onChange={(e) =>
//               setFormData({ ...formData, show_date: e.target.value })
//             }
//             className="input-field"
//             required
//           />

//           <input
//             type="time"
//             value={formData.show_time}
//             onChange={(e) =>
//               setFormData({ ...formData, show_time: e.target.value })
//             }
//             className="input-field"
//             required
//           />
//         </div>

//         <input
//           placeholder="Price (₹)"
//           value={formData.price}
//           onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//           className="input-field"
//           required
//         />

//         <div className="flex gap-3">
//           <button type="submit" className="btn-primary flex-1">
//             {editingItem ? "Update Show" : "Add Show"}
//           </button>
//           <button
//             onClick={() => {
//               setShowModal(false);
//               setEditingItem(null);
//             }}
//             type="button"
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     );
//   };

//   // -------------------------
//   // MAIN RETURN
//   // -------------------------
//   return (
//     <div className="min-h-screen flex bg-[#090c14] text-white">
//       {/* ---------------- Sidebar ---------------- */}
//       <aside className="w-64 p-6 border-r border-white/10 bg-[#0c0f1c]/80 backdrop-blur-xl sticky top-0 h-screen">
//         <h1
//           className="text-3xl font-bold mb-10 text-yellow-500"
//           style={{ fontFamily: "Cormorant Garamond, serif" }}
//         >
//           Admin Panel
//         </h1>

//         <nav className="space-y-3">
//           <button
//             onClick={() => setActiveTab("movies")}
//             className={`sidebar-btn ${activeTab === "movies" ? "active" : ""}`}
//           >
//             <Film className="w-5 h-5" /> Movies
//           </button>

//           <button
//             onClick={() => setActiveTab("theaters")}
//             className={`sidebar-btn ${
//               activeTab === "theaters" ? "active" : ""
//             }`}
//           >
//             <Building2 className="w-5 h-5" /> Theaters
//           </button>

//           <button
//             onClick={() => setActiveTab("shows")}
//             className={`sidebar-btn ${activeTab === "shows" ? "active" : ""}`}
//           >
//             <CalendarDays className="w-5 h-5" /> Shows
//           </button>
//         </nav>

//         <div className="absolute bottom-6 left-6 text-gray-500 text-sm">
//           © MovieDay Admin
//         </div>
//       </aside>

//       {/* ---------------- Main Content ---------------- */}
//       <main className="flex-1 p-10">
//         <div className="flex justify-between items-center mb-8">
//           <h2
//             className="text-4xl font-bold text-yellow-500"
//             style={{ fontFamily: "Cormorant Garamond, serif" }}
//           >
//             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//           </h2>

//           <button
//             onClick={() => {
//               setEditingItem(null);
//               setShowModal(true);
//             }}
//             className="btn-primary flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" /> Add {activeTab.slice(0, -1)}
//           </button>
//         </div>

//         {/* TABLE / LIST */}
//         <div className="glass p-6 rounded-3xl">
//           {loading ? (
//             <div className="py-20 text-center">Loading...</div>
//           ) : (
//             <>
//               {activeTab === "movies" && (
//                 <MoviesTable
//                   movies={movies}
//                   setEditingItem={setEditingItem}
//                   handleDelete={handleDelete}
//                   setShowModal={setShowModal}
//                 />
//               )}

//               {activeTab === "theaters" && (
//                 <TheatersTable
//                   theaters={theaters}
//                   setEditingItem={setEditingItem}
//                   handleDelete={handleDelete}
//                   setShowModal={setShowModal}
//                 />
//               )}

//               {activeTab === "shows" && (
//                 <ShowsTable
//                   shows={shows}
//                   setEditingItem={setEditingItem}
//                   handleDelete={handleDelete}
//                   setShowModal={setShowModal}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </main>

//       {/* ---------------- Modal ---------------- */}
//       {showModal && (
//         <div className="modal-container">
//           <div className="modal-box">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-yellow-500">
//                 {editingItem ? "Edit" : "Add"} {activeTab.slice(0, -1)}
//               </h2>

//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   setEditingItem(null);
//                 }}
//               >
//                 <X className="w-6 h-6 text-gray-300 hover:text-white" />
//               </button>
//             </div>

//             {activeTab === "movies" && <MovieForm />}
//             {activeTab === "theaters" && <TheaterForm />}
//             {activeTab === "shows" && <ShowForm />}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // -------------------------
// // SMALLER COMPONENT TABLES
// // -------------------------
// const MoviesTable = ({
//   movies,
//   setEditingItem,
//   setShowModal,
//   handleDelete,
// }) => (
//   <table className="admin-table">
//     <thead>
//       <tr>
//         <th>Title</th>
//         <th>Genre</th>
//         <th>Language</th>
//         <th>Rating</th>
//         <th className="text-right">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {movies.map((m) => (
//         <tr key={m.id}>
//           <td>{m.title}</td>
//           <td>{m.genre?.join(", ")}</td>
//           <td>{m.language}</td>
//           <td>{m.rating}</td>
//           <td className="text-right space-x-3">
//             <button
//               className="text-yellow-500 hover:text-yellow-400"
//               onClick={() => {
//                 setEditingItem(m);
//                 setShowModal(true);
//               }}
//             >
//               <Edit className="w-4 h-4" />
//             </button>

//             <button
//               className="text-red-400 hover:text-red-300"
//               onClick={() => handleDelete(m.id, "movies")}
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );

// const TheatersTable = ({
//   theaters,
//   setEditingItem,
//   setShowModal,
//   handleDelete,
// }) => (
//   <table className="admin-table">
//     <thead>
//       <tr>
//         <th>Name</th>
//         <th>City</th>
//         <th>Address</th>
//         <th>Screens</th>
//         <th className="text-right">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {theaters.map((t) => (
//         <tr key={t.id}>
//           <td>{t.name}</td>
//           <td>{t.city}</td>
//           <td>{t.address}</td>
//           <td>{t.total_screens}</td>
//           <td className="text-right space-x-3">
//             <button
//               className="text-yellow-500 hover:text-yellow-400"
//               onClick={() => {
//                 setEditingItem(t);
//                 setShowModal(true);
//               }}
//             >
//               <Edit className="w-4 h-4" />
//             </button>

//             <button
//               className="text-red-400 hover:text-red-300"
//               onClick={() => handleDelete(t.id, "theaters")}
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );

// const ShowsTable = ({ shows, setEditingItem, setShowModal, handleDelete }) => (
//   <table className="admin-table">
//     <thead>
//       <tr>
//         <th>Movie</th>
//         <th>Theater</th>
//         <th>Date</th>
//         <th>Time</th>
//         <th>Price</th>
//         <th className="text-right">Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {shows.map((s) => (
//         <tr key={s.id}>
//           <td>{s.movie?.title}</td>
//           <td>{s.theater?.name}</td>
//           <td>{s.show_date}</td>
//           <td>{s.show_time}</td>
//           <td>₹{s.price}</td>
//           <td className="text-right space-x-3">
//             <button
//               className="text-yellow-500 hover:text-yellow-400"
//               onClick={() => {
//                 setEditingItem(s);
//                 setShowModal(true);
//               }}
//             >
//               <Edit className="w-4 h-4" />
//             </button>

//             <button
//               className="text-red-400 hover:text-red-300"
//               onClick={() => handleDelete(s.id, "shows")}
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );

// export default AdminDashboard;
