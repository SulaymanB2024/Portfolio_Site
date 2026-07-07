import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { useState, type FormEvent } from 'react';

type AuditIntakeFormProps = {
  className?: string;
  variant?: 'default' | 'compact';
  showProgress?: boolean;
  submitLabel?: string;
};

const contactFieldClass =
  'w-full bg-transparent border-b border-canvas/20 focus:border-canvas py-2 text-sm font-sans tracking-normal outline-none transition-colors placeholder:text-canvas/32 text-canvas';
const contactSelectClass = `${contactFieldClass} appearance-none text-canvas/82`;
const sensitiveSubmissionPattern =
  /(-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|sk-[0-9A-Za-z_-]{20,}|xox[baprs]-[0-9A-Za-z-]{20,}|(?:api[_-]?key|access[_-]?token|password|private[_-]?key|client[_-]?secret)\s*[:=])/i;

function hasSensitiveSubmissionText(values: string[]) {
  return values.some((value) => sensitiveSubmissionPattern.test(value));
}

function ContactFieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="sr-only">
      {children}
    </label>
  );
}

export function AuditIntakeForm({
  className = '',
  variant = 'default',
  showProgress = true,
  submitLabel = 'SUBMIT BRIEF',
}: AuditIntakeFormProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [projectType, setProjectType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [scope, setScope] = useState('');
  const [brokenArea, setBrokenArea] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const progressSteps = [
    { step: '01', label: 'Identity', complete: Boolean(name && email) },
    { step: '02', label: 'Site', complete: Boolean(websiteUrl) },
    { step: '03', label: 'Scope', complete: Boolean(projectType || timeline || scope) },
    { step: '04', label: 'Message', complete: Boolean(message) },
  ];
  const completeStepCount = progressSteps.filter((step) => step.complete).length;
  const isCompact = variant === 'compact';
  const statusDetail =
    formStatus === 'submitting'
      ? 'sealing brief'
      : formStatus === 'error'
        ? validationMessage || 'endpoint refused'
        : showProgress
          ? `${completeStepCount}/4 fields traced`
          : 'email + message required';

  const resetForm = () => {
    setName('');
    setEmail('');
    setWebsiteUrl('');
    setProjectType('');
    setTimeline('');
    setScope('');
    setBrokenArea('');
    setMessage('');
    setHoneypot('');
    setValidationMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationMessage('');
    if (!email || !message) return;

    if (honeypot.trim()) {
      setFormStatus('success');
      resetForm();
      return;
    }

    if (hasSensitiveSubmissionText([name, email, websiteUrl, projectType, timeline, scope, brokenArea, message])) {
      setValidationMessage('remove secrets');
      setFormStatus('error');
      return;
    }

    setFormStatus('submitting');
    const triggerShutter = (window as Window & { triggerShutter?: (covered: boolean) => void }).triggerShutter;
    if (triggerShutter) {
      triggerShutter(true);
    }

    try {
      const response = await fetch('https://formspree.io/f/xyzrppzo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          websiteUrl,
          projectType,
          timeline,
          scope,
          brokenArea,
          message,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          setFormStatus('success');
          resetForm();
          if (triggerShutter) {
            triggerShutter(false);
          }
        }, 800);
      } else {
        setValidationMessage('endpoint refused');
        setFormStatus('error');
        if (triggerShutter) {
          triggerShutter(false);
        }
      }
    } catch {
      setValidationMessage('submission failed');
      setFormStatus('error');
      if (triggerShutter) {
        triggerShutter(false);
      }
    }
  };

  if (formStatus === 'success') {
    return (
      <div className={`text-canvas font-sans font-light tracking-widest uppercase text-base md:text-lg py-6 border border-canvas/20 px-8 bg-canvas/5 ${isCompact ? 'max-w-none' : 'max-w-lg mt-4'} ${className}`}>
        <p className="mb-2 font-medium text-accent">Brief Received</p>
        <p className="text-[10px] text-canvas/60 normal-case tracking-normal leading-relaxed">
          Thank you. Your message has been sent successfully. I will review your submission and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${isCompact ? 'max-w-none space-y-4' : 'max-w-xl space-y-6 mt-4'} ${className}`}>
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company-url">Company URL</label>
        <input
          id="contact-company-url"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      {showProgress && (
        <ol className="grid grid-cols-2 gap-px overflow-hidden border border-canvas/12 text-[8px] uppercase tracking-[0.18em] text-canvas/46 md:grid-cols-4">
          {progressSteps.map((item) => (
            <li
              key={item.step}
              className={`grid min-h-14 content-between bg-canvas/[0.025] p-3 transition-colors duration-200 ${
                item.complete ? 'text-canvas' : ''
              }`}
            >
              <span className="font-serif text-sm italic tracking-normal text-canvas/72">{item.step}</span>
              <span className="leading-none">{item.label}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ContactFieldLabel htmlFor="contact-name">Your name</ContactFieldLabel>
          <input
            type="text"
            required
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={contactFieldClass}
          />
        </div>
        <div>
          <ContactFieldLabel htmlFor="contact-email">Your email</ContactFieldLabel>
          <input
            type="email"
            required
            id="contact-email"
            name="email"
            autoComplete="email"
            placeholder="Your email"
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={contactFieldClass}
          />
        </div>
      </div>
      <ContactFieldLabel htmlFor="contact-website-url">Website URL</ContactFieldLabel>
      <input
        type="url"
        id="contact-website-url"
        name="websiteUrl"
        autoComplete="url"
        placeholder="Website URL"
        maxLength={240}
        value={websiteUrl}
        onChange={(e) => setWebsiteUrl(e.target.value)}
        className={contactFieldClass}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <ContactFieldLabel htmlFor="contact-project-type">Project type</ContactFieldLabel>
          <select
            id="contact-project-type"
            name="projectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className={contactSelectClass}
          >
            <option value="" className="bg-ink text-canvas">Project type</option>
            <option value="Technical SEO audit" className="bg-ink text-canvas">Technical SEO audit</option>
            <option value="Search visibility" className="bg-ink text-canvas">Search visibility</option>
            <option value="Markets research" className="bg-ink text-canvas">Markets research</option>
            <option value="Web system" className="bg-ink text-canvas">Web system</option>
          </select>
        </div>
        <div>
          <ContactFieldLabel htmlFor="contact-timeline">Timeline</ContactFieldLabel>
          <select
            id="contact-timeline"
            name="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className={contactSelectClass}
          >
            <option value="" className="bg-ink text-canvas">Timeline</option>
            <option value="This week" className="bg-ink text-canvas">This week</option>
            <option value="2-4 weeks" className="bg-ink text-canvas">2-4 weeks</option>
            <option value="1-2 months" className="bg-ink text-canvas">1-2 months</option>
            <option value="Flexible" className="bg-ink text-canvas">Flexible</option>
          </select>
        </div>
        <div>
          <ContactFieldLabel htmlFor="contact-scope">Scope size</ContactFieldLabel>
          <select
            id="contact-scope"
            name="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className={contactSelectClass}
          >
            <option value="" className="bg-ink text-canvas">Scope size</option>
            <option value="Small audit" className="bg-ink text-canvas">Small audit</option>
            <option value="Full site audit" className="bg-ink text-canvas">Full site audit</option>
            <option value="Implementation support" className="bg-ink text-canvas">Implementation support</option>
            <option value="Research sprint" className="bg-ink text-canvas">Research sprint</option>
          </select>
        </div>
      </div>
      <ContactFieldLabel htmlFor="contact-broken-area">What feels broken?</ContactFieldLabel>
      <textarea
        rows={isCompact ? 1 : 2}
        id="contact-broken-area"
        name="brokenArea"
        placeholder="What feels broken?"
        maxLength={500}
        value={brokenArea}
        onChange={(e) => setBrokenArea(e.target.value)}
        className={`${contactFieldClass} resize-none`}
      />
      <ContactFieldLabel htmlFor="contact-message">Project details, goals, or audit request</ContactFieldLabel>
      <textarea
        required
        rows={isCompact ? 2 : 3}
        id="contact-message"
        name="message"
        placeholder="Project details, goals, or audit request"
        maxLength={2000}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`${contactFieldClass} resize-none`}
      />
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        {formStatus === 'error' && (
          <span className="text-red-400 text-[10px] font-sans tracking-widest uppercase">
            {validationMessage === 'remove secrets'
              ? 'Remove credentials, keys, tokens, or passwords before sending.'
              : 'Submission failed. Please try again.'}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-[0.2em] text-canvas/42">
          {statusDetail}
        </span>
        <button
          type="submit"
          disabled={formStatus === 'submitting'}
          className="group flex min-h-11 w-fit items-center gap-6 bg-transparent border-none outline-none text-left disabled:opacity-50"
        >
          <span className="text-lg md:text-xl font-sans font-light tracking-widest uppercase pb-1 border-b-2 border-canvas/20 group-hover:border-canvas transition-colors text-canvas">
            {formStatus === 'submitting' ? 'SENDING...' : submitLabel}
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-canvas/20 text-canvas transition-colors group-hover:bg-canvas group-hover:text-ink">
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
          </div>
        </button>
      </div>
    </form>
  );
}

export default AuditIntakeForm;
