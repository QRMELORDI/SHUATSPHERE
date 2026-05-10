import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export interface Sphere {
  id: string;
  name: string;
  slug: string;
  description: string;
  cover_image: string;
  icon: string;
  color: string;
  members_count: number;
  posts_count: number;
  created_at: string;
  creator_id: string;
}

export interface Post {
  id: string;
  content: string;
  author_id: string;
  sphere_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  author: User;
  sphere?: Sphere;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  created_at: string;
  author: User;
  likes_count: number;
  is_liked?: boolean;
}

export interface Notification {
  id: string;
  type: string;
  from_user_id: string;
  to_user_id: string;
  post_id?: string;
  sphere_id?: string;
  read: boolean;
  created_at: string;
  from_user?: User;
  post?: Post;
  sphere?: Sphere;
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) return null;
  return data;
}

export async function getSpheres(): Promise<Sphere[]> {
  const { data, error } = await supabase
    .from('spheres')
    .select('*')
    .order('members_count', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getSpherePosts(sphereId: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(*),
      sphere:spheres(*)
    `)
    .eq('sphere_id', sphereId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getFeed(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(*),
      sphere:spheres(*)
    `)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data || [];
}

export async function createPost(content: string, sphereId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      content,
      sphere_id: sphereId,
      author_id: user.id
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function likePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: user.id });
  
  if (error) throw error;
}

export async function unlikePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);
  
  if (error) throw error;
}

export async function bookmarkPost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('post_bookmarks')
    .insert({ post_id: postId, user_id: user.id });
  
  if (error) throw error;
}

export async function unbookmarkPost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('post_bookmarks')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);
  
  if (error) throw error;
}

export async function getNotifications(): Promise<Notification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      from_user:profiles!from_user_id(*),
      post:posts(*),
      sphere:spheres(*)
    `)
    .eq('to_user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function searchUsers(query: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20);
  
  if (error) throw error;
  return data || [];
}

export async function searchSpheres(query: string): Promise<Sphere[]> {
  const { data, error } = await supabase
    .from('spheres')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20);
  
  if (error) throw error;
  return data || [];
}

export async function joinSphere(sphereId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('sphere_members')
    .insert({ sphere_id: sphereId, user_id: user.id });
  
  if (error) throw error;
}

export async function leaveSphere(sphereId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('sphere_members')
    .delete()
    .eq('sphere_id', sphereId)
    .eq('user_id', user.id);
  
  if (error) throw error;
}