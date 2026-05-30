import { useState, useEffect } from "react";
import { FadeIn, PageHero, DarkSection } from "./church.jsx";
import { subscribe, COLS } from "./firebase.js";

const FALLBACK_SERMONS = [
  { id: 1, title: "The Law Demands, but Grace Supplies",    pastor: "Apostle Olusayo Oyebola Ajao", date: "May 19, 2026", duration: "52 min", category: "Grace",       thumbnail: "/images/content/serm_img1.jpg", youtubeId: "xImpyYRVGOc" },
  { id: 2, title: "Sharing Our Faith & Love To Children",   pastor: "Apostle Olusayo Oyebola Ajao", date: "May 12, 2026", duration: "45 min", category: "Evangelism",  thumbnail: "/images/content/serm_img2.jpg", youtubeId: "xImpyYRVGOc" },
  { id: 3, title: "Walking in the Spirit",                   pastor: "Apostle Olusayo Oyebola Ajao", date: "May 5, 2026",  duration: "48 min", category: "Holy Spirit", thumbnail: "/images/content/serm_img3.jpg", youtubeId: "xImpyYRVGOc" },
  { id: 4, title: "The Power of Prayer",                     pastor: "Apostle Olusayo Oyebola Ajao", date: "Apr 28, 2026", duration: "40 min", category: "Prayer",      thumbnail: "/images/content/serm_img4.jpg", youtubeId: "xImpyYRVGOc" },
  { id: 5, title: "Delight Yourself in the Lord",            pastor: "Apostle Olusayo Oyebola Ajao", date: "Apr 21, 2026", duration: "55 min", category: "Faith",       thumbnail: "/images/content/serm_img5.jpg", youtubeId: "xImpyYRVGOc" },
];

const FALLBACK_BLOGS = [
  { id: 1, title: "Lord of Our Life & Our Salvation",        date: "May 15, 2026", author: "Apostle Olusayo Oyebola Ajao", image: "/images/content/blog_img1.jpg",   excerpt: "Discover how placing God at the centre of your life transforms every aspect of your daily walk and fills every corner with His light..." },
  { id: 2, title: "The Joy of Community Service",            date: "May 10, 2026", author: "Life Brand Church",   image: "/images/content/blog_img2.jpg",   excerpt: "Our recent outreach in Ogba showed the power of love in action. Read how lives were touched, souls were saved, and hope was restored..." },
  { id: 3, title: "Children's Adoption Ministry Update",     date: "May 5, 2026",  author: "Youth Ministry",     image: "/images/content/event_img1.jpg",  excerpt: "The Lord is moving through our children's ministry. Testimonies from families who were blessed by the love of God made practical..." },
  { id: 4, title: "Faith Develops Perseverance",             date: "Apr 28, 2026", author: "Apostle Olusayo Oyebola Ajao", image: "/images/content/event_img2.jpg",  excerpt: "In seasons of trial, we discover the depth of our faith and the faithfulness of God who never fails and never forsakes His people..." },
];

const MINISTRIES_DETAIL = [
  {
    title: "Worship Ministry",
    desc: "Our worship team leads the congregation into the presence of God through anointed music, singing and creative arts every Sunday and at special events.",
    image: "/images/content/serm_img1.jpg",
  },
  {
    title: "Prayer Ministry",
    desc: "Intercession is the backbone of Life Brand Church. Our prayer teams meet weekly to stand in the gap for our city, nation and the world.",
    image: "/images/content/serm_img2.jpg",
  },
  {
    title: "Youth & Children",
    desc: "Raising up the next generation in the way of God. From children's Sunday school to teen bible studies and youth camps, we invest in young lives.",
    image: "/images/content/serm_img3.jpg",
  },
  {
    title: "Community Outreach",
    desc: "Bringing practical love and the gospel to Ogba, Ikeja and beyond. Feeding programmes, medical outreach, evangelism and community development.",
    image: "/images/content/serm_img4.jpg",
  },
];

