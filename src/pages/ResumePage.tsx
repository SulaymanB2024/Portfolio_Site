import { useEffect } from 'react';

import { InternalFooter } from '../components/InternalFooter';
import { InternalHeader } from '../components/InternalHeader';
import { PageTechnicalChrome } from '../components/PageTechnicalChrome';
import { ScrollProgress } from '../components/ScrollProgress';
import { WireframeGrid } from '../components/WireframeGrid';
import {
  DownloadArrowIcon,
  IndexedSection,
  PageFrame,
  PageShell,
  SectionEyebrow,
} from '../components/design/Primitives';
import { PROFILE_FACTS, formatEducation, formatIsoDate } from '../content/profileFacts';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const RESUME_SEO = getSeoRoute('/resume')!;
const RESUME_PDF_PATH = '/Sulayman_Bowles_Resume.pdf';

const supportingLinks = [
  { label: 'Atlas', href: '/atlas', meta: 'Product, method, and sample crawl' },
  { label: 'Selected Work', href: '/work', meta: 'Six projects and studies' },
  { label: 'Research', href: '/research', meta: 'Search, product, and markets notes' },
  { label: 'GitHub', href: PROFILE_FACTS.canonicalLinks.github, meta: 'Public code profile' },
  { label: 'LinkedIn', href: PROFILE_FACTS.canonicalLinks.linkedin, meta: 'Professional profile' },
  { label: 'Contact', href: '/contact', meta: 'Direct email and profile links' },
];

