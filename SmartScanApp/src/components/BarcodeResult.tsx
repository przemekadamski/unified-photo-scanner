import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import MealTimeTabs from './MealTimeTabs';

// "Track food" barcode result — iOS sheet overlay matching Figma node 2302:4927.
// Same sheet pattern as FoodResult: spring slide-up, tap scrim / swipe-down / X to dismiss.

type Props = {
  onClose: () => void; // called when sheet is dismissed (X, scrim tap, or swipe-down)
};

// ════════════════════════════════════════════════════════
// Nutrition table data
// ════════════════════════════════════════════════════════
const nutritionRows = [
  { label: 'Calories', value: '250 cal', indent: false },
  { label: 'Protein', value: '14 g', indent: false },
  { label: 'Fat', value: '15 g', indent: false },
  { label: 'Saturated fat', value: '3 g', indent: true },
  { label: 'Carbohydrates', value: '15 g', indent: false },
  { label: 'Fiber', value: '1 g', indent: true },
  { label: 'Total sugar', value: '0 g', indent: true },
  { label: 'Added sugar', value: '0 g', indent: true },
  { label: 'Weight', value: '97 g', indent: false },
];

// ════════════════════════════════════════════════════════
// Inline SVG icons — exact Figma paths
// ════════════════════════════════════════════════════════

// Bookmark icon (Figma: "icon/bookmark", node 2302:4935)
function BookmarkIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z"
        fill="#0e111d"
      />
    </Svg>
  );
}

// Close X icon (Figma: "icon/close" — same path as FoodResult)
function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="-6.25 -6.25 24 24" fill="none">
      <Path
        d="M10.2197 0.21967C10.5126 -0.0732233 10.9873 -0.0732233 11.2802 0.21967C11.5731 0.512563 11.5731 0.987324 11.2802 1.28022L6.81049 5.74994L11.2802 10.2197C11.5731 10.5126 11.5731 10.9873 11.2802 11.2802C10.9873 11.5731 10.5126 11.5731 10.2197 11.2802L5.74994 6.81049L1.28022 11.2802C0.987324 11.5731 0.512563 11.5731 0.21967 11.2802C-0.0732233 10.9873 -0.0732233 10.5126 0.21967 10.2197L4.6894 5.74994L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L5.74994 4.6894L10.2197 0.21967Z"
        fill="#0e111d"
      />
    </Svg>
  );
}

// Broccoli icon for nutritional insights badge (Figma: "vegetables_broccoli")
function BroccoliIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 2C8.9 2 8 2.9 8 4C7 3.5 5.8 3.8 5.1 4.7C4.4 5.6 4.4 6.8 5.1 7.7C4 8.2 3.4 9.5 3.8 10.7C4.2 11.9 5.3 12.6 6.5 12.5L8.5 18H11.5L13.5 12.5C14.7 12.6 15.8 11.9 16.2 10.7C16.6 9.5 16 8.2 14.9 7.7C15.6 6.8 15.6 5.6 14.9 4.7C14.2 3.8 13 3.5 12 4C12 2.9 11.1 2 10 2Z"
        fill="#4a8700"
      />
    </Svg>
  );
}

// ════════════════════════════════════════════════════════
// Main BarcodeResult — iOS sheet overlay
// ════════════════════════════════════════════════════════

