import { motion } from 'motion/react';
import { Sparkles, Users, Globe, Heart, GraduationCap, Rocket } from 'lucide-react';

const TEAM = [
  { name: 'Akshat Sir', role: 'Project Lead', icon: '🎯' },
  { name: 'Aryan Pandey', role: 'Full Stack Dev', icon: '⚡' },
  { name: 'Kartik Singh', role: 'Frontend', icon: '🎨' },
  { name: 'Kartik Garg', role: 'Frontend', icon: '✨' },
];

const FEATURES = [
  { icon: Globe, title: 'Spheres', desc: 'Join topic-based communities' },
  { icon: Sparkles, title: 'Aura System', desc: 'Earn reputation through activity' },
  { icon: Heart, title: 'Whispers', desc: 'Private messaging' },
  { icon: GraduationCap, title: '.edu.in', desc: 'SHUATS email verification' },
];

export function AboutUsPage() {
  return (
    <div className="p-4 space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#0D9488] mb-4">
          <span className="text-4xl">🌐</span>
        </div>
        <h1 className="font-black text-2xl text-foreground mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          About SHUATSPHERE
        </h1>
        <p className="text-zinc-500 font-semibold text-sm">
          The exclusive community for SHUATS students
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-violet-50 dark:bg-violet-950/20 shadow-[3px_3px_0px_#18181B] dark:shadow-none"
      >
        <div className="flex items-center gap-2 mb-2">
          <Rocket size={18} className="text-[#7C3AED]" />
          <span className="font-black text-sm text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>Our Mission</span>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
          To create a unified platform where SHUATS students can connect, share knowledge, and build meaningful relationships within their academic community.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-black text-sm text-foreground uppercase tracking-wider mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
          What We Offer
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="p-3 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[2px_2px_0px_#18181B] dark:shadow-none"
            >
              <feature.icon size={20} className="text-[#7C3AED] mb-2" />
              <div className="font-black text-xs text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>{feature.title}</div>
              <div className="text-[10px] text-zinc-500 font-semibold mt-0.5">{feature.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-[#0D9488]" />
          <h2 className="font-black text-sm text-foreground uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Built By Students
          </h2>
        </div>
        <div className="space-y-2">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className="flex items-center gap-3 p-3 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[2px_2px_0px_#18181B] dark:shadow-none"
            >
              <span className="text-2xl">{member.icon}</span>
              <div>
                <div className="font-black text-sm text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>{member.name}</div>
                <div className="text-xs text-zinc-500 font-semibold">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center py-4"
      >
        <p className="text-xs text-zinc-400 font-semibold">
          SHUATSPHERE v1.0.0
        </p>
        <p className="text-xs text-zinc-500 font-semibold mt-1">
          Made with ❤️ for SHUATS
        </p>
      </motion.div>
    </div>
  );
}