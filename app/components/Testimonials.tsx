"use client";
import { useRef, useEffect } from "react";
import styles from "./Testimonials.module.css";
import testimonialsData from "../../data/testimonials.json";

export default function Testimonials() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((c) => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className={`section-padding ${styles.testimonials}`}>
      <div className={styles.bgGlow} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-tag">✦ Testimonials</div>
          <h2 className={styles.sectionTitle}>
            What My <span className="gradient-text">Clients Say</span>
          </h2>
          <p className={styles.sectionSub}>
            Don't just take my word for it. Here's what creators are saying about my thumbnail designs.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonialsData.map((testimonial, i) => (
            <div
              key={testimonial.id}
              className={styles.card}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className={styles.cardGlow} />
              
              <div className={styles.rating}>
                {[...Array(testimonial.rating)].map((_, index) => (
                  <span key={index} className={styles.star}>★</span>
                ))}
              </div>
              
              <p className={styles.content}>"{testimonial.content}"</p>
              
              <div className={styles.author}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className={styles.avatar}
                  onError={(e) => {
                    // Fallback to a generated avatar if the image doesn't exist
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}&backgroundColor=7c3aed`;
                  }}
                />
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{testimonial.name}</span>
                  <span className={styles.authorRole}>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
