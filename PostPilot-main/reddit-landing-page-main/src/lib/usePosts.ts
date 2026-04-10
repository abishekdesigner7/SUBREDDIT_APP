"use client";

import { useState, useEffect } from "react";
import { Post, getPosts, savePost, deletePost, clearAllPosts } from "./posts";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPosts() {
    setLoading(true);
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function addOrUpdatePost(post: Post) {
    await savePost(post);
    await loadPosts();
  }

  async function removePost(id: string) {
    await deletePost(id);
    await loadPosts();
  }

  async function clearAll() {
    await clearAllPosts();
    await loadPosts();
  }

  async function markPublished(id: string) {
    const post = posts.find(p => p.id === id);
    if (post) {
      await savePost({ ...post, status: "published" });
      await loadPosts();
    }
  }

  return { posts, loading, addOrUpdatePost, removePost, clearAll, markPublished };
}
