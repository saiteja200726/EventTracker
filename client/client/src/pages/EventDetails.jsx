import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { getEvent, registerForEvent } from "../services/api";
import { useToast } from "../hooks/useToast";

const PLACEHOLDER = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await getEvent(id);
      setEvent(res.data);
    } catch {
      toast("Failed to load event", "error");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast("Please login to register", "error");
      navigate("/auth");
      return;
    }
    setRegistering(true);
    try {
      await registerForEvent(userId, event._id);
      toast("Successfully registered for this event! 🎉", "success");
    } catch (err) {
      toast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Spinner text="Loading event details..." />;
  if (!event) return null;

  const imgSrc = event.image
    ? `http://localhost:5000/uploads/${event.image}`
    : PLACEHOLDER;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      })
    : "Date TBA";

  return (
    <div className="details-page">
      {/* Hero Image */}
      <div className="details-hero">
        <img
          src={imgSrc}
          alt={event.title}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        <div className="details-hero-overlay">
          <span className="card-category" style={{ position: "relative", top: 0, left: 0, marginBottom: 12, display: "inline-block" }}>
            {event.category || "Event"}
          </span>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", lineHeight: 1.2 }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="details-content">
        {/* Main */}
        <div className="details-main">
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>About this Event</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 15 }}>
            {event.description || "No description provided."}
          </p>

          <div style={{ marginTop: 32 }}>
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? "Registering..." : "🎟️ Register for this Event"}
            </button>
            <button
              className="btn btn-outline"
              style={{ width: "100%", marginTop: 12 }}
              onClick={() => navigate("/events")}
            >
              ← Back to Events
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="details-sidebar">
          <div className="sidebar-card">
            <h3>Event Info</h3>
            <div className="info-list">
              <div className="info-item">
                <div className="info-item-icon">📅</div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>Date</div>
                  <div style={{ fontSize: 14 }}>{formattedDate}</div>
                </div>
              </div>
              {event.time && (
                <div className="info-item">
                  <div className="info-item-icon">⏰</div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>Time</div>
                    <div style={{ fontSize: 14 }}>{event.time}</div>
                  </div>
                </div>
              )}
              {event.location && (
                <div className="info-item">
                  <div className="info-item-icon">📍</div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>Location</div>
                    <div style={{ fontSize: 14 }}>{event.location}</div>
                  </div>
                </div>
              )}
              {event.organizer && (
                <div className="info-item">
                  <div className="info-item-icon">👤</div>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 2 }}>Organizer</div>
                    <div style={{ fontSize: 14 }}>{event.organizer}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Share Event</h3>
            <div style={{ display: "flex", gap: 10 }}>
              {["📋 Copy", "🐦 Tweet", "💬 Share"].map(btn => (
                <button
                  key={btn}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, fontSize: 12 }}
                  onClick={() => {
                    if (btn.includes("Copy")) {
                      navigator.clipboard.writeText(window.location.href);
                      toast("Link copied!", "success");
                    }
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
