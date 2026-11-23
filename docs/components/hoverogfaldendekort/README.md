# Hover og Faldende Kort (docs/components/hoverogfaldendekort/README.md)

Komponent til interaktive kort, der løfter sig ved hover og hopper op i luften for derefter at falde ned af skærmen (f.eks. ved klik eller når en runde afsluttes).

---

## Egenskaber
- **Hover:** Let løft og forstørrelse (`scale(1.05) translateY(-10px)`).
- **Hop og fald-animation:** Kortet hopper op med en let hældning til den ene side, når sit peak, hvorefter det skifter rotationsretning og accelererer nedad i en retning og vinkel, der matcher rotationen.
- **Fleksibel styring:** Kan udløses automatisk ved klik på kortet eller styres programmatisk via `isFalling` og `delay` props (f.eks. til kaskader af kort ved rundeslut).

---

## Eksempel på brug

```tsx
import { useState } from 'react';
import { HoverFallingCard } from './HoverFallingCard';

export function Example() {
  const [isFalling, setIsFalling] = useState(false);

  return (
    <div>
      <HoverFallingCard
        isFalling={isFalling}
        onFallComplete={() => console.log('Kort faldet færdigt')}
      >
        A
      </HoverFallingCard>

      <button onClick={() => setIsFalling(true)}>Afslut runde</button>
    </div>
  );
}
```
