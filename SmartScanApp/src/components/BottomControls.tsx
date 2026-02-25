import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

// Bottom area: gallery thumbnail on left, shutter button in center
// Hidden when in Barcode mode (sheet replaces these)

type Props = {
  visible: boolean;
};

export default function BottomControls({ visible }: Props) {
  return (
    <View style={[styles.container, !visible && styles.hidden]}>
      {/* Gallery icon (Camera.png thumbnail) */}
      <Image
        source={require('../../assets/images/Camera.png')}
        style={styles.galleryIcon}
      />

      {/* Shutter button — white circle with a ring */}
      <TouchableOpacity style={styles.shutterOuter}>
        <View style={styles.shutterInner} />
      </TouchableOpacity>

      {/* Empty spacer to balance the layout */}
      <View style={styles.galleryIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 64,
    paddingTop: 24,
    paddingBottom: 16,
  },
  // Keep the space but hide visually (preserves layout height)
  hidden: {
    opacity: 0,
  },
  galleryIcon: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  // Outer ring of the shutter button
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
});
