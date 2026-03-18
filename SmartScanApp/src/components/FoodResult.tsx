import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import FoodSearchContent, { IOSKeyboard } from './FoodSearch';

// Full "Lunch" result screen — matches Figma node 2302:7740.
// iOS-style sheet over dimmed overlay. All icons are exact Figma SVG paths.
// Used for both Auto and Food scan modes (Step 3 result).

type Props = {
  onClose: () => void; // called when X button or overlay is tapped
};

// Detected food items — each has name, serving, points, protein grams, veg grams
const foodItems = [
  { name: 'Chicken breast', serving: '1 serving(s)', points: 0, proteinG: 25, vegG: 0 },
  { name: 'Lime wedge(s)', serving: '1 serving(s)', points: 0, proteinG: 25, vegG: 0 },
  { name: 'Grilled shrimp', serving: '1 oz', points: 0, proteinG: 25, vegG: 0 },
];

// ════════════════════════════════════════════════════════
// Inline SVG icons — exact Figma paths
// ════════════════════════════════════════════════════════

// Swap icon (Figma: "Icon" inside "Icon Button", node 27516:13125)
function SwapIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 13.167 15.833" fill="none">
      <Path
        d="M8.88672 8.55268C9.17962 8.25994 9.65442 8.25984 9.94727 8.55268L12.9473 11.5527C13.0032 11.6087 13.0445 11.6734 13.0791 11.7402C13.0888 11.7588 13.1003 11.7764 13.1084 11.7958C13.1295 11.8468 13.1449 11.8994 13.1543 11.9531C13.1617 11.9953 13.167 12.0386 13.167 12.083C13.167 12.1279 13.1619 12.172 13.1543 12.2148C13.1449 12.2675 13.1291 12.319 13.1084 12.3691C13.0988 12.3923 13.086 12.4136 13.0742 12.4355C13.0403 12.4986 13.0005 12.56 12.9473 12.6132L9.94727 15.6132C9.65443 15.9061 9.17963 15.9059 8.88672 15.6132C8.59383 15.3203 8.59383 14.8456 8.88672 14.5527L10.6064 12.833H0.75C0.335895 12.833 0.000175875 12.497 0 12.083C0.000159282 11.6689 0.335885 11.333 0.75 11.333H10.6064L8.88672 9.61322C8.59383 9.32033 8.59383 8.84557 8.88672 8.55268ZM3.21973 0.21967C3.51262 -0.0732233 3.98738 -0.0732233 4.28027 0.21967C4.57284 0.51259 4.57306 0.987434 4.28027 1.28022L2.56055 2.99994H12.417C12.8309 3.00029 13.167 3.33595 13.167 3.74994C13.1668 4.16378 12.8308 4.49959 12.417 4.49994H2.56055L4.28027 6.21967C4.57284 6.51259 4.57306 6.98743 4.28027 7.28022C3.98749 7.57299 3.51264 7.57278 3.21973 7.28022L0.219727 4.28022C0.166661 4.22715 0.125634 4.1663 0.0917969 4.10346C0.0797988 4.08119 0.066382 4.05963 0.0566406 4.03608C0.0499744 4.01993 0.0465063 4.00275 0.0410156 3.98627C0.0161267 3.91169 3.86185e-05 3.83287 0 3.74994C0 3.66886 0.0152599 3.59164 0.0390625 3.5185C0.0445184 3.50168 0.0480125 3.48419 0.0546875 3.46772L0.0585938 3.45795C0.0661119 3.44018 0.0771192 3.42421 0.0859375 3.40717C0.120584 3.34007 0.163467 3.27593 0.219727 3.21967L3.21973 0.21967Z"
        fill="#031AA1"
      />
    </Svg>
  );
}

// Close X icon (Figma: "icon/close", node 27516:12453)
function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="-6.25 -6.25 24 24" fill="none">
      <Path
        d="M10.2197 0.21967C10.5126 -0.0732233 10.9873 -0.0732233 11.2802 0.21967C11.5731 0.512563 11.5731 0.987324 11.2802 1.28022L6.81049 5.74994L11.2802 10.2197C11.5731 10.5126 11.5731 10.9873 11.2802 11.2802C10.9873 11.5731 10.5126 11.5731 10.2197 11.2802L5.74994 6.81049L1.28022 11.2802C0.987324 11.5731 0.512563 11.5731 0.21967 11.2802C-0.0732233 10.9873 -0.0732233 10.5126 0.21967 10.2197L4.6894 5.74994L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L5.74994 4.6894L10.2197 0.21967Z"
        fill="#181877"
      />
    </Svg>
  );
}

