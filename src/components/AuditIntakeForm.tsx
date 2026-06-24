import { useState, type FormEvent } from 'react';

type AuditIntakeFormProps = {
  className?: string;
};

const contactFieldClass =
  'w-full bg-transparent border-b border-canvas/20 focus:border-canvas py-2 text-sm font-sans tracking-normal outline-none transition-colors placeholder:text-canvas/32 text-canvas';
const contactSelectClass = `${contactFieldClass} appearance-none text-canvas/82`;

function ContactFieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="sr-only">
      {children}
    </label>
  );
}

export function AuditIntakeForm({ className = '' }: AuditIntakeFormProps) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [projectType, setProjectType] = useState('');
  const [timeline, setTimeline] = useState('');
  const [scope, setScope] = useState('');
  const [brokenArea, setBrokenArea] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !message) return;

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
          setName('');
          setEmail('');
          setWebsiteUrl('');
          setProjectType('');
          setTimeline('');
          setScope('');
          setBrokenArea('');
          setMessage('');
          if (triggerShutter) {
            triggerShutter(false);
          }
        }, 800);
      } else {
        setFormStatus('error');
        if (triggerShutter) {
          triggerShutter(false);
        }
      }
    } catch {
      setFormStatus('error');
      if (triggerShutter) {
        triggerShutter(false);
      }
    }
  };

  if (formStatus === 'success') {
    return (
      <div className={`text-canvas font-sans font-light tracking-widest uppercase text-base md:text-lg py-6 border border-canvas/20 px-8 rounded bg-canvas/5 max-w-lg mt-4 ${className}`}>
        <p className="text-[#a3e635] mb-2 font-medium">Brief Received</p>
        <p className="text-[10px] text-canvas/60 normal-case tracking-normal leading-relaxed">
          Thank you. Your message has been sent successfully. I will review your submission and get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-xl space-y-6 mt-4 ${className}`}>
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
            <option value="AI-search visibility" className="bg-ink text-canvas">AI-search visibility</option>
            <option value="Finance/data research" className="bg-ink text-canvas">Finance/data research</option>
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
        rows={2}
        id="contact-broken-area"
        name="brokenArea"
        placeholder="What feels broken?"
        value={brokenArea}
        onChange={(e) => setBrokenArea(e.target.value)}
        className={`${contactFieldClass} resize-none`}
      />
      <ContactFieldLabel htmlFor="contact-message">Project details, goals, or audit request</ContactFieldLabel>
      <textarea
        required
        rows={3}
        id="contact-message"
        name="message"
        placeholder="Project details, goals, or audit request"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`${contactFieldClass} resize-none`}
      />
      <div className="flex items-center justify-between pt-2">
        {formStatus === 'error' && (
          <span className="text-red-400 text-[10px] font-sans tracking-widest uppercase">
            Submission failed. Please try again.
          </span>
        )}
        <button
          type="submit"
          disabled={formStatus === 'submitting'}
          className="group flex min-h-11 w-fit items-center gap-6 bg-transparent border-none outline-none text-left disabled:opacity-50"
        >
          <span className="text-lg md:text-xl font-sans font-light tracking-widest uppercase pb-1 border-b-2 border-canvas/20 group-hover:border-canvas transition-colors text-canvas">
            {formStatus === 'submitting' ? 'SENDING...' : 'SUBMIT BRIEF'}
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-canvas/20 text-canvas transition-colors group-hover:bg-canvas group-hover:text-ink">
            <span className="transform -rotate-45 block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">-&gt;</span>
          </div>
        </button>
      </div>
    </form>
  );
}

export default AuditIntakeForm;
