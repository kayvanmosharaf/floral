export const dynamic = "force-dynamic";

import ShopClient from "./ShopClient";

const products = [
  // Bouquets
  { id: 1, name: "Classic Rose Bouquet", category: "Bouquets", price: 45, query: "red rose bouquet" },
  { id: 2, name: "Sunflower Bouquet", category: "Bouquets", price: 35, query: "sunflower bouquet" },
  { id: 3, name: "Tulip Bouquet", category: "Bouquets", price: 40, query: "tulip bouquet" },
  { id: 4, name: "Mixed Spring Bouquet", category: "Bouquets", price: 55, query: "colorful spring flower bouquet" },
  // Weddings
  { id: 5, name: "Bridal Bouquet", category: "Weddings", price: 120, query: "bridal wedding bouquet white flowers" },
  { id: 6, name: "Wedding Centerpiece", category: "Weddings", price: 85, query: "wedding flower centerpiece table" },
  { id: 7, name: "Bridesmaid Bouquet", category: "Weddings", price: 65, query: "bridesmaid bouquet pastel flowers" },
  { id: 8, name: "Ceremony Arch", category: "Weddings", price: 350, query: "wedding flower arch ceremony" },
  // Events
  { id: 9, name: "Event Centerpiece", category: "Events", price: 75, query: "floral event centerpiece arrangement" },
  { id: 10, name: "Corporate Arrangement", category: "Events", price: 95, query: "elegant floral office arrangement" },
  { id: 11, name: "Gala Table Flowers", category: "Events", price: 110, query: "luxury gala table flower decoration" },
  // Plants
  { id: 12, name: "Orchid Plant", category: "Plants", price: 55, query: "orchid potted plant" },
  { id: 13, name: "Lavender Plant", category: "Plants", price: 25, query: "lavender potted plant" },
  { id: 14, name: "Peace Lily", category: "Plants", price: 35, query: "peace lily indoor plant" },
  { id: 15, name: "Hydrangea Plant", category: "Plants", price: 45, query: "hydrangea potted plant" },
];

async function fetchImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY ?? process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
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

export default async function ShopPage() {
  const productsWithImages = await Promise.all(
    products.map(async (p) => ({
      ...p,
      imageUrl: await fetchImage(p.query),
    }))
  );

  return <ShopClient products={productsWithImages} />;
}
