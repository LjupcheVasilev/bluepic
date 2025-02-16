import { eq } from "drizzle-orm"
import { db } from ".."
import { likes, users } from "../schema"

export const getUser = async (userId: string) => {
    return await db
        .select({
            did: users.did,
            handle: users.handle,
            displayName: users.displayName,
            avatarLink: users.avatarLink,
            description: users.description,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.did, userId))
        .limit(1)
}

export const getUserAvatar = async (userId: string) => {
    return await db
        .select({
            avatarLink: users.avatarLink,
        })
        .from(users)
        .where(eq(users.did, userId))
        .limit(1)
}

export const getUserLikes = async (userId: string) => {
    return await db
        .select({
            uri: likes.uri,
            postId: likes.postId,
        })
        .from(likes)
        .where(eq(likes.userId, userId))
}