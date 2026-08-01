import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { useState, type FormEvent, type ReactNode } from 'react';

type AuditIntakeFormProps = {
  className?: string;
  variant?: 'default' | 'compact' | 'editorial';
  tone?: 'dark' | 'light';
  showProgress?: boolean;
  submitLabel?: string;
};

type IntakeField = 'name' | 'email' | 'websiteUrl' | 'message';
type IntakeFieldErrors = Partial<Record<IntakeField, string>>;

const sensitiveSubmissionPattern =
  /(-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|sk-[0-9A-Za-z_-]{20,}|xox[baprs]-[0-9A-Za-z-]{20,}|(?:api[_-]?key|access[_-]?token|password|private[_-]?key|client[_-]?secret)\s*[:=])/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const directEmail = 'sulayman.bowles@gmail.com';

function FieldLabel({ htmlFor, children, tone }: { htmlFor: string; children: ReactNode; tone: 'dark' | 'light' }) {
  return (
    <label htmlFor={htmlFor} className={`mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] ${tone === 'light' ? 'text-ink/68' : 'text-canvas/72'}`}>
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
  const [fieldErrors, setFieldErrors] = useState<IntakeFieldErrors>({});
  const isCompact = variant === 'compact';
  const isEditorial = variant === 'editorial';
  const isLight = tone === 'light';
  const fieldClass = `w-full rounded-none border px-3 py-3 text-base tracking-normal outline-none transition-[background-color,border-color,box-shadow] sm:text-sm ${
    isLight
      ? 'border-ink/24 bg-ink/[0.025] text-ink placeholder:text-ink/58 hover:border-ink/40 focus:border-accent focus:bg-ink/[0.045]'
      : 'border-canvas/28 bg-canvas/[0.035] text-canvas placeholder:text-canvas/68 hover:border-canvas/44 focus:border-accent focus:bg-canvas/[0.055]'
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
    setFieldErrors({});
  };

  const clearFieldError = (field: IntakeField) => {
    if (formStatus === 'error') {
      setFormStatus('idle');
      setValidationMessage('');
    }
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage('');

    const nextFieldErrors: IntakeFieldErrors = {};
    if (!name.trim()) {
      nextFieldErrors.name = 'Enter your name.';
    }
    if (!email.trim()) {
      nextFieldErrors.email = 'Enter your email address.';
    } else if (!emailPattern.test(email.trim())) {
      nextFieldErrors.email = 'Enter a complete email address.';
    }
    if (websiteUrl.trim()) {
      try {
        const parsedWebsiteUrl = new URL(websiteUrl.trim());
        if (!['http:', 'https:'].includes(parsedWebsiteUrl.protocol)) {
          nextFieldErrors.websiteUrl = 'Use a full http:// or https:// URL.';
        }
      } catch {
        nextFieldErrors.websiteUrl = 'Use a full URL such as https://example.com.';
      }
    }
    if (!message.trim()) {
      nextFieldErrors.message = 'Describe what you want to understand, fix, or build.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setValidationMessage('Review the highlighted fields.');
      setFormStatus('error');
      const firstInvalidField = (['name', 'email', 'websiteUrl', 'message'] as IntakeField[]).find(
        (field) => nextFieldErrors[field],
      );
      if (firstInvalidField) {
        window.requestAnimationFrame(() => {
          const element = document.getElementById(`contact-${firstInvalidField.replace('websiteUrl', 'website-url')}`);
          element?.focus({ preventScroll: true });
          element?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'center',
          });
        });
      }
      return;
    }

    setFieldErrors({});

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
      setValidationMessage('Could not send through the form.');
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
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-busy={formStatus === 'submitting'}
      className={`w-full ${isCompact ? 'space-y-5' : isEditorial ? 'space-y-8' : 'max-w-xl space-y-6'} ${className}`}
    >
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-company-url">Company URL</label>
        <input id="contact-company-url" name="_gotcha" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="scroll-mt-28">
          <FieldLabel htmlFor="contact-name" tone={tone}>Name</FieldLabel>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            value={name}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            onChange={(event) => {
              setName(event.target.value);
              clearFieldError('name');
            }}
            className={`${fieldClass} ${fieldErrors.name ? 'border-risk' : ''}`}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className={`mt-2 border-l border-risk pl-3 text-xs leading-relaxed ${isLight ? 'text-ink/76' : 'text-canvas/78'}`}>
              Error — {fieldErrors.name}
            </p>
          )}
        </div>
        <div className="scroll-mt-28">
          <FieldLabel htmlFor="contact-email" tone={tone}>Email</FieldLabel>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={160}
            value={email}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={`contact-email-help${fieldErrors.email ? ' contact-email-error' : ''}`}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFieldError('email');
            }}
            className={`${fieldClass} ${fieldErrors.email ? 'border-risk' : ''}`}
          />
          <p id="contact-email-help" className={`mt-2 text-xs leading-relaxed ${isLight ? 'text-ink/58' : 'text-canvas/58'}`}>
            Use an address where the request can be discussed.
          </p>
          {fieldErrors.email && (
            <p id="contact-email-error" className={`mt-2 border-l border-risk pl-3 text-xs leading-relaxed ${isLight ? 'text-ink/76' : 'text-canvas/78'}`}>
              Error — {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="scroll-mt-28">
        <FieldLabel htmlFor="contact-website-url" tone={tone}>Website <span className="normal-case tracking-normal">(optional)</span></FieldLabel>
        <input
          id="contact-website-url"
          name="websiteUrl"
          type="url"
          autoComplete="url"
          placeholder="https://example.com"
          maxLength={240}
          value={websiteUrl}
          aria-invalid={fieldErrors.websiteUrl ? true : undefined}
          aria-describedby={`contact-website-url-help${fieldErrors.websiteUrl ? ' contact-website-url-error' : ''}`}
          onChange={(event) => {
            setWebsiteUrl(event.target.value);
            clearFieldError('websiteUrl');
          }}
          className={`${fieldClass} ${fieldErrors.websiteUrl ? 'border-risk' : ''}`}
        />
        <p id="contact-website-url-help" className={`mt-2 text-xs leading-relaxed ${isLight ? 'text-ink/58' : 'text-canvas/58'}`}>
          A public URL is useful. Leave this blank for a private or pre-launch surface; never paste access credentials.
        </p>
        {fieldErrors.websiteUrl && (
          <p id="contact-website-url-error" className={`mt-2 border-l border-risk pl-3 text-xs leading-relaxed ${isLight ? 'text-ink/76' : 'text-canvas/78'}`}>
            Error — {fieldErrors.websiteUrl}
          </p>
        )}
      </div>

      <div className="scroll-mt-28">
        <FieldLabel htmlFor="contact-message" tone={tone}>Decision / problem</FieldLabel>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={isCompact ? 5 : isEditorial ? 6 : 4}
          placeholder="What changed or failed? What decision must this support? What would count as a useful next check?"
          maxLength={2000}
          value={message}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={`contact-message-help${fieldErrors.message ? ' contact-message-error' : ''}`}
          onChange={(event) => {
            setMessage(event.target.value);
            clearFieldError('message');
          }}
          className={`${fieldClass} resize-y ${fieldErrors.message ? 'border-risk' : ''}`}
        />
        <p id="contact-message-help" className={`mt-2 text-xs leading-relaxed ${isLight ? 'text-ink/58' : 'text-canvas/58'}`}>
          Include affected URLs or templates, known constraints, the decision owner, and any real deadline. Do not include secrets.
        </p>
        {fieldErrors.message && (
          <p id="contact-message-error" className={`mt-2 border-l border-risk pl-3 text-xs leading-relaxed ${isLight ? 'text-ink/76' : 'text-canvas/78'}`}>
            Error — {fieldErrors.message}
          </p>
        )}
      </div>

      <details className={`border ${isLight ? 'border-ink/16 bg-ink/[0.018]' : 'border-canvas/16 bg-canvas/[0.025]'}`}>
        <summary className={`min-h-11 cursor-pointer px-4 py-3 text-[10px] uppercase tracking-[0.2em] ${isLight ? 'text-ink/68' : 'text-canvas/68'}`}>
          Optional scoping context
        </summary>
        <div className={`grid gap-5 border-t p-4 sm:grid-cols-3 ${isLight ? 'border-ink/14' : 'border-canvas/14'}`}>
          <div>
            <FieldLabel htmlFor="contact-project-type" tone={tone}>Project type</FieldLabel>
            <select id="contact-project-type" name="projectType" value={projectType} onChange={(event) => setProjectType(event.target.value)} className={selectClass}>
              <option value="" className={optionClass}>Choose</option>
              <option value="Technical SEO audit" className={optionClass}>Technical SEO audit</option>
              <option value="Crawl or indexation diagnosis" className={optionClass}>Crawl / indexation</option>
              <option value="AI system or evaluation" className={optionClass}>AI system / evaluation</option>
              <option value="Analytics or research" className={optionClass}>Analytics / research</option>
              <option value="Implementation validation" className={optionClass}>Implementation validation</option>
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
              <option value="Focused diagnosis" className={optionClass}>Focused diagnosis</option>
              <option value="Full audit" className={optionClass}>Full audit</option>
              <option value="Implementation support" className={optionClass}>Implementation support</option>
              <option value="Validation or rerun" className={optionClass}>Validation / rerun</option>
              <option value="Research sprint" className={optionClass}>Research sprint</option>
            </select>
          </div>
        </div>
      </details>

      <div className={`flex flex-wrap items-center justify-between gap-5 pt-2 ${isEditorial ? `border-t py-5 ${isLight ? 'border-ink/18' : 'border-canvas/18'}` : ''}`}>
        <div
          className={`max-w-sm text-xs leading-relaxed ${isLight ? 'text-ink/64' : 'text-canvas/64'}`}
          aria-live={formStatus === 'error' ? 'assertive' : 'polite'}
        >
          {formStatus === 'submitting' ? 'Sending…' : formStatus === 'error' ? validationMessage : 'Name, email, and decision context required.'}
          <span className={`mt-1 block ${isLight ? 'text-ink/60' : 'text-canvas/60'}`}>
            Formspree processes this submission. Do not send credentials or sensitive client data.{' '}
            <a href={`mailto:${directEmail}`} className="underline decoration-current/40 underline-offset-2 hover:decoration-current">
              Use direct email
            </a>{' '}
            if you prefer not to use the form.
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
