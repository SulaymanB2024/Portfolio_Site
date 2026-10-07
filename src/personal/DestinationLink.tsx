import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { linkArrowPaths, type LinkDirection } from './link-arrow'
import './destination-links.css'

export function LinkArrow({ direction = 'right', className = '' }: { direction?: LinkDirection; className?: string }) {
  return <span className={`link-arrow ${className}`} data-direction={direction} aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" focusable="false"><path d={linkArrowPaths[direction]} /></svg></span>
}

type DestinationProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: ReactNode
  external?: boolean
  direction?: LinkDirection
  emphasis?: 'contact'
}

export function DestinationLink({ href, children, className = '', external = /^https?:\/\//.test(href), direction = external ? 'external' : 'right', emphasis, ...props }: DestinationProps) {
  return <a
    className={`destination-link ${emphasis ? `destination-link--${emphasis}` : ''} ${className}`}
    href={href.startsWith('./') ? `${import.meta.env.BASE_URL}${href.slice(2)}` : href}
    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    {...props}>
    {direction === 'left' && <LinkArrow direction={direction} />}
    <span className="destination-link-label">{children}</span>
    {direction !== 'left' && <LinkArrow direction={direction} />}
  </a>
}

/** A visual cue inside a linked entry, without a second interactive target. */
export function DestinationCue({ children, className = '', decorative = false }: { children: ReactNode; className?: string; decorative?: boolean }) {
  return <span className={`entry-link ${className}`} aria-hidden={decorative || undefined}><span className="destination-link-label">{children}</span><LinkArrow /></span>
}
