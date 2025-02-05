"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useGetPosts } from "@/hooks/useGetPosts/useGetPosts";
import Image from "next/image";

const PostFeed = () => {
  const { isLoading, posts, error } = useGetPosts();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default PostFeed;
