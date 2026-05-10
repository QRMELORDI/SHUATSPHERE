import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Bookmark, Share2, ExternalLink, MoreVertical, Trash2, Flag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Post, USERS } from '../data/mockData';
import { copyToClipboard } from '../utils/clipboard';

function timeAgo(d: string) {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const navigate = useNavigate();
  const { boostedPosts, buriedPosts, stashedPosts, toggleBoost, toggleBury, toggleStash, isLoggedIn, currentUser, deletePost } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  const author = USERS.find(u => u.id === post.authorId);
  const isBoosted = boostedPosts.has(post.id);
  const isBuried = buriedPosts.has(post.id);
  const isStashed = stashedPosts.has(post.id);
  const score = post.boosts - post.buries + (isBoosted ? 1 : 0) - (isBuried ? 1 : 0);
  const isOwn = isLoggedIn && currentUser?.id === post.authorId;

  const handleBoost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/login'); return; }
    toggleBoost(post.id);
  };

  const handleBury = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/login'); return; }
    toggleBury(post.id);
  };

  const handleStash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate('/login'); return; }
    toggleStash(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(window.location.origin + '/post/' + post.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this post? This cannot be undone.')) {
      deletePost(post.id);
    }
    setMenuOpen(false);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReportDone(true);
    setMenuOpen(false);
    setTimeout(() => setReportDone(false), 3000);
  };

  return (
    <article
      onClick={() => navigate(`/post/${post.id}`)}
      className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] p-4 shadow-[4px_4px_0px_#18181B] dark:shadow-none transition-transform active:translate-y-[2px] active:shadow-[0px_0px_0px_#18181B] cursor-pointer relative"
      data-testid="post-card"
    >
      {/* 3-dot menu */}
      <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-all"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-20 min-w-[140px] bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-xl shadow-[4px_4px_0px_#18181B] dark:shadow-lg overflow-hidden">
            {isOwn && (
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 size={13} /> Delete Post
              </button>
            )}
            {!isOwn && (
              <button
                onClick={handleReport}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <Flag size={13} /> {reportDone ? 'Reported ✓' : 'Report'}
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
            >
              <Share2 size={13} /> Share Link
            </button>
          </div>
        )}
      </div>

      {/* Sphere + metadata */}
      <div className="flex items-center gap-2 mb-3 pr-8">
        <button
          onClick={e => { e.stopPropagation(); navigate(`/sphere/${post.sphereSlug}`); }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 text-xs font-black uppercase tracking-wider text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all"
        >
          s/{post.sphereSlug}
        </button>
        <span className="text-xs text-zinc-400 font-semibold">•</span>
        <span className="text-xs text-zinc-500 font-semibold">{timeAgo(post.createdAt)}</span>
        {post.flair && (
          <>
            <span className="text-xs text-zinc-400">•</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/20 text-[#0D9488] text-[10px] font-black uppercase tracking-wider">
              {post.flair}
            </span>
          </>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-3">
        {author && (
          <button
            onClick={e => { e.stopPropagation(); navigate(`/profile/${post.authorId}`); }}
            className="flex items-center gap-2 group"
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="w-7 h-7 rounded-xl border-2 border-zinc-900 dark:border-zinc-700"
            />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-[#7C3AED] transition-colors">
              {author.username}
            </span>
            {author.isVerified && (
              <span className="text-[10px] font-black text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">
                ✓ VERIFIED
              </span>
            )}
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-foreground mb-2 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
        {post.title}
      </h3>

      {/* Content preview */}
      {!compact && post.content && post.type === 'text' && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      )}

      {/* Image */}
      {post.type === 'image' && post.imageUrl && (
        <div className="mb-3 rounded-xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
          <img src={post.imageUrl} alt={post.title} className="w-full max-h-64 object-cover" />
        </div>
      )}

      {/* Link */}
      {post.type === 'link' && post.linkUrl && (
        <div className="mb-3 flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
          <ExternalLink size={14} className="text-[#0D9488] shrink-0" />
          <span className="text-xs text-[#0D9488] font-semibold truncate">{post.linkUrl}</span>
        </div>
      )}

      {/* Report success toast */}
      {reportDone && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-700 text-xs font-bold">
          ✓ Post reported — we'll review it
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2 pt-3 border-t-2 border-zinc-100 dark:border-zinc-800/50">
        {/* Boost */}
        <button
          onClick={handleBoost}
          data-testid="boost-button"
          className={`flex items-center gap-1.5 font-black text-sm transition-all ${
            isBoosted ? 'text-[#7C3AED]' : 'text-zinc-400 hover:text-[#7C3AED]'
          }`}
        >
          <ArrowBigUp size={22} fill={isBoosted ? '#7C3AED' : 'none'} strokeWidth={2} />
          <span>{Math.max(0, score)}</span>
        </button>

        {/* Bury */}
        <button
          onClick={handleBury}
          data-testid="bury-button"
          className={`flex items-center gap-1 font-black text-sm transition-all ${
            isBuried ? 'text-[#0D9488]' : 'text-zinc-400 hover:text-[#0D9488]'
          }`}
        >
          <ArrowBigDown size={22} fill={isBuried ? '#0D9488' : 'none'} strokeWidth={2} />
        </button>

        {/* Comments */}
        <button
          onClick={() => navigate(`/post/${post.id}`)}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-foreground transition-all font-semibold text-sm"
        >
          <MessageSquare size={17} />
          <span>{post.replyCount}</span>
        </button>

        {/* Stash */}
        <button
          onClick={handleStash}
          data-testid="stash-button"
          className={`ml-auto flex items-center gap-1 font-semibold text-sm transition-all ${
            isStashed ? 'text-emerald-500' : 'text-zinc-400 hover:text-emerald-500'
          }`}
        >
          <Bookmark size={17} fill={isStashed ? '#10B981' : 'none'} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-zinc-400 hover:text-foreground transition-all"
        >
          <Share2 size={16} />
        </button>
      </div>
    </article>
  );
}
