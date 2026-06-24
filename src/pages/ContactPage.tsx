import { AuditIntakeForm } from '../components/AuditIntakeForm';
import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import { contextualProofLinks } from '../content/seoExpansion';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const CONTACT_SEO = getSeoRoute('/contact')!;

export default function ContactPage() {
  useSEO(CONTACT_SEO);

  return (
    <main id="top" className="site-page site-page-dark relative min-h-screen overflow-x-hidden bg-[#080807] font-sans text-[#f1efe8] selection:bg-[#f1efe8] selection:text-[#080807]">
      <WireframeGrid tone="dark" className="absolute inset-0 z-0 pointer-events-none opacity-20" />
      <PageTechnicalChrome tone="dark" />
      <ScrollProgress />
      <InternalHeader activePath="/contact" tone="dark" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-104px)] max-w-[1480px] grid-cols-1 gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[0.46fr_0.54fr] xl:px-10 xl:pt-20">
        <div className="self-end">
          <p className="mb-9 text-[10px] uppercase tracking-[0.36em] text-[#f1efe8]/48">Audit intake</p>
          <h1 className="font-serif text-[clamp(4.4rem,9vw,10rem)] italic leading-[0.82] tracking-normal">
            Request a technical SEO audit.
          </h1>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-[#f1efe8]/62">
            Use this form for technical SEO, AI-search visibility, crawl evidence, indexation, internal-link, structured-data, analytics, or finance/data research requests.
          </p>
          <div className="mt-10 grid gap-3 text-[10px] uppercase tracking-[0.22em] text-[#f1efe8]/58">
            <a href="/atlas/sample-crawl" className="underline decoration-[#f1efe8]/18 underline-offset-4 transition-colors hover:text-[#f1efe8]">
              See an Atlas sample crawl run
            </a>
            <a href="/method" className="underline decoration-[#f1efe8]/18 underline-offset-4 transition-colors hover:text-[#f1efe8]">
              Read the technical SEO audit method
            </a>
          </div>
        </div>

        <div className="self-center border border-[#f1efe8]/14 p-5 md:p-8">
          <AuditIntakeForm className="max-w-none" />
          <p className="mt-8 max-w-2xl text-[10px] uppercase leading-relaxed tracking-[0.18em] text-[#f1efe8]/42">
            Submissions go through the same Formspree endpoint as the homepage brief form. Do not include private credentials, unreleased client data, payment details, or production secrets.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1480px] border-y border-[#f1efe8]/12 px-4 py-16 md:px-8 xl:px-10">
        <h2 className="mb-8 text-[10px] uppercase tracking-[0.32em] text-[#f1efe8]/45">Before you send</h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#f1efe8]/14 md:grid-cols-3">
          {contextualProofLinks.slice(0, 3).map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="min-h-[170px] bg-[#f1efe8]/[0.012] p-5 transition-colors hover:bg-[#f1efe8] hover:text-[#080807]"
            >
              <h3 className="text-xs uppercase tracking-[0.22em] text-inherit">{link.label}</h3>
              <p className="mt-5 text-sm leading-relaxed text-inherit opacity-65">{link.description}</p>
            </a>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 py-8 md:px-8 xl:px-10">
        <InternalFooter activePath="/contact" tone="dark" />
      </div>
    </main>
  );
}
