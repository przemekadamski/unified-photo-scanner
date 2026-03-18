import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Pressable,
  PanResponder,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';

// ════════════════════════════════════════════════════════
// ManualSearch — Full-screen sheet overlay for manual barcode entry.
//
// Opens when user taps "Search manually" during the barcode
// "Scanning..." state. Matches Figma node 2345:14480.
//
// Layout (top to bottom):
//   - Scrim (rgba(0,0,0,0.45))
//   - White sheet (808px tall, borderRadius 38 top)
//     - Drag handle
//     - Header: search icon | "Manual search" | close X
//     - Search bar: pill shape, "Enter barcode number"
//     - Content area (empty, results, or no-results)
//   - Numeric keypad (291px, anchored to bottom)
// ════════════════════════════════════════════════════════

type Props = {
  visible: boolean;
  onClose: () => void;
  onProductTap: () => void; // opens full BarcodeResult
};

// ════════════════════════════════════════════════════════
// Inline SVG icons
// ════════════════════════════════════════════════════════

// Search magnifying glass — inside search bar (Figma: 24×24)
function SearchIcon() {
  return (
    <Svg width={24} height={24} viewBox="-3.25 -3.25 24 24" fill="none">
      <Path
        d="M7.81152 0C12.1258 0 15.6238 3.4973 15.624 7.81152C15.624 9.69866 14.9539 11.4289 13.8398 12.7793L17.2871 16.2256C17.58 16.5185 17.58 16.9942 17.2871 17.2871C16.9942 17.58 16.5185 17.58 16.2256 17.2871L12.7793 13.8398C11.4289 14.9539 9.69866 15.624 7.81152 15.624C3.4973 15.6238 0 12.1258 0 7.81152C0.000225735 3.49744 3.49744 0.000225731 7.81152 0ZM7.81152 1.5C4.32587 1.50023 1.50023 4.32587 1.5 7.81152C1.5 11.2974 4.32573 14.1238 7.81152 14.124C11.2975 14.124 14.124 11.2975 14.124 7.81152C14.1238 4.32573 11.2974 1.5 7.81152 1.5Z"
        fill="#5a577d"
      />
    </Svg>
  );
}

// Close X icon (Figma: 24×24, same as FoodResult/BarcodeResult)
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

