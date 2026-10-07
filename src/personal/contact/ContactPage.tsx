import { useEffect, useRef, useState } from 'react'
import { contact } from '../content'
import ContactSculpture from './ContactSculpture'
import { siteCopy } from '../site-copy'
import { DestinationLink } from '../DestinationLink'
import './contact.css'

export default function ContactPage({ dark }: { dark: boolean }) {
  const [copyStatus, setCopyStatus] = useState('')
  const copying = useRef(false)
  const mounted = useRef(true)
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (statusTimer.current) clearTimeout(statusTimer.current) } }, [])

  async function copyAddress() {
    if (copying.current) return
    copying.current = true
    if (statusTimer.current) clearTimeout(statusTimer.current)
    setCopyStatus('')
    try {
      await navigator.clipboard.writeText(contact.email)
      if (mounted.current) {
        setCopyStatus('Copied')
        statusTimer.current = setTimeout(() => setCopyStatus(''), 2500)
      }
    } catch {
      if (mounted.current) setCopyStatus('Select the address to copy it.')
    } finally { copying.current = false }
  }

  return <section className="lion-contact" aria-labelledby="lion-contact-title">
    <header className="lion-contact-heading"><div><h1 id="lion-contact-title">Contact</h1></div><span className="mono">Austin, Texas</span></header>
    <p className="lion-contact-introduction">{siteCopy.contact.description}</p>
    <ContactSculpture dark={dark}>
    <div className="lion-contact-rail" aria-label="Contact links">
    <div className="lion-contact-note lion-contact-email">
      <DestinationLink href={`mailto:${contact.email}`} direction="external" emphasis="contact">{contact.email}</DestinationLink>
      <div className="lion-contact-copy mono"><button type="button" onClick={copyAddress} data-copied={copyStatus === 'Copied'}>{copyStatus === 'Copied' ? 'Copied' : 'Copy address'}</button><span className={copyStatus === 'Copied' ? 'sr-only' : undefined} role="status">{copyStatus === 'Copied' ? 'Address copied.' : copyStatus}</span></div>
    </div>
    <div className="lion-contact-note lion-contact-linkedin"><DestinationLink href={contact.linkedin}>LinkedIn</DestinationLink></div>
    </div>
    </ContactSculpture>
  </section>
}
