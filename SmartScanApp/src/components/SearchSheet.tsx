import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Pressable } from 'react-native';
import { Svg, Path } from 'react-native-svg';

// Bottom drawer/sheet that slides up/down when entering/leaving Barcode mode.
// When `scanned` is true, replaces search content with the scanned product card.
// Matches smart-scan.html: sheet-slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1)

type Props = {
  visible: boolean;
  scanning?: boolean; // true = show "Scanning..." spinner state (before search)
  scanned?: boolean; // true = show product result instead of search
  onProductTap?: () => void; // called when the scanned product card is tapped
  onSearchManually?: () => void; // called when "Search manually" link is tapped
  onServingTap?: () => void; // called when serving dropdown is tapped
  onMealTap?: () => void; // called when meal dropdown is tapped
  servingLabel?: string; // display text for serving dropdown (default "3 oz")
  mealLabel?: string; // display text for meal dropdown (default "Breakfast")
};

// Sheet height — taller when scanned to fit 3-row card_food layout
// Figma: scanning state = 166px (y:686→852), product card = 197px (includes HomeIndicator)
const SHEET_HEIGHT_SEARCH = 166;
const SHEET_HEIGHT_SCANNED = 197;

// ════════════════════════════════════════════════════════
// Inline SVG icons — exact Figma paths
// ════════════════════════════════════════════════════════

// Chevron down for dropdowns (Figma: "icon_chevron", 24×24)
function ChevronDownIcon() {
  return (
    <Svg width={24} height={24} viewBox="-7.25 -9.25 24 24" fill="none">
      <Path
        d="M8.21967 0.21967C8.51256 -0.0732233 8.98732 -0.0732233 9.28022 0.21967C9.57311 0.512563 9.57311 0.987324 9.28022 1.28022L5.28022 5.28022C4.98732 5.57311 4.51256 5.57311 4.21967 5.28022L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L4.74994 3.6894L8.21967 0.21967Z"
        fill="#031AA1"
      />
    </Svg>
  );
}

// Breakfast / takeout cup icon (Figma: "breakfast" node 2174:2259, 24×24)
function BreakfastIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.25 2.5C10.25 2.22 10.47 2 10.75 2H13.25C13.53 2 13.75 2.22 13.75 2.5V4H16C16.83 4 17.5 4.67 17.5 5.5C17.5 6.33 16.83 7 16 7H8C7.17 7 6.5 6.33 6.5 5.5C6.5 4.67 7.17 4 8 4H10.25V2.5ZM8.25 8H15.75L14.5 21H9.5L8.25 8Z"
        fill="#031AA1"
      />
    </Svg>
  );
}

// Plus icon — white on blue circle (Figma: "add_plus", 20×20 inside 40×40 button)
function PlusIcon() {
  return (
    <Svg width={20} height={20} viewBox="-4.25 -4.25 20 20" fill="none">
      <Path
        d="M5.75 0C6.16406 0.000175875 6.5 0.335895 6.5 0.75V5H10.75C11.1641 5 11.4998 5.33594 11.5 5.75C11.4998 6.16406 11.1641 6.5 10.75 6.5H6.5V10.75C6.5 11.1641 6.16406 11.4998 5.75 11.5C5.33594 11.4998 5 11.1641 5 10.75V6.5H0.75C0.335895 6.5 0.000175875 6.16406 0 5.75C0.000175955 5.33594 0.335895 5 0.75 5H5V0.75C5 0.335895 5.33594 0.000175955 5.75 0Z"
        fill="white"
      />
    </Svg>
  );
}