export default function BarcodeResult({ onClose }: Props) {
  // Meal time tab state
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');

  // iOS sheet slide-up animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, []);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });

  // Dismiss sheet — spring slide-down then call onClose
  const dismissSheet = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => onClose());
  };

  // Swipe-down gesture on drag handle
  const dragY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Dismiss
          Animated.timing(dragY, {
            toValue: 800,
            duration: 250,
            useNativeDriver: false,
          }).start(() => onClose());
        } else {
          // Snap back
          Animated.spring(dragY, {
            toValue: 0,
            tension: 65,
            friction: 11,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Combine slide-up + drag offset
  const combinedTranslateY = Animated.add(translateY, dragY);

  return (
    <View style={styles.container}>
      {/* Dark overlay — fades in/out with the sheet animation */}
      <Animated.View style={[styles.overlay, { opacity: slideAnim }]} />

      {/* White iOS large sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: combinedTranslateY }] }]}>
        {/* Toolbar with drag handle — swipe down to dismiss */}
        <View style={styles.toolbar} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row: bookmark (left) + "Track food" (center) + close X (right) */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconButton}>
              <BookmarkIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Track food</Text>
            <TouchableOpacity onPress={dismissSheet} style={styles.iconButton}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Product title + Point Coin */}
          <View style={styles.titleRow}>
            <Text style={styles.productName}>Grandma's Chicken Soup</Text>
            <View style={styles.pointCoin}>
              <Text style={styles.pointCoinText}>1</Text>
            </View>
          </View>

          {/* Serving size field */}
          <View style={styles.inputField}>
            <Text style={styles.inputLabel}>Serving size</Text>
            <Text style={styles.inputValue}>2 servings</Text>
          </View>

          {/* Meal time section — reuses shared MealTimeTabs component */}
          <Text style={styles.sectionHeader}>Meal time</Text>
          <MealTimeTabs selectedMeal={selectedMeal} onSelectMeal={setSelectedMeal} />

          {/* Date field */}
          <View style={[styles.inputField, { marginTop: 16 }]}>
            <Text style={styles.inputLabel}>Date</Text>
            <Text style={styles.inputValue}>Nov 11, 2025</Text>
          </View>

          {/* Nutritional insights card */}
          <View style={styles.insightsCard}>
            <Text style={styles.cardTitle}>Nutritional insights</Text>
            <View style={styles.insightBadge}>
              <BroccoliIcon />
              <Text style={styles.insightBadgeText}>Higher source of fiber</Text>
            </View>
          </View>

          {/* Nutritional information card */}
          <View style={styles.nutritionCard}>
            <Text style={styles.cardTitle}>Nutritional information</Text>
            <View style={styles.nutritionTable}>
              {nutritionRows.map((row, index) => (
                <View key={row.label}>
                  {/* Row */}
                  <View style={[styles.nutritionRow, row.indent && styles.nutritionRowIndent]}>
                    <Text style={[
                      styles.nutritionLabel,
                      row.indent ? styles.nutritionLabelSub : styles.nutritionLabelMain,
                    ]}>
                      {row.label}
                    </Text>
                    <Text style={[
                      styles.nutritionValue,
                      row.indent ? styles.nutritionValueSub : styles.nutritionValueMain,
                    ]}>
                      {row.value}
                    </Text>
                  </View>
                  {/* Divider (not after last row) */}
                  {index < nutritionRows.length - 1 && (
                    <View style={[
                      styles.nutritionDivider,
                      // Indent divider if current or next row is a sub-item
                      (row.indent || nutritionRows[index + 1]?.indent) && styles.nutritionDividerIndent,
                    ]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA: Track button */}
        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.trackButton} activeOpacity={0.8}>
            <Text style={styles.trackButtonText}>Track</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// Styles — Figma node 2302:4927
// ════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // ── Full-screen container ──
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 80,
  },

  // ── Dark overlay — 0.6 opacity, fades with slideAnim ──
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  // ── White iOS large sheet — top:54 leaves gap for parent peek-through ──
  sheet: {
    position: 'absolute',
    top: 54,                               // iOS large sheet offset (matches FoodResult)
    left: 0,
    right: 0,
    bottom: -8,                            // slight overextension to hide bottom edge
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: 'hidden',
    // Floating sheet shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.18,
    shadowRadius: 75,
    elevation: 24,
  },

  // ── Toolbar / drag handle — Figma: h-26 ──
  toolbar: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#c4c4c4',
  },

  // ── ScrollView ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24, // (390 - 342) / 2 = 24
    paddingBottom: 16,
  },

  // ── Header row — Figma: gap-8, h-32 ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    gap: 8,
  },
  iconButton: {
    width: 39,
    padding: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#0e111d',
    lineHeight: 32,
    textAlign: 'center',
  },

  // ── Product title + Point Coin — Figma: gap-8, mt-32 ──
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  productName: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#031373',
    lineHeight: 32,
  },
  // Point Coin — Figma: 40×40, border 1.5px #2f2f85, rounded-full
  pointCoin: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#2f2f85',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pointCoinText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181877',
    lineHeight: 24,
    letterSpacing: -0.45,
  },

  // ── Input field — Figma: h-62, white bg, border rgba(199,198,212,0.4), r:16, px:16 py:12 ──
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(199, 198, 212, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#08070c',
    lineHeight: 20,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#08070c',
    lineHeight: 24,
  },

  // ── Section header — Figma: 18px SemiBold #031373 ──
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#031373',
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
  },

  // ── Nutritional insights card — Figma: border #d1d1e4, r:16, p:16 ──
  insightsCard: {
    borderWidth: 1,
    borderColor: '#d1d1e4',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#08070c',
    lineHeight: 24,
    letterSpacing: -0.31,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: '#e1f1b2',
    borderRadius: 8,
    paddingLeft: 6,
    paddingRight: 8,
    paddingVertical: 4,
  },
  insightBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#172e00',
    lineHeight: 16,
  },

  // ── Nutritional information card — Figma: border #d1d1e4, r:16, pt:16 px:16 pb:8 ──
  nutritionCard: {
    borderWidth: 1,
    borderColor: '#d1d1e4',
    borderRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: 24,
  },
  nutritionTable: {
    marginTop: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 12,
    paddingRight: 4,
  },
  nutritionRowIndent: {
    paddingLeft: 24,
  },
  nutritionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#08070c',
    lineHeight: 24,
    letterSpacing: -0.31,
  },
  nutritionLabelMain: {
    fontWeight: '500',
  },
  nutritionLabelSub: {
    fontWeight: '400',
  },
  nutritionValue: {
    fontSize: 14,
    color: '#08070c',
    lineHeight: 18,
    letterSpacing: -0.15,
  },
  nutritionValueMain: {
    fontWeight: '500',
  },
  nutritionValueSub: {
    fontWeight: '500',
  },
  nutritionDivider: {
    height: 0.5,
    backgroundColor: '#d1d1e4',
  },
  nutritionDividerIndent: {
    marginLeft: 24,
  },

  // ── Bottom CTA — Figma: pt:16 pb:36 px:24 ──
  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
  },
  trackButton: {
    backgroundColor: '#0222d0',
    borderRadius: 999,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  trackButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f4f5f9',
    lineHeight: 24,
  },
});
