import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Path, Rect, Circle, Line } from 'react-native-svg';

// "Search to replace" — inner content for the FoodResult sheet.
// NOT a standalone screen — rendered as a "page" inside FoodResult's sheet,
// transitioned in/out with an iOS push animation managed by FoodResult.
//
// Also exports IOSKeyboard as a separate component — FoodResult renders it
// below the sheet when search mode is active.

type Props = {
  onClose: () => void;  // called when X button is tapped — triggers reverse push
};

// ════════════════════════════════════════════════════════
// Sample search result data
// ════════════════════════════════════════════════════════
const searchResults = [
  { name: 'Cooked skinless boneless chicken breast', points: 5, proteinG: 43, vegG: 3.4 },
  { name: 'Cobb salad with grilled chicken breast and ranch dressing, restaurant type', points: 5, proteinG: 16, vegG: 0.8 },
  { name: 'TGI Fridays Buffalo chicken wings', points: 5, proteinG: 16, vegG: 0.8 },
];

// ════════════════════════════════════════════════════════
// Inline SVG icons
// ════════════════════════════════════════════════════════

function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="-6.25 -6.25 24 24" fill="none">
      <Path
        d="M10.2197 0.21967C10.5126 -0.0732233 10.9873 -0.0732233 11.2802 0.21967C11.5731 0.512563 11.5731 0.987324 11.2802 1.28022L6.81049 5.74994L11.2802 10.2197C11.5731 10.5126 11.5731 10.9873 11.2802 11.2802C10.9873 11.5731 10.5126 11.5731 10.2197 11.2802L5.74994 6.81049L1.28022 11.2802C0.987324 11.5731 0.512563 11.5731 0.21967 11.2802C-0.0732233 10.9873 -0.0732233 10.5126 0.21967 10.2197L4.6894 5.74994L0.21967 1.28022C-0.0732233 0.987324 -0.0732233 0.512563 0.21967 0.21967C0.512563 -0.0732233 0.987324 -0.0732233 1.28022 0.21967L5.74994 4.6894L10.2197 0.21967Z"
        fill="#181877"
      />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
        fill="#5A577D"
      />
    </Svg>
  );
}

function SwapIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 13.167 15.833" fill="none">
      <Path
        d="M8.88672 8.55268C9.17962 8.25994 9.65442 8.25984 9.94727 8.55268L12.9473 11.5527C13.0032 11.6087 13.0445 11.6734 13.0791 11.7402C13.0888 11.7588 13.1003 11.7764 13.1084 11.7958C13.1295 11.8468 13.1449 11.8994 13.1543 11.9531C13.1617 11.9953 13.167 12.0386 13.167 12.083C13.167 12.1279 13.1619 12.172 13.1543 12.2148C13.1449 12.2675 13.1291 12.319 13.1084 12.3691C13.0988 12.3923 13.086 12.4136 13.0742 12.4355C13.0403 12.4986 13.0005 12.56 12.9473 12.6132L9.94727 15.6132C9.65443 15.9061 9.17963 15.9059 8.88672 15.6132C8.59383 15.3203 8.59383 14.8456 8.88672 14.5527L10.6064 12.833H0.75C0.335895 12.833 0.000175875 12.497 0 12.083C0.000159282 11.6689 0.335885 11.333 0.75 11.333H10.6064L8.88672 9.61322C8.59383 9.32033 8.59383 8.84557 8.88672 8.55268ZM3.21973 0.21967C3.51262 -0.0732233 3.98738 -0.0732233 4.28027 0.21967C4.57284 0.51259 4.57306 0.987434 4.28027 1.28022L2.56055 2.99994H12.417C12.8309 3.00029 13.167 3.33595 13.167 3.74994C13.1668 4.16378 12.8308 4.49959 12.417 4.49994H2.56055L4.28027 6.21967C4.57284 6.51259 4.57306 6.98743 4.28027 7.28022C3.98749 7.57299 3.51264 7.57278 3.21973 7.28022L0.219727 4.28022C0.166661 4.22715 0.125634 4.1663 0.0917969 4.10346C0.0797988 4.08119 0.066382 4.05963 0.0566406 4.03608C0.0499744 4.01993 0.0465063 4.00275 0.0410156 3.98627C0.0161267 3.91169 3.86185e-05 3.83287 0 3.74994C0 3.66886 0.0152599 3.59164 0.0390625 3.5185C0.0445184 3.50168 0.0480125 3.48419 0.0546875 3.46772L0.0585938 3.45795C0.0661119 3.44018 0.0771192 3.42421 0.0859375 3.40717C0.120584 3.34007 0.163467 3.27593 0.219727 3.21967L3.21973 0.21967Z"
        fill="#031AA1"
      />
    </Svg>
  );
}

