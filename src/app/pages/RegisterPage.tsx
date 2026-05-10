import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SphereLogo } from '../components/SphereLogo';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [form, setForm] = useState({ email: '', password: '', name: '', username: '', batch: '', branch: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.endsWith('@shiats.edu.in')) {
      setError('Only @shiats.edu.in emails are allowed!');
      return;
    }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.error || 'Registration failed');
  };

  const inputClass = "w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3.5 px-4 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none focus:shadow-none";

  return (
    <div className="min-h-screen bg-[#FAFAFF] dark:bg-[#0D0B1A] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FAFAFF]/95 dark:bg-[#0D0B1A]/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-700 px-4 h-14 flex items-center gap-3">
        <button onClick={() => navigate('/login')} className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Create Account</span>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 py-6">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <SphereLogo size={52} />
          </div>
          <h1 className="font-black text-2xl text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Join <span className="text-[#7C3AED]">SHUAT</span><span className="text-[#0D9488]">SPHERE</span>
          </h1>
          <p className="text-sm text-zinc-500 font-semibold mt-1">Only for @shiats.edu.in students ✓</p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border-2 border-red-400 rounded-2xl text-red-600 dark:text-red-400 text-sm font-semibold"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              placeholder="rollno@shiats.edu.in"
              value={form.email}
              onChange={set('email')}
              required
              className={inputClass + ' pl-10'}
            />
          </div>

          {/* Name */}
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={set('name')}
              required
              className={inputClass + ' pl-10'}
            />
          </div>

          {/* Username */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-black">@</span>
            <input
              type="text"
              placeholder="username (no spaces)"
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value.replace(/\s/g, '_').toLowerCase() }))}
              required
              className={inputClass + ' pl-8'}
            />
          </div>

          {/* Batch + Branch in a row */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Batch (e.g. 2025)"
              value={form.batch}
              onChange={set('batch')}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Branch (e.g. CSE)"
              value={form.branch}
              onChange={set('branch')}
              required
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password (min 6 chars)"
              value={form.password}
              onChange={set('password')}
              required
              minLength={6}
              className={inputClass + ' pl-10 pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#7C3AED] text-white font-black text-base border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none hover:bg-[#6D28D9] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>

          <p className="text-center text-sm text-zinc-500 font-semibold pt-2">
            Already a student?{' '}
            <button type="button" onClick={() => navigate('/login')} className="text-[#7C3AED] font-black hover:underline">
              Login
            </button>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
