import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import HomeIndicator from './HomeIndicator';

// V2 search sheet — simplified version of the barcode search drawer
// Differences from V1:
//   - No drag handle
//   - No "Can't find the item?" prompt text
//   - Just search bar + home indicator
// When `scanned` is true, replaces search content with the scanned product card.

type Props = {
  visible: boolean;
  scanned?: boolean; // true = show product result instead of search
  onProductTap?: () => void; // called when the scanned product card is tapped
};

// Sheet heights — 130px for search bar, 200px when showing product card
const SHEET_HEIGHT = 130;
const SHEET_HEIGHT_SCANNED = 165;

export default function SearchSheetV2({ visible, scanned = false, onProductTap }: Props) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [visible, slideAnim]);

  // Use taller height when showing product card
  const currentHeight = scanned ? SHEET_HEIGHT_SCANNED : SHEET_HEIGHT;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_HEIGHT_SCANNED, 0], // Always slide from max height
  });

  return (
    <Animated.View
      style={[
        styles.sheet,
        { height: currentHeight, transform: [{ translateY }] },
      ]}
    >
      {scanned ? (
        <>
          {/* Results label */}
          <Text style={styles.resultsLabel}>RESULT(S)</Text>

          {/* Scanned product result card — tap to see full result */}
          <TouchableOpacity style={styles.productCard} onPress={onProductTap} activeOpacity={0.8}>
            <View style={styles.productScore}>
              <Text style={styles.productScoreText}>8</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                Chocolove Dark Chocolate, Ginger Crystallized
              </Text>
              <Text style={styles.productServing}>⅓ bar(s)</Text>
            </View>
            <View style={styles.productAdd}>
              <Text style={styles.productAddText}>+</Text>
            </View>
          </TouchableOpacity>

          {/* Home indicator — dark pill on white sheet */}
          <HomeIndicator color="dark" />
        </>
      ) : (
        <>
          {/* Search input bar */}
          <View style={styles.searchBar}>
            {/* Search icon (magnifying glass) */}
            <View style={styles.searchIcon}>
              <Svg width={18} height={18} viewBox="0 0 17.5068 17.5068" fill="none">
                <Path
                  d="M7.81152 0C12.1258 0 15.6238 3.4973 15.624 7.81152C15.624 9.69866 14.9539 11.4289 13.8398 12.7793L17.2871 16.2256C17.58 16.5185 17.58 16.9942 17.2871 17.2871C16.9942 17.58 16.5185 17.58 16.2256 17.2871L12.7793 13.8398C11.4289 14.9539 9.69866 15.624 7.81152 15.624C3.4973 15.6238 0 12.1258 0 7.81152C0.000225735 3.49744 3.49744 0.000225731 7.81152 0ZM7.81152 1.5C4.32587 1.50023 1.50023 4.32587 1.5 7.81152C1.5 11.2974 4.32573 14.1238 7.81152 14.124C11.2975 14.124 14.124 11.2975 14.124 7.81152C14.1238 4.32573 11.2974 1.5 7.81152 1.5Z"
                  fill="#031373"
                />
              </Svg>
            </View>

            {/* Placeholder text */}
            <Text style={styles.searchText}>Enter barcode number</Text>
          </View>

          {/* Home indicator — dark pill on white sheet */}
          <HomeIndicator color="dark" />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  // Search input bar — subtle border + soft shadow
  searchBar: {
    width: 358,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E4E4EE',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#5A577D',
    letterSpacing: -0.31,
    lineHeight: 24,
  },

  // === SCANNED STATE ===
  resultsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8b8d9e',
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
  productCard: {
    width: '100%',
    backgroundColor: '#dfe6f6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  productScore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a2151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productScoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2151',
  },
  productServing: {
    fontSize: 13,
    color: '#8b8d9e',
  },
  productAdd: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c5d0ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productAddText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#1a2151',
    marginTop: -2,
  },
});
