import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "ScaleWorkAgency | Managed AI Training Data Services",
    template: "%s | ScaleWorkAgency",
  },
  description: "Managed human expertise for AI response evaluation, data annotation, RLHF, safety testing and specialist training tasks.",
  openGraph: {
    type: "website",
    siteName: "ScaleWorkAgency",
    title: "ScaleWorkAgency | Managed AI Training Data Services",
    description: "Managed human expertise for training, evaluating and improving artificial intelligence systems.",
  },
  twitter: {
    card: "summary",
    title: "ScaleWorkAgency | Managed AI Training Data Services",
    description: "Managed human expertise for training, evaluating and improving artificial intelligence systems.",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ScaleWorkAgency",
    url: siteUrl.toString(),
    description: "Managed human expertise for training, evaluating and improving artificial intelligence systems.",
  };
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></body></html>;
}