// Chevron down — header version (Figma: "chevron_down", 24×24 container)
function ChevronDownHeader() {
  return (
    <Svg width={24} height={24} viewBox="-7.25 -9.25 24 24" fill="none">
      <Path
        d="M8.21967 0.21967C8.51256 -0.0732233 8.98732 -0.0732233 9.28022 0.21967C9.57311 0.512563 9.57311 0.987324 9.28022 1.28022L5.28022 5.28022C4.98732 5.57311 4.51256 5.57311 4.21967 5.28022L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L4.74994 3.6894L8.21967 0.21967Z"
        fill="#181877"
      />
    </Svg>
  );
}

// Chevron down — dropdown version (Figma: "icon_chevron", 24×24 container)
function ChevronDownDropdown() {
  return (
    <Svg width={24} height={24} viewBox="-7.25 -9.25 24 24" fill="none">
      <Path
        d="M8.21967 0.21967C8.51256 -0.0732233 8.98732 -0.0732233 9.28022 0.21967C9.57311 0.512563 9.57311 0.987324 9.28022 1.28022L5.28022 5.28022C4.98732 5.57311 4.51256 5.57311 4.21967 5.28022L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L4.74994 3.6894L8.21967 0.21967Z"
        fill="#031AA1"
      />
    </Svg>
  );
}

// Chicken leg icon (Figma: "chicken_leg", protein nutrient, 16×16)
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

// Apple icon (Figma: "apple", veg nutrient, 16×16)
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

// Delete / trash icon (Figma: "delete", 20×20 icon)
function DeleteIcon() {
  return (
    <Svg width={20} height={20} viewBox="-3.333 -2.5 20 20" fill="none">
      <Path
        d="M2.5 15C2.04167 15 1.64931 14.8368 1.32292 14.5104C0.996528 14.184 0.833333 13.7917 0.833333 13.3333V2.5H0V0.833333H4.16667V0H9.16667V0.833333H13.3333V2.5H12.5V13.3333C12.5 13.7917 12.3368 14.184 12.0104 14.5104C11.684 14.8368 11.2917 15 10.8333 15H2.5ZM10.8333 2.5H2.5V13.3333H10.8333V2.5ZM4.16667 11.6667H5.83333V4.16667H4.16667V11.6667ZM7.5 11.6667H9.16667V4.16667H7.5V11.6667Z"
        fill="#031AA1"
      />
    </Svg>
  );
}

// Plus icon (Figma: "add_plus", white on blue circle)
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

