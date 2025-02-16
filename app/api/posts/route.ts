import { getAllPostsWithUsers } from "@/db/lib/posts"
import { NextResponse } from "next/server"

export const GET = async () => {
  const allPosts = await getAllPostsWithUsers()
  return NextResponse.json(allPosts)
}
