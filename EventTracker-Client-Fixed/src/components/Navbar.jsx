import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const role = localStorage.getItem("role");
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setProfileOpen(false);
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none" }}>
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">🎓</span>
        EventTracker
      </Link>

      {/* Desktop Nav */}
      <ul className="nav-links">
        <li>
          <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
        </li>
        <li>
          <Link to="/events" className={isActive("/events") ? "active" : ""}>Events</Link>
        </li>
        {isLoggedIn && role === "faculty" && (
          <li>
            <Link to="/add-event" className={isActive("/add-event") ? "active" : ""}>
              ✦ Add Event
            </Link>
          </li>
        )}

        {isLoggedIn ? (
          <li>
            <div className="profile-menu" ref={profileRef}>
              <button
                className="profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profile-avatar">
                  {role === "faculty" ? "F" : "S"}
                </div>
                <span style={{ textTransform: "capitalize" }}>{role}</span>
                <span style={{ fontSize: "10px" }}>▼</span>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div style={{ padding: "8px 14px 12px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Logged in as</div>
                    <div className="badge" style={{ marginTop: "4px" }}>
                      <span className={`badge badge-${role}`}>
                        {role === "faculty" ? "👨‍🏫" : "🎓"} {role}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "8px 0" }}>
                    <button className="dropdown-item" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ) : (
          <li>
            <Link to="/auth" className="nav-cta">Sign In</Link>
          </li>
        )}
      </ul>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span style={{ transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
        <span style={{ opacity: menuOpen ? 0 : 1 }} />
        <span style={{ transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
        <Link to="/events" onClick={() => setMenuOpen(false)}>🎉 Events</Link>
        {isLoggedIn && role === "faculty" && (
          <Link to="/add-event" onClick={() => setMenuOpen(false)}>✦ Add Event</Link>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout}>🚪 Logout</button>
        ) : (
          <Link to="/auth" onClick={() => setMenuOpen(false)}>Sign In</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
