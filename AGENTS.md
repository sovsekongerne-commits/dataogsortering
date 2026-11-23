# Agent Guidelines (AGENTS.md)

Dette dokument fastlægger de overordnede regler for adfærd, kommunikation, UI-design og kodestandarder. Reglerne skal altid overholdes.

---

## 1. Kommunikation og Output

- **Ingen emojis:** Brug ALDRIG emojis – hverken i kildekode, UI-komponenter, kommentarer, git commits eller chat-svar.
- **Kortfattethed:** Hold forklaringer og chat-svar på et absolut minimum. Gå direkte til handling og kodeændringer uden lange indledninger eller opsummeringer.
- **Ingen lange instruktioner:** Forklar ikke hvordan en feature virker trin for trin med lange manualer, medmindre brugeren udtrykkeligt beder om det.

---

## 2. UI-tekst og Indhold

- **Minimal UI-tekst:** Hold tekst i brugerfladen ultrakort (1-3 ord på knapper og labels, f.eks. "Start", "Næste", "Gem").
- **Ingen opdigtet tekst:** Tilføj kun tekst i brugerfladen, hvis brugeren har angivet ordlyden, eller hvis en komponent strengt nødvendigt kræver en basal handlingstekst.
- **Ingen hjælpetekster uden tilladelse:** Opfind ALDRIG hjælpetekster, forklarende vejledninger eller instruktionsbokse, medmindre brugeren udtrykkeligt beder om det.

---

## 3. Touch, Ergonomi og Responsive Enheder

- **Touch-first:** Alle interaktive elementer (knapper, kort, links, inputs) skal have et aktivt berøringsareal på **minimum 44×44 px** (gerne større på tablets/mobil).
- **Ingen hover-afhængighed:** Byg aldrig funktionalitet, der udelukkende kan tilgås via mouseover/hover. Alle handlinger skal fungere via tryk/touch.
- **Proaktiv responsivitet (Mobil/Tablet):** Elementer må frit skaleres, ombrydes (flex/grid) og omstruktureres efter skærmtype. Da udvikling primært foregår på PC, skal agenten **altid proaktivt sikre**, at mobil- og tabletvisning fungerer fejlfrit uden utilsigtet horisontal scroll.

---

## 4. Animationer og Mikrobevægelser

- **Bløde overgange:** Brug subtile mikrobevægelser og bløde overgange på interaktive elementer via det installerede `motion` (`motion/react`) eller native CSS transitions.
- **Sanselig og let:** Hold bevægelserne organiske, rolige og responsive – undgå hårde, mekaniske eller overdrevne animationer, der forsinker brugeren. Installer ikke nye animationspakker.

---

## 5. Farvepalette (Faste Temafarver)

- **Fast palette:** Projektets godkendte farver og retningslinjer for kontrast er defineret i [COLORS.md](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/COLORS.md).
- **Ingen vilkårlige farver:** Opfind ALDRIG nye hex-koder uden for den officielle palette i `COLORS.md`.
- **Sekundær palette:** Den sekundære palette i `COLORS.md` må udelukkende anvendes i PlayerBar eller hvis brugeren udtrykkeligt beder om det.

---

## 6. Faste Spilkomponenter og Typografi

- **Standardmoduler (Kun på anmodning):** Byg ALDRIG disse moduler automatisk ind ved oprettelse af et nyt spil eller en ny app. De må KUN implementeres, når brugeren eksplicit beder om det. NÅR brugeren beder om et af modulerne, SKAL retningslinjer og opsætning fra [docs/components/](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/) altid følges:
  - **Hovedmenu:** Retningslinjer og opsætning i [`docs/components/hovedmenu/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/hovedmenu/).
  - **Spillervælger:** Vælg spillere-system og widget i [`docs/components/spiller/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/spiller/).
  - **Indstillinger:** Indstillingsmenu i [`docs/components/indstillinger/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/indstillinger/).
  - **Klasseslider / Klassetrin:** Slider til valg af klassetrin (sværhedsgrad) i opgaverne i [`docs/components/klasseslider/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/klasseslider/) (eller [`docs/components/klassetrin/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/klassetrin/)).
  - **Point:** Pointkasse og streganimation til pointvisning i [`docs/components/point/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/point/).
  - **Print:** Print-funktion og styling i [`docs/components/print/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/print/).
  - **Roterende kort:** 3D-kortrotation med hurtig spin og motionblur-effekt til afsløring af bagside i [`docs/components/roterendekort/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/roterendekort/).
  - **Placer brikker:** Opgaver hvor brikker placeres på række (tal, bogstaver, ord) med fysik-træk, 1/3-greb, skygge-fade og ubrudt tilbageslyng i [`docs/components/placerbrikker/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/placerbrikker/).
  - **Hover og faldende kort:** Kort der svæver ved hover og hopper op med to-vejs rotation og falder af skærmen ved rundeslut i [`docs/components/hoverogfaldendekort/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/hoverogfaldendekort/).
- **Fonte & Typografi:**
  - **Standardfont (Fra start):** Noto Sans skal altid implementeres som standardfont fra start i enhver app.
  - **Dysleksifont (Ved indstillinger):** OpenDyslexic implementeres som valgmulighed, når indstillingsmodulet opsættes.
  - Brug udelukkende de skrifttyper, der er specificeret i [`docs/components/fonts/`](file:///Users/jonaslochtetaylor/Documents/GitHub/kongskole/docs/components/fonts/). Indfør ikke andre fonte.

---

## 7. Teknisk Stak, Sikkerhed og Kodestandarder

- **API-nøgler & Sikkerhed:** Gem ALDRIG en Gemini API-key (eller andre API-nøgler/hemmeligheder) i kildekode, konfigurationer eller commits. Siderne hostes offentligt tilgængeligt, og nøgler må under ingen omstændigheder lækkes eller eksponeres i browseren/klienten.
- **Ikoner:** Brug udelukkende `lucide-react` eller inline SVG. Installer ikke andre ikonbiblioteker.
- **Data-integritet (`src/constants.tsx`):** Eksisterende subdomæne-adresser (`*.kongskole.dk`), id'er, billedstier og tematilknytninger må aldrig ændres eller slettes uden eksplicit aftale.
- **TypeScript:** Striks typesikkerhed uden `any`. Fælles interfaces placeres i `src/types.ts`.
- **Ingen unødige dependencies:** Installer aldrig nye npm-pakker uden forudgående tilladelse.

---

## 8. Versionsstyring og Udviklingsserver

- **Git commits:** Lav et lokalt git commit, når en opgave eller feature er færdigimplementeret.
  - Kør ALDRIG `git push` (brugeren pusher selv via GitHub Desktop).
  - Skriv korte, præcise commit-beskeder uden emojis.
- **Dev-server & Links:**
  - Sørg for at dev-serveren kører i baggrunden, og angiv altid et direkte link (`http://localhost:...`).
  - Genstart kun serveren ved nedbrud eller ændringer i konfigurationsfiler (`vite.config.ts`, `package.json`), så Vites automatiske genindlæsning (HMR) bevares på samme port.
