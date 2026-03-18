import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';

// Mode Picker — glass-morphism grid overlay matching Figma node 2297:3733.
// Row 1: Barcode, Food, Auto (equal width, flex: 1)
// Row 2: Recipe, Menu (fixed 90px width)
// Structure: each item is a column — icon box (72px) + 4px gap + label (below the box).

type ScanMode = 'Barcode' | 'Food' | 'Auto' | 'Recipe' | 'Menu';

type Props = {
  visible: boolean;
  activeMode: ScanMode;
  onSelectMode: (mode: ScanMode) => void;
  onClose: () => void;
};

// Icon asset URLs extracted from Figma node 2297:3733
const MODE_ICON_URLS: Record<ScanMode, string> = {
  Barcode: 'https://www.figma.com/api/mcp/asset/6b0deeb3-21b0-4caa-9d1a-05bb042a5140',
  Food: 'https://www.figma.com/api/mcp/asset/ac6fdc9e-1e73-4768-b3d3-54d0ed340f71',
  Auto: 'https://www.figma.com/api/mcp/asset/6da3bbcc-1005-4ed7-9ec7-a336987c83af',
  Recipe: 'https://www.figma.com/api/mcp/asset/b34fc8db-4603-4be9-a5b2-b6dbe5012e31',
  Menu: 'https://www.figma.com/api/mcp/asset/3833ac23-1bc1-4786-b97a-86d50cbe0b4d',
};

const ROW_1: ScanMode[] = ['Barcode', 'Food', 'Auto'];
const ROW_2: ScanMode[] = ['Recipe', 'Menu'];

export default function ModePicker({ visible, activeMode, onSelectMode, onClose }: Props) {
  // iOS popover-style scale+fade animation
  const entryAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(entryAnim, {
        toValue: 1,
        tension: 300,
        friction: 20,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.spring(entryAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: false,
      }).start(() => {
        setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted && !visible) return null;

  // Slide down 300px when closing (picker is ~220px tall, positioned at bottom)
  const pickerTranslateY = entryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  // Renders one mode item: icon box on top, label below
  const renderItem = (mode: ScanMode, isFixedWidth: boolean) => {
    const isActive = mode === activeMode;
    return (
      <TouchableOpacity
        key={mode}
        // Outer column: icon box + label stacked vertically
        style={[
          styles.itemColumn,
          isFixedWidth ? styles.itemColumnFixed : styles.itemColumnFlex,
        ]}
        onPress={() => onSelectMode(mode)}
        activeOpacity={0.7}
      >
        {/* Icon box — 72px tall, dark translucent bg */}
        <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
          <Image
            source={{ uri: MODE_ICON_URLS[mode] }}
            style={styles.modeIcon}
          />
        </View>
        {/* Label sits below the icon box */}
        <Text style={[styles.modeLabel, isActive && styles.modeLabelActive]}>
          {mode}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    // Full-screen touch target to dismiss when tapping outside
    <TouchableOpacity
      style={styles.backdrop}
      activeOpacity={1}
      onPress={onClose}
    >
      {/* Glass container — animated scale+fade for iOS popover feel */}
      <Animated.View
        style={[
          styles.glassContainer,
          { opacity: entryAnim, transform: [{ translateY: pickerTranslateY }] },
        ]}
        onStartShouldSetResponder={() => true}
      >
        {/* Row 1: Barcode, Food, Auto — flex items */}
        <View style={styles.row}>
          {ROW_1.map((mode) => renderItem(mode, false))}
        </View>

        {/* Row 2: Recipe, Menu — fixed 90px width */}
        <View style={styles.row}>
          {ROW_2.map((mode) => renderItem(mode, true))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    paddingBottom: 28,
  },

  // Glass container — 351px wide, 34px border radius
  // Figma: 24px horizontal padding, 31px vertical padding, 16px row gap
  glassContainer: {
    alignSelf: 'center',
    width: 351,
    borderRadius: 34,
    paddingHorizontal: 24,
    paddingVertical: 31,
    gap: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(80, 80, 80, 0.55)',
    // Backdrop blur for glass effect (web only)
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
        } as any
      : {}),
  },

  row: {
    flexDirection: 'row',
    gap: 16,
  },

  // Each item is a vertical column: icon box + label
  itemColumn: {
    gap: 4,
    alignItems: 'center',
  },
  // Row 1 items stretch to fill (flex: 1)
  itemColumnFlex: {
    flex: 1,
  },
  // Row 2 items are fixed 90px wide
  itemColumnFixed: {
    width: 90,
  },

  // Icon box — 72px tall, dark translucent, rounded
  // Figma: h-[72px], bg-[rgba(0,0,0,0.3)], rounded-[16px], p-[8px]
  iconBox: {
    width: '100%',
    height: 72,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    // Glass effect — frosted blur + subtle border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
  },

  // Active icon box gets a brighter background
  iconBoxActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Icon image — 28x28 container, rendered smaller to match Figma
  // Figma icons have insets (~10-14%) inside the 28px frame
  modeIcon: {
    width: 22,
    height: 22,
    tintColor: '#ffffff',
  },

  // Label below icon box
  // Figma: 14px, Geist Medium (500), white, tracking -0.2px, line-height 18px
  modeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 18,
  },

  // Active label gets yellow text
  modeLabelActive: {
    color: '#FFE845',
  },
});
