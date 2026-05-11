import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '../../lib/api';
import { User, Post, Sphere, Notification, Whisper } from '../data/mockData';

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
  resetPassword: (email: string, username: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  refreshSpheres: () => Promise<void>;
  refreshPosts: () => Promise<void>;
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
  const [boostedPosts, setBoostedPosts] = useState<Set<string>>(new Set());
  const [buriedPosts, setBuriedPosts] = useState<Set<string>>(new Set());
  const [stashedPosts, setStashedPosts] = useState<Set<string>>(new Set());
  const [joinedSpheres, setJoinedSpheres] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [spheres, setSpheres] = useState<Sphere[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);

      const token = getAuthToken();
      if (token) {
        const result = await api.getMe();
        if (result.data) {
          setCurrentUser(result.data as User);
          setIsLoggedIn(true);
          setJoinedSpheres(new Set(result.data.joinedSpheres || []));
        } else {
          clearAuthToken();
        }
      }
      
      setIsLoading(false);
      
      return () => mediaQuery.removeEventListener('change', handler);
    };
    init();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      loadSpheres();
      loadPosts();
      loadWhispers();
      loadNotifications();
    }
  }, [isLoggedIn, isLoading]);

  const loadSpheres = async () => {
    const result = await api.getSpheres();
    if (result.data) {
      setSpheres(result.data as Sphere[]);
    }
  };

  const loadPosts = async () => {
    const result = await api.getPosts();
    if (result.data) {
      setPosts(result.data as Post[]);
    }
  };

  const loadWhispers = async () => {
    const result = await api.getWhispers();
    if (result.data) {
      setWhispers(result.data as Whisper[]);
    }
  };

  const loadNotifications = async () => {
    const result = await api.getNotifications();
    if (result.data) {
      setNotifications(result.data as Notification[]);
    }
  };

  const refreshUser = async () => {
    const result = await api.getMe();
    if (result.data) {
      setCurrentUser(result.data as User);
      setJoinedSpheres(new Set(result.data.joinedSpheres || []));
    }
  };

  const refreshSpheres = async () => {
    await loadSpheres();
  };

  const refreshPosts = async () => {
    await loadPosts();
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith('@shiats.edu.in')) {
      return { success: false, error: 'Only @shiats.edu.in emails are allowed.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const result = await api.login({ email, password });
    if (result.error) {
      return { success: false, error: result.error };
    }
    if (result.data) {
      setAuthToken(result.data.token);
      setCurrentUser(result.data.user as User);
      setIsLoggedIn(true);
      setJoinedSpheres(new Set(result.data.user.joinedSpheres || []));
      localStorage.setItem('shuatsphere_user', JSON.stringify(result.data.user));
      return { success: true };
    }
    return { success: false, error: 'Login failed' };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (!data.email.endsWith('@shiats.edu.in')) {
      return { success: false, error: 'Only @shiats.edu.in emails are allowed.' };
    }
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (!data.name || !data.username || !data.batch || !data.branch) {
      return { success: false, error: 'All fields are required.' };
    }

    const result = await api.register(data);
    if (result.error) {
      return { success: false, error: result.error };
    }
    if (result.data) {
      const loginResult = await login(data.email, data.password);
      if (loginResult.success) {
        return { success: true };
      }
      return { success: false, error: 'Registration successful but login failed' };
    }
    return { success: false, error: 'Registration failed' };
  };

  const resetPassword = async (email: string, username: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!email.endsWith('@shiats.edu.in')) {
      return { success: false, error: 'Only @shiats.edu.in emails are allowed.' };
    }
    if (newPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const result = await api.resetPassword({ email, username, newPassword: newPass });
    if (result.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  };

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem('shuatsphere_user');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setJoinedSpheres(new Set());
    setBoostedPosts(new Set());
    setBuriedPosts(new Set());
    setStashedPosts(new Set());
    setWhispers([]);
    setNotifications([]);
    setPosts([]);
    setSpheres([]);
  };

  const toggleBoost = async (postId: string) => {
    const wasBoosted = boostedPosts.has(postId);
    
    setBoostedPosts(prev => {
      const next = new Set(prev);
      if (wasBoosted) {
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

    if (isLoggedIn) {
      await api.votePost(postId, 'boost');
    }
  };

  const toggleBury = async (postId: string) => {
    const wasBuried = buriedPosts.has(postId);
    
    setBuriedPosts(prev => {
      const next = new Set(prev);
      if (wasBuried) {
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

    if (isLoggedIn) {
      await api.votePost(postId, 'bury');
    }
  };

  const toggleStash = async (postId: string) => {
    const wasStashed = stashedPosts.has(postId);
    
    setStashedPosts(prev => {
      const next = new Set(prev);
      if (wasStashed) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    if (isLoggedIn) {
      await api.stashPost(postId);
    }
  };

  const toggleJoinSphere = async (sphereSlug: string) => {
    const wasJoined = joinedSpheres.has(sphereSlug);
    
    setJoinedSpheres(prev => {
      const next = new Set(prev);
      if (wasJoined) {
        next.delete(sphereSlug);
      } else {
        next.add(sphereSlug);
      }
      return next;
    });

    setSpheres(prev => prev.map(s => 
      s.slug === sphereSlug 
        ? { ...s, memberCount: s.memberCount + (wasJoined ? -1 : 1) }
        : s
    ));

    if (isLoggedIn) {
      if (wasJoined) {
        await api.leaveSphere(sphereSlug);
      } else {
        await api.joinSphere(sphereSlug);
      }
    }
  };

  const addPost = async (postData: Omit<Post, 'id' | 'boosts' | 'buries' | 'replyCount' | 'stashCount' | 'createdAt'>) => {
    if (!isLoggedIn) return;
    
    const result = await api.createPost({
      title: postData.title,
      content: postData.content,
      imageUrl: postData.imageUrl,
      linkUrl: postData.linkUrl,
      type: postData.type,
      sphereSlug: postData.sphereSlug,
      flair: postData.flair,
    });
    
    if (result.data) {
      setPosts(prev => [result.data as Post, ...prev]);
      setSpheres(prev => prev.map(s => 
        s.slug === postData.sphereSlug 
          ? { ...s, postCount: s.postCount + 1 }
          : s
      ));
    }
  };

  const deletePost = async (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    
    if (isLoggedIn) {
      await api.deletePost(postId);
    }
  };

  const updateProfile = async (data: Partial<Pick<User, 'name' | 'bio' | 'avatar' | 'bannerColor'>>) => {
    if (!isLoggedIn || !currentUser) return;
    
    const result = await api.updateProfile(data);
    if (result.data) {
      setCurrentUser(result.data as User);
      localStorage.setItem('shuatsphere_user', JSON.stringify(result.data));
    }
  };

  const sendWhisper = async (toId: string, content: string) => {
    if (!isLoggedIn) return;
    
    const result = await api.sendWhisper({ toId, content });
    if (result.data) {
      setWhispers(prev => [...prev, result.data as Whisper]);
    }
  };

  const markWhisperRead = async (whisperId: string) => {
    setWhispers(prev =>
      prev.map(w => w.id === whisperId ? { ...w, read: true } : w)
    );
    
    if (isLoggedIn) {
      await api.markWhisperRead(whisperId);
    }
  };

  const markNotifRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    if (isLoggedIn) {
      await api.markNotificationRead(id);
    }
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createSphere = async (data: Omit<Sphere, 'id' | 'memberCount' | 'postCount' | 'createdAt' | 'createdBy'>) => {
    if (!isLoggedIn) return;
    
    const result = await api.createSphere({
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      coverColor: data.coverColor,
      category: data.category,
    });
    
    if (result.data) {
      setSpheres(prev => [result.data as Sphere, ...prev]);
      setJoinedSpheres(prev => new Set([...prev, data.slug]));
      await refreshUser();
    }
  };

  const unreadWhisperCount = whispers.filter(
    w => w.toId === currentUser?.id && !w.read
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
      refreshUser,
      refreshSpheres,
      refreshPosts,
      resetPassword,
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