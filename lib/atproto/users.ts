import { getSessionAgent } from "../getSessionAgent"

export const getBlob = async (did: string, cid: string) => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }
    return await agent?.com.atproto.sync.getBlob({
        did,
        cid
    })
}