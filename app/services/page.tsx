import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageIntro, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { services } from "@/lib/site-data";

export const metadata: Metadata = { title: "AI Training Data Services", description: "Managed response evaluation, data annotation, RLHF, safety testing, prompt creation, expert tasks and freelancer operations." };

export default function ServicesPage() {
  return <main><SiteHeader /><PageIntro eyebrow="Services" title="Human expertise, managed for AI delivery." text="Choose a capability or start with the business problem. Every engagement combines the right contributors, operating workflow and quality controls." /><section className="section service-directory">{services.map((service) => <Link className="directory-card" href={`/services/${service.slug}`} key={service.slug}><div><span>{service.number}</span><h2>{service.title}</h2><p>{service.short}</p></div><ul>{service.deliverables.slice(0, 3).map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul><ArrowRight className="directory-arrow" size={22} /></Link>)}</section><section className="simple-cta"><div><p className="eyebrow eyebrow-light">Not sure which service fits?</p><h2>Describe the model outcome and the data challenge.</h2></div><Link className="button button-light" href="/contact">Discuss your project <ArrowRight size={17} /></Link></section><SiteFooter /></main>;
}
