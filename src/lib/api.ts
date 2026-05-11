const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? "http://localhost:8000"
  : "https://shuatsphere.onrender.com";

let useMockData = false;

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("shuatsphere_token");
  
  if (useMockData) {
    return getMockResponse<T>(endpoint, options);
  }
  
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
      useMockData = true;
      return getMockResponse<T>(endpoint, options);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    useMockData = true;
    return getMockResponse<T>(endpoint, options);
  }
}

const MOCK_USERS: Record<string, { id: string; email: string; name: string; username: string; role: string; password: string; batch: string; branch: string }> = {
  '25msrsgis001@shiats.edu.in': { id: 'admin1', email: '25msrsgis001@shiats.edu.in', name: 'Admin User', username: 'admin', role: 'admin', password: 'admin2024', batch: '2025', branch: 'CSE' },
  '22msrscse001@shiats.edu.in': { id: 'mod1', email: '22msrscse001@shiats.edu.in', name: 'Moderator One', username: 'mod1', role: 'moderator', password: 'mod2024', batch: '2022', branch: 'CSE' },
  '22msrscse002@shiats.edu.in': { id: 'mod2', email: '22msrscse002@shiats.edu.in', name: 'Moderator Two', username: 'mod2', role: 'moderator', password: 'mod2024', batch: '2022', branch: 'CSE' },
  '22msrscse003@shiats.edu.in': { id: 'mod3', email: '22msrscse003@shiats.edu.in', name: 'Moderator Three', username: 'mod3', role: 'moderator', password: 'mod2024', batch: '2022', branch: 'CSE' },
  '22msrscse004@shiats.edu.in': { id: 'mod4', email: '22msrscse004@shiats.edu.in', name: 'Moderator Four', username: 'mod4', role: 'moderator', password: 'mod2024', batch: '2022', branch: 'CSE' },
  '22msrscse005@shiats.edu.in': { id: 'mod5', email: '22msrscse005@shiats.edu.in', name: 'Moderator Five', username: 'mod5', role: 'moderator', password: 'mod2024', batch: '2022', branch: 'CSE' },
  '23msrscse001@shiats.edu.in': { id: 'user1', email: '23msrscse001@shiats.edu.in', name: 'Student One', username: 'student1', role: 'user', password: 'user2024', batch: '2023', branch: 'CSE' },
  '23msrscse002@shiats.edu.in': { id: 'user2', email: '23msrscse002@shiats.edu.in', name: 'Student Two', username: 'student2', role: 'user', password: 'user2024', batch: '2023', branch: 'CSE' },
  '23msrscse003@shiats.edu.in': { id: 'user3', email: '23msrscse003@shiats.edu.in', name: 'Student Three', username: 'student3', role: 'user', password: 'user2024', batch: '2023', branch: 'CSE' },
  '23msrscse004@shiats.edu.in': { id: 'user4', email: '23msrscse004@shiats.edu.in', name: 'Student Four', username: 'student4', role: 'user', password: 'user2024', batch: '2023', branch: 'CSE' },
};

function getMockResponse<T>(endpoint: string, options?: RequestInit): ApiResponse<T> {
  if (endpoint === '/api/auth/login' && options?.method === 'POST') {
    const body = JSON.parse(options?.body as string || '{}');
    const mockUser = MOCK_USERS[body.email];
    if (mockUser && mockUser.password === body.password) {
      return { data: { token: 'mock_token_' + mockUser.id, user: { id: mockUser.id, email: mockUser.email, name: mockUser.name, username: mockUser.username, batch: mockUser.batch, branch: mockUser.branch, bio: `${mockUser.role} at SHUATS`, avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=' + mockUser.username, auraScore: mockUser.role === 'admin' ? 2500 : mockUser.role === 'moderator' ? 1500 : 500, joinDate: '2024-01-01', badges: ['verified_student'], joinedSpheres: ['cse-2025', 'dsa', 'sports', 'notices'], isVerified: true, role: mockUser.role, tag: mockUser.batch + ' ' + mockUser.branch } } as T };
    }
    return { error: 'Invalid email or password' };
  }
  if (endpoint === '/api/auth/register' && options?.method === 'POST') {
    return { data: { token: 'mock_token_' + Date.now(), user: { id: 'user_' + Date.now(), email: 'newuser@shiats.edu.in', name: 'New User', username: 'newuser', batch: '2025', branch: 'CSE', bio: '', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=newuser', auraScore: 100, joinDate: new Date().toISOString().split('T')[0], badges: [], joinedSpheres: [], isVerified: false } } as T };
  }
  if (endpoint === '/api/auth/reset-password' && options?.method === 'POST') {
    return { data: { success: true } as T };
  }
  if (endpoint === '/api/auth/me') {
    const storedUser = localStorage.getItem('shuatsphere_user');
    if (storedUser) {
      return { data: JSON.parse(storedUser) as T };
    }
    return { data: { id: 'user1', email: '25msrsgis001@shiats.edu.in', name: 'Demo User', username: 'demo_user', batch: '2025', branch: 'CSE', bio: 'Demo account', avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=demo', auraScore: 100, joinDate: '2024-01-01', badges: ['verified_student'], joinedSpheres: ['cse-2025', 'dsa', 'sports'], isVerified: true } as T };
  }
  if (endpoint.startsWith('/api/spheres')) {
    return { data: [{ id: 'sphere1', name: 'CSE 2025', slug: 'cse-2025', description: 'CSE batch 2025', icon: '💻', coverColor: 'from-violet-600 to-purple-800', memberCount: 342, postCount: 1204, createdBy: 'user1', createdAt: '2024-01-01', isPrivate: false, category: 'Academics', tags: ['CSE'], keeper: 'user1' }, { id: 'sphere2', name: 'DSA Practice', slug: 'dsa', description: 'Data Structures & Algorithms', icon: '🧩', coverColor: 'from-green-600 to-emerald-800', memberCount: 521, postCount: 2341, createdBy: 'user1', createdAt: '2024-01-01', isPrivate: false, category: 'Academics', tags: ['DSA'], keeper: 'user1' }, { id: 'sphere3', name: 'Sports Zone', slug: 'sports', description: 'All sports discussions', icon: '🏏', coverColor: 'from-orange-500 to-red-600', memberCount: 687, postCount: 1876, createdBy: 'user4', createdAt: '2024-01-01', isPrivate: false, category: 'Sports', tags: ['Sports'], keeper: 'user4' }] as T };
  }
  if (endpoint.startsWith('/api/posts')) {
    return { data: [{ id: 'post1', title: 'Welcome to Schwartzpear! 🎉', content: 'This is your student community platform. Connect with fellow students, join spheres, and share content!', imageUrl: undefined, linkUrl: undefined, type: 'text', authorId: 'user1', sphereId: 'sphere1', sphereSlug: 'cse-2025', boosts: 42, buries: 2, replyCount: 12, stashCount: 8, createdAt: new Date().toISOString(), flair: 'Announcement' }] as T };
  }
  if (endpoint.startsWith('/api/notifications')) {
    return { data: [] as T };
  }
  if (endpoint.startsWith('/api/whispers')) {
    return { data: [] as T };
  }
  return { data: undefined };
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

  resetPassword: (data: { email: string; username: string; newPassword: string }) =>
    fetchApi("/api/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),

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