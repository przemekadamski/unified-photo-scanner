# Unified Photo Scanner

## Overview

Build a unified photo scanner that replaces multiple single-purpose scanners with one intelligent entry point. Members take a photo, the system classifies what type of scan it is, and routes to the appropriate processing pipeline — returning results tailored to each scan type.

## Background

Today, members must choose the correct scanner before taking a photo. This creates friction and confusion. The goal is a single "scan" action that intelligently handles all photo types.

The **Recipe Points Estimator** backend already exists in production — it's the same service powering AI web recipe imports, but accepts a photo input instead of a URL. No new backend work is needed for that path.

---

## Project Structure

```
/Unified Photo Scanner/
├── CLAUDE.md                    ← This file (project instructions)
├── .gitignore
│
├── SmartScanApp/                ← React Native Expo prototype app
│   ├── App.tsx                  ← Main entry: version switcher + V1 & V2 components
│   ├── app.json                 ← Expo config (baseUrl for GitHub Pages)
│   ├── package.json             ← Dependencies
│   ├── tsconfig.json            ← TypeScript config (extends expo)
│   ├── index.ts                 ← Entry index
│   ├── assets/images/           ← App images (mode photos, focus photos, Camera.png, SVGs)
│   └── src/components/          ← All UI components (see Component Inventory below)
│
├── assets/                      ← Design reference images (barcode, food, menu, recipe photos)
├── docs/                        ← GitHub Pages deployment (built Expo web output)
│
├── prototypes.html              ← Result screen prototypes (Barcode, Food, Menu, Recipe results)
├── scanner-screens.html         ← Missing screens & error states reference
└── smart-scan.html              ← Interactive scanner UI with mode transitions
```

## Tech Stack

- **React Native** v0.81.5 + **React** v19.1.0
- **Expo** ~54.0.33 (development platform & bundler)
- **react-native-web** ^0.21.0 (runs in browser)
- **TypeScript** ~5.9.2
- **GitHub Pages** deployment via `docs/` folder

### Running Locally
```bash
cd SmartScanApp
npx expo start --web --port 8081
```

### Deploying to GitHub Pages
```bash
cd SmartScanApp
npx expo export --platform web
# Copy dist/ contents to docs/ in repo root
# Push to main branch
```
GitHub Pages URL: `https://przemekadamski.github.io/unified-photo-scanner/`

## Component Inventory

All components live in `SmartScanApp/src/components/`:

### Scanner UI Components
| Component | Description |
|---|---|
| **Header.tsx** | Top bar: back arrow, "Smart Scan" title, flash-off icon |
| **iOSStatusBar.tsx** | Pixel-accurate iOS status bar (9:41, signal, wifi, battery) |
| **CameraView.tsx** | Camera preview — mode-specific photos, focus images at step 2, detected pills, corner brackets, barcode box |
| **ModeTabs.tsx** | V1 mode tabs: 5 modes (Barcode, Food, Auto, Recipe, Menu), yellow active highlight |
| **ModeTabsV2.tsx** | V2 pill tabs: 4 modes (no Menu), glass effect + yellow text on active tab |
| **BottomControls.tsx** | Gallery icon + shutter button (72px white circle), `onShutter` callback |
| **SearchSheet.tsx** | V1 barcode sheet: drag handle, prompt, search input; shows product card when `scanned=true` |
| **SearchSheetV2.tsx** | V2 barcode sheet: search bar; shows product card when `scanned=true`; height 130px (search) / 165px (scanned) |
| **HomeIndicator.tsx** | iOS home indicator pill (light/dark variants) |

### Result Screen Components
| Component | Description |
|---|---|
| **BarcodeResult.tsx** | Full "Track food" screen — product name, score, nutrition facts, points |
| **FoodResult.tsx** | "Lunch" result — detected food items with scores, servings, "Track Recipe" button. Used for Auto + Food modes |
| **RecipeResult.tsx** | "Recipe Result" — parsed recipe with ingredients list, servings, per-serving points |
| **MenuResult.tsx** | "Menu Result" — restaurant name, list of menu items with scores and chevrons (V1 only) |

## App Architecture

### Version Switcher
`App.tsx` renders a toggle bar above the phone frame (393x852px) to switch between two competing UI designs.

### Step Flow (both versions)
All scan modes use a 3-step flow:
1. **Step 1 — Scanner:** Mode-specific camera view with tooltip (e.g. "Point at a recipe to scan it")
2. **Step 2 — Detected:** Focus image + green detected pill (e.g. "Recipe", "Barcode", "Food Photo")
3. **Step 3 — Result:** Shutter flash → loading spinner → result drawer slides up

**Shutter flash:** Black overlay, fade in 50ms → `onPeak` callback → fade out 150ms. Loading starts at peak so there's no visual gap.

**Loading:** Dark overlay (0.6 opacity) with spinning ring + "Analyzing..." text. Barcode: 500ms, others: 1000ms.

**Result drawer:** Slides up from bottom (translateY 852→0, 350ms). Closes with slide-down + resets to step 1.

