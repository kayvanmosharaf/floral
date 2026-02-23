import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "roses";
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY is not set" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish&client_id=${accessKey}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const imageUrl = data.results?.[0]?.urls?.regular ?? null;
    return NextResponse.json({ ok: true, imageUrl, query });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