function ChickenLegIcon() {
  return (
    <Svg width={16} height={16} viewBox="-1.25 -1.25 16 16" fill="none">
      <Path
        d="M2.32129 0.256209C2.91331 -0.0852743 3.64246 -0.0855315 4.23438 0.256209C4.82632 0.598019 5.19125 1.22991 5.19141 1.91344V2.71617L5.94531 3.47008C6.62988 3.32135 7.37601 3.3558 8.10645 3.52965C9.49516 3.86026 10.9593 4.70491 12.2061 5.95152C13.9329 7.67837 13.9326 10.4784 12.2061 12.2054C10.4791 13.9324 7.67912 13.9324 5.95215 12.2054C4.70549 10.9586 3.86085 9.49461 3.53027 8.10582C3.35637 7.37492 3.32061 6.62861 3.46973 5.94371L2.7168 5.19078H1.91406C0.85709 5.19078 0 4.33369 0 3.27672C0.000374298 2.38895 0.605712 1.64396 1.42578 1.42808C1.55378 0.940093 1.87293 0.515066 2.32129 0.256209ZM7.75879 4.98961C7.05641 4.82244 6.46944 4.84492 6.0166 5.00523C6.00983 5.00806 6.00293 5.01043 5.99609 5.01304C5.75454 5.10161 5.5515 5.22924 5.39062 5.39C5.22918 5.55144 5.10038 5.75564 5.01172 5.9984C5.0096 6.00387 5.00811 6.00956 5.00586 6.015C4.845 6.46801 4.82294 7.055 4.99023 7.75816C5.24669 8.83569 5.93001 10.062 7.0127 11.1449C8.15388 12.2861 10.0043 12.2861 11.1455 11.1449C12.2863 10.0037 12.2866 8.15313 11.1455 7.01207C10.0627 5.92944 8.83625 5.24611 7.75879 4.98961ZM3.48438 1.55504C3.35661 1.48132 3.19916 1.48157 3.07129 1.55504C2.94338 1.62888 2.86442 1.76576 2.86426 1.91344V2.11363C2.86407 2.52743 2.528 2.86322 2.11426 2.86363H1.91406C1.68579 2.86363 1.50045 3.04855 1.5 3.27672C1.5 3.50526 1.68552 3.69078 1.91406 3.69078H3.02734C3.22601 3.69089 3.41708 3.77009 3.55762 3.91051L4.16016 4.51304C4.21357 4.45025 4.27063 4.3889 4.33008 4.32945C4.38967 4.26988 4.45072 4.21304 4.51367 4.15953L3.91113 3.55699C3.77062 3.41636 3.69141 3.22552 3.69141 3.02672V1.91344C3.69125 1.76581 3.61222 1.6289 3.48438 1.55504Z"
        fill="#773CD9"
      />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={16} height={16} viewBox="-1.75 -0.75 15.667 15.667" fill="none">
      <Path
        d="M9.58398 0C9.99779 0.00035158 10.3338 0.336153 10.334 0.75V1.97656C10.334 2.59726 10.1326 3.17081 9.79492 3.63965C10.3626 3.88198 10.8411 4.26248 11.2158 4.76074C11.878 5.64139 12.167 6.81919 12.167 8.08398C12.1668 11.4447 9.44378 14.167 6.08301 14.167C2.72239 14.1668 0.000175963 11.4446 0 8.08398C0 6.81929 0.288111 5.64137 0.950195 4.76074C1.63381 3.85175 2.6625 3.33398 3.9502 3.33398L4.01953 3.33691C4.50765 3.38212 4.99284 3.44913 5.47363 3.53613C5.3839 3.16311 5.06671 2.87847 4.67676 2.83887L4.58301 2.83398H4.25C3.83589 2.83398 3.50018 2.49805 3.5 2.08398C3.5 1.66977 3.83579 1.33398 4.25 1.33398H4.58301L4.83008 1.34668C5.17164 1.38136 5.49086 1.48937 5.77539 1.65137C5.91411 1.35319 6.10254 1.07717 6.33984 0.839844C6.87139 0.308426 7.60119 0.000106028 8.35645 0H9.58398ZM8.24414 4.83398C7.57705 4.89149 6.91041 5.00432 6.25 5.15527C6.14019 5.18029 6.02581 5.18036 5.91602 5.15527C5.25999 5.00533 4.59098 4.89804 3.91504 4.83398C3.08863 4.84267 2.52716 5.15989 2.14941 5.66211C1.74515 6.19978 1.5 7.02235 1.5 8.08398C1.50018 10.6162 3.55081 12.6668 6.08301 12.667C8.61535 12.667 10.6668 10.6163 10.667 8.08398C10.667 7.02239 10.4218 6.19978 10.0176 5.66211C9.63869 5.15831 9.07471 4.84083 8.24414 4.83398ZM8.35645 1.5C8.00553 1.50011 7.65528 1.64563 7.40039 1.90039C7.14898 2.15185 7.00698 2.49405 7.00684 2.85645V3.33301H7.47656C8.22739 3.33292 8.83398 2.72384 8.83398 1.97656V1.5H8.35645Z"
        fill="#067C59"
      />
    </Svg>
  );
}