**Barcode unique flow:** Camera image is tappable (advances step). After loading, product card appears in SearchSheet instead of full drawer. Tapping product card opens full BarcodeResult drawer.

### Version 1 (SmartScanV1)
- 5 scan modes: Barcode, Food, Auto, Recipe, Menu
- Full-width mode tabs below camera
- Shutter button always visible, wired to `advanceStep()`
- SearchSheet with drag handle, prompt text, and scanned product card state
- HomeIndicator in controls area (global, not in sheet)

### Version 2 (SmartScanV2)
- 4 scan modes: Barcode, Food, Auto, Recipe (no Menu)
- Dark pill-shaped tab container (#181818) with glass effect on active tab
- **Animated controls transition** when switching to/from Barcode (350ms, parallel with blur):
  - Shutter button: opacity 1→0 (fades out)
  - Gallery icon: top 149→24 (slides up)
  - Pill tabs: top 138→16 (slides up)
  - SearchSheetV2: slides up in sync with pill
- `displayedMode` updates pill highlight instantly at transition start; `activeMode` switches at blur midpoint (camera image changes behind blur)
- SearchSheetV2: no handle/prompt, shows product card when scanned

### Camera Assets
| Asset | Used by |
|---|---|
| food-photo.jpg | Auto (step 1+2), Food (step 1+2) |
| recipe-photo.jpg | Recipe (step 1) |
| recipe-focus.jpg | Recipe (step 2 — closer crop) |
| barcode-photo.jpg | Barcode (step 1+2, blurred bg + clear cutout) |
| menu-photo.jpg | Menu (step 1) |
| menu-focus.jpg | Menu (step 2 — closer crop) |

### Key Patterns
- **Blur transition on mode switch:** Animated 350ms blur in → switch mode → 350ms blur out
- **Barcode mode:** Darker overlay (0.5 opacity), clear cutout box for barcode alignment, search sheet slides up
- **Non-barcode modes:** Light overlay (0.2 opacity), corner brackets, tooltip bubble, shutter button visible
- **Phone frame:** Fixed 393x852px with 32px border radius, simulates iPhone

## HTML Prototypes (Design Reference)

These files contain the full design specs and flows to implement in the React Native app:

- **prototypes.html** — All 4 result screen types (Barcode product card, Food PlateIQ results, Menu item list, Recipe card with ingredients/servings/points). Each has a complete 4-step flow.
- **scanner-screens.html** — Missing screens, error states, happy path flows
- **smart-scan.html** — Interactive scanner with mode transitions, animations, shutter flash effect

---

## Scan Types & Routing

### 1. Barcode Scanner
- **Input:** Photo of a product barcode (UPC, QR code, etc.)
- **Processing:** Decode barcode → look up product
- **Output:** Product details, nutritional info, points values

### 2. Food Photo → PlateIQ
- **Input:** Photo of a plate of food
- **Processing:** Existing PlateIQ pipeline (no changes)
- **Output:** Food identification, estimated nutritional breakdown, points values

### 3. Recipe Photo → Recipe Points Estimator (NEW)
- **Input:** Photo of a printed/handwritten recipe (cookbook page, recipe card, etc.)
- **Processing:** OCR the recipe → send extracted text to the existing AI recipe import service
- **Output:** Parsed recipe with ingredients, servings, and per-serving points estimate

### 4. Menu Scanning (NEW)
- **Input:** Photo of a restaurant menu
- **Processing:** OCR the menu → identify individual menu items → estimate points per item
- **Output:** List of menu items with estimated points values; ability to select/save items

## Routing Logic

```
User takes photo
    → Classify image
    → Route to handler:
        ├── Barcode detected     → Barcode decoder → Product lookup
        ├── Food plate detected  → PlateIQ pipeline (existing)
        ├── Recipe detected      → OCR → Recipe Import Service (existing backend)
        └── Menu detected        → OCR → Menu item parser → Points estimator
```

## Design Requirements

### Results Screens
Each scan type needs a distinct results experience:
1. **Barcode Results** — Product card with nutritional info and points
2. **Food Photo Results** — PlateIQ results (existing UI, no changes)
3. **Recipe Results** — Full parsed recipe view: title, ingredients list, servings selector, per-serving points
4. **Menu Results** — Scrollable list of detected menu items with estimated points

### Scanner UI
- Single camera/upload entry point
- Classification indicator after capture (e.g., "Recipe detected" with option to change)
- Loading/processing state while classification runs
- Error state if photo can't be classified

### Edge Cases
- Photo contains both a recipe and a barcode (e.g., back of a food box)
- Blurry or low-quality photo
- Handwritten recipe with poor OCR
- Menu in a non-English language
- Photo of a screen showing a recipe

## Implementation Notes

- Recipe Points Estimator is highest-confidence new path (backend production-ready). Prioritize over Menu Scanning.
- Menu Scanning is fully new — most design and backend work needed.
- Phased rollout: Phase 1 (barcode + food + recipe), Phase 2 (menu scanning).
- Classification accuracy is critical — misrouted photo = bad UX.

## Out of Scope

- Video scanning
- Multi-photo stitching
- Real-time camera overlay/AR
- Offline scanning support
