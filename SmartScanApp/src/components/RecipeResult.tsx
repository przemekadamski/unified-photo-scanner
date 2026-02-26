import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import IOSStatusBar from './iOSStatusBar';

// Full "Recipe Result" screen (Step 3 of recipe flow).
// Shows scanned recipe with name, score, prep/cook times, serves,
// ingredients list, and Track/Save buttons.
// Matches the Figma "recipe_results" screen.

type Props = {
  onClose: () => void; // called when ✕ button is tapped
};

// Ingredient data from Figma design
const ingredients = [
  { name: 'Chicken breast', detail: '2 cups, diced', score: 2 },
  { name: 'Carrots', detail: '3 medium, sliced', score: 0 },
  { name: 'Egg noodles', detail: '200g', score: 3 },
  { name: 'Celery', detail: '2 stalks, chopped', score: 0 },
  { name: 'Butter', detail: '1 tbsp', score: 2 },
  { name: 'Onion', detail: '1 medium, diced', score: 0 },
];

export default function RecipeResult({ onClose }: Props) {
  return (
    <View style={styles.container}>
      {/* iOS status bar */}
      <IOSStatusBar />

      {/* Header bar: close button, title, save */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recipe Result</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notice banner */}
        <View style={styles.noticeBanner}>
          <Text style={styles.noticeText}>
            📷 Scanned from photo — check ingredients to make sure everything looks right.
          </Text>
        </View>

        {/* Recipe name + score */}
        <View style={styles.productRow}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>Zucchini Pizza</Text>
            <Text style={styles.productMeta}>📖 Scanned recipe • 6 servings</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreText}>4</Text>
          </View>
        </View>

        {/* Recipe details section */}
        <Text style={styles.sectionTitle}>Recipe details</Text>

        {/* Prep time */}
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Prep time</Text>
          <Text style={styles.detailValue}>45 min</Text>
        </View>

        {/* Cook time */}
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Cook time</Text>
          <Text style={styles.detailValue}>45 min</Text>
        </View>

        {/* Serves */}
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Serves</Text>
          <Text style={styles.detailValue}>6</Text>
        </View>

        {/* Ingredients section */}
        <View style={styles.ingredientsHeader}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <Text style={styles.addLink}>Add</Text>
        </View>

        {/* Ingredient rows */}
        {ingredients.map((item) => (
          <View key={item.name} style={styles.ingredientRow}>
            <View style={styles.ingredientScore}>
              <Text style={styles.ingredientScoreText}>{item.score}</Text>
            </View>
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{item.name}</Text>
              <Text style={styles.ingredientDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}

        {/* Track Recipe button */}
        <TouchableOpacity style={styles.trackButton}>
          <Text style={styles.trackButtonText}>Track Recipe</Text>
        </TouchableOpacity>

        {/* Save to My Recipes link */}
        <TouchableOpacity style={styles.saveRecipeButton}>
          <Text style={styles.saveRecipeText}>Save to My Recipes</Text>
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
  saveButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 14,
    color: '#3b3b3b',
  },

  // === SCROLL VIEW ===
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // === NOTICE BANNER ===
  noticeBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 13,
    color: '#8b8d9e',
    lineHeight: 19.5,
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
  detailBox: {
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
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },

  // === INGREDIENTS ===
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  addLink: {
    fontSize: 14,
    color: '#3b3b3b',
  },
  ingredientRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 58.5,
    marginBottom: 8,
    gap: 12,
  },
  ingredientScore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b3b3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientScoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 15,
    color: '#3b3b3b',
  },
  ingredientDetail: {
    fontSize: 13,
    color: '#8b8d9e',
    marginTop: 2,
  },

  // === BUTTONS ===
  trackButton: {
    backgroundColor: '#4b6bfb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  saveRecipeButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveRecipeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b6bfb',
  },
});
