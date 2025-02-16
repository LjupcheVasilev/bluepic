import { addLike } from "@/db/lib/likes"
import { NewLike } from "@/db/types"
import { isRecord } from "@/lexicon/types/app/bluepic/feed/like"
import { getAllLikes } from "@/lib/atproto/likes"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const agent = await getSessionAgent()
    if (!agent) {
      return NextResponse.json({ error: "Session required" }, { status: 401 })
    }

    const response = await getAllLikes()

    for (const record of response.data.records) {
      if (!isRecord(record.value)) {
        console.error("Bad record", record)
        continue
      }
      const now = new Date()
      // Store the status in our DB

      const obj: NewLike = {
        uri: record.uri,
        userId: agent.assertDid,
        postId: record.value.subject.uri,
        createdAt: record.value.createdAt,
        indexedAt: now.toISOString(),
      }

      const upsertObj = {
        userId: agent.assertDid,
        postId: record.value.subject.uri,
        createdAt: record.value.createdAt,
        indexedAt: now.toISOString(),
      }

      await addLike(obj, upsertObj)
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
