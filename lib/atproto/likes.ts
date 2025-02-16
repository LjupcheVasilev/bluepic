import { NextResponse } from "next/server"
import { getSessionAgent } from "../getSessionAgent"
import { Record } from "@/lexicon/types/app/bluepic/feed/like"

export const addLike = async (rkey: string, record: Record) => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.putRecord({
        repo: agent.assertDid,
        collection: "app.bluepic.feed.like",
        rkey,
        record,
        validate: false,
    })
}

export const deleteLike = async (rkey: string) => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.deleteRecord({
        repo: agent.assertDid,
        collection: 'app.bluepic.feed.like',
        rkey
    })
}

export const getAllLikes = async () => {
    const agent = await getSessionAgent()
    if (!agent) {
        throw new Error("Session required")
    }

    return await agent.com.atproto.repo.listRecords({
        repo: agent.assertDid,
        collection: "app.bluepic.feed.like",
        limit: 50,
    })
}