import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.js';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';

type AuditIntakeFormProps = {
  className?: string;
  variant?: 'default' | 'compact';
  showProgress?: boolean;
  submitLabel?: string;
};

const fieldClass =
  'w-full border-b border-canvas/24 bg-transparent py-3 text-sm tracking-normal text-canvas outline-none transition-colors placeholder:text-canvas/60 focus:border-canvas';
const selectClass = `${fieldClass} appearance-none text-canvas/86`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const sensitiveSubmissionPattern =
  /(-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{20,}|ghp_[0-9A-Za-z]{20,}|sk-[0-9A-Za-z_-]{20,}|xox[baprs]-[0-9A-Za-z-]{20,}|(?:api[_-]?key|access[_-]?token|password|private[_-]?key|client[_-]?secret)\s*[:=])/i;

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-canvas/64">
      {children}
    </label>
  );
}

export function AuditIntakeForm({
  className = '',
  variant = 'default',
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
  const [invalidFields, setInvalidFields] = useState({ email: false, websiteUrl: false, message: false });
  const emailInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const isCompact = variant === 'compact';
  const emailInvalid = formStatus === 'error' && invalidFields.email;
  const websiteInvalid = formStatus === 'error' && invalidFields.websiteUrl;
  const messageInvalid = formStatus === 'error' && invalidFields.message;

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
    setInvalidFields({ email: false, websiteUrl: false, message: false });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage('');

    const normalizedEmail = email.trim();
    const normalizedWebsiteUrl = websiteUrl.trim();
    const normalizedMessage = message.trim();
    let websiteIsValid = true;

    if (normalizedWebsiteUrl) {
      try {
        const parsedWebsiteUrl = new URL(normalizedWebsiteUrl);
        websiteIsValid = parsedWebsiteUrl.protocol === 'http:' || parsedWebsiteUrl.protocol === 'https:';
      } catch {
        websiteIsValid = false;
      }
    }

    const nextInvalidFields = {
      email: !normalizedEmail || !emailPattern.test(normalizedEmail),
      websiteUrl: !websiteIsValid,
      message: !normalizedMessage,
    };

    if (nextInvalidFields.email || nextInvalidFields.websiteUrl || nextInvalidFields.message) {
      const nextMessage = !normalizedEmail && !normalizedMessage
        ? 'Email and message required.'
        : !normalizedEmail
          ? 'Email is required.'
          : !emailPattern.test(normalizedEmail)
            ? 'Enter a valid email address.'
            : !websiteIsValid
              ? 'Enter a complete website URL including https://.'
              : 'Message is required.';

      setValidationMessage(nextMessage);
      setInvalidFields(nextInvalidFields);
      setFormStatus('error');
      (nextInvalidFields.email
        ? emailInputRef.current
        : nextInvalidFields.websiteUrl
          ? websiteInputRef.current
          : messageInputRef.current)?.focus();
      return;
    }

    setInvalidFields({ email: false, websiteUrl: false, message: false });

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
      <div className={`border border-canvas/24 bg-canvas/5 px-6 py-6 text-canvas ${className}`} role="status" aria-live="polite">
        <p className="font-medium text-accent">Message sent</p>
        <p className="mt-2 text-sm normal-case leading-relaxed tracking-normal text-canvas/72">
          Thank you. I will review the message and reply by email.
        </p>
        <button type="button" className="mt-5 text-[10px] uppercase tracking-[0.2em] text-canvas/68 underline underline-offset-4" onClick={() => setFormStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className={`w-full ${isCompact ? 'space-y-5' : 'max-w-xl space-y-6'} ${className}`}>
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company-url">Company URL</label>
        <input id="contact-company-url" name="_gotcha" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-name">Name <span className="normal-case tracking-normal">(optional)</span></FieldLabel>
          <input id="contact-name" name="name" type="text" autoComplete="name" maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} />
        </div>
        <div>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <input ref={emailInputRef} id="contact-email" name="email" type="email" required aria-invalid={emailInvalid} aria-describedby="contact-form-status" autoComplete="email" maxLength={160} value={email} onChange={(event) => setEmail(event.target.value)} className={fieldClass} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="contact-website-url">Website <span className="normal-case tracking-normal">(optional)</span></FieldLabel>
        <input ref={websiteInputRef} id="contact-website-url" name="websiteUrl" type="url" aria-invalid={websiteInvalid} aria-describedby="contact-form-status" autoComplete="url" placeholder="https://example.com" maxLength={240} value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} className={fieldClass} />
      </div>

      <div>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <textarea ref={messageInputRef} id="contact-message" name="message" required aria-invalid={messageInvalid} aria-describedby="contact-form-status" rows={isCompact ? 5 : 4} placeholder="What are you trying to understand, fix, or build?" maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} className={`${fieldClass} resize-y`} />
      </div>

      <details className="border border-canvas/16 bg-canvas/[0.025]">
        <summary className="min-h-11 cursor-pointer px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-canvas/68">
          Add project details <span className="normal-case tracking-normal">(optional)</span>
        </summary>
        <div className="grid gap-5 border-t border-canvas/14 p-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="contact-project-type">Project type</FieldLabel>
            <select id="contact-project-type" name="projectType" value={projectType} onChange={(event) => setProjectType(event.target.value)} className={selectClass}>
              <option value="" className="bg-ink text-canvas">Choose</option>
              <option value="Technical SEO audit" className="bg-ink text-canvas">Technical SEO audit</option>
              <option value="Search visibility" className="bg-ink text-canvas">Search visibility</option>
              <option value="Research" className="bg-ink text-canvas">Research</option>
              <option value="Web system" className="bg-ink text-canvas">Web system</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="contact-timeline">Timeline</FieldLabel>
            <select id="contact-timeline" name="timeline" value={timeline} onChange={(event) => setTimeline(event.target.value)} className={selectClass}>
              <option value="" className="bg-ink text-canvas">Choose</option>
              <option value="This week" className="bg-ink text-canvas">This week</option>
              <option value="2-4 weeks" className="bg-ink text-canvas">2–4 weeks</option>
              <option value="1-2 months" className="bg-ink text-canvas">1–2 months</option>
              <option value="Flexible" className="bg-ink text-canvas">Flexible</option>
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="contact-scope">Scope</FieldLabel>
            <select id="contact-scope" name="scope" value={scope} onChange={(event) => setScope(event.target.value)} className={selectClass}>
              <option value="" className="bg-ink text-canvas">Choose</option>
              <option value="Focused review" className="bg-ink text-canvas">Focused review</option>
              <option value="Full audit" className="bg-ink text-canvas">Full audit</option>
              <option value="Implementation" className="bg-ink text-canvas">Implementation</option>
              <option value="Research sprint" className="bg-ink text-canvas">Research sprint</option>
            </select>
          </div>
        </div>
      </details>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div id="contact-form-status" className="max-w-sm text-xs leading-relaxed text-canvas/64" role={formStatus === 'error' ? 'alert' : 'status'} aria-live={formStatus === 'error' ? 'assertive' : 'polite'}>
          {formStatus === 'submitting' ? 'Sending…' : formStatus === 'error' ? validationMessage : 'Email and message required.'}
          <span className="mt-1 block text-canvas/60">
            Formspree processes this submission. Do not send credentials or sensitive client data.
          </span>
        </div>
        <button type="submit" disabled={formStatus === 'submitting'} className="group flex min-h-11 items-center gap-5 disabled:opacity-50">
          <span className="border-b-2 border-canvas/24 pb-1 text-base font-light uppercase tracking-[0.18em] text-canvas transition-colors group-hover:border-canvas">
            {formStatus === 'submitting' ? 'SENDING…' : submitLabel}
          </span>
          <span className="flex h-11 w-11 items-center justify-center border border-canvas/24 text-canvas transition-colors group-hover:bg-canvas group-hover:text-ink">
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </button>
      </div>
    </form>
  );
}

export default AuditIntakeForm;
