"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { UploadButton } from "@/lib/uploadthing"
import useSession from "@/hooks/useSession"

export default function CreatePost() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { session } = useSession()

  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!session?.did) return
    setUserId(session?.did)
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedImageUrl) {
      toast({
        title: "Error",
        description: "Please upload an image first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      if (!userId) {
        throw new Error("User not authenticated")
      }

      const imageObject = {
        imageUrl: uploadedImageUrl,
        caption: caption,
        userId: userId,
      }

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(imageObject),
      })

      if (!res.ok) {
        console.error("Failed to create post:", await res.json())
        toast({
          title: "Error Creating Post",
          description: `Something went wrong. Please try again.`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Post Created",
          description: `Your post has been successfully shared!\n ${JSON.stringify(
            imageObject
          )}`,
        })

        // Reset form
        setUploadedImageUrl(null)
        setCaption("")
      }
    } catch (error) {
      console.error("Post creation error:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Create New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center">
            {uploadedImageUrl ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                      setUploadedImageUrl(res[0].url)
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: "Upload Error",
                      description: error.message,
                      variant: "destructive",
                    })
                  }}
                />
              </div>
            )}
          </div>

          <Textarea
            placeholder="Write a caption..."
            className="min-h-[100px]"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={!uploadedImageUrl || isSubmitting}
          >
            {isSubmitting ? "Sharing..." : "Share Post"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
