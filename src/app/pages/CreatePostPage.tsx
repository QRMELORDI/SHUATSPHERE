import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Type, Image, Link as LinkIcon, Lock, Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const POST_TYPES = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'image', label: 'Photo', icon: Image },
  { id: 'link', label: 'Link', icon: LinkIcon },
] as const;

export function CreatePostPage() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, addPost, joinedSpheres, toggleJoinSphere, spheres } = useApp();
  const [type, setType] = useState<'text' | 'image' | 'link'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageData, setImageData] = useState(''); // base64 data URL
  const [imageError, setImageError] = useState('');
  const [sphereSlug, setSphereSlug] = useState('');
  const [flair, setFlair] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Lock size={40} className="text-zinc-400 mb-4" />
        <h2 className="font-black text-xl text-foreground mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Login to post</h2>
        <p className="text-zinc-500 text-sm font-semibold mb-6">Only verified SHUATS students can post</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
        >
          Login
        </button>
      </div>
    );
  }

  const availableSpheres = spheres;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, GIF, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be smaller than 5 MB.');
      return;
    }
    setImageError('');
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sphereSlug) return;
    if (type === 'image' && !imageData) return;
    setSubmitting(true);

    // Auto-join sphere if not already joined
    if (sphereSlug && !joinedSpheres.has(sphereSlug)) {
      await toggleJoinSphere(sphereSlug);
    }

    await new Promise(r => setTimeout(r, 600));

    const sphere = spheres.find(s => s.slug === sphereSlug);
    if (!sphere || !currentUser) { setSubmitting(false); return; }

    // Re-fetch sphere to get updated ID after joining
    const updatedSphere = spheres.find(s => s.slug === sphereSlug);
    if (!updatedSphere) {
      setSubmitting(false);
      return;
    }

    addPost({
      title: title.trim(),
      content: type === 'text' ? content : undefined,
      imageUrl: type === 'image' ? imageData : undefined,
      linkUrl: type === 'link' ? linkUrl : undefined,
      type,
      authorId: currentUser.id,
      sphereId: updatedSphere.id,
      sphereSlug: sphereSlug,
      flair: flair || undefined,
    });

    setSubmitting(false);
    navigate('/');
  };

  const inputClass = 'w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none focus:shadow-none';
  const isImageReady = type !== 'image' || !!imageData;

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-800 px-4 h-14 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors">
          <ArrowLeft size={18} /> Cancel
        </button>
        <h2 className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>New Post</h2>
        <button
          form="create-form"
          type="submit"
          disabled={!title.trim() || !sphereSlug || submitting || !isImageReady}
          className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-sm font-black border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none disabled:opacity-40 transition-all"
        >
          {submitting ? '...' : 'Post'}
        </button>
      </div>

      <form id="create-form" onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Author info */}
        {currentUser && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-xl border-2 border-zinc-900 dark:border-zinc-700" />
            <div>
              <div className="text-sm font-black text-foreground">{currentUser.name}</div>
              <div className="text-xs text-zinc-500 font-semibold">{currentUser.tag}</div>
            </div>
          </div>
        )}

        {/* Post type */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Post Type</label>
          <div className="flex rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden">
            {POST_TYPES.map(t => {
              const Icon = t.icon;
              const active = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setType(t.id); setImageData(''); setImageError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-black transition-all ${
                    active
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:text-foreground'
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sphere select */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Sphere *</label>
          <select
            value={sphereSlug}
            onChange={e => setSphereSlug(e.target.value)}
            required
            className={inputClass + ' cursor-pointer'}
          >
            <option value="">Choose a sphere...</option>
            {availableSpheres.map(s => (
              <option key={s.id} value={s.slug}>{s.icon} s/{s.slug} — {s.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Title *</label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={300}
            required
            className={inputClass}
          />
          <div className="text-right text-[10px] text-zinc-400 mt-1 font-semibold">{title.length}/300</div>
        </div>

        {/* Text content */}
        {type === 'text' && (
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Content</label>
            <textarea
              placeholder="Share your thoughts..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              className={inputClass + ' resize-none'}
            />
          </div>
        )}

        {/* Image upload from gallery */}
        {type === 'image' && (
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">
              Photo * <span className="normal-case text-zinc-400">(from your gallery)</span>
            </label>

            {!imageData ? (
              <label className="flex flex-col items-center justify-center gap-3 w-full h-44 rounded-2xl border-2 border-dashed border-zinc-900 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 cursor-pointer hover:border-[#7C3AED] hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-[#7C3AED]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-zinc-600 dark:text-zinc-300">Tap to choose from gallery</p>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">JPG · PNG · GIF · WEBP · Max 5 MB</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleImageFile}
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_#18181B] dark:shadow-none">
                <img src={imageData} alt="Preview" className="w-full max-h-72 object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageData(''); setImageError(''); }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
                >
                  <X size={14} />
                </button>
                <label className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs font-black cursor-pointer hover:bg-black/80 transition-all flex items-center gap-1.5">
                  <Upload size={12} /> Change Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageFile}
                  />
                </label>
              </div>
            )}
            {imageError && (
              <p className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1">
                ⚠ {imageError}
              </p>
            )}
          </div>
        )}

        {/* Link URL */}
        {type === 'link' && (
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Link URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        {/* Flair / Tag */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">Tag (optional)</label>
          <input
            type="text"
            placeholder="e.g. Question, Discussion, Announcement"
            value={flair}
            onChange={e => setFlair(e.target.value)}
            maxLength={30}
            className={inputClass}
          />
        </div>

        {/* Notice */}
        <p className="text-xs text-zinc-400 font-semibold text-center">
          Your post will be visible to all SHUATSPHERE members
        </p>
      </form>
    </div>
  );
}
