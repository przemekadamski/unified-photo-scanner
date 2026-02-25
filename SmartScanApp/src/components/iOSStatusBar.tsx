import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path, Rect, Defs, ClipPath, G } from 'react-native-svg';

// Pixel-accurate iOS status bar matching the Figma design
// Shows: time (9:41), cellular bars, wifi icon, battery icon

export default function IOSStatusBar() {
  return (
    <View style={styles.container}>
      {/* Left: Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>9:41</Text>
      </View>

      {/* Center: Dynamic Island spacer */}
      <View style={styles.dynamicIsland} />

      {/* Right: Cellular + Wi-Fi + Battery */}
      <View style={styles.iconsContainer}>
        {/* Cellular signal bars */}
        <CellularIcon />
        {/* Wi-Fi icon */}
        <WifiIcon />
        {/* Battery icon */}
        <BatteryIcon />
      </View>
    </View>
  );
}

// 4 signal bars (ascending height, all filled = full signal)
function CellularIcon() {
  return (
    <Svg width={19} height={12} viewBox="0 0 19 12" fill="none">
      <Rect x={0.5} y={8} width={3} height={4} rx={0.5} fill="black" />
      <Rect x={5} y={5.5} width={3} height={6.5} rx={0.5} fill="black" />
      <Rect x={9.5} y={3} width={3} height={9} rx={0.5} fill="black" />
      <Rect x={14} y={0} width={3} height={12} rx={0.5} fill="black" />
    </Svg>
  );
}

// Wi-Fi icon (3 arcs + dot)
function WifiIcon() {
  return (
    <Svg width={17} height={12} viewBox="0 0 17 12" fill="none">
      <Path
        d="M8.5 2.83C10.702 2.83 12.7 3.68 14.18 5.1L15.32 3.84C13.52 2.12 11.13 1.08 8.5 1.08C5.87 1.08 3.48 2.12 1.68 3.84L2.82 5.1C4.3 3.68 6.298 2.83 8.5 2.83Z"
        fill="black"
      />
      <Path
        d="M4.58 6.86C5.66 5.84 7.04 5.25 8.5 5.25C9.96 5.25 11.34 5.84 12.42 6.86L13.56 5.6C12.16 4.28 10.38 3.5 8.5 3.5C6.62 3.5 4.84 4.28 3.44 5.6L4.58 6.86Z"
        fill="black"
      />
      <Path
        d="M6.34 8.62C6.94 8.06 7.68 7.75 8.5 7.75C9.32 7.75 10.06 8.06 10.66 8.62L11.8 7.36C10.88 6.5 9.74 6 8.5 6C7.26 6 6.12 6.5 5.2 7.36L6.34 8.62Z"
        fill="black"
      />
      <Path
        d="M8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11Z"
        fill="black"
      />
    </Svg>
  );
}

// Battery icon (outline + fill level)
function BatteryIcon() {
  return (
    <Svg width={27} height={13} viewBox="0 0 27 13" fill="none">
      {/* Battery body outline */}
      <Rect
        x={0.5}
        y={0.5}
        width={22}
        height={12}
        rx={2.5}
        stroke="black"
        strokeOpacity={0.35}
      />
      {/* Battery fill (full charge) */}
      <Rect x={2} y={2} width={19} height={9} rx={1.5} fill="black" />
      {/* Battery tip/nub on the right */}
      <Path
        d="M24 4.5V8.5C24.83 8.17 25.5 7.17 25.5 6.5C25.5 5.83 24.83 4.83 24 4.5Z"
        fill="black"
        fillOpacity={0.4}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  timeContainer: {
    flex: 1,
    paddingLeft: 24,
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0,
  },
  // Space for the Dynamic Island notch area
  dynamicIsland: {
    width: 124,
    height: 10,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
    gap: 7,
  },
});
