import { motion } from 'motion/react';

interface ShuatsMascotProps {
  size?: number;
  animated?: boolean;
  variant?: 'logo' | 'loading' | 'avatar' | 'icon';
}

export function ShuatsMascot({ size = 120, animated = true, variant = 'logo' }: ShuatsMascotProps) {
  const baseSize = size;
  
  if (variant === 'icon') {
    return (
      <svg width={baseSize} height={baseSize} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#iconGrad)" />
        <ellipse cx="50" cy="55" rx="25" ry="20" fill="#0D0B1A" />
        <circle cx="40" cy="50" r="5" fill="#FFFFFF" />
        <circle cx="60" cy="50" r="5" fill="#FFFFFF" />
        <circle cx="42" cy="48" r="2" fill="#0D0B1A" />
        <circle cx="62" cy="48" r="2" fill="#0D0B1A" />
        <path d="M40 62 Q50 70 60 62" stroke="#0D0B1A" strokeWidth="2" fill="none" />
        <ellipse cx="50" cy="25" rx="15" ry="12" fill="#7C3AED" opacity="0.8" />
      </svg>
    );
  }

  if (variant === 'loading') {
    return (
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity }
        }}
        style={{ width: baseSize, height: baseSize }}
      >
        <svg width={baseSize} height={baseSize} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.circle 
            cx="60" cy="60" r="50" 
            fill="url(#glowGrad)"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <circle cx="60" cy="60" r="40" fill="url(#loadGrad)" />
          <ellipse cx="60" cy="65" rx="22" ry="18" fill="#0D0B1A" />
          <circle cx="48" cy="60" r="6" fill="#FFFFFF" />
          <circle cx="72" cy="60" r="6" fill="#FFFFFF" />
          <circle cx="50" cy="58" r="2.5" fill="#0D0B1A" />
          <circle cx="74" cy="58" r="2.5" fill="#0D0B1A" />
          <path d="M48 75 Q60 85 72 75" stroke="#0D0B1A" strokeWidth="3" fill="none" />
          <motion.ellipse 
            cx="60" cy="30" rx="15" ry="12" 
            fill="#A78BFA" opacity="0.9}
            animate={{ y: [0, -5, 0], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path 
            d="M25 50 Q20 30 35 20" 
            stroke="#2DD4BF" strokeWidth="2" fill="none" opacity="0.6"
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.path 
            d="M95 50 Q100 30 85 20" 
            stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.6"
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </svg>
      </motion.div>
    );
  }

  if (variant === 'avatar') {
    return (
      <motion.div
        animate={animated ? { 
          y: [0, -8, 0],
          scale: [1, 1.02, 1]
        } : {}}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ width: baseSize, height: baseSize }}
      >
        <svg width={baseSize} height={baseSize} viewBox="0 0 120 120">
          <defs>
            <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="55" fill="url(#avatarGrad)" opacity="0.3" />
          <circle cx="60" cy="60" r="45" fill="url(#avatarGrad)" />
          <ellipse cx="60" cy="65" rx="25" ry="20" fill="#0D0B1A" />
          <circle cx="46" cy="60" r="7" fill="#FFFFFF" />
          <circle cx="74" cy="60" r="7" fill="#FFFFFF" />
          <circle cx="48" cy="58" r="3" fill="#0D0B1A" />
          <circle cx="76" cy="58" r="3" fill="#0D0B1A" />
          <path d="M45 78 Q60 90 75 78" stroke="#0D0B1A" strokeWidth="3" fill="none" />
          <ellipse cx="60" cy="28" rx="18" ry="14" fill="#A78BFA" opacity="0.9" />
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      style={{ width: baseSize, height: baseSize }}
    >
      <svg width={baseSize} height={baseSize} viewBox="0 0 120 120">
        <defs>
          <linearGradient id="shuatsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="shuatsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {animated && (
          <>
            <motion.circle 
              cx="60" cy="60" r="58"
              fill="url(#shuatsGlow)"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={60 + 55 * Math.cos(i * Math.PI / 4)}
                cy={60 + 55 * Math.sin(i * Math.PI / 4)}
                r="3"
                fill={i % 2 === 0 ? "#2DD4BF" : "#F472B6"}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.15 
                }}
              />
            ))}
          </>
        )}
        
        <circle cx="60" cy="60" r="45" fill="url(#shuatsGrad)" />
        
        <ellipse cx="60" cy="65" rx="26" ry="21" fill="#0D0B1A" />
        
        <circle cx="45" cy="60" r="8" fill="#FFFFFF" />
        <circle cx="75" cy="60" r="8" fill="#FFFFFF" />
        <circle cx="47" cy="57" r="3.5" fill="#0D0B1A" />
        <circle cx="77" cy="57" r="3.5" fill="#0D0B1A" />
        <circle cx="46" cy="55" r="1.5" fill="#FFFFFF" />
        <circle cx="76" cy="55" r="1.5" fill="#FFFFFF" />
        
        <path d="M45 80 Q60 92 75 80" stroke="#0D0B1A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        
        <ellipse cx="60" cy="25" rx="20" ry="15" fill="#A78BFA" opacity="0.95" />
        <ellipse cx="55" cy="23" rx="8" ry="6" fill="#FBBF24" opacity="0.6" />
        
        {animated && (
          <>
            <motion.path 
              d="M15 70 Q10 50 25 35" 
              stroke="#2DD4BF" strokeWidth="2" fill="none" opacity="0.7"
              animate={{ 
                d: ["M15 70 Q10 50 25 35", "M15 75 Q12 55 25 40", "M15 70 Q10 50 25 35"],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.path 
              d="M105 70 Q110 50 95 35" 
              stroke="#F472B6" strokeWidth="2" fill="none" opacity="0.7"
              animate={{ 
                d: ["M105 70 Q110 50 95 35", "M105 75 Q108 55 95 40", "M105 70 Q110 50 95 35"],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      style={{ width: size, height: size, cursor: 'pointer' }}
    >
      <svg width={size} height={size} viewBox="0 0 60 60">
        <defs>
          <linearGradient id="markGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="30" r="28" fill="url(#markGrad)" />
        <ellipse cx="30" cy="33" rx="13" ry="10" fill="#0D0B1A" />
        <circle cx="23" cy="30" r="4" fill="#FFFFFF" />
        <circle cx="37" cy="30" r="4" fill="#FFFFFF" />
        <circle cx="24" cy="28" r="1.5" fill="#0D0B1A" />
        <circle cx="38" cy="28" r="1.5" fill="#0D0B1A" />
        <path d="M22 40 Q30 46 38 40" stroke="#0D0B1A" strokeWidth="2" fill="none" />
      </svg>
    </motion.div>
  );
}

export default ShuatsMascot;