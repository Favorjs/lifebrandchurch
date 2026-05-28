import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn, PageHero, DarkSection } from "./church.jsx";

const CATEGORIES = ["All", "Worship", "Youth", "Outreach", "Study", "Arts", "Fellowship"];

const EVENTS_DATA = [
  {
    month: "JUN", day: "01", year: "2026",
    title: "Sunday Worship Service",
    category: "Worship",
    time: "8:00 AM – 11:00 AM",
    location: "Main Auditorium, Life Brand Church",
    desc: "Join us for powerful praise, worship and the preaching of God's Word. Every Sunday is a new encounter with the living God.",
    image: "/images/content/event_img1.jpg",
    featured: true,
  },
  {
    month: "JUN", day: "08", year: "2026",
    title: "Midweek Bible Study",
    category: "Study",
    time: "6:30 PM – 8:30 PM",
    location: "Fellowship Hall, Life Brand Church",
    desc: "Dig deeper into the Word with your church family. Every Wednesday we study, grow and build community together.",
    image: "/images/content/event_img2.jpg",
    featured: false,
  },
  {
    month: "JUN", day: "14", year: "2026",
    title: "Youth Prayer Rally",
    category: "Youth",
    time: "4:00 PM – 7:00 PM",
    location: "Youth Hall, Life Brand Church",
    desc: "A special prayer and revival meeting for teens and young adults aged 13–25. Come expecting God to move powerfully.",
    image: "/images/content/event_img3.jpg",
    featured: true,
  },
  {
    month: "JUN", day: "22", year: "2026",
    title: "Community Outreach Day",
    category: "Outreach",
    time: "9:00 AM – 2:00 PM",
    location: "Ogba Market Area, Ikeja, Lagos",
    desc: "Serving our Ogba-Ikeja community with love, food and practical care. Come join us in showing God's love to our neighbours.",
    image: "/images/content/event_img4.jpg",
    featured: false,
  },
  {
    month: "JUN", day: "28", year: "2026",
    title: "Night of Worship",
    category: "Worship",
    time: "7:00 PM – 10:00 PM",
    location: "Main Auditorium, Life Brand Church",
    desc: "An extended evening of praise, worship and encounter with God. No sermon — just music, prayer and His glorious presence.",
    image: "/images/content/event_img5.jpg",
    featured: true,
  },
  {
    month: "JUL", day: "06", year: "2026",
    title: "Choir & Arts Festival",
    category: "Arts",
    time: "11:00 AM – 4:00 PM",
    location: "Main Auditorium, Life Brand Church",
    desc: "Celebrating God through music, dance and creative arts ministry. All ages are welcome — come and be blessed and inspired.",
    image: "/images/content/event_img6.jpg",
    featured: false,
  },
  {
    month: "JUL", day: "13", year: "2026",
    title: "Men's Breakfast & Prayer",
    category: "Fellowship",
    time: "8:00 AM – 10:00 AM",
    location: "Dining Hall, Life Brand Church",
    desc: "Men of God gathering for food, fellowship and fire. A monthly event for the men of Life Brand Church to connect and grow.",
    image: "/images/content/recent_img1.jpg",
    featured: false,
  },
  {
    month: "JUL", day: "20", year: "2026",
    title: "Healing & Deliverance Service",
    category: "Worship",
    time: "9:00 AM – 1:00 PM",
    location: "Main Auditorium, Life Brand Church",
    desc: "A special service focused on healing, deliverance and restoration. Come with faith in God's power and leave with breakthrough.",
    image: "/images/content/recent_img2.jpg",
    featured: true,
  },
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = activeFilter === "All"
    ? EVENTS_DATA
    : EVENTS_DATA.filter((e) => e.category === activeFilter);

  const featured = filtered.filter((e) => e.featured);
  const regular  = filtered.filter((e) => !e.featured);

  return (
    <div>
      <PageHero
        image="/images/content/event_img1.jpg"
        title="Events & Programmes"
        subtitle="Join us as we worship, serve, pray and grow together. There's always something happening at Life Brand Church."
        breadcrumb="Life Brand Church"
      />

      {/* ── Filter bar ── */}
      <section style={{ padding: "52px 24px 8px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="label" style={{ justifyContent: "center" }}>Browse Events</div>
              <h2 className="section-title" style={{ marginBottom: 28 }}>Upcoming Events</h2>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn${activeFilter === cat ? " active" : ""}`}
                    onClick={() => setActiveFilter(cat)}
                  >
                    {cat}
                    {cat !== "All" && (
                      <span style={{ marginLeft: 5, fontSize: "0.62rem", opacity: 0.7 }}>
                        ({EVENTS_DATA.filter((e) => e.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Featured events (cards) ── */}
      {featured.length > 0 && (
        <section style={{ padding: "32px 24px 0", background: "var(--cream)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--red)" }}>
                  Featured
                </span>
              </div>
            </FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
              {featured.map((event, i) => (
                <FadeIn key={`${event.month}-${event.day}`} delay={i * 0.09}>
                  <EventCard event={event} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Regular events (rows) ── */}
      {regular.length > 0 && (
        <section style={{ padding: "32px 24px 90px", background: "var(--cream)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            {featured.length > 0 && (
              <FadeIn>
                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "28px 0 20px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold-dark)" }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dark)" }}>
                    More Events
                  </span>
                </div>
              </FadeIn>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {regular.map((event, i) => (
                <FadeIn key={`${event.month}-${event.day}`} delay={i * 0.06}>
                  <EventRow event={event} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section style={{ padding: "80px 24px 90px", background: "var(--cream)", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>No events in this category right now. Check back soon!</p>
        </section>
      )}

      {/* ── Newsletter CTA ── */}
      <DarkSection style={{ padding: "72px 24px", background: "var(--charcoal)", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/content/video_bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08 }} />
        <FadeIn>
          <div style={{ width: 32, height: 3, background: "var(--red)", margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 200, color: "var(--white)", marginBottom: 12 }}>
            Don't Miss What God is Doing
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.42)", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.75 }}>
            Subscribe to our newsletter and never miss an event, sermon or announcement from Life Brand Church.
          </p>
          <div style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 420, margin: "0 auto 24px" }}>
            <input
              type="email"
              placeholder="Enter your email address"
              style={{ flex: 1, padding: "13px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,102,204,0.2)", borderRight: "none", borderRadius: "2px 0 0 2px", color: "var(--cream)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none" }}
            />
            <button className="btn-red" style={{ borderRadius: "0 2px 2px 0", padding: "13px 22px", flexShrink: 0 }}>
              Subscribe
            </button>
          </div>
          <button
            className="btn-ghost"
            style={{ fontSize: "0.72rem" }}
            onClick={() => { navigate("/"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 200); }}
          >
            Contact Us
          </button>
        </FadeIn>
      </DarkSection>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EventCard({ event }) {
  return (
    <div
      style={{ borderRadius: 4, overflow: "hidden", background: "var(--white)", border: "1px solid var(--stone)", transition: "all 0.4s cubic-bezier(.22,1,.36,1)" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-7px)"; e.currentTarget.style.boxShadow = "0 22px 60px rgba(10,22,40,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: 216 }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          onError={(e) => { e.target.style.background = "var(--cream-dim)"; e.target.style.height = "216px"; }}
        />
        {/* Category tag */}
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <span className="tag tag-red">{event.category}</span>
        </div>
        {/* Date badge */}
        <div style={{ position: "absolute", top: 12, right: 12, background: "var(--charcoal)", color: "var(--white)", borderRadius: 2, padding: "8px 12px", textAlign: "center", backdropFilter: "blur(8px)" }}>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.16em", color: "var(--red-light)", textTransform: "uppercase" }}>{event.month}</div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.5rem", fontWeight: 300, lineHeight: 1 }}>{event.day}</div>
        </div>
      </div>
      <div style={{ padding: "22px 24px" }}>
        <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 12, lineHeight: 1.35 }}>{event.title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.5" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{event.time}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold-dark)" strokeWidth="1.5" width="13" height="13" style={{ flexShrink: 0, marginTop: 1 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{event.location}</span>
          </div>
        </div>
        <p style={{ fontSize: "0.84rem", lineHeight: 1.7, color: "var(--text-muted)", marginBottom: 18 }}>{event.desc}</p>
        <button className="btn-red" style={{ fontSize: "0.7rem", padding: "9px 22px" }}>Join Us</button>
      </div>
    </div>
  );
}

function EventRow({ event }) {
  return (
    <div
      style={{ display: "flex", gap: 20, padding: "18px 22px", background: "var(--white)", border: "1px solid var(--stone)", borderLeft: "3px solid var(--gold-dark)", borderRadius: "0 4px 4px 0", alignItems: "center", transition: "all 0.3s", flexWrap: "wrap" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = "var(--red)"; e.currentTarget.style.transform = "translateX(5px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(10,22,40,0.07)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = "var(--gold-dark)"; e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Date chip */}
      <div style={{ background: "var(--charcoal)", borderRadius: 3, padding: "9px 13px", textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.16em", color: "var(--red-light)", textTransform: "uppercase" }}>{event.month}</div>
        <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.4rem", fontWeight: 300, color: "var(--white)", lineHeight: 1 }}>{event.day}</div>
      </div>
      {/* Thumbnail */}
      <div style={{ width: 68, height: 52, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
        <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.target.style.background = "var(--cream-dim)"; }} />
      </div>
      {/* Details */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
          <h4 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1rem", fontWeight: 600, color: "var(--charcoal)" }}>{event.title}</h4>
          <span className="tag">{event.category}</span>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.77rem", color: "var(--text-muted)" }}>⏰ {event.time}</span>
          <span style={{ fontSize: "0.77rem", color: "var(--text-muted)" }}>📍 {event.location}</span>
        </div>
      </div>
      <button className="btn-outline" style={{ fontSize: "0.66rem", padding: "8px 18px", flexShrink: 0 }}>Join Us</button>
    </div>
  );
}
