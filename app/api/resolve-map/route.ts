// app/api/resolve-map/route.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/resolve-map?url=ENCODED_URL
 * - maps.app.goo.gl gibi kısa Google Maps linklerini server-side fetch ile çözer
 * - Sonuçta ortaya çıkan gerçek https://www.google.com/maps/... URL'sini döner
 */
export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");

  if (!urlParam) {
    return NextResponse.json(
      { error: "url parametresi eksik" },
      { status: 400 }
    );
  }

  try {
    const decoded = decodeURIComponent(urlParam);

    // Güvenlik: sadece Google Maps kısa linklerine izin ver
    if (!decoded.startsWith("https://maps.app.goo.gl/")) {
      return NextResponse.json(
        { error: "Sadece maps.app.goo.gl adresleri çözülebilir" },
        { status: 400 }
      );
    }

    // Redirect'leri takip edecek fetch
    const res = await fetch(decoded, {
      method: "GET",
      redirect: "follow",
    });

    // Son URL genelde https://www.google.com/maps/... olur
    const finalUrl = res.url;

    // Temel bir güvenlik: gerçekten google.com/maps içeriyor mu?
    if (!finalUrl.includes("google.com/maps")) {
      return NextResponse.json(
        { error: "Son URL bir Google Maps sayfası değil", finalUrl },
        { status: 400 }
      );
    }

    return NextResponse.json({ finalUrl });
  } catch (e) {
    console.error("resolve-map error", e);
    return NextResponse.json(
      { error: "Harita linki çözülemedi" },
      { status: 500 }
    );
  }
}
