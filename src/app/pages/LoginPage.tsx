import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Ghost, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SphereLogo } from '../components/SphereLogo';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleDemo = async () => {
    setEmail('25msrsgis001@shiats.edu.in');
    setPassword('demo1234');
    setError('');
    setLoading(true);
    const result = await login('25msrsgis001@shiats.edu.in', 'demo1234');
    setLoading(false);
    if (result.success) navigate('/');
    else setError(result.error || 'Demo login failed');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-end relative overflow-hidden bg-[#0D0B1A]">
      {/* Animated background spheres */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full bg-[#7C3AED]/20 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-64 h-64 rounded-full bg-[#0D9488]/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[30%] left-[10%] w-48 h-48 rounded-full bg-[#7C3AED]/10 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B1A] via-[#0D0B1A]/80 to-transparent z-10" />

      {/* Content */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 p-6 pb-12 space-y-6 w-full max-w-md mx-auto"
      >
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <SphereLogo size={64} />
          </div>
          <h1 className="text-white font-black text-3xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-[#A78BFA]">SHUAT</span><span className="text-[#2DD4BF]">SPHERE</span>
          </h1>
          <p className="text-zinc-400 text-sm font-semibold">Your SHUATS student universe 🌐</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-300 text-sm font-semibold"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              placeholder="username@shiats.edu.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-3.5 pl-10 pr-4 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white/15 transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border-2 border-white/20 rounded-2xl py-3.5 pl-10 pr-10 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-[#7C3AED] focus:bg-white/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#7C3AED] text-white font-black text-base border-2 border-[#7C3AED] shadow-lg hover:bg-[#6D28D9] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            data-testid="login-button"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>Login <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Demo / Ghost */}
        <div className="space-y-2 text-center">
          <button
            onClick={handleDemo}
            className="w-full py-3 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-sm font-bold hover:bg-white/20 active:scale-95 transition-all"
          >
            🚀 Try Demo Account
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2.5 text-zinc-500 hover:text-zinc-300 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Ghost size={15} />
            Browse as Ghost (no login)
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-zinc-500 text-sm font-semibold">
          New to SHUATSPHERE?{' '}
          <button onClick={() => navigate('/register')} className="text-[#A78BFA] font-black hover:underline">
            Join Free
          </button>
        </p>
      </motion.div>
    </div>
  );
}