// Backspace icon — iOS SF Symbol "delete.backward" style
// Figma: ~24×18px, outlined backspace shape with × inside
function BackspaceIcon() {
  return (
    <Svg width={24} height={18} viewBox="0 0 24 18" fill="none">
      {/* Outer shape — rounded rect with pointed left (backspace shape) */}
      <Path
        d="M8.12 1C7.68 1 7.27 1.2 7 1.54L2.41 7.54C1.86 8.26 1.86 9.74 2.41 10.46L7 16.46C7.27 16.8 7.68 17 8.12 17H20.5C21.33 17 22 16.33 22 15.5V2.5C22 1.67 21.33 1 20.5 1H8.12Z"
        stroke="black"
        strokeWidth={1.6}
        fill="none"
      />
      {/* × mark inside */}
      <Path
        d="M11 6L17 12M17 6L11 12"
        stroke="black"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Symbols icon (+✱#) for numeric keypad bottom-left
// Figma: no background, ~48×12px text element, centered in the key area
function SymbolsIcon() {
  return (
    <Text style={{ fontSize: 17, fontWeight: '600', color: 'black', letterSpacing: 1 }}>+✱#</Text>
  );
}

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

// Breakfast / takeout cup icon (Figma: "breakfast", 24×24)
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

// Plus icon — white on blue circle (Figma: "add_plus", 20×20)
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

// Chicken leg icon — protein tag (16×16)
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

// Apple icon — veg tag (16×16)
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
// NumericKeypad — iOS-style number pad for barcode entry
// Figma: "Keyboard - iPhone" node 2345:14501
// 4 rows: [1 2 3] [4 5 6] [7 8 9] [+*# 0 ⌫]
// ════════════════════════════════════════════════════════

// Sub-labels for number keys (ABC, DEF, etc.)
const KEY_SUBLABELS: Record<string, string> = {
  '2': 'ABC', '3': 'DEF', '4': 'GHI', '5': 'JKL',
  '6': 'MNO', '7': 'PQRS', '8': 'TUV', '9': 'WXYZ',
};

function NumericKeypad({ onKeyPress }: { onKeyPress: (key: string) => void }) {
  const rows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['symbols', '0', 'backspace'],
  ];

  return (
    <View style={kbStyles.keyboard}>
      <View style={kbStyles.keysContainer}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={kbStyles.keyRow}>
            {row.map((key) => {
              // Bottom-row special keys — NO background (transparent on gray tray)
              // Figma: symbols and backspace float without a key shape behind them
              if (key === 'symbols') {
                return (
                  <Pressable key={key} style={kbStyles.keyTransparent} onPress={() => {}}>
                    <SymbolsIcon />
                  </Pressable>
                );
              }
              if (key === 'backspace') {
                return (
                  <Pressable key={key} style={kbStyles.keyTransparent} onPress={() => onKeyPress('backspace')}>
                    <BackspaceIcon />
                  </Pressable>
                );
              }
              // Number key — white rounded rectangle with shadow
              const sublabel = KEY_SUBLABELS[key];
              return (
                <Pressable key={key} style={kbStyles.keyWhite} onPress={() => onKeyPress(key)}>
                  <Text style={kbStyles.keyNumber}>{key}</Text>
                  {sublabel && <Text style={kbStyles.keySublabel}>{sublabel}</Text>}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {/* Home indicator at the bottom */}
      <View style={kbStyles.homeIndicatorWrap}>
        <View style={kbStyles.homeIndicator} />
      </View>
    </View>
  );
}

// ── iOS numeric keypad styles ──
// Figma node 2345:14501 (Keyboard - iPhone)
// Structure: keys frame (h=291px, p=6, gap=8) + home indicator (h=26px, bottom)
// Keys use ~220px, leaving ~71px gap before home indicator area
const kbStyles = StyleSheet.create({
  keyboard: {
    // Figma: layered glass effect (luminosity + color-dodge blend).
    // Can't replicate blend modes in RN, so use a solid approximation.
    backgroundColor: '#d0d2d8',
    borderBottomLeftRadius: 44,            // Figma: rounded-bl/br-[44px]
    borderBottomRightRadius: 44,
    overflow: 'hidden',
    // Total height: 291px (keys frame) + 26px (home indicator) = 317px
    height: 317,
  },
  keysContainer: {
    padding: 6,                            // Figma: p-[6px]
    gap: 8,                                // Figma: gap-[8px]
  },
  keyRow: {
    flexDirection: 'row',
    gap: 6,                                // Figma: gap-[6px]
  },
  // White number keys — Figma: bg-white, rounded-[4.6px], 1px bottom shadow
  keyWhite: {
    flex: 1,
    height: 46,                            // Figma: h-[46px]
    backgroundColor: '#ffffff',
    borderRadius: 5,                       // Figma: rounded-[4.6px]
    alignItems: 'center',
    justifyContent: 'center',
    // Figma: shadow-[0px_1px_0px_0px_rgba(0,0,0,0.35)]
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 1,
  },
  // Transparent special keys (symbols, backspace) — Figma: NO key background
  keyTransparent: {
    flex: 1,
    height: 46,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Number text — Figma: SF Pro Regular, 25px, black
  keyNumber: {
    fontSize: 25,
    fontWeight: '400',
    color: 'black',
  },
  // Sublabels (ABC, DEF, etc.) — Figma: SF Pro Bold, 10px, tracking 2px
  keySublabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'black',
    letterSpacing: 2,                      // Figma: tracking-[2px]
  },
  // Home indicator — Figma: h-[26px] container, indicator at bottom-[8px]
  // Positioned at the bottom of the 317px keyboard using flex spacer
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 26,                            // Figma: h-[26px]
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,                      // Figma: bottom-[8px]
  },
  homeIndicator: {
    width: 144,                            // Figma: w-[144px]
    height: 5,                             // Figma: h-[5px]
    borderRadius: 100,                     // Figma: rounded-[100px]
    backgroundColor: 'black',              // Figma: labels/primary
  },
});

// ════════════════════════════════════════════════════════
// ManualSearch component — full-screen sheet overlay
// ════════════════════════════════════════════════════════

export default function ManualSearch({ visible, onClose, onProductTap }: Props) {
  // Simulated barcode number input
  const [query, setQuery] = useState('');
  // Blinking cursor animation (opacity toggles 0↔1)
  const cursorAnim = useRef(new Animated.Value(1)).current;
  // Search state: 'empty' | 'searching' | 'found' | 'no-results'
  const [searchState, setSearchState] = useState<'empty' | 'searching' | 'found' | 'no-results'>('empty');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Spring slide-up animation: 0 = off-screen, 1 = fully visible
  const slideAnim = useRef(new Animated.Value(0)).current;
  // Swipe-down drag offset
  const dragY = useRef(new Animated.Value(0)).current;

  // Animate in/out
  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 65,
        friction: 11,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  // Blinking cursor loop — runs while sheet is visible
  useEffect(() => {
    if (visible) {
      const blink = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
          Animated.timing(cursorAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
        ])
      );
      blink.start();
      return () => blink.stop();
    } else {
      cursorAnim.setValue(1);
    }
  }, [visible]);

  // Reset state when closed
  useEffect(() => {
    if (!visible) {
      setQuery('');
      setSearchState('empty');
      if (searchTimer.current) clearTimeout(searchTimer.current);
    }
  }, [visible]);

  // Dismiss with slide-down animation, then call onClose
  const dismissSheet = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => onClose());
  };

  // PanResponder for swipe-down dismiss on the drag handle
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
          Animated.timing(dragY, {
            toValue: 600,
            duration: 250,
            useNativeDriver: false,
          }).start(() => onClose());
        } else {
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

  // Combined translateY: slide animation + drag offset
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [852, 0], // 852 = phone frame height
  });
  const combinedTranslateY = Animated.add(translateY, dragY);

  // Scrim opacity
  const scrimOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Handle numeric keypad presses
  const handleKeyPress = (key: string) => {
    let newQuery = query;
    if (key === 'backspace') {
      newQuery = query.slice(0, -1);
    } else {
      newQuery = query + key;
    }
    setQuery(newQuery);

    // Clear any pending search timer
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (newQuery.length === 0) {
      setSearchState('empty');
      return;
    }

    setSearchState('searching');
    searchTimer.current = setTimeout(() => {
      // Simulate search results based on input:
      // - 3+ digits of "0" (e.g. "000") → no results (empty state)
      // - 3+ digits of "1" (e.g. "111") → found (product card)
      // - Less than 3 digits → keep searching (waiting for more input)
      if (newQuery.length < 3) {
        setSearchState('searching');
      } else if (/^0+$/.test(newQuery)) {
        setSearchState('no-results');
      } else {
        setSearchState('found');
      }
    }, 400);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Dark scrim — tap to dismiss */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={dismissSheet}
        style={styles.scrimTouchable}
      >
        <Animated.View style={[styles.scrim, { opacity: scrimOpacity }]} />
      </TouchableOpacity>

      {/* White sheet — slides up from bottom, 808px tall */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: combinedTranslateY }] },
        ]}
      >
        {/* Drag handle area — swipe down to dismiss */}
        <View {...panResponder.panHandlers} style={styles.dragHandleArea}>
          <View style={styles.dragHandle} />
        </View>

        {/* Header: spacer (left) | "Manual search" (center) | close X (right) */}
        <View style={styles.header}>
          {/* Empty spacer — same size as close button for centering title */}
          <View style={styles.headerSpacer} />
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Manual search</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={dismissSheet} activeOpacity={0.7}>
            <CloseIcon />
          </TouchableOpacity>
        </View>

        {/* Search bar — pill shape with magnifying glass + typed text */}
        <View style={styles.searchBarWrap}>
          <View style={styles.searchBar}>
            <View style={styles.searchBarIcon}>
              <SearchIcon />
            </View>
            <View style={styles.searchTextWrap}>
              {query.length > 0 ? (
                <View style={styles.searchTextRow}>
                  <Text style={styles.searchTypedText}>{query}</Text>
                  <Animated.View style={[styles.cursorLine, { opacity: cursorAnim }]} />
                </View>
              ) : (
                <View style={styles.searchTextRow}>
                  <Animated.View style={[styles.cursorLine, { opacity: cursorAnim }]} />
                  <Text style={styles.searchPlaceholder}>Enter barcode number</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Content area — fills space between search bar and keyboard */}
        <View style={styles.contentArea}>
          {/* Searching state */}
          {searchState === 'searching' && (
            <View style={styles.searchingWrap}>
              <Text style={styles.searchingText}>Searching...</Text>
            </View>
          )}

          {/* Found state — product card */}
          {searchState === 'found' && (
            <View style={styles.resultSection}>
              <Text style={styles.resultsLabel}>RESULT</Text>
              <Pressable style={styles.productCard} onPress={onProductTap}>
                {/* Row 1: Product name */}
                <View style={styles.cardRow1}>
                  <Text style={styles.productName} numberOfLines={2}>Chicken breast</Text>
                </View>
                {/* Row 2: Dropdowns + plus button */}
                <View style={styles.dropdownsRow}>
                  <View style={styles.servingDropdown}>
                    <Text style={styles.dropdownText}>3 oz</Text>
                    <ChevronDownIcon />
                  </View>
                  <View style={styles.mealDropdown}>
                    <View style={styles.mealLabel}>
                      <BreakfastIcon />
                      <Text style={styles.dropdownText}>Breakfast</Text>
                    </View>
                    <ChevronDownIcon />
                  </View>
                  <View style={styles.addButtonBlue}>
                    <PlusIcon />
                  </View>
                </View>
                {/* Row 3: Points + nutrition tags */}
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
            </View>
          )}

          {/* No results state — Figma node 2345:14502 */}
          {searchState === 'no-results' && (
            <View style={styles.noResultsWrap}>
              {/* Barcode card illustration */}
              <View style={styles.illustrationWrap}>
                {/* Blue background card */}
                <View style={styles.illustrationBlueBg} />
                {/* White card with placeholder lines */}
                <View style={styles.illustrationCard}>
                  <View style={styles.illustrationLine1} />
                  <View style={styles.illustrationLine2} />
                </View>
                {/* Blue circle with barcode icon */}
                <View style={styles.illustrationCircle}>
                  <Svg width={20} height={20} viewBox="0 0 16 16" fill="none">
                    <Path
                      d="M1 2.5V5H2V3H4.5V2H1.5C1.224 2 1 2.224 1 2.5ZM14.5 2H11.5V3H14V5H15V2.5C15 2.224 14.776 2 14.5 2ZM2 11V13H4.5V14H1.5C1.224 14 1 13.776 1 13.5V11H2ZM14 11V13H11.5V14H14.5C14.776 14 15 13.776 15 13.5V11H14ZM4 5H5V11H4V5ZM6 5H7V11H6V5ZM8.5 5H9.5V11H8.5V5ZM11 5H12V11H11V5Z"
                      fill="#031AA1"
                    />
                  </Svg>
                </View>
              </View>

              {/* Text block */}
              <View style={styles.noResultsTextBlock}>
                <Text style={styles.noResultsTitle}>No results for &ldquo;{query}&rdquo;</Text>
                <Text style={styles.noResultsSubtitle}>Try a different code</Text>
              </View>
            </View>
          )}
        </View>

        {/* Numeric keypad — anchored to bottom of sheet */}
        <NumericKeypad onKeyPress={handleKeyPress} />
      </Animated.View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // Full-screen container
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  // Scrim overlay
  scrimTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  // ── Sheet — Figma: 808px tall, white, rounded top 38 ──
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 808,           // Figma: h-[808px]
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 38,   // Figma: rounded-tl/tr-[38px]
    borderTopRightRadius: 38,
    // Figma: shadow 0 15 75 rgba(0,0,0,0.18)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.18,
    shadowRadius: 75,
    elevation: 24,
  },

  // Drag handle
  dragHandleArea: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CECECE',
  },

  // ── Header — Figma: search icon | title | close X ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 32,
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',       // Figma: Bold
    color: '#181877',        // Figma: #181877
    textAlign: 'center',
    lineHeight: 32,
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Search bar — Figma: .searchBase, pill, border #d1d1e4 ──
  searchBarWrap: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,       // Figma: pb-[24px] on content wrapper
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d1e4',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,       // Figma: py-[11px] — content-driven height
    gap: 8,
  },
  searchBarIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchTextWrap: {
    flex: 1,
  },
  searchTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursorLine: {
    width: 1,
    height: 20,
    backgroundColor: '#181386',
    borderRadius: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#5a577d',
    letterSpacing: -0.31,
    lineHeight: 24,
  },
  searchTypedText: {
    fontSize: 16,
    color: '#08070c',
    letterSpacing: -0.31,
    lineHeight: 24,
  },

  // ── Content area — fills space between search bar and keyboard ──
  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Searching state
  searchingWrap: {
    alignItems: 'center',
    paddingTop: 32,
  },
  searchingText: {
    fontSize: 14,
    color: '#5A577D',
    letterSpacing: -0.31,
  },

  // Result section
  resultSection: {
    gap: 8,
  },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8b8d9e',
    letterSpacing: 1,
  },

  // ── Product card — same card_food as SearchSheet ──
  productCard: {
    width: '100%',
    backgroundColor: '#e6efff',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    shadowColor: '#070517',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#031aa1',
    lineHeight: 19.2,
  },
  dropdownsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  servingDropdown: {
    flex: 1,
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
  mealDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6efff',
    borderWidth: 1,
    borderColor: '#b0bcc8',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mealLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#031aa1',
    lineHeight: 16.8,
  },
  addButtonBlue: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#2e50ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRow3: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
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
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#08070c',
    lineHeight: 18,
    letterSpacing: -0.2,
  },

  // ── No results state — Figma node 2345:14502 ──
  // Vertically centered in content area between search bar and keyboard
  noResultsWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,                               // Figma: gap between illustration and text
  },

  // Barcode card illustration — ~243×77px
  illustrationWrap: {
    width: 243,
    height: 77,
    position: 'relative',
  },
  // Blue rounded rectangle background
  illustrationBlueBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 181,
    height: 77,
    backgroundColor: '#c5d4ff',
    borderRadius: 12,
  },
  // White card with placeholder lines
  illustrationCard: {
    position: 'absolute',
    top: 14,
    left: 0,
    width: 187,
    height: 45,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingLeft: 54,
    paddingTop: 10,
    gap: 9,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  // Placeholder line 1 (shorter)
  illustrationLine1: {
    width: 41,
    height: 8,
    backgroundColor: '#c5d4ff',
    borderRadius: 4,
  },
  // Placeholder line 2 (longer)
  illustrationLine2: {
    width: 65,
    height: 8,
    backgroundColor: '#c5d4ff',
    borderRadius: 4,
  },
  // Blue circle with barcode icon — overlaps card on the left
  illustrationCircle: {
    position: 'absolute',
    top: 21,
    left: 22,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6efff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text block below illustration
  noResultsTextBlock: {
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',                     // Figma: Bold
    color: '#363542',
    textAlign: 'center',
    lineHeight: 19.2,                      // 1.2 × 16
  },
  noResultsSubtitle: {
    fontSize: 16,
    fontWeight: '400',                     // Figma: Regular
    color: '#72717e',
    textAlign: 'center',
    lineHeight: 22.4,                      // 1.4 × 16
  },
});
