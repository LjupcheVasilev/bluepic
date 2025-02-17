import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@atproto/oauth-client-node'
import { authState, authSession } from '@/db/schema'
import { Database } from '@/db/index'
import { eq } from 'drizzle-orm'

export class StateStore implements NodeSavedStateStore {
  constructor(private db: Database,) { this.db = db }
  async get(key: string): Promise<NodeSavedState | undefined> {
    const result = (await this.db.select().from(authState).where(eq(authState.key, key)))[0]
    if (!result) return
    return JSON.parse(result.state) as NodeSavedState
  }
  async set(key: string, val: NodeSavedState) {
    const state = JSON.stringify(val)
    await this.db
      .insert(authState)
      .values({ key, state })
  }
  async del(key: string) {
    await this.db.delete(authState).where(eq(authState.key, key))
  }
}

export class SessionStore implements NodeSavedSessionStore {
  constructor(private db: Database) { this.db = db }
  async get(key: string): Promise<NodeSavedSession | undefined> {
    const result = (await this.db.select().from(authSession).where(eq(authSession.key, key)))[0]
    if (!result) return
    return JSON.parse(result.session) as NodeSavedSession
  }
  async set(key: string, val: NodeSavedSession) {
    const session = JSON.stringify(val)
    await this.db
      .insert(authSession)
      .values({ key, session })
      .onConflictDoUpdate({
        target: authSession.key,
        set: { session },
        targetWhere: eq(authSession.key, key),
      })
  }
  async del(key: string) {
    await this.db.delete(authSession).where(eq(authSession.key, key))
  }
}