// ════════════════════════════════════════════════════════
// Reusable FoodCard component — Figma node 2302:7761
// 3-row layout: [name + swap] → [full-width dropdown] → [points + tags + delete]
// ════════════════════════════════════════════════════════
function FoodCard({ item, onSwap }: { item: typeof foodItems[0]; onSwap: () => void }) {
  return (
    <View style={styles.foodCard}>
      {/* Row 1: Food name (left) + swap icon button (right) — Figma: controls_top, gap:12 */}
      <View style={styles.cardRow1}>
        <Text style={styles.foodName} numberOfLines={1}>
          {item.name}
        </Text>
        <TouchableOpacity style={styles.iconButton} onPress={onSwap}>
          <SwapIcon />
        </TouchableOpacity>
      </View>

      {/* Row 2: Full-width serving dropdown — Figma: dropdown1, r:999, border #b0bcc8 */}
      <TouchableOpacity style={styles.servingDropdown}>
        <Text style={styles.servingText}>{item.serving}</Text>
        <ChevronDownDropdown />
      </TouchableOpacity>

      {/* Row 3: Points badge + nutrition tags (left) + delete icon (right) */}
      {/* Figma: controls_bottom, justify-between */}
      <View style={styles.cardRow3}>
        {/* Left: points badge + GLP nutrient tags */}
        <View style={styles.nutritionLeft}>
          {/* Points badge — Figma: 24×24, bg #031373, 16px semibold white */}
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{item.points}</Text>
          </View>

          {/* Nutrition tags — Figma: GLP Nutrients, gap:8 */}
          <View style={styles.nutritionGroup}>
            {/* Protein tag — Figma: #f4effc bg, chicken_leg icon + "25 g" */}
            <View style={styles.proteinTag}>
              <ChickenLegIcon />
              <Text style={styles.tagGrams}>{item.proteinG} g</Text>
            </View>
            {/* Veg tag — Figma: #ebf5f2 bg, apple icon + "0 g" */}
            <View style={styles.vegTag}>
              <AppleIcon />
              <Text style={styles.tagGrams}>{item.vegG} g</Text>
            </View>
          </View>
        </View>

        {/* Right: delete icon button */}
        <TouchableOpacity style={styles.iconButton}>
          <DeleteIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// Main FoodResult screen — iOS sheet overlay
// ════════════════════════════════════════════════════════

export default function FoodResult({ onClose }: Props) {
  // iOS sheet slide-up animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  // iOS push transition: 0 = food list visible, 1 = search visible
  const pushAnim = useRef(new Animated.Value(0)).current;
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, []);

  // Open "Search to replace" — iOS push from right
  const openSearch = () => {
    setShowSearch(true);
    Animated.spring(pushAnim, {
      toValue: 1,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  };

  // Close search — reverse push (slide back to food list)
  const closeSearch = () => {
    Animated.spring(pushAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => setShowSearch(false));
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [800, 0],
  });

  // iOS push transition: food page slides left, search page slides in from right
  const foodPageX = pushAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -393],
  });
  const searchPageX = pushAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [393, 0],
  });

  // Sheet bottom adjusts up when keyboard is visible
  const sheetBottom = pushAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 290],
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

  // Swipe-down gesture on the drag handle — tracks finger, snaps dismiss or bounce back
  // dragY tracks the finger's vertical offset while dragging
  const dragY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5, // only respond to downward drags
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging downward (positive dy)
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Dragged far enough or fast enough → dismiss
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

  // Combine slide-up animation + drag offset for the sheet's translateY
  const combinedTranslateY = Animated.add(translateY, dragY);

  return (
    <View style={styles.container}>
      {/* Dark overlay — tap to dismiss */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={dismissSheet}
        style={styles.overlayTouchable}
      >
        <Animated.View style={[styles.overlay, { opacity: slideAnim }]} />
      </TouchableOpacity>

      {/* White iOS sheet — slides up from bottom, draggable down to dismiss */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: combinedTranslateY }], bottom: sheetBottom }]}>
        {/* Toolbar with drag handle — swipe down to dismiss */}
        <View style={styles.toolbar} {...panResponder.panHandlers}>
          <View style={styles.handle} />
        </View>

        {/* Page container — clips the two animated pages */}
        <View style={styles.pageContainer}>
          {/* ═══ Page 1: Food list (slides left when search opens) ═══ */}
          <Animated.View style={[styles.page, { transform: [{ translateX: foodPageX }] }]}>
            {/* Header + subtitle + instructions */}
            <View style={styles.headerSection}>
              <View style={styles.headerRow}>
                <View style={styles.headerLeftSpacer} />
                <View style={styles.headerCenter}>
                  <Text style={styles.headerTitle}>Lunch</Text>
                  <ChevronDownHeader />
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <CloseIcon />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Today, Nov 29</Text>
              <Text style={styles.instructions}>
                {`Check your ingredients and serving sizes to make sure everything's correct. Tap a food item to make changes, or tap the checkmark to remove an item.`}
              </Text>
            </View>

            {/* Scrollable food cards */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionLabel}>your photo</Text>
              <View style={styles.cardsContainer}>
                {foodItems.map((item) => (
                  <FoodCard key={item.name} item={item} onSwap={openSearch} />
                ))}
                <TouchableOpacity style={styles.addFoodCard}>
                  <View style={styles.addFoodTextArea}>
                    <Text style={styles.addFoodTitle}>Add new food</Text>
                    <Text style={styles.addFoodSubtitle}>Missing an item from your plate?</Text>
                  </View>
                  <View style={styles.addFoodCircle}>
                    <PlusIcon />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Track button */}
            <View style={styles.bottomArea}>
              <TouchableOpacity style={styles.trackButton} activeOpacity={0.8}>
                <Text style={styles.trackButtonText}>Track</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* ═══ Page 2: Search to replace (slides in from right) ═══ */}
          {showSearch && (
            <Animated.View style={[styles.page, { transform: [{ translateX: searchPageX }] }]}>
              <FoodSearchContent onClose={closeSearch} />
            </Animated.View>
          )}
        </View>
      </Animated.View>

      {/* iOS keyboard — rendered below the sheet when search is active */}
      {showSearch && (
        <Animated.View style={[styles.keyboardContainer, { opacity: pushAnim }]}>
          <IOSKeyboard />
        </Animated.View>
      )}
    </View>
  );
}

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

  // ── Overlay touchable — fills screen to catch taps for dismiss ──
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // ── iOS sheet overlay — Figma: rgba(0,0,0,0.45), rounded-[32px] ──
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 32,
  },

  // ── White iOS sheet — Figma: top-54, rounded-tl/tr-38, white bg, shadow ──
  sheet: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    // bottom is set dynamically via sheetBottom animation (-8 default, 290 when keyboard visible)
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: 'hidden',
    // Figma shadow: 0px 15px 75px rgba(0,0,0,0.18)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.18,
    shadowRadius: 75,
    elevation: 24,
  },

  // ── Page container — clips animated pages inside the sheet ──
  pageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  // ── Each page fills the container absolutely ──
  page: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ── iOS keyboard — positioned at bottom of phone frame ──
  keyboardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -8,
  },

  // ── Toolbar / drag handle area — Figma: h-26, pb-10 ──
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

  // ── Header section — Figma: w-342, centered, gap-16 ──
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 25.5,       // (393 - 342) / 2 = 25.5
  },

  // ── Header row — Figma: gap-8, h-32, flex row ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    gap: 8,
    width: '100%',
  },
  headerLeftSpacer: {
    width: 35,                     // Figma: w-[35px]
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,               // Figma: pl-[16px]
  },
  // ── "Lunch" — Figma: 24px Bold #181877, leading-32 ──
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181877',
    lineHeight: 32,
  },
  // ── Close button — Figma: 32×32, p-6, rounded-full ──
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Subtitle — Figma: 12px Regular #08070c, leading-16, centered ──
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#08070c',
    lineHeight: 16,
    textAlign: 'center',
  },

  // ── Instructions — Figma: 14px Regular #031373, leading-1.2, centered ──
  instructions: {
    fontSize: 14,
    fontWeight: '400',
    color: '#031373',
    lineHeight: 16.8,              // 14 * 1.2
    textAlign: 'center',
    marginTop: 16,
    width: '100%',
  },

  // ── Scroll area ──
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25.5,
    paddingTop: 32,                // Figma: gap-[32px] between header and cards
    paddingBottom: 16,
  },

  // ── Section label — Figma: 12px Medium #525163, uppercase, tracking-0.24 ──
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#525163',
    letterSpacing: 0.24,
    textTransform: 'uppercase',
    lineHeight: 16,
    marginBottom: 8,
  },

  // ── Cards container — Figma: gap-12 ──
  cardsContainer: {
    gap: 12,
  },

  // ════════════════════════════════════════════════
  // Food Card — Figma node 2302:7761
  // ════════════════════════════════════════════════
  foodCard: {
    backgroundColor: '#e6efff',    // Figma: blue_01_meno
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },

  // ── Row 1: name + swap icon — Figma: controls_top, gap-12 ──
  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#031aa1',
    lineHeight: 19.2,
  },
  // ── Icon button — Figma: p-6, rounded-full (used for swap + delete) ──
  iconButton: {
    padding: 6,
    borderRadius: 999,
  },

  // ── Row 2: serving dropdown — Figma: flex-1, border #b0bcc8, r:999 ──
  servingDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6efff',
    borderWidth: 1,
    borderColor: '#b0bcc8',
    borderRadius: 999,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
  },
  servingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#031aa1',
    lineHeight: 16.8,
  },

  // ── Row 3: points + tags + delete — Figma: controls_bottom, justify-between ──
  cardRow3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nutritionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  // ── Points badge — Figma: 24×24, bg #031373, 16px Semibold white ──
  pointsBadge: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#031373',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 19.2,
  },

  // ── Nutrition tags — Figma: GLP Nutrients, gap-8 ──
  nutritionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proteinTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f4effc',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vegTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ebf5f2',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagGrams: {
    fontSize: 12,
    fontWeight: '500',
    color: '#08070c',
    lineHeight: 18,
    letterSpacing: -0.2,
  },

  // ════════════════════════════════════════════════
  // "Add new food" card — Figma node 2302:7765
  // ════════════════════════════════════════════════
  addFoodCard: {
    backgroundColor: '#e6efff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    // Figma shadow: Elevation/Raised
    shadowColor: '#070517',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  addFoodTextArea: {
    flex: 1,
    gap: 2,
  },
  addFoodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#031aa1',
    lineHeight: 19.2,
  },
  addFoodSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#031aa1',
    lineHeight: 16.8,
  },
  // ── Blue circle — Figma: 40×40, bg #2e50ff, p:6, rounded-full ──
  addFoodCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#2e50ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom area — Figma: pt-40 pb-37 px-24 ──
  bottomArea: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 37,
  },
  // ── Track button — Figma: #0222d0, h:56, r:999, gap:6, px:24 py:12 ──
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
