import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Trophy, Sparkles, Crown, Medal, Users, FileText, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={20} className="text-amber-400" />;
  if (rank === 2) return <Medal size={20} className="text-slate-400" />;
  if (rank === 3) return <Medal size={20} className="text-amber-700" />;
  return (
    <span className="text-sm font-black text-zinc-400 w-6 text-center">#{rank}</span>
  );
}

export function LeaderboardPage() {
  const navigate = useNavigate();
  const { spheres } = useApp();
  const [tab, setTab] = useState<'aura' | 'spheres'>('aura');

  const sortedUsers = [...USERS].sort((a, b) => b.auraScore - a.auraScore);
  const topSpheres = [...spheres].sort((a, b) => b.memberCount - a.memberCount);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [sortedUsers[1], sortedUsers[0], sortedUsers[2]];
  const podiumRanks = [2, 1, 3];
  const podiumHeights = ['h-28', 'h-36', 'h-24'];
  const podiumColors = [
    'bg-slate-50 dark:bg-slate-900/30',
    'bg-amber-50 dark:bg-amber-900/20',
    'bg-orange-50 dark:bg-orange-900/20',
  ];

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
          <h1
            className="font-black text-2xl text-foreground flex items-center gap-2"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Trophy size={22} className="text-amber-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-zinc-500 font-semibold">Top SHUATSPHERE members</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 overflow-hidden">
        {([
          { key: 'aura', label: '✨ Aura Rankings' },
          { key: 'spheres', label: '🌐 Top Spheres' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-black transition-all ${
              tab === t.key
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-900 text-zinc-500 hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Aura tab */}
      {tab === 'aura' && (
        <div className="space-y-3">
          {/* Podium */}
          {sortedUsers.length >= 3 && (
            <div className="rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[4px_4px_0px_#18181B] dark:shadow-none p-4 mb-2">
              <p className="text-center text-xs font-black uppercase tracking-widest text-zinc-400 mb-3">
                Top 3 Sphere Champions
              </p>
              <div className="flex items-end justify-center gap-2">
                {podiumOrder.map((user, i) => (
                  <button
                    key={user.id}
                    onClick={() => navigate(`/profile/${user.id}`)}
                    className={`flex flex-col items-center justify-end ${podiumHeights[i]} flex-1 p-2 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 ${podiumColors[i]} hover:border-[#7C3AED] transition-all active:scale-95`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 mb-1.5"
                    />
                    <div className="text-[10px] font-black text-foreground truncate w-full text-center">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-[#7C3AED] font-black flex items-center gap-0.5">
                      <Sparkles size={9} />
                      {user.auraScore}
                    </div>
                    <div className="mt-1.5">
                      <RankBadge rank={podiumRanks[i]} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Full list */}
          <div className="space-y-2">
            {sortedUsers.map((user, i) => (
              <motion.button
                key={user.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/profile/${user.id}`)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 bg-white dark:bg-[#15122A] shadow-[3px_3px_0px_#18181B] dark:shadow-none hover:border-[#7C3AED] active:translate-y-0.5 active:shadow-none transition-all ${
                  i < 3
                    ? 'border-[#7C3AED]/40 dark:border-[#7C3AED]/30'
                    : 'border-zinc-900 dark:border-zinc-700'
                }`}
              >
                <div className="w-8 flex items-center justify-center shrink-0">
                  <RankBadge rank={i + 1} />
                </div>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                  <div
                    className="font-black text-foreground text-sm truncate"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {user.name}
                  </div>
                  <div className="text-xs text-zinc-500 font-semibold">
                    @{user.username} · {user.tag}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-[#7C3AED] text-sm flex items-center gap-1 justify-end">
                    <Sparkles size={12} />
                    {user.auraScore}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-semibold">Aura</div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Tip */}
          <div className="rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/20 p-4 text-center">
            <p className="text-xs font-black text-[#7C3AED]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ✨ How to earn Aura?
            </p>
            <p className="text-xs text-zinc-500 font-semibold mt-1">
              Post content · Get boosted · Reply to discussions · Join spheres
            </p>
          </div>
        </div>
      )}

      {/* Spheres tab */}
      {tab === 'spheres' && (
        <div className="space-y-2">
          {topSpheres.map((sphere, i) => (
            <motion.button
              key={sphere.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => navigate(`/sphere/${sphere.slug}`)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 bg-white dark:bg-[#15122A] shadow-[3px_3px_0px_#18181B] dark:shadow-none hover:border-[#7C3AED] active:translate-y-0.5 active:shadow-none transition-all ${
                i < 3
                  ? 'border-[#7C3AED]/40 dark:border-[#7C3AED]/30'
                  : 'border-zinc-900 dark:border-zinc-700'
              }`}
            >
              <div className="w-8 flex items-center justify-center shrink-0">
                <RankBadge rank={i + 1} />
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sphere.coverColor} flex items-center justify-center text-xl shrink-0 border-2 border-zinc-900/20`}
              >
                {sphere.icon}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div
                  className="font-black text-foreground text-sm truncate"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  s/{sphere.slug}
                </div>
                <div className="text-xs text-zinc-500 font-semibold truncate">{sphere.name}</div>
              </div>
              <div className="text-right shrink-0 space-y-0.5">
                <div className="font-black text-[#0D9488] text-sm flex items-center gap-1 justify-end">
                  <Users size={11} />
                  {sphere.memberCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1 justify-end">
                  <FileText size={9} />
                  {sphere.postCount.toLocaleString()} posts
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
