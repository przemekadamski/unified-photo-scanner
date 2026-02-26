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
// Result screens (step 3 of scan flows)
import BarcodeResult from './src/components/BarcodeResult';
import RecipeResult from './src/components/RecipeResult';
import MenuResult from './src/components/MenuResult';
import FoodResult from './src/components/FoodResult';

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
  // Displayed mode updates instantly (for pill highlight);
  // activeMode updates at blur midpoint (for camera image)
  const [displayedMode, setDisplayedMode] = useState<ScanModeV2>('Auto');

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

  // ── Controls layout animation (barcode ↔ other modes) ──
  // 0 = normal mode (shutter visible, elements at bottom)
  // 1 = barcode mode (shutter hidden, elements slide up)
  const controlsAnim = useRef(new Animated.Value(0)).current;
  // Shutter fades out when switching to barcode
  const shutterOpacity = controlsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  // Gallery slides from bottom (149) to top (24)
  const galleryTop = controlsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [149, 24],
  });
  // Pill tabs slide from bottom (138) to top (16)
  const pillTop = controlsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [138, 16],
  });
  // Controls SearchSheetV2 visibility — set at transition START so it
  // animates in parallel with the pill/gallery, not after the mode switch
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleModeChange = useCallback((newMode: ScanModeV2) => {
    if (newMode === activeMode || isTransitioning.current) return;
    isTransitioning.current = true;
    // Reset step flow when switching modes
    setStep(1);
    setLoading(false);

    // Build animations — blur always runs, controls animate if switching to/from barcode
    const switchingToBarcode = newMode === 'Barcode';
    const switchingFromBarcode = activeMode === 'Barcode';
    // Update pill highlight immediately — same time as slide-up
    setDisplayedMode(newMode);
    // Trigger sheet slide at the same time as pill/gallery animation
    if (switchingToBarcode) setSheetVisible(true);
    if (switchingFromBarcode) setSheetVisible(false);
    const blurIn = Animated.timing(blurAnim, {
      toValue: 1, duration: 350, useNativeDriver: false,
    });
    const animations: Animated.CompositeAnimation[] = [blurIn];
    if (switchingToBarcode || switchingFromBarcode) {
      animations.push(
        Animated.timing(controlsAnim, {
          toValue: switchingToBarcode ? 1 : 0,
          duration: 350,
          useNativeDriver: false,
        }),
      );
    }

    // Run blur + controls transition in parallel
    Animated.parallel(animations).start(() => {
      setActiveMode(newMode);
      Animated.timing(blurAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      }).start(() => {
        isTransitioning.current = false;
      });
    });
  }, [activeMode, blurAnim, controlsAnim]);

  const isBarcode = activeMode === 'Barcode';
  const isRecipe = activeMode === 'Recipe';
  const isFood = activeMode === 'Food';
  const isAuto = activeMode === 'Auto';

  // ── Step flow state (ported from V1) ─────────────────
  // Step in the scan flow (1 = scanner, 2 = detected, 3 = result)
  const [step, setStep] = useState(1);
  // Shutter flash animation: black overlay that flashes 0 → 1 → 0
  const shutterAnim = useRef(new Animated.Value(0)).current;
  // Drawer slide-up animation: 0 = off-screen, 1 = fully visible
  const drawerAnim = useRef(new Animated.Value(0)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  // Loading state — shown on camera between shutter flash and result drawer
  const [loading, setLoading] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  // For barcode: product card shows first, full result opens on card tap
  const [fullResultOpen, setFullResultOpen] = useState(false);

  // Plays the shutter flash effect (black flash over camera area only).
  // onPeak fires at max opacity so loading can start while flash still covers screen.
  const playShutter = useCallback((opts?: { onPeak?: () => void; onComplete?: () => void }) => {
    shutterAnim.setValue(0);
    Animated.timing(shutterAnim, {
      toValue: 1, duration: 50, useNativeDriver: false,
    }).start(() => {
      if (opts?.onPeak) opts.onPeak();
      Animated.timing(shutterAnim, {
        toValue: 0, duration: 150, useNativeDriver: false,
      }).start(() => {
        if (opts?.onComplete) opts.onComplete();
      });
    });
  }, [shutterAnim]);

  // Slides the result drawer up from the bottom
  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
    drawerAnim.setValue(0);
    Animated.timing(drawerAnim, {
      toValue: 1, duration: 350, useNativeDriver: false,
    }).start();
  }, [drawerAnim]);

  // Slides the result drawer back down and unmounts it
  const closeDrawer = useCallback(() => {
    Animated.timing(drawerAnim, {
      toValue: 0, duration: 300, useNativeDriver: false,
    }).start(() => {
      setDrawerVisible(false);
      setFullResultOpen(false);
      setLoading(false);
      setStep(1);
    });
  }, [drawerAnim]);

  // Advance scan flow: step 1→2 just advances, step 2→3 does shutter→loading→result
  const advanceStep = useCallback(() => {
    if (step === 2) {
      const isBarcodeMode = activeMode === 'Barcode';
      const loadingDelay = isBarcodeMode ? 500 : 1000;
      playShutter({
        onPeak: () => {
          setLoading(true);
          setStep(3);
          spinAnim.setValue(0);
          Animated.loop(
            Animated.timing(spinAnim, {
              toValue: 1, duration: 1000, useNativeDriver: false,
            }),
          ).start();
          setTimeout(() => {
            setLoading(false);
            spinAnim.stopAnimation();
            openDrawer();
          }, loadingDelay);
        },
      });
    } else if (step < 3) {
      setStep(step + 1);
    }
  }, [step, activeMode, playShutter, openDrawer, spinAnim]);

  // Go back to step 1 (close result screen)
  const resetToScanner = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  // Shutter button tapped — advances the step flow
  const handleShutter = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  // Tapping the product card in SearchSheetV2 opens full BarcodeResult drawer
  const handleProductTap = useCallback(() => {
    setFullResultOpen(true);
    drawerAnim.setValue(0);
    Animated.timing(drawerAnim, {
      toValue: 1, duration: 350, useNativeDriver: false,
    }).start();
  }, [drawerAnim]);

  // Which result component to show (no Menu in V2)
  const ResultScreen = isBarcode
    ? BarcodeResult
    : isRecipe
      ? RecipeResult
      : (isFood || isAuto)
        ? FoodResult
        : null;

  // Drawer slides up from bottom: translateY 852 → 0
  const drawerTranslateY = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [852, 0],
  });

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

          {/* Camera preview — tappable in barcode mode to advance step flow */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={isBarcode ? advanceStep : undefined}
            style={styles.cameraWrapper}
          >
            <Animated.View
              style={[
                { flex: 1 },
                {
                  opacity: blurOpacity,
                  ...(Platform.OS === 'web'
                    ? { filter: `blur(${blurPx}px)` as any }
                    : {}),
                },
              ]}
            >
              {/* Cap step at 2 so the focus image stays visible during loading */}
              <CameraView mode={activeMode} step={Math.min(step, 2)} />
            </Animated.View>

            {/* Shutter flash — black overlay on camera area only */}
            <Animated.View
              pointerEvents="none"
              style={[styles.shutterFlash, { opacity: shutterAnim }]}
            />

            {/* Loading overlay — shown after shutter flash, before result drawer */}
            {loading && (
              <View style={styles.loadingOverlay}>
                <Animated.View
                  style={[
                    styles.loadingSpinner,
                    {
                      transform: [{
                        rotate: spinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      }],
                    },
                  ]}
                />
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ── V2 Controls Area ─────────────────────────── */}
          {/* Uses absolute positioning to match Figma layout exactly */}
          <View style={v2Styles.controlsArea}>

            {/* Shutter button — always rendered, fades out smoothly in barcode mode */}
            <Animated.View
              pointerEvents={isBarcode ? 'none' : 'auto'}
              style={[v2Styles.shutterPosition, { opacity: shutterOpacity }]}
            >
              <TouchableOpacity style={v2Styles.shutterButton} onPress={handleShutter}>
                <View style={v2Styles.shutterInner} />
              </TouchableOpacity>
            </Animated.View>

            {/* Gallery thumbnail icon — slides up/down smoothly */}
            <Animated.View style={[v2Styles.galleryPosition, { top: galleryTop }]}>
              <Image
                source={require('./assets/images/Camera.png')}
                style={v2Styles.galleryImage}
              />
            </Animated.View>

            {/* Pill-shaped mode tabs — slides up/down smoothly */}
            <Animated.View style={[v2Styles.pillPosition, { top: pillTop }]}>
              <ModeTabsV2
                activeMode={displayedMode}
                onModeChange={handleModeChange}
              />
            </Animated.View>

            {/* Home indicator bar (light on dark bg) */}
            <View style={v2Styles.homeBar} />
          </View>
        </View>

        {/* V2 search sheet — slides up in sync with pill tabs */}
        <SearchSheetV2
          visible={sheetVisible}
          scanned={drawerVisible}
          onProductTap={handleProductTap}
        />

        {/* Result drawer — slides up from bottom over the scanner */}
        {/* Barcode: opens on product card tap. Others: opens after loading. */}
        {((isBarcode && fullResultOpen) || (!isBarcode && drawerVisible)) && ResultScreen && (
          <Animated.View
            style={[
              styles.resultDrawer,
              { transform: [{ translateY: drawerTranslateY }] },
            ]}
          >
            <ResultScreen onClose={resetToScanner} />
          </Animated.View>
        )}
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
  // Shutter button — positioned wrapper (animated opacity)
  shutterPosition: {
    position: 'absolute',
    top: 32,
    left: 160.5, // (393 - 72) / 2 to center the 72px button
  },
  // Shutter button — appearance styling only (no position)
  shutterButton: {
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
  // Gallery — positioned wrapper (animated top: 149 ↔ 24)
  galleryPosition: {
    position: 'absolute',
    left: 32,
  },
  // Gallery — image sizing only (no position)
  galleryImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  // Pill tabs — positioned wrapper (animated top: 138 ↔ 16)
  pillPosition: {
    position: 'absolute',
    left: 104, // (393 - 185) / 2 to center the 185px pill
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
// Barcode flow has 3 steps:
//   Step 1: Scanner with barcode box + "Align barcode" tooltip + SearchSheet
//   Step 2: Barcode detected — green "Barcode" pill + SearchSheet
//   Step 3: Full "Track food" result screen
function SmartScanV1() {
  // Track which scan mode is currently active
  const [activeMode, setActiveMode] = useState<ScanMode>('Auto');
  // Step in the barcode scan flow (1 = scanner, 2 = detected, 3 = result)
  const [step, setStep] = useState(1);

  // Shutter flash animation: white overlay that flashes 0 → 1 → 0
  const shutterAnim = useRef(new Animated.Value(0)).current;

  // Drawer slide-up animation: 0 = off-screen (below), 1 = fully visible
  const drawerAnim = useRef(new Animated.Value(0)).current;
  // Whether the result drawer is mounted (so we can animate out before unmounting)
  const [drawerVisible, setDrawerVisible] = useState(false);
  // Loading state — shown on camera area between shutter flash and result drawer
  const [loading, setLoading] = useState(false);
  // Spinning animation for the loading indicator
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Plays the shutter flash effect (black flash over camera area only).
  // onPeak fires at max opacity (before fade-out) so loading can start
  // while the flash is still covering the screen — avoids a double-flash.
  const playShutter = useCallback((opts?: { onPeak?: () => void; onComplete?: () => void }) => {
    shutterAnim.setValue(0);
    // Flash in: 0 → 1 over 50ms
    Animated.timing(shutterAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: false,
    }).start(() => {
      // Fire at peak — loading overlay appears underneath while still black
      if (opts?.onPeak) opts.onPeak();
      // Flash out: 1 → 0 over 150ms — reveals loading overlay
      Animated.timing(shutterAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        if (opts?.onComplete) opts.onComplete();
      });
    });
  }, [shutterAnim]);

  // Slides the result drawer up from the bottom
  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
    drawerAnim.setValue(0);
    Animated.timing(drawerAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [drawerAnim]);

  // Slides the result drawer back down and unmounts it
  const closeDrawer = useCallback(() => {
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setDrawerVisible(false);
      setFullResultOpen(false);
      setLoading(false);
      setStep(1);
    });
  }, [drawerAnim]);

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
  const handleModeChange = useCallback((newMode: ScanMode) => {
    if (newMode === activeMode || isTransitioning.current) return;
    isTransitioning.current = true;
    // Reset step and clear loading when switching modes
    setStep(1);
    setLoading(false);

    // Blur in: 0 → 1 over first half (350ms)
    Animated.timing(blurAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
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

  // Advance scan flow to next step
  // Step 1 → 2: just advance.
  // Step 2 → 3: shutter flash → loading overlay → show result.
  // Barcode loading = 1s (fast), Recipe/Menu loading = 2s.
  const advanceStep = useCallback(() => {
    if (step === 2) {
      const isBarcodeMode = activeMode === 'Barcode';
      const loadingDelay = isBarcodeMode ? 500 : 1000;
      // Flash over camera area
      playShutter({
        // At peak flash: start loading underneath (no visible gap)
        onPeak: () => {
          setLoading(true);
          setStep(3);
          // Start spinning animation
          spinAnim.setValue(0);
          Animated.loop(
            Animated.timing(spinAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
          ).start();
          // After delay, hide loading and show result
          setTimeout(() => {
            setLoading(false);
            spinAnim.stopAnimation();
            openDrawer();
          }, loadingDelay);
        },
      });
    } else if (step < 3) {
      setStep(step + 1);
    }
  }, [step, activeMode, playShutter, openDrawer, spinAnim]);

  // Go back to step 1 (close result screen) — animates drawer down
  const resetToScanner = useCallback(() => {
    closeDrawer();
  }, [closeDrawer]);

  // Shutter button tapped — always advances the step flow
  const handleShutter = useCallback(() => {
    advanceStep();
  }, [advanceStep]);

  // Mode flags
  const isBarcode = activeMode === 'Barcode';
  const isRecipe = activeMode === 'Recipe';
  const isMenu = activeMode === 'Menu';
  const isFood = activeMode === 'Food';
  const isAuto = activeMode === 'Auto';
  // All modes now use the step-based flow
  const hasStepFlow = true;

  // Which result component to show in the full-screen drawer
  const ResultScreen = isBarcode
    ? BarcodeResult
    : isRecipe
      ? RecipeResult
      : isMenu
        ? MenuResult
        : (isFood || isAuto)
          ? FoodResult
          : null;

  // Whether the full-screen result drawer is open
  // (barcode shows product card first, then drawer on tap)
  const [fullResultOpen, setFullResultOpen] = useState(false);

  // Tapping the product card in SearchSheet opens the full BarcodeResult drawer
  const handleProductTap = useCallback(() => {
    setFullResultOpen(true);
    // Reuse drawerAnim for the slide-up
    drawerAnim.setValue(0);
    Animated.timing(drawerAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [drawerAnim]);

  // Drawer slides up from the bottom: translateY goes from 852 (full height) to 0
  const drawerTranslateY = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [852, 0], // 852 = phone frame height
  });

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

          {/* Camera preview area — tappable in barcode mode only */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={isBarcode ? advanceStep : undefined}
            style={styles.cameraWrapper}
          >
            <Animated.View
              style={[
                { flex: 1 },
                {
                  opacity: blurOpacity,
                  ...(Platform.OS === 'web'
                    ? { filter: `blur(${blurPx}px)` as any }
                    : {}),
                },
              ]}
            >
              {/* Cap step at 2 so the focus image stays visible during loading */}
              <CameraView mode={activeMode} step={hasStepFlow ? Math.min(step, 2) : 1} />
            </Animated.View>

            {/* Shutter flash — white overlay on camera area only */}
            <Animated.View
              pointerEvents="none"
              style={[styles.shutterFlash, { opacity: shutterAnim }]}
            />

            {/* Loading overlay — shown after shutter flash, before result drawer */}
            {loading && (
              <View style={styles.loadingOverlay}>
                <Animated.View
                  style={[
                    styles.loadingSpinner,
                    {
                      transform: [{
                        rotate: spinAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      }],
                    },
                  ]}
                />
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            )}

          </TouchableOpacity>

          {/* Dark bottom section with mode tabs and controls */}
          <View style={styles.controlsArea}>
            {/* Mode selector tabs */}
            <ModeTabs activeMode={activeMode} onModeChange={handleModeChange} />

            {/* Shutter button + gallery icon — always visible */}
            <BottomControls visible={true} onShutter={handleShutter} />

            {/* Home indicator — light pill on dark background */}
            <HomeIndicator color="light" />
          </View>

        </View>

        {/* Search sheet — shown in barcode mode; shows product card after scan */}
        {isBarcode && (
          <SearchSheet
            visible={true}
            scanned={drawerVisible}
            onProductTap={handleProductTap}
          />
        )}

        {/* Result drawer — slides up from bottom over the scanner */}
        {/* Barcode: opens on product card tap. Recipe/Menu: opens after loading. */}
        {((isBarcode && fullResultOpen) || (!isBarcode && drawerVisible)) && ResultScreen && (
          <Animated.View
            style={[
              styles.resultDrawer,
              { transform: [{ translateY: drawerTranslateY }] },
            ]}
          >
            <ResultScreen onClose={resetToScanner} />
          </Animated.View>
        )}
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
  // Loading overlay — dark semi-transparent layer with spinner
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  // Spinning ring indicator
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: '#ffffff',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Black flash overlay for shutter effect — covers camera area only
  shutterFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
  },
  // Full-screen drawer that slides up from below to show result screens
  resultDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f4f4f4',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

});
