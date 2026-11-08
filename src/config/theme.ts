export type Theme = 'light' | 'dark'

export function getSavedTheme(): Theme | null {
  try {
    const saved = window.localStorage.getItem('preferred-theme')
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

export function getInitialTheme(): Theme {
  return getSavedTheme() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1c1b18' : '#fcfbf8')
}

export function saveTheme(theme: Theme) {
  try {
    window.localStorage.setItem('preferred-theme', theme)
  } catch {
    // Keep the switch usable when browser storage is unavailable.
  }
}
