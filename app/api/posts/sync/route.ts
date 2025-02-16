import { addPost } from "@/db/lib/posts"
import { isRecord } from "@/lexicon/types/app/bluepic/feed/post"
import { listAllPosts } from "@/lib/atproto/posts"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const agent = await getSessionAgent()
    if (!agent) {
      return NextResponse.json({ error: "Session required" }, { status: 401 })
    }

    const response = await listAllPosts()

    for (const record of response.data.records) {
      if (!isRecord(record.value)) {
        console.error("Bad record", record)
        continue
      }
      // Store the status in the DB
      const now = new Date()
      const obj = {
        uri: record.uri,
        userId: agent.assertDid,
        imageUrl: record.value.imageUrl,
        caption: record.value.caption,
        createdAt: record.value.createdAt,
        indexedAt: now.toISOString(),
      }
      const upsertObj = {
        userId: agent.assertDid,
        imageUrl: record.value.imageUrl,
        caption: record.value.caption,
        createdAt: record.value.createdAt,
        indexedAt: now.toISOString(),
      }

      await addPost(obj, upsertObj)
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error({ err }, "Failed to list records")
    return NextResponse.json(
      { error: "Failed to list records" },
      { status: 500 }
    )
  }
}
