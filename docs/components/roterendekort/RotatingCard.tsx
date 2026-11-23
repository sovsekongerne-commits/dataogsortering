import React, { useState, useRef } from 'react';

export interface RotatingCardProps {
  /** Indhold vist på forsiden */
  frontContent?: React.ReactNode;
  /** Indhold vist på bagsiden */
  backContent?: React.ReactNode;
  /** Baggrundsfarve på forsiden (Tone 1 eller 2 fra COLORS.md) */
  frontBg?: string;
  /** Tekstfarve på forsiden (Tone 4 fra COLORS.md) */
  frontTextColor?: string;
  /** Baggrundsfarve på bagsiden (Tone 1 eller 2 fra COLORS.md) */
  backBg?: string;
  /** Tekstfarve på bagsiden (Tone 4 fra COLORS.md) */
  backTextColor?: string;
  /** Størrelsesklasser i Tailwind (standard 48x48 til 64x64 på sm) */
  sizeClass?: string;
  /** Callback når kortet flippes */
  onFlip?: (isFlipped: boolean) => void;
  /** Valgfri custom class */
  className?: string;
}

export const RotatingCard: React.FC<RotatingCardProps> = ({
  frontContent = '?',
  backContent = 'A',
  frontBg = '#CFE0F3',
  frontTextColor = '#29619F',
  backBg = '#FFF5C3',
  backTextColor = '#C8A700',
  sizeClass = 'w-48 h-48 sm:w-64 sm:h-64',
  onFlip,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isBlurring, setIsBlurring] = useState<boolean>(false);
  const [hoverTransform, setHoverTransform] = useState<string>('none');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (isAnimating) return;
    const randomAngle = Math.random() * 20 - 10;
    const randomY = -(Math.random() * 10 + 10);
    setHoverTransform(`translateY(${randomY}px) scale(1.05) rotate(${randomAngle}deg)`);
  };

  const handleMouseLeave = () => {
    setHoverTransform('none');
  };

  const handleClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsBlurring(true);
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    onFlip?.(nextFlipped);

    setTimeout(() => {
      setIsBlurring(false);
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label="Roterende kort"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none cursor-pointer rounded-3xl ${sizeClass} ${className}`}
      style={{
        perspective: '1000px',
        transform: isAnimating ? 'none' : hoverTransform,
        transition: 'transform 0.3s ease-out',
        minWidth: '44px',
        minHeight: '44px',
      }}
    >
      <div
        className="w-full h-full relative rounded-3xl"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s ease-in-out',
          transform: isFlipped ? 'rotateY(1980deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Forside */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl flex items-center justify-center text-6xl sm:text-7xl font-bold shadow-md"
          style={{
            backgroundColor: frontBg,
            color: frontTextColor,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span
            style={{
              transition: 'filter 0.2s linear',
              filter: isBlurring ? 'blur(4px)' : 'none',
            }}
          >
            {frontContent}
          </span>
        </div>

        {/* Bagside */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl flex items-center justify-center text-6xl sm:text-7xl font-bold shadow-md"
          style={{
            backgroundColor: backBg,
            color: backTextColor,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span
            style={{
              transition: 'filter 0.2s linear',
              filter: isBlurring ? 'blur(4px)' : 'none',
            }}
          >
            {backContent}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RotatingCard;
