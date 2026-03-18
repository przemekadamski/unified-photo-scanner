import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

// Coachmark tooltip — matches Figma node 2302:4116.
// Full-screen dark overlay with a white card positioned above the bottom controls.
// The card has a downward-pointing triangle on the right side,
// pointing at the "Auto" mode pill in BottomControls.
// Shows title, body text, and a "Got it" dismiss link.

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function Coachmark({ visible, onDismiss }: Props) {
  // iOS-style fade+scale entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 200,
        friction: 20,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const scale = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Animated.View style={[styles.backdrop, { opacity: fadeAnim, transform: [{ scale }] }]}>
      {/* Coachmark card — positioned above bottom controls area */}
      {/* Figma: p-16, w-full inside a px-16 wrapper, at top: calc(50% + 208px) */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          {/* Content section with title + body */}
          <View style={styles.content}>
            {/* Title — Figma: 18px, Medium (500), #08070c, tracking -0.44 */}
            <Text style={styles.title}>Scan mode (Auto mode)</Text>

            {/* Body — Figma: 16px, Regular (400), #525163, tracking -0.31, lh 24 */}
            <Text style={styles.body}>
              Point at anything — food, recipes, menus, or barcodes. I'll figure out what it is and get you the Points® value.
            </Text>
          </View>

          {/* "Got it" dismiss link — Figma: 16px, Medium (500), #2e50ff, tracking -0.31 */}
          <TouchableOpacity onPress={onDismiss} activeOpacity={0.7}>
            <Text style={styles.gotIt}>Got it</Text>
          </TouchableOpacity>
        </View>

        {/* Downward-pointing triangle — points at the Auto pill (right side) */}
        <View style={styles.triangleRow}>
          <View style={styles.triangle} />
        </View>
      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ── Dark overlay — Figma: rgba(0,0,0,0.4), full screen ──
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',   // Figma: 0.4 (was 0.3)
    zIndex: 90,
  },

  // ── Card wrapper — 12px above the Auto button's top edge ──
  // Auto pill is inside controls (218px area) at top:105px → top of pill is 852-218+105 = 739px
  // from bottom: 852-739 = 113px. Card bottom (incl. triangle 8px) = 113 + 12 = 125px
  cardWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 125,             // 12px gap above Auto button top edge + 8px triangle
  },

  // ── White tooltip card — Figma: rounded-12, p-16, gap-16 ──
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,        // Figma: rounded-[12px] (was 16)
    padding: 16,             // Figma: p-[16px] (was 20)
    gap: 16,                 // Figma: gap-[16px] (was 10)
    // Figma dual shadow: 0px 8px 28px rgba(7,5,23,0.12) + 0px 18px 88px rgba(7,5,23,0.14)
    shadowColor: '#070517',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },

  // ── Content section (title + body) — Figma: gap-4, pr-24 ──
  content: {
    gap: 4,                  // Figma: gap-[4px]
    paddingRight: 24,        // Figma: pr-[24px]
  },

  // ── Title — Figma: 18px, Medium (500), #08070c, tracking -0.44 ──
  title: {
    fontSize: 18,            // Figma: 18px (was 16)
    fontWeight: '500',       // Figma: Medium (was 700)
    color: '#08070c',
    letterSpacing: -0.44,    // Figma: tracking-[-0.44px] (was -0.2)
    lineHeight: 24,          // Figma: leading-[24px]
  },

  // ── Body — Figma: 16px, Regular (400), #525163, tracking -0.31, lh 24 ──
  body: {
    fontSize: 16,            // Figma: 16px (was 14)
    fontWeight: '400',       // Figma: Regular
    color: '#525163',        // Figma: #525163 (was #555555)
    lineHeight: 24,          // Figma: 24px (was 20)
    letterSpacing: -0.31,    // Figma: tracking-[-0.31px]
  },

  // ── "Got it" link — Figma: 16px, Medium (500), #2e50ff, tracking -0.31 ──
  gotIt: {
    fontSize: 16,            // Figma: 16px (was 15)
    fontWeight: '500',       // Figma: Medium (was 600)
    color: '#2e50ff',        // Figma: #2e50ff
    letterSpacing: -0.31,    // Figma: tracking-[-0.31px]
    lineHeight: 24,          // Figma: leading-[24px]
  },

  // ── Triangle pointer — positioned to point at center of Auto pill ──
  // Auto pill center is at ~315px from screen left. Card left is 16px.
  // So triangle left = 315 - 16 - 12 (half triangle width) = 287px from card left
  triangleRow: {
    alignItems: 'flex-start',
    paddingLeft: 287,
  },

  // ── CSS triangle pointing down ──
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffffff',
  },
});
