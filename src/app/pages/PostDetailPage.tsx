import { useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowBigUp, ArrowBigDown, MessageSquare, Bookmark, Share2,
  ArrowLeft, Send, ExternalLink, Trash2, Flag, MoreVertical,
  CornerDownRight, TrendingUp, Clock, ChevronDown, ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS, REPLIES, Reply } from '../data/mockData';
import { copyToClipboard } from '../utils/clipboard';

function timeAgo(d: string) {
  const diff = (Date.now() - new Date(d).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── CommentCard ────────────────────────────────────────────────────────────────
interface CommentCardProps {
  comment: Reply;
  depth: number;
  allReplies: Reply[];
  commentVotes: Record<string, 'up' | 'down'>;
  onVote: (id: string, dir: 'up' | 'down') => void;
  getScore: (c: Reply) => number;
  canDelete: (authorId: string) => boolean;
  onDelete: (id: string) => void;
  reportedSet: Set<string>;
  onReport: (id: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  replyTexts: Record<string, string>;
  setReplyTexts: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  onNestedReply: (parentId: string) => void;
  currentUser: typeof USERS[0] | null;
  isLoggedIn: boolean;
  postAuthorId: string;
  isKeeper: boolean;
  navigate: (to: string | number) => void;
}

function CommentCard({
  comment, depth, allReplies, commentVotes, onVote, getScore,
  canDelete, onDelete, reportedSet, onReport, replyingTo, setReplyingTo,
  replyTexts, setReplyTexts, onNestedReply, currentUser, isLoggedIn,
  postAuthorId, isKeeper, navigate,
}: CommentCardProps) {
  const author = USERS.find(u => u.id === comment.authorId);
  const score = getScore(comment);
  const isBoosted = commentVotes[comment.id] === 'up';
  const isBuried = commentVotes[comment.id] === 'down';
  const isReported = reportedSet.has(comment.id);
  const isPostAuthor = comment.authorId === postAuthorId;

  // Children of this comment, sorted by score
  const children = allReplies
    .filter(r => r.parentId === comment.id)
    .sort((a, b) => getScore(b) - getScore(a));

  const [collapsed, setCollapsed] = useState(false);

  const replyText = replyTexts[comment.id] || '';

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-zinc-200 dark:border-zinc-700 pl-3 mt-2' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-3 border ${
          isReported && (canDelete(comment.authorId))
            ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20'
            : depth === 0
              ? 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-[#1E1A35]/50'
              : 'border-transparent bg-transparent'
        }`}
      >
        {/* Author row */}
        <div className="flex items-start gap-2">
          {author && (
            <button onClick={() => navigate(`/profile/${author.id}`)}>
              <img
                src={author.avatar}
                alt={author.name}
                className="w-7 h-7 rounded-lg border-2 border-zinc-200 dark:border-zinc-600 shrink-0"
              />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-1.5 mb-1">
              <button
                onClick={() => navigate(`/profile/${author?.id}`)}
                className="text-xs font-black text-foreground hover:text-[#7C3AED] transition-colors"
              >
                {author?.name}
              </button>
              {author?.isVerified && (
                <span className="text-[9px] font-black text-[#0D9488] bg-[#0D9488]/10 px-1 py-0.5 rounded-full border border-[#0D9488]/20">✓</span>
              )}
              {isPostAuthor && (
                <span className="text-[9px] font-black text-[#7C3AED] bg-[#7C3AED]/10 px-1.5 py-0.5 rounded-full border border-[#7C3AED]/20">OP</span>
              )}
              {isKeeper && comment.authorId === currentUser?.id && (
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                  <ShieldCheck size={8} /> MOD
                </span>
              )}
              <span className="text-[10px] text-zinc-400 font-semibold">{timeAgo(comment.createdAt)}</span>
              {isReported && (
                <span className="text-[9px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full border border-amber-200">⚑ Reported</span>
              )}
            </div>

            {/* Content */}
            {!collapsed && (
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed mb-2">
                {comment.content}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Boost */}
              <button
                onClick={() => onVote(comment.id, 'up')}
                className={`flex items-center gap-1 text-xs font-black transition-all ${
                  isBoosted ? 'text-[#7C3AED]' : 'text-zinc-400 hover:text-[#7C3AED]'
                }`}
              >
                <ArrowBigUp size={15} fill={isBoosted ? '#7C3AED' : 'none'} strokeWidth={2} />
                <span>{Math.max(0, score)}</span>
              </button>

              {/* Bury */}
              <button
                onClick={() => onVote(comment.id, 'down')}
                className={`flex items-center gap-1 text-xs font-black transition-all ${
                  isBuried ? 'text-[#0D9488]' : 'text-zinc-400 hover:text-[#0D9488]'
                }`}
              >
                <ArrowBigDown size={15} fill={isBuried ? '#0D9488' : 'none'} strokeWidth={2} />
              </button>

              {/* Reply (max 2 levels) */}
              {isLoggedIn && depth < 2 && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-[#7C3AED] transition-colors"
                >
                  <CornerDownRight size={12} />
                  Reply
                </button>
              )}

              {/* Collapse toggle for parent comments */}
              {children.length > 0 && (
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-foreground transition-colors"
                >
                  {collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  {collapsed ? `${children.length} replies` : 'Collapse'}
                </button>
              )}

              {/* Delete */}
              {canDelete(comment.authorId) && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors ml-auto"
                >
                  <Trash2 size={11} /> Delete
                </button>
              )}

              {/* Report */}
              {!canDelete(comment.authorId) && isLoggedIn && !isReported && (
                <button
                  onClick={() => onReport(comment.id)}
                  className="flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-amber-500 transition-colors ml-auto"
                >
                  <Flag size={11} /> Report
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inline reply form */}
        <AnimatePresence>
          {replyingTo === comment.id && isLoggedIn && currentUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 ml-9 flex gap-2"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0 mt-1"
              />
              <div className="flex-1 space-y-2">
                <textarea
                  value={replyText}
                  onChange={e => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                  placeholder={`Reply to ${author?.name}…`}
                  rows={2}
                  autoFocus
                  className="w-full text-sm border-2 border-zinc-900 dark:border-zinc-700 rounded-xl p-2.5 focus:outline-none focus:border-[#7C3AED] resize-none bg-white dark:bg-[#1E1A35] transition-all"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onNestedReply(comment.id)}
                    disabled={!replyText.trim()}
                    className="px-3 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-black border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none disabled:opacity-40 transition-all"
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-500 hover:text-foreground transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Nested replies */}
      {!collapsed && children.length > 0 && (
        <div className="space-y-1">
          {children.map(child => (
            <CommentCard
              key={child.id}
              comment={child}
              depth={depth + 1}
              allReplies={allReplies}
              commentVotes={commentVotes}
              onVote={onVote}
              getScore={getScore}
              canDelete={canDelete}
              onDelete={onDelete}
              reportedSet={reportedSet}
              onReport={onReport}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyTexts={replyTexts}
              setReplyTexts={setReplyTexts}
              onNestedReply={onNestedReply}
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
              postAuthorId={postAuthorId}
              isKeeper={isKeeper}
              navigate={navigate as any}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PostDetailPage ──────────────────────────────────────────────────────────────
export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    posts, boostedPosts, buriedPosts, stashedPosts,
    toggleBoost, toggleBury, toggleStash,
    isLoggedIn, currentUser, deletePost, spheres, refreshPosts,
  } = useApp();

  const [replyText, setReplyText] = useState('');
  const [localReplies, setLocalReplies] = useState<Reply[]>(
    () => REPLIES.filter(r => r.postId === id)
  );
  const [submitting, setSubmitting] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  // Comment system
  const [commentVotes, setCommentVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [commentSort, setCommentSort] = useState<'top' | 'new'>('top');
  const [reportedComments, setReportedComments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(!posts.find(p => p.id === id));
  const [apiPost, setApiPost] = useState<typeof posts[0] | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const found = posts.find(p => p.id === id);
      if (found) {
        setApiPost(found);
        setLoading(false);
        return;
      }

      setLoading(true);
      await refreshPosts(); // Try refreshing first
      // The effect will re-run when 'posts' changes, so we don't need to do more here
      setLoading(false);
    };
    fetchPost();
  }, [id, posts]);

  const post = apiPost;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-bold text-sm">Finding post in the sphere...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16 p-4">
        <span className="text-5xl block mb-4">📭</span>
        <h2 className="font-black text-foreground text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Post not found</h2>
        <p className="text-zinc-500 text-sm font-semibold mt-1">This post might have been buried or deleted.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] active:translate-y-0.5 transition-all">
          Back to Feed
        </button>
      </div>
    );
  }

  const author = USERS.find(u => u.id === post.authorId);
  const currentSphere = spheres.find(s => s.slug === post.sphereSlug);
  const isKeeper = !!currentUser && !!currentSphere && currentSphere.keeper === currentUser.id;

  const isBoosted = boostedPosts.has(post.id);
  const isBuried = buriedPosts.has(post.id);
  const isStashed = stashedPosts.has(post.id);
  const score = post.boosts - post.buries + (isBoosted ? 1 : 0) - (isBuried ? 1 : 0);
  const isOwn = isLoggedIn && currentUser?.id === post.authorId;

  // Comment helpers
  const voteComment = (commentId: string, dir: 'up' | 'down') => {
    if (!isLoggedIn) { navigate('/login'); return; }
    setCommentVotes(prev => {
      const next = { ...prev };
      if (next[commentId] === dir) delete next[commentId];
      else next[commentId] = dir;
      return next;
    });
  };

  const getCommentScore = (c: Reply) => {
    const v = commentVotes[c.id];
    return c.boosts + (v === 'up' ? 1 : v === 'down' ? -1 : 0);
  };

  const canDeleteComment = (authorId: string) => {
    if (!isLoggedIn || !currentUser) return false;
    return (
      authorId === currentUser.id ||
      post.authorId === currentUser.id ||
      isKeeper
    );
  };

  const deleteComment = (commentId: string) => {
    if (window.confirm('Delete this comment? All replies to it will also be removed.')) {
      // Remove comment and its children recursively
      const toRemove = new Set<string>([commentId]);
      let changed = true;
      while (changed) {
        changed = false;
        localReplies.forEach(r => {
          if (r.parentId && toRemove.has(r.parentId) && !toRemove.has(r.id)) {
            toRemove.add(r.id);
            changed = true;
          }
        });
      }
      setLocalReplies(prev => prev.filter(r => !toRemove.has(r.id)));
    }
  };

  const reportComment = (commentId: string) => {
    setReportedComments(prev => new Set([...prev, commentId]));
  };

  const submitNestedReply = (parentId: string) => {
    const text = replyTexts[parentId]?.trim();
    if (!text || !currentUser) return;
    setLocalReplies(prev => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        postId: post.id,
        parentId,
        content: text,
        authorId: currentUser.id,
        boosts: 0,
        buries: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
    setReplyTexts(prev => ({ ...prev, [parentId]: '' }));
    setReplyingTo(null);
  };

  const handleSubmitReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !isLoggedIn || !currentUser) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    setLocalReplies(prev => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        postId: post.id,
        content: replyText.trim(),
        authorId: currentUser.id,
        boosts: 0,
        buries: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
    setReplyText('');
    setSubmitting(false);
  };

  const handleShare = () => {
    copyToClipboard(window.location.href);
    setShareMsg('Link copied!');
    setTimeout(() => setShareMsg(''), 2000);
  };

  const handleDeletePost = () => {
    if (window.confirm('Delete this post? This cannot be undone.')) {
      deletePost(post.id);
      navigate(-1);
    }
    setMenuOpen(false);
  };

  // Sorted top-level comments
  const topLevelComments = localReplies
    .filter(r => !r.parentId)
    .sort(
      commentSort === 'top'
        ? (a, b) => getCommentScore(b) - getCommentScore(a)
        : (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const totalComments = localReplies.length;

  return (
    <div>
      {/* Back + Post menu */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-2 rounded-xl text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 min-w-[150px] bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-xl shadow-[4px_4px_0px_#18181B] dark:shadow-lg overflow-hidden">
              {isOwn && (
                <button
                  onClick={handleDeletePost}
                  className="w-full flex items-center gap-2 px-3 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 size={15} /> Delete Post
                </button>
              )}
              {!isOwn && (
                <button
                  onClick={() => { setReportDone(true); setMenuOpen(false); setTimeout(() => setReportDone(false), 4000); }}
                  className="w-full flex items-center gap-2 px-3 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                >
                  <Flag size={15} /> {reportDone ? 'Reported ✓' : 'Report Post'}
                </button>
              )}
              <button
                onClick={() => { handleShare(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
              >
                <Share2 size={15} /> Share Link
              </button>
            </div>
          )}
        </div>
      </div>

      {reportDone && (
        <div className="mx-4 mt-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-700 text-sm font-bold">
          ✓ Post reported — our moderation team will review it
        </div>
      )}

      {/* Post card */}
      <div className="p-4">
        <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[4px_4px_0px_#18181B] dark:shadow-none p-4 space-y-3">
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/sphere/${post.sphereSlug}`)}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 text-xs font-black uppercase tracking-wider text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all"
            >
              s/{post.sphereSlug}
            </button>
            <span className="text-xs text-zinc-400 font-semibold">{timeAgo(post.createdAt)}</span>
            {post.flair && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#0D9488]/10 border border-[#0D9488]/20 text-[#0D9488] text-[10px] font-black uppercase tracking-wider">
                {post.flair}
              </span>
            )}
            {isKeeper && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-600 text-[10px] font-black">
                <ShieldCheck size={9} /> MOD
              </span>
            )}
          </div>

          {/* Author */}
          {author && (
            <button onClick={() => navigate(`/profile/${author.id}`)} className="flex items-center gap-2 group">
              <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-xl border-2 border-zinc-900 dark:border-zinc-700" />
              <div>
                <div className="text-xs font-black text-foreground group-hover:text-[#7C3AED] transition-colors">{author.name}</div>
                <div className="text-[10px] text-zinc-500 font-semibold">@{author.username} · {author.tag}</div>
              </div>
              {author.isVerified && (
                <span className="text-[10px] font-black text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">✓</span>
              )}
            </button>
          )}

          {/* Title */}
          <h1 className="font-black text-xl text-foreground leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{post.title}</h1>

          {/* Content */}
          {post.content && post.type === 'text' && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{post.content}</p>
          )}
          {post.type === 'image' && post.imageUrl && (
            <div className="rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
              <img src={post.imageUrl} alt={post.title} className="w-full object-cover" />
            </div>
          )}
          {post.type === 'link' && post.linkUrl && (
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-[#0D9488] transition-colors"
            >
              <ExternalLink size={14} className="text-[#0D9488] shrink-0" />
              <span className="text-xs text-[#0D9488] font-semibold truncate">{post.linkUrl}</span>
            </a>
          )}

          {/* Actions bar */}
          <div className="flex items-center gap-4 pt-3 border-t-2 border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => isLoggedIn ? toggleBoost(post.id) : navigate('/login')}
              data-testid="boost-button"
              className={`flex items-center gap-1.5 font-black text-sm transition-all ${isBoosted ? 'text-[#7C3AED]' : 'text-zinc-400 hover:text-[#7C3AED]'}`}
            >
              <ArrowBigUp size={24} fill={isBoosted ? '#7C3AED' : 'none'} />
              <span>{Math.max(0, score)}</span>
            </button>
            <button
              onClick={() => isLoggedIn ? toggleBury(post.id) : navigate('/login')}
              data-testid="bury-button"
              className={`flex items-center gap-1 font-black text-sm transition-all ${isBuried ? 'text-[#0D9488]' : 'text-zinc-400 hover:text-[#0D9488]'}`}
            >
              <ArrowBigDown size={24} fill={isBuried ? '#0D9488' : 'none'} />
            </button>
            <span className="flex items-center gap-1.5 text-zinc-400 font-semibold text-sm">
              <MessageSquare size={17} />
              {totalComments}
            </span>
            <button
              onClick={() => isLoggedIn ? toggleStash(post.id) : navigate('/login')}
              data-testid="stash-button"
              className={`ml-auto transition-all ${isStashed ? 'text-emerald-500' : 'text-zinc-400 hover:text-emerald-500'}`}
            >
              <Bookmark size={18} fill={isStashed ? '#10B981' : 'none'} />
            </button>
            <button onClick={handleShare} className="text-zinc-400 hover:text-foreground transition-all relative">
              <Share2 size={17} />
              {shareMsg && (
                <span className="absolute -top-7 -right-2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-lg font-bold whitespace-nowrap">
                  {shareMsg}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* New comment input */}
      <div className="px-4 pb-4">
        {isLoggedIn ? (
          <form onSubmit={handleSubmitReply} className="flex items-start gap-3">
            {currentUser && (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shrink-0 mt-1"
              />
            )}
            <div className="flex-1 relative">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a comment…"
                rows={2}
                className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#7C3AED] transition-all resize-none shadow-[2px_2px_0px_#18181B] dark:shadow-none focus:shadow-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim() || submitting}
                className="absolute right-3 bottom-3 p-1.5 rounded-xl bg-[#7C3AED] text-white disabled:opacity-40 hover:bg-[#6D28D9] transition-all"
              >
                {submitting
                  ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
                  : <Send size={14} />
                }
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 text-sm font-bold hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all"
          >
            Login to comment
          </button>
        )}
      </div>

      {/* Comment sort controls */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <h2 className="font-black text-sm uppercase tracking-wider text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Comments ({totalComments})
        </h2>
        <div className="flex rounded-xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden">
          {([
            { key: 'top', label: 'Top', icon: TrendingUp },
            { key: 'new', label: 'New', icon: Clock },
          ] as const).map(opt => (
            <button
              key={opt.key}
              onClick={() => setCommentSort(opt.key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-black transition-all ${
                commentSort === opt.key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:text-foreground'
              }`}
            >
              <opt.icon size={11} /> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments tree */}
      <div className="px-4 pb-8 space-y-3">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 font-semibold text-sm">
            No comments yet. Be the first! 💬
          </div>
        ) : (
          topLevelComments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              depth={0}
              allReplies={localReplies}
              commentVotes={commentVotes}
              onVote={voteComment}
              getScore={getCommentScore}
              canDelete={canDeleteComment}
              onDelete={deleteComment}
              reportedSet={reportedComments}
              onReport={reportComment}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyTexts={replyTexts}
              setReplyTexts={setReplyTexts}
              onNestedReply={submitNestedReply}
              currentUser={currentUser}
              isLoggedIn={isLoggedIn}
              postAuthorId={post.authorId}
              isKeeper={isKeeper}
              navigate={navigate as any}
            />
          ))
        )}
      </div>
    </div>
  );
}
