import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Bookmark, Lock } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { useApp } from '../context/AppContext';

export function StashPage() {
  const navigate = useNavigate();
  const { isLoggedIn, stashedPosts, posts } = useApp();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Lock size={40} className="text-zinc-400 mb-4" />
        <h2 className="font-black text-xl text-foreground mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Login to view Stash</h2>
        <p className="text-zinc-500 text-sm font-semibold mb-6">Save posts to read later</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
        >
          Login
        </button>
      </div>
    );
  }

  const stashedList = posts.filter(p => stashedPosts.has(p.id));

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-black text-2xl text-foreground flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <Bookmark size={22} className="text-emerald-500" />
          Stash
        </h1>
        <p className="text-sm text-zinc-500 font-semibold mt-0.5">Posts you've saved ({stashedList.length})</p>
      </div>

      {stashedList.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark size={48} className="text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
          <p className="font-black text-foreground text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Your stash is empty</p>
          <p className="text-zinc-500 text-sm font-semibold mt-1">Tap the bookmark icon on any post to save it here</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
          >
            Browse Feed
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {stashedList.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}