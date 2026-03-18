import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import HalfSheet from './HalfSheet';

// ════════════════════════════════════════════════════════
// ServingPicker — "Choose a serving size" half-sheet.
//
// Simulates an iOS 3-column picker wheel with barrel effect.
// Columns: quantity (whole number), fraction, and unit.
// Tapping a row selects it. "Update" confirms the selection.
//
// Figma node: 2339:13449
// ════════════════════════════════════════════════════════

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpdate: (serving: string) => void; // e.g. "3 oz"
};

// ── Picker data: each column's values ──
const quantities = ['1', '2', '3', '4', '5', '6', '7', '8'];
const fractions = [' ', '0', '¼', '⅓', '½', '⅔', '¾', '⅛'];
const units = ['cup(s)', 'oz', 'gm', 'Tbsp', 'tsp', 'ml', 'piece(s)', 'serving(s)'];

// How many rows visible above and below the selected row
const VISIBLE_ABOVE = 1;
const VISIBLE_BELOW = 2;

// Row height — matches the selection bar height from Figma
const ROW_HEIGHT = 42;

export default function ServingPicker({ visible, onClose, onUpdate }: Props) {
  // Track the selected index for each column
  const [qtyIdx, setQtyIdx] = useState(2);   // default "3"
  const [fracIdx, setFracIdx] = useState(1);  // default "0"
  const [unitIdx, setUnitIdx] = useState(1);  // default "oz"

  // Build display string from current selection
  const buildLabel = () => {
    const qty = quantities[qtyIdx];
    const frac = fractions[fracIdx].trim();
    const unit = units[unitIdx];
    if (frac && frac !== '0') {
      return `${qty} ${frac} ${unit}`;
    }
    return `${qty} ${unit}`;
  };

  const handleUpdate = () => {
    onUpdate(buildLabel());
  };

  return (
    <HalfSheet visible={visible} title="Choose a serving size" onClose={onClose}>
      <View style={styles.container}>
        {/* iOS-style 3-column picker wheel */}
        <View style={styles.pickerContainer}>
          {/* Three separate selection bars — one per column (Figma: 3 bars, bg:#e8eaef) */}
          <View style={styles.selectionBar1} />
          <View style={styles.selectionBar2} />
          <View style={styles.selectionBar3} />

          {/* Three columns — absolutely positioned to match Figma (top:13, h:170) */}
          <View style={[styles.columnAbsolute, { left: 75.5 }]}>
            <PickerColumn
              values={quantities}
              selectedIndex={qtyIdx}
              onSelect={setQtyIdx}
              width={68}
            />
          </View>
          <View style={[styles.columnAbsolute, { left: 145.5 }]}>
            <PickerColumn
              values={fractions}
              selectedIndex={fracIdx}
              onSelect={setFracIdx}
              width={68}
            />
          </View>
          <View style={[styles.columnAbsolute, { left: 223.5 }]}>
            <PickerColumn
              values={units}
              selectedIndex={unitIdx}
              onSelect={setUnitIdx}
              width={110}
            />
          </View>
        </View>

        {/* "Update" button — full-width, primary blue */}
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          activeOpacity={0.85}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </HalfSheet>
  );
}

// ════════════════════════════════════════════════════════
// PickerColumn — single column of the iOS barrel picker.
//
// Shows 1 row above selected, the selected row, and 2 below.
// Each row further from center gets smaller + more transparent
// with the iOS barrel perspective (skewX + scaleY).
//
// Figma row styles:
//   Selected:  18px, #08070c, full opacity, no transform
//   ±1 offset: 16px, #525163, opacity 0.75-1, skewX(-7°), scaleY(0.99)
//   ±2 offset: 14px, #525163, opacity 0.75, skewX(-13°), scaleY(0.97)
//   ±3 offset: 12px, #525163, opacity 0.50, skewX(-21°), scaleY(0.93)
// ════════════════════════════════════════════════════════

