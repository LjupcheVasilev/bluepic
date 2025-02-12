import { NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getSessionAgent } from "@/lib/getSessionAgent"

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ did: string }> }
) => {
    const { did } = await params
    const agent = await getSessionAgent()

    if (!agent) {
        return NextResponse.json({ error: 'Session is required' }, { status: 400 })
    }

    const user = await db
        .select({
            avatarLink: users.avatarLink,
        })
        .from(users)
        .where(eq(users.did, did))
        .limit(1)


    try {

        const avatarLink = JSON.parse(user[0].avatarLink!)

        const avatar = await agent?.com.atproto.sync.getBlob({
            did: did,
            cid: avatarLink.ref.$link
        })

        if (!avatar) {
            return NextResponse.json({ error: 'Avatar not found' }, { status: 404 })
        }

        const blob = new Blob([avatar.data])

        const headers = new Headers()

        headers.set("Content-Type", "image/*")

        // or just use new Response ❗️
        return new NextResponse(blob, { status: 200, statusText: "OK", headers })
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}