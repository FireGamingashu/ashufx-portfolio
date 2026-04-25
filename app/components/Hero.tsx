"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 20;

      const orbs = heroRef.current.querySelectorAll<HTMLElement>("[data-parallax]");
      orbs.forEach((orb) => {
        const depth = parseFloat(orb.dataset.parallax || "1");
        orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="hero" className={styles.hero} ref={heroRef}>
      {/* Background */}
      <div className={styles.heroBg}>
        <Image src="/banner.png" alt="Ashu FX Banner" fill priority className={styles.bannerImg} />
        <div className={styles.bannerOverlay} />
      </div>

      {/* Floating orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} data-parallax="0.5" />
      <div className={`${styles.orb} ${styles.orb2}`} data-parallax="0.8" />
      <div className={`${styles.orb} ${styles.orb3}`} data-parallax="0.3" />

      {/* Dot grid */}
      <div className={styles.dotGrid} />

      {/* Floating shapes */}
      <div className={styles.floatingRing1} data-parallax="1.2" />
      <div className={styles.floatingRing2} data-parallax="0.6" />

      {/* Content */}
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.heroTag}>
          <span className={styles.dot} />
          Thumbnail & Graphic Designer · Prayagraj, India
        </div>

        <h1 className={styles.heroTitle}>
          <span className={styles.titleLine}>Thumbnails That</span>
          <span className="gradient-text">Stop the Scroll</span>
        </h1>

        <p className={styles.heroSub}>
          4 years of experience crafting <strong>premium YouTube thumbnails</strong> and visual branding
          that drive clicks, grow communities, and make creators stand out globally.
        </p>

        <div className={styles.heroCtas}>
          <a href="#showcase" className="btn-primary" id="hero-explore-btn" onClick={(e)=>{e.preventDefault(); document.querySelector('#showcase')?.scrollIntoView({behavior:'smooth'})}}>
            <span>View Showcase</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a href="#contact" className="btn-outline" id="hero-order-btn" onClick={(e)=>{e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})}}>
            Order a Thumbnail
          </a>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { value: "100+", label: "Thumbnails Made" },
            { value: "50+", label: "Happy Clients" },
            { value: "10+", label: "International Clients" },
            { value: "4 yrs", label: "Experience" },
          ].map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </div>
    </section>
  );
}
