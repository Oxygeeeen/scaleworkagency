/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Apply as an AI Trainer", description: "Submit your experience, skills, languages and availability for consideration for managed freelance AI training assignments." };
export default function ApplyPage() { return <main><SiteHeader /><section className="apply-layout"><aside><p className="eyebrow eyebrow-light">Apply as an AI trainer</p><h1>Expertise is the starting point.</h1><p>Complete one profile for consideration across suitable upcoming assignments. We will contact you only when there is a relevant next step.</p><img src="/media/freelancer-hammock.jpg" alt="Freelance professional working remotely on a laptop" width="612" height="408" loading="eager" decoding="async" /><div><strong>Prepare before you begin</strong><span>CV or résumé</span><span>Professional profile or portfolio</span><span>Language and availability details</span></div></aside><ApplicationForm /></section><SiteFooter /></main>; }
