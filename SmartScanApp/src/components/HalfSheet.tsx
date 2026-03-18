import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';

// ════════════════════════════════════════════════════════
// HalfSheet — Reusable iOS-style half-sheet overlay.
//
// Slides up from the bottom with a spring animation.
// Dismiss via: X button, tap scrim, or swipe down.
// Follows the same patterns as FoodResult.tsx / BarcodeResult.tsx.
// ════════════════════════════════════════════════════════

type Props = {
  visible: boolean;       // Controls whether the sheet is shown
  title: string;          // Header title text (centered)
  onClose: () => void;    // Called when dismissed (X, scrim tap, or swipe)
  children: React.ReactNode; // Sheet content below the header
};

// Close X icon — same SVG path used in FoodResult & BarcodeResult
function CloseIcon() {
  return (
    <Svg width={20} height={20} viewBox="-6.25 -6.25 24 24" fill="none">
      <Path
        d="M10.2197 0.21967C10.5126 -0.0732233 10.9873 -0.0732233 11.2802 0.21967C11.5731 0.512563 11.5731 0.987324 11.2802 1.28022L6.81049 5.74994L11.2802 10.2197C11.5731 10.5126 11.5731 10.9873 11.2802 11.2802C10.9873 11.5731 10.5126 11.5731 10.2197 11.2802L5.74994 6.81049L1.28022 11.2802C0.987324 11.5731 0.512563 11.5731 0.21967 11.2802C-0.0732233 10.9873 -0.0732233 10.5126 0.21967 10.2197L4.6894 5.74994L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L5.74994 4.6894L10.2197 0.21967Z"
        fill="#0e111d"
      />
    </Svg>
  );
}

export default function HalfSheet({ visible, title, onClose, children }: Props) {
  // Spring slide-up animation: 0 = off-screen, 1 = fully visible
  const slideAnim = useRef(new Animated.Value(0)).current;
  // Tracks finger drag offset for swipe-down dismiss
  const dragY = useRef(new Animated.Value(0)).current;

  // Animate in/out when visibility changes
  useEffect(() => {
    if (visible) {
      dragY.setValue(0);
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 65,       // iOS-style spring (same as FoodResult)
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

  // Dismiss with slide-down animation, then call onClose
  const dismissSheet = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => onClose());
  };

  // PanResponder for swipe-down dismiss on the drag handle area
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5, // only downward drags
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
            toValue: 600,
            duration: 250,
            useNativeDriver: false,
          }).start(() => onClose());
        } else {
          // Snap back to original position
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

  // Sheet translateY: combines slide-up animation + drag offset
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0], // 600 = enough to hide off-screen
  });
  const combinedTranslateY = Animated.add(translateY, dragY);

  // Scrim opacity follows slide animation
  const scrimOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Dark scrim overlay — tap to dismiss */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={dismissSheet}
        style={styles.scrimTouchable}
      >
        <Animated.View style={[styles.scrim, { opacity: scrimOpacity }]} />
      </TouchableOpacity>

      {/* White sheet — slides up from bottom */}
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

        {/* Header: title (centered) + X close button (right) */}
        <View style={styles.header}>
          {/* Spacer left (same width as close button for centering) */}
          <View style={styles.headerSpacer} />

          {/* Title — centered */}
          <Text style={styles.headerTitle}>{title}</Text>

          {/* Close X button — right side */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={dismissSheet}
            activeOpacity={0.7}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>

        {/* Content area — provided by parent */}
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen container — sits on top of everything
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  // Dark overlay behind the sheet
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
  // White sheet — anchored to bottom
  // Figma: flex-col, gap:16, rounded-tl/tr:32, pb:37
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,     // Figma: rounded-tl-[32px]
    borderTopRightRadius: 32,    // Figma: rounded-tr-[32px]
    paddingBottom: 37,           // Space for home indicator
    gap: 16,                     // Figma: gap-[16px] between header and content
    // Figma: Elevation/Overlay shadow
    shadowColor: '#070517',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 24,
  },
  // Drag handle touch area — generous tap target for swipe-down
  dragHandleArea: {
    alignItems: 'center',
    paddingTop: 6,               // Tighter top spacing above drag handle
    paddingBottom: 0,            // No gap between handle and header
  },
  // Small grey pill drag indicator
  dragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CECECE',
  },
  // Header row: [spacer] [title] [close button]
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,               // Tight to drag handle
    paddingBottom: 16,           // Breathing room before content
  },
  // Spacer — matches close button width for centering the title
  headerSpacer: {
    width: 32,
    height: 32,
  },
  // Title text — centered
  headerTitle: {
    flex: 1,
    fontSize: 18,                // Figma: header_small
    fontWeight: '500',           // Figma: Medium
    color: '#08070c',            // Figma: text_dark_inverse
    textAlign: 'center',
    letterSpacing: -0.44,
    lineHeight: 24,
  },
  // Close X button — 32×32 white circle
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',  // Figma: input_fill white
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Content area below header
  content: {
    paddingHorizontal: 16,
  },
});
