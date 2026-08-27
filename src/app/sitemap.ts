import type { MetadataRoute } from "next";

// TODO: Beim Livegang durch die echte Domain ersetzen (siehe layout.tsx).
const SITE_URL = "https://axtwerfen-lernen.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