// Chicken leg icon — protein nutrient tag (Figma: "chicken_leg", 16×16)
function ChickenLegIcon() {
  return (
    <Svg width={16} height={16} viewBox="-1.25 -1.25 16 16" fill="none">
      <Path
        d="M2.32129 0.256209C2.91331 -0.0852743 3.64246 -0.0855315 4.23438 0.256209C4.82632 0.598019 5.19125 1.22991 5.19141 1.91344V2.71617L5.94531 3.47008C6.62988 3.32135 7.37601 3.3558 8.10645 3.52965C9.49516 3.86026 10.9593 4.70491 12.2061 5.95152C13.9329 7.67837 13.9326 10.4784 12.2061 12.2054C10.4791 13.9324 7.67912 13.9324 5.95215 12.2054C4.70549 10.9586 3.86085 9.49461 3.53027 8.10582C3.35637 7.37492 3.32061 6.62861 3.46973 5.94371L2.7168 5.19078H1.91406C0.85709 5.19078 0 4.33369 0 3.27672C0.000374298 2.38895 0.605712 1.64396 1.42578 1.42808C1.55378 0.940093 1.87293 0.515066 2.32129 0.256209ZM7.75879 4.98961C7.05641 4.82244 6.46944 4.84492 6.0166 5.00523C6.00983 5.00806 6.00293 5.01043 5.99609 5.01304C5.75454 5.10161 5.5515 5.22924 5.39062 5.39C5.22918 5.55144 5.10038 5.75564 5.01172 5.9984C5.0096 6.00387 5.00811 6.00956 5.00586 6.015C4.845 6.46801 4.82294 7.055 4.99023 7.75816C5.24669 8.83569 5.93001 10.062 7.0127 11.1449C8.15388 12.2861 10.0043 12.2861 11.1455 11.1449C12.2863 10.0037 12.2866 8.15313 11.1455 7.01207C10.0627 5.92944 8.83625 5.24611 7.75879 4.98961ZM3.48438 1.55504C3.35661 1.48132 3.19916 1.48157 3.07129 1.55504C2.94338 1.62888 2.86442 1.76576 2.86426 1.91344V2.11363C2.86407 2.52743 2.528 2.86322 2.11426 2.86363H1.91406C1.68579 2.86363 1.50045 3.04855 1.5 3.27672C1.5 3.50526 1.68552 3.69078 1.91406 3.69078H3.02734C3.22601 3.69089 3.41708 3.77009 3.55762 3.91051L4.16016 4.51304C4.21357 4.45025 4.27063 4.3889 4.33008 4.32945C4.38967 4.26988 4.45072 4.21304 4.51367 4.15953L3.91113 3.55699C3.77062 3.41636 3.69141 3.22552 3.69141 3.02672V1.91344C3.69125 1.76581 3.61222 1.6289 3.48438 1.55504Z"
        fill="#773CD9"
      />
    </Svg>
  );
}

// Apple icon — veg nutrient tag (Figma: "apple", 16×16)
function AppleIcon() {
  return (
    <Svg width={16} height={16} viewBox="-1.75 -0.75 15.667 15.667" fill="none">
      <Path
        d="M9.58398 0C9.99779 0.00035158 10.3338 0.336153 10.334 0.75V1.97656C10.334 2.59726 10.1326 3.17081 9.79492 3.63965C10.3626 3.88198 10.8411 4.26248 11.2158 4.76074C11.878 5.64139 12.167 6.81919 12.167 8.08398C12.1668 11.4447 9.44378 14.167 6.08301 14.167C2.72239 14.1668 0.000175963 11.4446 0 8.08398C0 6.81929 0.288111 5.64137 0.950195 4.76074C1.63381 3.85175 2.6625 3.33398 3.9502 3.33398L4.01953 3.33691C4.50765 3.38212 4.99284 3.44913 5.47363 3.53613C5.3839 3.16311 5.06671 2.87847 4.67676 2.83887L4.58301 2.83398H4.25C3.83589 2.83398 3.50018 2.49805 3.5 2.08398C3.5 1.66977 3.83579 1.33398 4.25 1.33398H4.58301L4.83008 1.34668C5.17164 1.38136 5.49086 1.48937 5.77539 1.65137C5.91411 1.35319 6.10254 1.07717 6.33984 0.839844C6.87139 0.308426 7.60119 0.000106028 8.35645 0H9.58398ZM8.24414 4.83398C7.57705 4.89149 6.91041 5.00432 6.25 5.15527C6.14019 5.18029 6.02581 5.18036 5.91602 5.15527C5.25999 5.00533 4.59098 4.89804 3.91504 4.83398C3.08863 4.84267 2.52716 5.15989 2.14941 5.66211C1.74515 6.19978 1.5 7.02235 1.5 8.08398C1.50018 10.6162 3.55081 12.6668 6.08301 12.667C8.61535 12.667 10.6668 10.6163 10.667 8.08398C10.667 7.02239 10.4218 6.19978 10.0176 5.66211C9.63869 5.15831 9.07471 4.84083 8.24414 4.83398ZM8.35645 1.5C8.00553 1.50011 7.65528 1.64563 7.40039 1.90039C7.14898 2.15185 7.00698 2.49405 7.00684 2.85645V3.33301H7.47656C8.22739 3.33292 8.83398 2.72384 8.83398 1.97656V1.5H8.35645Z"
        fill="#067C59"
      />
    </Svg>
  );
}

