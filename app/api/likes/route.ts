import { NextResponse } from "next/server"
import { likes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { db } from "@/db"

export async function GET() {
    try {
        const agent = await getSessionAgent()
        if (!agent) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userLikes = await db
            .select({
                uri: likes.uri,
                postId: likes.postId,
            })
            .from(likes)
            .where(eq(likes.userId, agent.assertDid))

        return NextResponse.json(userLikes)
    } catch (error) {
        console.error("Error fetching likes:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
