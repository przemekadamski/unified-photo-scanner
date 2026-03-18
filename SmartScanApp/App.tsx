import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Header from './src/components/Header';
import IOSStatusBar from './src/components/iOSStatusBar';
import HomeIndicator from './src/components/HomeIndicator';
import CameraView from './src/components/CameraView';
import BottomControls from './src/components/BottomControls';
import ModePicker from './src/components/ModePicker';
import SearchSheet from './src/components/SearchSheet';
import Onboarding from './src/components/Onboarding';
import Coachmark from './src/components/Coachmark';
import MyDay from './src/components/MyDay';
import FABMenu from './src/components/FABMenu';

// Scan modes — kept here now that ModeTabs is removed
type ScanMode = 'Barcode' | 'Food' | 'Auto' | 'Recipe' | 'Menu';
// Result screens (step 3 of scan flows)
import BarcodeResult from './src/components/BarcodeResult';
import RecipeResult from './src/components/RecipeResult';
import MenuResult from './src/components/MenuResult';
import FoodResult from './src/components/FoodResult';
import ServingPicker from './src/components/ServingPicker';
import MealPicker from './src/components/MealPicker';
import ManualSearch from './src/components/ManualSearch';

// ─── App Entry Point ──────────────────────────────────
// Navigation: MyDay (home) → FAB menu → Scanner
// The phone frame wraps everything at 393×852px.
type Screen = 'myday' | 'fab' | 'scanner';

