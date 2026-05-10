import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

const MAX_LENGTH = 1000;

export function ComposeWhisperPage() {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, sendWhisper } = useApp();
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const targetUser = USERS.find(
    u => u.username === to.trim() || u.email === to.trim()
  );

  const canSend = to.trim().length > 0 && message.trim().length > 0 && !sending;

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    setError('');

    if (!targetUser) {
      setError('User not found. Enter a valid username or @shiats.edu.in email.');
      return;
    }
    if (targetUser.id === currentUser?.id) {
      setError("You can't whisper to yourself!");
      return;
    }

    setSending(true);
    await new Promise(r => setTimeout(r, 600));
    sendWhisper(targetUser.id, message.trim());
    setSending(false);
    setSent(true);

    // Navigate to inbox after short delay
    setTimeout(() => navigate('/inbox'), 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — Send button here so keyboard never hides it */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-700">
        <div className="w-full max-w-md mx-auto flex items-center justify-between px-4 h-14 gap-3">
          <button
            onClick={() => navigate('/inbox')}
            className="flex items-center gap-2 p-2 -ml-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <h1
            className="font-black text-lg text-foreground flex-1 text-center"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            New Whisper
          </h1>

          <button
            onClick={handleSend}
            disabled={!canSend || sent}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm border-2 border-zinc-900 shadow-[2px_2px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 ${
              sent
                ? 'bg-emerald-500 text-white border-emerald-700'
                : 'bg-[#7C3AED] text-white'
            }`}
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
            ) : sent ? (
              '✓ Sent!'
            ) : (
              <>
                <Send size={14} /> Send
              </>
            )}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-5 space-y-4">
        {/* To field */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
            <User size={18} />
          </div>
          <input
            type="text"
            placeholder="username or @shiats.edu.in email"
            value={to}
            onChange={e => { setTo(e.target.value); setError(''); }}
            autoFocus
            className="w-full bg-white dark:bg-[#15122A] border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
          {/* User preview */}
          {targetUser && to.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1E1A35] border-2 border-zinc-900 dark:border-zinc-700 rounded-2xl p-3 flex items-center gap-3 shadow-[3px_3px_0px_#18181B] dark:shadow-lg z-10"
            >
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-9 h-9 rounded-xl border-2 border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <div className="font-black text-foreground text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {targetUser.name}
                </div>
                <div className="text-xs text-zinc-500 font-semibold">@{targetUser.username} · {targetUser.tag}</div>
              </div>
              {targetUser.isVerified && (
                <span className="ml-auto text-[10px] font-black text-[#0D9488] bg-[#0D9488]/10 px-1.5 py-0.5 rounded-full border border-[#0D9488]/20">
                  ✓ VERIFIED
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 font-semibold px-1"
          >
            ⚠ {error}
          </motion.p>
        )}

        {/* Message area */}
        <div className="relative">
          <textarea
            placeholder="Write your whisper..."
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, MAX_LENGTH))}
            rows={12}
            className="w-full bg-white dark:bg-[#15122A] border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 px-4 text-sm focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
          <span className="absolute bottom-3 right-4 text-xs text-zinc-400 font-semibold">
            {message.length}/{MAX_LENGTH}
          </span>
        </div>

        {/* Full-width send button (visible when keyboard not blocking) */}
        <button
          onClick={handleSend}
          disabled={!canSend || sent}
          className={`w-full py-4 rounded-2xl font-black text-base border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-40 ${
            sent
              ? 'bg-emerald-500 text-white border-emerald-700'
              : 'bg-[#7C3AED] text-white'
          }`}
        >
          {sending ? (
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin block" />
          ) : sent ? (
            '✓ Whisper Sent!'
          ) : (
            <>
              Send Whisper <Send size={18} />
            </>
          )}
        </button>

        {/* Current user info */}
        {currentUser && (
          <p className="text-center text-xs text-zinc-400 font-semibold">
            Sending as <span className="text-[#7C3AED] font-black">@{currentUser.username}</span>
          </p>
        )}
      </div>
    </div>
  );
}
