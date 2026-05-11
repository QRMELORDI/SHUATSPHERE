import { motion, AnimatePresence } from 'motion/react';
import { ShuatsMascot } from '../ShuatsMascot';

interface LoadingScreenProps {
  message?: string;
}

export function GenZLoadingScreen({ message = "Loading your universe..." }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0B1A]"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ShuatsMascot size={120} variant="loading" />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg font-bold text-zinc-300"
      >
        {message}
      </motion.p>
      
      <motion.div 
        className="mt-4 flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i === 0 ? '#7C3AED' : i === 1 ? '#2DD4BF' : '#F472B6'
            }}
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.15 
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

interface SendingAnimationProps {
  onComplete?: () => void;
}

export function SendingAnimation({ onComplete }: SendingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center justify-center p-8"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 0.5, repeat: 2 }}
      >
        <ShuatsMascot size={80} variant="loading" />
      </motion.div>
      
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="mt-4 text-sm font-bold text-zinc-400"
      >
        Sending to your sphere...
      </motion.p>
      
      <motion.div 
        className="mt-6 h-2 w-32 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div 
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7C3AED, #2DD4BF, #F472B6)'
          }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onAnimationComplete={onComplete}
        />
      </motion.div>
    </motion.div>
  );
}

interface SuccessAnimationProps {
  message?: string;
}

export function SuccessAnimation({ message = "Done! ✨" }: SuccessAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <ShuatsMascot size={60} variant="icon" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-sm font-bold text-[#2DD4BF]"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface CardAppearProps {
  children: React.ReactNode;
  index?: number;
}

export function CardAppear({ children, index = 0 }: CardAppearProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

interface ShakeAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
}

export function ShakeAnimation({ children, trigger = false }: ShakeAnimationProps) {
  return (
    <motion.div
      animate={trigger ? { 
        x: [0, -10, 10, -10, 10, 0]
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

interface PulseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function PulseButton({ children, onClick, variant = 'primary' }: PulseButtonProps) {
  const colors = variant === 'primary' 
    ? 'from-[#7C3AED] to-[#6D28D9]' 
    : 'from-white/20 to-white/10';
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${colors} overflow-hidden`}
    >
      <motion.div
        className="absolute inset-0 bg-white/20"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0, 0.3, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return (
    <motion.div
      className={`bg-white/10 rounded-xl ${className}`}
      animate={{ 
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

interface ShimmerEffectProps {
  children: React.ReactNode;
}

export function ShimmerEffect({ children }: ShimmerEffectProps) {
  return (
    <div className="relative overflow-hidden">
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}

interface ConfettiBurstProps {
  trigger?: boolean;
}

export function ConfettiBurst({ trigger = true }: ConfettiBurstProps) {
  if (!trigger) return null;
  
  const colors = ['#7C3AED', '#2DD4BF', '#F472B6', '#FBBF24', '#60A5FA'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: [0, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 1 + Math.random(),
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ 
            backgroundColor: colors[i % colors.length],
            left: '50%',
            top: '50%'
          }}
        />
      ))}
    </div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideIn({ children, direction = 'up' }: SlideInProps) {
  const directions = {
    left: { x: -100, y: 0 },
    right: { x: 100, y: 0 },
    up: { x: 0, y: 100 },
    down: { x: 0, y: -100 }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

interface BounceInProps {
  children: React.ReactNode;
}

export function BounceIn({ children }: BounceInProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode[];
  className?: string;
}

export function StaggerContainer({ children, className = "" }: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default {
  GenZLoadingScreen,
  SendingAnimation,
  SuccessAnimation,
  PageTransition,
  CardAppear,
  ShakeAnimation,
  PulseButton,
  SkeletonLoader,
  ShimmerEffect,
  ConfettiBurst,
  SlideIn,
  BounceIn,
  StaggerContainer
};