// ════════════════════════════════════════════════════════
// ScannerDots — 4 blue dots in a 2×2 grid that pulse in
// sequence, matching the Figma spinner design.
// ════════════════════════════════════════════════════════

function ScannerDots() {
  // Each dot gets its own animated opacity value (0.3 = dim, 1 = bright)
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const dot4 = useRef(new Animated.Value(0.3)).current;
  const dots = [dot1, dot2, dot3, dot4];

  useEffect(() => {
    // Each dot pulses in sequence with staggered delays.
    // Total cycle = 1050ms per loop iteration (all dots sync up).
    // Formula: delay(i*150) + fadeIn(300ms) + fadeOut(300ms) + delay((3-i)*150)
    const anims = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),            // stagger start
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: false }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: false }),
          Animated.delay((3 - i) * 150),      // pad end so total is constant
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={scannerDotsStyles.container}>
      {/* Top row: dots 0 and 1 */}
      <View style={scannerDotsStyles.row}>
        <Animated.View style={[scannerDotsStyles.dot, { opacity: dot1 }]} />
        <Animated.View style={[scannerDotsStyles.dot, { opacity: dot2 }]} />
      </View>
      {/* Bottom row: dots 2 and 3 */}
      <View style={scannerDotsStyles.row}>
        <Animated.View style={[scannerDotsStyles.dot, { opacity: dot3 }]} />
        <Animated.View style={[scannerDotsStyles.dot, { opacity: dot4 }]} />
      </View>
    </View>
  );
}

const scannerDotsStyles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#031AA1', // Figma: on_surface/primary blue
  },
});

// ════════════════════════════════════════════════════════
// SearchSheet component
// ════════════════════════════════════════════════════════

