import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import Spinner from "../components/Spinner";
import { getEvents } from "../services/api";
import { useToast } from "../hooks/useToast";

function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const toast = useToast();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let list = [...events];
    if (search.trim()) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === "oldest") list.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sortBy === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    setFiltered(list);
  }, [search, sortBy, events]);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      setEvents(res.data);
    } catch {
      toast("Failed to load events", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e._id !== id));
  };

  if (loading) return <Spinner text="Loading events..." />;

  return (
    <section className="events-section">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="section-title">
            All <span>Events</span>
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
            {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {role === "faculty" && (
          <button
            className="btn btn-accent"
            onClick={() => navigate("/add-event")}
          >
            ✦ Add New Event
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search events by title, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18 }}
            >×</button>
          )}
        </div>
        <select
          className="filter-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
          <option value="az">🔤 A → Z</option>
        </select>
      </div>

      {/* Grid */}
      <div className="events-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎪</div>
            <h3>No events found</h3>
            <p style={{ marginTop: 8, fontSize: 14 }}>
              {search ? "Try a different search term" : "No events have been added yet"}
            </p>
            {role === "faculty" && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 24 }}
                onClick={() => navigate("/add-event")}
              >
                Add First Event
              </button>
            )}
          </div>
        ) : (
          filtered.map((event, i) => (
            <EventCard
              key={event._id}
              event={event}
              onDelete={handleDelete}
              animDelay={i * 0.05}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default Events;
