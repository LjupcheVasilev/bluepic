import { getSessionAgent } from "@/lib/getSessionAgent"
import { NextResponse } from "next/server"
import { TID } from "@atproto/common"
import * as Post from "@/lexicon/types/app/bluepic/feed/post"
import { addPost as addPostInDb } from "@/db/lib/posts"
import { posts } from "@/db/schema"
import { getUrl } from "@/lib/getUrl"
import { addPost } from "@/lib/atproto/posts"

export const POST = async (req: Request) => {
  // If the user is signed in, get an agent which communicates with their server
  const agent = await getSessionAgent()
  if (!agent) {
    return NextResponse.json({ error: "Session required" }, { status: 401 })
  }

  // Construct & validate their status record
  const rkey = TID.nextStr()
  const reqData = await req.json()
  const record = {
    $type: "app.bluepic.feed.post",
    imageUrl: reqData.imageUrl,
    caption: reqData.caption,
    createdAt: new Date().toISOString(),
  }

  const validation = Post.validateRecord(record)
  if (!validation.success) {
    console.error(validation.error)
    return NextResponse.json({ message: "Invalid post", error: validation.error }, { status: 400 })
  }

  let uri: string = ""
  try {
    // Write the status record to the user's repository
    const res = await addPost(rkey, record)
    uri = res.data.uri
  } catch (err) {
    console.error({ err }, "failed to write record")
    return NextResponse.json(
      { error: "Failed to write record" },
      { status: 500 }
    )
  }

  try {
    // Optimistically update our DB
    const post: typeof posts.$inferInsert = {
      uri,
      userId: agent.assertDid,
      imageUrl: record.imageUrl,
      caption: record.caption,
      createdAt: record.createdAt,
      indexedAt: new Date().toISOString(),
    }

    await addPostInDb(post)
  } catch (err) {
    console.error(
      { err },
      "failed to update computed view; ignoring as it should be caught by the firehose"
    )
  }

  return NextResponse.redirect(new URL('/', getUrl()))
}
