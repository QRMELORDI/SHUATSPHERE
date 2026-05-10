import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Globe, Plus, MessageSquare, CircleUser,
  Search, Moon, Sun, Bell, LogOut, Bookmark,
  Ghost, Menu, X, ChevronRight, Trophy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SphereLogo } from './SphereLogo';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isLoggedIn, isDark, toggleTheme, unreadWhisperCount, unreadNotifCount, logout } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const bottomNavItems = [
    { icon: Home, path: '/', label: 'Home', testid: 'bottom-nav-home' },
    { icon: Globe, path: '/spheres', label: 'Spheres', testid: 'bottom-nav-spheres' },
    null, // center FAB placeholder
    { icon: MessageSquare, path: '/inbox', label: 'Inbox', testid: 'bottom-nav-inbox', badge: unreadWhisperCount },
    { icon: CircleUser, path: '/profile', label: 'Profile', testid: 'bottom-nav-profile' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Phone-frame centered layout */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-background">

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b-2 border-zinc-900 dark:border-zinc-700">
          <div className="flex items-center justify-between px-4 h-14">
            {/* Logo */}
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <SphereLogo size={32} />
              <span className="font-black tracking-tight text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <span className="text-[#7C3AED]">SHUAT</span><span className="text-[#0D9488]">SPHERE</span>
              </span>
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/search')}
                data-testid="header-search"
                className="p-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
              >
                <Search size={18} />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
                >
                  <Bell size={18} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#7C3AED] text-white text-[9px] rounded-full flex items-center justify-center font-black">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>
              ) : null}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-xl text-zinc-500 hover:text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-28">
          <Outlet />
        </main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 border-t-2 border-zinc-900 dark:border-zinc-700 bg-white/95 dark:bg-[#0D0B1A]/95 backdrop-blur-xl flex justify-around items-center px-2 z-50 rounded-t-3xl">
          {bottomNavItems.map((item, i) => {
            if (!item) {
              // Center FAB
              return (
                <div key="fab" className="relative flex items-center justify-center w-16">
                  <button
                    onClick={() => isLoggedIn ? navigate('/create') : navigate('/login')}
                    data-testid="bottom-nav-create"
                    className="absolute -top-8 w-16 h-16 bg-[#7C3AED] text-white rounded-full flex items-center justify-center border-4 border-white dark:border-[#0D0B1A] shadow-lg hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Plus size={28} strokeWidth={3} />
                  </button>
                </div>
              );
            }
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                data-testid={item.testid}
                className={`relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  active ? 'text-[#7C3AED]' : 'text-zinc-400 dark:text-zinc-500 hover:text-foreground'
                }`}
              >
                <item.icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#7C3AED] text-white text-[9px] rounded-full flex items-center justify-center font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-[#0D0B1A] border-l-2 border-zinc-900 dark:border-zinc-700 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-zinc-900 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <SphereLogo size={24} />
                  <span className="font-black text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <span className="text-[#7C3AED]">SHUAT</span><span className="text-[#0D9488]">SPHERE</span>
                  </span>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* User info */}
              {isLoggedIn && currentUser ? (
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700" />
                    <div>
                      <div className="font-black text-foreground text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{currentUser.name}</div>
                      <div className="text-xs text-zinc-500 font-semibold">{currentUser.tag}</div>
                      <div className="text-xs text-[#7C3AED] font-black">✨ {currentUser.auraScore} Aura</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 space-y-2">
                  <button onClick={() => handleNav('/login')} className="w-full py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black text-sm border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all">
                    Login
                  </button>
                  <button onClick={() => handleNav('/register')} className="w-full py-2.5 rounded-2xl bg-white dark:bg-zinc-800 text-foreground font-black text-sm border-2 border-zinc-900 dark:border-zinc-700 shadow-[3px_3px_0px_#18181B] dark:shadow-none active:translate-y-0.5 active:shadow-none transition-all">
                    Join Free
                  </button>
                  <button onClick={() => handleNav('/')} className="w-full py-2 text-xs text-zinc-500 flex items-center justify-center gap-1 hover:text-foreground transition-colors">
                    <Ghost size={13} />
                    Browse as Ghost
                  </button>
                </div>
              )}

              {/* Nav items */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {[
                  { icon: Home, label: 'Home', path: '/' },
                  { icon: Globe, label: 'Spheres', path: '/spheres' },
                  { icon: Search, label: 'Search', path: '/search' },
                  { icon: MessageSquare, label: 'Inbox', path: '/inbox' },
                  { icon: Bell, label: 'Notifications', path: '/notifications' },
                  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
                  { icon: CircleUser, label: 'Profile', path: '/profile' },
                  { icon: Bookmark, label: 'Stash', path: '/stash' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(item.path)
                        ? 'bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:text-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </span>
                    <ChevronRight size={14} className="opacity-40" />
                  </button>
                ))}
              </div>

              {/* Footer */}
              {isLoggedIn && (
                <div className="p-3 border-t border-zinc-200 dark:border-zinc-700">
                  <button
                    onClick={() => { logout(); setDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}