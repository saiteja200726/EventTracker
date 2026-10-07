import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, updateEvent, getEvent } from "../services/api";
import { useToast } from "../hooks/useToast";
import Spinner from "../components/Spinner";

function AddEvent() {
  const { id } = useParams(); // if present, we're editing
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    category: "Workshop",
    organizer: ""
  });

  useEffect(() => {
    if (isEdit) {
      getEvent(id)
        .then(res => {
          const ev = res.data;
          setForm({
            title: ev.title || "",
            description: ev.description || "",
            location: ev.location || "",
            date: ev.date ? ev.date.split("T")[0] : "",
            time: ev.time || "",
            category: ev.category || "Workshop",
            organizer: ev.organizer || ""
          });
          if (ev.image) setImagePreview(`http://localhost:5000/uploads/${ev.image}`);
        })
        .catch(() => {
          toast("Failed to load event", "error");
          navigate("/events");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.date) errs.date = "Date is required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);

      if (isEdit) {
        await updateEvent(id, data);
        toast("Event updated successfully! ✨", "success");
      } else {
        await createEvent(data);
        toast("Event created successfully! 🎉", "success");
      }
      navigate("/events");
    } catch (err) {
      toast(err.response?.data?.message || "Failed to save event", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner text="Loading event..." />;

  const CATEGORIES = ["Workshop", "Seminar", "Hackathon", "Cultural", "Sports", "Tech Talk", "Fest", "Other"];

  return (
    <div className="form-page">
      <div className="form-page-card">
        <h1 className="form-page-title">
          {isEdit ? "✏️ Edit Event" : "✦ Add New Event"}
        </h1>
        <p className="form-page-subtitle">
          {isEdit ? "Update event details" : "Fill in the details to create a new campus event"}
        </p>

        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">Event Banner</label>
          <label htmlFor="img-upload" className="file-upload-box" style={{ display: "block" }}>
            {imagePreview ? (
              <div style={{ position: "relative" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12 }}
                />
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
                  borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: "white", fontSize: 14 }}>Click to change</span>
                </div>
              </div>
            ) : (
              <>
                <div className="file-upload-icon">🖼️</div>
                <p>Click to upload event banner</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG up to 10MB</p>
              </>
            )}
            <input id="img-upload" type="file" accept="image/*" onChange={handleImage} />
          </label>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label">Event Title *</label>
          <input
            name="title"
            className={`form-input ${errors.title ? "border-red" : ""}`}
            placeholder="e.g. Annual Tech Fest 2025"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            name="description"
            className={`form-textarea ${errors.description ? "border-red" : ""}`}
            placeholder="Describe the event..."
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{errors.description}</p>}
        </div>

        {/* Date + Time */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              name="date"
              type="date"
              className="form-input"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{errors.date}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              name="time"
              type="time"
              className="form-input"
              value={form.time}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location + Category */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              name="location"
              className="form-input"
              placeholder="e.g. Auditorium, Block A"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              className="form-input"
              value={form.category}
              onChange={handleChange}
              style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Organizer */}
        <div className="form-group">
          <label className="form-label">Organizer</label>
          <input
            name="organizer"
            className="form-input"
            placeholder="e.g. CSE Department"
            value={form.organizer}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            className="btn btn-primary"
            style={{ flex: 2 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? (isEdit ? "Saving..." : "Creating...")
              : (isEdit ? "✓ Save Changes" : "✦ Create Event")}
          </button>
          <button
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={() => navigate("/events")}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEvent;
