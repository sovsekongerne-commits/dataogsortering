import React, { useState, useEffect, useRef, useCallback } from 'react';
import './settingsMenu.css';

export type SettingsContext = 'main-menu' | 'game' | 'game-direct' | 'all';

export interface SettingsMenuProps {
  /** Kontekst for menuen ('main-menu' | 'game' | 'game-direct' | 'all') - standard: 'main-menu' */
  context?: SettingsContext;
  /** Callback ved tryk på Tilbage (pil) */
  onBack?: () => void;
  /** Callback ved tryk på Hovedmenu (hus) */
  onHome?: () => void;
  /** Callback ved tryk på Hjælp */
  onHelp?: () => void;
  /** Callback ved tryk på Afslut - hvis ikke angivet, navigeres til returnUrl eller kongskole.dk */
  onExit?: () => void;
  /** Valgfri retur-URL ved afslut */
  returnUrl?: string | null;
  /** Kontrolleret eller initial lydtilstand (standard: true) */
  isAudioEnabled?: boolean;
  /** Callback når lydtilstand ændres */
  onAudioChange?: (enabled: boolean) => void;
  /** Kontrolleret eller initial dysleksitilstand (standard: false) */
  isDyslexiaEnabled?: boolean;
  /** Callback når dysleksitilstand ændres */
  onDyslexiaChange?: (enabled: boolean) => void;
  /** Valgfrit CSS klassenavn til containeren */
  className?: string;
  /** Valgfri inline styles til containeren */
  style?: React.CSSProperties;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  context = 'main-menu',
  onBack,
  onHome,
  onHelp,
  onExit,
  returnUrl,
  isAudioEnabled: controlledAudio,
  onAudioChange,
  isDyslexiaEnabled: controlledDyslexia,
  onDyslexiaChange,
  className = '',
  style,
}) => {
  // 1. STATE MANAGEMENT
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(controlledAudio ?? true);
  const [dyslexiaEnabled, setDyslexiaEnabled] = useState<boolean>(controlledDyslexia ?? false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [canFullscreen, setCanFullscreen] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{
    isDragging: boolean;
    startX: number;
    startScrollLeft: number;
    hasMoved: boolean;
  }>({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    hasMoved: false,
  });

  // Synkroniser kontrollerede props hvis de ændres udefra
  useEffect(() => {
    if (controlledAudio !== undefined) {
      setAudioEnabled(controlledAudio);
    }
  }, [controlledAudio]);

  useEffect(() => {
    if (controlledDyslexia !== undefined) {
      setDyslexiaEnabled(controlledDyslexia);
      if (typeof document !== 'undefined') {
        if (controlledDyslexia) {
          document.body.classList.add('dyslexia-mode');
        } else {
          document.body.classList.remove('dyslexia-mode');
        }
      }
    }
  }, [controlledDyslexia]);

  // Udsend CustomEvents på document for bagudkompatibilitet
  const emitEvent = useCallback((eventName: string, detail: Record<string, unknown>) => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent(`settings:${eventName}`, { detail }));
    }
  }, []);

  // Fullscreen support detektering og change listener
  useEffect(() => {
    if (typeof document === 'undefined') return;

    setCanFullscreen(Boolean(document.fullscreenEnabled));

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation: Escape lukker modal eller menu
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isModalOpen) {
          closeModal();
        } else if (isOpen) {
          closeMenu();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, isOpen]);

  // 2. HANDLINGER
  const openMenu = () => {
    setIsOpen(true);
    emitEvent('open', { isOpen: true });
  };

  const closeMenu = () => {
    setIsOpen(false);
    emitEvent('close', { isOpen: false });
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleToggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (onAudioChange) onAudioChange(nextState);
    emitEvent('audio', { isAudioEnabled: nextState });
  };

  const handleToggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Ignorer fejl hvis browser blokerer fuldskærm
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          // Ignorer fejl
        });
      }
    }
  };

  const handleToggleDyslexia = () => {
    const nextState = !dyslexiaEnabled;
    setDyslexiaEnabled(nextState);
    if (typeof document !== 'undefined') {
      if (nextState) {
        document.body.classList.add('dyslexia-mode');
      } else {
        document.body.classList.remove('dyslexia-mode');
      }
    }
    if (onDyslexiaChange) onDyslexiaChange(nextState);
    emitEvent('dyslexia', { isDyslexiaEnabled: nextState });
  };

  const openModal = () => {
    setIsModalOpen(true);
    emitEvent('modalOpen', {});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    emitEvent('modalClose', {});
  };

  const handleBackClick = () => {
    emitEvent('back', {});
    if (onBack) onBack();
  };

  const handleHomeClick = () => {
    emitEvent('home', {});
    if (onHome) onHome();
  };

  const handleHelpClick = () => {
    emitEvent('help', {});
    if (onHelp) onHelp();
  };

  const handleExitClick = () => {
    emitEvent('exit', {});
    if (onExit) {
      onExit();
      return;
    }

    // Standard Kongskole retur-logik
    let effectiveReturn = returnUrl;
    if (!effectiveReturn && typeof sessionStorage !== 'undefined') {
      try {
        effectiveReturn = sessionStorage.getItem('kongskole_return_url');
      } catch {
        // Ignorer storage fejl
      }
    }

    if (effectiveReturn) {
      window.location.href = effectiveReturn;
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else if (typeof window !== 'undefined') {
      window.location.href = 'https://kongskole.dk';
    }
  };

  // 3. HORISONTAL SCROLL (Musehjul & Drag-to-scroll)
  useEffect(() => {
    const menuEl = menuContentRef.current;
    if (!menuEl) return;

    // Konverter vertikal hjulrulning til horisontal scrolling
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        menuEl.scrollLeft += e.deltaY;
      }
    };

    menuEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      menuEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !menuContentRef.current) return;
    dragInfoRef.current = {
      isDragging: true,
      startX: e.pageX - menuContentRef.current.offsetLeft,
      startScrollLeft: menuContentRef.current.scrollLeft,
      hasMoved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragInfoRef.current.isDragging || !menuContentRef.current) return;
    const currentX = e.pageX - menuContentRef.current.offsetLeft;
    const distance = currentX - dragInfoRef.current.startX;
    if (Math.abs(distance) > 3) {
      dragInfoRef.current.hasMoved = true;
    }
    menuContentRef.current.scrollLeft = dragInfoRef.current.startScrollLeft - distance;
  };

  const handleMouseUp = () => {
    dragInfoRef.current.isDragging = false;
  };

  // Undgå utilsigtet klik, hvis brugeren har dragget for at scrolle
  const handleItemClickCapture = (e: React.MouseEvent) => {
    if (dragInfoRef.current.hasMoved) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // 4. KONTEKST SYNLIGHED
  const showBack = context === 'game' || context === 'all';
  const showHome = context === 'game-direct' || context === 'all';
  const showAudio = true;
  const showFullscreen = canFullscreen;
  const showHelp = context === 'game' || context === 'game-direct' || context === 'all';
  const showDyslexia = true;
  const showInfo = context === 'main-menu' || context === 'all';
  const showExit = true;

  // Global window API eksponering for AI / eksterne scripts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const api = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        setAudio: (enable?: boolean) => {
          const next = typeof enable === 'boolean' ? enable : !audioEnabled;
          setAudioEnabled(next);
          if (onAudioChange) onAudioChange(next);
        },
        setDyslexia: (enable?: boolean) => {
          const next = typeof enable === 'boolean' ? enable : !dyslexiaEnabled;
          setDyslexiaEnabled(next);
          if (typeof document !== 'undefined') {
            if (next) {
              document.body.classList.add('dyslexia-mode');
            } else {
              document.body.classList.remove('dyslexia-mode');
            }
          }
          if (onDyslexiaChange) onDyslexiaChange(next);
        },
        openInfoModal: openModal,
        closeInfoModal: closeModal,
        getState: () => ({
          isOpen,
          isAudioEnabled: audioEnabled,
          isDyslexiaEnabled: dyslexiaEnabled,
          context,
          isModalOpen,
        }),
      };
      (window as unknown as { SettingsMenu: typeof api }).SettingsMenu = api;
    }
  }, [isOpen, audioEnabled, dyslexiaEnabled, context, isModalOpen, onAudioChange, onDyslexiaChange]);

  return (
    <>
      <div
        ref={containerRef}
        className={`settings-menu-container ${dyslexiaEnabled ? 'is-dyslexia' : ''} ${className}`}
        data-context={context}
        style={style}
      >
        <div className={`settings-background ${isOpen ? 'is-open' : ''}`}>
          {/* Tandhjuls-knap (Sticky Trigger) */}
          <button
            type="button"
            className="settings-trigger"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
            aria-label="Åbn eller luk indstillinger"
            title="Indstillinger"
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Menupunkter med horisontal scroll */}
          <div
            ref={menuContentRef}
            className="settings-menu-content"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClickCapture={handleItemClickCapture}
          >
            {/* 1a. Tilbage */}
            {showBack && (
              <button
                type="button"
                className="settings-menu-item back-btn"
                onClick={handleBackClick}
                aria-label="Gå tilbage"
                title="Tilbage"
              >
                <svg viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Tilbage</span>
              </button>
            )}

            {/* 1b. Hovedmenu */}
            {showHome && (
              <button
                type="button"
                className="settings-menu-item home-btn"
                onClick={handleHomeClick}
                aria-label="Gå til hovedmenu"
                title="Hovedmenu"
              >
                <svg viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span>Hovedmenu</span>
              </button>
            )}

            {/* 2. Lyd */}
            {showAudio && (
              <button
                type="button"
                className={`settings-menu-item audio-btn ${!audioEnabled ? 'is-muted' : ''}`}
                onClick={handleToggleAudio}
                aria-label="Slå lyd til eller fra"
                title="Lyd til/fra"
              >
                <div className="settings-icon-wrapper">
                  {audioEnabled ? (
                    <svg viewBox="0 0 24 24">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </div>
                <span>Lyd</span>
              </button>
            )}

            {/* 3. Fuldskærm */}
            {showFullscreen && (
              <button
                type="button"
                className="settings-menu-item fullscreen-btn"
                onClick={handleToggleFullscreen}
                aria-label="Slå fuldskærm til eller fra"
                title="Fuldskærm"
              >
                <div className="settings-icon-wrapper">
                  {!isFullscreen ? (
                    <svg className="fs-enter" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  ) : (
                    <svg className="fs-exit" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                    </svg>
                  )}
                </div>
                <span>Fuldskærm</span>
              </button>
            )}

            {/* 4. Hjælp */}
            {showHelp && (
              <button
                type="button"
                className="settings-menu-item help-btn"
                onClick={handleHelpClick}
                aria-label="Få hjælp til spillet"
                title="Hjælp"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
                <span>Hjælp</span>
              </button>
            )}

            {/* 5. Dysleksi */}
            {showDyslexia && (
              <button
                type="button"
                className={`settings-menu-item dyslexia-btn ${dyslexiaEnabled ? 'is-active' : ''}`}
                onClick={handleToggleDyslexia}
                aria-label="Slå dysleksivenlig tekst til eller fra"
                title="Dysleksivenlig tekst"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M2 19L6 5L10 19" />
                  <path d="M4 14H8" />
                  <path d="M15 10c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5v9" />
                  <path d="M21 14.5a3 3 0 1 0 0 4.5" />
                </svg>
                <span>Dysleksi</span>
              </button>
            )}

            {/* 6. Info */}
            {showInfo && (
              <button
                type="button"
                className="settings-menu-item info-btn"
                onClick={openModal}
                aria-label="Vis information og credits"
                title="Information"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
                <span>Info</span>
              </button>
            )}

            {/* 7. Afslut */}
            {showExit && (
              <button
                type="button"
                className="settings-menu-item logout-btn"
                onClick={handleExitClick}
                aria-label="Afslut"
                title="Afslut"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Afslut</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Pop-up Modal */}
      <div
        className={`settings-modal-overlay ${isModalOpen ? 'is-visible' : ''} ${
          dyslexiaEnabled ? 'is-dyslexia' : ''
        }`}
        aria-hidden={!isModalOpen}
        role="dialog"
        aria-labelledby="settings-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        <div className="settings-modal-card">
          <div className="settings-modal-header">
            <div className="settings-modal-title-wrapper">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
              </svg>
              <h2 id="settings-modal-title" className="settings-modal-title">
                Information
              </h2>
            </div>
            <button
              type="button"
              className="settings-modal-close-btn"
              onClick={closeModal}
              aria-label="Luk informationsvindue"
            >
              <svg viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="settings-modal-body">
            <div className="settings-modal-section-title">Ophavsret</div>
            <div className="settings-modal-credits-box">
              <p>
                <strong>
                  Copyright &copy;{' '}
                  <a href="https://kongskole.dk" target="_blank" rel="noopener noreferrer">
                    Kongskole.dk
                  </a>
                </strong>{' '}
                – Alle rettigheder forbeholdes.
              </p>
            </div>

            <div className="settings-modal-section-title">Credits &amp; Licenser</div>
            <div className="settings-modal-credits-box">
              <p>
                <strong>OpenDyslexic</strong>
                <br />
                Skrifttypen er udviklet for at øge læsbarheden for personer med dysleksi og er licenseret under SIL Open Font License (OFL).
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Grafik &amp; Ikoner</strong>
                <br />
                Dele af programmets grafik er baseret på Fluent UI System Icons af Microsoft Corporation.
                <br />
                Licenseret under MIT-licensen.
                <br />
                Copyright &copy; 2020 Microsoft Corporation
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Noto Fonts</strong>
                <br />
                Copyright &copy; 2022 The Noto Project Authors (
                <a
                  href="https://github.com/notofonts/latin-greek-cyrillic"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/notofonts/latin-greek-cyrillic
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Unbounded</strong>
                <br />
                Copyright &copy; 2022 The Unbounded Project Authors (
                <a
                  href="https://github.com/googlefonts/unbounded"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/googlefonts/unbounded
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Bungee</strong>
                <br />
                Copyright &copy; 2023 The Bungee Project Authors (
                <a
                  href="https://github.com/djrrb/Bungee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/djrrb/Bungee
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Isometra</strong>
                <br />
                Copyright &copy; 2025 The Isometra Project Authors (
                <a
                  href="https://github.com/field2/isometra"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/field2/isometra
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Cinzel</strong>
                <br />
                Copyright &copy; 2020 The Cinzel Project Authors (
                <a
                  href="https://github.com/NDISCOVER/Cinzel"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/NDISCOVER/Cinzel
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Rubik Filtered</strong>
                <br />
                Copyright &copy; 2020 The Rubik Filtered Project Authors (
                <a
                  href="https://github.com/NaN-xyz/Rubik-Filtered"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/NaN-xyz/Rubik-Filtered
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>

              <div className="settings-credit-divider" />

              <p>
                <strong>Protest</strong>
                <br />
                Copyright &copy; 2013 The Protest Project Authors (
                <a
                  href="https://github.com/octaviopardo/Protest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/octaviopardo/Protest
                </a>
                )
                <br />
                This Font Software is licensed under the{' '}
                <a
                  href="https://openfontlicense.org/open-font-license-official-text/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SIL Open Font License, Version 1.1
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsMenu;
