"use client";
import { useEffect, useRef } from "react";
import styles from "./Services.module.css";

const services = [
  {
    icon: "🎨",
    title: "Thumbnail Design",
    desc: "Eye-catching, scroll-stopping thumbnails tailored for YouTube, gaming, and lifestyle channels. Every pixel crafted to maximize click-through rate.",
    tags: ["YouTube", "Gaming", "Lifestyle"],
  },
  {
    icon: "🎬",
    title: "Gaming Intros",
    desc: "Cinematic gaming intro sequences with explosive motion graphics, neon effects, and anime-inspired energy that hype your audience from frame one.",
    tags: ["Intros", "Motion", "Animation"],
  },
  {
    icon: "✨",
    title: "Creative Branding",
    desc: "Cohesive visual identity packages — from channel art to banners, overlays, and logo treatments that make your brand unforgettable.",
    tags: ["Branding", "Banners", "Identity"],
  },
];

export default function Services() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              (entry.target as HTMLElement).classList.add(styles.visible);
            }, 0);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return (
    <section id="services" className={`section-padding ${styles.services}`}>
      {/* Background glow */}
      <div className={styles.bgGlow} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-tag">✦ What I Do</div>
          <h2 className={styles.sectionTitle}>
            Creative Services <span className="gradient-text">Built to Convert</span>
          </h2>
          <p className={styles.sectionSub}>
            From a single viral thumbnail to a full brand identity — Ashu FX delivers premium
            visual content that gets clicks and builds communities.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {services.map((service, i) => (
            <div
              key={service.title}
              className={styles.serviceCard}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.12}s` }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
              id={`service-card-${i}`}
            >
              {/* Glow corner */}
              <div className={styles.cardGlow} />

              <div className={styles.iconWrap}>
                <span className={styles.icon}>{service.icon}</span>
                <div className={styles.iconGlow} />
              </div>

              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.desc}</p>

              <div className={styles.tags}>
                {service.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
