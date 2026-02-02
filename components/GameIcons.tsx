import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// --- CLASSIC THEME ---
export const AppleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 35 L 50 15" stroke="#78350f" strokeWidth="6" strokeLinecap="round"/>
    <path d="M50 35 C 50 35, 65 15, 80 25 C 80 25, 75 45, 50 35" fill="#4ade80" stroke="#15803d" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M28 42 C 6 42, 6 78, 28 92 C 42 100, 50 95, 50 95 C 50 95, 58 100, 72 92 C 94 78, 94 42, 72 42 C 62 42, 55 50, 50 50 C 45 50, 38 42, 28 42 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M70 55 Q 80 55, 80 65" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const BallIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="42" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="4"/>
    <path d="M20 50 Q 50 80, 80 50" stroke="#1d4ed8" strokeWidth="4" fill="none" opacity="0.5"/>
    <path d="M20 50 Q 50 20, 80 50" stroke="#1d4ed8" strokeWidth="4" fill="none" opacity="0.5"/>
    <ellipse cx="35" cy="35" rx="10" ry="6" fill="white" opacity="0.4" transform="rotate(-45 35 35)"/>
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 10 L 63 35 L 90 39 L 71 58 L 75 85 L 50 72 L 25 85 L 29 58 L 10 39 L 37 35 L 50 10 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="40" cy="40" r="3" fill="white" opacity="0.6"/>
  </svg>
);

export const DiceIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="15" y="15" width="70" height="70" rx="15" fill="#a855f7" stroke="#6b21a8" strokeWidth="4"/>
    <circle cx="35" cy="35" r="6" fill="white"/>
    <circle cx="65" cy="35" r="6" fill="white"/>
    <circle cx="35" cy="65" r="6" fill="white"/>
    <circle cx="65" cy="65" r="6" fill="white"/>
    <circle cx="50" cy="50" r="6" fill="white"/>
  </svg>
);

// --- ANIMAL THEME ---
export const CatIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 30 L 25 10 L 45 25" fill="#fb923c" stroke="#c2410c" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M80 30 L 75 10 L 55 25" fill="#fb923c" stroke="#c2410c" strokeWidth="4" strokeLinejoin="round"/>
    <circle cx="50" cy="55" r="35" fill="#fb923c" stroke="#c2410c" strokeWidth="4"/>
    <circle cx="35" cy="45" r="5" fill="#1e293b"/>
    <circle cx="65" cy="45" r="5" fill="#1e293b"/>
    <path d="M45 65 Q 50 70, 55 65" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M10 55 L 30 55" stroke="#7c2d12" strokeWidth="2"/>
    <path d="M90 55 L 70 55" stroke="#7c2d12" strokeWidth="2"/>
  </svg>
);

export const DogIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="25" y="25" width="50" height="50" rx="15" fill="#a16207" stroke="#713f12" strokeWidth="4"/>
    <path d="M25 35 C 10 35, 10 70, 25 60" fill="#713f12" stroke="#451a03" strokeWidth="4"/>
    <path d="M75 35 C 90 35, 90 70, 75 60" fill="#713f12" stroke="#451a03" strokeWidth="4"/>
    <circle cx="40" cy="45" r="5" fill="white"/>
    <circle cx="40" cy="45" r="2" fill="black"/>
    <circle cx="60" cy="45" r="5" fill="white"/>
    <circle cx="60" cy="45" r="2" fill="black"/>
    <path d="M45 65 Q 50 75, 55 65" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <ellipse cx="50" cy="58" rx="8" ry="5" fill="#1e293b"/>
  </svg>
);

export const FishIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M85 50 L 95 35 L 95 65 L 85 50 Z" fill="#60a5fa" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round"/>
    <ellipse cx="50" cy="50" rx="35" ry="25" fill="#60a5fa" stroke="#2563eb" strokeWidth="4"/>
    <circle cx="35" cy="45" r="4" fill="white"/>
    <circle cx="35" cy="45" r="2" fill="black"/>
    <path d="M55 40 Q 65 50, 55 60" stroke="#1d4ed8" strokeWidth="3" fill="none" opacity="0.6"/>
    <path d="M65 40 Q 75 50, 65 60" stroke="#1d4ed8" strokeWidth="3" fill="none" opacity="0.6"/>
    <circle cx="15" cy="40" r="3" fill="#bfdbfe"/>
    <circle cx="25" cy="30" r="5" fill="#bfdbfe"/>
  </svg>
);

