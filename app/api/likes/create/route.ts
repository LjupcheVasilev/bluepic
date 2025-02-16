import { getSessionAgent } from "@/lib/getSessionAgent"
import { NextResponse } from "next/server"
import { TID } from "@atproto/common"
import * as Like from "@/lexicon/types/app/bluepic/feed/like"
import { NewLike } from "@/db/types"
import { addLike } from "@/lib/atproto/likes"
import { addLike as addLikeInDb } from '@/db/lib/likes'

export const POST = async (req: Request) => {
  // If the user is signed in, get an agent which communicates with their server
  const agent = await getSessionAgent()
  if (!agent) {
    return NextResponse.json({ error: "Session required" }, { status: 401 })
  }

  // Construct & validate the like record
  const rkey = TID.nextStr()
  const reqData = await req.json()
  const record = {
    $type: "app.bluepic.feed.like",
    userId: agent.assertDid,
    subject: {
      uri: reqData.postUri,
    },
    createdAt: new Date().toISOString(),
  }
  const { userId, ...rest } = record

  const validation = Like.validateRecord(rest)
  if (!validation.success) {
    console.error(validation.error)
    return NextResponse.json({ message: "Invalid like", error: validation.error }, { status: 400 })
  }

  let uri: string = ""
  try {
    // Write the status record to the user's repository
    const res = await addLike(rkey, record)
    uri = res.data.uri
  } catch (err) {
    console.error({ err }, "failed to write record")
    return NextResponse.json(
      { error: "Failed to write record" },
      { status: 500 }
    )
  }

  const like: NewLike = {
    uri,
    userId: agent.assertDid,
    postId: record.subject.uri,
    createdAt: record.createdAt,
    indexedAt: new Date().toISOString(),
  }

  try {
    // Optimistically update our DB
    await addLikeInDb(like)
  } catch (err) {
    console.error(
      { err },
      "failed to update computed view; ignoring as it should be caught by the firehose"
    )
  }

  return NextResponse.json(like)
}
