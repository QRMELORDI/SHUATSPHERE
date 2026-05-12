import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 6000); // Shorter than 9s for better UX, but long enough to feel cinematic
    
    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(taglineTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-['Outfit',sans-serif]">
      {/* Particle Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              opacity: [0, 0.5, 0],
              y: [null, Math.random() * -100]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-[#06B6D4] rounded-full"
          />
        ))}
      </div>

      {/* Orbit Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[320px] h-[320px] flex items-center justify-center"
      >
        <svg width="320" height="320" viewBox="0 0 320 320" className="opacity-40">
          <circle cx="160" cy="160" r="120" stroke="#9333EA" strokeWidth="2" fill="none" />
          <circle cx="160" cy="160" r="90" stroke="#06B6D4" strokeWidth="2" fill="none" />
          <circle cx="160" cy="40" r="6" fill="#A855F7" />
          <circle cx="70" cy="220" r="8" fill="#9333EA" />
          <circle cx="260" cy="220" r="8" fill="#06B6D4" />
        </svg>
      </motion.div>

      {/* Main Logo Container */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.5, 
          duration: 1.5, 
          ease: [0.23, 1, 0.32, 1] 
        }}
        className="relative z-10"
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#A855F7] to-[#06B6D4] p-1 shadow-[0_0_50px_rgba(147,51,234,0.5)] flex items-center justify-center">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#020617] flex items-center justify-center">
             <img 
               src="/logo.jpg" 
               className="w-full h-full object-cover" 
               alt="Logo"
             />
          </div>
        </div>

        {/* Glow pulsing */}
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#A855F7] to-[#06B6D4] blur-2xl -z-10"
        />
      </motion.div>

      {/* Text Reveal */}
      <div className="mt-12 flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex items-center gap-1"
        >
          <span className="text-4xl md:text-5xl font-black tracking-widest text-[#A855F7]">SHUATS</span>
          <span className="text-4xl md:text-5xl font-black tracking-widest text-[#06B6D4]">PHERE</span>
        </motion.div>

        <AnimatePresence>
          {showTagline && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4"
            >
              <p className="text-white/80 text-sm md:text-base font-bold tracking-[0.5em] uppercase">
                SHUATS PEOPLE HERE
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
