import { createClient } from "@/app/api/auth/client"
import { db } from "@/db"
import { OAuthClient } from "@atproto/oauth-client-node"

let clientInstance: OAuthClient | null = null

export const getClient = async (): Promise<OAuthClient> => {
   if (!clientInstance) {
      clientInstance = await createClient(db)
   }
   return clientInstance
}