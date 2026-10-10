import { useNavigate } from "react-router-dom";
import { deleteEvent } from "../services/api";
import { useToast } from "../hooks/useToast";

const PLACEHOLDER = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format";

function EventCard({ event, onDelete, animDelay = 0 }) {
  const navigate = useNavigate();
  const toast = useToast();
  const role = localStorage.getItem("role");
  const isFaculty = role === "faculty";

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(event._id);
      toast("Event deleted successfully", "success");
      onDelete?.(event._id);
    } catch {
      toast("Failed to delete event", "error");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit-event/${event._id}`);
  };

  const imgSrc = event.image
    ? `http://localhost:5000/uploads/${event.image}`
    : PLACEHOLDER;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      })
    : "Date TBA";

  return (
    <div
      className="event-card"
      onClick={() => navigate(`/events/${event._id}`)}
      style={{ animationDelay: `${animDelay}s` }}
    >
      <div className="card-image-wrapper">
        <img
          src={imgSrc}
          alt={event.title}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        <span className="card-category">
          {event.category || "Event"}
        </span>
      </div>

      <div className="card-body">
        <h3 className="card-title">{event.title}</h3>
        <p className="card-desc">{event.description}</p>

        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            {formattedDate}
          </div>
          {event.location && (
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              {event.location}
            </div>
          )}
          {event.time && (
            <div className="meta-item">
              <span className="meta-icon">⏰</span>
              {event.time}
            </div>
          )}
        </div>

        <div className="card-actions">
          {isFaculty ? (
            <>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={handleEdit}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                style={{ flex: 1 }}
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
              onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}`); }}
            >
              View Details →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
