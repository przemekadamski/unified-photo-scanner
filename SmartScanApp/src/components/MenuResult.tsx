import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import IOSStatusBar from './iOSStatusBar';

// Full "Menu Result" screen (Step 3 of menu flow).
// Shows scanned menu with restaurant name, item count,
// sort option, and scrollable list of menu items with scores.
// Matches the Figma "menu_results" screen.

type Props = {
  onClose: () => void; // called when X button is tapped
};

// Menu item data from Figma design
const menuItems = [
  { name: 'Garden Salad', description: 'Mixed greens, tomatoes, vinaigrette', score: 2 },
  { name: 'Grilled Chicken Salad', description: 'Chicken breast, romaine, light dressing', score: 3 },
  { name: 'Minestrone Soup', description: 'Vegetables, beans, pasta in broth', score: 4 },
  { name: 'Margherita Pizza', description: 'Tomato sauce, mozzarella, basil', score: 7 },
  { name: 'Chicken Parmesan', description: 'Breaded chicken, marinara, mozzarella', score: 9 },
  { name: 'Spaghetti Bolognese', description: 'Beef ragu, spaghetti, parmesan', score: 11 },
  { name: 'Fettuccine Alfredo', description: 'Cream sauce, parmesan, fettuccine', score: 14 },
  { name: 'Deep Dish Pizza', description: 'Sausage, peppers, thick crust', score: 18 },
];

export default function MenuResult({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* iOS status bar */}
      <IOSStatusBar />

      {/* Header bar: close button, title, empty right spacer */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Result</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant name + meta */}
        <View style={styles.restaurantRow}>
          <Text style={styles.restaurantName}>Tony's Italian Kitchen</Text>
          <Text style={styles.restaurantMeta}>🍕 Scanned menu</Text>
        </View>

        {/* Items header: count + sort */}
        <View style={styles.itemsHeader}>
          <Text style={styles.itemsCount}>12 items found</Text>
          <TouchableOpacity>
            <Text style={styles.sortLink}>↕ Sort by points</Text>
          </TouchableOpacity>
        </View>

        {/* Menu item rows */}
        {menuItems.map((item) => (
          <TouchableOpacity key={item.name} style={styles.menuItemRow}>
            {/* Score circle */}
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{item.score}</Text>
            </View>
            {/* Name + description */}
            <View style={styles.menuItemInfo}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDesc}>{item.description}</Text>
            </View>
            {/* Chevron */}
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
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
  // Empty spacer to balance the close button
  headerSpacer: {
    width: 36,
    height: 36,
  },

  // === SCROLL VIEW ===
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // === RESTAURANT INFO ===
  restaurantRow: {
    paddingTop: 16,
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3b3b3b',
    lineHeight: 29,
  },
  restaurantMeta: {
    fontSize: 13,
    color: '#8b8d9e',
    marginTop: 4,
  },

  // === ITEMS HEADER (count + sort) ===
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemsCount: {
    fontSize: 13,
    color: '#3b3b3b',
  },
  sortLink: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b6bfb',
  },

  // === MENU ITEM ROWS ===
  menuItemRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 62,
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
  menuItemInfo: {
    flex: 1,
    gap: 2,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3b3b3b',
  },
  menuItemDesc: {
    fontSize: 12,
    color: '#3b3b3b',
  },
  chevron: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5a5c6f',
  },
});
