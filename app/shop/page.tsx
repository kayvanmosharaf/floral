export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import ShopClient from "./ShopClient";

const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

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
  const { data: products } = await cookieBasedClient.models.Product.list({
    authMode: "apiKey",
  });

  const productsWithImages = await Promise.all(
    products.map(async (p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      query: p.query,
      imageUrl: await fetchImage(p.query),
    }))
  );

  return <ShopClient products={productsWithImages} />;
}
