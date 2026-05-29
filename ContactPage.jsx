import { useState } from "react";
import { FadeIn, PageHero, DarkSection } from "./church.jsx";

const SOCIAL_LINKS = [
  { name: "Facebook",  href: "#", color: "#1877f2", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
  { name: "Twitter",   href: "#", color: "#1da1f2", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> },
  { name: "Instagram", href: "#", color: "#e1306c", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { name: "YouTube",   href: "#", color: "#ff0000", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg> },
  { name: "WhatsApp",  href: "#", color: "#25d366", icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg> },
];

const INFO_CARDS = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    label: "Address",
    lines: ["No 34, Ijaiye Road, Carterpillar Bus Stop", "Btw Stanbic IBTC Bank & LG Office", "Ogba, Ikeja, Lagos, Nigeria"],
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    label: "Phone",
    lines: ["+234 803 499 8775", "+61 3 2555 682 458"],
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    label: "Email",
    lines: ["godlove@lifebrandchurch.com"],
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    label: "Service Times",
    lines: ["Sunday: 8:00 AM & 10:30 AM", "Wednesday: 6:30 PM"],
  },
];

export default function ContactPage() {
  const [form, setForm]         = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSubmitted(true);
      setSending(false);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 800);
  };

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <PageHero
        image="/images/header/slider_img3.jpg"
        title="Get In Touch"
        subtitle="We'd love to hear from you. Reach out, visit us, or send a message — our doors are always open."
        breadcrumb="Life Brand Church"
      />

      {/* ── Info cards ── */}
      <section style={{ padding: "72px 24px", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
            {INFO_CARDS.map((card, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div style={{
                  padding: "28px 24px",
                  background: "var(--white)",
                  border: "1px solid var(--stone)",
                  borderTop: "3px solid var(--red)",
                  borderRadius: "0 0 4px 4px",
                  transition: "all 0.35s cubic-bezier(.22,1,.36,1)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 16px 44px rgba(10,22,40,0.09)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(229,69,43,0.08)", border: "1px solid rgba(229,69,43,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--red)", marginBottom: 16 }}>
                    {card.icon}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--red)", marginBottom: 10 }}>
                    {card.label}
                  </div>
                  {card.lines.map((l, j) => (
                    <div key={j} style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.7 }}>{l}</div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section style={{ padding: "80px 24px", background: "var(--cream-dim)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, alignItems: "start" }}>

            {/* Form */}
            <FadeIn>
              <div>
                <div className="label">Send a Message</div>
                <h2 className="section-title" style={{ marginBottom: 10 }}>We'd Love to<br /><span style={{ fontStyle: "italic", color: "var(--gold-dark)" }}>Hear From You</span></h2>
                <div style={{ width: 36, height: 3, background: "linear-gradient(to right, var(--red), var(--gold-dark))", margin: "18px 0 28px", borderRadius: 2 }} />

                {submitted ? (
                  <div style={{ padding: "32px", background: "var(--white)", border: "1px solid var(--stone)", borderLeft: "4px solid #16a34a", borderRadius: "0 4px 4px 0", textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 12 }}>🙏</div>
                    <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--charcoal)", marginBottom: 8 }}>Message Received!</h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                      Thank you for reaching out to Life Brand Church. We'll get back to you as soon as possible. God bless you!
                    </p>
                    <button
                      className="btn-outline"
                      style={{ marginTop: 20, fontSize: "0.76rem" }}
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div className="form-field">
                        <label className="form-label" style={{ color: "var(--text-muted)" }}>Your Name *</label>
                        <input className="form-input" style={{ background: "var(--white)", color: "var(--text)", border: "1px solid var(--stone)" }} type="text" placeholder="John Doe" value={form.name} onChange={f("name")} required />
                      </div>
                      <div className="form-field">
                        <label className="form-label" style={{ color: "var(--text-muted)" }}>Email Address *</label>
                        <input className="form-input" style={{ background: "var(--white)", color: "var(--text)", border: "1px solid var(--stone)" }} type="email" placeholder="john@example.com" value={form.email} onChange={f("email")} required />
                      </div>
                    </div>
                    <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div className="form-field">
                        <label className="form-label" style={{ color: "var(--text-muted)" }}>Phone Number</label>
                        <input className="form-input" style={{ background: "var(--white)", color: "var(--text)", border: "1px solid var(--stone)" }} type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={f("phone")} />
                      </div>
                      <div className="form-field">
                        <label className="form-label" style={{ color: "var(--text-muted)" }}>Subject</label>
                        <select className="form-input" style={{ background: "var(--white)", color: "var(--text)", border: "1px solid var(--stone)", appearance: "auto" }} value={form.subject} onChange={f("subject")}>
                          <option value="">Select a topic</option>
                          <option>General Enquiry</option>
                          <option>Prayer Request</option>
                          <option>Membership</option>
                          <option>Pastoral Counselling</option>
                          <option>Volunteering</option>
                          <option>Events & Programmes</option>
                          <option>Donation</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label" style={{ color: "var(--text-muted)" }}>Message *</label>
                      <textarea
                        className="form-input"
                        style={{ background: "var(--white)", color: "var(--text)", border: "1px solid var(--stone)", minHeight: 140, resize: "vertical" }}
                        placeholder="How can we help you?"
                        value={form.message}
                        onChange={f("message")}
                        required
                      />
                    </div>
                    <button className="btn-red" type="submit" disabled={sending} style={{ padding: "15px", marginTop: 4 }}>
                      {sending ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>

            {/* Right: Pastor card + social */}
            <FadeIn delay={0.15}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Pastor card */}
                <div style={{ background: "var(--white)", border: "1px solid var(--stone)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: 4, background: "linear-gradient(to right, var(--red), var(--gold-dark))" }} />
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                      <img
                        src="/images/content/about/team1.jpg"
                        alt="Apostle Olusayo Oyebola Ajao"
                        style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--stone)" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <div>
                        <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "1.05rem", fontWeight: 600, color: "var(--charcoal)" }}>Apostle Olusayo Oyebola Ajao</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--red)", marginTop: 2 }}>Senior Pastor</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.87rem", lineHeight: 1.75, color: "var(--text-muted)" }}>
                      "Whether you're exploring faith for the first time or looking for a church home, you are welcome at Life Brand Church exactly as you are."
                    </p>
                  </div>
                </div>

                {/* Social media */}
                <div style={{ background: "var(--white)", border: "1px solid var(--stone)", borderRadius: 4, padding: "24px" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
                    Follow Us
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {SOCIAL_LINKS.map((s) => (
                      <a key={s.name} href={s.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 6, border: "1px solid var(--stone)", color: "var(--text)", textDecoration: "none", transition: "all 0.25s", fontSize: "0.85rem", fontWeight: 500 }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = s.color; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.borderColor = "var(--stone)"; }}
                      >
                        <span style={{ color: s.color, transition: "color 0.25s" }}>{s.icon}</span>
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Google Map ── */}
      <section style={{ height: 420 }}>
        <iframe
          src="https://maps.google.com/maps?q=Ogba+Ikeja+Lagos+Nigeria&output=embed&hl=en"
          width="100%"
          height="420"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          title="Life Brand Church — Ogba, Ikeja, Lagos"
        />
      </section>

      {/* ── Visit us CTA ── */}
      <DarkSection style={{ padding: "72px 24px", background: "var(--charcoal)", textAlign: "center" }}>
        <FadeIn>
          <div style={{ width: 32, height: 3, background: "var(--red)", margin: "0 auto 24px" }} />
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 200, color: "var(--white)", marginBottom: 14 }}>
            Come & Join Us This Sunday
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", maxWidth: 460, margin: "0 auto 16px", lineHeight: 1.75 }}>
            First service at 8:00 AM &middot; Second service at 10:30 AM
          </p>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            No 34, Ijaiye Road, Carterpillar Bus Stop, Ogba, Ikeja, Lagos
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://maps.google.com/maps?q=Ogba+Ikeja+Lagos+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", fontSize: "0.76rem" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Get Directions
            </a>
            <a
              href="https://wa.me/?text=Hi%20Life%20Brand%20Church"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", fontSize: "0.76rem" }}
            >
              WhatsApp Us
            </a>
          </div>
        </FadeIn>
      </DarkSection>
    </div>
  );
}
