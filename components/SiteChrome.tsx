import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}`} href="/" aria-label="ScaleWorkAgency home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>ScaleWork</span><em>Agency</em>
    </Link>
  );
}

export function SiteHeader({ inverse = false }: { inverse?: boolean }) {
  return (
    <header className={`site-header${inverse ? " header-inverse" : ""}`}>
      <Brand inverse={inverse} />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/services">Services <ChevronDown size={14} /></Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/quality-security">Quality &amp; security</Link>
        <Link href="/insights">Insights</Link>
      </nav>
      <div className="header-actions">
        <Link className="text-link" href="/freelancers">For freelancers</Link>
        <Link className={`button button-small ${inverse ? "button-light" : "button-dark"}`} href="/contact">
          Discuss a project <ArrowRight size={15} />
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <p className="eyebrow eyebrow-light">Start with a clear brief</p>
        <h2>Turn complex data work into a managed delivery programme.</h2>
        <p>Tell us what your model needs. We’ll help define the people, workflow and quality controls around it.</p>
        <Link className="button button-light" href="/contact">Discuss a project <ArrowRight size={17} /></Link>
      </div>
      <div className="footer-grid">
        <div className="footer-brand"><Brand inverse /><p>Managed human expertise for better artificial intelligence systems.</p><span><ShieldCheck size={16} /> Controlled access. Human-reviewed delivery.</span></div>
        <div><h3>Capabilities</h3><Link href="/services/ai-response-evaluation">Response evaluation</Link><Link href="/services/data-annotation-labelling">Data annotation</Link><Link href="/services/rlhf-services">RLHF services</Link><Link href="/services/model-safety-quality-testing">Safety testing</Link></div>
        <div><h3>Company</h3><Link href="/about">About</Link><Link href="/how-it-works">How it works</Link><Link href="/quality-security">Quality &amp; security</Link><Link href="/insights">Insights</Link></div>
        <div><h3>Contributors</h3><Link href="/freelancers">For freelancers</Link><Link href="/apply">Apply as an AI trainer</Link><Link href="/legal/contributor-notice">Contributor notice</Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 ScaleWorkAgency</span><div><Link href="/legal/privacy">Privacy</Link><Link href="/legal/terms">Terms</Link><Link href="/legal/cookies">Cookies</Link></div></div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text: string; dark?: boolean }) {
  return (
    <section className={`page-intro${dark ? " page-intro-dark" : ""}`}>
      <p className={`eyebrow${dark ? " eyebrow-light" : ""}`}>{eyebrow}</p>
      <h1>{title}</h1><p>{text}</p>
    </section>
  );
}
