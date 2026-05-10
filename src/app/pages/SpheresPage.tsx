import { useState, useMemo, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, FileText, Plus, ChevronRight, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sphere } from '../data/mockData';

const CATEGORIES = ['All', 'Academics', 'Sports', 'Campus Life', 'Events', 'Career', 'Official'];

const EMOJI_PRESETS = [
  '💻', '🎓', '🧩', '🏏', '🏠', '📚', '📢', '🎉', '🍱', '💼',
  '🖥️', '🌾', '🔬', '🎨', '🎵', '🏃', '🌿', '💡', '🛡️', '⚡',
  '🤝', '🎯', '📱', '🌍', '🔥', '✨', '🎪', '🧪', '📊', '🎭',
];

const COLOR_PRESETS = [
  { label: 'Violet → Purple', value: 'from-violet-600 to-purple-800' },
  { label: 'Blue → Cyan', value: 'from-blue-600 to-cyan-700' },
  { label: 'Green → Emerald', value: 'from-green-600 to-emerald-800' },
  { label: 'Orange → Red', value: 'from-orange-500 to-red-600' },
  { label: 'Yellow → Amber', value: 'from-yellow-500 to-amber-700' },
  { label: 'Teal → Cyan', value: 'from-teal-600 to-cyan-800' },
  { label: 'Red → Rose', value: 'from-red-500 to-rose-700' },
  { label: 'Pink → Purple', value: 'from-pink-500 to-purple-600' },
  { label: 'Lime → Green', value: 'from-lime-500 to-green-700' },
  { label: 'Slate → Gray', value: 'from-slate-600 to-gray-800' },
  { label: 'Indigo → Blue', value: 'from-indigo-600 to-blue-800' },
  { label: 'Sky → Teal', value: 'from-sky-500 to-teal-600' },
];

const SPHERE_CATEGORIES = ['Academics', 'Sports', 'Campus Life', 'Events', 'Career', 'Official', 'Social', 'Technology', 'Arts'];

