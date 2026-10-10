import axios from "axios";

// In development, Vite proxies /api and /uploads to the Express backend.
// For production, set VITE_API_BASE_URL to the deployed backend URL ending in /api.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach token to authenticated requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

// Events
export const getEvents = () => api.get("/events");
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (formData) =>
  api.post("/events", formData);
export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Event registration
export const registerForEvent = (userId, eventId) =>
  api.post("/register", { userId, eventId });

export default api;
