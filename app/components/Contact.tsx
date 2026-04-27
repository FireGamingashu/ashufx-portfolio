"use client";
import styles from "./Contact.module.css";

const socials = [
  { label: "Instagram", href: "https://instagram.com/ashu.fx.psd", icon: "◈" },
  { label: "LinkedIn", href: "https://linkedin.com/in/ashufx", icon: "in" },
  { label: "Portfolio", href: "https://portfolioishere.my.canva.site/ashufx", icon: "✦" },
];

export default function Contact() {
  return (
    <section id="contact" className={`section-padding ${styles.contact}`}>
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <div className="container">
        <div className={styles.ctaCard}>
          {/* Animated border glow */}
          <div className={styles.cardBorder} />

          {/* Floating orbs inside card */}
          <div className={styles.cardOrb1} />
          <div className={styles.cardOrb2} />

          <div className={styles.content}>
            <div className="section-tag" style={{ margin: "0 auto 20px" }}>✦ Let's Create</div>

            <h2 className={styles.ctaTitle}>
              Ready to Make Your{" "}
              <span className="gradient-text">Next Viral Thumbnail?</span>
            </h2>

            <p className={styles.ctaDesc}>
              Drop a message and I'll design a scroll-stopping thumbnail tailored to your content.
              Fast turnaround. Premium quality. Guaranteed results.
            </p>

            <div className={styles.contactMethods}>
              {/* Email */}
              <a
                href="mailto:contact.ashufx@gmail.com"
                className={styles.contactMethod}
                id="contact-email-btn"
              >
                <div className={styles.methodIcon}>✉</div>
                <div className={styles.methodInfo}>
                  <span className={styles.methodLabel}>Email</span>
                  <span className={styles.methodValue}>contact.ashufx@gmail.com</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919236204767"
                className={styles.contactMethod}
                id="contact-whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={`${styles.methodIcon} ${styles.whatsapp}`}>◎</div>
                <div className={styles.methodInfo}>
                  <span className={styles.methodLabel}>WhatsApp</span>
                  <span className={styles.methodValue}>+91 92362 04767</span>
                </div>
              </a>
            </div>

            <div className={styles.ctaButtons}>
              <a
                href="mailto:contact.ashufx@gmail.com"
                className="btn-primary"
                id="contact-order-btn"
                style={{ fontSize: "1rem", padding: "16px 40px" }}
              >
                <span>Order a Thumbnail</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <a
                href="https://wa.me/919236204767"
                className="btn-outline"
                id="contact-whatsapp-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Social links */}
            <div className={styles.socials}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label} id={`social-${s.label.toLowerCase()}`}>
                  <span className={styles.socialIcon}>{s.icon}</span>
                </a>
              ))}
            </div>

            <p className={styles.priceReminder}>
              Starting at just <strong style={{ color: "#A855F7" }}>$12 per thumbnail</strong> — premium quality, every time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
