"use client"

import { Grid, Bookmark } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useUserSession } from "@/context/UserContext"

export default function Profile() {
  const { session, user } = useUserSession()
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userAvatar, setUserAvatar] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<{ description?: string }>({})

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!session.did || session.did === "") {
        return
      }
      try {
        // Fetch user's posts
        const response = await fetch(`/api/posts/user/${session.did}`)
        if (!response.ok) throw new Error("Failed to fetch posts")
        const posts = await response.json()
        setUserPosts(posts)
      } catch (error) {
        console.error("Error fetching user posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPosts()
  }, [session])

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (!session.did || session.did === "") {
        return
      }
      try {
        // Fetch user's avatar
        const response = await fetch(`/api/users/${session.did}/avatar`)
        if (!response.ok) throw new Error("Failed to fetch avatar")
        const avatarBlob = await response.blob()
        const img = URL.createObjectURL(avatarBlob)
        setUserAvatar(img)
      } catch (error) {
        console.error("Error fetching user posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAvatar()
  }, [session])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session.did || session.did === "") {
        return
      }
      try {
        const response = await fetch(`/api/users/${session.did}/profile`)
        if (!response.ok) throw new Error("Failed to fetch profile")
        const profileData = await response.json()
        setProfile(profileData)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [session])

  if (!user || !session || isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex gap-8">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={userAvatar || undefined}
              alt={user.name || user.handle}
            />
            <AvatarFallback>{(user.name || user.handle)[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="mb-4 flex items-center gap-4">
              <h1 className="text-2xl font-bold">{user.handle}</h1>
            </div>
            <div className="mb-4 flex gap-6">
              <p>
                <span className="font-bold">{userPosts.length}</span> posts
              </p>
            </div>
            <div className="whitespace-pre-line space-y-2">
              <p className="font-bold">{user.name}</p>
              {profile.description && (
                <p className="text-sm text-muted-foreground max-w-[400px]">
                  {profile.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">
            <Grid className="mr-2 h-4 w-4" />
            Posts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <Card
                key={post.uri}
                className="aspect-square cursor-pointer overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  className="h-full w-full object-cover"
                />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
