import { DEFAULT_CONTENT } from '../src/data/editableContent'
import { HttpError } from './errors'

export type StorageEnv = { CONTENT_DB?: D1Database }
const initialized = new WeakMap<D1Database, Promise<void>>()
export async function database(env: StorageEnv): Promise<D1Database> {
  if (!env.CONTENT_DB) throw new HttpError(503, 'Website content storage is not configured yet.')
  const db = env.CONTENT_DB
  let ready = initialized.get(db)
  if (!ready) {
    ready = (async () => {
      await db.prepare(`CREATE TABLE IF NOT EXISTS site_content (
        id INTEGER PRIMARY KEY CHECK (id = 1), content TEXT NOT NULL,
        revision INTEGER NOT NULL DEFAULT 0, updated_at TEXT, updated_by TEXT
      )`).run()
      await db.prepare('INSERT OR IGNORE INTO site_content (id, content, revision) VALUES (1, ?, 0)').bind(JSON.stringify(DEFAULT_CONTENT)).run()
      await db.prepare(`CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash TEXT PRIMARY KEY, password_tag TEXT NOT NULL, expires_at INTEGER NOT NULL
      )`).run()
      await db.prepare(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
        key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, reset_at INTEGER NOT NULL
      )`).run()
    })()
    initialized.set(db, ready)
  }
  try { await ready } catch (error) { initialized.delete(db); throw error }
  return db
}
