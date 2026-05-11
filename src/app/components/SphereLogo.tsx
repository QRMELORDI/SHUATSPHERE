import { motion } from 'motion/react';

interface SphereLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function SphereLogo({ size = 32, className = '', animated = false }: SphereLogoProps) {
  const content = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shuatsLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        <linearGradient id="shuatsGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F472B6" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="innerGlow" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Glow effect */}
      {animated && (
        <motion.circle 
          cx="30" cy="30" r="28"
          fill="url(#shuatsGlow)"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Main sphere body - "Shuats" head */}
      <circle cx="30" cy="30" r="22" fill="url(#shuatsLogoGrad)" />
      <circle cx="30" cy="30" r="22" fill="url(#innerGlow)" />
      
      {/* Face - dark oval */}
      <ellipse cx="30" cy="32" rx="14" ry="11" fill="#0D0B1A" />
      
      {/* Eyes */}
      <circle cx="23" cy="30" r="4" fill="#FFFFFF" />
      <circle cx="37" cy="30" r="4" fill="#FFFFFF" />
      <circle cx="24" cy="29" r="1.8" fill="#0D0B1A" />
      <circle cx="38" cy="29" r="1.8" fill="#0D0B1A" />
      <circle cx="23" cy="27.5" r="0.8" fill="#FFFFFF" />
      <circle cx="37" cy="27.5" r="0.8" fill="#FFFFFF" />
      
      {/* Smile */}
      <path d="M22 40 Q30 47 38 40" stroke="#0D0B1A" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Antenna/Hair - unique to Shuats */}
      <ellipse cx="30" cy="10" rx="8" ry="6" fill="#A78BFA" opacity="0.95" />
      <circle cx="26" cy="8" r="2" fill="#FBBF24" opacity="0.7" />
      
      {/* Orbital rings - cosmic feel */}
      <ellipse cx="30" cy="30" rx="26" ry="8" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.3" />
      <ellipse cx="30" cy="30" rx="20" ry="22" stroke="#2DD4BF" strokeWidth="1" fill="none" opacity="0.25" transform="rotate(25 30 30)" />
      
      {/* Highlight */}
      <circle cx="20" cy="18" r="4" fill="#FFFFFF" opacity="0.4" />
    </svg>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: 'inline-block' }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}