import { NodeOAuthClient } from '@atproto/oauth-client-node'
import { SessionStore, StateStore } from './storage'
import type { Database } from '@/db/index'

export const createClient = async (db: Database) => {
  const publicUrl = process.env.PUBLIC_URL
  const url = publicUrl || `http://127.0.0.1:${process.env.PORT}`
  const enc = encodeURIComponent
  return new NodeOAuthClient({
    clientMetadata: {
      client_name: 'BluePic',
      client_id: publicUrl
        ? `https://${url}?redirect_uri=${enc(`${url}/api/auth/callback`)}&scope=${enc('atproto transition:generic')}`
        : `http://localhost?redirect_uri=${enc(`${url}/api/auth/callback`)}&scope=${enc('atproto transition:generic')}`,
      client_uri: url,
      redirect_uris: [`https://${url}/api/auth/callback`],
      scope: 'atproto transition:generic',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      application_type: 'web',
      token_endpoint_auth_method: 'none',
      dpop_bound_access_tokens: true,
    },
    stateStore: new StateStore(db),
    sessionStore: new SessionStore(db),
  })
}
