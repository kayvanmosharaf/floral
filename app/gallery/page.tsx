import styles from "./gallery.module.css";

const flowers = [
  {
    name: "Roses",
    rank: 1,
    description: "America's #1 flower — over 83 million stems sold annually.",
    photo: "kcKiBcDTJt4",
  },
  {
    name: "Lavender",
    rank: 2,
    description: "Most searched flower in the US — loved for its fragrance and color.",
    photo: "c1Jp-fo53U8",
  },
  {
    name: "Gerbera Daisies",
    rank: 3,
    description: "Over 113 million stems sold — bold, bright, and cheerful.",
    photo: "pUgCXI9UPIk",
  },
  {
    name: "Tulips",
    rank: 4,
    description: "$65.3 million in annual sales — the top-selling cut flower.",
    photo: "h5Aenbzd_FA",
  },
  {
    name: "Lilies",
    rank: 5,
    description: "Elegant and long-lasting — 113 million stems sold wholesale.",
    photo: "sF_KVNZFeWw",
  },
  {
    name: "Orchids",
    rank: 6,
    description: "#1 potted flowering plant in the US with $86M in annual sales.",
    photo: "wUmkEd7PKCY",
  },
  {
    name: "Sunflowers",
    rank: 7,
    description: "Sunny and joyful — the top searched flower in the United States.",
    photo: "5lRxNLHfZOY",
  },
  {
    name: "Hydrangeas",
    rank: 8,
    description: "Beloved for their full, lush blooms and wide color range.",
    photo: "cwajQ61UR8U",
  },
  {
    name: "Petunias",
    rank: 9,
    description: "Best-selling bedding annual — over $262 million in US sales.",
    photo: "SvrlzbefjiU",
  },
  {
    name: "Carnations",
    rank: 10,
    description: "Timeless and affordable — a florist staple loved across generations.",
    photo: "7IUE9fTPyhk",
  },
];

export default function GalleryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Flower Gallery</h1>
        <p className={styles.subtitle}>Top 10 best-selling flowers in the United States</p>
      </div>

      <div className={styles.grid}>
        {flowers.map((flower) => (
          <div key={flower.rank} className={styles.tile}>
            <div
              className={styles.image}
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-${flower.photo}?w=800&q=80')`,
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
