export const dynamic = "force-dynamic";

import styles from "./about.module.css";
import Link from "next/link";

const team = [
  {
    name: "Tuberose Floral",
    role: "Founder & Lead Designer",
    bio: "With over 15 years of experience, she brings passion and artistry to every arrangement.",
    photo: "ZHvM3XIOHoE",
  },
  {
    name: "Leila Ahmadi",
    role: "Wedding Specialist",
    bio: "Leila has designed floral arrangements for over 300 weddings across California.",
    photo: "rDEOVtE7vOs",
  },
  {
    name: "James Park",
    role: "Event Designer",
    bio: "James transforms corporate and gala spaces into breathtaking floral experiences.",
    photo: "d2MSDujJl2g",
  },
];

const values = [
  {
    icon: "🌱",
    title: "Sustainably Sourced",
    description: "We work with local and eco-certified growers to minimize our environmental footprint.",
  },
  {
    icon: "✂️",
    title: "Handcrafted with Care",
    description: "Every stem is hand-selected and arranged by our skilled designers — no two bouquets are alike.",
  },
  {
    icon: "💛",
    title: "Personal Touch",
    description: "We take time to understand your vision and bring it to life with warmth and creativity.",
  },
  {
    icon: "🚚",
    title: "Same-Day Delivery",
    description: "Fresh flowers delivered to your door within hours, seven days a week.",
  },
];

const stats = [
  { value: "15+", label: "Years of Experience" },
  { value: "300+", label: "Weddings Designed" },
  { value: "10K+", label: "Happy Customers" },
  { value: "50+", label: "Event Venues" },
];

async function fetchImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish&client_id=${accessKey}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const [heroBg, storyImg, ...teamImages] = await Promise.all([
    fetchImage("beautiful flower shop interior"),
    fetchImage("florist woman arranging flowers"),
    ...team.map((m) => fetchImage(`${m.role} portrait professional`)),
  ]);

  return (
    <div className={styles.page}>

      {/* Hero Banner */}
      <section
        className={styles.hero}
        style={{ backgroundImage: heroBg ? `url('${heroBg}')` : undefined }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Our Story</p>
          <h1 className={styles.heroTitle}>Flowers That Tell Your Story</h1>
          <p className={styles.heroSub}>
            Born from a love of nature and beauty, Tuberose Floral has been crafting
            meaningful floral experiences since 2009.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.storyImage}
          style={{ backgroundImage: storyImg ? `url('${storyImg}')` : undefined }}
        />
        <div className={styles.storyText}>
          <p className={styles.eyebrow}>Who We Are</p>
          <h2 className={styles.sectionTitle}>A Passion for Petals</h2>
          <p>
            Tuberose Floral was founded in San Francisco with a simple belief:
            flowers have the power to transform moments into memories. What started
            as a small studio has grown into a beloved floral boutique trusted by
            thousands of customers across the Bay Area.
          </p>
          <p>
            We specialize in weddings, corporate events, and everyday bouquets —
            always with a personal touch. Our team of passionate designers works
            closely with you to create arrangements that reflect your style and
            tell your unique story.
          </p>
          <Link href="/contact" className={styles.ctaLink}>Work With Us →</Link>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className={styles.values}>
        <p className={styles.eyebrow}>What We Stand For</p>
        <h2 className={styles.sectionTitle}>Our Values</h2>
        <div className={styles.valuesGrid}>
          {values.map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={styles.team}>
        <p className={styles.eyebrow}>The People Behind the Petals</p>
        <h2 className={styles.sectionTitle}>Meet the Team</h2>
        <div className={styles.teamGrid}>
          {team.map((member, i) => (
            <div key={member.name} className={styles.teamCard}>
              <div
                className={styles.teamPhoto}
                style={{
                  backgroundImage: teamImages[i] ? `url('${teamImages[i]}')` : undefined,
                  backgroundColor: teamImages[i] ? undefined : "#f0e6e6",
                }}
              />
              <h3 className={styles.teamName}>{member.name}</h3>
              <p className={styles.teamRole}>{member.role}</p>
              <p className={styles.teamBio}>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Ready to create something beautiful?</h2>
        <p>Let&apos;s talk about your flowers.</p>
        <Link href="/contact" className={styles.ctaBtn}>Get in Touch</Link>
      </section>

    </div>
  );
}
