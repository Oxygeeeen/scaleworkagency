import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">404</p><h1>This page is outside the dataset.</h1><p>The address may have changed, or the page may no longer be available.</p><Link className="button button-dark" href="/"><ArrowLeft size={16} /> Return home</Link></main>;
}
