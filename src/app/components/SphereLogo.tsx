import { motion } from 'motion/react';

interface SphereLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function SphereLogo({ size = 32, className = '', animated = false }: SphereLogoProps) {
  const content = (
    <div className={`overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <img
        src="/logo.jpg"
        alt="SHUATSPHERE"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to simpler version if image fails
          e.currentTarget.src = 'https://api.dicebear.com/8.x/shapes/svg?seed=shuats';
        }}
      />
    </div>
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