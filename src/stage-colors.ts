/** Choose stage text independently of the chrome theme and custom canvas color. */
export function stageColors(background: string) {
  const channels = background
    .slice(1)
    .match(/../g)!
    .map((hex) => {
      const value = parseInt(hex, 16) / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  const light = luminance > 0.179
  return {
    '--scene': background,
    '--scene-ink': light ? '#000000' : '#ffffff',
    '--muted': light ? '#000000' : '#ffffff',
    '--line': light ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.3)',
    '--hover': light ? 'rgba(0,0,0,.09)' : 'rgba(255,255,255,.12)',
    '--selected': light ? 'rgba(0,0,0,.13)' : 'rgba(255,255,255,.16)'
  }
}
