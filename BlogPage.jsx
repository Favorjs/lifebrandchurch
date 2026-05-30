import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FadeIn, PageHero } from "./church.jsx";
import { subscribe, COLS } from "./firebase.js";

const FALLBACK_BLOGS = [
  { id: 1, title: "Lord of Our Life & Our Salvation",        date: "May 15, 2026", author: "Apostle Olusayo Oyebola Ajao", image: "/images/content/blog_img1.jpg",  excerpt: "Discover how placing God at the centre of your life transforms every aspect of your daily walk and fills every corner with His light...", content: "" },
  { id: 2, title: "The Joy of Community Service",            date: "May 10, 2026", author: "Life Brand Church",             image: "/images/content/blog_img2.jpg",  excerpt: "Our recent outreach in Ogba showed the power of love in action. Read how lives were touched, souls were saved, and hope was restored...", content: "" },
  { id: 3, title: "Children's Adoption Ministry Update",     date: "May 5, 2026",  author: "Youth Ministry",               image: "/images/content/event_img1.jpg", excerpt: "The Lord is moving through our children's ministry. Testimonies from families who were blessed by the love of God made practical...", content: "" },
  { id: 4, title: "Faith Develops Perseverance",             date: "Apr 28, 2026", author: "Apostle Olusayo Oyebola Ajao", image: "/images/content/event_img2.jpg", excerpt: "In seasons of trial, we discover the depth of our faith and the faithfulness of God who never fails and never forsakes His people...", content: "" },
];

export default function BlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fbBlogs, setFbBlogs] = useState(null);

  useEffect(() => subscribe(COLS.blogs, setFbBlogs), []);

  const blogs  = fbBlogs !== null && fbBlogs.length > 0 ? fbBlogs : FALLBACK_BLOGS;
  const post   = blogs.find((b) => String(b.id) === String(id));
  const others = blogs.filter((b) => String(b.id) !== String(id));

  if (!post) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "var(--text-muted)" }}>Blog post not found.</p>
        <button className="btn-outline" onClick={() => navigate("/sermons")}>← Back to Blog</button>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @media (max-width: 860px) {
          .blog-detail-grid { grid-template-columns: 1fr !important; }
          .blog-sidebar { position: static !important; top: auto !important; }
        }
        .blog-content { font-size: 1rem; line-height: 1.9; color: var(--text); }
        .blog-content h2 { font-family: 'Source Serif 4', serif; font-size: 1.5rem; font-weight: 600; color: var(--charcoal); margin: 32px 0 14px; }
        .blog-content h3 { font-family: 'Source Serif 4', serif; font-size: 1.18rem; font-weight: 600; color: var(--charcoal); margin: 24px 0 10px; }
        .blog-content p  { margin-bottom: 16px; }
        .blog-content ul { padding-left: 24px; margin-bottom: 16px; list-style-type: disc; }
        .blog-content ol { padding-left: 24px; margin-bottom: 16px; list-style-type: decimal; }
        .blog-content li { margin-bottom: 6px; }
        .blog-content b, .blog-content strong { font-weight: 700; }
        .blog-content i, .blog-content em     { font-style: italic; }
        .blog-content u  { text-decoration: underline; }
        .blog-content s  { text-decoration: line-through; }
        .blog-content hr { border: none; border-top: 2px solid var(--stone); margin: 32px 0; }
      `}</style>

      <PageHero
        image={post.image || "/images/content/sermons_bg.jpg"}
        title={post.title}
        subtitle={`By ${post.author} · ${post.date}`}
        breadcrumb="Life Brand Church"
      />

      <section style={{ padding: "72px 24px 100px", background: "var(--cream)" }}>
        <div
          className="blog-detail-grid"
          style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 320px", gap: 52, alignItems: "start" }}
        >
          {/* ── Full post content ── */}
          <FadeIn>
            <div>
              {post.image && (
                <div style={{ borderRadius: 4, overflow: "hidden", marginBottom: 36 }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: "100%", maxHeight: 460, objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 28 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--red)" }}>{post.date}</span>
                <span style={{ color: "var(--stone)" }}>·</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)" }}>By {post.author}</span>
              </div>

              <div
                className="blog-content"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt || ""}</p>` }}
              />

              <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--stone)" }}>
                <button className="btn-outline" onClick={() => navigate("/sermons")}>← Back to Blog</button>
              </div>
            </div>
          </FadeIn>

          {/* ── Sidebar: other posts ── */}
          <FadeIn delay={0.15}>
            <div className="blog-sidebar" style={{ position: "sticky", top: 100 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
                More Posts
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {others.slice(0, 5).map((other) => (
                  <div
                    key={other.id}
                    onClick={() => { navigate(`/blog/${other.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    style={{ display: "flex", gap: 14, cursor: "pointer", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--stone)", background: "var(--white)", transition: "all 0.25s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,22,40,0.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--stone)"; e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {other.image && (
                      <img
                        src={other.image}
                        alt={other.title}
                        style={{ width: 68, height: 52, objectFit: "cover", borderRadius: 4, flexShrink: 0 }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 5, lineHeight: 1.35 }}>{other.title}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: "var(--text-muted)" }}>{other.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
