import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./hooks/useToast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import AddEvent from "./pages/AddEvent";
import AuthPage from "./pages/AuthPage";
import MusicToggle from "./components/MusicToggle";

function ProtectedRoute({ children, facultyOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  if (facultyOnly && role !== "faculty") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <span style={{ fontSize: 64 }}>🚫</span>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 28 }}>Access Denied</h2>
        <p style={{ color: "var(--text-muted)" }}>This page is only accessible to faculty members.</p>
      </div>
    );
  }

  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <MusicToggle />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route
                path="/add-event"
                element={
                  <ProtectedRoute facultyOnly>
                    <AddEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-event/:id"
                element={
                  <ProtectedRoute facultyOnly>
                    <AddEvent />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
