import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Shield, ArrowLeft, Users, FileText, Star, Edit3, X, Check, Camera, Palette, Sparkles, Loader2 } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { SphereLogo } from '../components/SphereLogo';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

const BADGE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  verified_student: { label: 'Verified Student', emoji: '✓', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  first_post: { label: 'First Post', emoji: '📝', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
  boost_master: { label: '10 Boosts Received', emoji: '🔥', color: 'text-[#7C3AED] bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800' },
  sphere_keeper: { label: 'Sphere Keeper', emoji: '👑', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
};

// Static gradient banners
const STATIC_BANNER_PRESETS = [
  { label: 'Violet → Teal', value: 'from-violet-600 to-teal-600' },
  { label: 'Indigo → Sky', value: 'from-indigo-600 to-sky-500' },
  { label: 'Pink → Violet', value: 'from-pink-500 to-violet-600' },
  { label: 'Teal → Green', value: 'from-teal-500 to-green-600' },
  { label: 'Amber → Rose', value: 'from-amber-500 to-rose-600' },
  { label: 'Blue → Indigo', value: 'from-blue-500 to-indigo-700' },
  { label: 'Sky → Violet', value: 'from-sky-500 to-violet-600' },
  { label: 'Green → Teal', value: 'from-green-500 to-teal-600' },
];

// Animated banner presets
const ANIMATED_BANNER_PRESETS = [
  { label: '🌈 Rainbow', value: 'anim:rainbow', className: 'banner-anim-rainbow' },
  { label: '🌊 Ocean', value: 'anim:ocean', className: 'banner-anim-ocean' },
  { label: '🔮 Cosmic', value: 'anim:cosmic', className: 'banner-anim-cosmic' },
  { label: '🌅 Sunset', value: 'anim:sunset', className: 'banner-anim-sunset' },
  { label: '🌿 Forest', value: 'anim:forest', className: 'banner-anim-forest' },
  { label: '✨ Gold', value: 'anim:gold', className: 'banner-anim-gold' },
];

// Modern DiceBear styles
const AVATAR_STYLES = [
  { id: 'avataaars', label: 'Classic' },
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'bottts', label: 'Robot' },
  { id: 'fun-emoji', label: 'Emoji' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'notionists', label: 'Artist' },
  { id: 'pixel-art', label: 'Pixel' },
  { id: 'thumbs', label: 'Thumbs' },
  { id: 'shapes', label: 'Shapes' },
];

const AVATAR_SEEDS = ['aryan', 'priya', 'rahul', 'sneha', 'vikram', 'divya', 'max', 'luna', 'ash', 'nova', 'rex', 'zara'];
const AVATAR_BG = [
  'b6e3f4', 'ffd5dc', 'c0aede', 'ffdfbf', 'd1f4e0',
  'f4d4f4', 'c9e4f4', 'e4d4f4', 'fff0d4', 'd4f0e4',
  'f0d4f4', 'ffd4d4',
];

function getBannerClass(bannerColor: string) {
  if (bannerColor.startsWith('anim:')) {
    const name = bannerColor.slice(5);
    return `banner-anim-${name}`;
  }
  return `bg-gradient-to-br ${bannerColor}`;
}

function makeAvatarUrl(style: string, seed: string, bg: string) {
  return `https://api.dicebear.com/8.x/${style}/svg?seed=${seed}&backgroundColor=${bg}`;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, isLoggedIn, posts, logout, updateProfile } = useApp();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editBanner, setEditBanner] = useState('');
  const [editAvatarStyle, setEditAvatarStyle] = useState('avataaars');
  const [editAvatarSeed, setEditAvatarSeed] = useState('aryan');
  const [editAvatarBg, setEditAvatarBg] = useState('b6e3f4');
  const [bannerTab, setBannerTab] = useState<'static' | 'animated'>('static');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // *** FIX: use reactive currentUser when viewing own profile ***
  const targetUser = id
    ? (currentUser?.id === id ? currentUser : USERS.find(u => u.id === id))
    : currentUser;
  const isOwnProfile = !id || (currentUser && id === currentUser.id);

  if (!targetUser) {
    if (!isLoggedIn) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <SphereLogo size={56} className="mb-4 opacity-60" />
          <h2 className="font-black text-xl text-foreground mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Login to view profile</h2>
          <p className="text-zinc-500 text-sm font-semibold mb-6">Join SHUATSPHERE with your @shiats.edu.in email</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
          >
            Login
          </button>
        </div>
      );
    }
    return <div className="p-6 text-center font-bold text-zinc-500">User not found</div>;
  }

  const userPosts = posts.filter(p => p.authorId === targetUser.id);
  const bannerColor = targetUser.bannerColor || 'from-violet-600 to-teal-600';

  const openEdit = () => {
    setEditName(targetUser.name);
    setEditBio(targetUser.bio || '');
    setEditBanner(bannerColor);

    const urlStr = targetUser.avatar || '';
    const styleMatch = urlStr.match(/dicebear\.com\/8\.x\/([^/]+)\//);
    const seedMatch = urlStr.match(/seed=([^&]+)/);
    const bgMatch = urlStr.match(/backgroundColor=([^&]+)/);

    setEditAvatarStyle(styleMatch ? styleMatch[1] : 'avataaars');
    setEditAvatarSeed(seedMatch ? seedMatch[1] : 'aryan');
    setEditAvatarBg(bgMatch ? bgMatch[1] : 'b6e3f4');
    setBannerTab(bannerColor.startsWith('anim:') ? 'animated' : 'static');
    setHasChanges(false);
    setEditOpen(true);
  };

  const [autoSaved, setAutoSaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save on any field change
  const scheduleAutoSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      if (!isLoggedIn || !currentUser) return;
      setSaving(true);
      await updateProfile({
        name: editName.trim() || targetUser.name,
        bio: editBio.trim(),
        avatar: makeAvatarUrl(editAvatarStyle, editAvatarSeed, editAvatarBg),
        bannerColor: editBanner,
      });
      setSaving(false);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 1000); // Debounce 1 second
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleNameChange = (v: string) => { setEditName(v); scheduleAutoSave(); };
  const handleBioChange = (v: string) => { setEditBio(v); scheduleAutoSave(); };
  const handleBannerChange = (v: string) => { setEditBanner(v); scheduleAutoSave(); };
  const handleAvatarStyleChange = (v: string) => { setEditAvatarStyle(v); scheduleAutoSave(); };
  const handleAvatarSeedChange = (v: string) => { setEditAvatarSeed(v); scheduleAutoSave(); };
  const handleAvatarBgChange = (v: string) => { setEditAvatarBg(v); scheduleAutoSave(); };

  return (
    <div>
      {/* Back button if viewing other profile */}
      {id && (
        <div className="px-4 pt-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      )}

      {/* Profile card */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[4px_4px_0px_#18181B] dark:shadow-none overflow-hidden"
        >
          {/* Cover gradient banner */}
          <div className={`h-24 ${getBannerClass(bannerColor)} relative`}>
            {isOwnProfile && (
              <button
                onClick={openEdit}
                className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all"
                title="Edit profile"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-end justify-between -mt-10 mb-3">
              <div className="relative">
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-20 h-20 rounded-2xl border-4 border-white dark:border-[#15122A] shadow-lg bg-zinc-100"
                />
                {isOwnProfile && (
                  <button
                    onClick={openEdit}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#7C3AED] text-white shadow-md hover:bg-[#6D28D9] transition-all"
                    title="Change avatar"
                  >
                    <Camera size={11} />
                  </button>
                )}
              </div>
              {isOwnProfile ? (
                <div className="flex gap-2">
                  {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
                    <button
                      onClick={() => navigate('/admin-aura')}
                      className="px-3 py-1.5 rounded-xl text-xs font-black text-amber-600 border-2 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all flex items-center gap-1"
                    >
                      <Sparkles size={12} /> Admin
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 rounded-xl text-xs font-black text-red-500 border-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/compose-whisper?to=${targetUser.username}`)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-[#7C3AED] text-white border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none hover:bg-[#6D28D9] transition-all"
                >
                  Whisper
                </button>
              )}
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>{targetUser.name}</h1>
                {targetUser.isVerified && (
                  <span className="text-[10px] font-black text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">✓ VERIFIED</span>
                )}
              </div>
              <div className="text-sm text-zinc-500 font-semibold">@{targetUser.username}</div>
              {targetUser.tag && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
                  {targetUser.tag}
                </div>
              )}
              {targetUser.bio && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-2">{targetUser.bio}</p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 py-3 border-t-2 border-zinc-100 dark:border-zinc-700">
              <div className="text-center">
                <div className="font-black text-lg text-[#7C3AED] flex items-center justify-center gap-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <Sparkles size={15} />{targetUser.auraScore}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Aura</div>
              </div>
              <div className="text-center">
                <div className="font-black text-lg text-foreground flex items-center justify-center gap-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <FileText size={16} />{userPosts.length}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-black text-lg text-[#0D9488] flex items-center justify-center gap-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <Users size={16} />{targetUser.joinedSpheres.length}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Spheres</div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-zinc-500 font-semibold">
              <span className="flex items-center gap-1"><Calendar size={12} />Joined {new Date(targetUser.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Shield size={12} />{targetUser.branch} · Batch {targetUser.batch}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges */}
      {targetUser.badges.length > 0 && (
        <div className="px-4 pb-4">
          <h2 className="font-black text-sm uppercase tracking-wider text-foreground mb-2 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Star size={14} /> Badges
          </h2>
          <div className="flex flex-wrap gap-2">
            {targetUser.badges.map(badge => {
              const b = BADGE_CONFIG[badge];
              if (!b) return null;
              return (
                <span key={badge} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-black border-zinc-900 dark:border-zinc-700 shadow-[2px_2px_0px_#18181B] dark:shadow-none ${b.color}`}>
                  <span>{b.emoji}</span>
                  {b.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="px-4 pb-4">
        <h2 className="font-black text-sm uppercase tracking-wider text-foreground mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          📝 Posts ({userPosts.length})
        </h2>
        {userPosts.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 font-semibold text-sm">No posts yet</div>
        ) : (
          <div className="space-y-4">
            {userPosts.map(post => (
              <PostCard key={post.id} post={post} compact />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
              onClick={() => setEditOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-[9999] bg-white dark:bg-[#0D0B1A] rounded-t-3xl border-t-2 border-zinc-900 dark:border-zinc-700 overflow-hidden pb-32"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-zinc-900 dark:border-zinc-700">
                <h3 className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Edit Profile</h3>
                <button onClick={() => setEditOpen(false)} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[75vh] p-4 space-y-5">
                {/* Avatar live preview */}
                <div className="flex items-center gap-4">
                  <img
                    src={makeAvatarUrl(editAvatarStyle, editAvatarSeed, editAvatarBg)}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-zinc-100"
                  />
                  <div>
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-wider mb-1">Avatar Preview</p>
                    <p className="text-xs text-zinc-400 font-semibold">Pick style, seed & color below</p>
                  </div>
                </div>

                {/* Avatar Style */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block flex items-center gap-1">
                    <Camera size={12} /> Avatar Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => handleAvatarStyleChange(style.id)}
                        className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                          editAvatarStyle === style.id
                            ? 'border-[#7C3AED] bg-violet-50 dark:bg-violet-950/30 shadow-[2px_2px_0px_#7C3AED]'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-[#7C3AED]/50'
                        }`}
                      >
                        <img
                          src={makeAvatarUrl(style.id, editAvatarSeed, editAvatarBg)}
                          alt={style.label}
                          className="w-10 h-10 rounded-lg"
                        />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar seed */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Character Seed</label>
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_SEEDS.map(seed => (
                      <button
                        key={seed}
                        onClick={() => handleAvatarSeedChange(seed)}
                        className={`w-10 h-10 rounded-xl border-2 overflow-hidden transition-all ${
                          editAvatarSeed === seed ? 'border-[#7C3AED] shadow-[2px_2px_0px_#7C3AED]' : 'border-zinc-300 dark:border-zinc-600'
                        }`}
                      >
                        <img
                          src={makeAvatarUrl(editAvatarStyle, seed, editAvatarBg)}
                          alt={seed}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar BG color */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Avatar Background</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVATAR_BG.map(bg => (
                      <button
                        key={bg}
                        onClick={() => handleAvatarBgChange(bg)}
                        className={`w-9 h-9 rounded-xl border-2 transition-all ${
                          editAvatarBg === bg ? 'border-zinc-900 dark:border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: `#${bg}` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Banner picker */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block flex items-center gap-1">
                    <Palette size={12} /> Banner
                  </label>

                  {/* Tab switcher */}
                  <div className="flex rounded-xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden mb-3">
                    {(['static', 'animated'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setBannerTab(tab)}
                        className={`flex-1 py-1.5 text-xs font-black transition-all ${
                          bannerTab === tab
                            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                            : 'bg-white dark:bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {tab === 'static' ? 'Static' : '✨ Animated'}
                      </button>
                    ))}
                  </div>

                  {bannerTab === 'static' && (
                    <div className="grid grid-cols-2 gap-2">
                      {STATIC_BANNER_PRESETS.map(preset => (
                        <button
                          key={preset.value}
                          onClick={() => handleBannerChange(preset.value)}
                          className={`h-12 rounded-xl bg-gradient-to-r ${preset.value} border-2 transition-all flex items-center justify-center ${
                            editBanner === preset.value
                              ? 'border-zinc-900 shadow-[2px_2px_0px_#7C3AED]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          {editBanner === preset.value && <Check size={18} className="text-white drop-shadow" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {bannerTab === 'animated' && (
                    <div className="grid grid-cols-2 gap-2">
                      {ANIMATED_BANNER_PRESETS.map(preset => (
                        <button
                          key={preset.value}
                          onClick={() => handleBannerChange(preset.value)}
                          className={`h-12 rounded-xl ${preset.className} border-2 transition-all flex items-center justify-center gap-2 ${
                            editBanner === preset.value
                              ? 'border-zinc-900 shadow-[2px_2px_0px_#7C3AED]'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          {editBanner === preset.value && <Check size={14} className="text-white drop-shadow" />}
                          <span className="text-white text-[10px] font-black drop-shadow">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => handleNameChange(e.target.value)}
                    maxLength={50}
                    className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={e => handleBioChange(e.target.value)}
                    maxLength={160}
                    rows={3}
                    placeholder="Tell others about yourself..."
                    className="w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all resize-none shadow-[2px_2px_0px_#18181B] dark:shadow-none"
                  />
                  <div className="text-right text-[10px] text-zinc-400 mt-1 font-semibold">{editBio.length}/160</div>
                </div>
                
                {/* Saving indicator */}
                {saving && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-violet-600">
                    <Loader2 size={14} className="animate-spin" /> Saving...
                  </div>
                )}
                {autoSaved && !saving && (
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-600">
                    <Check size={14} /> Saved!
                  </div>
                )}
              </div>

              {/* Save button - auto-saves on any change, just for close */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={() => { setEditOpen(false); }}
                  disabled={saving}
                  className="w-full py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Check size={16} /> Done</>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
