import { db } from "@/db"
import { addPost } from "@/db/lib/posts"
import { posts } from "@/db/schema"
import { isRecord } from "@/lexicon/types/app/bluepic/feed/post"
import { getUserPosts } from "@/lib/atproto/posts"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const agent = await getSessionAgent()
    if (!agent) {
      return NextResponse.json({ error: "Session required" }, { status: 401 })
    }

    const response = await getUserPosts()

    for (const record of response.data.records) {
      if (!isRecord(record.value)) {
        console.error("Bad record", record)
        continue
      }
      const now = new Date()
      // Store the status in our DB

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
