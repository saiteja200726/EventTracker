import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request
api.interceptors.request.use(config => {
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
  api.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Registration
export const registerForEvent = (userId, eventId) =>
  api.post("/register", { userId, eventId });

export default api;
