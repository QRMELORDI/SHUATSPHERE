import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, User, Lock, AlertCircle, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SphereLogo } from '../components/SphereLogo';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useApp();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.endsWith('@shiats.edu.in')) {
      setError('Only @shiats.edu.in emails are allowed!');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, username, newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Reset failed. Check your details.');
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3.5 px-4 text-sm text-foreground placeholder:text-zinc-400 focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B] dark:shadow-none focus:shadow-none";

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFF] dark:bg-[#0D0B1A] flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-sm w-full bg-white dark:bg-[#15122A] border-2 border-zinc-900 dark:border-zinc-700 rounded-3xl p-8 text-center shadow-[6px_6px_0px_#18181B] dark:shadow-none"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-black mb-2 text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Password Reset!</h2>
          <p className="text-zinc-500 font-semibold text-sm mb-8">Your password has been updated. You can now login with your new password.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3.5 rounded-2xl bg-[#7C3AED] text-white font-black text-base border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] hover:bg-[#6D28D9] transition-all"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFF] dark:bg-[#0D0B1A] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FAFAFF]/95 dark:bg-[#0D0B1A]/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-700 px-4 h-14 flex items-center gap-3">
        <button onClick={() => navigate('/login')} className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all">
          <ArrowLeft size={20} />
        </button>
        <span className="font-black text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Reset Password</span>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 py-8 justify-center">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <SphereLogo size={56} />
          </div>
          <h1 className="font-black text-2xl text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Recover <span className="text-[#7C3AED]">Sphere</span> Account
          </h1>
          <p className="text-sm text-zinc-500 font-semibold mt-1">Enter your details to set a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-500 uppercase ml-1">University Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                placeholder="rollno@shiats.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={inputClass + ' pl-10'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-500 uppercase ml-1">Username</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="your_username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className={inputClass + ' pl-10'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-zinc-500 uppercase ml-1">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className={inputClass + ' pl-10'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#7C3AED] text-white font-black text-base border-2 border-zinc-900 shadow-[4px_4px_0px_#18181B] dark:shadow-none hover:bg-[#6D28D9] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>Reset Password <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 font-semibold mt-8">
          Remembered it?{' '}
          <button onClick={() => navigate('/login')} className="text-[#7C3AED] font-black hover:underline">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}
