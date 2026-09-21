import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const pages = {
  privacy: { title: "Privacy notice", updated: "19 May 2023", intro: "This notice explains the information ScaleWorkAgency collects through project enquiries and contributor applications, why it is used and the choices available to you.", sections: [
    ["Information we collect", "We collect information you submit, such as contact details, company information, project requirements, professional experience, availability, profile links and uploaded documents. Basic technical and analytics data may also be collected when enabled."],
    ["How information is used", "Information is used to respond to enquiries, assess project fit, evaluate contributor applications, manage security and prevent misuse. It is not used to make unsupported claims about applicants or clients."],
    ["Storage and access", "Access should be limited to people who need the information for delivery, recruitment, security or legal purposes. Uploaded files and form records are stored in controlled services used by the website."],
    ["Retention", "Information should be retained only for the period needed for the purpose collected, applicable legal requirements and the company’s documented retention schedule."],
    ["Your choices", "You may request access, correction or deletion where applicable. A verified privacy contact must be added before public launch."],
    ["Review status", "This operational draft must be reviewed and completed by qualified legal counsel before the website is made public."],
  ] },
  terms: { title: "Website terms", updated: "22 June 2025", intro: "These draft terms describe the intended use of the ScaleWorkAgency website. Project services and contributor assignments are governed by separate written agreements.", sections: [
    ["Website information", "Website content is general information and does not create a client, employment or contractor relationship. Capabilities, availability and controls are confirmed in writing for each engagement."],
    ["Enquiries and applications", "Submitting a project enquiry does not create a service agreement. Submitting a contributor application does not guarantee selection, onboarding or paid work."],
    ["Acceptable use", "Do not misuse forms, attempt unauthorised access, upload malicious files, submit third-party confidential information without authority or interfere with the website’s operation."],
    ["Intellectual property", "Website copy, design and brand materials may not be reproduced commercially without permission. Third-party rights remain with their respective owners."],
    ["Liability and governing terms", "Appropriate limitations, governing law, company details and dispute provisions must be inserted and reviewed by legal counsel before public launch."],
  ] },
  cookies: { title: "Cookie notice", updated: "09 February 2026", intro: "This notice describes the intended cookie and analytics approach for the ScaleWorkAgency website.", sections: [
    ["Essential storage", "Essential technologies may be used for security, form operation, session continuity and other functions necessary to provide the website."],
    ["Analytics", "Analytics and conversion tools should be activated only after the chosen services, consent requirements and regional rules have been reviewed and configured."],
    ["Your controls", "Where consent is required, non-essential technologies should remain disabled until a visitor makes a choice. A consent tool and preference controls must be verified before public launch."],
    ["Review status", "The final notice must identify the actual services, cookie names, purposes, lifetimes and providers used in production."],
  ] },
  "contributor-notice": { title: "Contributor privacy notice", updated: "19 May 2023", intro: "This notice explains how information submitted by prospective and active freelance contributors is intended to be handled.", sections: [
    ["Application information", "We may collect identity and contact details, location, languages, education, professional disciplines, coding skills, experience, availability, assessment results, portfolio links and CV information."],
    ["Purpose", "Information is used to review applications, assess skills, match suitable contributors to project requirements, communicate opportunities, manage onboarding and maintain operational records."],
    ["No guarantee of work", "Joining an application or qualification process does not guarantee approval, assignments, minimum hours or income."],
    ["Client and service-provider access", "Limited information may be shared with authorised project personnel or service providers where necessary for assessment, security, administration or delivery and subject to appropriate safeguards."],
    ["Retention and rights", "Retention periods, applicable legal rights and the verified contributor privacy contact must be finalised for the company’s operating locations before public launch."],
  ] },
} as const;

export function generateStaticParams() { return Object.keys(pages).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = pages[slug as keyof typeof pages]; return page ? { title: page.title, description: page.intro } : {}; }
export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = pages[slug as keyof typeof pages]; if (!page) notFound(); return <main><SiteHeader /><section className="legal-page"><header><p className="eyebrow">Legal information</p><h1>{page.title}</h1><p>{page.intro}</p><span>Last updated: {page.updated}</span></header>{page.sections.map(([title, content]) => <section key={title}><h2>{title}</h2><p>{content}</p></section>)}</section><SiteFooter /></main>; }
