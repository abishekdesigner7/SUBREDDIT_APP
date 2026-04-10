"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if there is a body and it's not a FormData
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "API error";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Some endpoints (like delete) might not return JSON
  try {
    return await response.json();
  } catch {
    return null;
  }
}