// ════════════════════════════════════════════════════════
// Simplified search result card — 2 rows: name + nutrition, swap on right
// ════════════════════════════════════════════════════════
function SearchResultCard({ item }: { item: typeof searchResults[0] }) {
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultCardContent}>
        <Text style={styles.resultName}>{item.name}</Text>
        <View style={styles.resultNutritionRow}>
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>{item.points}</Text>
          </View>
          <View style={styles.proteinTag}>
            <ChickenLegIcon />
            <Text style={styles.tagGrams}>{item.proteinG} g</Text>
          </View>
          <View style={styles.vegTag}>
            <AppleIcon />
            <Text style={styles.tagGrams}>{item.vegG} g</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.swapButton}>
        <SwapIcon />
      </TouchableOpacity>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// FoodSearchContent — the inner content rendered inside FoodResult's sheet
// ════════════════════════════════════════════════════════
export default function FoodSearchContent({ onClose }: Props) {
  return (
    <View style={styles.content}>
      {/* Header: left spacer + "Search to replace" + close X */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeftSpacer} />
        <Text style={styles.headerTitle}>Search to replace</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Search bar — Figma: white bg, border #d1d1e4, r:999, h:56 */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <SearchIcon />
          <Text style={styles.searchPlaceholder}>|</Text>
        </View>
      </View>

      {/* Scrollable results list */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>similar results</Text>
        <View style={styles.cardsContainer}>
          {searchResults.map((item) => (
            <SearchResultCard key={item.name} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// Static iOS keyboard — exported separately so FoodResult
// can render it below the sheet (not inside it)
// ════════════════════════════════════════════════════════
export function IOSKeyboard() {
  const row1 = ['Q','W','E','R','T','Y','U','I','O','P'];
  const row2 = ['A','S','D','F','G','H','J','K','L'];
  const row3 = ['Z','X','C','V','B','N','M'];

  return (
    <View style={styles.keyboard}>
      {/* Autocorrect bar */}
      <View style={styles.autocorrectBar}>
        <View style={styles.autocorrectItem}>
          <Text style={styles.autocorrectText}>"The"</Text>
        </View>
        <View style={styles.autocorrectDivider} />
        <View style={styles.autocorrectItem}>
          <Text style={styles.autocorrectTextBold}>"the"</Text>
        </View>
        <View style={styles.autocorrectDivider} />
        <View style={styles.autocorrectItem}>
          <Text style={styles.autocorrectText}>"to"</Text>
        </View>
      </View>

      {/* Row 1: Q-P */}
      <View style={styles.keyRow}>
        {row1.map((key) => (
          <View key={key} style={styles.keyWhite}>
            <Text style={styles.keyText}>{key}</Text>
          </View>
        ))}
      </View>

      {/* Row 2: A-L */}
      <View style={[styles.keyRow, { paddingHorizontal: 14 }]}>
        {row2.map((key) => (
          <View key={key} style={styles.keyWhite}>
            <Text style={styles.keyText}>{key}</Text>
          </View>
        ))}
      </View>

      {/* Row 3: shift + Z-M + delete */}
      <View style={styles.keyRow}>
        <View style={styles.keyGray}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M12 4L3 15H8V20H16V15H21L12 4Z" fill="#08070c" />
          </Svg>
        </View>
        {row3.map((key) => (
          <View key={key} style={styles.keyWhite}>
            <Text style={styles.keyText}>{key}</Text>
          </View>
        ))}
        <View style={styles.keyGray}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M22 3H7C6.31 3 5.77 3.35 5.41 3.88L0 12L5.41 20.11C5.77 20.64 6.31 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM19 15.59L17.59 17L14 13.41L10.41 17L9 15.59L12.59 12L9 8.41L10.41 7L14 10.59L17.59 7L19 8.41L15.41 12L19 15.59Z" fill="#08070c" />
          </Svg>
        </View>
      </View>

      {/* Row 4: 123 + emoji + space + return */}
      <View style={styles.keyRow}>
        <View style={[styles.keyGray, { minWidth: 40 }]}>
          <Text style={styles.keyTextSmall}>123</Text>
        </View>
        <View style={[styles.keyGray, { minWidth: 36 }]}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#08070c" strokeWidth={2} fill="none" />
            <Circle cx={8.5} cy={10} r={1.2} fill="#08070c" />
            <Circle cx={15.5} cy={10} r={1.2} fill="#08070c" />
            <Path d="M8 14.5C8 14.5 9.5 17 12 17C14.5 17 16 14.5 16 14.5" stroke="#08070c" strokeWidth={1.5} strokeLinecap="round" fill="none" />
          </Svg>
        </View>
        <View style={styles.spaceBar}>
          <Text style={styles.keyTextSmall}>space</Text>
        </View>
        <View style={[styles.keyGray, { minWidth: 72 }]}>
          <Text style={styles.keyTextSmall}>return</Text>
        </View>
      </View>

      {/* Bottom: globe + mic icons */}
      <View style={styles.keyboardBottom}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={10} stroke="#8f8f8f" strokeWidth={1.5} fill="none" />
          <Line x1={2} y1={12} x2={22} y2={12} stroke="#8f8f8f" strokeWidth={1.5} />
          <Path d="M12 2C14.5 5 15 9 15 12C15 15 14.5 19 12 22" stroke="#8f8f8f" strokeWidth={1.5} fill="none" />
          <Path d="M12 2C9.5 5 9 9 9 12C9 15 9.5 19 12 22" stroke="#8f8f8f" strokeWidth={1.5} fill="none" />
        </Svg>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x={9} y={2} width={6} height={12} rx={3} stroke="#8f8f8f" strokeWidth={1.5} fill="none" />
          <Path d="M5 11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11" stroke="#8f8f8f" strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Line x1={12} y1={18} x2={12} y2={22} stroke="#8f8f8f" strokeWidth={1.5} />
        </Svg>
      </View>

      {/* Home indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
}

// ════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // ── Content wrapper — fills the page slot inside FoodResult's sheet ──
  content: {
    flex: 1,
  },

  // ── Header row ──
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 25.5,
    gap: 8,
  },
  headerLeftSpacer: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#181877',
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Search bar ──
  searchBarContainer: {
    paddingHorizontal: 25.5,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d1e4',
    borderRadius: 999,
    paddingHorizontal: 16,
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    fontWeight: '400',
    color: '#5a577d',
    letterSpacing: -0.31,
  },

  // ── Scrollable results area ──
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25.5,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#525163',
    letterSpacing: 0.24,
    textTransform: 'uppercase',
    lineHeight: 16,
    marginBottom: 8,
  },
  cardsContainer: {
    gap: 12,
  },

  // ── Search result card ──
  resultCard: {
    backgroundColor: '#e6efff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultCardContent: {
    flex: 1,
    gap: 4,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#031aa1',
    lineHeight: 19.2,
  },
  resultNutritionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsBadge: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#031373',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 19.2,
  },
  proteinTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f4effc',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vegTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ebf5f2',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagGrams: {
    fontSize: 12,
    fontWeight: '500',
    color: '#08070c',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  swapButton: {
    padding: 6,
    borderRadius: 999,
  },

  // ════════════════════════════════════════════════
  // iOS Keyboard styles
  // ════════════════════════════════════════════════
  keyboard: {
    flex: 1,
    backgroundColor: '#d1d3d9',
  },
  autocorrectBar: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    backgroundColor: '#c9cbcf',
    borderBottomWidth: 0.5,
    borderBottomColor: '#a9abae',
  },
  autocorrectItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autocorrectDivider: {
    width: 0.5,
    height: 24,
    backgroundColor: '#a9abae',
  },
  autocorrectText: {
    fontSize: 15,
    color: '#08070c',
  },
  autocorrectTextBold: {
    fontSize: 15,
    fontWeight: '600',
    color: '#08070c',
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  keyWhite: {
    flex: 1,
    maxWidth: 34,
    height: 42,
    backgroundColor: '#ffffff',
    borderRadius: 4.6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 1,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#08070c',
  },
  keyTextSmall: {
    fontSize: 15,
    fontWeight: '400',
    color: '#08070c',
  },
  keyGray: {
    height: 42,
    minWidth: 42,
    backgroundColor: '#adb0b8',
    borderRadius: 4.6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 1,
  },
  spaceBar: {
    flex: 1,
    height: 42,
    backgroundColor: '#ffffff',
    borderRadius: 4.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 0,
    elevation: 1,
  },
  keyboardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
    alignItems: 'center',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#08070c',
    alignSelf: 'center',
    marginBottom: 8,
  },
});
