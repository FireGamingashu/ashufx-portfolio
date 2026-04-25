"use client";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <Image src="/logo.png" alt="Ashu FX" width={40} height={40} className={styles.logoImg} />
                <span className={styles.logoText}>Ashu <span>FX</span></span>
              </div>
              <p className={styles.brandDesc}>
                Premium thumbnail design and creative visual services for YouTube creators, gamers, and brands worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Navigation</h4>
              <ul className={styles.footerLinks}>
                {["#hero", "#services", "#showcase", "#pricing", "#contact"].map((href) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={(e) => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); }}
                    >
                      {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Services</h4>
              <ul className={styles.footerLinks}>
                <li><a href="#services">Thumbnail Design</a></li>
                <li><a href="#services">Gaming Intros</a></li>
                <li><a href="#services">Creative Branding</a></li>
                <li><a href="#pricing">Bundle Packs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Get In Touch</h4>
              <ul className={styles.footerLinks}>
                <li><a href="mailto:contact.ashufx@gmail.com">contact.ashufx@gmail.com</a></li>
                <li><a href="https://wa.me/919236204767" target="_blank" rel="noopener noreferrer">WhatsApp: +91 92362 04767</a></li>
                <li><a href="https://instagram.com/ashu.fx.psd" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://linkedin.com/in/ashufx" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
              <div className={styles.footerBadge}>
                <span className={styles.pulseDot} />
                Available for orders
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>© {year} Ashu FX. All rights reserved.</p>
            <p className={styles.madeWith}>Made with <span style={{ color: "#A855F7" }}>✦</span> for creators worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
