import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { services } from "@/lib/site-data";

export const metadata: Metadata = { title: "Capability Statement", description: "ScaleWorkAgency capability overview for procurement and internal stakeholder review." };

export default function CapabilityPage() {
  return <main className="capability-page">
    <div className="print-actions"><Link href="/"><ArrowLeft size={16} /> Back to website</Link><PrintButton /></div>
    <header><div className="brand"><Image className="brand-logo" src="/favicon.svg" alt="" width={40} height={40} /><span>ScaleWork</span><em>Agency</em></div><span>Capability statement · 2026</span></header>
    <section><p className="eyebrow">Managed AI training data services</p><h1>Human expertise for training, evaluating and improving artificial intelligence systems.</h1><p>ScaleWorkAgency designs and manages specialist contributor programmes for AI companies and research teams. We combine recruitment, qualification, calibration, production support and quality review in one accountable delivery model.</p></section>
    <section className="capability-columns"><div><h2>Core capabilities</h2>{services.map((service) => <article key={service.slug}><h3>{service.title}</h3><p>{service.short}</p></article>)}</div><div><h2>Operating controls</h2>{["Contributor vetting and practical qualification", "Project-specific training and calibration", "Role-based access and confidentiality", "Layered review and performance scoring", "Issue escalation and contributor replacement", "Secure file exchange and retention planning", "Delivery reporting and audit-ready records"].map((item) => <span key={item}><Check size={15} /> {item}</span>)}<h2>Engagement models</h2><p>Discovery sprints, controlled pilots and managed ongoing programmes.</p><h2>Start a conversation</h2><p>Use the project enquiry form to share the model objective, expertise, volume, timeline and data sensitivity.</p><Link href="/contact">scaleworkagency.com/contact</Link></div></section>
    <footer><span>ScaleWorkAgency</span><span>Representative capabilities only. Formal scope and controls are defined per engagement.</span></footer>
  </main>;
}
