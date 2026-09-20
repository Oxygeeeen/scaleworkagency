const fallbackUrl = "https://scaleworkagency.com";

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const candidate = configured || vercelUrl || fallbackUrl;

  try {
    return new URL(withProtocol(candidate));
  } catch {
    return new URL(fallbackUrl);
  }
}
