import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Users, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { PostCard } from '../components/PostCard';
import { useApp } from '../context/AppContext';

export function SearchPage() {
  const navigate = useNavigate();
  const { posts, spheres } = useApp();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'posts' | 'spheres'>('posts');

  // Auto-switch to spheres tab when "s/" is typed
  useEffect(() => {
    if (query.toLowerCase().startsWith('s/')) {
      setTab('spheres');
    }
  }, [query]);

  // Compute effective search term
  const isSpherePrefix = query.toLowerCase().startsWith('s/');
  const sphereSearchTerm = isSpherePrefix ? query.slice(2).toLowerCase().trim() : query.toLowerCase().trim();
  const q = query.toLowerCase().trim();

  const filteredPosts = useMemo(() =>
    q && !isSpherePrefix
      ? posts.filter(p => p.title.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q))
      : [],
    [posts, q, isSpherePrefix]
  );

  const filteredSpheres = useMemo(() => {
    if (isSpherePrefix) {
      // "s/" shows ALL spheres, "s/cse" filters by "cse"
      return sphereSearchTerm.length === 0
        ? spheres
        : spheres.filter(s =>
            s.name.toLowerCase().includes(sphereSearchTerm) ||
            s.slug.includes(sphereSearchTerm) ||
            s.description.toLowerCase().includes(sphereSearchTerm)
          );
    }
    return q
      ? spheres.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.slug.includes(q)
        )
      : [];
  }, [spheres, q, isSpherePrefix, sphereSearchTerm]);

  const hasQuery = q.length > 0;

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="font-black text-2xl text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Search 🔍</h1>

      {/* Search box */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search posts, spheres… or type s/ for all spheres"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
          className="w-full bg-white dark:bg-[#15122A] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[3px_3px_0px_#18181B] dark:shadow-none focus:shadow-none"
        />
      </div>

      {/* "s/" tip */}
      {!hasQuery && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/30">
          <span className="text-[#7C3AED] font-black text-sm">s/</span>
          <span className="text-xs text-zinc-500 font-semibold">Type <strong>s/</strong> to list all spheres, or <strong>s/cse</strong> to filter</span>
        </div>
      )}

      {hasQuery && (
        <>
          {/* Tabs */}
          {!isSpherePrefix && (
            <div className="flex rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden">
              {([
                { key: 'posts', label: 'Posts', icon: FileText, count: filteredPosts.length },
                { key: 'spheres', label: 'Spheres', icon: Users, count: filteredSpheres.length },
              ] as const).map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black transition-all ${
                    tab === t.key
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:text-foreground'
                  }`}
                >
                  <t.icon size={15} />
                  {t.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
                    tab === t.key ? 'bg-white/20 dark:bg-black/20' : 'bg-zinc-100 dark:bg-zinc-800'
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Sphere prefix header */}
          {isSpherePrefix && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-[#7C3AED]">
                {sphereSearchTerm ? `s/${sphereSearchTerm} — ${filteredSpheres.length} found` : `All Spheres (${filteredSpheres.length})`}
              </span>
            </div>
          )}

          {/* Post results */}
          {tab === 'posts' && !isSpherePrefix && (
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-3">📭</span>
                  <p className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>No posts found</p>
                  <p className="text-zinc-500 text-sm font-semibold mt-1">Try different keywords</p>
                </div>
              ) : (
                filteredPosts.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <PostCard post={post} compact />
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Sphere results */}
          {(tab === 'spheres' || isSpherePrefix) && (
            <div className="space-y-3">
              {filteredSpheres.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-3">🌐</span>
                  <p className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>No spheres found</p>
                </div>
              ) : (
                filteredSpheres.map((sphere, i) => (
                  <motion.button
                    key={sphere.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/sphere/${sphere.slug}`)}
                    className="w-full flex items-start gap-3 p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[3px_3px_0px_#18181B] dark:shadow-none hover:border-[#7C3AED] active:translate-y-0.5 active:shadow-none transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sphere.coverColor} flex items-center justify-center text-xl shrink-0`}>
                      {sphere.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-[#7C3AED] text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>s/{sphere.slug}</div>
                      <div className="text-sm font-bold text-foreground">{sphere.name}</div>
                      <div className="text-xs text-zinc-500 font-semibold mt-0.5 line-clamp-2">{sphere.description}</div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1"><Users size={10} />{sphere.memberCount}</span>
                        <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1"><FileText size={10} />{sphere.postCount}</span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">{sphere.category}</span>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Empty state with suggestions */}
      {!hasQuery && (
        <div className="text-center py-8">
          <Search size={48} className="text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
          <p className="font-black text-foreground text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Search SHUATSPHERE</p>
          <p className="text-zinc-500 text-sm font-semibold mt-1">Find posts, spheres & discussions</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['s/', 's/cse', 'DSA', 'Cricket', 'Hostel', 'Events', 'Notices', 'Placement'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`px-3 py-1.5 rounded-full border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] text-xs font-black uppercase tracking-wider hover:bg-[#7C3AED]/10 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none ${
                  tag.startsWith('s/') ? 'text-[#7C3AED] border-[#7C3AED]/30 bg-violet-50 dark:bg-violet-950/20' : ''
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
