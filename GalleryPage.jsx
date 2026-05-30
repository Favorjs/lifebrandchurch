import { useState, useEffect } from "react";
import { FadeIn, PageHero } from "./church.jsx";
import { subscribe, subscribeSetting, COLS } from "./firebase.js";

const DEFAULT_GALLERY_CATS = ["Worship", "Events", "Outreach", "Youth", "Community"];

const FALLBACK_GALLERY = [
  { src: "/images/content/gallery/filter_img1.jpg", alt: "Sunday Worship Service",    category: "Worship"  },
  { src: "/images/content/gallery/filter_img2.jpg", alt: "Church Community Event",    category: "Events"   },
  { src: "/images/content/gallery/filter_img3.jpg", alt: "Youth Ministry Meeting",    category: "Youth"    },
  { src: "/images/content/gallery/filter_img4.jpg", alt: "Community Outreach Lagos",  category: "Outreach" },
  { src: "/images/content/gallery/filter_img5.jpg", alt: "Praise & Worship Night",    category: "Worship"  },
  { src: "/images/content/gallery/filter_img6.jpg", alt: "Annual Church Conference",  category: "Events"   },
  { src: "/images/content/gallery/filter_img7.jpg", alt: "Youth Prayer Rally",        category: "Youth"    },
  { src: "/images/content/gallery/filter_img8.jpg", alt: "Ogba Community Mission",    category: "Outreach" },
  { src: "/images/content/event_img1.jpg",          alt: "Sunday Gathering",          category: "Events"   },
  { src: "/images/content/event_img2.jpg",          alt: "Midweek Bible Study",       category: "Worship"  },
  { src: "/images/content/event_img3.jpg",          alt: "Outreach Programme",        category: "Outreach" },
  { src: "/images/content/event_img4.jpg",          alt: "Youth Summer Camp",         category: "Youth"    },
  { src: "/images/content/event_img5.jpg",          alt: "Church Anniversary",        category: "Events"   },
  { src: "/images/content/event_img6.jpg",          alt: "Choir Concert",             category: "Worship"  },
  { src: "/images/content/recent_img1.jpg",         alt: "Community Breakfast",       category: "Outreach" },
  { src: "/images/content/recent_img2.jpg",         alt: "Children's Ministry",       category: "Youth"    },
  { src: "/images/content/recent_img3.jpg",         alt: "Prayer Morning",            category: "Worship"  },
  { src: "/images/content/blog_img1.jpg",           alt: "Gospel Meeting",            category: "Events"   },
];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [fbItems, setFbItems] = useState(null);
  const [cats,    setCats]    = useState(DEFAULT_GALLERY_CATS);

  useEffect(() => subscribe(COLS.gallery, setFbItems), []);
  useEffect(() => subscribeSetting("gallery_cats", (d) => {
    if (d?.cats?.length) setCats(d.cats);
  }), []);

  // Normalise Firebase shape {url, alt, category} → {src, alt, category}
  const allItems = fbItems !== null && fbItems.length > 0
    ? fbItems.map((i) => ({ src: i.url, alt: i.alt || "", category: i.category || "Worship" }))
    : FALLBACK_GALLERY;

  const filtered = active === "All" ? allItems : allItems.filter((i) => i.category === active);

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox((l) => (l === 0 ? filtered.length - 1 : l - 1));
  const nextImg = () => setLightbox((l) => (l === filtered.length - 1 ? 0 : l + 1));

  // Keyboard navigation
  const onKey = (e) => {
    if (lightbox === null) return;
    if (e.key === "ArrowLeft") prevImg();
    if (e.key === "ArrowRight") nextImg();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <div onKeyDown={onKey} tabIndex={-1} style={{ outline: "none" }}>
      <PageHero
        image="/images/header/slider_img3.jpg"
        title="Our Gallery"
        subtitle="Moments of worship, community, service and joy — captured in the life of Life Brand Church."
        breadcrumb="Life Brand Church"
      />

      {/* ── Filter tabs ── */}
      <section style={{ padding: "56px 24px 16px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="label" style={{ justifyContent: "center" }}>Browse Photos</div>
              <h2 className="section-title" style={{ marginBottom: 32 }}>Photo Gallery</h2>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {["All", ...cats].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn${active === cat ? " active" : ""}`}
                    onClick={() => setActive(cat)}
                  >
                    {cat}
                    {active === cat && (
                      <span style={{ marginLeft: 6, fontSize: "0.6rem" }}>
                        ({cat === "All" ? allItems.length : allItems.filter((i) => i.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Grid ── */}
      <section style={{ padding: "0 24px 90px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div
            className="gallery-grid-4"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}
          >
            {filtered.map((item, i) => (
              <FadeIn key={`${active}-${i}`} delay={(i % 8) * 0.05}>
                <div className="gallery-item" onClick={() => openLightbox(i)}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    onError={(e) => { e.target.parentElement.style.background = "var(--cream-dim)"; e.target.style.display = "none"; }}
                  />
                  <div className="gallery-item-overlay">
                    <div>
                      <span className="tag" style={{ marginBottom: 4, display: "block" }}>{item.category}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--white)", fontWeight: 500 }}>{item.alt}</span>
                    </div>
                  </div>
                  {/* Zoom icon */}
                  <div style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.3s" }}
                    className="gallery-zoom-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
              <p>No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImg(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <img
              src={filtered[lightbox]?.src}
              alt={filtered[lightbox]?.alt}
              className="lightbox-img"
            />
            <div style={{ textAlign: "center" }}>
              <span className="tag tag-red" style={{ marginRight: 8 }}>{filtered[lightbox]?.category}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{filtered[lightbox]?.alt}</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
              {lightbox + 1} / {filtered.length}
            </span>
          </div>
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); nextImg(); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      )}

      {/* Gallery zoom icon CSS */}
      <style>{`
        .gallery-item:hover .gallery-zoom-icon { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
