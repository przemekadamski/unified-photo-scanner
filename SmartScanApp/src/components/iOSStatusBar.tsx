import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Path, Rect } from 'react-native-svg';

// Pixel-accurate iOS 18 status bar for iPhone 16 (393pt wide frame)
// Matches Apple HIG: time left, signal+wifi+battery right, Dynamic Island center

export default function IOSStatusBar() {
  return (
    <View style={styles.container}>
      {/* Left: Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>9:41</Text>
      </View>

      {/* Center: Dynamic Island spacer (126×37pt pill) */}
      <View style={styles.dynamicIsland} />

      {/* Right: Cellular + Wi-Fi + Battery */}
      <View style={styles.iconsContainer}>
        <CellularIcon />
        <WifiIcon />
        <BatteryIcon />
      </View>
    </View>
  );
}

// 4 signal bars — iPhone 16 style (17×10.7pt)
function CellularIcon() {
  return (
    <Svg width={17} height={10.7} viewBox="0 0 17 10.7" fill="none">
      <Rect x={0} y={7.7} width={3} height={3} rx={0.5} fill="black" />
      <Rect x={4.5} y={5.2} width={3} height={5.5} rx={0.5} fill="black" />
      <Rect x={9} y={2.7} width={3} height={8} rx={0.5} fill="black" />
      <Rect x={13.5} y={0} width={3} height={10.7} rx={0.5} fill="black" />
    </Svg>
  );
}

// Wi-Fi icon — iPhone 16 style (15.3×11pt, fan shape)
function WifiIcon() {
  return (
    <Svg width={15.3} height={11} viewBox="0 0 15.3 11" fill="none">
      {/* Outer arc */}
      <Path
        d="M7.65 1.56c2.1 0 4.02.8 5.46 2.12l.94-1.06C12.25 1.02 10.04 0 7.65 0 5.26 0 3.05 1.02 1.25 2.62l.94 1.06C3.63 2.36 5.55 1.56 7.65 1.56Z"
        fill="black"
      />
      {/* Middle arc */}
      <Path
        d="M7.65 4.42c1.42 0 2.72.54 3.7 1.42l.94-1.06c-1.22-1.1-2.84-1.78-4.64-1.78s-3.42.68-4.64 1.78l.94 1.06c.98-.88 2.28-1.42 3.7-1.42Z"
        fill="black"
      />
      {/* Inner arc */}
      <Path
        d="M7.65 7.28c.74 0 1.42.28 1.94.74l.94-1.06c-.76-.68-1.78-1.1-2.88-1.1s-2.12.42-2.88 1.1l.94 1.06c.52-.46 1.2-.74 1.94-.74Z"
        fill="black"
      />
      {/* Center dot */}
      <Path
        d="M7.65 10.14c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2-1.2.54-1.2 1.2.54 1.2 1.2 1.2Z"
        fill="black"
      />
    </Svg>
  );
}

// Battery icon — iPhone 16 style (25×11.3pt)
function BatteryIcon() {
  return (
    <Svg width={25} height={11.3} viewBox="0 0 25 11.3" fill="none">
      {/* Battery body outline */}
      <Rect
        x={0.5}
        y={0.5}
        width={21}
        height={10.3}
        rx={2.17}
        stroke="black"
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      {/* Battery fill level */}
      <Rect x={1.83} y={1.83} width={18.33} height={7.63} rx={1.33} fill="black" />
      {/* Battery cap/nub */}
      <Path
        d="M23 3.73v3.83c.62-.26 1.17-1.08 1.17-1.91 0-.84-.55-1.66-1.17-1.92Z"
        fill="black"
        fillOpacity={0.4}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  // Status bar: 54pt total (safe area top + bar content)
  container: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  timeContainer: {
    flex: 1,
    paddingLeft: 27,
    alignItems: 'flex-start',
  },
  time: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.2,
  },
  // Dynamic Island: centered pill placeholder — kept narrow so time/icons spread to edges
  dynamicIsland: {
    width: 80,
    height: 10,
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 14,
    gap: 5,
  },
});
