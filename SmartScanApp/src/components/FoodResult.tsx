import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import IOSStatusBar from './iOSStatusBar';

// Full "Lunch" result screen for food photo / auto scan (Step 3).
// Shows detected food items with scores, serving sizes,
// "Add new food" option, and a "Track Recipe" button.
// Matches the Figma "auto_results" screen.
// Used for both Auto and Food modes.

type Props = {
  onClose: () => void; // called when X button is tapped
};

// Detected food items from Figma design
const foodItems = [
  { name: 'Wegmans Travels of India Chicken Curry', serving: '1 package(s)', score: 2 },
  { name: 'Cooked white rice', serving: '1 cup(s)', score: 2 },
  { name: 'Sugar snap peas', serving: '¾ cup(s)', score: 2 },
  { name: 'Sauteed vegetables', serving: '1⅛ cup(s)', score: 2 },
];

export default function FoodResult({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* iOS status bar */}
      <IOSStatusBar />

      {/* Header bar: close button, title, track link */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lunch</Text>
        <TouchableOpacity style={styles.trackLink}>
          <Text style={styles.trackLinkText}>Track</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions text */}
        <Text style={styles.instructions}>
          Check your ingredients and serving sizes to make sure everything's
          correct. Tap a food item to make changes, or tap the checkmark to
          remove an item.
        </Text>

        {/* Section label */}
        <Text style={styles.sectionLabel}>Food photo</Text>

        {/* Food item rows */}
        {foodItems.map((item) => (
          <TouchableOpacity key={item.name} style={styles.foodItemRow}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
            <View style={styles.foodItemInfo}>
              <Text style={styles.foodItemName}>{item.name}</Text>
              <Text style={styles.foodItemServing}>{item.serving}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Missing item prompt */}
        <Text style={styles.missingText}>Missing an item from your plate?</Text>

        {/* Add new food button (outlined) */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add new food</Text>
        </TouchableOpacity>

        {/* Track Recipe button (filled blue) */}
        <TouchableOpacity style={styles.trackButton}>
          <Text style={styles.trackButtonText}>Track Recipe</Text>
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
  trackLink: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackLinkText: {
    fontSize: 14,
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

  // === INSTRUCTIONS ===
  instructions: {
    fontSize: 14,
    color: '#3b3b3b',
    lineHeight: 20,
    paddingTop: 16,
    marginBottom: 20,
  },

  // === SECTION LABEL ===
  sectionLabel: {
    fontSize: 13,
    color: '#3b3b3b',
    marginBottom: 12,
  },

  // === FOOD ITEM ROWS ===
  foodItemRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 14,
  },
  scoreCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b3b3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  foodItemInfo: {
    flex: 1,
    gap: 2,
  },
  foodItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3b3b3b',
  },
  foodItemServing: {
    fontSize: 12,
    color: '#3b3b3b',
  },

  // === MISSING ITEM + ADD BUTTON ===
  missingText: {
    fontSize: 14,
    color: '#3b3b3b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  addButton: {
    borderWidth: 2,
    borderColor: '#477bff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b6bfb',
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
