import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 12,
  color: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#f97316" : "#6c3de8"
}));

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />

        {/* Particles */}
        <div className="hero-particles">
          {PARTICLES.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>✨</span> Your Campus, Your Events
          </div>

          <h1 className="hero-title">
            Discover <span className="gradient-text">Amazing</span><br />
            College Events
          </h1>

          <p className="hero-desc">
            Stay connected with everything happening on campus — workshops, fests,
            seminars, and more. Never miss an event that matters to you.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/events")}
            >
              🎉 Explore Events
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => navigate("/auth")}
            >
              Get Started →
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30+</div>
              <div className="stat-label">Departments</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="section-title">
            Why <span>EventTracker?</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: 16 }}>
            Everything you need to stay in the loop
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24
        }}>
          {[
            { icon: "📅", title: "Upcoming Events", desc: "Browse all upcoming events filtered by date, department, or category." },
            { icon: "🔔", title: "Instant Alerts", desc: "Get notified about new events relevant to your interests and course." },
            { icon: "🎟️", title: "Easy Registration", desc: "One-click event registration with confirmation and reminders." },
            { icon: "👨‍🏫", title: "Faculty Tools", desc: "Faculty can post, edit, and manage events effortlessly." },
          ].map((f, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 28,
              transition: "all 0.3s",
              cursor: "default",
              animation: `fadeInUp 0.5s ease ${i * 0.1 + 0.2}s forwards`,
              opacity: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "rgba(108,61,232,0.5)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.borderColor = "";
              e.currentTarget.style.boxShadow = "";
            }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 40px",
        textAlign: "center",
        background: "radial-gradient(ellipse at 50% 50%, rgba(108,61,232,0.15) 0%, transparent 70%)",
      }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", marginBottom: 16, fontFamily: "Syne, sans-serif" }}>
          Ready to <span style={{
            background: "linear-gradient(135deg, #a78bfa, #f97316)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>get started?</span>
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 16 }}>
          Join thousands of students already using EventTracker
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate("/auth")}>
          Create Free Account
        </button>
      </section>
    </>
  );
}

export default Home;
