const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("shuatsphere_token");
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export const api = {
  // Auth
  register: (user: {
    email: string;
    password: string;
    name: string;
    username: string;
    batch: string;
    branch: string;
  }) => fetchApi("/api/auth/register", { method: "POST", body: JSON.stringify(user) }),

  login: (credentials: { email: string; password: string }) =>
    fetchApi("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),

  getMe: () => fetchApi("/api/auth/me"),

  // Users
  getUser: (userId: string) => fetchApi(`/api/users/${userId}`),

  updateProfile: (data: Record<string, unknown>) =>
    fetchApi("/api/users/me", { method: "PUT", body: JSON.stringify(data) }),

  // Spheres
  getSpheres: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (search) params.append("search", search);
    return fetchApi(`/api/spheres?${params.toString()}`);
  },

  getSphere: (slug: string) => fetchApi(`/api/spheres/${slug}`),

  createSphere: (sphere: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    coverColor: string;
    category: string;
  }) => fetchApi("/api/spheres", { method: "POST", body: JSON.stringify(sphere) }),

  joinSphere: (slug: string) =>
    fetchApi(`/api/spheres/${slug}/join`, { method: "POST" }),

  leaveSphere: (slug: string) =>
    fetchApi(`/api/spheres/${slug}/leave`, { method: "POST" }),

  // Posts
  getPosts: (sphere?: string, sort?: string) => {
    const params = new URLSearchParams();
    if (sphere) params.append("sphere", sphere);
    if (sort) params.append("sort", sort);
    return fetchApi(`/api/posts?${params.toString()}`);
  },

  getPost: (postId: string) => fetchApi(`/api/posts/${postId}`),

  createPost: (post: {
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    type: string;
    sphereSlug: string;
    flair?: string;
  }) => fetchApi("/api/posts", { method: "POST", body: JSON.stringify(post) }),

  deletePost: (postId: string) =>
    fetchApi(`/api/posts/${postId}`, { method: "DELETE" }),

  votePost: (postId: string, vote: string) =>
    fetchApi(`/api/posts/${postId}/vote?vote=${vote}`, { method: "POST" }),

  stashPost: (postId: string) =>
    fetchApi(`/api/posts/${postId}/stash`, { method: "POST" }),

  // Comments
  getComments: (postId: string) => fetchApi(`/api/posts/${postId}/comments`),

  createComment: (comment: { postId: string; content: string; parentId?: string }) =>
    fetchApi("/api/comments", { method: "POST", body: JSON.stringify(comment) }),

  voteComment: (commentId: string, vote: string) =>
    fetchApi(`/api/comments/${commentId}/vote?vote=${vote}`, { method: "POST" }),

  // Whispers
  getWhispers: () => fetchApi("/api/whispers"),

  sendWhisper: (whisper: { toId: string; content: string }) =>
    fetchApi("/api/whispers", { method: "POST", body: JSON.stringify(whisper) }),

  markWhisperRead: (whisperId: string) =>
    fetchApi(`/api/whispers/${whisperId}/read`, { method: "POST" }),

  getUnreadWhisperCount: () => fetchApi("/api/whispers/unread-count"),

  // Notifications
  getNotifications: () => fetchApi("/api/notifications"),

  markNotificationRead: (notifId: string) =>
    fetchApi(`/api/notifications/${notifId}/read`, { method: "POST" }),

  // Search
  search: (query: string) => fetchApi(`/api/search?query=${encodeURIComponent(query)}`),

  searchUsers: (query: string) => fetchApi(`/api/search/users?q=${encodeURIComponent(query)}`),

  // Upload
  uploadImage: async (file: File): Promise<string | null> => {
    const token = localStorage.getItem("shuatsphere_token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data.url;
    } catch {
      return null;
    }
  },

  // Seed
  seed: () => fetchApi("/api/seed"),
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("shuatsphere_token", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("shuatsphere_token");
};

export const getAuthToken = () => localStorage.getItem("shuatsphere_token");