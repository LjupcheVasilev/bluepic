"use client";

import { Settings, Grid, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const DUMMY_USER = {
  name: "John Doe",
  username: "johndoe",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  posts: 123,
  followers: 1234,
  following: 567,
  bio: "📸 Photography enthusiast\n🌍 Travel lover\n💻 Developer",
};

export default function Profile() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex gap-8">
          <Avatar className="h-32 w-32">
            <AvatarImage src={DUMMY_USER.avatar} alt={DUMMY_USER.name} />
            <AvatarFallback>{DUMMY_USER.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="mb-4 flex items-center gap-4">
              <h1 className="text-2xl font-bold">{DUMMY_USER.username}</h1>
              <Button>Edit Profile</Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-4 flex gap-6">
              <p>
                <span className="font-bold">{DUMMY_USER.posts}</span> posts
              </p>
              <p>
                <span className="font-bold">{DUMMY_USER.followers}</span> followers
              </p>
              <p>
                <span className="font-bold">{DUMMY_USER.following}</span> following
              </p>
            </div>
            <div className="whitespace-pre-line">
              <p className="font-bold">{DUMMY_USER.name}</p>
              <p>{DUMMY_USER.bio}</p>
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
          <TabsTrigger value="saved" className="flex-1">
            <Bookmark className="mr-2 h-4 w-4" />
            Saved
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-6">
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card
                key={i}
                className="aspect-square cursor-pointer overflow-hidden"
              >
                <img
                  src={`https://images.unsplash.com/photo-${1682687220742 + i}-aba13b6e50ba?w=400&h=400&fit=crop`}
                  alt={`Post ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="flex flex-col items-center justify-center py-12">
            <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold">Save posts</p>
            <p className="text-sm text-muted-foreground">
              Save photos and videos that you want to see again.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}