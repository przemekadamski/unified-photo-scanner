import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Header from './src/components/Header';
import IOSStatusBar from './src/components/iOSStatusBar';
import HomeIndicator from './src/components/HomeIndicator';
import CameraView from './src/components/CameraView';
import ModeTabs from './src/components/ModeTabs';
import type { ScanMode } from './src/components/ModeTabs';
import BottomControls from './src/components/BottomControls';
import SearchSheet from './src/components/SearchSheet';
// V2 imports
import ModeTabsV2 from './src/components/ModeTabsV2';
import type { ScanModeV2 } from './src/components/ModeTabsV2';
import SearchSheetV2 from './src/components/SearchSheetV2';

// ─── Version Switcher ─────────────────────────────────
// This is the top-level component that wraps everything.
// It shows a toggle bar above the phone frame so you can
// switch between two versions of the app.
export default function App() {
  // Track which version is currently shown (1 or 2)
  const [activeVersion, setActiveVersion] = useState<1 | 2>(1);

  return (
    <View style={styles.appRoot}>
      {/* Version switcher bar — sits above the phone frame */}
      <View style={styles.switcherBar}>
        <TouchableOpacity
          style={[
            styles.switcherTab,
            activeVersion === 1 && styles.switcherTabActive,
          ]}
          onPress={() => setActiveVersion(1)}
        >
          <Text
            style={[
              styles.switcherText,
              activeVersion === 1 && styles.switcherTextActive,
            ]}
          >
            Version 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switcherTab,
            activeVersion === 2 && styles.switcherTabActive,
          ]}
          onPress={() => setActiveVersion(2)}
        >
          <Text
            style={[
              styles.switcherText,
              activeVersion === 2 && styles.switcherTextActive,
            ]}
          >
            Version 2
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show the selected version */}
      {activeVersion === 1 ? (
        <SmartScanV1 />
      ) : (
        <SmartScanV2 />
      )}
    </View>
  );
}

// ─── Version 2 (Redesigned controls with pill tabs) ───
// Key differences from V1:
// - Mode tabs are inside a dark pill-shaped container (#181818)
// - Only 4 modes: Barcode, Food, Auto, Recipe (no Menu)
// - Active tab has subtle white bg + yellow text
// - In barcode mode: no shutter button, tabs/gallery move up
function SmartScanV2() {
  // V2 uses a reduced set of modes (no Menu)
  const [activeMode, setActiveMode] = useState<ScanModeV2>('Auto');

  // Same blur animation as V1 for smooth mode transitions
  const blurAnim = useRef(new Animated.Value(0)).current;
  const isTransitioning = useRef(false);
  const blurOpacity = blurAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });
  const [blurPx, setBlurPx] = useState(0);
  blurAnim.addListener(({ value }) => {
    setBlurPx(value * 4);
  });

  const handleModeChange = useCallback((newMode: ScanModeV2) => {
    if (newMode === activeMode || isTransitioning.current) return;
    isTransitioning.current = true;
    Animated.timing(blurAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      setActiveMode(newMode);
      Animated.timing(blurAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }).start(() => {
        isTransitioning.current = false;
      });
    });
  }, [activeMode, blurAnim]);

  const isBarcode = activeMode === 'Barcode';

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.root}>
        {/* iOS status bar */}
        <IOSStatusBar />

        <View style={styles.safeArea}>
          {/* Header area — same as V1 */}
          <View style={styles.headerArea}>
            <Header />
            <Text style={styles.subtitle}>
              Scan a menu, food, recipe, or barcode to get started.
            </Text>
          </View>

          {/* Camera preview with blur transition */}
          <Animated.View
            style={[
              styles.cameraWrapper,
              {
                opacity: blurOpacity,
                ...(Platform.OS === 'web'
                  ? { filter: `blur(${blurPx}px)` as any }
                  : {}),
              },
            ]}
          >
            {/* CameraView accepts ScanMode — ScanModeV2 is a subset, so it works */}
            <CameraView mode={activeMode} />
          </Animated.View>

          {/* ── V2 Controls Area ─────────────────────────── */}
          {/* Uses absolute positioning to match Figma layout exactly */}
          <View style={v2Styles.controlsArea}>

            {/* Shutter button — only shown in non-barcode modes */}
            {!isBarcode && (
              <TouchableOpacity style={v2Styles.shutterOuter}>
                <View style={v2Styles.shutterInner} />
              </TouchableOpacity>
            )}

            {/* Gallery thumbnail icon */}
            <Image
              source={require('./assets/images/Camera.png')}
              style={isBarcode ? v2Styles.galleryBarcode : v2Styles.gallery}
            />

            {/* Pill-shaped mode tabs */}
            <View style={isBarcode ? v2Styles.pillBarcode : v2Styles.pill}>
              <ModeTabsV2
                activeMode={activeMode}
                onModeChange={handleModeChange}
              />
            </View>

            {/* Home indicator bar (light on dark bg) */}
            <View style={v2Styles.homeBar} />
          </View>
        </View>

        {/* V2 search sheet — simplified, no handle or prompt text */}
        <SearchSheetV2 visible={isBarcode} />
      </View>
    </View>
  );
}

