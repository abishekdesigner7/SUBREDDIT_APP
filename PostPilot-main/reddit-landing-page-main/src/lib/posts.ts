import { apiFetch } from "./api";

export interface Post {
  id: string;
  subreddit: string;
  date: string;
  time: string;
  title: string;
  body: string;
  imageUrl: string;
  linkUrl: string;
  postType: "text" | "image" | "link";
  flair: string;
  tags: { nsfw: boolean; spoiler: boolean; brandAffiliate: boolean };
  status: "scheduled" | "published" | "queued" | "processing" | "failed";
  createdAt: string;
  _id?: string;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const data = await apiFetch("/posts", { method: "GET" });
    return data && Array.isArray(data) ? data.map((d: any) => ({ ...d, id: d._id })) : [];
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return [];
  }
}

export async function getPost(id: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find(p => p.id === id || p._id === id);
}

export async function savePost(post: Post, isEdit = false): Promise<void> {
  try {
    const { id, _id, createdAt, ...body } = post;
    if (isEdit && (_id || id)) {
      // Use the MongoDB _id for updates
      const mongoId = _id || id;
      await apiFetch(`/posts/${mongoId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    } else {
      await apiFetch("/posts", {
        method: "POST",
        body: JSON.stringify(body),
      });
    }
  } catch (err) {
    console.error("Failed to save post:", err);
    throw err;
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    await apiFetch(`/posts/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error("Failed to delete post:", err);
  }
}

export async function clearAllPosts(): Promise<void> {
  try {
    await apiFetch("/posts", { method: "DELETE" });
  } catch (err) {
    console.error("Failed to clear posts:", err);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

