import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { parseSnapshot, type EditableContent } from '../data/editableContent'

type ContentState = { content: EditableContent | null; loading: boolean; error: boolean; reload: () => void }
const ContentContext = createContext<ContentState>({ content: null, loading: true, error: false, reload: () => {} })
export const useSiteContent = () => useContext(ContentContext)
export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<EditableContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [version, setVersion] = useState(0)
  const reload = useCallback(() => setVersion(value => value + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    setLoading(true)
    fetch('/api/content', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Content unavailable')
        const snapshot = parseSnapshot(await response.json())
        if (active) { setContent(snapshot.content); setError(false) }
      })
      .catch(() => { if (active) { setContent(null); setError(true) } })
      .finally(() => { clearTimeout(timeout); if (active) setLoading(false) })
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [version])
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') reload() }
    window.addEventListener('focus', refresh)
    const timer = window.setInterval(refresh, 60000)
    return () => { window.removeEventListener('focus', refresh); clearInterval(timer) }
  }, [reload])
  return <ContentContext.Provider value={{ content, loading, error, reload }}>{children}</ContentContext.Provider>
}
