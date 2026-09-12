# Autoralli.ee - Esmane Prototüüp

Lihtsalt prototüüp Autoralli.ee veebilehest, mis koondab kõike rallistiga seotut.

## 🚀 Alustamine

### Eeltingimused
- Node.js 18+ ja npm installitud
- Git (tulevases)

### Seadistus

```bash
# 1. Installida paketid
npm install

# 2. Käivitada arendusserver
npm run dev

# 3. Avada brauseris
# http://localhost:3000
```

## 📁 Projekt Struktuur

```
.
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Avaleht
│   └── globals.css         # Global stiilid
├── components/             # React komponendid (tulevikus)
├── tests/                  # Playwright testid
├── public/                 # Logod ja staatilised failid
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── playwright.config.ts
└── PROGRESS.md            # Progress log
```

## 🔧 Käsud

- `npm run dev` - Käivitada arendusserver
- `npm run build` - Buildida toodangu versioon
- `npm start` - Käivitada tootangu server
- `npm run lint` - ESLint kontroll
- `npm run type-check` - TypeScript kontrollimine
- `npm test` - Playwright testid
- `npm run test:ui` - Playwright UI modo

## 🎨 Disain

- **Mobile-First** lähenemisviis
- **Framer Motion** animatsioonid
- **Tailwind CSS** stiilide jaoks
- **WCAG 2.2 AA** accessibility nõuded

## 🧪 Testid

Kasutame **Playwright** e2e testidele. Testid on kaustas `tests/`.

```bash
npm test                    # Käivitada kõik testid
npm run test:ui            # Interaktiivne UI
npm run test:headed        # Näha brauserit testide ajal
```

## 📦 Tech Stack

- **Next.js 15** - Framework
- **React 19** - UI Library
- **TypeScript** - Tüüpide jaoks
- **Tailwind CSS** - Stiilid
- **Framer Motion** - Animatsioonid
- **Playwright** - E2E testid

## 📝 Märkused

- Esmane prototüüp fokusseerib avalehel
- Tulevikus liituvad kalendri, tulemuste, uudiste lehekülgud
- CMS ja andmebaas integreeritakse hiljem
- Kõik failid on Eesti keeles
- Mobiil vaade on prioriteet

## 👤 Autor

Loodi Claude'i ja Oliver'i koostöös.

## 📄 Litsents

MIT (tulevikus)

---

**Edasisi sammud:**
1. Kaart loodud - Autoralli.ee projekti struktuuri
2. Package.json ja seadistused loodud
3. Esmane prototüüp - Avaleht koos Framer Motion animatsioondega
4. Playwright testid - Põhilised kasutajate teekonna testid
5. Järgmised: Kalender, Tulemused, Uudised lehekülgde lisamine

