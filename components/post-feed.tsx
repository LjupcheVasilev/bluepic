"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import PostComments from "@/components/post-comments";

const DUMMY_POSTS = [
  {
    id: 1,
    user: {
      name: "John Doe",
      username: "johndoe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    },
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
    likes: 123,
    caption: "Beautiful sunset at the beach! 🌅",
    comments: [
      {
        id: 1,
        user: {
          name: "Jane Smith",
          username: "janesmith",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        },
        content: "Amazing shot! 😍",
        timestamp: "2h",
      },
    ],
    timestamp: "2h",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      username: "janesmith",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
    image: "https://images.unsplash.com/photo-1682687221038-404670f09ef1?w=800&h=800&fit=crop",
    likes: 456,
    caption: "Coffee and code ☕️💻",
    comments: [],
    timestamp: "4h",
  },
];

const PostFeed = () => {
  const [selectedPost, setSelectedPost] = useState<typeof DUMMY_POSTS[0] | null>(null);

  return (
    <>
      <div className="space-y-8">
        {DUMMY_POSTS.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.user.username}</p>
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative aspect-square">
              <img
                src={post.image}
                alt="Post"
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedPost(post)}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
              
              <p className="mt-2 font-semibold">{post.likes.toLocaleString()} likes</p>
              <p className="mt-1">
                <span className="font-semibold">{post.user.username}</span>{" "}
                {post.caption}
              </p>
              <button
                className="mt-1 text-sm text-muted-foreground"
                onClick={() => setSelectedPost(post)}
              >
                View all {post.comments.length} comments
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="flex h-[80vh] max-w-4xl gap-0 p-0">
          <div className="relative w-[60%] min-h-[500px] flex items-center justify-center">
            <img
              src={selectedPost?.image}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex w-[40%] flex-col">
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedPost?.user.avatar} alt={selectedPost?.user.name} />
                  <AvatarFallback>{selectedPost?.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedPost?.user.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedPost?.timestamp}</p>
                </div>
              </div>
            </div>
            {selectedPost && (
              <PostComments
                postId={selectedPost.id}
                comments={selectedPost.comments}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostFeed;