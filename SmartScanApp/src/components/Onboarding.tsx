import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import IOSStatusBar from './iOSStatusBar';

// Onboarding screen — matches Figma node 2304:9458.
// Full-screen modal with:
//   - Header: "Onboarding" title (centered) + close (✕) button (right)
//   - Food photo preview with corner brackets + "Food Photo" detected pill
//   - Headline: "One scan does it all"
//   - 3 bullet points explaining the feature
//   - Blue "Next" button pinned to bottom

type Props = {
  onDismiss: () => void; // called when user taps ✕ or "Next"
};

export default function Onboarding({ onDismiss }: Props) {
  // iOS modal-style slide up from bottom with spring
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, []);

  // Animate screen out (slide down 852px), THEN call onDismiss.
  // Prevents parent from unmounting before the animation finishes.
  const handleDismiss = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => onDismiss());
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [852, 0], // 852 = phone frame height
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      {/* iOS status bar */}
      <IOSStatusBar />

      {/* Header bar: empty left spacer + centered title + close button */}
      <View style={styles.header}>
        {/* Left spacer (matches Figma 112px) */}
        <View style={styles.headerLeftSpacer} />

        {/* Centered title */}
        <Text style={styles.headerTitle}>Onboarding</Text>

        {/* Right area with close button */}
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <Svg width={12} height={12} viewBox="0 0 12.121 12.121" fill="none">
              <Path d="M12.1211 1.06055L7.12109 6.06055L12.1211 11.0605L11.0605 12.1211L6.06055 7.12109L1.06055 12.1211L0 11.0605L5 6.06055L0 1.06055L1.06055 0L6.06055 5L11.0605 0L12.1211 1.06055Z" fill="#181877" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Preview image — food photo with corner brackets overlay */}
        {/* Figma: 282×316px, border-radius 24, centered */}
        <View style={styles.previewWrapper}>
          <View style={styles.previewContainer}>
            <Image
              source={require('../../assets/images/food-photo.jpg')}
              style={styles.previewImage}
              resizeMode="cover"
            />
            {/* Corner brackets overlay (4 corners) */}
            <View style={styles.bracketsOverlay}>
              <View style={[styles.cornerBracket, styles.cornerTL]} />
              <View style={[styles.cornerBracket, styles.cornerTR]} />
              <View style={[styles.cornerBracket, styles.cornerBL]} />
              <View style={[styles.cornerBracket, styles.cornerBR]} />
            </View>
            {/* "Food Photo" detected pill at the bottom of the image */}
            <View style={styles.detectedPill}>
              <View style={styles.detectedDot} />
              <Text style={styles.detectedText}>Food Photo</Text>
            </View>
          </View>
        </View>

        {/* Title + bullet points section */}
        {/* Figma: 24px gap between image and title, 16px gap between items */}
        <View style={styles.titleSection}>
          {/* Headline */}
          <Text style={styles.headline}>One scan does it all</Text>

          {/* Bullet point 1 */}
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>
              Just snap a photo — AI detects what you're scanning automatically.
            </Text>
          </View>

          {/* Bullet point 2 */}
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>
              No more choosing between food, barcode, or label scanners.
            </Text>
          </View>

          {/* Bullet point 3 */}
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>{'\u2022'}</Text>
            <Text style={styles.bulletText}>
              Instant Points® estimate for any meal, anywhere.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Blue "Next" button pinned to bottom */}
      {/* Figma: 358px wide, 56px tall, #0222d0 bg, 999px radius */}
      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.nextButton} onPress={handleDismiss} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e6efff',   // Figma: bg-[#e6efff]
    borderRadius: 32,             // Figma: rounded-[32px]
    overflow: 'hidden',
    zIndex: 100,
  },

  // ── Header bar — Figma: h-44, px-16, py-8, items-center, justify-between ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,   // Figma: px-[16px]
    paddingVertical: 8,      // Figma: py-[8px]
    height: 44,              // Figma: h-[44px]
  },
  headerLeftSpacer: {
    width: 112,              // Figma: w-[112px] left spacer
  },
  headerTitle: {
    fontSize: 16,            // Figma: 16px (was 17)
    fontWeight: '600',       // Figma: semibold
    color: '#031373',        // Figma: text-[#031373] (was #000)
    lineHeight: 20,          // Figma: leading-[20px]
  },
  headerRight: {
    width: 112,              // Figma: w-[112px]
    alignItems: 'flex-end',  // Figma: justify-end
  },
  closeButton: {
    width: 24,               // Figma: size-[24px]
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scrollable content ──
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,   // Figma: px-[24px]
    paddingTop: 24,          // Figma: top-[122px] minus status+header ≈ 24
    paddingBottom: 20,
  },

  // ── Preview image — Figma: 282×316px, centered, r:24 ──
  previewWrapper: {
    alignItems: 'center',    // Center the 282px image horizontally
    marginBottom: 24,        // Figma: gap-[24px]
  },
  previewContainer: {
    width: 282,              // Figma: w-[282px]
    height: 316,             // Figma: h-[316px]
    borderRadius: 24,        // Figma: rounded-[24px] (was 16)
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },

  // ── Corner brackets overlay ──
  bracketsOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 40,
  },
  cornerBracket: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#ffffff',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },

  // ── "Food Photo" detected pill ──
  detectedPill: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },
  detectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',  // green dot
  },
  detectedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ── Title + bullets section — Figma: gap-[16px] between items ──
  titleSection: {
    gap: 16,                 // Figma: gap-[16px]
  },
  headline: {
    fontSize: 24,            // Figma: 24px
    fontWeight: '700',       // Figma: bold
    color: '#031aa1',        // Figma: text-[#031aa1]
    lineHeight: 32,          // Figma: leading-[32px]
  },

  // ── Bullet points — Figma: disc list, 16px, #0e111d, 24px left margin ──
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 8,          // Indent for bullet
  },
  bulletDot: {
    fontSize: 16,
    color: '#0e111d',        // Figma: text-[#0e111d]
    lineHeight: 24,          // Figma: leading-[24px]
    marginRight: 10,
    marginTop: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,            // Figma: 16px (was 15)
    fontWeight: '400',       // Figma: regular
    color: '#0e111d',        // Figma: text-[#0e111d] (was #444)
    lineHeight: 24,          // Figma: leading-[24px]
  },

  // ── Bottom CTA — Figma: px-16, pt-16, pb-36 ──
  bottomArea: {
    paddingHorizontal: 16,   // Figma: px-[16px] (was 24)
    paddingTop: 16,          // Figma: pt-[16px]
    paddingBottom: 36,       // Figma: pb-[36px] (was 40)
  },
  nextButton: {
    backgroundColor: '#0222d0',  // Figma: #0222d0 (was #2e50ff)
    borderRadius: 999,           // Figma: rounded-[999px] (was 28)
    height: 56,                  // Figma: h-[56px] (was 52)
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 18,            // Figma: 18px (was 17)
    fontWeight: '600',       // Figma: semibold
    color: '#fef9f0',        // Figma: #fef9f0 warm white (was #fff)
  },
});
