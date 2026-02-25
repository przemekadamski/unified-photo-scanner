import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// The 5 scan mode tabs: Barcode, Food, Auto, Recipe, Menu
// Active mode is highlighted in yellow (#FFE845), others are white

const MODES = ['Barcode', 'Food', 'Auto', 'Recipe', 'Menu'] as const;
export type ScanMode = (typeof MODES)[number];

type Props = {
  activeMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
};

export default function ModeTabs({ activeMode, onModeChange }: Props) {
  return (
    <View style={styles.container}>
      {MODES.map((mode) => (
        <TouchableOpacity
          key={mode}
          onPress={() => onModeChange(mode)}
          style={styles.tab}
        >
          <Text
            style={[
              styles.tabText,
              // Active tab gets yellow color, inactive stays white
              mode === activeMode && styles.activeTabText,
            ]}
          >
            {mode}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 34,
  },
  tab: {
    paddingVertical: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  activeTabText: {
    color: '#FFE845', // Yellow highlight from Figma
  },
});
