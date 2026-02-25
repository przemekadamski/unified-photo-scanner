import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import HomeIndicator from './HomeIndicator';

// Bottom drawer/sheet that slides up/down when entering/leaving Barcode mode
// Matches smart-scan.html: sheet-slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1)

type Props = {
  visible: boolean;
};

// Sheet height (content + home indicator)
const SHEET_HEIGHT = 200;

export default function SearchSheet({ visible }: Props) {
  // Animated value: 0 = hidden (off-screen below), 1 = fully visible
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 400,
      useNativeDriver: false,
      // iOS spring curve matching smart-scan.html: cubic-bezier(0.32, 0.72, 0, 1)
    }).start();
  }, [visible, slideAnim]);

  // Translate from 100% (off-screen) to 0 (in place)
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_HEIGHT, 0],
  });

  return (
    <Animated.View
      style={[
        styles.sheet,
        { transform: [{ translateY }] },
      ]}
    >
      {/* Small drag handle at the top */}
      <View style={styles.handle} />

      {/* Prompt text with "Search manually" link */}
      <Text style={styles.prompt}>
        Can't find the item?{' '}
        <Text style={styles.promptLink}>Search manually</Text>
      </Text>

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

        {/* Cursor line (thin vertical bar like a text input cursor) */}
        <View style={styles.cursorLine} />

        {/* Placeholder text */}
        <Text style={styles.searchText}>Enter barcode number</Text>
      </View>

      {/* Home indicator — dark pill on white sheet */}
      <HomeIndicator color="dark" />
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
  // Small grey pill at the top of the sheet
  handle: {
    position: 'absolute',
    top: 6,
    width: 55,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CECECE',
  },
  // "Can't find the item? Search manually"
  prompt: {
    fontSize: 14,
    color: '#08070c',
    textAlign: 'center',
    lineHeight: 24,
  },
  promptLink: {
    color: '#031AA1',  // Blue link color from Figma
    fontWeight: '500',
  },
  // The search input bar
  searchBar: {
    width: 358,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1D1E4',
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
  // Thin vertical blue cursor line
  cursorLine: {
    width: 1,
    height: 20,
    backgroundColor: '#181386',
    borderRadius: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: '#5A577D',
    letterSpacing: -0.31,
    lineHeight: 24,
  },
});
