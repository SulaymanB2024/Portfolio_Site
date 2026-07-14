import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { useState, type FormEvent, type ReactNode } from 'react';

type AuditIntakeFormProps = {
  className?: string;
  variant?: 'default' | 'compact' | 'editorial';
  tone?: 'dark' | 'light';
  showProgress?: boolean;
  submitLabel?: string;
};

const sensitiveSubmissionPattern =
  /(-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|sk-[0-9A-Za-z_-]{20,}|xox[baprs]-[0-9A-Za-z-]{20,}|(?:api[_-]?key|access[_-]?token|password|private[_-]?key|client[_-]?secret)\s*[:=])/i;

function FieldLabel({ htmlFor, children, tone }: { htmlFor: string; children: ReactNode; tone: 'dark' | 'light' }) {
  return (
    <label htmlFor={htmlFor} className={`mb-2 block text-[10px] uppercase tracking-[0.24em] ${tone === 'light' ? 'text-ink/60' : 'text-canvas/64'}`}>
      {children}
    </label>
  );
}

export function AuditIntakeForm({
  className = '',
  variant = 'default',
  tone = 'dark',
  submitLabel = 'SEND MESSAGE',
}: AuditIntakeFormProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [projectType, setProjectType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [scope, setScope] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const isCompact = variant === 'compact';
  const isEditorial = variant === 'editorial';
  const isLight = tone === 'light';
  const fieldClass = `w-full border-b bg-transparent py-3 text-sm tracking-normal outline-none transition-colors ${
    isLight
      ? 'border-ink/22 text-ink placeholder:text-ink/42 focus:border-ink'
      : 'border-canvas/24 text-canvas placeholder:text-canvas/60 focus:border-canvas'
  }`;
  const selectClass = `${fieldClass} appearance-none ${isLight ? 'text-ink/86' : 'text-canvas/86'}`;
  const optionClass = isLight ? 'bg-canvas text-ink' : 'bg-ink text-canvas';

  const resetForm = () => {
    setName('');
    setEmail('');
    setWebsiteUrl('');
    setMessage('');
    setProjectType('');
    setTimeline('');
    setScope('');
    setHoneypot('');
    setValidationMessage('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage('');

    if (!email.trim() || !message.trim()) {
      setValidationMessage('Email and message required.');
      setFormStatus('error');
      return;
    }

    if (honeypot.trim()) {
      setFormStatus('success');
      resetForm();
      return;
    }

    if (sensitiveSubmissionPattern.test([name, email, websiteUrl, message, projectType, timeline, scope].join('\n'))) {
      setValidationMessage('Remove credentials, keys, tokens, or passwords before sending.');
      setFormStatus('error');
      return;
    }

    setFormStatus('submitting');

    try {
      const response = await fetch('https://formspree.io/f/xyzrppzo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, websiteUrl, message, projectType, timeline, scope }),
      });

      if (!response.ok) {
        throw new Error('Formspree request failed');
      }

      resetForm();
      setFormStatus('success');
    } catch {
      setValidationMessage('Could not send. Please try again or use direct email.');
      setFormStatus('error');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className={`border px-6 py-6 ${isLight ? 'border-ink/20 bg-ink/[0.025] text-ink' : 'border-canvas/24 bg-canvas/5 text-canvas'} ${className}`} role="status" aria-live="polite">
        <p className="font-medium text-accent">Message sent</p>
        <p className={`mt-2 text-sm normal-case leading-relaxed tracking-normal ${isLight ? 'text-ink/72' : 'text-canvas/72'}`}>
          Thank you. I will review the message and reply by email.
        </p>
        <button type="button" className={`mt-5 text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 ${isLight ? 'text-ink/68' : 'text-canvas/68'}`} onClick={() => setFormStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${isCompact ? 'space-y-5' : isEditorial ? 'space-y-8' : 'max-w-xl space-y-6'} ${className}`}>
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-company-url">Company URL</label>
        <input id="contact-company-url" name="_gotcha" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-name" tone={tone}>Name</FieldLabel>
          <input id="contact-name" name="name" type="text" required autoComplete="name" maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
        </div>
        <div>
          <FieldLabel htmlFor="contact-email" tone={tone}>Email</FieldLabel>
          <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={160} value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="contact-website-url" tone={tone}>Website <span className="normal-case tracking-normal">(optional)</span></FieldLabel>
        <input id="contact-website-url" name="websiteUrl" type="url" autoComplete="url" placeholder="https://example.com" maxLength={240} value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} className={fieldClass} />
      </div>

      <div>
        <FieldLabel htmlFor="contact-message" tone={tone}>Message</FieldLabel>
        <textarea id="contact-message" name="message" required rows={isCompact ? 5 : isEditorial ? 6 : 4} placeholder={isEditorial ? 'What decision are you trying to make, and what should I look at?' : 'What are you trying to understand, fix, or build?'} maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} className={`${fieldClass} resize-y`} />
      </div>

      <details className={`border ${isLight ? 'border-ink/16 bg-ink/[0.018]' : 'border-canvas/16 bg-canvas/[0.025]'}`}>
        <summary className={`min-h-11 cursor-pointer px-4 py-3 text-[10px] uppercase tracking-[0.2em] ${isLight ? 'text-ink/68' : 'text-canvas/68'}`}>
          Optional context
        </summary>
        <div className={`grid gap-5 border-t p-4 sm:grid-cols-3 ${isLight ? 'border-ink/14' : 'border-canvas/14'}`}>
          <div>
            <FieldLabel htmlFor="contact-project-type" tone={tone}>Project type</FieldLabel>
            <select id="contact-project-type" name="projectType" value={projectType} onChange={(event) => setProjectType(event.target.value)} className={selectClass}>
              <option value="" className={optionClass}>Choose</option>
              <option value="Technical SEO audit" className={optionClass}>Technical SEO audit</option>
              <option value="Search visibility" className={optionClass}>Search visibility</option>
              <option value="Research" className={optionClass}>Research</option>
              <option value="Web system" className={optionClass}>Web system</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="contact-timeline" tone={tone}>Timeline</FieldLabel>
            <select id="contact-timeline" name="timeline" value={timeline} onChange={(event) => setTimeline(event.target.value)} className={selectClass}>
              <option value="" className={optionClass}>Choose</option>
              <option value="This week" className={optionClass}>This week</option>
              <option value="2-4 weeks" className={optionClass}>2–4 weeks</option>
              <option value="1-2 months" className={optionClass}>1–2 months</option>
              <option value="Flexible" className={optionClass}>Flexible</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="contact-scope" tone={tone}>Scope</FieldLabel>
            <select id="contact-scope" name="scope" value={scope} onChange={(event) => setScope(event.target.value)} className={selectClass}>
              <option value="" className={optionClass}>Choose</option>
              <option value="Focused review" className={optionClass}>Focused review</option>
              <option value="Full audit" className={optionClass}>Full audit</option>
              <option value="Implementation" className={optionClass}>Implementation</option>
              <option value="Research sprint" className={optionClass}>Research sprint</option>
            </select>
          </div>
        </div>
      </details>

      <div className={`flex flex-wrap items-center justify-between gap-5 pt-2 ${isEditorial ? `border-t py-5 ${isLight ? 'border-ink/18' : 'border-canvas/18'}` : ''}`}>
        <div className={`max-w-sm text-xs leading-relaxed ${isLight ? 'text-ink/64' : 'text-canvas/64'}`} aria-live="polite">
          {formStatus === 'submitting' ? 'Sending…' : formStatus === 'error' ? validationMessage : 'Email and message required.'}
          <span className={`mt-1 block ${isLight ? 'text-ink/60' : 'text-canvas/60'}`}>
            Formspree processes this submission. Do not send credentials or sensitive client data.
          </span>
        </div>
        <button type="submit" disabled={formStatus === 'submitting'} className="group flex min-h-11 items-center gap-5 disabled:opacity-50">
          <span className={`border-b-2 pb-1 text-base font-light uppercase tracking-[0.18em] transition-colors ${isLight ? 'border-ink/24 text-ink group-hover:border-ink' : 'border-canvas/24 text-canvas group-hover:border-canvas'}`}>
            {formStatus === 'submitting' ? 'SENDING…' : submitLabel}
          </span>
          <span className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${isLight ? 'border-ink/24 text-ink group-hover:bg-ink group-hover:text-canvas' : 'border-canvas/24 text-canvas group-hover:bg-canvas group-hover:text-ink'}`}>
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </button>
      </div>
    </form>
  );
}

export default AuditIntakeForm;
