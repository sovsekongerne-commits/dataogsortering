# Klassetrinsvælger (docs/components/klassetrin/README.md)

Dette dokument beskriver designet af klassetrinsvælgeren og instruktioner til, hvordan andre apps (f.eks. `stavespillet.kongskole.dk`, `opgavemaskinen.kongskole.dk` osv.) henter og anvender informationen om det valgte klassetrin.

---

## 1. Relevante kodefiler i projektet

Når du vil genbruge eller referere implementeringen, er følgende to filer de centrale:

1. **`src/components/GradeSlider.tsx`**
   - Selve UI-komponenten med responsiv adfærd, `motion/react` animationer og temafarver.
   - Tilpasser sig automatisk skærmbredde (vandret pille-slider på desktop, kompakt popover på mobil/tablet).
   - Skjuler tekst-label på helt smalle skærme og viser `Kl. 0.` – `Kl. 9.`.

2. **`src/utils/gradeStore.ts`**
   - Datahåndtering for klassetrin: Læsning og skrivning via `localStorage` og cookie på roddomænet (`.kongskole.dk`).
   - Udsendelse af `kongskole_grade_updated` begivenhed ved ændringer.

---

## 2. Sådan henter andre apps det valgte klassetrin

Kongskole deler det valgte klassetrin via tre uafhængige kanaler, så enhver underside eller app altid kan tilgå det uden netværkskald.

### Kanal A: Cookie (Anbefalet ved direkte browser-adgang)
Når en bruger vælger et klassetrin på `kongskole.dk`, gemmes det i en cookie sat på `domain=.kongskole.dk`:
- Nøgle: `kongskole_grade`
- Mulige værdier: `'0'`, `'1'`, `'2'`, `'3'`, `'4'`, `'5'`, `'6'`, `'7'`, `'8'`, `'9'`

Hjælpefunktion til at læse klassetrin i en app:
```typescript
export function getSelectedGrade(): string {
  if (typeof document === 'undefined') return '1';
  const match = document.cookie.match(/(?:^|;\s*)kongskole_grade=([^;]+)/);
  if (match) {
    const val = decodeURIComponent(match[1]);
    if (/^[0-9]$/.test(val)) return val;
  }
  return '1'; // Standard fallback (1. klasse)
}
```

### Kanal B: URL Search Parameters
Når forsiden eller lærerzonen viderestiller til en app, medsendes klassetrinnet i URL query string:
- `?grade=1` eller `?trin=1`

Hjælpefunktion til at læse URL search params:
```typescript
export function getGradeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const grade = params.get('grade') || params.get('trin');
  return grade && /^[0-9]$/.test(grade) ? grade : null;
}
```

### Kanal C: URL Hash Payload
Når klassedata og elevlister sendes med til en app via `#classesData=...`, findes `grade` også direkte i hashet samt inde i det JSON-kodede objekt:
```typescript
export function getGradeFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  const grade = params.get('grade');
  return grade && /^[0-9]$/.test(grade) ? grade : null;
}
```

### Samlet hjælpefunktion til en app
En app kan bruge følgende prioritering for altid at få det rigtige klassetrin:
```typescript
export function resolveCurrentGrade(): string {
  // 1. Tjek URL query parameter først (hvis linket har specifikt trin)
  const urlGrade = getGradeFromUrl();
  if (urlGrade) return urlGrade;

  // 2. Tjek hash parameter
  const hashGrade = getGradeFromHash();
  if (hashGrade) return hashGrade;

  // 3. Tjek delt cookie på .kongskole.dk
  const cookieGrade = getSelectedGrade();
  if (cookieGrade) return cookieGrade;

  // 4. Fallback
  return '1';
}
```

---

## 3. UI-komponent: GradeSlider

Hvis en app ønsker at vise den samme vælger i sin egen topbar, kan `GradeSlider.tsx` kopieres direkte.

### Afhængigheder
- `react`
- `motion` (`motion/react`)
- Tailwind CSS

