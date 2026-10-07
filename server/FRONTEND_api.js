import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor — auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.clear();
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// ── AUTH ────────────────────────────────────────────────────
export const login    = (data) => api.post("/auth/login",    data);
export const register = (data) => api.post("/auth/register", data);

// ── EVENTS ──────────────────────────────────────────────────
export const getEvents = () => api.get("/events");
export const getEvent  = (id) => api.get(`/events/${id}`);

export const createEvent = (formData) =>
  api.post("/events", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteEvent = (id) => api.delete(`/events/${id}`);

// ── EVENT REGISTRATION ──────────────────────────────────────
// Backend uses req.user._id from JWT — no need to pass userId in body
export const registerForEvent = (userId, eventId) =>
  api.post("/register", { eventId });

export default api;
