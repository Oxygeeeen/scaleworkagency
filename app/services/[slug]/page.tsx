import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, FileCheck2 } from "lucide-react";
import { FaqBlock } from "@/components/FaqBlock";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { services } from "@/lib/site-data";

export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = services.find((item) => item.slug === slug);
  return service ? { title: service.title, description: service.short } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const service = services.find((item) => item.slug === slug); if (!service) notFound();
  const related = service.related.map((item) => services.find((candidate) => candidate.slug === item)).filter(Boolean);
  return <main><SiteHeader /><section className="service-hero"><div><p className="eyebrow eyebrow-light">Service {service.number}</p><h1>{service.title}</h1><p>{service.short}</p><Link className="button button-light" href="/contact">Discuss a project <ArrowRight size={17} /></Link></div><aside><span>The business problem</span><p>{service.problem}</p></aside></section><section className="service-detail section"><div className="service-detail-main"><article><p className="eyebrow">Suitable inputs</p><h2>Formats and project types</h2><div className="pill-list">{service.formats.map((item) => <span key={item}>{item}</span>)}</div></article><article><p className="eyebrow">Contributor profile</p><h2>Qualification follows the task.</h2><div className="check-grid">{service.qualifications.map((item) => <span key={item}><Check size={17} /> {item}</span>)}</div></article><article><p className="eyebrow">Managed workflow</p><h2>From brief to reviewed delivery.</h2><div className="numbered-list">{service.workflow.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</div></article></div><aside className="deliverable-card"><FileCheck2 size={28} /><p className="eyebrow">What you receive</p><h2>Decision-ready outputs</h2><ul>{service.deliverables.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul><Link className="button button-dark" href="/contact">Scope this service <ArrowRight size={16} /></Link></aside></section><section className="control-section"><div><p className="eyebrow eyebrow-light">Quality controls</p><h2>Designed into the programme—not inspected in at the end.</h2></div><div>{service.controls.map((item, index) => <article key={item}><span>{index + 1}</span><h3>{item}</h3></article>)}</div></section><section className="section related-section"><p className="eyebrow">Related capabilities</p><div>{related.map((item) => item && <Link key={item.slug} href={`/services/${item.slug}`}><span>{item.number}</span><h3>{item.title}</h3><ArrowRight size={18} /></Link>)}</div></section><FaqBlock items={service.faqs} title={`Questions about ${service.title.toLowerCase()}.`} /><SiteFooter /></main>;
}
