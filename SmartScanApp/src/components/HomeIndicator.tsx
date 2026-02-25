import React from 'react';
import { View, StyleSheet } from 'react-native';

// iOS home indicator bar — the thin horizontal pill at the bottom of the screen
// Color adapts based on background: black on light, white on dark

type Props = {
  color?: 'dark' | 'light';
};

export default function HomeIndicator({ color = 'dark' }: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.pill,
          color === 'light' ? styles.pillLight : styles.pillDark,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  pill: {
    width: 134,
    height: 5,
    borderRadius: 100,
  },
  pillDark: {
    backgroundColor: '#000000',
  },
  pillLight: {
    backgroundColor: '#ffffff',
  },
});