export default function SearchSheet({
  visible,
  scanning = false,
  scanned = false,
  onProductTap,
  onSearchManually,
  onServingTap,
  onMealTap,
  servingLabel = '3 oz',
  mealLabel = 'Breakfast',
}: Props) {
  // ── Slide animation: sheet enters/exits from bottom ──
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Content transition: 0 = search bar, 1 = product card ──
  // This drives the cross-fade, height change, and background fade
  const contentAnim = useRef(new Animated.Value(0)).current;

  // ── Scanning transition: 0 = scanning visible, 1 = search visible ──
  // Drives the cross-fade between "Scanning..." spinner and search input
  const scanAnim = useRef(new Animated.Value(scanning ? 0 : 1)).current;

  // Animate scanning → search transition when `scanning` prop changes
  useEffect(() => {
    Animated.spring(scanAnim, {
      toValue: scanning ? 0 : 1,
      tension: 65,     // iOS-style spring (same as other animations)
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, [scanning, scanAnim]);

  // Scanning layer fades out in the first half of the transition
  const scanningOpacity = scanAnim.interpolate({
    inputRange: [0, 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Search layer fades in during the second half (after scanning fades out)
  const scanToSearchOpacity = scanAnim.interpolate({
    inputRange: [0.3, 0.8],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Slide sheet in/out when visibility changes
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 1 : 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, [visible, slideAnim]);

  // Animate content transition when scanned state changes
  useEffect(() => {
    Animated.spring(contentAnim, {
      toValue: scanned ? 1 : 0,
      tension: 65,    // iOS-style spring (same as FoodResult)
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, [scanned, contentAnim]);

  // ── Derived animated values ──

  // Height morphs smoothly between search (155) and scanned (195)
  const animatedHeight = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_HEIGHT_SEARCH, SHEET_HEIGHT_SCANNED],
  });

  // White background stays visible in all states (scanning, search, scanned)
  // so the product card always appears inside a white sheet
  const bgOpacity = 1;

  // Border radius animates: scanning/search state = 32px (Figma radius_large),
  // product card state = 27px (Figma barcode_card sheet)
  const animatedBorderRadius = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 27],
  });

  // Search content: fades out + slides down in first half of animation
  const searchOpacity = contentAnim.interpolate({
    inputRange: [0, 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const searchSlideY = contentAnim.interpolate({
    inputRange: [0, 0.5],
    outputRange: [0, 15],    // slides down 15px as it fades out
    extrapolate: 'clamp',
  });

  // Product card: fades in + slides up in second half of animation
  const cardOpacity = contentAnim.interpolate({
    inputRange: [0.3, 0.8],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const cardSlideY = contentAnim.interpolate({
    inputRange: [0.3, 1],
    outputRange: [20, 0],    // slides up 20px as it fades in
    extrapolate: 'clamp',
  });

  // Use max height for off-screen position so sheet never peeks
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_HEIGHT_SCANNED, 0],
  });

  return (
    <Animated.View
      style={[
        styles.sheet,
        { height: animatedHeight, transform: [{ translateY }] },
      ]}
    >
      {/* White background layer — border radius animates between scanning (32) and card (27) */}
      <Animated.View
        style={[
          styles.sheetWhiteBgLayer,
          { opacity: bgOpacity, borderTopLeftRadius: animatedBorderRadius, borderTopRightRadius: animatedBorderRadius },
        ]}
        pointerEvents="none"
      />

      {/* Scanning content — spinner + "Scanning..." + "Search manually" link */}
      {/* Visible when scanning=true, fades out when scanning transitions to false */}
      {/* zIndex:3 ensures this layer sits ABOVE the search/product layers so taps work */}
      <Animated.View
        style={[
          styles.contentLayer,
          { opacity: scanningOpacity, paddingTop: 32, gap: 8, zIndex: scanning ? 3 : 0 },
        ]}
        pointerEvents={scanning ? 'auto' : 'none'}
      >
        {/* Small drag handle at the top */}
        <View style={styles.handle} />

        {/* Spinner + "Scanning..." label grouped together */}
        <View style={styles.scanningGroup}>
          <ScannerDots />
          <Text style={styles.scanningText}>Scanning...</Text>
        </View>

        {/* Fallback link: "Can't scan the item? Search manually" */}
        <View style={styles.scanningPromptRow}>
          <Text style={styles.scanningPrompt}>Can't scan the item? </Text>
          <Pressable onPress={onSearchManually}>
            <Text style={styles.searchManuallyLink}>Search manually</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Search content — fades out + slides down */}
      {/* Wrapped in an outer Animated.View that fades in when scanning ends */}
      <Animated.View style={{ opacity: scanToSearchOpacity, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents={scanning ? 'none' : 'auto'}>
      <Animated.View
        style={[
          styles.contentLayer,
          { opacity: searchOpacity, transform: [{ translateY: searchSlideY }], paddingTop: 32, gap: 8 },
        ]}
        pointerEvents={scanned ? 'none' : 'auto'}
      >
        {/* Small drag handle at the top */}
        <View style={styles.handle} />

        {/* Prompt text with "Search manually" link */}
        <Text style={styles.prompt}>
          Can't find the item?{' '}
          <Text style={styles.promptLink}>Search manually</Text>
        </Text>

        {/* Search input bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Svg width={18} height={18} viewBox="0 0 17.5068 17.5068" fill="none">
              <Path
                d="M7.81152 0C12.1258 0 15.6238 3.4973 15.624 7.81152C15.624 9.69866 14.9539 11.4289 13.8398 12.7793L17.2871 16.2256C17.58 16.5185 17.58 16.9942 17.2871 17.2871C16.9942 17.58 16.5185 17.58 16.2256 17.2871L12.7793 13.8398C11.4289 14.9539 9.69866 15.624 7.81152 15.624C3.4973 15.6238 0 12.1258 0 7.81152C0.000225735 3.49744 3.49744 0.000225731 7.81152 0ZM7.81152 1.5C4.32587 1.50023 1.50023 4.32587 1.5 7.81152C1.5 11.2974 4.32573 14.1238 7.81152 14.124C11.2975 14.124 14.124 11.2975 14.124 7.81152C14.1238 4.32573 11.2974 1.5 7.81152 1.5Z"
                fill="#031373"
              />
            </Svg>
          </View>
          <View style={styles.cursorLine} />
          <Text style={styles.searchText}>Enter barcode number</Text>
        </View>
      </Animated.View>
      </Animated.View>

      {/* Product card — fades in + slides up */}
      <Animated.View
        style={[
          styles.contentLayer,
          { opacity: cardOpacity, transform: [{ translateY: cardSlideY }], justifyContent: 'flex-start', paddingTop: 17, gap: 8 },
        ]}
        pointerEvents={scanned ? 'auto' : 'none'}
      >
        {/* Drag handle at the top of the sheet */}
        <View style={styles.handle} />

        {/* Scanned product card — tappable to open full BarcodeResult */}
        <Pressable style={styles.productCard} onPress={onProductTap}>
          {/* Row 1: Product name — Figma: controls_top */}
          <View style={styles.cardRow1}>
            <Text style={styles.productName} numberOfLines={2}>
              Chicken breast
            </Text>
          </View>

          {/* Row 2: Two dropdowns + blue plus — Figma: "dropdowns" row, gap:8 */}
          {/* Dropdowns are tappable to open picker sheets */}
          <View style={styles.dropdownsRow}>
            <TouchableOpacity style={styles.servingDropdown} onPress={onServingTap} activeOpacity={0.7}>
              <Text style={styles.dropdownText}>{servingLabel}</Text>
              <ChevronDownIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mealDropdown} onPress={onMealTap} activeOpacity={0.7}>
              <View style={styles.mealLabel}>
                <BreakfastIcon />
                <Text style={styles.dropdownText}>{mealLabel}</Text>
              </View>
              <ChevronDownIcon />
            </TouchableOpacity>
            <View style={styles.addButtonBlue}>
              <PlusIcon />
            </View>
          </View>

          {/* Row 3: Points badge + nutrition tags — Figma: controls_bottom */}
          <View style={styles.cardRow3}>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>2</Text>
            </View>
            <View style={styles.nutritionGroup}>
              <View style={styles.proteinTag}>
                <ChickenLegIcon />
                <Text style={styles.tagText}>25 g</Text>
              </View>
              <View style={styles.vegTag}>
                <AppleIcon />
                <Text style={styles.tagText}>0 g</Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Padding and alignment moved to contentLayer (for overlapping cross-fade)
  },
  // White background layer — absolute fill, fades out during search→scanned transition
  sheetWhiteBgLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    // borderRadius is now animated inline (32→27) — see animatedBorderRadius
  },
  // Content layer — absolute fill so search and card can overlap during cross-fade
  contentLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Small grey pill at the top of the search sheet
  handle: {
    position: 'absolute',
    top: 6,
    width: 55,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CECECE',
  },
  // "Can't find the item? Search manually"
  prompt: {
    fontSize: 14,
    color: '#08070c',
    textAlign: 'center',
    lineHeight: 24,
  },
  promptLink: {
    color: '#08070c',
    fontWeight: '400',
  },

  // ── Scanning state styles ──
  // Groups the spinner and "Scanning..." text vertically
  scanningGroup: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,                         // Figma: gap-[4px] between spinner and label
  },
  // "Scanning..." text below the spinner dots
  scanningText: {
    fontSize: 16,
    color: '#08070c',               // Figma: text_dark_inverse
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: -0.31,
  },
  // Row wrapper so "Can't scan..." and "Search manually" sit inline
  scanningPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // "Can't scan the item?" text
  scanningPrompt: {
    fontSize: 14,
    color: '#08070c',               // Figma: text_dark_inverse
    lineHeight: 24,
    letterSpacing: -0.31,
  },
  // "Search manually" blue tappable link
  searchManuallyLink: {
    fontSize: 14,
    color: '#031aa1',               // Figma: on_surface/primary blue
    fontWeight: '500',              // Figma: Geist Medium
    lineHeight: 24,
    letterSpacing: -0.31,
  },
  // The search input bar
  searchBar: {
    width: 358,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D1E4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Thin vertical blue cursor line
  cursorLine: {
    width: 1,
    height: 20,
    backgroundColor: '#181386',
    borderRadius: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#5A577D',
    letterSpacing: -0.31,
    lineHeight: 24,
  },

  // ── RESULT(S) label ──
  resultsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8b8d9e',
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },

  // ════════════════════════════════════════════════════════
  // Scanned product card — Figma card_food (node 2302:4315)
  // 3-row layout: [name] → [dropdowns + plus] → [points + tags]
  // ════════════════════════════════════════════════════════
  productCard: {
    width: '100%',
    backgroundColor: '#e6efff',       // Figma: blue_01_meno
    borderRadius: 16,                  // Figma: rounded-[16px]
    padding: 12,                       // Figma: p-[12px]
    gap: 12,                           // Figma: gap-[12px]
    // Figma: Elevation/Raised shadow
    shadowColor: '#070517',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  // ── Row 1: Product name + empty icon button area ──
  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,                           // Figma: gap-[12px]
  },
  productName: {
    flex: 1,
    fontSize: 16,                      // Figma: subhead3, 16px
    fontWeight: '600',                 // Figma: Semibold
    color: '#031aa1',                  // Figma: on_surface/primary
    lineHeight: 19.2,                  // Figma: leading-[1.2]
  },

  // ── Row 2: Two dropdowns + blue plus button ──
  dropdownsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,                            // Figma: gap-[8px]
  },
  // Dropdown 1: Serving amount — Figma: flex-1, pl:16 pr:12 py:8, border #b0bcc8
  servingDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6efff',        // Figma: blue_01_meno
    borderWidth: 1,
    borderColor: '#b0bcc8',            // Figma: gray/neutral_04
    borderRadius: 999,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
  },
  // Dropdown 2: Meal type — Figma: flex-1, px:12 py:8, border #b0bcc8
  mealDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6efff',        // Figma: blue_01_meno
    borderWidth: 1,
    borderColor: '#b0bcc8',            // Figma: gray/neutral_04
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  // Meal dropdown label: icon + text — Figma: gap:4
  mealLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,                            // Figma: gap-[4px]
  },
  // Shared dropdown text style — Figma: subhead4, 14px Semibold
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#031aa1',                  // Figma: on_surface/primary
    lineHeight: 16.8,                  // Figma: leading-[1.2]
  },
  // Blue plus button — Figma: 40×40, bg #2e50ff, rounded-full
  addButtonBlue: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#2e50ff',        // Figma: bg-[#2e50ff]
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Row 3: Points badge + nutrition tags ──
  cardRow3: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,                            // Figma: gap-[4px]
  },
  // Points badge — Figma: 24×24, bg #031373, 16px Semibold white
  pointsBadge: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#031373',        // Figma: blue_09_clinic
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 19.2,                  // Figma: leading-[1.2]
  },
  // Nutrition tags group — Figma: GLP Nutrients, gap:8
  nutritionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,                            // Figma: gap-[8px]
  },
  // Protein tag — Figma: #f4effc bg, rounded-full, px:8 py:4, gap:4
  proteinTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f4effc',        // Figma: glp1_protein_light
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  // Veg tag — Figma: #ebf5f2 bg, same shape as protein tag
  vegTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ebf5f2',        // Figma: glp1_produce_light
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  // Nutrition tag text — Figma: 12px Medium #08070c, tracking -0.2, leading 18
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#08070c',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
});
