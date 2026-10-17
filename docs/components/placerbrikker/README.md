# Placer Brikker (docs/components/placerbrikker/README.md)

Komponent til opgaver hvor brikker (tal, bogstaver, ord) skal placeres på en linje eller i en bestemt rækkefølge.

---

## Egenskaber
- **Klik-eller-træk:** Brikker kan enten klikkes direkte (flyver automatisk over i målrækken) eller trækkes frit med mus/finger.
- **Fysik-baseret træk:** Når en brik trækkes, svinger den dynamisk afhængigt af bevægelsens hastighed og acceleration. Markøren holdes 1/3 fra toppen, så tal og bogstaver altid er synlige under fingeren.
- **Fade på skygge:** Brikkens skygge fader blødt ind til en dyb svæveskygge ved løft, og fader ud til hvileskygge ved landing.
- **Ubrudt fald og tilbageslyng:** Slippes en brik uden for et felt, falder den nedad og stoppes direkte af faldet ved at svinge flydende tilbage på plads i én ubrudt kurve uden ophold.
- **Touch-klar:** 100% responsiv og understøtter touch-begivenheder uden utilsigtet sidescroll.

---

## Eksempel på brug

```tsx
import { PlaceTiles } from './PlaceTiles';

export function Example() {
  return (
    <PlaceTiles
      items={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']}
      targetSlotCount={5}
      onChange={(slots) => console.log('Nuværende brikker:', slots)}
      onComplete={(slots) => console.log('Alle pladser udfyldt:', slots)}
    />
  );
}
```
