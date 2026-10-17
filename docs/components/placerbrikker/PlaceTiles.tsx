import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface PlaceTilesProps {
  /** Liste over elementer i bunden (f.eks. ['0', '1', '2', ...] eller bogstaver) */
  items?: string[];
  /** Antal pladser i øverste række (standard 5) */
  targetSlotCount?: number;
  /** Callback når der sker ændringer i placerede brikker */
  onChange?: (placedItems: (string | null)[]) => void;
  /** Callback når alle pladser i øverste række er udfyldt */
  onComplete?: (placedItems: string[]) => void;
  className?: string;
}

const PALETTE = [
  { bg: '#FAE5C8', border: '#E2A44A', text: '#B67012' },
  { bg: '#DEEBD7', border: '#8CB973', text: '#5B8543' },
  { bg: '#CFE0F3', border: '#5893D4', text: '#29619F' },
  { bg: '#FFF5C3', border: '#FFDC2D', text: '#C8A700' },
  { bg: '#F8CACA', border: '#E84444', text: '#B21616' },
  { bg: '#CEEFF4', border: '#52C7DA', text: '#2392A5' },
  { bg: '#E6CDF5', border: '#A750DC', text: '#7323A5' },
];

const SHADOW_RESTING = '0 2px 4px -1px rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05)';
const SHADOW_LIFTED = '0 20px 25px -5px rgba(0, 0, 0, 0.28), 0 10px 10px -5px rgba(0, 0, 0, 0.16)';

interface TileData {
  id: string;
  value: string;
  colorIndex: number;
}

