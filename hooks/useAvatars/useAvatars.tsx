import { useState, useEffect } from "react"

export function useAvatars() {
  const [avatars, setAvatars] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const fetchAvatar = async (did: string) => {
    // If we're already loading this avatar or have it cached, skip
    if (loading[did] || avatars[did]) return

    setLoading((prev) => ({ ...prev, [did]: true }))

    try {
      const response = await fetch(`/api/users/${did}/avatar`)
      if (!response.ok) throw new Error("Failed to fetch avatar")

      const avatarBlob = await response.blob()
      const avatarUrl = URL.createObjectURL(avatarBlob)

      setAvatars((prev) => ({ ...prev, [did]: avatarUrl }))
    } catch (error) {
      console.error(`Error fetching avatar for ${did}:`, error)
    } finally {
      setLoading((prev) => ({ ...prev, [did]: false }))
    }
  }

  // Cleanup function to revoke object URLs
  useEffect(() => {
    return () => {
      Object.values(avatars).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [avatars])

  return { avatars, fetchAvatar }
}