export const BirdIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 55 L 25 45 L 25 65 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="55" cy="50" r="30" fill="#4ade80" stroke="#16a34a" strokeWidth="4"/>
    <circle cx="65" cy="40" r="4" fill="black"/>
    <path d="M40 50 L 20 70" stroke="#15803d" strokeWidth="4" strokeLinecap="round"/>
    <path d="M55 20 Q 75 5, 85 25 Q 75 35, 55 20" fill="#86efac" stroke="#16a34a" strokeWidth="3"/>
    <path d="M45 65 L 45 85" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/>
    <path d="M65 65 L 65 85" stroke="#a16207" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

// --- SUMMER THEME ---
export const SunIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="25" fill="#facc15" stroke="#eab308" strokeWidth="4"/>
    <path d="M50 10 L 50 20 M 50 80 L 50 90 M 10 50 L 20 50 M 80 50 L 90 50 M 22 22 L 29 29 M 71 71 L 78 78 M 22 78 L 29 71 M 71 29 L 78 22" stroke="#eab308" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

export const FlowerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 50 L 50 90" stroke="#16a34a" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="50" cy="50" r="15" fill="#facc15" stroke="#eab308" strokeWidth="3"/>
    <circle cx="50" cy="25" r="12" fill="#f472b6" stroke="#db2777" strokeWidth="3" opacity="0.9"/>
    <circle cx="50" cy="75" r="12" fill="#f472b6" stroke="#db2777" strokeWidth="3" opacity="0.9"/>
    <circle cx="25" cy="50" r="12" fill="#f472b6" stroke="#db2777" strokeWidth="3" opacity="0.9"/>
    <circle cx="75" cy="50" r="12" fill="#f472b6" stroke="#db2777" strokeWidth="3" opacity="0.9"/>
  </svg>
);

export const TreeIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="42" y="60" width="16" height="30" fill="#78350f" stroke="#451a03" strokeWidth="3"/>
    <path d="M50 15 L 20 55 H 80 L 50 15 Z" fill="#22c55e" stroke="#15803d" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M50 35 L 25 65 H 75 L 50 35 Z" fill="#22c55e" stroke="#15803d" strokeWidth="4" strokeLinejoin="round" transform="translate(0, -5)"/>
  </svg>
);

export const IceCreamIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 90 L 30 50 L 70 50 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M30 50 L 70 50" stroke="#d97706" strokeWidth="2"/>
    <path d="M35 55 L 65 55 M 40 65 L 60 65 M 45 75 L 55 75" stroke="#d97706" strokeWidth="1" opacity="0.5"/>
    <circle cx="50" cy="40" r="22" fill="#f9a8d4" stroke="#db2777" strokeWidth="3"/>
    <path d="M40 30 Q 45 35, 50 30" stroke="#db2777" strokeWidth="2" fill="none" opacity="0.6"/>
    <path d="M55 45 Q 60 50, 65 45" stroke="#db2777" strokeWidth="2" fill="none" opacity="0.6"/>
    <circle cx="60" cy="30" r="3" fill="white" opacity="0.6"/>
  </svg>
);

// --- VEHICLES THEME ---
export const CarIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="15" y="45" width="70" height="25" rx="5" fill="#ef4444" stroke="#991b1b" strokeWidth="3"/>
    <path d="M25 45 L 35 25 L 65 25 L 75 45 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="30" cy="70" r="10" fill="#374151" stroke="#111827" strokeWidth="3"/>
    <circle cx="30" cy="70" r="4" fill="#9ca3af"/>
    <circle cx="70" cy="70" r="10" fill="#374151" stroke="#111827" strokeWidth="3"/>
    <circle cx="70" cy="70" r="4" fill="#9ca3af"/>
  </svg>
);

export const BoatIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 60 L 30 80 L 70 80 L 80 60 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 15 L 50 60" stroke="#4b5563" strokeWidth="4"/>
    <path d="M50 15 L 80 50 L 50 50 Z" fill="#f87171" stroke="#b91c1c" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M15 85 Q 30 95, 45 85 T 75 85 T 100 85" stroke="#93c5fd" strokeWidth="4" fill="none" opacity="0.6"/>
  </svg>
);

export const PlaneIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 50 L 80 50 Q 95 50, 95 60 Q 95 70, 80 70 L 10 70 Z" fill="#f3f4f6" stroke="#4b5563" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M40 50 L 55 20 L 70 50" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M40 70 L 55 90 L 70 70" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M10 50 L 5 35 L 20 50" fill="#ef4444" stroke="#991b1b" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

