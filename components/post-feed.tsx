"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useGetPosts } from "@/hooks/useGetPosts/useGetPosts"
import Image from "next/image"
import { useLikes } from "@/hooks/useLikes/useLikes"
import { useAvatars } from "@/hooks/useAvatars/useAvatars"
import { cn } from "@/lib/utils"
import useSession from "@/hooks/useSession"

const PostFeed = () => {
  const { isLoading, posts, error } = useGetPosts()
  const { avatars, fetchAvatar } = useAvatars()
  const {
    isLoading: isLoadingLike,
    error: likeError,
    addLike,
    removeLike,
    likedPosts,
  } = useLikes()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { session, isLoading: sessionLoading } = useSession()

  useEffect(() => {
    if (!sessionLoading && session?.did) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [session, sessionLoading])

  // Fetch avatars for all posts
  useEffect(() => {
    if (!isLoading && posts) {
      posts.forEach((post) => {
        if (post.user.did) {
          fetchAvatar(post.user.did)
        }
      })
    }
  }, [posts, isLoading, fetchAvatar])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const handleLikeClick = async (postUri: string) => {
    if (isLoadingLike) return

    if (likedPosts[postUri]) {
      // Post is already liked, remove the like
      const likeRkey = likedPosts[postUri].split("/").pop()
      if (!likeRkey) return // Guard against malformed URIs

      await removeLike(likeRkey)
    } else {
      // Post is not liked, add a like
      await addLike(postUri)
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
                    src={avatars[post.user.did] || undefined}
                    alt={post.user.displayName || post.user.handle}
                  />
                  <AvatarFallback>
                    {(post.user.displayName || post.user.handle)[0]}
                  </AvatarFallback>
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
                  {isLoggedIn && (
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
                  )}
                </div>
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