// V2-specific styles (separate from shared styles)
const v2Styles = StyleSheet.create({
  // Dark bottom controls section — same height as V1, absolute positioning inside
  controlsArea: {
    backgroundColor: '#08070c',
    height: 218,
    position: 'relative',
  },
  // Shutter button — centered, near top of controls area
  shutterOuter: {
    position: 'absolute',
    top: 32,
    left: 160.5, // (393 - 72) / 2 to center the 72px button
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
  },
  // Gallery icon — normal position (bottom-left of controls)
  gallery: {
    position: 'absolute',
    top: 149, // vertically aligned with pill tabs
    left: 32,
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  // Gallery icon — barcode position (top-left, next to pill)
  galleryBarcode: {
    position: 'absolute',
    top: 24,
    left: 32,
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  // Pill tabs container — normal position (bottom-center)
  pill: {
    position: 'absolute',
    top: 138,
    left: 104, // (393 - 185) / 2 to center the 185px pill
  },
  // Pill tabs container — barcode position (top-center)
  pillBarcode: {
    position: 'absolute',
    top: 16,
    left: 104,
  },
  // Home indicator bar at the very bottom
  homeBar: {
    position: 'absolute',
    bottom: 8,
    left: 129, // (393 - 135) / 2 to center
    width: 135,
    height: 5,
    borderRadius: 50,
    backgroundColor: '#323232',
  },
});

// ─── Version 1 (Original SmartScanApp) ────────────────
function SmartScanV1() {
  // Track which scan mode is currently active
  const [activeMode, setActiveMode] = useState<ScanMode>('Auto');

  // Animated value drives both blur and opacity:
  // 0 = no blur (clear), 1 = peak blur (4px + 0.85 opacity)
  const blurAnim = useRef(new Animated.Value(0)).current;
  const isTransitioning = useRef(false);

  // Interpolate: 0 → 1 → 0 maps to blur 0 → 4px → 0
  const blurOpacity = blurAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  // For web: CSS filter blur driven by animated value
  // We listen to the value and apply it as a style
  const [blurPx, setBlurPx] = useState(0);
  blurAnim.addListener(({ value }) => {
    setBlurPx(value * 4); // 0→0px, 1→4px blur
  });

  // Mode switch with blur animation (matching smart-scan.html)
  // Blur up to 4px over 315ms (45% of 700ms), hold briefly, then switch
  // content and blur back down to 0
  const handleModeChange = useCallback((newMode: ScanMode) => {
    if (newMode === activeMode || isTransitioning.current) return;
    isTransitioning.current = true;

    // Blur in: 0 → 1 over first half (350ms)
    Animated.timing(blurAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false, // filter not supported by native driver on web
    }).start(() => {
      // At peak blur, switch the mode
      setActiveMode(newMode);

      // Blur out: 1 → 0 over second half (350ms)
      Animated.timing(blurAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }).start(() => {
        isTransitioning.current = false;
      });
    });
  }, [activeMode, blurAnim]);

  // Barcode mode hides the shutter button and shows the search sheet
  const isBarcode = activeMode === 'Barcode';

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.root}>
        {/* iOS status bar: time, signal, wifi, battery */}
        <IOSStatusBar />

        <View style={styles.safeArea}>
          {/* Light background behind the header area */}
          <View style={styles.headerArea}>
            <Header />
            {/* Subtitle text below the header */}
            <Text style={styles.subtitle}>
              Scan a menu, food, recipe, or barcode to get started.
            </Text>
          </View>

          {/* Camera preview area — blur + opacity transition on mode switch */}
          <Animated.View
            style={[
              styles.cameraWrapper,
              {
                opacity: blurOpacity,
                // Web: apply CSS filter blur via style prop
                ...(Platform.OS === 'web'
                  ? { filter: `blur(${blurPx}px)` as any }
                  : {}),
              },
            ]}
          >
            <CameraView mode={activeMode} />
          </Animated.View>

          {/* Dark bottom section with mode tabs and controls */}
          <View style={styles.controlsArea}>
            {/* Mode selector tabs */}
            <ModeTabs activeMode={activeMode} onModeChange={handleModeChange} />

            {/* Shutter button + gallery icon (hidden in barcode mode) */}
            <BottomControls visible={!isBarcode} />

            {/* Home indicator — light pill on dark background */}
            <HomeIndicator color="light" />
          </View>

        </View>

        {/* Search sheet — absolutely positioned, slides up over bottom area */}
        <SearchSheet visible={isBarcode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen container that holds switcher + phone frame
  appRoot: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ─── Switcher bar styles ───
  switcherBar: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 4,
  },
  switcherTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switcherTabActive: {
    backgroundColor: '#ffffff',
  },
  switcherText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
  },
  switcherTextActive: {
    color: '#000000',
  },
  // ─── Phone frame styles (unchanged) ───
  // Centers the 393px phone frame in the browser window
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    width: 393,
    height: 852,
    backgroundColor: '#f4f4f4',
    overflow: 'hidden',
    borderRadius: 32,
  },
  safeArea: {
    flex: 1,
  },
  // Light header area (white/light grey)
  headerArea: {
    backgroundColor: '#f4f4f4',
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 18,
    paddingHorizontal: 40,
    marginTop: 4,
  },
  // Camera preview section
  cameraWrapper: {
    flex: 1,
  },
  // Dark bottom controls section (#08070c from Figma)
  controlsArea: {
    backgroundColor: '#08070c',
    paddingTop: 10,
    paddingBottom: 20,
  },
});
