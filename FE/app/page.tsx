import { cookies, headers } from "next/headers";
import HomePage from "@/src/views/home/HomePage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cookieStore, reqHeaders] = await Promise.all([cookies(), headers()]);
  const savedLang = cookieStore.get("nexlog_lang")?.value;

  if (savedLang === "vi" || savedLang === "en") {
    return (
      <HomePage
        initialLang={savedLang}
        initialCountry="SAVED"
      />
    );
  }

  const rawCountry = (
    reqHeaders.get("cf-ipcountry") ||
    reqHeaders.get("x-vercel-ip-country") ||
    reqHeaders.get("x-country-code") ||
    ""
  )
    .trim()
    .toUpperCase();

  const hasValidCountry =
    rawCountry.length === 2 && rawCountry !== "XX" && rawCountry !== "T1";

  let initialLang: "vi" | "en" = "vi";
  if (hasValidCountry) {
    initialLang = rawCountry === "VN" ? "vi" : "en";
  } else {
    const acceptLang = (reqHeaders.get("accept-language") || "").toLowerCase();
    initialLang = acceptLang.includes("vi") || !acceptLang ? "vi" : "en";
  }

  return (
    <HomePage
      initialLang={initialLang}
      initialCountry={hasValidCountry ? rawCountry : ""}
    />
  );
}
