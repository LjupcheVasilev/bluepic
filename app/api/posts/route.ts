import { db } from "@/db"
import { posts, users } from "@/db/schema"
import { Post, PostWithUser, User } from "@/db/types"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const GET = async () => {
  const allPosts = await db
    .select()
    .from(posts)
    .leftJoin(users, eq(users.did, posts.userId))

  const postsWithUser = allPosts.reduce(
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
  return NextResponse.json(postsWithUser)
}
