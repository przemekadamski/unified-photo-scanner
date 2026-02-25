# Unified Photo Scanner

## Overview

Build a unified photo scanner that replaces multiple single-purpose scanners with one intelligent entry point. Members take a photo, the system classifies what type of scan it is, and routes to the appropriate processing pipeline — returning results tailored to each scan type.

## Background

Today, members must choose the correct scanner before taking a photo. This creates friction and confusion. The goal is a single "scan" action that intelligently handles all photo types.

The **Recipe Points Estimator** backend already exists in production — it's the same service powering AI web recipe imports, but accepts a photo input instead of a URL. No new backend work is needed for that path.

## Scan Types & Routing

The unified scanner must detect and route these four photo types:

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
- **Processing:** OCR the recipe → send extracted text to the existing AI recipe import service (same service used for web URL recipe imports, just with photo-sourced text)
- **Output:** Parsed recipe with ingredients, servings, and per-serving points estimate

### 4. Menu Scanning (NEW)
- **Input:** Photo of a restaurant menu
- **Processing:** OCR the menu → identify individual menu items → estimate points per item
- **Output:** List of menu items with estimated points values; ability to select/save items

## Technical Architecture

### Photo Classification

When a user takes or uploads a photo, the system must classify it into one of the four scan types before routing. Consider:

- **Classification approach:** Use a lightweight image classification model or vision API to determine photo type (barcode vs. food plate vs. recipe text vs. menu text)
- **Confidence thresholds:** If classification confidence is low, prompt the user to confirm the scan type
- **Fallback:** Provide a manual override so users can select scan type if auto-detection fails

### Routing Logic

```
User takes photo
    → Classify image
    → Route to handler:
        ├── Barcode detected     → Barcode decoder → Product lookup
        ├── Food plate detected  → PlateIQ pipeline (existing)
        ├── Recipe detected      → OCR → Recipe Import Service (existing backend)
        └── Menu detected        → OCR → Menu item parser → Points estimator
```

### Key Integration Points

- **PlateIQ:** Existing integration, no changes needed. Just route food photos to the current pipeline.
- **Recipe Points Estimator:** Production-ready. Shares the AI web recipe import service. Send OCR'd recipe text as input instead of a URL. Expect the same response format as web recipe imports.
- **Barcode Scanner:** Existing integration. Route barcode photos to current decoder.
- **Menu Scanner:** New pipeline. Requires OCR + menu item extraction + points estimation for each item.

## Design Requirements

### Results Screens

Each scan type needs a distinct results experience:

1. **Barcode Results** — Product card with nutritional info and points
2. **Food Photo Results** — PlateIQ results (existing UI, no changes)
3. **Recipe Results** — Full parsed recipe view: title, ingredients list, servings selector, per-serving points. Should feel consistent with web recipe import results since they share the same backend.
4. **Menu Results** — Scrollable list of detected menu items, each showing name and estimated points. Users should be able to tap items to see more detail or save/track them.

### Scanner UI

- Single camera/upload entry point (remove the need to pick a scanner type upfront)
- Show a brief classification indicator after photo capture (e.g., "Recipe detected" with option to change)
- Loading/processing state while classification and analysis run
- Error state if photo can't be classified or processed

### Edge Cases to Design For

- Photo contains both a recipe and a barcode (e.g., back of a food box)
- Blurry or low-quality photo that can't be classified
- Handwritten recipe with poor OCR results
- Menu in a non-English language
- Photo of a screen showing a recipe (screenshot-like)

## Implementation Notes

- The Recipe Points Estimator is the highest-confidence new path since the backend is already production-ready. Prioritize this over Menu Scanning.
- Menu Scanning is fully new and will require the most design and backend work.
- Consider a phased rollout: Phase 1 (barcode + food photo + recipe photo), Phase 2 (menu scanning).
- Classification accuracy is critical to the experience — a misrouted photo creates a bad user experience. Invest in the classification step.

## Out of Scope

- Video scanning
- Multi-photo stitching (e.g., scanning a multi-page recipe)
- Real-time camera overlay/AR
- Offline scanning support

## Success Metrics

- Reduction in scanner-selection errors (users picking wrong scanner)
- Adoption rate of unified scanner vs. legacy individual scanners
- Recipe photo scan completion rate (photo taken → points result displayed)
- Classification accuracy rate (correct routing on first attempt)
