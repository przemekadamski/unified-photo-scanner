import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import type { ScanMode } from './ModeTabs';

// Camera preview area that changes based on the active scan mode:
// - Auto: food photo with corner brackets + "Point at anything" tooltip
// - Recipe: food photo with corner brackets + "Point at a recipe" tooltip
// - Barcode: blurred/darkened photo with barcode box cutout

type Props = {
  mode: ScanMode;
};

export default function CameraView({ mode }: Props) {
  const isBarcode = mode === 'Barcode';

  // Tooltip text changes per mode
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

  return (
    <View style={styles.container}>
      {/* Background food photo */}
      <Image
        source={require('../../assets/images/food-photo.jpg')}
        style={[
          styles.photo,
          // Barcode mode: blur is handled via the dark overlay being stronger
          isBarcode && styles.photoBarcode,
        ]}
        blurRadius={isBarcode ? 2 : 0}
      />

      {/* Dark overlay on top of the photo */}
      <View
        style={[
          styles.overlay,
          // Barcode mode gets a darker overlay (0.5 vs 0.2 opacity)
          isBarcode ? styles.overlayBarcode : styles.overlayDefault,
        ]}
      />

      {/* Corner brackets for Auto/Recipe/Food/Menu modes */}
      {!isBarcode && (
        <View style={styles.bracketsContainer}>
          {/* Top-left bracket */}
          <View style={[styles.bracket, styles.bracketTL]} />
          {/* Top-right bracket */}
          <View style={[styles.bracket, styles.bracketTR]} />
          {/* Bottom-left bracket */}
          <View style={[styles.bracket, styles.bracketBL]} />
          {/* Bottom-right bracket */}
          <View style={[styles.bracket, styles.bracketBR]} />
        </View>
      )}

      {/* Barcode box cutout (clear window in the blurred area) */}
      {isBarcode && (
        <View style={styles.barcodeBoxWrapper}>
          <View style={styles.barcodeBox}>
            {/* Unblurred photo clipped inside the box */}
            <Image
              source={require('../../assets/images/food-photo.jpg')}
              style={styles.barcodeBoxPhoto}
            />
          </View>
          <View style={styles.barcodeLabel}>
            <Text style={styles.barcodeLabelText}>
              Align barcode inside the box
            </Text>
          </View>
        </View>
      )}

      {/* Tooltip bubble at the bottom of the camera area */}
      {!isBarcode && tooltipText !== '' && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltipText}</Text>
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
});