export default function App() {
  const [screen, setScreen] = useState<Screen>('myday');
  // Track whether scanner has been visited (keep it mounted for smooth transitions)
  const [scannerVisited, setScannerVisited] = useState(false);
  // Animated opacity for scanner fade in/out
  const scannerOpacity = useRef(new Animated.Value(0)).current;

  const navigateTo = useCallback((target: Screen) => {
    if (target === 'scanner') {
      setScannerVisited(true);
      setScreen(target);
      // Fade scanner in
      Animated.spring(scannerOpacity, {
        toValue: 1,
        tension: 200,
        friction: 20,
        useNativeDriver: false,
      }).start();
    } else if (screen === 'scanner') {
      // Fade scanner out, then switch screen
      Animated.spring(scannerOpacity, {
        toValue: 0,
        tension: 200,
        friction: 20,
        useNativeDriver: false,
      }).start(() => {
        setScreen(target);
      });
    } else {
      setScreen(target);
    }
  }, [screen, scannerOpacity]);

  return (
    <View style={styles.appRoot}>
      <View style={styles.outerFrame}>
        <View style={styles.phoneFrame}>
          {/* MyDay home screen — base layer, visible when not in scanner */}
          {screen !== 'scanner' && (
            <MyDay onFABTap={() => navigateTo('fab')} />
          )}

          {/* FAB menu overlay — blurred background over MyDay */}
          {screen === 'fab' && (
            <FABMenu
              onClose={() => navigateTo('myday')}
              onSmartScan={() => navigateTo('scanner')}
            />
          )}

          {/* Scanner — fades in/out with spring animation */}
          {scannerVisited && (
            <Animated.View
              style={[styles.scannerLayer, { opacity: scannerOpacity }]}
              pointerEvents={screen === 'scanner' ? 'auto' : 'none'}
            >
              <SmartScanV1 onBack={() => navigateTo('myday')} />
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── SmartScanV1 ──────────────────────────────────────
// Barcode flow has 3 steps:
//   Step 1: Scanner with barcode box + "Align barcode" tooltip + SearchSheet
//   Step 2: Barcode detected — green "Barcode" pill + SearchSheet
//   Step 3: Full "Track food" result screen
function SmartScanV1({ onBack }: { onBack?: () => void }) {
  // Track which scan mode is currently active
  const [activeMode, setActiveMode] = useState<ScanMode>('Auto');
  // Step in the barcode scan flow (1 = scanner, 2 = detected, 3 = result)
  const [step, setStep] = useState(1);
  // Whether the mode picker grid overlay is visible
  const [pickerVisible, setPickerVisible] = useState(false);
  // Onboarding: shown on first load, then coachmark after dismissal
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showCoachmark, setShowCoachmark] = useState(false);

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
    Animated.spring(drawerAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => {
      setDrawerVisible(false);
      setFullResultOpen(false);
      setLoading(false);
      setStep(1);
      // Reset to scanning state when returning to barcode step 1
      setBarcodeScanning(true);
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
    // Reset step, clear loading, and reset barcode scanning state
    setStep(1);
    setLoading(false);
    // When switching to barcode mode, start in "Scanning..." state
    setBarcodeScanning(newMode === 'Barcode');

    // Blur in with spring (iOS-style smooth transition)
    Animated.spring(blurAnim, {
      toValue: 1,
      tension: 100,
      friction: 15,
      useNativeDriver: false,
    }).start(() => {
      // At peak blur, switch the mode
      setActiveMode(newMode);

      // Blur out with spring
      Animated.spring(blurAnim, {
        toValue: 0,
        tension: 100,
        friction: 15,
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
      // When advancing from step 1→2 in barcode mode:
      // stop scanning state and show the product card in SearchSheet
      if (step === 1 && activeMode === 'Barcode') {
        setBarcodeScanning(false);
        setDrawerVisible(true);
      }
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

  // Whether the barcode scanner is in "Scanning..." state
  // (shows spinner + "Search manually" link instead of search input)
  const [barcodeScanning, setBarcodeScanning] = useState(true);

  // Picker sheet visibility
  const [showServingPicker, setShowServingPicker] = useState(false);
  const [showMealPicker, setShowMealPicker] = useState(false);
  // Selected values for dropdowns (updated when picker "Update" is tapped)
  const [selectedServing, setSelectedServing] = useState('3 oz');
  const [selectedMeal, setSelectedMeal] = useState('Breakfast');

  // No auto-timer — barcode "Scanning..." stays until user taps the camera image.
  // The tap calls advanceStep() which handles the step 1→2 transition.

  // Whether the full-screen result drawer is open
  // (barcode shows product card first, then drawer on tap)
  const [fullResultOpen, setFullResultOpen] = useState(false);

  // Whether the ManualSearch sheet is open (triggered from "Search manually" in scanning state)
  const [manualSearchOpen, setManualSearchOpen] = useState(false);

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
    <View style={styles.scannerContainer}>
      {/* iOS status bar: time, signal, wifi, battery */}
      <IOSStatusBar />

        <View style={styles.safeArea}>
          {/* Light background behind the header area */}
          <View style={styles.headerArea}>
            <Header onBack={onBack} />
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

          {/* Dark bottom section with shutter + gallery + mode pill */}
          <View style={styles.controlsArea}>
            {/* Shutter button (center), gallery icon (left), mode pill (right) */}
            <BottomControls
              visible={true}
              onShutter={handleShutter}
              activeMode={activeMode}
              onModePillTap={() => setPickerVisible(!pickerVisible)}
            />

            {/* Home indicator — light pill on dark background */}
            <HomeIndicator color="light" />
          </View>

        </View>

        {/* Search sheet — shown in barcode mode; shows product card after scan */}
        {isBarcode && (
          <SearchSheet
            visible={true}
            scanning={barcodeScanning}
            scanned={drawerVisible}
            onProductTap={handleProductTap}
            onSearchManually={() => setManualSearchOpen(true)}
            onServingTap={() => setShowServingPicker(true)}
            onMealTap={() => setShowMealPicker(true)}
            servingLabel={selectedServing}
            mealLabel={selectedMeal}
          />
        )}

        {/* Mode picker grid overlay — appears when tapping the mode pill */}
        <ModePicker
          visible={pickerVisible}
          activeMode={activeMode}
          onSelectMode={(mode) => {
            setPickerVisible(false);    // close picker
            handleModeChange(mode);     // switch mode with blur animation
          }}
          onClose={() => setPickerVisible(false)}
        />

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

        {/* Serving size picker — half-sheet overlay */}
        <ServingPicker
          visible={showServingPicker}
          onClose={() => setShowServingPicker(false)}
          onUpdate={(serving) => {
            setSelectedServing(serving);
            setShowServingPicker(false);
          }}
        />

        {/* Meal time picker — half-sheet overlay */}
        <MealPicker
          visible={showMealPicker}
          onClose={() => setShowMealPicker(false)}
          onUpdate={(meal) => {
            setSelectedMeal(meal);
            setShowMealPicker(false);
          }}
        />

        {/* Manual search sheet — opens from "Search manually" in barcode scanning state */}
        <ManualSearch
          visible={manualSearchOpen}
          onClose={() => setManualSearchOpen(false)}
          onProductTap={() => {
            // Close ManualSearch, then open full BarcodeResult
            setManualSearchOpen(false);
            handleProductTap();
          }}
        />

        {/* Coachmark tooltip — appears after onboarding is dismissed */}
        <Coachmark
          visible={showCoachmark}
          onDismiss={() => setShowCoachmark(false)}
        />

        {/* Onboarding modal — shown on first load, covers entire screen */}
        {showOnboarding && (
          <Onboarding
            onDismiss={() => {
              setShowOnboarding(false);
              setShowCoachmark(true); // show coachmark after onboarding
            }}
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen container that centers the phone frame
  appRoot: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Outer centering wrapper for the phone frame
  outerFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 393×852 phone frame with rounded corners
  phoneFrame: {
    width: 393,
    height: 852,
    backgroundColor: '#f4f4f4',
    overflow: 'hidden',
    borderRadius: 32,
  },
  // Scanner layer — absolute fill for fade transitions
  scannerLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Scanner fills the phone frame
  scannerContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
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
  // Transparent — each result component handles its own overlay
  resultDrawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

});
