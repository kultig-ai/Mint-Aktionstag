import type { MetadataRoute } from "next";

// Für den statischen Export (output: "export") erforderlich.
export const dynamic = "force-static";

// TODO: Bei eigener Domain hier anpassen (siehe layout.tsx).
const SITE_URL = "https://kultig-ai.github.io/Mint-Aktionstag";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
