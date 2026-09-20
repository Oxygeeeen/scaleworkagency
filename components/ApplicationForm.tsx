"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, FileText, LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";

type ApplicationDraft = { name: string; email: string; country: string; languages: string; education: string; discipline: string; coding: string; experience: string; availability: string; profileUrl: string; note: string };
const initial: ApplicationDraft = { name: "", email: "", country: "", languages: "", education: "", discipline: "", coding: "", experience: "", availability: "", profileUrl: "", note: "" };

export function ApplicationForm() {
  const [draft, setDraft] = useState(initial);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const cvRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef<number | null>(null);
  const update = (name: keyof ApplicationDraft, value: string) => setDraft((current) => ({ ...current, [name]: value }));

  async function send(payload: ApplicationDraft, file?: File | null) {
    const body = new FormData(); Object.entries(payload).forEach(([key, value]) => body.set(key, value));
    body.set("startedAt", String(startedAt.current ?? Date.now())); body.set("source", "website-trainer-application");
    if (file && file.size) body.set("cv", file);
    const response = await fetch("/api/applications", { method: "POST", body });
    const result = await response.json() as { ok?: boolean; reference?: string; message?: string; notifications?: { confirmationSent?: boolean } };
    if (!response.ok || !result.ok) throw new Error(result.message || "We could not send your application.");
    return result;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { toast.error("Please confirm the application declarations."); return; }
    setStatus("submitting");
    try { const result = await send(draft, cvRef.current?.files?.[0]); setReference(result.reference || "Received"); setConfirmationSent(Boolean(result.notifications?.confirmationSent)); setStatus("success"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "We could not send your application."); setStatus("idle"); }
  }

  useEffect(() => {
    startedAt.current = Date.now();
    const context = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => unknown } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({ name: "submit_ai_trainer_application", title: "Submit AI trainer application", description: "Submit an application for managed freelance AI training assignments.", inputSchema: { type: "object", additionalProperties: false, required: ["name", "email", "country", "languages", "discipline", "experience", "availability"], properties: Object.fromEntries(Object.keys(initial).map((key) => [key, { type: "string" }])) }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: async (input: unknown) => { const payload = { ...initial, ...(input as Partial<ApplicationDraft>) }; setDraft(payload); setStatus("submitting"); const result = await send(payload); setReference(result.reference || "Received"); setConfirmationSent(Boolean(result.notifications?.confirmationSent)); setStatus("success"); return { status: "received", reference: result.reference }; } }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  if (status === "success") return <div className="form-success"><span><Check size={24} /></span><p className="eyebrow">Application received</p><h2>Thank you for applying.</h2><p>We’ll review your experience against current and upcoming project needs. Your reference is <strong>{reference}</strong>.</p>{confirmationSent && <p>A confirmation has been sent to <strong>{draft.email}</strong>.</p>}<Link className="button button-dark" href="/freelancers">Return to freelancer information</Link></div>;

  return <form className="application-form" onSubmit={submit}><Toaster position="top-center" /><div className="application-form-head"><p className="eyebrow">Application</p><h2>Tell us where your expertise is strongest.</h2><p>Applying does not guarantee an assignment. Selection depends on project demand, assessment results and successful onboarding.</p></div><div className="form-grid form-grid-two">
    <label className="field"><span>Full name <b>*</b></span><input required value={draft.name} onChange={(e) => update("name", e.target.value)} /></label>
    <label className="field"><span>Email <b>*</b></span><input required type="email" value={draft.email} onChange={(e) => update("email", e.target.value)} /></label>
    <label className="field"><span>Country or region <b>*</b></span><input required value={draft.country} onChange={(e) => update("country", e.target.value)} /></label>
    <label className="field"><span>Languages and proficiency <b>*</b></span><input required value={draft.languages} onChange={(e) => update("languages", e.target.value)} placeholder="e.g. English — native; French — C1" /></label>
    <label className="field"><span>Highest education</span><input value={draft.education} onChange={(e) => update("education", e.target.value)} /></label>
    <label className="field"><span>Professional discipline <b>*</b></span><Select value={draft.discipline} onValueChange={(value) => value && update("discipline", String(value))}><SelectTrigger className="form-select"><SelectValue placeholder="Select your primary field" /></SelectTrigger><SelectContent>{["Software engineering", "Mathematics", "Language and translation", "Safety and policy", "Research", "Customer support", "Other professional field"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label>
    <label className="field"><span>Coding languages</span><input value={draft.coding} onChange={(e) => update("coding", e.target.value)} placeholder="If relevant" /></label>
    <label className="field"><span>Weekly availability <b>*</b></span><Select value={draft.availability} onValueChange={(value) => value && update("availability", String(value))}><SelectTrigger className="form-select"><SelectValue placeholder="Select availability" /></SelectTrigger><SelectContent>{["Under 10 hours", "10–20 hours", "20–30 hours", "30+ hours"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></label>
  </div><label className="field"><span>Relevant work experience <b>*</b></span><textarea required rows={5} value={draft.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Describe the work that best demonstrates your expertise." /></label><div className="form-grid form-grid-two"><label className="field"><span>Portfolio or professional profile</span><input type="url" value={draft.profileUrl} onChange={(e) => update("profileUrl", e.target.value)} placeholder="https://" /></label><label className="upload-field compact"><FileText size={18} /><span><strong>Upload CV or résumé <b>*</b></strong><small>PDF or DOCX, up to 4 MB.</small></span><input ref={cvRef} required type="file" accept=".pdf,.doc,.docx" /></label></div><label className="field"><span>Anything else we should know?</span><textarea rows={3} value={draft.note} onChange={(e) => update("note", e.target.value)} /></label><div className="consent-row"><Checkbox id="application-consent" checked={consent} onCheckedChange={(value) => setConsent(Boolean(value))} /><label htmlFor="application-consent">I confirm this information is accurate and consent to its use for recruitment and project matching. I have read the <Link href="/legal/contributor-notice">contributor notice</Link>.</label></div><input className="honeypot" type="text" name="company_site" tabIndex={-1} autoComplete="off" aria-hidden="true" /><button className="button button-dark form-submit" disabled={status === "submitting"}>{status === "submitting" ? <LoaderCircle className="spin" size={18} /> : <Send size={18} />} Submit application</button></form>;
}
