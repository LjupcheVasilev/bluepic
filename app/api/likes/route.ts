import { NextResponse } from "next/server"
import { likes } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { db } from "@/db"
import { getUserLikes } from "@/db/lib/users"

export async function GET() {
    try {
        const agent = await getSessionAgent()
        if (!agent) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const userLikes = await getUserLikes(agent.assertDid)

        return NextResponse.json(userLikes)
    } catch (error) {
        console.error("Error fetching likes:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
