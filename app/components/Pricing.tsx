"use client";
import { useRef, useEffect } from "react";
import styles from "./Pricing.module.css";

const plans = [
  {
    id: "single",
    name: "Single",
    price: "$16",
    period: "per thumbnail",
    desc: "Perfect for one-off projects or trying out the service.",
    features: [
      "1 Custom Thumbnail",
      "Full HD Resolution",
      "2 Revisions",
      "24h Turnaround",
      "No Source File",
      "Commercial License",
    ],
    cta: "Order Now",
    featured: false,
  },
  {
    id: "bundle3",
    name: "Bundle ×3",
    price: "$28",
    period: "for 3 thumbnails",
    desc: "Best value for creators who want consistent branding across videos.",
    features: [
      "3 Custom Thumbnails",
      "Full HD Resolution",
      "Unlimited Revisions",
      "Priority 12h Turnaround",
      "Source Files (All)",
      "Commercial License",
      "Brand Style Sheet",
    ],
    cta: "Get Bundle",
    featured: true,
    badge: "Best Value",
    savings: "Save $4",
  },
  {
    id: "pack5",
    name: "Pack ×5",
    price: "$65",
    period: "for 5 thumbnails",
    desc: "For serious creators who need a full thumbnail library fast.",
    features: [
      "5 Custom Thumbnails",
      "Full HD Resolution",
      "Unlimited Revisions",
      "Priority Express Delivery",
      "Source Files (All)",
      "Commercial License",
      "Brand Identity Kit",
    ],
    cta: "Get Pack",
    featured: false,
    savings: "Save $11",
  },
];

export default function Pricing() {
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
    <section id="pricing" className={`section-padding ${styles.pricing}`}>
      <div className={styles.bgGlow} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <div className="section-tag">✦ Pricing</div>
          <h2 className={styles.sectionTitle}>
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className={styles.sectionSub}>
            No hidden fees. No subscriptions. Just stunning thumbnails at a price that works for every creator.
          </p>
        </div>

        <div className={styles.plansGrid}>
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              id={`pricing-${plan.id}`}
              className={`${styles.planCard} ${plan.featured ? styles.featured : ""}`}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {plan.featured && (
                <div className={styles.featuredBadge}>✦ {plan.badge}</div>
              )}
              {plan.savings && (
                <div className={styles.savingsBadge}>{plan.savings}</div>
              )}

              {/* Featured glow ring */}
              {plan.featured && <div className={styles.featuredRing} />}

              <div className={styles.planHeader}>
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmt}>{plan.price}</span>
                  <span className={styles.pricePeriod}>{plan.period}</span>
                </div>
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>

              <ul className={styles.featureList}>
                {plan.features.map((feat) => (
                  <li key={feat} className={styles.featureItem}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={plan.featured ? "btn-primary" : "btn-outline"}
                style={{ width: "100%", justifyContent: "center", display: "flex" }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Money back note */}
        <div className={styles.guarantee}>
          <span className={styles.guaranteeIcon}>🛡️</span>
          <span>100% Satisfaction Guarantee — Not happy? Revisions are on me.</span>
        </div>
      </div>
    </section>
  );
}
