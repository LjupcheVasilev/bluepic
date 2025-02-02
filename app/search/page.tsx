"use client";

import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DUMMY_USERS = [
  {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "janesmith",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = DUMMY_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-2xl py-8">
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}