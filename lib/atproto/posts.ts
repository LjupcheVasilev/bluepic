import { PostRecord } from "@atproto/api"
import { getSessionAgent } from "../getSessionAgent"
import { Record } from "@/lexicon/types/app/bluepic/feed/post"

export const listAllPosts = async () => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.listRecords({
        repo: agent.assertDid,
        collection: "app.bluepic.feed.post",
        limit: 50,
    })
}

export const addPost = async (rkey: string, record: Record) => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.putRecord({
        repo: agent.assertDid,
        collection: "app.bluepic.feed.post",
        rkey,
        record,
        validate: false,
    })
}

export const deletePost = async (rkey: string) => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.deleteRecord({
        repo: agent.assertDid,
        collection: 'app.bluepic.feed.post',
        rkey
    })
}

export const getUserPosts = async () => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.listRecords({
        repo: agent.assertDid,
        collection: "app.bluepic.feed.post",
        limit: 50,
    })
}