export const TrainIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="25" y="30" width="50" height="40" rx="5" fill="#22c55e" stroke="#14532d" strokeWidth="3"/>
    <rect x="35" y="40" width="30" height="15" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="2"/>
    <path d="M25 70 L 75 70" stroke="#14532d" strokeWidth="3"/>
    <circle cx="35" cy="75" r="8" fill="#374151" stroke="#111827" strokeWidth="3"/>
    <circle cx="65" cy="75" r="8" fill="#374151" stroke="#111827" strokeWidth="3"/>
    <rect x="40" y="10" width="10" height="20" fill="#374151"/>
    <path d="M40 10 Q 30 5, 20 10" stroke="#9ca3af" strokeWidth="3" opacity="0.6"/>
  </svg>
);

// --- SPACE THEME ---
export const RocketIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M35 70 L 30 85 L 40 80 L 50 90 L 60 80 L 70 85 L 65 70" fill="#f97316" stroke="#c2410c" strokeWidth="2"/>
    <ellipse cx="50" cy="50" rx="15" ry="35" fill="#e2e8f0" stroke="#475569" strokeWidth="3"/>
    <circle cx="50" cy="40" r="8" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2"/>
    <path d="M35 70 L 20 80 L 35 60" fill="#ef4444" stroke="#991b1b" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M65 70 L 80 80 L 65 60" fill="#ef4444" stroke="#991b1b" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

export const PlanetIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="20" fill="#a855f7" stroke="#6b21a8" strokeWidth="3"/>
    <ellipse cx="50" cy="50" rx="40" ry="10" fill="none" stroke="#fbbf24" strokeWidth="4" transform="rotate(-20 50 50)"/>
    <path d="M30 45 Q 50 55, 70 45" stroke="#d8b4fe" strokeWidth="2" opacity="0.5"/>
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M60 20 A 30 30 0 1 1 50 80 A 20 20 0 0 0 60 20 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="40" cy="50" r="3" fill="#94a3b8" opacity="0.5"/>
    <circle cx="50" cy="65" r="4" fill="#94a3b8" opacity="0.5"/>
  </svg>
);

export const UfoIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M35 45 A 15 15 0 0 1 65 45" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <ellipse cx="50" cy="50" rx="40" ry="10" fill="#4ade80" stroke="#16a34a" strokeWidth="3"/>
    <circle cx="20" cy="50" r="2" fill="#facc15"/>
    <circle cx="50" cy="50" r="2" fill="#facc15"/>
    <circle cx="80" cy="50" r="2" fill="#facc15"/>
    <line x1="50" y1="60" x2="50" y2="80" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 2"/>
  </svg>
);

// --- FOOD THEME ---
export const PizzaIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 15 L 85 85 L 15 85 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M15 85 Q 50 95, 85 85" stroke="#a16207" strokeWidth="6" strokeLinecap="round" fill="none"/>
    <circle cx="50" cy="50" r="5" fill="#ef4444" stroke="#991b1b"/>
    <circle cx="60" cy="70" r="5" fill="#ef4444" stroke="#991b1b"/>
    <circle cx="40" cy="70" r="5" fill="#ef4444" stroke="#991b1b"/>
  </svg>
);

export const BurgerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 40 Q 50 10, 80 40" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
    <rect x="20" y="45" width="60" height="10" rx="3" fill="#4ade80" stroke="#16a34a" strokeWidth="2"/>
    <rect x="20" y="55" width="60" height="15" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2"/>
    <path d="M20 75 Q 50 85, 80 75 L 80 70 L 20 70 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="3"/>
  </svg>
);

export const DonutIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="30" fill="#fba724" stroke="#d97706" strokeWidth="3"/>
    <path d="M50 20 A 30 30 0 0 1 80 50 A 10 10 0 0 1 70 50 Q 60 40, 50 50 Q 40 60, 30 50 A 10 10 0 0 1 20 50 A 30 30 0 0 1 50 20" fill="#f472b6" stroke="#db2777" strokeWidth="2"/>
    <circle cx="50" cy="50" r="10" fill="white" stroke="#d97706" strokeWidth="2"/>
    <line x1="35" y1="35" x2="38" y2="38" stroke="white" strokeWidth="2"/>
    <line x1="65" y1="35" x2="62" y2="38" stroke="white" strokeWidth="2"/>
  </svg>
);

