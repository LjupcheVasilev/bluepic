import { getUserPosts } from "@/db/lib/posts"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params }: { params: Promise<{ userId: string }> }) => {
    const agent = await getSessionAgent()
    if (!agent) {
        return NextResponse.json({ error: "Session required" }, { status: 401 })
    }

    const { userId } = await params
    const allPosts = await getUserPosts(userId)

    return NextResponse.json(allPosts)
}
