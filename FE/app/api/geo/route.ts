import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function extractClientIp(request: Request): string | null {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return null;
}

function isPrivateOrLocalIp(ip: string | null): boolean {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, "");
  return (
    clean === "::1" ||
    clean === "127.0.0.1" ||
    clean.startsWith("10.") ||
    clean.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(clean)
  );
}

export async function GET(request: Request) {
  // 1. Ưu tiên header CF-IPCountry từ Cloudflare Tunnel (nhanh 0ms, chính xác tuyệt đối trên production)
  const headerCountry = (
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("x-country-code") ||
    ""
  )
    .trim()
    .toUpperCase();

  if (
    headerCountry &&
    headerCountry.length === 2 &&
    headerCountry !== "XX" &&
    headerCountry !== "T1"
  ) {
    return NextResponse.json({
      country: headerCountry,
      lang: headerCountry === "VN" ? "vi" : "en",
      source: "cloudflare-header",
    });
  }

  // 2. Fallback qua IP geolocation API (dùng khi chạy local hoặc truy cập trực tiếp không qua Cloudflare)
  const clientIp = extractClientIp(request);
  const lookupUrl = isPrivateOrLocalIp(clientIp)
    ? "https://ipwho.is/"
    : `https://ipwho.is/${encodeURIComponent(clientIp!)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(lookupUrl, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      const countryCode = String(data?.country_code || "").toUpperCase();
      if (countryCode && countryCode.length === 2) {
        return NextResponse.json({
          country: countryCode,
          lang: countryCode === "VN" ? "vi" : "en",
          source: "ip-lookup",
        });
      }
    }
  } catch {
    // Bỏ qua nếu timeout / offline
  }

  // 3. Fallback cuối cùng theo Accept-Language của trình duyệt
  const acceptLang = (request.headers.get("accept-language") || "").toLowerCase();
  const isVi = acceptLang.includes("vi");
  return NextResponse.json({
    country: isVi ? "VN" : null,
    lang: isVi ? "vi" : "en",
    source: "accept-language",
  });
}
