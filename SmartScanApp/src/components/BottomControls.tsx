import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';

// Bottom controls area: gallery icon (left), shutter button (center), mode pill (right)
// The mode pill shows the current mode name in yellow text on a glass-style dark pill.
// Tapping the pill will open the mode picker grid (Phase 2).

type Props = {
  visible: boolean;
  onShutter?: () => void;       // called when shutter button is tapped
  activeMode?: string;           // current scan mode label (e.g. "Auto", "Barcode")
  onModePillTap?: () => void;    // called when the mode pill is tapped
};

export default function BottomControls({ visible, onShutter, activeMode = 'Auto', onModePillTap }: Props) {
  return (
    <View style={[styles.container, !visible && styles.hidden]}>
      {/* Gallery icon — left side */}
      <View style={styles.sideColumn}>
        <Image
          source={require('../../assets/images/Camera.png')}
          style={styles.galleryIcon}
        />
      </View>

      {/* Shutter button — centered */}
      <View style={styles.centerColumn}>
        <TouchableOpacity style={styles.shutterOuter} onPress={onShutter}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
      </View>

      {/* Mode pill — right side, shows current mode in yellow text */}
      <View style={styles.sideColumn}>
        <TouchableOpacity style={styles.modePill} onPress={onModePillTap} activeOpacity={0.7}>
          <Text style={styles.modePillText}>{activeMode}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingTop: 24,
    paddingBottom: 16,
  },
  hidden: {
    opacity: 0,
  },
  // Left and right columns take equal space so shutter stays centered
  sideColumn: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  // Outer ring of the shutter button (unchanged — 72px white circle)
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Inner white circle
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
  },
  // Mode pill — translucent pill with yellow text
  // Matches Figma node 2297:3732 exactly
  modePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 54,
    paddingHorizontal: 16,
    paddingVertical: 10,
    // Glass effect — frosted blur + subtle border (same pattern as ModePicker)
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
  },
  modePillText: {
    fontSize: 16,
    fontWeight: '500',       // Figma: Geist Medium (500)
    color: '#FFE845',
    letterSpacing: -0.2,
    lineHeight: 18,          // Figma: leading-[18px]
    textAlign: 'center',
  },
});
