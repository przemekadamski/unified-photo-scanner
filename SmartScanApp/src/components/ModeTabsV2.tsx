import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';

// V2 mode tabs: pill-shaped container with scrollable tabs
// Only 4 modes (no Menu), displayed inside a dark rounded pill
// Active tab gets a subtle white highlight + yellow text

const MODES_V2 = ['Barcode', 'Food', 'Auto', 'Recipe'] as const;
export type ScanModeV2 = (typeof MODES_V2)[number];

type Props = {
  activeMode: ScanModeV2;
  onModeChange: (mode: ScanModeV2) => void;
};

export default function ModeTabsV2({ activeMode, onModeChange }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  // When the active mode changes, scroll the pill so the active tab is visible
  useEffect(() => {
    const activeIndex = MODES_V2.indexOf(activeMode);
    // Each tab is roughly 80px wide. We want to center the active one.
    // Pill is 185px wide, so offset = tabPosition - pillWidth/2 + tabWidth/2
    const tabWidth = 80;
    const pillWidth = 185;
    const offset = Math.max(0, activeIndex * tabWidth - pillWidth / 2 + tabWidth / 2);
    scrollRef.current?.scrollTo({ x: offset, animated: true });
  }, [activeMode]);

  return (
    <View style={styles.pill}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MODES_V2.map((mode) => {
          const isActive = mode === activeMode;
          return (
            <TouchableOpacity
              key={mode}
              onPress={() => onModeChange(mode)}
              style={[
                styles.tab,
                // Active tab: glass effect with gradient border + shine
                isActive && styles.tabActive,
                // Web-only: add shadow for glass depth
                isActive && Platform.OS === 'web' && styles.tabActiveWeb,
              ]}
            >
              {/* Glass shine — a lighter band at the top half of the pill */}
              {isActive && <View style={styles.tabShine} />}
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Dark rounded pill container — clips overflow so only ~3 tabs visible
  pill: {
    width: 185,
    height: 46,
    backgroundColor: '#181818',
    borderRadius: 23, // half of height for full rounding
    overflow: 'hidden',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 2.5, // center the 41px tabs in the 46px pill
  },
  // Individual tab button
  tab: {
    height: 41,
    paddingHorizontal: 20,
    borderRadius: 27, // fully rounded
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Active tab — glass effect with gradient border (brighter top, dimmer bottom)
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    // Gradient border: light hits from above, so top is bright, bottom is dim
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    borderLeftColor: 'rgba(255, 255, 255, 0.20)',
    borderRightColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden', // clips the shine overlay inside
  },
  // Web-only: subtle shadow for glass depth
  tabActiveWeb: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
  } as any,
  // Shine overlay — lighter band at the top half for glass reflection
  tabShine: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  // Tab label text
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  // Active tab text is yellow
  tabTextActive: {
    color: '#FFE845',
  },
});
