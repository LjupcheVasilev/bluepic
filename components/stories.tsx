"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DUMMY_STORIES = [
  {
    id: 1,
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    username: "janesmith",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    username: "mike",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    username: "sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    username: "alex",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  },
];

const Stories = () => {
  return (
    <ScrollArea className="w-full rounded-lg border bg-card">
      <div className="flex gap-4 p-4">
        {DUMMY_STORIES.map((story) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-1"
          >
            <div className="rounded-full ring-2 ring-primary ring-offset-2">
              <Avatar className="h-14 w-14">
                <AvatarImage src={story.avatar} alt={story.username} />
                <AvatarFallback>{story.username[0]}</AvatarFallback>
              </Avatar>
            </div>
            <p className="text-xs">{story.username}</p>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Stories;