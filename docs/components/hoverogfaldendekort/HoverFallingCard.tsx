import React, { useState, useEffect, useRef } from 'react';

export interface HoverFallingCardProps {
  /** Indhold i kortet (f.eks. bogstav, tal eller ikon) */
  children?: React.ReactNode;
  /** Baggrundsfarve (Tone 1 eller 2 fra COLORS.md) */
  bg?: string;
  /** Tekstfarve (Tone 4 fra COLORS.md) */
  textColor?: string;
  /** Tailwind størrelsesklasser */
  sizeClass?: string;
  /** Om fald-animationen skal igangsættes udefra (f.eks. når en runde slutter) */
  isFalling?: boolean;
  /** Forskydning / forsinkelse på animation i sekunder */
  delay?: number;
  /** Om klik på kortet skal udløse faldet */
  triggerOnClick?: boolean;
  /** Callback når kortet klikkes */
  onClick?: () => void;
  /** Callback når falde-animationen er fuldført */
  onFallComplete?: () => void;
  className?: string;
}

export const HoverFallingCard: React.FC<HoverFallingCardProps> = ({
  children = 'A',
  bg = '#F3C689',
  textColor = '#B67012',
  sizeClass = 'w-48 h-48',
  isFalling: externalIsFalling,
  delay = 0,
  triggerOnClick = true,
  onClick,
  onFallComplete,
  className = '',
}) => {
  const [internalFalling, setInternalFalling] = useState<boolean>(false);
  const [hoverTransform, setHoverTransform] = useState<string>('none');
  const [animStyle, setAnimStyle] = useState<React.CSSProperties | null>(null);
  const animIdRef = useRef<string>(`fall-anim-${Math.random().toString(36).substring(2, 9)}`);

  const isActuallyFalling = externalIsFalling ?? internalFalling;

  const handleMouseEnter = () => {
    if (isActuallyFalling) return;
    const randomAngle = Math.random() * 20 - 10;
    const randomY = -(Math.random() * 10 + 10);
    setHoverTransform(`translateY(${randomY}px) scale(1.05) rotate(${randomAngle}deg)`);
  };

  const handleMouseLeave = () => {
    setHoverTransform('none');
  };

  useEffect(() => {
    if (isActuallyFalling) {
      setHoverTransform('none');

      // Retning for det indledende hop: venstre (-1) eller højre (1)
      const initialDir = Math.random() < 0.5 ? 1 : -1;
      // Rolig, kontrolleret rotation op til peak
      const peakAngle = initialDir * (12 + Math.random() * 10);
      const peakDriftX = initialDir * (6 + Math.random() * 10);

      // Skifter rotationsretning ved peak og roterer roligt modsat under faldet
      const fallDir = -initialDir;
      const fallAngle = fallDir * (60 + Math.random() * 45);
      // Faldet driver mod den side kortet roterer til (retning og rotation matcher)
      const fallDriftX = fallDir * (70 + Math.random() * 120);
      const duration = 1.35 + Math.random() * 0.15;

      const keyframeStyle = document.createElement('style');
      keyframeStyle.id = animIdRef.current;
      keyframeStyle.innerHTML = `
        @keyframes ${animIdRef.current} {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
          }
          25% {
            /* Nå peak med let hældning */
            transform: translateY(-80px) translateX(${peakDriftX}px) rotate(${peakAngle}deg) scale(1.06);
            animation-timing-function: cubic-bezier(0.42, 0.05, 0.82, 0.55);
          }
          100% {
            /* Roterer den anden vej og falder i retning der matcher rotationen */
            transform: translateY(140vh) translateX(${fallDriftX}px) rotate(${fallAngle}deg) scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(keyframeStyle);

      setAnimStyle({
        animation: `${animIdRef.current} ${duration}s linear ${delay}s forwards`,
        opacity: 1,
        pointerEvents: 'none',
      });

      const timer = setTimeout(() => {
        onFallComplete?.();
      }, (delay + duration) * 1000);

      return () => {
        clearTimeout(timer);
        const el = document.getElementById(animIdRef.current);
        if (el) el.remove();
      };
    } else {
      setAnimStyle(null);
    }
  }, [isActuallyFalling, delay, onFallComplete]);

  const handleClick = () => {
    onClick?.();
    if (triggerOnClick && !isActuallyFalling) {
      setInternalFalling(true);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Interaktivt kort"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: bg,
        color: textColor,
        minWidth: '44px',
        minHeight: '44px',
        transform: isActuallyFalling ? undefined : hoverTransform,
        transition: isActuallyFalling ? undefined : 'transform 0.3s ease-out',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        fontFamily: "'Noto Sans', system-ui, -apple-system, sans-serif",
        ...(animStyle || {}),
      }}
      className={`rounded-3xl flex items-center justify-center font-bold shadow-lg select-none cursor-pointer font-sans ${sizeClass} ${className}`}
    >
      <span
        style={{ fontFamily: "'Noto Sans', system-ui, -apple-system, sans-serif" }}
        className="pointer-events-none select-none text-6xl sm:text-7xl font-bold font-sans"
      >
        {children}
      </span>
    </div>
  );
};

export default HoverFallingCard;