### Komponentkode (`GradeSlider.tsx`)
```tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface GradeSliderProps {
  currentGrade: string; // '0' .. '9'
  onChangeGrade: (grade: string) => void;
  isTeacher?: boolean;
}

const GRADES = [
  { id: '0', num: '0', display: '0.', fullLabel: '0. klasse' },
  { id: '1', num: '1', display: '1.', fullLabel: '1. klasse' },
  { id: '2', num: '2', display: '2.', fullLabel: '2. klasse' },
  { id: '3', num: '3', display: '3.', fullLabel: '3. klasse' },
  { id: '4', num: '4', display: '4.', fullLabel: '4. klasse' },
  { id: '5', num: '5', display: '5.', fullLabel: '5. klasse' },
  { id: '6', num: '6', display: '6.', fullLabel: '6. klasse' },
  { id: '7', num: '7', display: '7.', fullLabel: '7. klasse' },
  { id: '8', num: '8', display: '8.', fullLabel: '8. klasse' },
  { id: '9', num: '9', display: '9.', fullLabel: '9. klasse' }
];

export const GradeSlider: React.FC<GradeSliderProps> = ({
  currentGrade,
  onChangeGrade,
  isTeacher = false
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeItem = GRADES.find((g) => g.id === currentGrade) || GRADES[1];

  useEffect(() => {
    if (!isOpenMobile) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpenMobile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpenMobile]);

  const theme = useMemo(() => {
    if (isTeacher) {
      return {
        sliderBg: 'bg-white border border-neutral-300 shadow-sm',
        mobileBtnBg: 'bg-white text-neutral-900 border border-neutral-300 shadow-sm',
        mobilePopupBg: 'bg-white border-neutral-200 text-neutral-900 shadow-2xl',
        mobileItemActive: 'bg-black text-white font-black shadow-md',
        mobileItemInactive: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800',
        activePill: 'bg-black text-white',
        activeText: 'text-white',
        inactiveText: 'text-neutral-600 hover:text-black',
        labelText: 'text-white'
      };
    }

    return {
      sliderBg: 'bg-[#F3C689]/60 border border-[#B67012]/20 shadow-inner',
      mobileBtnBg: 'bg-[#E2A44A] text-neutral-950 border border-[#B67012]/40 shadow-[0_2px_8px_rgba(182,112,18,0.25)]',
      mobilePopupBg: 'bg-[#FAE5C8] border-[#B67012]/30 text-neutral-950 shadow-[0_16px_40px_rgba(182,112,18,0.25)]',
      mobileItemActive: 'bg-[#E2A44A] text-neutral-950 border-2 border-[#B67012] shadow-md',
      mobileItemInactive: 'bg-white/80 hover:bg-white text-[#B67012] border border-[#B67012]/20',
      activePill: 'bg-[#E2A44A] border border-[#B67012]/35 shadow-[0_2px_8px_rgba(182,112,18,0.28)]',
      activeText: 'text-neutral-950 font-black',
      inactiveText: 'text-[#B67012] hover:text-neutral-950',
      labelText: 'text-neutral-900'
    };
  }, [isTeacher]);

  return (
    <div className="relative flex items-center gap-1.5 sm:gap-2">
      {/* Label: Skjules automatisk på smalle mobilskærme */}
      <div className={`font-black select-none tracking-tight shrink-0 text-xs sm:text-sm hidden sm:inline ${theme.labelText}`}>
        <span className="hidden xl:inline">Klassetrin:</span>
        <span className="inline xl:hidden">Klasse:</span>
      </div>

      {/* Mobil popup knap (<lg) */}
      <div className="relative lg:hidden" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpenMobile((prev) => !prev)}
          aria-expanded={isOpenMobile}
          aria-label={`Vælg klassetrin. Nuværende: ${activeItem.fullLabel}`}
          className={`min-w-[44px] min-h-[44px] px-3 py-2 rounded-full flex items-center justify-center gap-1 text-xs sm:text-sm font-black transition-transform active:scale-95 cursor-pointer select-none ${theme.mobileBtnBg}`}
        >
          <span className="inline sm:hidden">Kl. {activeItem.display}</span>
          <span className="hidden sm:inline">{activeItem.display}</span>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpenMobile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpenMobile && (
            <>
              <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-50" onClick={() => setIsOpenMobile(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className={`fixed top-18 left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-sm z-50 p-4 sm:p-5 rounded-3xl border ${theme.mobilePopupBg}`}
              >
                <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                  {GRADES.map((g) => {
                    const isActive = currentGrade === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          onChangeGrade(g.id);
                          setIsOpenMobile(false);
                        }}
                        aria-pressed={isActive}
                        aria-label={g.fullLabel}
                        className={`h-12 rounded-2xl flex flex-col items-center justify-center font-black tracking-tight transition-transform active:scale-90 cursor-pointer ${
                          isActive ? theme.mobileItemActive : theme.mobileItemInactive
                        }`}
                      >
                        <span className="text-[10px] leading-none opacity-80 font-bold">Kl.</span>
                        <span className="text-sm font-black leading-tight">{g.display}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop slider (lg+) */}
      <nav aria-label="Klassetrin" className={`hidden lg:inline-flex items-center p-1 rounded-full transition-colors duration-300 ${theme.sliderBg}`}>
        {GRADES.map((g) => {
          const isActive = currentGrade === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                if (currentGrade !== g.id) onChangeGrade(g.id);
              }}
              aria-pressed={isActive}
              aria-label={g.fullLabel}
              className={`relative min-w-[34px] xl:min-w-[40px] h-9 sm:h-10 px-1 xl:px-2 rounded-full flex items-center justify-center text-xs xl:text-sm font-black tracking-tight transition-colors duration-200 cursor-pointer select-none z-10 shrink-0 ${
                isActive ? theme.activeText : theme.inactiveText
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="grade-slider-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className={`absolute inset-0.5 rounded-full shadow-sm -z-10 ${theme.activePill}`}
                />
              )}
              <span className="relative z-10 pointer-events-none">{g.display}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
```
