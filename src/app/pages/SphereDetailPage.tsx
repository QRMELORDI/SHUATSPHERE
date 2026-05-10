import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Users, FileText, Crown, TrendingUp, Clock, Trophy } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

const SORT_OPTIONS = [
  { id: 'latest', label: 'Latest', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'top', label: 'Top', icon: Trophy },
];

export function SphereDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { posts, joinedSpheres, toggleJoinSphere, isLoggedIn, spheres } = useApp();
  const [sort, setSort] = useState('latest');

  const sphere = spheres.find(s => s.slug === slug);
  if (!sphere) {
    return (
      <div className="text-center py-16 p-4">
        <span className="text-5xl block mb-4">🌐</span>
        <p className="font-black text-foreground text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Sphere not found</p>
        <button onClick={() => navigate('/spheres')} className="mt-3 text-sm text-[#7C3AED] font-bold hover:underline">Browse all spheres</button>
      </div>
    );
  }

  const isJoined = joinedSpheres.has(sphere.slug);
  const keeper = USERS.find(u => u.id === sphere.keeper);

  let spherePosts = posts.filter(p => p.sphereSlug === sphere.slug);
  if (sort === 'latest') spherePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (sort === 'top') spherePosts.sort((a, b) => (b.boosts - b.buries) - (a.boosts - a.buries));
  else spherePosts.sort((a, b) => {
    const sa = a.boosts / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / 3600000);
    const sb = b.boosts / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / 3600000);
    return sb - sa;
  });

  return (
    <div>
      {/* Back */}
      <div className="px-4 pt-4">
        <button onClick={() => navigate('/spheres')} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> All Spheres
        </button>
      </div>

      {/* Sphere header card */}
      <div className="p-4">
        <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[4px_4px_0px_#18181B] dark:shadow-none overflow-hidden">
          {/* Cover */}
          <div className={`h-24 bg-gradient-to-br ${sphere.coverColor} relative`}>
            {sphere.coverImage && (
              <img src={sphere.coverImage} alt={sphere.name} className="w-full h-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 flex items-end p-3">
              <span className="text-4xl drop-shadow-lg">{sphere.icon}</span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h1 className="font-black text-xl text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>{sphere.name}</h1>
                <div className="text-xs text-[#7C3AED] font-black">s/{sphere.slug}</div>
              </div>
              <button
                onClick={() => isLoggedIn ? toggleJoinSphere(sphere.slug) : navigate('/login')}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-black border-2 transition-all active:translate-y-0.5 ${
                  isJoined
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:shadow-none'
                    : 'bg-[#7C3AED] text-white border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:shadow-none hover:bg-[#6D28D9]'
                }`}
              >
                {isJoined ? '✓ Joined' : 'Join'}
              </button>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-3">{sphere.description}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-zinc-500 font-bold border-t-2 border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="flex items-center gap-1"><Users size={12} />{sphere.memberCount} members</span>
              <span className="flex items-center gap-1"><FileText size={12} />{sphere.postCount} posts</span>
              {keeper && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 ml-auto">
                  <Crown size={12} />{keeper.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sort tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
          {SORT_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const active = sort === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSort(opt.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all ${
                  active
                    ? 'bg-white dark:bg-zinc-900 text-foreground shadow-sm border border-zinc-200 dark:border-zinc-700'
                    : 'text-zinc-500 hover:text-foreground'
                }`}
              >
                <Icon size={13} />{opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 pb-4 space-y-4">
        {spherePosts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">{sphere.icon}</span>
            <p className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>No posts yet</p>
            <p className="text-zinc-500 text-sm font-semibold mt-1">Be the first to post in s/{sphere.slug}</p>
            {isLoggedIn && (
              <button
                onClick={() => navigate('/create')}
                className="mt-4 px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
              >
                Create Post
              </button>
            )}
          </div>
        ) : (
          spherePosts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <PostCard post={post} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}