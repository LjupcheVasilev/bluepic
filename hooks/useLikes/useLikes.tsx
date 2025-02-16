import { useState, useEffect } from "react"
import { Like } from "@/db/types"

interface UserLike {
  uri: string
  postId: string
}

export function useLikes() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch("/api/likes")
        if (!response.ok) {
          throw new Error("Failed to fetch likes")
        }
        const likes = (await response.json()) as UserLike[]

        // Create a mapping of postId -> likeUri
        const likeMapping = likes.reduce(
          (acc, like) => ({
            ...acc,
            [like.postId]: like.uri,
          }),
          {} as Record<string, string>
        )

        setLikedPosts(likeMapping)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch likes")
      }
    }

    fetchLikes()
  }, [])

  const addLike = async (postUri: string): Promise<Like | undefined> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/likes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postUri }),
      })

      if (!response.ok) {
        throw new Error("Failed to add like")
      }

      const data = (await response.json()) as Like
      // Update likedPosts state with the new like
      setLikedPosts((prev) => ({
        ...prev,
        [postUri]: data.uri,
      }))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add like")
      return undefined
    } finally {
      setIsLoading(false)
    }
  }

  const removeLike = async (likeUri: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/likes/${encodeURIComponent(likeUri)}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to remove like")
      }

      // Remove the like from likedPosts state
      setLikedPosts((prev) => {
        const updated = { ...prev }
        // Find and remove the entry with this likeUri
        const postId = Object.entries(updated).find(
          ([_, uri]) => uri.split("/").pop() === likeUri
        )?.[0]
        if (postId) {
          delete updated[postId]
        }
        return updated
      })

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove like")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    addLike,
    removeLike,
    isLoading,
    error,
    likedPosts,
  }
}
