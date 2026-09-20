import type { MetadataRoute } from "next";
import { services } from "@/lib/site-data";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl().origin;
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/services", "/industries", "/how-it-works", "/quality-security", "/freelancers", "/apply", "/about", "/insights", "/contact", "/capability-statement", "/legal/privacy", "/legal/terms", "/legal/cookies", "/legal/contributor-notice"];
  return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date("2026-09-19"), changeFrequency: route === "/insights" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : route === "/contact" ? .9 : .7 })), ...services.map((service) => ({ url: `${base}/services/${service.slug}`, lastModified: new Date("2026-09-19"), changeFrequency: "monthly" as const, priority: .8 }))];
}