export const PlaceTiles: React.FC<PlaceTilesProps> = ({
  items = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  targetSlotCount = 5,
  onChange,
  onComplete,
  className = '',
}) => {
  const initialTilesRef = useRef<TileData[]>(
    items.map((val, idx) => ({
      id: `tile-${idx}-${val}`,
      value: val,
      colorIndex: idx % PALETTE.length,
    }))
  );

  const [topSlots, setTopSlots] = useState<(string | null)[]>(
    () => Array(targetSlotCount).fill(null)
  );

  const [bottomSlots, setBottomSlots] = useState<(string | null)[]>(
    () => initialTilesRef.current.map((t) => t.id)
  );

  const topSlotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomSlotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isBusyRef = useRef<boolean>(false);

  const getTileById = useCallback((id: string) => {
    return initialTilesRef.current.find((t) => t.id === id);
  }, []);

  useEffect(() => {
    const values = topSlots.map((id) => (id ? getTileById(id)?.value ?? null : null));
    onChange?.(values);

    if (topSlots.every((id) => id !== null)) {
      onComplete?.(values as string[]);
    }
  }, [topSlots, onChange, onComplete, getTileById]);

  // Skaber et animeret klon-element med fastlåst Noto Sans-typografi og præcise dimensioner
  const createTileElement = (tile: TileData, width: number, height: number): HTMLDivElement => {
    const palette = PALETTE[tile.colorIndex];
    const el = document.createElement('div');
    el.className =
      'fixed rounded-xl flex items-center justify-center select-none z-50 pointer-events-none';
    el.style.backgroundColor = palette.bg;
    el.style.borderColor = palette.border;
    el.style.color = palette.text;
    el.style.borderWidth = '2px';
    el.style.borderBottomWidth = '4px';
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.boxShadow = SHADOW_RESTING;
    el.style.fontFamily = "'Noto Sans', system-ui, -apple-system, sans-serif";
    el.style.fontWeight = '700';
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';

    const span = document.createElement('span');
    span.textContent = tile.value;
    span.style.fontFamily = "'Noto Sans', system-ui, -apple-system, sans-serif";
    span.style.fontWeight = '700';
    span.style.fontSize = width >= 60 ? '1.875rem' : '1.5rem';
    span.style.lineHeight = '1';
    span.style.pointerEvents = 'none';
    span.style.userSelect = 'none';
    span.style.webkitUserSelect = 'none';
    el.appendChild(span);

    return el;
  };

  // Ubrudt fald-og-slynge bevægelse: faldet stoppes ved at brikken svinger glidende tilbage på plads
  const animateSlingBack = (
    fromCenter: { x: number; y: number },
    startAngle: number,
    toRect: DOMRect,
    tile: TileData,
    onFinish: () => void
  ) => {
    const width = toRect.width;
    const height = toRect.height;
    const targetCenter = {
      x: toRect.left + width / 2,
      y: toRect.top + height / 2,
    };

    const el = createTileElement(tile, width, height);
    el.style.transformOrigin = 'center center';
    el.style.boxShadow = SHADOW_LIFTED;
    document.body.appendChild(el);

    const P0 = { x: fromCenter.x, y: fromCenter.y };
    const P3 = { x: targetCenter.x, y: targetCenter.y };

    // Faldets dybde og sideværts drift afstemt med startvinklen
    const fallDepth = 85 + Math.random() * 20;
    const driftX = startAngle * 2.2 + (Math.random() - 0.5) * 15;

    // P1 trækker brikken direkte nedad (fald starter straks)
    const P1 = {
      x: P0.x + driftX * 0.6,
      y: P0.y + fallDepth * 1.15,
    };

    // P2 fanger faldet i bunden og guider buen jævnt opad mod målet uden stop
    const midX = P0.x + (P3.x - P0.x) * 0.55;
    const bottomY = Math.max(P1.y, P3.y + 35);
    const P2 = {
      x: midX + driftX * 0.4,
      y: bottomY,
    };

    const durationMs = 640;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Ease-out profil giver god startfart i faldet og blød landing ved målet
      const t = progress * (2 - progress);

      // Kubisk Bezier formel for kontinuerlig kurve uden stop
      const mt = 1 - t;
      const curX =
        mt * mt * mt * P0.x +
        3 * mt * mt * t * P1.x +
        3 * mt * t * t * P2.x +
        t * t * t * P3.x;
      const curY =
        mt * mt * mt * P0.y +
        3 * mt * mt * t * P1.y +
        3 * mt * t * t * P2.y +
        t * t * t * P3.y;

      el.style.left = `${curX - width / 2}px`;
      el.style.top = `${curY - height / 2}px`;

      // Skala skrumper jævnt fra 1.18 til 1.0
      const curScale = 1.18 - progress * 0.18;
      // Vinkel retter sig glidende ud mod 0deg
      const curAngle = startAngle * (1 - progress);
      el.style.transform = `rotate(${curAngle}deg) scale(${curScale})`;

      // Skyggen fader glidende fra LIFTED til RESTING
      const shadowWeight = 1 - progress;
      const blur = Math.round(4 + shadowWeight * 18);
      const yOff = Math.round(2 + shadowWeight * 16);
      const alpha = (0.06 + shadowWeight * 0.2).toFixed(3);
      el.style.boxShadow = `0 ${yOff}px ${blur}px rgba(0, 0, 0, ${alpha}), 0 1px 2px rgba(0, 0, 0, 0.05)`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.remove();
        onFinish();
      }
    };

    requestAnimationFrame(frame);
  };

  // Glider hen på plads OG animerer samtidig synlig skrumpning og skygge-fade
  const animateGlideToSlot = (
    fromCenter: { x: number; y: number },
    startAngle: number,
    startScale: number,
    toEl: HTMLElement,
    tile: TileData,
    onFinish: () => void
  ) => {
    const toRect = toEl.getBoundingClientRect();
    const width = toRect.width;
    const height = toRect.height;

    const el = createTileElement(tile, width, height);
    const startLeft = fromCenter.x - width / 2;
    const startTop = fromCenter.y - height / 2;

    el.style.left = `${startLeft}px`;
    el.style.top = `${startTop}px`;
    el.style.transformOrigin = 'center center';
    el.style.transform = `rotate(${startAngle}deg) scale(${startScale})`;
    el.style.boxShadow = startScale > 1.05 ? SHADOW_LIFTED : SHADOW_RESTING;
    // Brikken glider, skrumper og fader skyggen ud samtidigt
    el.style.transition =
      'transform 0.38s cubic-bezier(0.2, 0.9, 0.32, 1), box-shadow 0.38s cubic-bezier(0.2, 0.9, 0.32, 1)';
    document.body.appendChild(el);

    const dx = toRect.left - startLeft;
    const dy = toRect.top - startTop;

    requestAnimationFrame(() => {
      // Skrumper synligt og fader skygge ud ved landing
      el.style.transform = `translate(${dx}px, ${dy}px) rotate(0deg) scale(1)`;
      el.style.boxShadow = SHADOW_RESTING;
    });

    setTimeout(() => {
      el.remove();
      onFinish();
    }, 390);
  };

  // Brikker der flyttes fordi en anden brik lægges oven på dem (glider roligt i fast scale 1)
  const animateDisplacedGlide = (
    tileId: string,
    fromRect: DOMRect,
    toEl: HTMLElement,
    onFinish: () => void
  ) => {
    const tile = getTileById(tileId);
    if (!tile) {
      onFinish();
      return;
    }

    const toRect = toEl.getBoundingClientRect();
    const el = createTileElement(tile, fromRect.width, fromRect.height);
    el.style.left = `${fromRect.left}px`;
    el.style.top = `${fromRect.top}px`;
    el.style.transform = 'scale(1)'; // Forbliver i normal størrelse uden at vokse/skrumpe
    el.style.transition = 'transform 0.36s cubic-bezier(0.25, 1, 0.5, 1)';
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;
    });

    setTimeout(() => {
      el.remove();
      onFinish();
    }, 370);
  };

  // Drag & drop
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    tileId: string,
    fromLocation: 'top' | 'bottom',
    fromIndex: number
  ) => {
    if (isBusyRef.current) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const tile = getTileById(tileId);
    if (!tile) return;

    const currentTarget = e.currentTarget;
    const rect = currentTarget.getBoundingClientRect();

    // Grebspunkt 1/3 fra toppen så finger/mus ikke dækker teksten
    const grabOffsetY = rect.height / 3;
    const grabOffsetX = rect.width / 2;

    const dragData = {
      tileId,
      fromLocation,
      fromIndex,
      startX: e.clientX,
      startY: e.clientY,
      hasDragged: false,
      pos: { x: rect.left, y: rect.top },
      target: { x: e.clientX - grabOffsetX, y: e.clientY - grabOffsetY },
      vel: { x: 0, y: 0 },
      angle: 0,
      angleVel: 0,
      rafId: null as number | null,
      ghostEl: null as HTMLDivElement | null,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const dist = Math.hypot(moveEvt.clientX - dragData.startX, moveEvt.clientY - dragData.startY);

      if (!dragData.hasDragged && dist > 6) {
        dragData.hasDragged = true;

        // Fjern brikken fra dens oprindelige plads i listen med det samme, så pladsen bliver tom
        if (fromLocation === 'top') {
          setTopSlots((prev) => {
            const next = [...prev];
            next[fromIndex] = null;
            return next;
          });
        } else {
          setBottomSlots((prev) => {
            const next = [...prev];
            next[fromIndex] = null;
            return next;
          });
        }

        // Brik og tekst oprettes og vokser blødt ved greb mens skyggen fader ind
        const ghost = createTileElement(tile, rect.width, rect.height);
        ghost.style.transformOrigin = 'center top';
        ghost.style.left = `${dragData.pos.x}px`;
        ghost.style.top = `${dragData.pos.y}px`;
        ghost.style.transform = 'scale(1)';
        ghost.style.boxShadow = SHADOW_RESTING;
        ghost.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.24s ease-out';

        document.body.appendChild(ghost);
        dragData.ghostEl = ghost;

        requestAnimationFrame(() => {
          if (ghost) {
            ghost.style.transform = 'scale(1.18)';
            ghost.style.boxShadow = SHADOW_LIFTED;
          }
        });

        // Fysik loop: Glider roligt så fingeren/markøren holdes præcis 1/3 fra toppen af brikken
        const physicsLoop = () => {
          if (!dragData.ghostEl) return;
          const spring = 0.28;
          const friction = 0.52;

          const dx = dragData.target.x - dragData.pos.x;
          const dy = dragData.target.y - dragData.pos.y;

          dragData.vel.x += dx * spring;
          dragData.vel.y += dy * spring;

          dragData.vel.x *= friction;
          dragData.vel.y *= friction;

          dragData.pos.x += dragData.vel.x;
          dragData.pos.y += dragData.vel.y;

          const angleTarget = dragData.vel.x * 0.22;
          dragData.angleVel += (angleTarget - dragData.angle) * spring;
          dragData.angleVel *= friction * 1.1;
          dragData.angle += dragData.angleVel;

          dragData.ghostEl.style.left = `${dragData.pos.x}px`;
          dragData.ghostEl.style.top = `${dragData.pos.y}px`;
          dragData.ghostEl.style.transform = `rotate(${dragData.angle}deg) scale(1.18)`;

          dragData.rafId = requestAnimationFrame(physicsLoop);
        };

        dragData.rafId = requestAnimationFrame(physicsLoop);
      }

      if (dragData.hasDragged) {
        // Opdater target altid 1/3 fra toppen
        dragData.target.x = moveEvt.clientX - grabOffsetX;
        dragData.target.y = moveEvt.clientY - grabOffsetY;
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (dragData.rafId) cancelAnimationFrame(dragData.rafId);

      // Rent klik (ikke flyttet)
      if (!dragData.hasDragged) {
        handleTileClick(tileId, fromLocation, fromIndex);
        return;
      }

      const ghost = dragData.ghostEl;
      if (!ghost) return;

      const ghostRect = ghost.getBoundingClientRect();
      const ghostCenter = {
        x: ghostRect.left + ghostRect.width / 2,
        y: ghostRect.top + ghostRect.height / 2,
      };
      const ghostAngle = dragData.angle;
      ghost.remove();

      // Find overlap med pladser
      let targetDrop: { type: 'top' | 'bottom'; index: number } | null = null;
      let maxOverlap = 0;

      const checkOverlap = (el: HTMLElement | null, type: 'top' | 'bottom', index: number) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const xOverlap = Math.max(0, Math.min(ghostRect.right, r.right) - Math.max(ghostRect.left, r.left));
        const yOverlap = Math.max(0, Math.min(ghostRect.bottom, r.bottom) - Math.max(ghostRect.top, r.top));
        const area = xOverlap * yOverlap;
        if (area > maxOverlap && area > (r.width * r.height) / 4) {
          maxOverlap = area;
          targetDrop = { type, index };
        }
      };

      topSlotRefs.current.forEach((el, idx) => checkOverlap(el, 'top', idx));
      bottomSlotRefs.current.forEach((el, idx) => checkOverlap(el, 'bottom', idx));

      // CASE 1: UGYLDIG PLACERING
      // Faldet bremses og vendes af tilbagesvinget i én ubrudt, flydende bevægelse uden stop
      if (!targetDrop) {
        isBusyRef.current = true;
        const originEl =
          fromLocation === 'top'
            ? topSlotRefs.current[fromIndex]
            : bottomSlotRefs.current[fromIndex];

        if (!originEl) {
          isBusyRef.current = false;
          return;
        }

        const origRect = originEl.getBoundingClientRect();
        animateSlingBack(ghostCenter, ghostAngle, origRect, tile, () => {
          if (fromLocation === 'top') {
            setTopSlots((prev) => {
              const next = [...prev];
              next[fromIndex] = tileId;
              return next;
            });
          } else {
            setBottomSlots((prev) => {
              const next = [...prev];
              next[fromIndex] = tileId;
              return next;
            });
          }
          isBusyRef.current = false;
        });

        return;
      }

      // CASE 2: KORREKT PLACERING
      const dest = targetDrop as { type: 'top' | 'bottom'; index: number };
      isBusyRef.current = true;

      // DROP I TOPPEN
      if (dest.type === 'top') {
        const existingTopTileId = topSlots[dest.index];
        const destSlotEl = topSlotRefs.current[dest.index]!;

        // Hvis feltet i toppen allerede indeholder en anden brik:
        if (existingTopTileId) {
          const displacedRect = destSlotEl.getBoundingClientRect();

          // 1. Fjern øjeblikkeligt den eksisterende brik fra målfeltet i state
          setTopSlots((prev) => {
            const next = [...prev];
            next[dest.index] = null;
            return next;
          });

          // 2. Find ledig plads i bunden til den fordrevne brik
          const origBottomIdx = initialTilesRef.current.findIndex((t) => t.id === existingTopTileId);
          let targetBottomIdx = origBottomIdx;
          if (bottomSlots[origBottomIdx] !== null) {
            const emptyIndices = bottomSlots
              .map((val, idx) => (val === null ? idx : -1))
              .filter((idx) => idx !== -1);
            if (emptyIndices.length > 0) {
              targetBottomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            }
          }
          const targetBottomEl = bottomSlotRefs.current[targetBottomIdx] || bottomSlotRefs.current[0]!;

          // 3. Start begge animationer:
          // Brik A glider ind i målfeltet og skrumper til scale(1)
          animateGlideToSlot(ghostCenter, ghostAngle, 1.18, destSlotEl, tile, () => {
            setTopSlots((prev) => {
              const next = [...prev];
              next[dest.index] = tileId;
              return next;
            });
            isBusyRef.current = false;
          });

          // Brik B glider roligt tilbage til sin plads i bunden i fast scale(1)
          animateDisplacedGlide(existingTopTileId, displacedRect, targetBottomEl, () => {
            setBottomSlots((b) => {
              const n = [...b];
              n[targetBottomIdx] = existingTopTileId;
              return n;
            });
          });

          return;
        }

        // Hvis feltet i toppen er tomt:
        animateGlideToSlot(ghostCenter, ghostAngle, 1.18, destSlotEl, tile, () => {
          setTopSlots((prev) => {
            const next = [...prev];
            next[dest.index] = tileId;
            return next;
          });
          isBusyRef.current = false;
        });
      } else {
        // DROP I BUNDEN
        const existingBottomTileId = bottomSlots[dest.index];
        const destSlotEl = bottomSlotRefs.current[dest.index]!;

        // Hvis bundfeltet allerede er optaget:
        if (existingBottomTileId) {
          const displacedRect = destSlotEl.getBoundingClientRect();
          const originEl =
            fromLocation === 'top'
              ? topSlotRefs.current[fromIndex]!
              : bottomSlotRefs.current[fromIndex]!;

          // 1. Fjern øjeblikkeligt den eksisterende brik fra feltet i state
          setBottomSlots((prev) => {
            const next = [...prev];
            next[dest.index] = null;
            return next;
          });

          // 2. Brik A glider ind i bundfeltet og skrumper til scale(1)
          animateGlideToSlot(ghostCenter, ghostAngle, 1.18, destSlotEl, tile, () => {
            setBottomSlots((prev) => {
              const next = [...prev];
              next[dest.index] = tileId;
              return next;
            });
            isBusyRef.current = false;
          });

          // 3. Brik B glider hen til den plads som Brik A kom fra (bytte) i fast scale(1)
          animateDisplacedGlide(existingBottomTileId, displacedRect, originEl, () => {
            if (fromLocation === 'top') {
              setTopSlots((prev) => {
                const next = [...prev];
                next[fromIndex] = existingBottomTileId;
                return next;
              });
            } else {
              setBottomSlots((prev) => {
                const next = [...prev];
                next[fromIndex] = existingBottomTileId;
                return next;
              });
            }
          });

          return;
        }

        // Hvis bundfeltet er tomt:
        animateGlideToSlot(ghostCenter, ghostAngle, 1.18, destSlotEl, tile, () => {
          setBottomSlots((prev) => {
            const next = [...prev];
            next[dest.index] = tileId;
            return next;
          });
          isBusyRef.current = false;
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Klik-og-flyv
  const handleTileClick = (tileId: string, fromLocation: 'top' | 'bottom', fromIndex: number) => {
    if (isBusyRef.current) return;
    const tile = getTileById(tileId);
    if (!tile) return;

    if (fromLocation === 'bottom') {
      const firstEmptyTopIndex = topSlots.findIndex((s) => s === null);
      if (firstEmptyTopIndex === -1) return;

      const fromEl = bottomSlotRefs.current[fromIndex];
      const toEl = topSlotRefs.current[firstEmptyTopIndex];
      if (!fromEl || !toEl) return;

      isBusyRef.current = true;
      const fromRect = fromEl.getBoundingClientRect();
      const fromCenter = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2,
      };

      setBottomSlots((prev) => {
        const next = [...prev];
        next[fromIndex] = null;
        return next;
      });

      animateGlideToSlot(fromCenter, 0, 1, toEl, tile, () => {
        setTopSlots((prev) => {
          const next = [...prev];
          next[firstEmptyTopIndex] = tileId;
          return next;
        });
        isBusyRef.current = false;
      });
    } else {
      const originalIndex = initialTilesRef.current.findIndex((t) => t.id === tileId);
      const targetBottomIndex =
        bottomSlots[originalIndex] === null
          ? originalIndex
          : bottomSlots.findIndex((s) => s === null);

      if (targetBottomIndex === -1) return;

      const fromEl = topSlotRefs.current[fromIndex];
      const toEl = bottomSlotRefs.current[targetBottomIndex];
      if (!fromEl || !toEl) return;

      isBusyRef.current = true;
      const fromRect = fromEl.getBoundingClientRect();
      const fromCenter = {
        x: fromRect.left + fromRect.width / 2,
        y: fromRect.top + fromRect.height / 2,
      };

      setTopSlots((prev) => {
        const next = [...prev];
        next[fromIndex] = null;
        return next;
      });

      animateGlideToSlot(fromCenter, 0, 1, toEl, tile, () => {
        setBottomSlots((prev) => {
          const next = [...prev];
          next[targetBottomIndex] = tileId;
          return next;
        });
        isBusyRef.current = false;
      });
    }
  };

  const renderTile = (tileId: string, fromLoc: 'top' | 'bottom', slotIdx: number) => {
    const tile = getTileById(tileId);
    if (!tile) return null;
    const p = PALETTE[tile.colorIndex];

    return (
      <div
        onPointerDown={(e) => handlePointerDown(e, tileId, fromLoc, slotIdx)}
        role="button"
        tabIndex={0}
        aria-label={`Brik ${tile.value}`}
        style={{
          backgroundColor: p.bg,
          borderColor: p.border,
          color: p.text,
          borderWidth: '2px',
          borderBottomWidth: '4px',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          fontFamily: "'Noto Sans', system-ui, -apple-system, sans-serif",
          fontWeight: 700,
          boxShadow: SHADOW_RESTING,
          transition: 'transform 0.18s ease-out, box-shadow 0.22s ease-out',
        }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-bold select-none cursor-grab active:cursor-grabbing hover:-translate-y-1 leading-none"
      >
        <span
          style={{ fontFamily: "'Noto Sans', system-ui, -apple-system, sans-serif", fontWeight: 700 }}
          className="pointer-events-none select-none text-2xl md:text-3xl font-bold leading-none"
        >
          {tile.value}
        </span>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-3xl shadow-md border border-stone-200 select-none ${className}`}>
      {/* Mål-række (øverst): Kassen med stiplede linjer ses kun når der IKKE er en brik */}
      <div className="bg-stone-50 border-2 border-stone-200 border-dashed rounded-2xl p-4 mb-6 flex items-center justify-center flex-wrap gap-3 min-h-[88px]">
        {topSlots.map((tileId, idx) => (
          <div
            key={`top-${idx}`}
            ref={(el) => { topSlotRefs.current[idx] = el; }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              tileId !== null
                ? 'bg-transparent border-transparent'
                : 'border-2 border-dashed border-stone-300 bg-stone-100'
            }`}
          >
            {tileId ? renderTile(tileId, 'top', idx) : null}
          </div>
        ))}
      </div>

      {/* Valg-række (nederst) */}
      <div className="p-4 bg-stone-100 rounded-2xl flex items-center justify-center flex-wrap gap-2 sm:gap-3">
        {bottomSlots.map((tileId, idx) => (
          <div
            key={`bottom-${idx}`}
            ref={(el) => { bottomSlotRefs.current[idx] = el; }}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              tileId !== null
                ? 'bg-transparent border-transparent'
                : 'border-2 border-dashed border-stone-300 bg-stone-200/50'
            }`}
          >
            {tileId ? renderTile(tileId, 'bottom', idx) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaceTiles;
