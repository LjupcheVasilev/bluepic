import PostFeed from "@/components/post-feed";
import Stories from "@/components/stories";

export default function Home() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 space-y-6">
        <PostFeed />
      </div>
    </div>
  );
}