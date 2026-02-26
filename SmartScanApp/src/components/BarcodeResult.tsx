import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import IOSStatusBar from './iOSStatusBar';

// Full "Track food" result screen for barcode scan (Step 3).
// Shows product name, score, serving selector, nutritional insights,
// full nutrition table, and a blue "Track" button.
// Matches the Figma "barcode_results" screen.

type Props = {
  onClose: () => void; // called when ✕ button is tapped
};

// Nutrition table row data
const nutritionRows = [
  { label: 'Calories', value: '250 cal', indent: false },
  { label: 'Protein', value: '14 g', indent: false },
  { label: 'Fat', value: '15 g', indent: false },
  { label: 'Saturated fat', value: '3 g', indent: true },
  { label: 'Carbohydrates', value: '15 g', indent: false },
  { label: 'Fiber', value: '1 g', indent: true },
  { label: 'Total sugar', value: '0 g', indent: true },
  { label: 'Added sugar', value: '0 g', indent: true },
  { label: 'Weight', value: '97 g', indent: false },
];

export default function BarcodeResult({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* iOS status bar */}
      <IOSStatusBar />

      {/* Header bar: close button, title, bookmark */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track food</Text>
        <View style={styles.bookmarkButton}>
          <Text style={styles.bookmarkText}>☆</Text>
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product name + score */}
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Grandma's Chicken Soup</Text>
            <Text style={styles.productMeta}>📖 Barcode • 1 servings</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>4</Text>
          </View>
        </View>

        {/* Recipe details section */}
        <Text style={styles.sectionTitle}>Recipe details</Text>

        {/* Serving selector */}
        <View style={styles.servingBox}>
          <Text style={styles.servingLabel}>Serving</Text>
          <Text style={styles.servingValue}>2 servings</Text>
        </View>

        {/* Nutritional insights card */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Nutritional insights</Text>
          <View style={styles.insightBadge}>
            <Text style={styles.insightBadgeText}>🥦 Higher source of fiber</Text>
          </View>
        </View>

        {/* Nutritional information table */}
        <View style={styles.nutritionCard}>
          <Text style={styles.nutritionTitle}>Nutritional information</Text>
          <View style={styles.nutritionDivider} />

          {nutritionRows.map((row, index) => (
            <View key={row.label}>
              <View style={[styles.nutritionRow, row.indent && styles.nutritionRowIndent]}>
                <Text style={[
                  styles.nutritionLabel,
                  row.indent ? styles.nutritionLabelSub : styles.nutritionLabelMain,
                ]}>
                  {row.label}
                </Text>
                <Text style={styles.nutritionValue}>{row.value}</Text>
              </View>
              {/* Divider between rows (not after last) */}
              {index < nutritionRows.length - 1 && (
                <View style={[
                  styles.nutritionDivider,
                  // Sub-items have indented dividers
                  (row.indent || nutritionRows[index + 1]?.indent) && styles.nutritionDividerIndent,
                ]} />
              )}
            </View>
          ))}
        </View>

        {/* Track button */}
        <TouchableOpacity style={styles.trackButton}>
          <Text style={styles.trackButtonText}>Track</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#3b3b3b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b3b3b',
    textAlign: 'center',
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkText: {
    fontSize: 20,
    color: '#3b3b3b',
  },

  // === SCROLL VIEW ===
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 21,
    paddingBottom: 40,
  },

  // === PRODUCT ROW ===
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginBottom: 20,
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3b3b3b',
    lineHeight: 29,
  },
  productMeta: {
    fontSize: 13,
    color: '#8b8d9e',
    marginTop: 4,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b3b3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },

  // === RECIPE DETAILS ===
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  servingBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#3b3b3b',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    height: 59,
    marginBottom: 12,
  },
  servingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#08070c',
  },
  servingValue: {
    fontSize: 16,
    color: '#08070c',
  },

  // === NUTRITIONAL INSIGHTS ===
  insightsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#08070c',
    marginBottom: 8,
  },
  insightBadge: {
    backgroundColor: '#e1f1b2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  insightBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#172e00',
  },

  // === NUTRITIONAL INFORMATION TABLE ===
  nutritionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 16,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#08070c',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingVertical: 4,
  },
  nutritionRowIndent: {
    paddingLeft: 24,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#08070c',
    flex: 1,
  },
  nutritionLabelMain: {
    fontWeight: '500',
  },
  nutritionLabelSub: {
    fontWeight: '400',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#08070c',
  },
  nutritionDivider: {
    height: 0.5,
    backgroundColor: '#d1d1e4',
  },
  nutritionDividerIndent: {
    marginLeft: 24,
  },

  // === TRACK BUTTON ===
  trackButton: {
    backgroundColor: '#4b6bfb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
