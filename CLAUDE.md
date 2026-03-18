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
│   ├── App.tsx                  ← Main entry: screen navigation (MyDay → FABMenu → Scanner)
│   ├── app.json                 ← Expo config (baseUrl for GitHub Pages)
│   ├── package.json             ← Dependencies
│   ├── tsconfig.json            ← TypeScript config (extends expo)
│   ├── index.ts                 ← Entry index
│   ├── assets/images/           ← App images (mode photos, focus photos, Camera.png, SVGs)
│   └── src/components/          ← All UI components (see Component Inventory below)
│
├── assets/                      ← Design reference images (barcode, food, menu, recipe photos)
└── docs/                        ← GitHub Pages deployment (built Expo web output)
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

### Home & Navigation Components
| Component | Description |
|---|---|
| **MyDay.tsx** | Home/dashboard screen: date row, points card, macros (protein, carbs, fat, fiber, calories), bottom tab bar. Receives `onFABTap` callback |
| **FABMenu.tsx** | Quick-add bottom sheet (FAB "+" overlay on MyDay): grid of 7 action buttons (Food, Activity, Weight, Water, Sleep, Glucose, Smart Scan) + recently tracked items list. Receives `onClose` and `onSmartScan` |
| **Onboarding.tsx** | First-load modal: step indicator, food photo preview, "One scan does it all" headline, "Next" button. Receives `onDismiss` |
| **Coachmark.tsx** | Post-onboarding tooltip explaining Auto mode with "Got it" dismiss button |

### Scanner UI Components
| Component | Description |
|---|---|
| **Header.tsx** | Top bar: back arrow, "Smart Scan" title, flash-off icon. Receives `onBack` |
| **iOSStatusBar.tsx** | Pixel-accurate iOS status bar (9:41, signal, wifi, battery) |
| **CameraView.tsx** | Camera preview — mode-specific photos, focus images at step 2, detected pills, corner brackets, barcode box |
| **BottomControls.tsx** | Gallery icon (left) + shutter button (center, 72px white circle) + mode pill (right, yellow label). Receives `onShutter` and `onModePillTap` |
| **ModePicker.tsx** | 5-mode grid overlay (3×2): Barcode, Food, Auto, Recipe, Menu with icons. Appears on mode pill tap. Receives `visible`, `activeMode`, `onSelectMode`, `onClose` |
| **SearchSheet.tsx** | Barcode mode bottom drawer: search prompt + input on step 1; 3-row card_food layout when `scanned=true` (name + serving/meal dropdowns + nutrition tags, tappable via `onProductTap`). Dynamic height: 155px (search) / 250px (scanned) |
| **HomeIndicator.tsx** | iOS home indicator pill (light/dark variants) |

### Result Screen Components
| Component | Description |
|---|---|
| **BarcodeResult.tsx** | Full "Track food" screen — product name, score, nutrition facts, points |
| **FoodResult.tsx** | iOS sheet overlay for Auto + Food modes. "Lunch" header + food cards (3-row: name+swap, serving dropdown, points+tags+delete) + "Add new food" card + Track button. Dismiss via X, tap scrim, or swipe down. Swap icon pushes to FoodSearch with iOS transition |
| **FoodSearch.tsx** | "Search to replace" screen rendered inside FoodResult's sheet. Search bar + similar results cards with swap icons. Exports `FoodSearchContent` (sheet content) and `IOSKeyboard` (static keyboard rendered below sheet) |
| **RecipeResult.tsx** | "Recipe Result" — parsed recipe with ingredients list, servings, per-serving points |
| **MenuResult.tsx** | "Menu Result" — restaurant name, list of menu items with scores and chevrons |

## App Architecture

### Screen Navigation
`App.tsx` manages 3 screens inside a phone frame (393×852px):
1. **"myday"** → `MyDay` — home dashboard with points, macros, tab bar
2. **"fab"** → `MyDay` + `FABMenu` overlay (blur backdrop) — tapping "Smart Scan" navigates to scanner
3. **"scanner"** → `SmartScanV1` — the full scanner with mode picker, camera, and results

### Step Flow (scanner)
All scan modes use a 3-step flow:
1. **Step 1 — Scanner:** Mode-specific camera view with tooltip (e.g. "Point at a recipe to scan it")
2. **Step 2 — Detected:** Focus image + green detected pill (e.g. "Recipe", "Barcode", "Food Photo")
3. **Step 3 — Result:** Shutter flash → loading spinner → result drawer slides up

**Shutter flash:** Black overlay, fade in 50ms → `onPeak` callback → fade out 150ms. Loading starts at peak so there's no visual gap.

**Loading:** Dark overlay (0.6 opacity) with spinning ring + "Analyzing..." text. Barcode: 500ms, others: 1000ms.

**Result drawer:** Non-food modes: slides up from bottom (translateY 852→0, 350ms), closes with slide-down + resets to step 1. Food/Auto modes: iOS sheet overlay (FoodResult) with spring animation, dismiss via X button, tap scrim, or swipe-down on drag handle.

**Barcode unique flow:** Camera image is tappable (advances step). After loading, product card appears in SearchSheet (3-row card_food layout) instead of full drawer. Tapping product card opens full BarcodeResult drawer.

**Food swap-to-search flow:** Tapping swap icon on a food card in FoodResult pushes "Search to replace" screen (FoodSearch) with iOS push transition (food slides left, search slides in from right). iOS keyboard renders below the sheet. X button reverses the transition.

### Scanner (SmartScanV1)
- 5 scan modes: Barcode, Food, Auto, Recipe, Menu
- Mode pill in BottomControls (right side) — tap to open ModePicker grid overlay
- Shutter button always visible, wired to `advanceStep()`
- SearchSheet with drag handle, prompt text, and scanned product card state
- HomeIndicator in controls area
- Onboarding modal shown on first load → Coachmark tooltip after dismissal

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
- **iOS sheet overlay (FoodResult):** White sheet at top:54, borderRadius:38, shadow 0 15 75 rgba(0,0,0,0.18). Spring animation (tension:65, friction:11). Dismiss: X button, tap scrim (rgba(0,0,0,0.45)), or swipe-down via PanResponder on drag handle (threshold: 100px or velocity 0.5)
- **iOS push transition:** Two-page pattern inside sheet — pages animate translateX ±393px with spring. Used for food swap-to-search flow
- **Design tokens:** bg `#e6efff` (blue_01_meno), text `#031aa1` (on_surface/primary), dark `#031373` (blue_09_clinic), border `#b0bcc8` (neutral_04), card shadow `0 2 2 rgba(7,5,23,0.04)`

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
