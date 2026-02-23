export const dynamic = "force-dynamic";

import styles from "./gallery.module.css";

const flowers = [
  { name: "Roses", rank: 1, description: "America's #1 flower — over 83 million stems sold annually." },
  { name: "Lavender", rank: 2, description: "Most searched flower in the US — loved for its fragrance and color." },
  { name: "Gerbera Daisies", rank: 3, description: "Over 113 million stems sold — bold, bright, and cheerful." },
  { name: "Tulips", rank: 4, description: "$65.3 million in annual sales — the top-selling cut flower." },
  { name: "Lilies", rank: 5, description: "Elegant and long-lasting — 113 million stems sold wholesale." },
  { name: "Orchids", rank: 6, description: "#1 potted flowering plant in the US with $86M in annual sales." },
  { name: "Sunflowers", rank: 7, description: "Sunny and joyful — the top searched flower in the United States." },
  { name: "Hydrangeas", rank: 8, description: "Beloved for their full, lush blooms and wide color range." },
  { name: "Petunias", rank: 9, description: "Best-selling bedding annual — over $262 million in US sales." },
  { name: "Carnations", rank: 10, description: "Timeless and affordable — a florist staple loved across generations." },
];

async function fetchFlowerImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + " flower")}&per_page=1&orientation=squarish&client_id=${accessKey}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

export default async function GalleryPage() {
  const flowerData = await Promise.all(
    flowers.map(async (flower) => ({
      ...flower,
      imageUrl: await fetchFlowerImage(flower.name),
    }))
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Flower Gallery</h1>
        <p className={styles.subtitle}>Top 10 best-selling flowers in the United States</p>
      </div>

      <div className={styles.grid}>
        {flowerData.map((flower) => (
          <div key={flower.rank} className={styles.tile}>
            <div
              className={styles.image}
              style={{
                backgroundImage: flower.imageUrl ? `url('${flower.imageUrl}')` : undefined,
                backgroundColor: flower.imageUrl ? undefined : "#e8d5d5",
              }}
            />
            <div className={styles.overlay}>
              <span className={styles.rank}>#{flower.rank}</span>
              <h2 className={styles.name}>{flower.name}</h2>
              <p className={styles.description}>{flower.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
