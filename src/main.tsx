import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { ContentProvider } from './content/ContentProvider'
import { applyTheme, getInitialTheme } from './config/theme'

applyTheme(getInitialTheme())
const App = lazy(() => import('./App'))
const Admin = lazy(() => import('./admin/Admin'))
const isAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')
createRoot(document.getElementById('root')!).render(<StrictMode><Suspense fallback={<p role="status">Ачаалж байна…</p>}>
  {isAdmin ? <Admin/> : <ContentProvider><App/></ContentProvider>}
</Suspense></StrictMode>)
