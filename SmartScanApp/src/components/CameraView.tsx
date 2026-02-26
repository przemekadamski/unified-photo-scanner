import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import type { ScanMode } from './ModeTabs';

// Camera preview area that changes based on the active scan mode and step:
// - Each mode uses its own background photo from assets
// - Step 1: scanner view with mode-specific overlay (brackets or barcode box) + tooltip
// - Step 2: detected — tooltip changes to green detected pill (e.g. "Recipe", "Barcode")

type Props = {
  mode: ScanMode;
  step?: number; // 1 = scanner (default), 2 = detected
};

// Mode-specific background photos (step 1 — scanner view)
const photoSources: Record<string, any> = {
  Auto: require('../../assets/images/food-photo.jpg'),
  Food: require('../../assets/images/food-photo.jpg'),
  Recipe: require('../../assets/images/recipe-photo.jpg'),
  Barcode: require('../../assets/images/barcode-photo.jpg'),
  Menu: require('../../assets/images/menu-photo.jpg'),
};

// Focus photos for step 2 (detected state) — closer/different crop
const focusSources: Record<string, any> = {
  Recipe: require('../../assets/images/recipe-focus.jpg'),
  Menu: require('../../assets/images/menu-focus.jpg'),
};

export default function CameraView({ mode, step = 1 }: Props) {
  const isBarcode = mode === 'Barcode';

  // Tooltip text for step 1 (changes per mode)
  const tooltipText =
    mode === 'Auto'
      ? "Point at anything — I'll figure it out"
      : mode === 'Recipe'
        ? 'Point at a recipe to scan it'
        : mode === 'Food'
          ? 'Point at food to identify it'
          : mode === 'Menu'
            ? 'Point at a menu to scan it'
            : '';

  // Detected label for step 2 (shown as green pill)
  const detectedLabel =
    mode === 'Barcode' ? 'Barcode'
      : mode === 'Recipe' ? 'Recipe'
      : mode === 'Food' ? 'Food Photo'
      : mode === 'Menu' ? 'Menu'
      : 'Food Photo'; // Auto mode also shows "Food Photo"

  return (
    <View style={styles.container}>
      {/* Background photo — use focus image at step 2 if available */}
      <Image
        source={
          step === 2 && focusSources[mode]
            ? focusSources[mode]
            : (photoSources[mode] || photoSources.Auto)
        }
        style={[
          styles.photo,
          isBarcode && styles.photoBarcode,
        ]}
        blurRadius={isBarcode ? 2 : 0}
      />

      {/* Dark overlay on top of the photo */}
      <View
        style={[
          styles.overlay,
          isBarcode ? styles.overlayBarcode : styles.overlayDefault,
        ]}
      />

      {/* Corner brackets for non-barcode modes */}
      {!isBarcode && (
        <View style={styles.bracketsContainer}>
          <View style={[styles.bracket, styles.bracketTL]} />
          <View style={[styles.bracket, styles.bracketTR]} />
          <View style={[styles.bracket, styles.bracketBL]} />
          <View style={[styles.bracket, styles.bracketBR]} />
        </View>
      )}

      {/* Barcode box cutout (clear window in the blurred area) */}
      {isBarcode && (
        <View style={styles.barcodeBoxWrapper}>
          <View style={styles.barcodeBox}>
            <Image
              source={require('../../assets/images/barcode-photo.jpg')}
              style={styles.barcodeBoxPhoto}
            />
          </View>
          {/* Step 1: "Align barcode inside the box" tooltip */}
          {step === 1 && (
            <View style={styles.barcodeLabel}>
              <Text style={styles.barcodeLabelText}>
                Align barcode inside the box
              </Text>
            </View>
          )}
          {/* Step 2: Green "Barcode" detected pill */}
          {step === 2 && (
            <View style={styles.detectedPill}>
              <View style={styles.detectedDot} />
              <Text style={styles.detectedText}>{detectedLabel}</Text>
            </View>
          )}
        </View>
      )}

      {/* Non-barcode modes: step 1 tooltip or step 2 detected pill */}
      {!isBarcode && step === 1 && tooltipText !== '' && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltipText}</Text>
        </View>
      )}
      {!isBarcode && step === 2 && (
        <View style={styles.detectedPillWrapper}>
          <View style={styles.detectedPill}>
            <View style={styles.detectedDot} />
            <Text style={styles.detectedText}>{detectedLabel}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  // Full-bleed food photo behind everything
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoBarcode: {
    // blurRadius prop handles the blur
  },
  // Semi-transparent dark layer over the photo
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayDefault: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayBarcode: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // === CORNER BRACKETS (for Auto/Recipe/Food/Menu) ===
  bracketsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 290,
    height: 283,
    marginTop: -137,  // center vertically
    marginLeft: -145,  // center horizontally
  },
  bracket: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderColor: 'rgba(232, 232, 240, 0.8)',
  },
  bracketTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 12,
  },
  bracketTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 12,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 12,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 12,
  },

  // === BARCODE BOX (clear cutout in blurred area) ===
  barcodeBoxWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -70,
    marginLeft: -179,
    alignItems: 'center',
    gap: 16,
  },
  barcodeBox: {
    width: 358,
    height: 171,
    borderRadius: 32,
    overflow: 'hidden',
  },
  // The unblurred photo inside the box, offset to align with the background
  barcodeBoxPhoto: {
    position: 'absolute',
    top: -174,
    left: -16,
    width: 393,
    height: 478,
    resizeMode: 'cover',
  },
  barcodeLabel: {
    backgroundColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 16,
  },
  barcodeLabelText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },

  // === DETECTED PILL (step 2 — green border + green dot + green text) ===
  // Used by all modes when a scan type is detected
  detectedPill: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    opacity: 0.42,
  },
  detectedText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: '500',
  },

  // === TOOLTIP BUBBLE ===
  tooltip: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 16,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },

  // Wrapper for detected pill in non-barcode modes — positions it like the
  // tooltip but without its own background/padding (the pill has its own)
  detectedPillWrapper: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
});
