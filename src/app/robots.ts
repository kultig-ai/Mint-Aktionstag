import type { MetadataRoute } from "next";

// TODO: Beim Livegang durch die echte Domain ersetzen (siehe layout.tsx).
const SITE_URL = "https://axtwerfen-lernen.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
