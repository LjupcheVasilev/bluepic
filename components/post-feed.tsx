"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react"
import { useGetPosts } from "@/hooks/useGetPosts/useGetPosts"
import Image from "next/image"
import { useLikes } from "@/hooks/useLikes/useLikes"
import { cn } from "@/lib/utils"

const PostFeed = () => {
  const { isLoading, posts, error } = useGetPosts()
  const {
    isLoading: isLoadingLike,
    error: likeError,
    addLike,
    removeLike,
  } = useLikes()
  const [likedPosts, setLikedPosts] = useState<Record<string, string>>({}) // postUri -> likeUri mapping

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const handleLikeClick = async (postUri: string) => {
    if (isLoadingLike) return

    if (likedPosts[postUri]) {
      // Post is already liked, remove the like
      const likeRkey = likedPosts[postUri].split("/").pop() // This will get '3lhwmin4zr22j'
      if (!likeRkey) return // Guard against malformed URIs

      const success = await removeLike(likeRkey)
      if (success) {
        setLikedPosts((prev) => {
          const updated = { ...prev }
          delete updated[postUri]
          return updated
        })
      }
    } else {
      // Post is not liked, add a like
      const like = await addLike(postUri)

      if (like) {
        setLikedPosts((prev) => ({
          ...prev,
          [postUri]: like.uri,
        }))
      }
    }
  }

  return (
    <>
      <div className="space-y-8">
        {posts.map((post) => (
          <Card key={post.uri} className="overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={post.user.avatarLink!}
                    alt={post.user.displayName!}
                  />
                  <AvatarFallback>{post.user.displayName![0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.user.handle}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square">
              <Image
                src={post.imageUrl}
                alt="Post"
                className="h-full w-full object-cover"
                width={500}
                height={500}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLikeClick(post.uri)}
                    disabled={isLoadingLike}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        likedPosts[post.uri] && "fill-red-500 text-red-500"
                      )}
                    />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-2 font-semibold">
                {/* {post.likes.toLocaleString()} likes */}
              </p>
              <p className="mt-1">
                <span className="font-semibold">{post.user.displayName}</span>{" "}
                {post.caption}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}

export default PostFeed
