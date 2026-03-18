import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import HalfSheet from './HalfSheet';
import MealTimeTabs from './MealTimeTabs';

// ════════════════════════════════════════════════════════
// MealPicker — "Choose a meal time" half-sheet.
//
// Uses the reusable MealTimeTabs component for meal selection,
// a date selection row, and an "Update" confirmation button.
//
// Figma node: 2345:14413
// Layout: Content (gap:24) → Form (gap:16) + Button
// ════════════════════════════════════════════════════════

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpdate: (meal: string) => void; // e.g. "Breakfast"
};

export default function MealPicker({ visible, onClose, onUpdate }: Props) {
  const [selectedMeal, setSelectedMeal] = useState<string>('Breakfast');

  const handleUpdate = () => {
    onUpdate(selectedMeal);
  };

  return (
    <HalfSheet visible={visible} title="Choose a meal time" onClose={onClose}>
      {/* Content wrapper — Figma: gap:24 between form group and button */}
      <View style={styles.content}>
        {/* Form group — Figma: gap:16 between tab bar and date row */}
        <View style={styles.form}>
          {/* Reusable meal time tab control */}
          <MealTimeTabs
            selectedMeal={selectedMeal}
            onSelectMeal={setSelectedMeal}
          />

          {/* Date selection row */}
          {/* Figma: border:#d1d1e4, rounded:16, px:16, py:18 */}
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Date</Text>
            <Text style={styles.dateValue}>Today, Mar 18</Text>
          </View>
        </View>

        {/* "Update" button — Figma: w:358, h:48, bg:#0222d0, rounded:999 */}
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

const styles = StyleSheet.create({
  // Content wrapper — gap:24 between form and button
  content: {
    gap: 24,                           // Figma: Content gap
    alignItems: 'center',
  },
  // Form group — gap:16 between tab bar and date row
  form: {
    gap: 16,                           // Figma: Form gap
    alignItems: 'center',
  },

  // ── Date selection row ──
  // Figma: border:#d1d1e4, rounded:16, px:16, py:18, w:358
  dateRow: {
    width: 358,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 16,                  // Figma: spacing_small
    borderWidth: 1,
    borderColor: '#d1d1e4',            // Figma: border/foundation/border
    backgroundColor: '#ffffff',
  },
  // Figma: 16px, Regular, #08070c, tracking:-0.31, lineHeight:24
  dateLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#08070c',
    letterSpacing: -0.31,
    lineHeight: 24,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#08070c',
    letterSpacing: -0.31,
    lineHeight: 24,
  },

  // ── "Update" button ──
  // Figma: w:358, h:48, bg:#0222d0, rounded:999
  updateButton: {
    width: 358,
    height: 48,
    backgroundColor: '#0222d0',        // Figma: container/brand_flat
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Figma: Geist SemiBold 18px, #fef9f0
  updateButtonText: {
    fontFamily: Platform.OS === 'web' ? 'Geist, system-ui, sans-serif' : undefined,
    fontSize: 18,
    fontWeight: '600',                 // Figma: SemiBold
    color: '#fef9f0',                  // Figma: on_surface/tint_flat
    lineHeight: 24,
    textAlign: 'center',
  },
});
