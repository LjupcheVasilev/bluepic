import { eq } from "drizzle-orm"
import { db } from ".."
import { likes } from "../schema"
import { LikeUpsert, NewLike } from "../types"

export const addLike = async (like: NewLike, upsert?: LikeUpsert) => {
    return await db.insert(likes).values(like).onConflictDoUpdate({
        target: likes.uri,
        set: upsert ?? like,
        targetWhere: eq(likes.uri, likes.uri),
    })
}

export const deleteLike = async (uri: string) => {
    db.delete(likes)
        .where(eq(likes.uri, uri))
}