export const FriesIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="30" y="50" width="40" height="40" fill="#ef4444" stroke="#991b1b" strokeWidth="3"/>
    <rect x="35" y="20" width="6" height="40" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
    <rect x="47" y="15" width="6" height="45" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
    <rect x="59" y="25" width="6" height="35" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
  </svg>
);

// --- SPORTS THEME ---
export const SoccerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="35" fill="white" stroke="#1f2937" strokeWidth="3"/>
    <path d="M50 35 L 63 45 L 58 60 L 42 60 L 37 45 Z" fill="#1f2937"/>
    <path d="M50 35 L 50 15" stroke="#1f2937" strokeWidth="2"/>
    <path d="M63 45 L 80 40" stroke="#1f2937" strokeWidth="2"/>
    <path d="M37 45 L 20 40" stroke="#1f2937" strokeWidth="2"/>
    <path d="M58 60 L 65 80" stroke="#1f2937" strokeWidth="2"/>
    <path d="M42 60 L 35 80" stroke="#1f2937" strokeWidth="2"/>
  </svg>
);

export const BasketballIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="35" fill="#f97316" stroke="#c2410c" strokeWidth="3"/>
    <path d="M15 50 L 85 50" stroke="#c2410c" strokeWidth="3" fill="none"/>
    <path d="M50 15 L 50 85" stroke="#c2410c" strokeWidth="3" fill="none"/>
    <path d="M80 30 Q 50 50, 80 70" stroke="#c2410c" strokeWidth="3" fill="none"/>
    <path d="M20 30 Q 50 50, 20 70" stroke="#c2410c" strokeWidth="3" fill="none"/>
  </svg>
);

export const TennisIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="35" fill="#a3e635" stroke="#65a30d" strokeWidth="3"/>
    <path d="M30 20 Q 50 50, 30 80" stroke="white" strokeWidth="3" fill="none"/>
    <path d="M70 20 Q 50 50, 70 80" stroke="white" strokeWidth="3" fill="none"/>
  </svg>
);

export const BaseballIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="50" cy="50" r="35" fill="white" stroke="#9ca3af" strokeWidth="3"/>
    <path d="M30 20 Q 50 50, 30 80" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="4 2"/>
    <path d="M70 20 Q 50 50, 70 80" stroke="#ef4444" strokeWidth="3" fill="none" strokeDasharray="4 2"/>
  </svg>
);

// --- SCHOOL THEME ---
export const BookIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="25" y="25" width="50" height="60" rx="3" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="3"/>
    <path d="M35 35 L 65 35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M35 45 L 65 45" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <path d="M35 55 L 50 55" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="40" y="30" width="20" height="50" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
    <path d="M40 30 L 50 10 L 60 30" fill="#fecaca" stroke="#f87171" strokeWidth="2"/>
    <path d="M40 80 L 50 95 L 60 80" fill="#fde047" stroke="#ca8a04" strokeWidth="2"/>
    <path d="M48 91 L 50 95 L 52 91" fill="black"/>
    <rect x="40" y="25" width="20" height="5" fill="#9ca3af"/>
  </svg>
);

export const BackpackIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="30" y="30" width="40" height="50" rx="10" fill="#f87171" stroke="#b91c1c" strokeWidth="3"/>
    <path d="M30 40 Q 50 20, 70 40" fill="#f87171" stroke="#b91c1c" strokeWidth="3"/>
    <rect x="35" y="55" width="30" height="20" rx="5" fill="#fecaca" stroke="#b91c1c" strokeWidth="2"/>
    <path d="M45 15 Q 50 5, 55 15" stroke="#b91c1c" strokeWidth="3" fill="none"/>
  </svg>
);

export const RulerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="35" y="10" width="30" height="80" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="3"/>
    <line x1="45" y1="20" x2="35" y2="20" stroke="#ca8a04" strokeWidth="2"/>
    <line x1="45" y1="30" x2="35" y2="30" stroke="#ca8a04" strokeWidth="2"/>
    <line x1="50" y1="40" x2="35" y2="40" stroke="#ca8a04" strokeWidth="2"/>
    <line x1="45" y1="50" x2="35" y2="50" stroke="#ca8a04" strokeWidth="2"/>
    <line x1="45" y1="60" x2="35" y2="60" stroke="#ca8a04" strokeWidth="2"/>
    <line x1="50" y1="70" x2="35" y2="70" stroke="#ca8a04" strokeWidth="2"/>
  </svg>
);