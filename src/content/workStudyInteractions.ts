/** Progressive enhancement only. All case-study text remains available without JavaScript. */
export function installWorkStudyInteractions(root: HTMLElement): () => void {
  root.classList.add('ws-enhanced');
  const onClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLButtonElement>('button[data-observation-button]');
    const inspector = button?.closest<HTMLElement>('[data-inspector]');
    if (!button || !inspector || !root.contains(inspector)) return;
    const selected = Number(button.dataset.observationButton);
    if (!Number.isInteger(selected) || selected < 0 || selected > 2) return;
    inspector.querySelectorAll<HTMLButtonElement>('button[data-observation-button]').forEach(b => {
      b.setAttribute('aria-pressed', String(b === button));
    });
    inspector.querySelectorAll<HTMLElement>('[data-observation]').forEach(p => {
      const active = Number(p.dataset.observation) === selected;
      p.classList.toggle('is-active', active);
      p.hidden = !active;
    });
    if (inspector.dataset.inspector === 'dither') {
      root.querySelectorAll<SVGGElement>('[data-grain-layer]').forEach(layer => {
        layer.style.display = Number(layer.dataset.grainLayer) === selected ? '' : 'none';
      });
    }
  };
  // Hide non-selected observations only after the click handler has been installed.
  root.addEventListener('click', onClick);
  root.querySelectorAll<HTMLElement>('[data-observation]').forEach(p => { p.hidden = !p.classList.contains('is-active'); });
  return () => {
    root.removeEventListener('click', onClick);
    root.classList.remove('ws-enhanced');
    root.querySelectorAll<HTMLElement>('[data-observation]').forEach(p => { p.hidden = false; });
  };
}