function PickerColumn({
  values,
  selectedIndex,
  onSelect,
  width,
}: {
  values: string[];
  selectedIndex: number;
  onSelect: (idx: number) => void;
  width: number;
}) {
  // Build visible rows (window around selected index)
  const rows: { value: string; index: number; offset: number }[] = [];
  for (let offset = -VISIBLE_ABOVE; offset <= VISIBLE_BELOW; offset++) {
    const idx = selectedIndex + offset;
    if (idx >= 0 && idx < values.length) {
      rows.push({ value: values[idx], index: idx, offset });
    } else {
      rows.push({ value: '', index: -1, offset });
    }
  }

  return (
    <View style={[styles.column, { width }]}>
      {rows.map((row, i) => {
        const absOffset = Math.abs(row.offset);
        const isSelected = row.offset === 0;

        // Figma barrel effect values (from the design spec)
        const fontSize = isSelected ? 18 : absOffset === 1 ? 14 : 12;
        const opacity = isSelected ? 1 : absOffset === 1 ? 0.75 : 0.5;
        const skewDeg = isSelected ? 0 : row.offset > 0
          ? (absOffset === 1 ? -12.93 : -21.32)
          : (absOffset === 1 ? -7.19 : -7.19);
        const scaleY = isSelected ? 1 : absOffset === 1 ? 0.97 : 0.93;

        // Web-only CSS transform for barrel perspective
        const webTransform = Platform.OS === 'web'
          ? { transform: `scaleY(${scaleY}) skewX(${skewDeg}deg)` as any }
          : {};

        return (
          <TouchableOpacity
            key={`${row.offset}-${i}`}
            style={styles.pickerRow}
            onPress={() => row.index >= 0 && onSelect(row.index)}
            activeOpacity={0.6}
            disabled={row.index < 0}
          >
            <Text
              style={[
                styles.pickerText,
                {
                  fontSize,
                  opacity,
                  color: isSelected ? '#08070c' : '#525163',
                  letterSpacing: isSelected ? 0.35 : -0.41,
                  fontWeight: isSelected ? '400' : '400',
                },
                webTransform,
              ]}
            >
              {row.value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,                         // Figma: gap between picker and button
    alignItems: 'center',
  },
  // iOS picker wheel container
  // Figma: w:388, h:183, rounded:13, bg:white, px:20, py:18
  pickerContainer: {
    width: 388,
    height: 183,
    backgroundColor: '#ffffff',      // Figma: container/primary
    borderRadius: 13,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Three separate selection bars — one per column (Figma: bg:#e8eaef, fully rounded)
  // Positioned absolutely to align with each column center
  // Grey selection bars — Figma: top:59px (absolute inside 183px container)
  selectionBar1: {
    position: 'absolute',
    left: 76.5,
    width: 55,
    height: 35,
    borderRadius: 47,
    backgroundColor: '#e8eaef',
    top: 59,
  },
  selectionBar2: {
    position: 'absolute',
    left: 145.5,
    width: 64,
    height: 35,
    borderRadius: 47,
    backgroundColor: '#e8eaef',
    top: 59,
  },
  selectionBar3: {
    position: 'absolute',
    left: 223.5,
    width: 87,
    height: 35,
    borderRadius: 47,
    backgroundColor: '#e8eaef',
    top: 59,
  },
  // Absolutely positioned column wrapper — Figma: top:13, height:170
  columnAbsolute: {
    position: 'absolute',
    top: 13,
    height: 170,
  },
  // Single column — fills absolute wrapper
  column: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  // Each row — fixed height, gap controlled by column flex
  pickerRow: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Text inside each picker row
  // Figma: SF Pro Display/Text, Regular weight
  pickerText: {
    fontFamily: Platform.OS === 'web' ? 'SF Pro Display, system-ui, sans-serif' : undefined,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  // "Update" button — full-width primary blue
  // Figma: w:358, h:48, bg:#0222d0, rounded:999
  updateButton: {
    width: 358,
    height: 48,
    backgroundColor: '#0222d0',      // Figma: container/brand_flat
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    fontFamily: Platform.OS === 'web' ? 'Geist, system-ui, sans-serif' : undefined,
    fontSize: 18,                    // Figma: md_1_18_16
    fontWeight: '600',               // Figma: SemiBold
    color: '#fef9f0',                // Figma: on_surface/tint_flat
    lineHeight: 24,                  // Matches MealPicker fix — proper vertical centering in 48px button
    textAlign: 'center',
  },
});
