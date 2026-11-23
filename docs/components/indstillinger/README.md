# Indstillingsmenu (docs/components/indstillinger/README.md)

1:1 React-konvertering af Kongskoles officielle indstillingsmenu (`indstillinger.html`).
Menuen indeholder navigation, lydkontrol, fuldskærm, spilhjælp, dysleksivenlig typografi (OpenDyslexic), info/credits modal og afslut-handling med Kongskole deep-link integration.

---

## Egenskaber

- **Fastforankret tandhjul (Sticky trigger):** Tandhjulet fastholdes altid i venstre side og adskilles af en diskret skygge under scrolling.
- **Matematisk ikon-afstand:** Ensartet kolonnebredde (`--item-width: 68px`, udvides til `98px` ved dysleksi) og ensartet mellemrum (`--item-gap: 12px`/`14px`), der bevares præcist ved breddeændringer.
- **Kontekststyring (`context`):**
  - `'main-menu'`: Hovedmenu-visning (5 knapper: Lyd, Fuldskærm, Dysleksi, Info, Afslut).
  - `'game'`: Normalt spil (6 knapper: Tilbage, Lyd, Fuldskærm, Hjælp, Dysleksi, Afslut).
  - `'game-direct'`: Direkte dyblinket opgave (6 knapper: Hovedmenu [Hus], Lyd, Fuldskærm, Hjælp, Dysleksi, Afslut).
  - `'all'`: Fuld visning (8 knapper).
- **Dysleksivenlig skrifttype (OpenDyslexic):** Indbygget base64-fallback for 100% serveruafhængighed. Udvides automatisk ved aktivering.
- **Horisontal scrolling & Touch:**
  - Konverterer musens vertikale rullehjul (`deltaY`) til jævn horisontal scrolling.
  - Drag-to-scroll med musen på desktop med flytte-tærskel (forhindrer utilsigtet klik).
  - Touch-first: Alle knapper overholder minimum 44×44 px berøringsareal.
- **Info & Credits Modal:** Åbner ren dialog med ophavsret, credits og licensbetingelser.
- **Events & Global API:** Udsender standardiserede DOM-events (`settings:open`, `settings:close`, `settings:audio`, `settings:dyslexia`, `settings:back`, `settings:home`, `settings:help`, `settings:modalOpen`, `settings:modalClose`) samt `window.SettingsMenu`.

---

## Installation & Import

Kopier `SettingsMenu.tsx` og `settingsMenu.css` til dit projekt, eller importer direkte fra `docs/components/indstillinger/`:

```tsx
import { SettingsMenu } from './components/indstillinger/SettingsMenu';
// import './components/indstillinger/settingsMenu.css';
```

---

## Eksempel: Anvendelse i et spil

```tsx
import React, { useState } from 'react';
import { SettingsMenu } from './SettingsMenu';
import { useKongskoleIntegration } from './hooks/useKongskoleIntegration';

export function GameApp() {
  const { isDeepLinked, goBackToKongskole } = useKongskoleIntegration();
  const [view, setView] = useState<'menu' | 'game'>('game');
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div className="relative min-h-screen bg-[#FAE5C8]">
      {/* Indstillingsmenu */}
      <SettingsMenu
        context={view === 'menu' ? 'main-menu' : isDeepLinked ? 'game-direct' : 'game'}
        onBack={() => setView('menu')}
        onHome={() => setView('menu')}
        onHelp={() => console.log('Vis hjælp-dialog')}
        onExit={goBackToKongskole}
        isAudioEnabled={audioEnabled}
        onAudioChange={setAudioEnabled}
      />

      {/* Spillets indhold */}
      <main className="p-8">
        <h1>Mit Kongskole Spil</h1>
      </main>
    </div>
  );
}
```

---

## Props Oversigt

| Prop | Type | Standard | Beskrivelse |
| :--- | :--- | :--- | :--- |
| `context` | `'main-menu' \| 'game' \| 'game-direct' \| 'all'` | `'main-menu'` | Styrer hvilke knapper der er synlige |
| `onBack` | `() => void` | `undefined` | Callback ved tryk på Tilbage (pil) |
| `onHome` | `() => void` | `undefined` | Callback ved tryk på Hovedmenu (hus) |
| `onHelp` | `() => void` | `undefined` | Callback ved tryk på Hjælp (spørgsmålstegn) |
| `onExit` | `() => void` | `undefined` | Callback ved tryk på Afslut |
| `returnUrl` | `string \| null` | `null` | Retur-link hvis brugeren afslutter til Lærerzonen |
| `isAudioEnabled` | `boolean` | `true` | Kontrolleret lyd-tilstand |
| `onAudioChange` | `(enabled: boolean) => void` | `undefined` | Lytter til lydændringer |
| `isDyslexiaEnabled` | `boolean` | `false` | Kontrolleret dysleksitilstand |
| `onDyslexiaChange` | `(enabled: boolean) => void` | `undefined` | Lytter til dysleksiændringer |
| `className` | `string` | `""` | Ekstra klassenavn på container |
| `style` | `React.CSSProperties` | `undefined` | Valgfri inline-positionering |
