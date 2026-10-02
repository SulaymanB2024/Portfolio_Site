import { useEffect, useRef, useState } from 'react'
import { contact } from '../content'
import ContactSculpture from './ContactSculpture'
import './contact.css'

export default function ContactPage({ dark }: { dark: boolean }) {
  const [copyStatus, setCopyStatus] = useState('')
  const copying = useRef(false)
  const mounted = useRef(true)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])

  async function copyAddress() {
    if (copying.current) return
    copying.current = true
    try {
      await navigator.clipboard.writeText(contact.email)
      if (mounted.current) setCopyStatus('Copied')
    } catch {
      if (mounted.current) setCopyStatus('Select the address to copy it.')
    } finally { copying.current = false }
  }

  return <section className="lion-contact" aria-labelledby="lion-contact-title">
    <header className="lion-contact-heading"><div><span className="mono">05 /</span><h1 id="lion-contact-title">Contact</h1></div><span className="mono">Austin, Texas</span></header>
    <ContactSculpture dark={dark} />
    <div className="lion-contact-note lion-contact-email">
      <span className="mono">A note, a question, an idea.</span>
      <a href={`mailto:${contact.email}`}>{contact.email} <span aria-hidden="true">↗</span></a>
      <div className="lion-contact-copy mono"><button type="button" onClick={copyAddress}>Copy address</button><span role="status">{copyStatus}</span></div>
    </div>
    <div className="lion-contact-note lion-contact-linkedin"><span className="mono">Or, find me here.</span><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a></div>
  </section>
}
