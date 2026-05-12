import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Search, ArrowLeft, Plus, Minus, Loader2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AdminAuraPage() {
  const navigate = useNavigate();
  const { currentUser, allUsers, loadAllUsers, giveAuraPoints, isLoggedIn } = useApp();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [auraAmount, setAuraAmount] = useState(100);
  const [giving, setGiving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  useEffect(() => {
    if (isAdmin && isLoggedIn) {
      loadAllUsers();
    }
  }, [isAdmin, isLoggedIn]);

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Sparkles size={48} className="text-zinc-300 mb-4" />
        <h2 className="font-black text-xl text-foreground mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Admin Only
        </h2>
        <p className="text-zinc-500 text-sm font-semibold mb-6">You need admin privileges to access this page</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleGiveAura = async () => {
    if (!selectedUser || auraAmount === 0) return;
    setGiving(true);
    const result = await giveAuraPoints(selectedUser, auraAmount);
    setGiving(false);
    if (result.success) {
      setSuccess(`+${auraAmount} Aura points given successfully!`);
      setSelectedUser(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-black text-2xl text-foreground flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <Sparkles size={22} className="text-amber-500" />
            Admin Aura
          </h1>
          <p className="text-sm text-zinc-500 font-semibold">Give aura points to users</p>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center gap-2"
        >
          <Check size={16} /> {success}
        </motion.div>
      )}

      {/* Aura amount selector */}
      <div className="p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[3px_3px_0px_#18181B]">
        <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-2 block">
          Aura Points Amount
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAuraAmount(Math.max(10, auraAmount - 50))}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 hover:border-[#7C3AED] transition-all"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={auraAmount}
            onChange={(e) => setAuraAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 text-center font-black text-2xl bg-transparent border-2 border-zinc-900 dark:border-zinc-700 rounded-xl py-2"
          />
          <button
            onClick={() => setAuraAmount(auraAmount + 50)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-700 hover:border-[#7C3AED] transition-all"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {[50, 100, 250, 500, 1000].map(amount => (
            <button
              key={amount}
              onClick={() => setAuraAmount(amount)}
              className={`px-3 py-1 rounded-full text-xs font-black border-2 transition-all ${
                auraAmount === amount
                  ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600'
              }`}
            >
              +{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#15122A] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all shadow-[2px_2px_0px_#18181B]"
        />
      </div>

      {/* Users list */}
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center gap-3 p-3 rounded-2xl border-2 bg-white dark:bg-[#15122A] shadow-[2px_2px_0px_#18181B] transition-all ${
              selectedUser === user.id ? 'border-[#7C3AED]' : 'border-zinc-900 dark:border-zinc-700'
            }`}
          >
            <button
              onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
              className="shrink-0"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-xl border-2 border-zinc-900 dark:border-zinc-700"
              />
            </button>
            <div className="flex-1 min-w-0 text-left">
              <div className="font-black text-sm text-foreground truncate">{user.name}</div>
              <div className="text-xs text-zinc-500 font-semibold truncate">@{user.username}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-black text-[#7C3AED] text-sm flex items-center gap-1">
                <Sparkles size={12} />
                {user.auraScore || 0}
              </div>
              {user.role && (
                <span className="text-[10px] font-black uppercase text-zinc-400">{user.role}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Give aura button */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#0D0B1A] border-t-2 border-zinc-900 dark:border-zinc-700"
        >
          <button
            onClick={handleGiveAura}
            disabled={giving || auraAmount <= 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-violet-600 text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {giving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Sparkles size={20} />
                Give +{auraAmount} Aura
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Spacer for fixed button */}
      {selectedUser && <div className="h-24" />}
    </div>
  );
}