export default function ResumePage() {
  useSEO(RESUME_SEO);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageShell tone="light" className="visual-lab-page resume-visual">
      <WireframeGrid tone="light" className="pointer-events-none absolute inset-0 z-0 opacity-40 print:hidden" />
      <PageTechnicalChrome tone="light" />
      <ScrollProgress tone="dark" />
      <InternalHeader activePath="/resume" tone="light" />

      <PageFrame className="resume-visual__frame">
        <section className="resume-visual__hero" aria-labelledby="resume-title">
          <div className="resume-visual__masthead">
            <SectionEyebrow className="resume-visual__eyebrow">
              Résumé / reviewed {formatIsoDate(PROFILE_FACTS.lastReviewed)} / role-tense review {formatIsoDate(PROFILE_FACTS.nextRoleReview)}
            </SectionEyebrow>
            <h1 id="resume-title" className="visual-lab-display resume-visual__title">
              Sulayman Bowles
            </h1>
            <p className="resume-visual__statement">
              Technical systems builder working across crawl infrastructure, AI product workflows, analytics, and finance research.
            </p>
            <nav className="resume-visual__pathways" aria-label="Resume next steps">
              <a href="/work" data-portfolio-cta="resume_view_work">View selected work <span aria-hidden="true">→</span></a>
              <a href="/research" data-portfolio-cta="resume_read_research">Read research <span aria-hidden="true">→</span></a>
            </nav>
          </div>

          <aside className="resume-visual__summary">
            <SectionEyebrow>Education</SectionEyebrow>
            <p className="resume-visual__school">{PROFILE_FACTS.education.school}</p>
            <p className="resume-visual__education">
              {formatEducation()}<br />
              {PROFILE_FACTS.education.institution} · Expected {PROFILE_FACTS.education.expectedGraduation}
            </p>
            <div className="resume-visual__actions">
              <a href={RESUME_PDF_PATH} data-portfolio-cta="resume_download_pdf" className="resume-visual__action resume-visual__action--primary">
                <span>Download PDF résumé</span><DownloadArrowIcon />
              </a>
              <a href="mailto:sulayman.bowles@gmail.com" data-portfolio-cta="resume_email" className="resume-visual__action">
                sulayman.bowles@gmail.com
              </a>
              <button type="button" onClick={() => window.print()} className="resume-visual__action resume-visual__print">
                Print / save this page
              </button>
            </div>
          </aside>
        </section>

        <IndexedSection index="01" title="Education & focus" headingId="resume-education">
          <div className="visual-lab-dual-ledger">
            <article className="visual-lab-record">
              <SectionEyebrow>UT Austin</SectionEyebrow>
              <p className="visual-lab-record__lead">{formatEducation()} · expected {PROFILE_FACTS.education.expectedGraduation}</p>
              <p className="visual-lab-record__copy">Coursework includes {PROFILE_FACTS.education.coursework.join(', ')}.</p>
            </article>
            <article className="visual-lab-record">
              <SectionEyebrow>Current focus</SectionEyebrow>
              <p className="visual-lab-record__lead">Atlas, technical SEO, product systems, and markets research</p>
              <p className="visual-lab-record__copy">Designs crawl workflows, React and TypeScript interfaces, Python and SQLite data paths, structured exports, and review logic that keeps observations separate from recommendations and measurement gaps.</p>
            </article>
          </div>
        </IndexedSection>

        <IndexedSection index="02" title="Experience" headingId="resume-experience">
          <div className="visual-lab-record-stack">
            {PROFILE_FACTS.experience.map((item) => (
              <article key={`${item.title}-${item.organization}`} className="visual-lab-record visual-lab-record--experience">
                <div className="visual-lab-record__heading">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.organization} · {item.location}</p>
                  </div>
                  <p>{item.dates}</p>
                </div>
                <p className="visual-lab-record__copy">{item.publicSummary}</p>
                <ul className="visual-lab-record__bullets">
                  {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </IndexedSection>

        <IndexedSection index="03" title="Skill inventory" headingId="resume-skills">
          <div className="visual-lab-dual-ledger">
            {PROFILE_FACTS.skillGroups.map((group) => (
              <article key={group.label} className="visual-lab-record">
                <SectionEyebrow>{group.label}</SectionEyebrow>
                <p className="visual-lab-record__copy">{group.items.join(' · ')}</p>
              </article>
            ))}
          </div>
        </IndexedSection>

        <IndexedSection index="04" title="Awards & leadership" headingId="resume-leadership">
          <div className="visual-lab-record-stack">
            {PROFILE_FACTS.awardsAndLeadership.map((item) => (
              <article key={`${item.organization}-${item.title}`} className="visual-lab-record">
                <div className="visual-lab-record__heading">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.organization} · {item.location}</p>
                  </div>
                  <p>{item.dates}</p>
                </div>
                <p className="visual-lab-record__copy">{item.detail}</p>
              </article>
            ))}
          </div>
        </IndexedSection>

        <IndexedSection index="05" title="Additional qualifications" headingId="resume-qualifications">
          <div className="visual-lab-dual-ledger">
            <article className="visual-lab-record">
              <SectionEyebrow>Certifications</SectionEyebrow>
              <p className="visual-lab-record__copy">{PROFILE_FACTS.certifications.join(' · ')}</p>
            </article>
            <article className="visual-lab-record">
              <SectionEyebrow>Languages</SectionEyebrow>
              <p className="visual-lab-record__copy">{PROFILE_FACTS.languages.join(' · ')}</p>
            </article>
          </div>
        </IndexedSection>

        <IndexedSection index="06" title="Dated public claims and sources" headingId="resume-records">
          <div className="visual-lab-proof-ledger">
            {PROFILE_FACTS.proofClaims.map((item) => {
              const content = (
                <>
                  <span className="visual-lab-proof-ledger__date">As of {formatIsoDate(item.asOf)}</span>
                  <strong>{item.label}</strong>
                  <span>{item.claim}</span>
                </>
              );

              return item.publicSource ? (
                <a key={item.label} href={item.publicSource}>
                  {content}
                </a>
              ) : (
                <article key={item.label}>
                  {content}
                </article>
              );
            })}
          </div>
        </IndexedSection>

        <IndexedSection index="07" title="Supporting links" headingId="resume-links">
          <nav className="visual-lab-link-ledger" aria-label="Resume supporting links">
            {supportingLinks.map((link) => (
              <a key={link.href} href={link.href} data-portfolio-cta="resume_supporting_link" target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
                <span>{link.label}</span><span>{link.meta}</span>
              </a>
            ))}
          </nav>
        </IndexedSection>

        <div className="resume-visual__footer">
          <InternalFooter activePath="/resume" tone="light" />
        </div>
      </PageFrame>
    </PageShell>
  );
}
