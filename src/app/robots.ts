import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/portfolio";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(process.env.NEXT_PUBLIC_SITE_URL
        ? { allow: "/" }
        : { disallow: "/" }),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
