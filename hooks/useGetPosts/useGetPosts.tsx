import { PostWithUser } from "@/db/types";
import { useEffect, useState } from "react";
export const useGetPosts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/posts", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e);
      });
  }, []);

  return { isLoading, posts, error };
};
