# Roterende Kort (docs/components/roterendekort/README.md)

Komponent der håndterer hurtig rotation med 3D-perspektiv og motion blur-effekt, når et kort vendes for at vise en bagside.

---

## Egenskaber
- **Svæve-effekt:** Let tilfældig vinkel og elevation ved hover.
- **Hurtig 3D-rotation:** Drejer 5,5 omgange (1980 grader) på 0.8 sekunder.
- **Motion blur:** Påfører `blur(4px)` under rotationen og fjerner det ved landing.
- **Touch & Tilgængelighed:** Fungerer med tryk og tastatur (`Enter` / `Mellemrum`).

---

## Eksempel på brug

```tsx
import { RotatingCard } from './RotatingCard';

export function Example() {
  return (
    <RotatingCard
      frontContent="?"
      backContent="42"
      frontBg="#CFE0F3"
      frontTextColor="#29619F"
      backBg="#FFF5C3"
      backTextColor="#C8A700"
      onFlip={(flipped) => console.log('Kort vendt:', flipped)}
    />
  );
}
```