export default function SermonsPage() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSermonsTab, setActiveSermonsTab] = useState("All");
  const [fbSermons, setFbSermons] = useState(null);
  const [fbBlogs, setFbBlogs] = useState(null);

  useEffect(() => subscribe(COLS.sermons, setFbSermons), []);
  useEffect(() => subscribe(COLS.blogs,   setFbBlogs),   []);

  const SERMONS    = fbSermons !== null && fbSermons.length > 0 ? fbSermons : FALLBACK_SERMONS;
  const BLOG_POSTS = fbBlogs   !== null && fbBlogs.length   > 0 ? fbBlogs   : FALLBACK_BLOGS;

  // Set first sermon as active once data is available
  useEffect(() => {
    if (!activeVideo && SERMONS.length > 0) setActiveVideo(SERMONS[0]);
  }, [SERMONS]);

  return (
    <div>
      <style>{`
        @media (max-width: 820px) {
          .sm-video-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 640px) {
          .sm-sermon-sidebar-label { display: none; }
          .sm-sermon-list > div { padding: 12px !important; }
          .sm-sermon-list img { width: 56px !important; height: 38px !important; }
        }
      `}</style>
      <PageHero
        image="/images/content/sermons_bg.jpg"
        title="Sermons & Ministries"
        subtitle="Be fed by the Word of God. Watch, listen and grow — every message is a seed planted for eternity."
        breadcrumb="Life Brand Church"
      />

      {/* ── FEATURED VIDEO PLAYER ── */}
      {activeVideo && <DarkSection style={{ padding: "80px 24px", background: "var(--charcoal)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div className="label-blue">Now Playing</div>
            <h2 className="section-title-light" style={{ marginBottom: 40 }}>Latest Sermon</h2>
          </FadeIn>
          <div className="about-grid sm-video-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" }}>
            <FadeIn>
              <div>
                <div className="video-container" style={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1`}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div style={{ marginTop: 24 }}>
                  <span className="tag tag-red" style={{ marginBottom: 12, display: "inline-block" }}>{activeVideo.category}</span>
                  <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", fontWeight: 400, color: "var(--white)", marginBottom: 10, lineHeight: 1.4 }}>{activeVideo.title}</h3>
                  <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)" }}>
                      <span style={{ color: "var(--red-light)" }}>— </span>{activeVideo.pastor}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>{activeVideo.date}</span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>⏱ {activeVideo.duration}</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Sermon list sidebar */}
            <FadeIn delay={0.15}>
              <div>
                <div className="sm-sermon-sidebar-label" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: 16 }}>
                  Recent Sermons
                </div>
                <div className="sm-sermon-list" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {SERMONS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setActiveVideo(s)}
                      style={{
                        display: "flex", gap: 14, padding: "14px 16px",
                        background: activeVideo.id === s.id ? "rgba(229,69,43,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${activeVideo.id === s.id ? "rgba(229,69,43,0.3)" : "rgba(0,102,204,0.12)"}`,
                        borderLeft: activeVideo.id === s.id ? "3px solid var(--red)" : "3px solid transparent",
                        borderRadius: "0 4px 4px 0",
                        cursor: "pointer", transition: "all 0.3s", alignItems: "center",
                      }}
                      onMouseEnter={(e) => { if (activeVideo.id !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                      onMouseLeave={(e) => { if (activeVideo.id !== s.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    >
                      <div style={{ position: "relative", flexShrink: 0, width: 72, height: 48, borderRadius: 2, overflow: "hidden" }}>
                        <img src={s.thumbnail} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { e.target.style.background = "var(--charcoal-2)"; e.target.style.display = "block"; }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", background: activeVideo.id === s.id ? "var(--red)" : "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg viewBox="0 0 24 24" fill={activeVideo.id === s.id ? "white" : "var(--charcoal)"} width="8" height="8"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, color: activeVideo.id === s.id ? "var(--white)" : "rgba(255,255,255,0.65)", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>{s.date} · {s.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </DarkSection>}

      {/* ── SERMON ARCHIVE ── */}
      <section style={{ padding: "90px 24px", background: "var(--cream-dim)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
              <div>
                <div className="label">Sermon Archive</div>
                <h2 className="section-title">All Messages</h2>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", "Grace", "Prayer", "Faith", "Holy Spirit", "Evangelism"].map((tab) => (
                  <button
                    key={tab}
                    className={`filter-btn${activeSermonsTab === tab ? " active" : ""}`}
                    style={{ padding: "6px 14px", fontSize: "0.68rem" }}
                    onClick={() => setActiveSermonsTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="sermons-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {SERMONS.filter((s) => activeSermonsTab === "All" || s.category === activeSermonsTab).map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.08}>
                <div className="sermon-card" onClick={() => { setActiveVideo(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={s.thumbnail} alt={s.title} style={{ width: "100%", height: 190, objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                      onError={(e) => { e.target.style.background = "var(--cream-dim)"; e.target.style.minHeight = "190px"; e.target.style.display = "block"; }} />
                    <div className="video-thumbnail" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div className="play-btn">
                        <svg viewBox="0 0 24 24" fill="white" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <span className="tag tag-red">{s.category}</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <h4 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 10, lineHeight: 1.4 }}>{s.title}</h4>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{s.pastor}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--stone)" }}>|</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.date}</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--stone)" }}>|</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--red)" }}>⏱ {s.duration}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                      <button className="btn-red" style={{ fontSize: "0.68rem", padding: "8px 16px" }}
                        onClick={(e) => { e.stopPropagation(); setActiveVideo(s); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                        ▶ Watch
                      </button>
                      <a href={`https://www.youtube.com/watch?v=${s.youtubeId}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: "0.68rem", padding: "7px 14px", background: "none", border: "1.5px solid var(--stone)", borderRadius: 2, color: "var(--text-muted)", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                        onClick={(e) => e.stopPropagation()}>
                        YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG SECTION ── */}
      <section style={{ padding: "90px 24px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="label" style={{ justifyContent: "center" }}>Reflections</div>
              <h2 className="section-title">Latest Blog Posts</h2>
            </div>
          </FadeIn>
          <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}>
            {BLOG_POSTS.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.08}>
                <div className="blog-card">
                  <div style={{ overflow: "hidden" }}>
                    <img src={post.image} alt={post.title}
                      onError={(e) => { e.target.style.background = "var(--cream-dim)"; e.target.style.height = "200px"; e.target.style.display = "block"; }} />
                  </div>
                  <div style={{ padding: "22px 24px" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)" }}>{post.date}</span>
                      <span style={{ color: "var(--stone)", fontSize: "0.7rem" }}>|</span>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{post.author}</span>
                    </div>
                    <h4 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 10, lineHeight: 1.4 }}>{post.title}</h4>
                    <p style={{ fontSize: "0.84rem", lineHeight: 1.72, color: "var(--text-muted)", marginBottom: 18 }}>{post.excerpt}</p>
                    <button className="btn-outline" style={{ fontSize: "0.68rem", padding: "8px 18px" }}>Read More</button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── MINISTRIES ── */}
      <DarkSection style={{ padding: "90px 24px", background: "var(--charcoal)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="label-blue" style={{ justifyContent: "center" }}>Get Involved</div>
              <h2 className="section-title-light">Our Ministries</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {MINISTRIES_DETAIL.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card" style={{ overflow: "hidden" }}>
                  <div style={{ position: "relative", overflow: "hidden", height: 180 }}>
                    <img src={m.image} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                      onError={(e) => { e.target.style.background = "var(--charcoal-2)"; e.target.style.height = "180px"; e.target.style.display = "block"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,22,40,0.85))" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 16 }}>
                      <div style={{ width: 20, height: 2, background: "var(--red)", marginBottom: 6 }} />
                      <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--white)" }}>{m.title}</h3>
                    </div>
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <p style={{ fontSize: "0.84rem", lineHeight: 1.72, color: "rgba(255,255,255,0.45)" }}>{m.desc}</p>
                    <button className="btn-red" style={{ marginTop: 16, fontSize: "0.68rem", padding: "8px 18px" }}>Join Ministry</button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </DarkSection>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: "80px 24px", background: "var(--cream-dim)", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ width: 32, height: 3, background: "var(--red)", margin: "0 auto 28px" }} />
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.15rem, 2.2vw, 1.65rem)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.82, color: "var(--text)", marginBottom: 20 }}>
              "Life Brand Church provides tools, teams, and times to help individuals — and the church family as a whole — pray. Prayer is vitally important to your relationship with God."
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <img src="/images/content/client_img.jpg" alt="Apostle Olusayo Oyebola Ajao" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--red)" }}
                onError={(e) => { e.target.style.display = "none"; }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 700, color: "var(--text)" }}>Apostle Olusayo Oyebola Ajao</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "var(--red)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Senior Pastor</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