export function SpheresPage() {
  const navigate = useNavigate();
  const { joinedSpheres, toggleJoinSphere, isLoggedIn, spheres, createSphere, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Create sphere modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('🌐');
  const [newColor, setNewColor] = useState('from-violet-600 to-purple-800');
  const [newCategory, setNewCategory] = useState('Academics');
  const [newSlug, setNewSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  const openCreateModal = () => {
    setFormChanged(false);
    setShowCreate(true);
  };

  const filtered = useMemo(() => {
    return spheres.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || s.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category, spheres]);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);

  const handleNameChange = (v: string) => {
    setNewName(v);
    setNewSlug(autoSlug(v));
    setFormChanged(true);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    const existingSlug = spheres.find(s => s.slug === newSlug);
    if (existingSlug) {
      alert('A sphere with this slug already exists. Please choose a different name.');
      return;
    }

    setCreating(true);

    const newSphere: Omit<Sphere, 'id' | 'memberCount' | 'postCount' | 'createdAt' | 'createdBy'> = {
      name: newName.trim(),
      slug: newSlug.trim(),
      description: newDesc.trim() || `Welcome to s/${newSlug}!`,
      icon: newIcon,
      coverColor: newColor,
      isPrivate: false,
      category: newCategory,
      tags: [newName.trim()],
      keeper: currentUser?.id || 'user1',
    };

    await createSphere(newSphere);
    setCreating(false);
    setCreateSuccess(true);

    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      setNewIcon('🌐');
      setNewColor('from-violet-600 to-purple-800');
      setNewCategory('Academics');
      setNewSlug('');
      setFormChanged(false);
      navigate(`/sphere/${newSlug}`);
    }, 1200);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="font-black text-2xl text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Spheres 🌐</h1>
        <p className="text-sm text-zinc-500 font-semibold mt-0.5">SHUATS communities</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search spheres..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#15122A] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none focus:shadow-none"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all ${
              category === cat
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-[2px_2px_0px_#7C3AED]'
                : 'bg-white dark:bg-[#15122A] text-zinc-600 dark:text-zinc-300 border-zinc-900 dark:border-zinc-700 hover:border-[#7C3AED] hover:text-[#7C3AED]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Create sphere CTA */}
      {isLoggedIn && (
        <button
          onClick={openCreateModal}
          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-[#7C3AED] bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
              <Plus size={20} className="text-[#7C3AED]" />
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-[#7C3AED]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Create a Sphere
              </div>
              <div className="text-xs text-zinc-500 font-semibold">Start your own community</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#7C3AED] group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Sphere grid */}
      <div className="space-y-3">
        {filtered.map((sphere, i) => {
          const isJoined = joinedSpheres.has(sphere.slug);
          return (
            <motion.div
              key={sphere.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[4px_4px_0px_#18181B] dark:shadow-none overflow-hidden"
            >
              {/* Color bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${sphere.coverColor}`} />

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => navigate(`/sphere/${sphere.slug}`)}
                    className="flex items-start gap-3 flex-1 min-w-0 text-left group"
                  >
                    <span className="text-2xl shrink-0">{sphere.icon}</span>
                    <div className="min-w-0">
                      <div className="font-black text-foreground text-sm group-hover:text-[#7C3AED] transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        s/{sphere.slug}
                      </div>
                      <div className="font-bold text-foreground text-sm">{sphere.name}</div>
                      <div className="text-xs text-zinc-500 font-semibold mt-0.5 line-clamp-2">{sphere.description}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                          <Users size={10} /> {sphere.memberCount.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                          <FileText size={10} /> {sphere.postCount.toLocaleString()} posts
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">
                          {sphere.category}
                        </span>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => isLoggedIn ? toggleJoinSphere(sphere.slug) : navigate('/login')}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-black border-2 transition-all active:translate-y-0.5 ${
                      isJoined
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:shadow-none'
                        : 'bg-[#7C3AED] text-white border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:shadow-none hover:bg-[#6D28D9]'
                    }`}
                  >
                    {isJoined ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">🌐</span>
            <p className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>No spheres found</p>
            <p className="text-zinc-500 text-sm font-semibold mt-1">Try a different search or category</p>
          </div>
        )}
      </div>

      {/* Create Sphere Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreate(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[9999] bg-white dark:bg-[#0D0B1A] rounded-t-3xl border-t-2 border-zinc-900 dark:border-zinc-700 overflow-hidden pb-32"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-zinc-900 dark:border-zinc-700">
                <h3 className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Create a Sphere 🌐
                </h3>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="overflow-y-auto max-h-[70vh] p-4 space-y-5">
                {/* Preview */}
                <div className={`h-16 rounded-2xl bg-gradient-to-r ${newColor} flex items-center px-4 gap-3 border-2 border-zinc-900 dark:border-zinc-700`}>
                  <span className="text-3xl">{newIcon}</span>
                  <div>
                    <div className="font-black text-white text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {newName || 'Sphere Name'}
                    </div>
                    <div className="text-white/70 text-xs font-semibold">s/{newSlug || 'sphere-slug'}</div>
                  </div>
                </div>

                {/* Icon picker */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_PRESETS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => { setNewIcon(emoji); setFormChanged(true); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border-2 transition-all ${
                          newIcon === emoji
                            ? 'border-[#7C3AED] bg-violet-50 dark:bg-violet-950/30 shadow-[2px_2px_0px_#7C3AED]'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-[#7C3AED]/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Cover Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => { setNewColor(preset.value); setFormChanged(true); }}
                        className={`h-10 rounded-xl bg-gradient-to-r ${preset.value} border-2 flex items-center justify-center transition-all ${
                          newColor === preset.value
                            ? 'border-zinc-900 shadow-[2px_2px_0px_#7C3AED]'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        {newColor === preset.value && <Check size={14} className="text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">
                    Sphere Name *
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="e.g. Robotics Club"
                    maxLength={50}
                    required
                    className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">
                    Slug (URL) *
                  </label>
                  <div className="flex items-center rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#1E1A35] shadow-[2px_2px_0px_#18181B] dark:shadow-none overflow-hidden focus-within:border-[#7C3AED] transition-all">
                    <span className="pl-4 pr-1 text-sm text-zinc-400 font-black shrink-0">s/</span>
                    <input
                      type="text"
                      value={newSlug}
                      onChange={e => { setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setFormChanged(true); }}
                      placeholder="my-sphere"
                      maxLength={30}
                      required
                      className="flex-1 py-3 pr-4 text-sm bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={e => { setNewDesc(e.target.value); setFormChanged(true); }}
                    placeholder="What is this sphere about?"
                    maxLength={200}
                    rows={3}
                    className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all resize-none shadow-[2px_2px_0px_#18181B] dark:shadow-none"
                  />
                  <div className="text-right text-[10px] text-zinc-400 mt-1 font-semibold">{newDesc.length}/200</div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => { setNewCategory(e.target.value); setFormChanged(true); }}
                    className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all cursor-pointer shadow-[2px_2px_0px_#18181B] dark:shadow-none"
                  >
                    {SPHERE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Submit */}
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={!newName.trim() || !newSlug.trim() || creating || createSuccess}
                    className="w-full py-3 rounded-2xl font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 bg-[#7C3AED] text-white"
                  >
                    {createSuccess ? (
                      <>
                        <Check size={18} /> Sphere Created!
                      </>
                    ) : creating ? (
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus size={18} /> Create Sphere
                      </>
                    )}
                  </button>
                  {!formChanged && newName.trim() && (
                    <p className="text-center text-xs text-zinc-500 font-semibold">
                      Fill in the details and tap Create to make your sphere
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
