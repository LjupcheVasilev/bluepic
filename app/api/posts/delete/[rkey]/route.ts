import { NextResponse } from "next/server"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { db } from "@/db"
import { posts } from "@/db/schema"
import { eq } from "drizzle-orm"

export const DELETE = async (req: Request, { params }: { params: Promise<{ rkey: string }> }) => {
  // Get the authenticated session agent
  const agent = await getSessionAgent()

  // If no session, return unauthorized
  if (!agent) {
    return NextResponse.json({ error: "Session required" }, { status: 401 })
  }

  // Parse the request body to get the post URI
  const { rkey } = await params

  // Validate that the post belongs to the current user
  try {
    // First, delete the record from AtProto
    await agent.com.atproto.repo.deleteRecord({
      repo: agent.assertDid,
      collection: 'app.bluepic.feed.post',
      rkey
    })

    const uri = `at://${agent.assertDid}/app.bluepic.feed.post/${rkey}`

    // Then delete from local database
    await db.delete(posts)
      .where(eq(posts.uri, uri))

    // Redirect to home page after successful deletion
    return NextResponse.json({ message: `Post ${uri} deleted successfully` }, { status: 200 })

  } catch (error) {
    console.error('Post deletion error:', error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}