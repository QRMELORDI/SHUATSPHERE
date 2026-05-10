import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Bell, ArrowBigUp, MessageSquare, AtSign, Award, Lock, CheckCheck, Ghost } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

const NOTIF_CONFIG = {
  boost: {
    icon: ArrowBigUp,
    color: 'text-[#7C3AED]',
    bg: 'bg-violet-100 dark:bg-violet-950/50',
    label: 'Boost',
  },
  reply: {
    icon: MessageSquare,
    color: 'text-[#0D9488]',
    bg: 'bg-teal-100 dark:bg-teal-950/50',
    label: 'Reply',
  },
  whisper: {
    icon: Ghost,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-950/50',
    label: 'Whisper',
  },
  badge: {
    icon: Award,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-950/50',
    label: 'Badge',
  },
  mention: {
    icon: AtSign,
    color: 'text-rose-500',
    bg: 'bg-rose-100 dark:bg-rose-950/50',
    label: 'Mention',
  },
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const { isLoggedIn, notifications, markNotifRead, markAllNotifsRead } = useApp();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <Lock size={40} className="text-zinc-400 mb-4" />
        <h2
          className="font-black text-xl text-foreground mb-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Login to see Notifications
        </h2>
        <p className="text-zinc-500 text-sm font-semibold mb-6">
          Stay updated with boosts, replies & more
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 rounded-2xl bg-[#7C3AED] text-white font-black border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all"
        >
          Login
        </button>
      </div>
    );
  }

  const unread = notifications.filter(n => !n.read);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-black text-2xl text-foreground flex items-center gap-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Bell size={22} className="text-[#7C3AED]" />
            Notifications
          </h1>
          {unread.length > 0 ? (
            <p className="text-sm text-zinc-500 font-semibold mt-0.5">
              {unread.length} unread
            </p>
          ) : (
            <p className="text-sm text-zinc-500 font-semibold mt-0.5">All caught up!</p>
          )}
        </div>
        {unread.length > 0 && (
          <button
            onClick={markAllNotifsRead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black text-[#7C3AED] border border-[#7C3AED]/30 bg-[#7C3AED]/5 hover:bg-[#7C3AED]/10 transition-all"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="text-zinc-200 dark:text-zinc-700 mx-auto mb-4" />
          <p
            className="font-black text-foreground text-lg"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            No notifications yet
          </p>
          <p className="text-zinc-500 text-sm font-semibold mt-1">
            Post, boost & join spheres to get started
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const cfg = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.boost;
            const Icon = cfg.icon;
            const user = notif.userId ? USERS.find(u => u.id === notif.userId) : null;

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                onClick={() => {
                  markNotifRead(notif.id);
                  if (notif.postId) navigate(`/post/${notif.postId}`);
                  else if (notif.userId) navigate(`/profile/${notif.userId}`);
                }}
                className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                  !notif.read
                    ? 'border-[#7C3AED] bg-[#7C3AED]/5 shadow-[3px_3px_0px_#7C3AED]'
                    : 'border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[2px_2px_0px_#18181B] dark:shadow-none hover:border-[#7C3AED]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}
                  >
                    <Icon size={18} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {user && (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-4 h-4 rounded-full border border-zinc-200 dark:border-zinc-700"
                        />
                      )}
                      <span className="text-xs text-zinc-400 font-semibold">{notif.time}</span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                      {!notif.read && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer tip */}
      {notifications.length > 0 && (
        <p className="text-center text-xs text-zinc-400 font-semibold pb-2">
          Tap a notification to navigate to it
        </p>
      )}
    </div>
  );
}
