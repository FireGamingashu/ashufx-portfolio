"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.navInner}`}>
          {/* Logo */}
          <a href="#hero" className={styles.logo} onClick={() => handleNavClick("#hero")}>
            <Image src="/logo.png" alt="Ashu FX Logo" width={44} height={44} className={styles.logoImg} />
            <span className={styles.logoText}>Ashu <span>FX</span></span>
          </a>

          {/* Desktop Links */}
          <ul className={`${styles.navLinks} nav-links-desktop`}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={styles.navLink}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={styles.navActions}>
            <a
              href="#contact"
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: "0.88rem" }}
              onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
            >
              Order Now ✦
            </a>

            {/* Hamburger */}
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.open : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className={styles.mobileCta}
              onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
            >
              Order Now ✦
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
