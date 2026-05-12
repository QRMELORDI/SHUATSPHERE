import { motion } from 'motion/react';

interface AnimatedGlobeProps {
  size?: number;
  className?: string;
}

export function AnimatedGlobe({ size = 120, className = '' }: AnimatedGlobeProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-teal-500 opacity-20 blur-sm"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Main globe */}
      <motion.div
        className="absolute inset-2 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 0%, transparent 50%), conic-gradient(from 0deg, #7C3AED, #3B82F6, #0D9488, #10B981, #7C3AED)',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      />

      {/* Inner globe overlay */}
      <motion.div
        className="absolute inset-3 rounded-full"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(30,20,60,0.8) 0%, rgba(15,10,40,0.95) 100%)',
          boxShadow: 'inset 0 0 30px rgba(124,58,237,0.3), inset 0 0 60px rgba(14,148,136,0.2)',
        }}
      />

      {/* Continents/land masses (abstract circles) */}
      <motion.div
        className="absolute inset-6 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'transparent',
        }}
      >
        {/* Land mass indicators */}
        <div className="absolute top-[20%] left-[25%] w-[15%] h-[12%] rounded-full bg-emerald-400/40 blur-[2px]" />
        <div className="absolute top-[35%] left-[55%] w-[20%] h-[15%] rounded-full bg-emerald-400/30 blur-[2px]" />
        <div className="absolute top-[50%] left-[30%] w-[12%] h-[10%] rounded-full bg-emerald-400/35 blur-[2px]" />
        <div className="absolute top-[60%] left-[60%] w-[18%] h-[14%] rounded-full bg-emerald-400/25 blur-[2px]" />
      </motion.div>

      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(14,148,136,0.3), inset 0 0 20px rgba(255,255,255,0.1)',
        }}
      />

      {/* Highlight */}
      <div
        className="absolute top-[15%] left-[20%] w-[30%] h-[20%] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.8), transparent)',
        }}
      />

      {/* Orbiting particles */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-lg"
          style={{
            top: '50%',
            left: '50%',
            marginTop: -3,
            marginLeft: -3,
          }}
          animate={{
            rotate: [angle, angle + 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}