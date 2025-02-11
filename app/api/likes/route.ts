import { db } from "@/db"
import { likes, posts, users } from "@/db/schema"
import { Like, LikeWithUserAndPost, Post, PostWithUser, User } from "@/db/types"
import { getSessionAgent } from "@/lib/getSessionAgent"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
    // If the user is signed in, get an agent which communicates with their server
    const agent = await getSessionAgent()
    if (!agent) {
        return NextResponse.json({ error: "Session required" }, { status: 401 })
    }
    const userId = agent.assertDid

    if (!userId) {
        return NextResponse.json({
            error: 'User ID is required'
        }, { status: 400 })
    }

    const userLikes = await db
        .select()
        .from(likes)
        .where(eq(likes.userId, userId))
        .leftJoin(users, eq(users.did, likes.userId))
        .leftJoin(posts, eq(posts.uri, likes.postId))

    const likesWithUserAndPost = userLikes.reduce(
        (acc: LikeWithUserAndPost[], like: { likes: Like, posts: Post | null; users: User | null }) => {
            acc.push({
                ...like.likes,
                post: {
                    userId: like.posts!.userId,
                    uri: like.posts!.uri,
                    createdAt: like.posts!.createdAt,
                    imageUrl: like.posts!.imageUrl,
                    caption: like.posts!.caption,
                    indexedAt: like.posts!.indexedAt,
                },
                user: {
                    did: like.users!.did,
                    handle: like.users!.handle,
                    displayName: like.users!.displayName,
                    avatarLink: like.users!.avatarLink,
                    description: like.users!.description,
                    createdAt: like.users!.createdAt,
                    updatedAt: like.users!.updatedAt,
                    lastLogin: like.users!.lastLogin,
                },
            })

            return acc
        },
        []
    )
    return NextResponse.json(likesWithUserAndPost)
}
