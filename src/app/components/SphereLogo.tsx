interface SphereLogoProps {
  size?: number;
  className?: string;
}

export function SphereLogo({ size = 32, className = '' }: SphereLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="sphereGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#0D9488" />
        </radialGradient>
        <radialGradient id="innerGlow" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Main sphere */}
      <circle cx="20" cy="20" r="18" fill="url(#sphereGrad)" />
      {/* Inner glow highlight */}
      <circle cx="20" cy="20" r="18" fill="url(#innerGlow)" />
      {/* Equatorial ring */}
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="5"
        stroke="#C4B5FD"
        strokeWidth="1.5"
        fill="none"
        opacity="0.55"
      />
      {/* Tilted orbital ring */}
      <ellipse
        cx="20"
        cy="20"
        rx="14"
        ry="18"
        stroke="#5EEAD4"
        strokeWidth="1.2"
        fill="none"
        opacity="0.45"
        transform="rotate(30 20 20)"
      />
      {/* Highlight dot */}
      <circle cx="14" cy="13" r="3" fill="white" opacity="0.25" />
    </svg>
  );
}
