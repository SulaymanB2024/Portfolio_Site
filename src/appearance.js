// Run before React mounts so a stored palette never flashes the wrong background.
try {
  const dark = localStorage.getItem('sulayman-appearance') === 'dark'
  document.documentElement.dataset.appearance = dark ? 'dark' : 'light'
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]').content = dark ? '#111210' : '#f5f2ea'
} catch { /* The light palette remains available when storage is disabled. */ }
