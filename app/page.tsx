import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>Welcome to Tuberose Floral</p>
          <h1 className={styles.heroTitle}>
            Beautiful Flowers for Every Occasion
          </h1>
          <p className={styles.heroText}>
            Elegant, handcrafted arrangements for weddings, events, and everyday moments.
          </p>
          <Link href="/shop" className={styles.heroBtn}>Shop Now</Link>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <p className={styles.introText}>
          Want beautiful and affordable floral design, wedding flowers, or event centerpieces?
          Tuberose Floral is a celebrated florist with a personal touch — crafting arrangements
          that tell your story.
        </p>
        <Link href="/about" className={styles.introLink}>Our Story →</Link>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <h2 className={styles.sectionTitle}>What We Offer</h2>
        <div className={styles.serviceGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceImage} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487530811015-780f2f0859b2?w=600&q=80')" }} />
            <h3>Bouquets</h3>
            <p>Fresh, seasonal bouquets for any occasion — birthdays, anniversaries, or just because.</p>
            <Link href="/shop" className={styles.cardLink}>Shop Bouquets →</Link>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceImage} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80')" }} />
            <h3>Weddings</h3>
            <p>From bridal bouquets to ceremony arches, we bring your wedding vision to life.</p>
            <Link href="/contact" className={styles.cardLink}>Get a Quote →</Link>
          </div>
          <div className={styles.serviceCard}>
            <div className={styles.serviceImage} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1561181286-d3f2ad916f5a?w=600&q=80')" }} />
            <h3>Events</h3>
            <p>Corporate events, galas, and celebrations — stunning floral design at any scale.</p>
            <Link href="/contact" className={styles.cardLink}>Plan Your Event →</Link>
          </div>
        </div>
      </section>

      {/* Featured In */}
      <section className={styles.featured}>
        <p className={styles.featuredLabel}>As Seen In</p>
        <div className={styles.featuredLogos}>
          <span>Vogue</span>
          <span>Martha Stewart Weddings</span>
          <span>Brides</span>
          <span>Town &amp; Country</span>
        </div>
      </section>

      {/* Instagram */}
      <section className={styles.instagram}>
        <h2 className={styles.sectionTitle}>Follow Our Work</h2>
        <p className={styles.igHandle}>@tuberosefloral</p>
        <div className={styles.igGrid}>
          {[
            "photo-1490750967868-88df5691b36d",
            "photo-1558618666-fcd25c85cd64",
            "photo-1520763185298-1b434c919102",
            "photo-1444393350742-da1f11febe34",
            "photo-1496661415325-ef852f9e8e7c",
            "photo-1462275646964-a0e3386b89fa",
          ].map((id) => (
            <div
              key={id}
              className={styles.igItem}
              style={{ backgroundImage: `url('https://images.unsplash.com/${id}?w=400&q=80')` }}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerName}>🌸 Tuberose Floral</p>
        <div className={styles.footerLinks}>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className={styles.footerCopy}>© {new Date().getFullYear()} Tuberose Floral. All rights reserved.</p>
      </footer>

    </div>
  );
}
