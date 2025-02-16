import { eq } from "drizzle-orm"
import { db } from ".."
import { posts, users } from "../schema"
import { UpsertPost, NewPost, PostWithUser, Post, User } from "../types"

export const addPost = async (post: NewPost, upsert?: UpsertPost) => {
    return await db
        .insert(posts)
        .values(post)
        .onConflictDoUpdate({
            target: posts.uri,
            set: upsert ?? post,
            targetWhere: eq(posts.uri, post.uri),
        })
}

export const deletePost = async (uri: string) => {
    return await db.delete(posts)
        .where(eq(posts.uri, uri))
}

export const getUserPosts = async (userId: string) => {
    return await db
        .select()
        .from(posts)
        .where(eq(posts.userId, userId))
}

export const getAllPostsWithUsers = async () => {
    const allPosts = await db
        .select()
        .from(posts)
        .leftJoin(users, eq(users.did, posts.userId))

    return allPosts.reduce(
        (acc: PostWithUser[], post: { posts: Post; users: User | null }) => {
            acc.push({
                ...post.posts,
                user: {
                    did: post.users!.did,
                    handle: post.users!.handle,
                    displayName: post.users!.displayName,
                    avatarLink: post.users!.avatarLink,
                    description: post.users!.description,
                    createdAt: post.users!.createdAt,
                    updatedAt: post.users!.updatedAt,
                    lastLogin: post.users!.lastLogin,
                },
            })

            return acc
        },
        []
    )
}