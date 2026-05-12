import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, Clock, Trophy, Ghost, ChevronRight, Sparkles, Users } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useApp } from '../context/AppContext';

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'latest', label: 'Latest', icon: Clock },
  { id: 'top', label: 'Top', icon: Trophy },
];

const WELCOME_POST_ID = 'shuatsphere-welcome-post';

function shouldShowWelcome(): boolean {
  const shown = localStorage.getItem(WELCOME_POST_ID);
  return !shown;
}

function markWelcomeShown() {
  localStorage.setItem(WELCOME_POST_ID, 'true');
}

export function HomePage() {
  const navigate = useNavigate();
  const { posts, isLoggedIn, joinedSpheres, currentUser, spheres } = useApp();
  const [sort, setSort] = useState('trending');
  const [feedFilter, setFeedFilter] = useState<'all' | 'joined'>('all');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShowWelcome(shouldShowWelcome());
    }
  }, [isLoggedIn]);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    markWelcomeShown();
  };

  const sortedPosts = useMemo(() => {
    let filtered = [...posts];
    if (feedFilter === 'joined' && joinedSpheres.size > 0) {
      filtered = filtered.filter(p => joinedSpheres.has(p.sphereSlug));
    }
    if (sort === 'trending') {
      return filtered.sort((a, b) => {
        const scoreA = a.boosts / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / 3600000);
        const scoreB = b.boosts / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / 3600000);
        return scoreB - scoreA;
      });
    }
    if (sort === 'latest') return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return filtered.sort((a, b) => (b.boosts - b.buries) - (a.boosts - a.buries));
  }, [posts, sort, feedFilter, joinedSpheres]);

  const topSpheres = spheres.slice(0, 4);

  // Real popular searches from spheres
  const popularSearches = spheres
    .slice(0, 8)
    .map(s => `s/${s.slug}`);

  return (
    <div className="space-y-0">
      {/* Ghost banner */}
      {!isLoggedIn && (
        <div className="mx-4 mt-4 p-3 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-violet-50 dark:bg-violet-950/20 shadow-[3px_3px_0px_#18181B] dark:shadow-none flex items-center gap-3">
          <Ghost size={24} className="text-[#7C3AED] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>You're in Ghost Mode 👻</p>
            <p className="text-xs text-zinc-500 font-semibold">Login with @shiats.edu.in to boost, comment & join spheres</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="shrink-0 px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-black rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
          >
            Login
          </button>
        </div>
      )}

      {/* Welcome card for logged-in */}
      {isLoggedIn && currentUser && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-[#7C3AED]/5 shadow-[3px_3px_0px_#18181B] dark:shadow-none flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-foreground text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Hey, {currentUser.name.split(' ')[0]}! 👋</p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-[#7C3AED] font-black flex items-center gap-1"><Sparkles size={11} />{currentUser.auraScore} Aura</span>
              <span className="text-xs text-zinc-500 font-semibold flex items-center gap-1"><Users size={11} />{joinedSpheres.size} Spheres</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="shrink-0 px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-black rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
          >
            + Post
          </button>
        </div>
      )}

      {/* Welcome Post - shows once after account creation */}
      {showWelcome && isLoggedIn && currentUser && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 p-4 rounded-2xl border-2 border-amber-400 dark:border-amber-600 bg-gradient-to-r from-amber-50 to-violet-50 dark:from-amber-950/30 dark:to-violet-950/30 shadow-[3px_3px_0px_#18181B]"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-violet-500 flex items-center justify-center text-2xl shrink-0">
              🎉
            </div>
            <div className="flex-1">
              <h3 className="font-black text-foreground text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome to SHUATSPHERE, {currentUser.name.split(' ')[0]}!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold mt-1">
                You're now part of the SHUATS community! Explore spheres, connect with peers, and share your journey. 🚀
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => navigate('/spheres')}
                  className="px-3 py-1.5 bg-[#7C3AED] text-white text-xs font-black rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none"
                >
                  Explore Spheres
                </button>
                <button
                  onClick={handleDismissWelcome}
                  className="px-3 py-1.5 text-zinc-500 text-xs font-black"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Featured Spheres strip */}
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-black text-sm text-foreground uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>Popular Spheres</h2>
          <button onClick={() => navigate('/spheres')} className="text-xs text-[#7C3AED] font-black flex items-center gap-0.5 hover:underline">
            All <ChevronRight size={12} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {topSpheres.map(sphere => (
            <button
              key={sphere.id}
              onClick={() => navigate(`/sphere/${sphere.slug}`)}
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[2px_2px_0px_#18181B] dark:shadow-none hover:border-[#7C3AED] hover:text-[#7C3AED] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span className="text-base">{sphere.icon}</span>
              <div className="text-left">
                <div className="text-xs font-black text-foreground whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>s/{sphere.slug}</div>
                <div className="text-[10px] text-zinc-500 font-semibold">{sphere.memberCount} members</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Searches */}
      {popularSearches.length > 0 && (
        <div className="px-4 mt-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-black text-sm text-foreground uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>Popular Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((s, i) => (
              <motion.button
                key={s}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                className="px-3 py-1.5 rounded-full border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] text-xs font-black uppercase tracking-wider hover:bg-[#7C3AED]/10 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all shadow-[1px_1px_0px_#18181B] dark:shadow-none"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Sort + Filter tabs */}
      <div className="sticky top-14 z-30 bg-[#FAFAFF]/95 dark:bg-[#0D0B1A]/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-700 mt-3">
        <div className="px-4 flex items-center justify-between py-2 gap-3">
          {/* Feed filter */}
          <div className="flex rounded-xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden shrink-0">
            {(['all', 'joined'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFeedFilter(f)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-all ${
                  feedFilter === f
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-[#15122A] text-zinc-500 hover:text-foreground'
                }`}
              >
                {f === 'all' ? 'All' : 'My Feed'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-1">
            {SORT_OPTIONS.map(option => {
              const Icon = option.icon;
              const active = sort === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSort(option.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${
                    active
                      ? 'bg-[#7C3AED] text-white border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none'
                      : 'text-zinc-500 hover:text-foreground border-2 border-transparent'
                  }`}
                >
                  <Icon size={13} />
                  <span className="hidden sm:block">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Post feed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sort + feedFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 p-4"
        >
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3">🌐</span>
              <p className="font-black text-foreground text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>No posts yet</p>
              <p className="text-zinc-500 text-sm font-semibold mt-1">Be the first to post in a sphere!</p>
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/create')}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            sortedPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}