import { FadeIn, PageHero, DarkSection, useInView } from "./church.jsx";

const TEAM = [
  { name: "Pastor Oyebola Ajao", role: "Senior Pastor", image: "/images/content/about/team1.jpg", bio: "With a heart burning for God and people, Pastor Oyebola leads Life Brand Church in its mission to give light to every nation." },
  { name: "Associate Pastor", role: "Associate Pastor", image: "/images/content/about/team2.jpg", bio: "Serving the congregation with dedication, equipping believers for works of service and spiritual growth." },
  { name: "Youth Pastor", role: "Youth & Children", image: "/images/content/about/team3.jpg", bio: "Passionately investing in the next generation, raising up young people who love God and live for Him." },
  { name: "Women's Leader", role: "Women's Ministry", image: "/images/content/about/team4.jpg", bio: "Building a sisterhood of faith, empowering women to discover their purpose and walk in God's grace." },
];

const BELIEFS = [
  { title: "The Bible", body: "We believe the Bible is the inspired, infallible and authoritative Word of God — the complete and final revelation of God's will." },
  { title: "The Trinity", body: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit — equal in power and glory." },
  { title: "Salvation", body: "We believe salvation is by grace alone, through faith alone, in Christ alone. Jesus died for our sins, rose on the third day and is Lord." },
  { title: "The Holy Spirit", body: "We believe in the present work of the Holy Spirit who indwells, empowers, and gifts believers for service and transformation." },
  { title: "The Church", body: "We believe the Church is the body of Christ, called to worship, fellowship, discipleship, ministry and evangelism." },
  { title: "Eternal Life", body: "We believe in the bodily resurrection of the dead — eternal life for those who believe, and eternal separation for those who reject Christ." },
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        image="/images/header/slider_img2.jpg"
        title="About Life Brand Church"
        subtitle="A community called to give light — serving God, serving people, serving Lagos and beyond."
        breadcrumb="Life Brand Church"
      />

      {/* ── OUR STORY ── */}
      <section style={{ padding: "100px 24px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <FadeIn>
              <div style={{ position: "relative" }}>
                <img src="/images/content/about/story_img.jpg" alt="Our Story" style={{ width: "100%", objectFit: "cover", borderRadius: 4, display: "block", minHeight: 400 }}
                  onError={(e) => { e.target.src = "/images/content/about_img.jpg"; }} />
                <div style={{ position: "absolute", bottom: -24, right: -24, width: 160, height: 160, border: "2px solid var(--red)", borderRadius: 4, pointerEvents: "none", zIndex: -1 }} />
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div>
                <div className="label">Who We Are</div>
                <h2 className="section-title" style={{ marginBottom: 22 }}>Our Story</h2>
                <div style={{ width: 36, height: 3, background: "linear-gradient(to right, var(--red), var(--gold-dark))", marginBottom: 22, borderRadius: 2 }} />
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1rem, 1.8vw, 1.15rem)", fontWeight: 300, lineHeight: 1.88, color: "var(--text)", marginBottom: 16 }}>
                  Life Brand Church was founded with a clear mandate from God — to be a light in the community of Ogba, Ikeja and to reach the nations with the love and power of the Holy Spirit.
                </p>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.82, color: "var(--text-muted)", marginBottom: 16 }}>
                  Under the leadership of Pastor Oyebola Ajao, we have grown into a vibrant, Spirit-filled congregation that believes in the full gospel of Jesus Christ. Every Sunday, every Wednesday, and through every outreach — we carry the message: <em style={{ color: "var(--red)", fontStyle: "normal", fontWeight: 600 }}>Giving Light.</em>
                </p>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.82, color: "var(--text-muted)" }}>
                  We are more than a church — we are a family. A place where seekers find answers, the broken find healing, the lost find home, and every believer grows deeper in faith, love and purpose.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── MISSION VISION VALUES ── */}
      <DarkSection style={{ padding: "90px 24px", background: "var(--charcoal)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div className="label-blue" style={{ justifyContent: "center" }}>Our Foundation</div>
              <h2 className="section-title-light">Mission, Vision &amp; Values</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                icon: "🔥", title: "Our Mission",
                body: "To give light — reaching every person with the gospel of Jesus Christ, making disciples who worship God, grow in love, and serve the world.",
                color: "var(--red)",
              },
              {
                icon: "👁️", title: "Our Vision",
                body: "To see a generation transformed by God's Word and Spirit — a church that shines as a city on a hill, impossible to ignore, impossible to resist.",
                color: "var(--gold-light)",
              },
              {
                icon: "✦", title: "Our Values",
                body: "Glorify God. Believe the Bible. Love the Community. Love People. These four pillars define everything we do, every decision we make.",
                color: "var(--gold)",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="glass-card" style={{ padding: "40px 32px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 18 }}>{item.icon}</div>
                  <div style={{ width: 28, height: 2, background: item.color, marginBottom: 16 }} />
                  <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--white)", marginBottom: 14 }}>{item.title}</h3>
                  <p style={{ fontSize: "0.88rem", lineHeight: 1.78, color: "rgba(255,255,255,0.48)" }}>{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </DarkSection>

      {/* ── WHAT WE DO ── */}
      <section style={{ padding: "90px 24px", background: "var(--cream-dim)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="label" style={{ justifyContent: "center" }}>Our Activity</div>
              <h2 className="section-title">What We Do</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              "Getting Through Hard Times",
              "Developing A Spiritual Mentality",
              "Sharing Is Caring",
              "Connect With Others",
              "Let The Sunset Inspire You",
              "Always Love One Another in the Lord",
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "var(--white)", border: "1px solid var(--stone)", borderLeft: "3px solid var(--red)", borderRadius: "0 4px 4px 0", transition: "all 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderLeftColor = "var(--gold-dark)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderLeftColor = "var(--red)"; }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500, color: "var(--text)" }}>{item}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR BELIEFS ── */}
      <section style={{ padding: "90px 24px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="label" style={{ justifyContent: "center" }}>What We Believe</div>
              <h2 className="section-title">Core Beliefs</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {BELIEFS.map((b, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{ padding: "32px 28px", background: "var(--white)", border: "1px solid var(--stone)", borderRadius: 4, borderTop: "3px solid var(--gold-dark)", transition: "all 0.4s cubic-bezier(.22,1,.36,1)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderTopColor = "var(--red)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(10,22,40,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderTopColor = "var(--gold-dark)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 6, height: 6, background: "var(--red)", borderRadius: "50%", flexShrink: 0 }} />
                    <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--charcoal)" }}>{b.title}</h3>
                  </div>
                  <p style={{ fontSize: "0.87rem", lineHeight: 1.75, color: "var(--text-muted)" }}>{b.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP TEAM ── */}
      <DarkSection style={{ padding: "90px 24px", background: "var(--charcoal-2)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div className="label-blue" style={{ justifyContent: "center" }}>Meet The Team</div>
              <h2 className="section-title-light">Our Leadership</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {TEAM.map((member, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="team-card">
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img src={member.image} alt={member.name} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
                      onError={(e) => { e.target.style.background = "var(--cream-dim)"; e.target.style.height = "260px"; e.target.style.display = "block"; e.target.src = "/images/content/client_img.jpg"; }} />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "linear-gradient(to right, var(--red), var(--gold-dark))" }} />
                  </div>
                  <div style={{ padding: "20px 22px" }}>
                    <h4 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--charcoal)", marginBottom: 4 }}>{member.name}</h4>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginBottom: 12 }}>{member.role}</div>
                    {member.bio && <p style={{ fontSize: "0.84rem", lineHeight: 1.7, color: "var(--text-muted)" }}>{member.bio}</p>}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </DarkSection>

      {/* ── CTA ── */}
      <DarkSection style={{ padding: "80px 24px", background: "var(--charcoal)", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/content/testi_bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1 }} />
        <FadeIn>
          <div style={{ width: 36, height: 3, background: "var(--red)", margin: "0 auto 28px" }} />
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 200, color: "var(--white)", marginBottom: 16 }}>
            Come As You Are
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75 }}>
            You don't have to have it all together. Just come, and discover a community that loves God, loves people, and loves you.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-red" onClick={() => { window.location.hash = "/"; setTimeout(() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }), 200); }}>
              Join a Service
            </button>
            <button className="btn-ghost" onClick={() => { window.location.hash = "/"; setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 200); }}>
              Contact Us
            </button>
          </div>
        </FadeIn>
      </DarkSection>
    </div>
  );
}
