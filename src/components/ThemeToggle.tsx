import { useEffect, useState } from 'react'
import { applyTheme, getInitialTheme, getSavedTheme, saveTheme } from '../config/theme'
import type { Translation } from '../i18n/types'
import { Icon } from './Icon'

export function ThemeToggle({ t }: { t: Translation }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => { applyTheme(theme) }, [theme])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = () => setTheme(getInitialTheme())
    const onSystemChange = () => { if (!getSavedTheme()) syncTheme() }
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'preferred-theme' || event.key === null) syncTheme()
    }
    preference.addEventListener('change', onSystemChange)
    window.addEventListener('storage', onStorage)
    return () => {
      preference.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const label = theme === 'dark' ? t.common.lightMode : t.common.darkMode
  return <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    saveTheme(next)
    setTheme(next)
  }}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={21}/></button>
}
