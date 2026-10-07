export default function ArtworkInkDefinitions() {
  return <svg className="artwork-ink-definitions" width="0" height="0" aria-hidden="true" focusable="false"><defs><filter id="artwork-ink" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB"><feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="marks" /><feComponentTransfer in="marks" result="drawn-marks"><feFuncA type="linear" slope="1.7" /></feComponentTransfer><feFlood floodColor="var(--ink)" result="ink" /><feComposite in="ink" in2="drawn-marks" operator="in" /></filter></defs></svg>
}
