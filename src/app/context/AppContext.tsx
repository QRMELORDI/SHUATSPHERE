import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post, Sphere, Notification, USERS, POSTS, SPHERES, CURRENT_USER_ID, WHISPERS, Whisper, NOTIFICATIONS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  boostedPosts: Set<string>;
  buriedPosts: Set<string>;
  stashedPosts: Set<string>;
  toggleBoost: (postId: string) => void;
  toggleBury: (postId: string) => void;
  toggleStash: (postId: string) => void;
  joinedSpheres: Set<string>;
  toggleJoinSphere: (sphereSlug: string) => void;
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'boosts' | 'buries' | 'replyCount' | 'stashCount' | 'createdAt'>) => void;
  deletePost: (postId: string) => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'bio' | 'avatar' | 'bannerColor'>>) => void;
  whispers: Whisper[];
  sendWhisper: (toId: string, content: string) => void;
  markWhisperRead: (whisperId: string) => void;
  unreadWhisperCount: number;
  notifications: Notification[];
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  unreadNotifCount: number;
  spheres: Sphere[];
  createSphere: (data: Omit<Sphere, 'id' | 'memberCount' | 'postCount' | 'createdAt' | 'createdBy'>) => void;
  isDark: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
  batch: string;
  branch: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [boostedPosts, setBoostedPosts] = useState<Set<string>>(new Set(['post2', 'post3']));
  const [buriedPosts, setBuriedPosts] = useState<Set<string>>(new Set());
  const [stashedPosts, setStashedPosts] = useState<Set<string>>(new Set(['post2', 'post5', 'post12']));
  const [joinedSpheres, setJoinedSpheres] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [whispers, setWhispers] = useState<Whisper[]>(WHISPERS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [spheres, setSpheres] = useState<Sphere[]>(SPHERES);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply dark class to html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith('@shiats.edu.in')) {
      return { success: false, error: 'Only @shiats.edu.in emails are allowed.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    await new Promise(res => setTimeout(res, 800));
    const user = USERS.find(u => u.email === email) || USERS[0];
    setCurrentUser(user);
    setIsLoggedIn(true);
    setJoinedSpheres(new Set(user.joinedSpheres));
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (!data.email.endsWith('@shiats.edu.in')) {
      return { success: false, error: 'Only @shiats.edu.in emails are allowed.' };
    }
    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }
    if (!data.name || !data.username || !data.batch || !data.branch) {
      return { success: false, error: 'All fields are required.' };
    }
    await new Promise(res => setTimeout(res, 1000));
    const newUser: User = {
      id: 'user_new',
      email: data.email,
      name: data.name,
      username: data.username,
      batch: data.batch,
      branch: data.branch,
      bio: `${data.branch} student at SHUATS, batch ${data.batch}`,
      avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.username}&backgroundColor=b6e3f4`,
      bannerColor: 'from-violet-600 to-teal-600',
      auraScore: 0,
      joinDate: new Date().toISOString().split('T')[0],
      badges: ['verified_student'],
      joinedSpheres: ['notices'],
      isVerified: true,
      tag: `${data.branch} ${data.batch}`,
    };
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setJoinedSpheres(new Set(['notices']));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setJoinedSpheres(new Set());
    setBoostedPosts(new Set());
    setBuriedPosts(new Set());
    setStashedPosts(new Set());
  };

  const toggleBoost = (postId: string) => {
    setBoostedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        setBuriedPosts(bp => {
          const b = new Set(bp);
          b.delete(postId);
          return b;
        });
      }
      return next;
    });
  };

  const toggleBury = (postId: string) => {
    setBuriedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        setBoostedPosts(bp => {
          const b = new Set(bp);
          b.delete(postId);
          return b;
        });
      }
      return next;
    });
  };

  const toggleStash = (postId: string) => {
    setStashedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const toggleJoinSphere = (sphereSlug: string) => {
    setJoinedSpheres(prev => {
      const next = new Set(prev);
      if (next.has(sphereSlug)) {
        next.delete(sphereSlug);
      } else {
        next.add(sphereSlug);
      }
      return next;
    });
  };

  const addPost = (postData: Omit<Post, 'id' | 'boosts' | 'buries' | 'replyCount' | 'stashCount' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      boosts: 1,
      buries: 0,
      replyCount: 0,
      stashCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setStashedPosts(prev => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
    setBoostedPosts(prev => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
    setBuriedPosts(prev => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  };

  const updateProfile = (data: Partial<Pick<User, 'name' | 'bio' | 'avatar' | 'bannerColor'>>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const sendWhisper = (toId: string, content: string) => {
    const newWhisper: Whisper = {
      id: `w_${Date.now()}`,
      fromId: currentUser?.id || CURRENT_USER_ID,
      toId,
      content,
      createdAt: new Date().toISOString(),
      read: true,
    };
    setWhispers(prev => [...prev, newWhisper]);
  };

  const markWhisperRead = (whisperId: string) => {
    setWhispers(prev =>
      prev.map(w => w.id === whisperId ? { ...w, read: true } : w)
    );
  };

  const markNotifRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createSphere = (data: Omit<Sphere, 'id' | 'memberCount' | 'postCount' | 'createdAt' | 'createdBy'>) => {
    const newSphere: Sphere = {
      ...data,
      id: `sphere_${Date.now()}`,
      memberCount: 1,
      postCount: 0,
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.id || CURRENT_USER_ID,
    };
    setSpheres(prev => [newSphere, ...prev]);
    setJoinedSpheres(prev => new Set([...prev, newSphere.slug]));
  };

  const unreadWhisperCount = whispers.filter(
    w => w.toId === (currentUser?.id || CURRENT_USER_ID) && !w.read
  ).length;

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AppContext.Provider value={{
      currentUser,
      isLoggedIn,
      login,
      register,
      logout,
      boostedPosts,
      buriedPosts,
      stashedPosts,
      toggleBoost,
      toggleBury,
      toggleStash,
      joinedSpheres,
      toggleJoinSphere,
      posts,
      addPost,
      deletePost,
      updateProfile,
      whispers,
      sendWhisper,
      markWhisperRead,
      unreadWhisperCount,
      notifications,
      markNotifRead,
      markAllNotifsRead,
      unreadNotifCount,
      spheres,
      createSphere,
      isDark,
      toggleTheme,
      searchQuery,
      setSearchQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
