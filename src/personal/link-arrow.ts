export type LinkDirection = 'right' | 'left' | 'up' | 'down' | 'external'

export const linkArrowPaths: Record<LinkDirection, string> = {
  right: 'M4 12h15m-6-6 6 6-6 6',
  left: 'M20 12H5m6-6-6 6 6 6',
  up: 'M12 20V5m-6 6 6-6 6 6',
  down: 'M12 4v15m-6-6 6 6 6-6',
  external: 'M6 18 18 6M6 6h12v12',
}

/** Landing copy is updated outside React; keep its arrows identical to page links. */
export function createLinkArrow(direction: LinkDirection = 'right') {
  const arrow = document.createElement('span')
  arrow.className = 'link-arrow'
  arrow.dataset.direction = direction
  arrow.setAttribute('aria-hidden', 'true')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '18')
  svg.setAttribute('height', '18')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.25')
  svg.setAttribute('focusable', 'false')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', linkArrowPaths[direction])
  svg.append(path)
  arrow.append(svg)
  return arrow
}

export function setDestinationLabel(link: HTMLAnchorElement, text: string) {
  const label = document.createElement('span')
  label.className = 'destination-link-label'
  label.textContent = text
  link.replaceChildren(label, createLinkArrow())
}
