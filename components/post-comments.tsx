"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Comment {
  id: number;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

interface PostCommentsProps {
  postId: number;
  comments: Comment[];
}

export default function PostComments({ postId, comments: initialComments }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      user: {
        name: "John Doe",
        username: "johndoe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      },
      content: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p>
                  <span className="font-semibold">{comment.user.username}</span>{" "}
                  {comment.content}
                </p>
                <p className="text-sm text-muted-foreground">
                  {comment.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}