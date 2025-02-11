import { useState } from "react"
import { Like } from "@/db/types"

interface AddLikeResponse {
  like: Like
}

export function useLikes() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        `/api/likes/delete/${encodeURIComponent(likeUri)}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        throw new Error("Failed to remove like")
      }

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
  }
}
