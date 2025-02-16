import { NextResponse } from "next/server"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { getUserAvatar } from "@/db/lib/users"
import { getBlob } from "@/lib/atproto/users"

export const GET = async (
    req: Request,
    { params }: { params: Promise<{ did: string }> }
) => {
    const { did } = await params
    const agent = await getSessionAgent()
    if (!agent) {
        return NextResponse.json({ error: 'Session is required' }, { status: 400 })
    }

    const user = await getUserAvatar(did)

    try {
        const avatarLink = JSON.parse(user[0].avatarLink!)

        const avatar = await getBlob(did, avatarLink.ref.$link)
        if (!avatar) {
            return NextResponse.json({ error: 'Avatar not found' }, { status: 404 })
        }

        const blob = new Blob([avatar.data])
        const headers = new Headers()
        headers.set("Content-Type", "image/*")

        return new NextResponse(blob, { status: 200, statusText: "OK", headers })
    } catch (error) {
        console.error("Error fetching user:", error)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}