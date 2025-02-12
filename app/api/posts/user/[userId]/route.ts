import { db } from "@/db"
import { posts, users } from "@/db/schema"
import { Post, PostWithUser, User } from "@/db/types"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params }: { params: Promise<{ userId: string }> }) => {
    const agent = await getSessionAgent()
    if (!agent) {
        return NextResponse.json({ error: "Session required" }, { status: 401 })
    }

    const { userId } = await params
    const allPosts = await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))


    return NextResponse.json(allPosts)
}
