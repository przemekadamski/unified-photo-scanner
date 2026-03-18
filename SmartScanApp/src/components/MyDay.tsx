import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';
import IOSStatusBar from './iOSStatusBar';

// MyDay Home Screen — redesigned to match Figma (node 2288:3954).
// Shows: status bar, header icons, date pills, "New for you" cards,
// blue points card with action buttons, colored macros cards, bottom tab bar.

type Props = {
  onFABTap: () => void; // called when the floating action button ("+") is tapped
};

// ── Date row data ──
// Dates 19–25 (Tue–Mon), active = index 3 (Friday the 22nd)
const DAYS = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
const DATES = [19, 20, 21, 22, 23, 24, 25];
const TODAY_INDEX = 3; // Friday the 22nd

// ── Macros data ──
// Each macro gets a unique background color — darker = further down the list.
const MACROS = [
  { name: 'Protein', value: '0g', range: '0–50g', bg: '#e6efff', textDark: true, icon: '🍗' },
  { name: 'Carbs', value: '0g', range: '0–200g', bg: '#b8d2ff', textDark: true, icon: '🍞' },
  { name: 'Fat', value: '0g', range: '0–65g', bg: '#84abff', textDark: true, icon: '🥑' },
  { name: 'Fiber', value: '0g', range: '0–25g', bg: '#477bff', textDark: false, icon: '🥦' },
  { name: 'Calories', value: '0', range: '0–1500', bg: '#2e50ff', textDark: false, icon: '🍽️' },
];

export default function MyDay({ onFABTap }: Props) {
  return (
    <View style={styles.container}>
      {/* iOS status bar */}
      <IOSStatusBar />

      {/* ── STEP 1: Header — no title, right-aligned icons only ── */}
      <View style={styles.header}>
        {/* Empty left spacer to push icons right (matches Figma 112px left space) */}
        <View style={styles.headerLeftSpacer} />

        <View style={styles.headerRight}>
          {/* Connect / people icon (Figma: "icon / connect", fill #031373) */}
          <TouchableOpacity style={styles.headerIcon}>
            <Svg width={24} height={24} viewBox="0 0 22.132 17.928" fill="none">
              <Path fillRule="evenodd" clipRule="evenodd" d="M6.72266 10.2217C10.4353 10.2218 13.4453 13.2317 13.4453 16.9443V17.1777C13.4453 17.5918 13.1094 17.9276 12.6953 17.9277C12.2811 17.9277 11.9453 17.5919 11.9453 17.1777V16.9443C11.9453 14.0601 9.60689 11.7218 6.72266 11.7217C3.83835 11.7217 1.5 14.06 1.5 16.9443V17.1777C1.49998 17.5919 1.1642 17.9277 0.75 17.9277C0.335797 17.9277 1.68145e-05 17.5919 0 17.1777V16.9443C0 13.2316 3.00993 10.2217 6.72266 10.2217ZM15.4092 10.2217C19.1278 10.2218 22.1318 13.2603 22.1318 16.9951V17.1777C22.1316 17.5916 21.7957 17.9276 21.3818 17.9277C20.9678 17.9277 20.6321 17.5917 20.6318 17.1777V16.9951C20.6318 14.0767 18.2874 11.7218 15.4092 11.7217C14.9666 11.7217 14.5377 11.7769 14.1289 11.8809C13.7277 11.9828 13.3191 11.74 13.2168 11.3389C13.1149 10.9377 13.3578 10.5301 13.7588 10.4277C14.2874 10.2933 14.8409 10.2217 15.4092 10.2217ZM7.21094 0.546875C9.50581 0.664319 11.331 2.57825 11.3311 4.92188L11.3252 5.14746C11.2087 7.46193 9.31111 9.30267 6.9873 9.30273L6.76367 9.29688C4.54283 9.18326 2.76214 7.38725 2.64941 5.14746L2.64355 4.92188C2.64366 2.50261 4.58852 0.541099 6.9873 0.541016L7.21094 0.546875ZM15.4092 0C17.9283 7.59224e-05 19.9599 2.05794 19.96 4.58301C19.9597 7.10791 17.9282 9.16594 15.4092 9.16602C14.2837 9.16602 13.2525 8.75315 12.459 8.07227C12.145 7.80267 12.1088 7.32991 12.3779 7.01562C12.6477 6.70132 13.1212 6.66485 13.4355 6.93457C13.9684 7.39179 14.6568 7.66602 15.4092 7.66602C17.0878 7.66594 18.4597 6.29153 18.46 4.58301C18.4599 2.87432 17.0879 1.50008 15.4092 1.5C14.6567 1.5 13.9684 1.77414 13.4355 2.23145C13.1213 2.50089 12.6477 2.4653 12.3779 2.15137C12.1082 1.83713 12.1449 1.36355 12.459 1.09375C13.2525 0.412742 14.2836 0 15.4092 0ZM6.9873 2.04102C5.42894 2.0411 4.14366 3.31899 4.14355 4.92188C4.14363 6.52479 5.42892 7.80265 6.9873 7.80273C8.5457 7.80267 9.83098 6.5248 9.83105 4.92188C9.83095 3.31898 8.54568 2.04108 6.9873 2.04102Z" fill="#031373" />
            </Svg>
          </TouchableOpacity>

          {/* Notifications / bell icon (Figma: bell with notification dot, fill #031373) */}
          <TouchableOpacity style={styles.headerIcon}>
            <Svg width={24} height={24} viewBox="0 0 18 21.749" fill="none">
              <Path d="M17.7927 16.4944C17.2724 15.5981 16.4989 13.0622 16.4989 9.75C16.4989 7.76088 15.7087 5.85322 14.3022 4.4467C12.8957 3.04018 10.988 2.25 8.99891 2.25C7.00979 2.25 5.10214 3.04018 3.69561 4.4467C2.28909 5.85322 1.49891 7.76088 1.49891 9.75C1.49891 13.0631 0.724538 15.5981 0.204226 16.4944C0.0713545 16.7222 0.000914339 16.9811 8.84153e-06 17.2449C-0.000896656 17.5086 0.0677647 17.768 0.199068 17.9967C0.330372 18.2255 0.519675 18.4156 0.747887 18.5478C0.976099 18.6801 1.23515 18.7498 1.49891 18.75H5.32485C5.49789 19.5967 5.95806 20.3577 6.62754 20.9042C7.29702 21.4507 8.1347 21.7492 8.99891 21.7492C9.86312 21.7492 10.7008 21.4507 11.3703 20.9042C12.0398 20.3577 12.4999 19.5967 12.673 18.75H16.4989C16.7626 18.7496 17.0215 18.6798 17.2496 18.5475C17.4777 18.4151 17.6669 18.225 17.7981 17.9963C17.9292 17.7676 17.9978 17.5083 17.9969 17.2446C17.9959 16.9809 17.9255 16.7222 17.7927 16.4944ZM8.99891 20.25C8.53375 20.2499 8.08005 20.1055 7.70029 19.8369C7.32052 19.5683 7.03335 19.1886 6.87829 18.75H11.1195C10.9645 19.1886 10.6773 19.5683 10.2975 19.8369C9.91777 20.1055 9.46408 20.2499 8.99891 20.25ZM1.49891 17.25C2.22079 16.0088 2.99891 13.1325 2.99891 9.75C2.99891 8.1587 3.63105 6.63258 4.75627 5.50736C5.88149 4.38214 7.40762 3.75 8.99891 3.75C10.5902 3.75 12.1163 4.38214 13.2416 5.50736C14.3668 6.63258 14.9989 8.1587 14.9989 9.75C14.9989 13.1297 15.7752 16.0059 16.4989 17.25H1.49891Z" fill="#031373" />
              {/* Notification dot (blue circle with light stroke) */}
              <Circle cx={13.5} cy={4.5} r={4} fill="#031373" stroke="#f4f5f9" strokeWidth={1} />
            </Svg>
          </TouchableOpacity>

          {/* Settings / gear icon (Figma: detailed gear, fill #031373) */}
          <TouchableOpacity style={styles.headerIcon}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M11.9976 7.4976C11.1076 7.4976 10.2376 7.76152 9.49754 8.25599C8.75751 8.75046 8.18074 9.45326 7.84014 10.2755C7.49955 11.0978 7.41043 12.0026 7.58407 12.8755C7.7577 13.7484 8.18629 14.5502 8.81562 15.1796C9.44496 15.8089 10.2468 16.2375 11.1197 16.4111C11.9926 16.5848 12.8974 16.4957 13.7197 16.1551C14.5419 15.8145 15.2447 15.2377 15.7392 14.4977C16.2337 13.7576 16.4976 12.8876 16.4976 11.9976C16.4964 10.8045 16.0219 9.66064 15.1782 8.81699C14.3346 7.97335 13.1907 7.49884 11.9976 7.4976ZM11.9976 14.9976C11.4043 14.9976 10.8242 14.8217 10.3309 14.492C9.83754 14.1624 9.45303 13.6938 9.22596 13.1457C8.9989 12.5975 8.93949 11.9943 9.05525 11.4123C9.171 10.8304 9.45672 10.2958 9.87628 9.87628C10.2958 9.45672 10.8304 9.171 11.4123 9.05525C11.9943 8.93949 12.5975 8.9989 13.1457 9.22596C13.6938 9.45303 14.1624 9.83754 14.492 10.3309C14.8217 10.8242 14.9976 11.4043 14.9976 11.9976C14.9976 12.7933 14.6815 13.5563 14.1189 14.1189C13.5563 14.6815 12.7933 14.9976 11.9976 14.9976ZM20.2476 12.2001C20.2514 12.0651 20.2514 11.9301 20.2476 11.7951L21.6464 10.0476C21.7197 9.95585 21.7705 9.84815 21.7946 9.73319C21.8187 9.61823 21.8154 9.49921 21.7851 9.38573C21.5558 8.52379 21.2128 7.69621 20.7651 6.92479C20.7065 6.82384 20.6251 6.73796 20.5275 6.674C20.4298 6.61004 20.3186 6.56975 20.2026 6.55635L17.9789 6.30885C17.8864 6.21135 17.7926 6.1176 17.6976 6.0276L17.4351 3.79823C17.4216 3.68218 17.3812 3.57088 17.317 3.47322C17.2529 3.37556 17.1669 3.29424 17.0657 3.23573C16.294 2.78886 15.4665 2.4462 14.6048 2.21666C14.4912 2.18647 14.3722 2.18339 14.2572 2.20765C14.1422 2.23191 14.0346 2.28285 13.9429 2.35635L12.2001 3.7476C12.0651 3.7476 11.9301 3.7476 11.7951 3.7476L10.0476 2.35166C9.95585 2.27832 9.84815 2.22756 9.73319 2.20346C9.61823 2.17936 9.49921 2.1826 9.38573 2.21291C8.52393 2.44263 7.6964 2.78562 6.92479 3.23291C6.82384 3.29153 6.73796 3.37291 6.674 3.47056C6.61004 3.56821 6.56975 3.67945 6.55635 3.79541L6.30885 6.02291C6.21135 6.11604 6.1176 6.20979 6.0276 6.30416L3.79823 6.5601C3.68218 6.5736 3.57088 6.61403 3.47322 6.67816C3.37556 6.74229 3.29424 6.82835 3.23573 6.92948C2.78886 7.70119 2.4462 8.5287 2.21666 9.39041C2.18647 9.50397 2.18339 9.62303 2.20765 9.73799C2.23191 9.85296 2.28285 9.96062 2.35635 10.0523L3.7476 11.7951C3.7476 11.9301 3.7476 12.0651 3.7476 12.2001L2.35166 13.9476C2.27832 14.0394 2.22756 14.147 2.20346 14.262C2.17936 14.377 2.1826 14.496 2.21291 14.6095C2.44222 15.4714 2.78523 16.299 3.23291 17.0704C3.29153 17.1714 3.37291 17.2572 3.47056 17.3212C3.56821 17.3852 3.67945 17.4255 3.79541 17.4389L6.01916 17.6864C6.11229 17.7839 6.20604 17.8776 6.30041 17.9676L6.5601 20.197C6.5736 20.313 6.61403 20.4243 6.67816 20.522C6.74229 20.6196 6.82835 20.701 6.92948 20.7595C7.70119 21.2063 8.5287 21.549 9.39041 21.7785C9.50397 21.8087 9.62303 21.8118 9.73799 21.7876C9.85296 21.7633 9.96062 21.7124 10.0523 21.6389L11.7951 20.2476C11.9301 20.2514 12.0651 20.2514 12.2001 20.2476L13.9476 21.6464C14.0394 21.7197 14.147 21.7705 14.262 21.7946C14.377 21.8187 14.496 21.8154 14.6095 21.7851C15.4714 21.5558 16.299 21.2128 17.0704 20.7651C17.1714 20.7065 17.2572 20.6251 17.3212 20.5275C17.3852 20.4298 17.4255 20.3186 17.4389 20.2026L17.6864 17.9789C17.7839 17.8864 17.8776 17.7926 17.9676 17.6976L20.197 17.4351C20.313 17.4216 20.4243 17.3812 20.522 17.317C20.6196 17.2529 20.701 17.1669 20.7595 17.0657C21.2063 16.294 21.549 15.4665 21.7785 14.6048C21.8087 14.4912 21.8118 14.3722 21.7876 14.2572C21.7633 14.1422 21.7124 14.0346 21.6389 13.9429L20.2476 12.2001ZM18.7382 11.5907C18.7542 11.8617 18.7542 12.1335 18.7382 12.4045C18.7271 12.59 18.7852 12.7731 18.9014 12.9182L20.2317 14.5804C20.079 15.0655 19.8836 15.5361 19.6476 15.9867L17.5289 16.2267C17.3443 16.2471 17.174 16.3353 17.0507 16.4742C16.8703 16.6771 16.6781 16.8693 16.4751 17.0498C16.3363 17.173 16.2481 17.3434 16.2276 17.5279L15.9923 19.6448C15.5418 19.8809 15.0712 20.0763 14.586 20.2289L12.9229 18.8985C12.7898 18.7922 12.6245 18.7343 12.4542 18.7345H12.4092C12.1381 18.7504 11.8664 18.7504 11.5954 18.7345C11.4099 18.7233 11.2268 18.7814 11.0817 18.8976L9.41479 20.2289C8.92966 20.0762 8.45906 19.8807 8.00854 19.6448L7.76854 17.5289C7.74806 17.3443 7.65987 17.174 7.52104 17.0507C7.31808 16.8703 7.12587 16.6781 6.94541 16.4751C6.82216 16.3363 6.6518 16.2481 6.46729 16.2276L4.35041 15.9914C4.11434 15.5409 3.91888 15.0703 3.76635 14.5851L5.09666 12.922C5.21283 12.7769 5.27096 12.5938 5.25979 12.4082C5.24385 12.1372 5.24385 11.8655 5.25979 11.5945C5.27096 11.4089 5.21283 11.2258 5.09666 11.0807L3.76635 9.41479C3.919 8.92966 4.11446 8.45906 4.35041 8.00854L6.46635 7.76854C6.65087 7.74806 6.82123 7.65987 6.94448 7.52104C7.12494 7.31808 7.31714 7.12587 7.5201 6.94541C7.65949 6.82208 7.74804 6.65133 7.76854 6.46635L8.00385 4.35041C8.45432 4.11434 8.92493 3.91888 9.4101 3.76635L11.0732 5.09666C11.2183 5.21283 11.4014 5.27096 11.587 5.25979C11.858 5.24385 12.1297 5.24385 12.4007 5.25979C12.5863 5.27096 12.7694 5.21283 12.9145 5.09666L14.5804 3.76635C15.0655 3.919 15.5361 4.11446 15.9867 4.35041L16.2267 6.46635C16.2471 6.65087 16.3353 6.82123 16.4742 6.94448C16.6771 7.12494 16.8693 7.31714 17.0498 7.5201C17.173 7.65893 17.3434 7.74712 17.5279 7.7676L19.6448 8.00291C19.8809 8.45339 20.0763 8.924 20.2289 9.40916L18.8985 11.0723C18.7813 11.2186 18.7231 11.4036 18.7354 11.5907H18.7382Z" fill="#031373" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── STEP 2: Date row — pill-shaped day selectors ── */}
      <View style={styles.dateRow}>
        {DAYS.map((day, i) => {
          const isActive = i === TODAY_INDEX;
          const isFuture = i > TODAY_INDEX;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.datePill,
                isActive && styles.datePillActive,
                isFuture && styles.datePillFuture,
              ]}
            >
              {/* Number on top */}
              <Text style={[
                styles.dateNumber,
                isActive && styles.dateNumberActive,
              ]}>
                {DATES[i]}
              </Text>
              {/* Day name below */}
              <Text style={[
                styles.dayLabel,
                isActive && styles.dayLabelActive,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>

        {/* ── STEP 3: "New for you" — white icon+label cards ── */}
        <Text style={styles.sectionTitle}>New for you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll} contentContainerStyle={styles.cardsScrollContent}>
          {/* Card 1: Connect your device */}
          <View style={styles.newForYouCard}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={4} y={2} width={16} height={20} rx={4} stroke="#031373" strokeWidth={1.5} />
              <Path d="M9 18h6" stroke="#031373" strokeWidth={1.5} strokeLinecap="round" />
              <Circle cx={12} cy={10} r={3} stroke="#031373" strokeWidth={1.5} />
            </Svg>
            <Text style={styles.newForYouLabel}>Connect{'\n'}your device</Text>
          </View>

          {/* Card 2: Join an Experience */}
          <View style={styles.newForYouCard}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={16} rx={2} stroke="#031373" strokeWidth={1.5} />
              <Path d="M16 2v4M8 2v4M3 10h18" stroke="#031373" strokeWidth={1.5} strokeLinecap="round" />
            </Svg>
            <Text style={styles.newForYouLabel}>Join an{'\n'}Experience</Text>
          </View>

          {/* Card 3: Complete your body scan */}
          <View style={styles.newForYouCard}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M3 12h3l3-6 4 12 3-6h5" stroke="#031373" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.newForYouLabel}>Complete your{'\n'}body scan</Text>
          </View>
        </ScrollView>

        {/* ── STEP 4: Blue Points Card ── */}
        <View style={styles.blueCard}>
          {/* Top row: Weeklies | Ring | Used */}
          <View style={styles.blueCardTop}>
            {/* Left: Weeklies */}
            <View style={styles.blueCardStat}>
              <Text style={styles.blueCardStatNumber}>80</Text>
              <Text style={styles.blueCardStatLabel}>Weeklies</Text>
            </View>

            {/* Center: Points ring */}
            <View style={styles.pointsRingContainer}>
              {/* Outer ring — white track with semi-transparent unfilled portion */}
              <Svg width={130} height={130} viewBox="0 0 130 130">
                {/* Background ring (semi-transparent white) */}
                <Circle cx={65} cy={65} r={56} stroke="rgba(255,255,255,0.25)" strokeWidth={9} fill="none" />
                {/* Foreground ring (solid white) — full circle since 80/80 = 100% */}
                <Circle cx={65} cy={65} r={56} stroke="#ffffff" strokeWidth={9} fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={0}
                  transform="rotate(-90 65 65)"
                />
              </Svg>
              {/* Center text overlay */}
              <View style={styles.pointsRingText}>
                <Text style={styles.pointsRingNumber}>80</Text>
                <Text style={styles.pointsRingLabel}>Points® Left</Text>
              </View>
            </View>

            {/* Right: Used */}
            <View style={styles.blueCardStat}>
              <Text style={styles.blueCardStatNumber}>0</Text>
              <Text style={styles.blueCardStatLabel}>Used</Text>
            </View>
          </View>

          {/* Action buttons row — inside the blue card */}
          <View style={styles.blueCardActions}>
            {/* Scanner button */}
            <TouchableOpacity style={[styles.blueActionBtn, { width: 80 }]}>
              <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                {/* Camera body */}
                <Path d="M4 10a2 2 0 012-2h2l1.5-2h9L20 8h2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10z" stroke="#fff" strokeWidth={1.5} />
                {/* Lens circle */}
                <Circle cx={14} cy={15} r={4} stroke="#fff" strokeWidth={1.5} />
                {/* Small dot (flash) */}
                <Circle cx={8} cy={11} r={1} fill="#fff" />
              </Svg>
              <Text style={styles.blueActionLabel}>Scanner</Text>
            </TouchableOpacity>

            {/* Track a meal button — fills remaining space */}
            <TouchableOpacity style={[styles.blueActionBtn, { flex: 1 }]}>
              <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                {/* Circle outline */}
                <Circle cx={14} cy={14} r={10} stroke="#fff" strokeWidth={1.5} />
                {/* Plus sign inside */}
                <Path d="M14 9v10M9 14h10" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
              </Svg>
              <Text style={styles.blueActionLabel}>Track a meal</Text>
            </TouchableOpacity>

            {/* Food Log button */}
            <TouchableOpacity style={[styles.blueActionBtn, { width: 80 }]}>
              <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                {/* Clipboard body */}
                <Rect x={5} y={5} width={18} height={20} rx={3} stroke="#fff" strokeWidth={1.5} />
                {/* Clipboard clip at top */}
                <Path d="M11 3h6a1 1 0 011 1v2H10V4a1 1 0 011-1z" stroke="#fff" strokeWidth={1.2} />
                {/* Checklist lines */}
                <Path d="M9 13h10M9 17h7" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" />
                {/* Small apple/circle icon */}
                <Circle cx={20} cy={10} r={2} stroke="#fff" strokeWidth={1.2} />
                <Path d="M20 8.5c.5-1 1.5-1.5 1.5-1.5" stroke="#fff" strokeWidth={0.8} strokeLinecap="round" />
              </Svg>
              <Text style={styles.blueActionLabel}>Food Log</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── STEP 5: Macros and Nutrients — colored stacked cards ── */}
        <Text style={styles.sectionTitle}>Macros and Nutrients</Text>
        <View style={styles.macrosContainer}>
          {MACROS.map((macro, i) => (
            <TouchableOpacity key={i} style={[styles.macroCard, { backgroundColor: macro.bg }]}>
              {/* Left: icon in white circle */}
              <View style={styles.macroIconCircle}>
                <Text style={{ fontSize: 16 }}>{macro.icon}</Text>
              </View>

              {/* Center: name, value, range */}
              <View style={styles.macroCenterCol}>
                <Text style={[
                  styles.macroName,
                  !macro.textDark && styles.macroTextLight,
                ]}>
                  {macro.name.toUpperCase()}
                </Text>
                <Text style={[
                  styles.macroValue,
                  !macro.textDark && styles.macroTextLight,
                ]}>
                  {macro.value}
                </Text>
                <Text style={[
                  styles.macroRange,
                  !macro.textDark && styles.macroRangeLight,
                ]}>
                  {macro.range}
                </Text>
              </View>

              {/* Right: chevron */}
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke={macro.textDark ? '#031373' : '#ffffff'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          ))}

          {/* Add/Remove dashed card */}
          <TouchableOpacity style={styles.addRemoveCard}>
            <Text style={styles.addRemoveText}>+ Add / Remove</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── FAB — absolutely positioned, floats above everything ── */}
      {/* Figma: 48×40 blue rounded rect with white "+" (node 2296:3669) */}
      <TouchableOpacity style={styles.fab} onPress={onFABTap} activeOpacity={0.85}>
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Path d="M3.125 10H16.875" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M10 3.125V16.875" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>

      {/* ── Bottom Nav area: Tab bar + Home indicator ── */}
      {/* Figma: 84px white container, 1px #F5F5F5 top border, 5 tabs at 77px each */}
      <View style={styles.navContainer}>
      <View style={styles.tabBar}>
        {/* Home — active (Figma: "my_day" filled calendar icon, blue #002BFF) */}
        <View style={[styles.tab, styles.tabActive]}>
          <Svg width={20} height={20} viewBox="0 0 18.167 19.6503" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M2.91667 0.75L2.91667 2.68402C1.20353 3.4014 0 5.0938 0 7.0673V14.9003C0 17.5237 2.12665 19.6503 4.75 19.6503H13.417C16.0402 19.6501 18.167 17.5236 18.167 14.9003V7.0673C18.167 5.09378 16.9633 3.40136 15.25 2.684V0.75C15.25 0.335786 14.9142 0 14.5 0C14.0858 0 13.75 0.335786 13.75 0.75V2.32882C13.64 2.32119 13.5289 2.31731 13.417 2.3173H4.75C4.63794 2.3173 4.52679 2.32118 4.41667 2.32882L4.41667 0.75C4.41667 0.335786 4.08088 0 3.66667 0C3.25245 0 2.91667 0.335786 2.91667 0.75ZM14.4997 6.95201C14.9139 6.95201 15.2497 7.28779 15.2497 7.70201C15.2497 8.11622 14.9139 8.45201 14.4997 8.45201H3.66667C3.25245 8.45201 2.91667 8.11622 2.91667 7.70201C2.91667 7.28779 3.25245 6.95201 3.66667 6.95201H14.4997Z" fill="#002BFF" />
          </Svg>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Home</Text>
        </View>

        {/* Lifestyle (Figma: "discover" stacked cards icon, stroke #27253C) */}
        <View style={styles.tab}>
          <Svg width={20} height={20} viewBox="0 0 19.6504 13.5875" fill="none">
            <Path d="M2.78371 0.75C1.67109 0.75 0.769129 1.65196 0.769129 2.76458L0.750041 10.82C0.755676 11.4916 1.1703 12.8347 2.78371 12.8347C5.20251 12.8358 9.26009 12.8375 11.8493 12.8375H16.8858C17.9984 12.8375 18.9004 11.9355 18.9004 10.8229V2.76458C18.9004 1.65196 17.9984 0.75 16.8858 0.75H2.78371Z" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.tabLabel}>Lifestyle</Text>
        </View>

        {/* Experiences (Figma: "Workshop calendar" with person, node 2296:3669) */}
        <View style={styles.tab}>
          <Svg width={20} height={20} viewBox="0 0 20.7209 20" fill="none">
            {/* Calendar clips */}
            <Path d="M5.25188 0.996367V3.99762" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14.2556 0.996367V3.99762" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* Calendar body */}
            <Path d="M8.75333 19.0039H3.75125C2.09371 19.0039 0.75 17.6602 0.75 16.0026V5.49824C0.75 3.8407 2.09371 2.49699 3.75125 2.49699H15.7563C17.4138 2.49699 18.7575 3.8407 18.7575 5.49824V6.99887" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* Calendar dots */}
            <Path d="M9.25354 14.0018H8.25313" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M5.25188 13.8767C5.18281 13.8767 5.12682 13.9327 5.12682 14.0018C5.12682 14.0708 5.18281 14.1268 5.25188 14.1268C5.32094 14.1268 5.37693 14.0708 5.37693 14.0018C5.37693 13.9327 5.32094 13.8767 5.25188 13.8767" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10.7542 10.0001H8.25313" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M5.25189 9.87516C5.18282 9.87516 5.12684 9.93114 5.12684 10.0002C5.12684 10.0693 5.18282 10.1253 5.25189 10.1253C5.32095 10.1253 5.37694 10.0693 5.37694 10.0002C5.37694 9.93114 5.32095 9.87516 5.25189 9.87516" stroke="#27253c" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* Person icon (bottom-right) */}
            <Path d="M16.2541 14.4473C18.7211 14.4475 20.7209 16.448 20.7209 18.915V19.0596C20.7207 19.4736 20.385 19.8096 19.9709 19.8096C19.5569 19.8095 19.2212 19.4735 19.2209 19.0596V18.915C19.2209 17.2764 17.8927 15.9475 16.2541 15.9473C14.6153 15.9473 13.2863 17.2762 13.2863 18.915V19.0596C13.2861 19.4736 12.9504 19.8096 12.5363 19.8096C12.1223 19.8096 11.7866 19.4736 11.7863 19.0596V18.915C11.7863 16.4478 13.7869 14.4473 16.2541 14.4473ZM16.4182 8.70508C17.9113 8.70508 19.1223 9.9258 19.1223 11.4316L19.1076 11.7109C18.9689 13.0856 17.8178 14.1582 16.4182 14.1582C14.9254 14.1578 13.7151 12.9372 13.7151 11.4316C13.7151 9.92606 14.9254 8.7055 16.4182 8.70508ZM16.4182 10.1055C15.7098 10.1059 15.1155 10.688 15.1154 11.4316C15.1154 12.1753 15.7098 12.7574 16.4182 12.7578C17.1269 12.7578 17.7219 12.1755 17.7219 11.4316C17.7219 10.6878 17.1269 10.1055 16.4182 10.1055Z" fill="#27253c" />
          </Svg>
          <Text style={styles.tabLabel}>Experiences</Text>
        </View>

        {/* Med+ (Figma: "clinic" house with medical cross, fill #27253C) */}
        <View style={styles.tab}>
          <Svg width={20} height={20} viewBox="0 0 22.3333 19.5016" fill="none">
            <Path d="M19.4999 10.0846C19.914 10.0848 20.2499 10.4205 20.2499 10.8346V15.7516C20.2497 17.8223 18.5707 19.5014 16.4999 19.5016H5.83295C3.76212 19.5014 2.08316 17.8224 2.08295 15.7516V10.8346C2.08295 10.4204 2.41884 10.0847 2.83295 10.0846C3.24716 10.0846 3.58295 10.4204 3.58295 10.8346V15.7516C3.58316 16.9939 4.59055 18.0014 5.83295 18.0016H16.4999C17.7423 18.0014 18.7497 16.9939 18.7499 15.7516V10.8346C18.7499 10.4204 19.0858 10.0847 19.4999 10.0846ZM11.5615 6.45958C12.4587 6.4598 13.1865 7.18725 13.1865 8.08458V9.02305H14.1249C15.0222 9.02323 15.7499 9.75074 15.7499 10.6481V11.4381C15.7497 12.3352 15.0221 13.0629 14.1249 13.0631H13.1865V14.0016C13.1862 14.8987 12.4586 15.6263 11.5615 15.6266H10.7714C9.87424 15.6264 9.14664 14.8987 9.14642 14.0016V13.0631H8.20795C7.31075 13.063 6.58321 12.3353 6.58295 11.4381V10.6481C6.58299 9.75071 7.31062 9.02318 8.20795 9.02305H9.14642V8.08458C9.14642 7.18722 9.87411 6.45975 10.7714 6.45958H11.5615ZM10.7714 7.70958C10.5645 7.70975 10.3964 7.87758 10.3964 8.08458V9.64805C10.3964 9.9932 10.1166 10.2731 9.77142 10.2731H8.20795C8.00098 10.2732 7.83299 10.4411 7.83295 10.6481V11.4381C7.83321 11.6449 8.00111 11.813 8.20795 11.8131H9.77142C10.1166 11.8131 10.3964 12.0929 10.3964 12.4381V14.0016C10.3966 14.2084 10.5646 14.3764 10.7714 14.3766H11.5615C11.7682 14.3763 11.9362 14.2084 11.9365 14.0016V12.4381C11.9365 12.093 12.2164 11.8132 12.5615 11.8131H14.1249C14.3317 11.8129 14.4997 11.6449 14.4999 11.4381V10.6481C14.4999 10.4411 14.3319 10.2732 14.1249 10.2731H12.5615C12.2164 10.2729 11.9365 9.99312 11.9365 9.64805V8.08458C11.9365 7.87761 11.7684 7.7098 11.5615 7.70958H10.7714ZM10.0107 0.436141C10.6716 -0.145352 11.6623 -0.145409 12.3232 0.436141L22.079 9.0211C22.3898 9.29468 22.4198 9.76877 22.1464 10.0797C21.8728 10.3907 21.3988 10.4207 21.0878 10.1471L11.332 1.56212C11.2377 1.47919 11.0963 1.47935 11.0019 1.56212L1.24505 10.1471C0.934097 10.4206 0.460074 10.3906 0.186461 10.0797C-0.0868636 9.76873 -0.0560238 9.29464 0.25482 9.0211L10.0107 0.436141Z" fill="#27253c" />
          </Svg>
          <Text style={styles.tabLabel}>Med+</Text>
        </View>

        {/* Profile (Figma: "user" person silhouette, fill #27253C) */}
        <View style={styles.tab}>
          <Svg width={20} height={20} viewBox="0 0 13.0654 14.8249" fill="none">
            <Path d="M8.6582 9.67549C11.1615 9.67584 13.0654 11.6856 13.0654 14.0837C13.0651 14.4926 12.7332 14.8247 12.3242 14.8249C11.9152 14.8247 11.5834 14.4926 11.583 14.0837C11.583 12.4822 10.3209 11.1583 8.6582 11.1579H4.4082C2.80651 11.1579 1.48242 12.4207 1.48242 14.0837C1.48206 14.4926 1.15019 14.8247 0.741211 14.8249C0.33208 14.8249 0.000360888 14.4927 0 14.0837C0 11.58 2.0099 9.67549 4.4082 9.67549H8.6582ZM3.56055 1.20381C5.266 -0.401243 7.88344 -0.401297 9.58887 1.20381L9.60449 1.21943C11.3045 2.91967 11.3289 5.6575 9.58887 7.29561C7.91455 8.87144 5.1852 9.02361 3.52832 7.26338C1.95261 5.58901 1.80026 2.86062 3.56055 1.20381ZM8.54883 2.28584C7.42095 1.23492 5.71303 1.23797 4.58887 2.29561C3.51597 3.30539 3.52939 5.07708 4.62012 6.23604C5.62993 7.30875 7.40165 7.29447 8.56055 6.20381C9.65155 5.1769 9.67627 3.41898 8.54883 2.28584Z" fill="#27253c" />
          </Svg>
          <Text style={styles.tabLabel}>Profile</Text>
        </View>
      </View>

      {/* Home indicator — inside nav white area */}
      <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════

const styles = StyleSheet.create({
  // ── Container — light blue background (was grey #f4f4f4) ──
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e6efff',
  },

  // ── Header — no title, right-aligned icons ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,  // Figma: px-[16px] (was 20)
    paddingVertical: 8,     // Figma: py-[8px] (was pt:8 pb:12)
  },
  headerLeftSpacer: {
    width: 112, // matches Figma left margin
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,  // Figma: gap-[16px] (was 12)
  },
  headerIcon: {
    width: 24,   // Figma: size-[24px] (was 32)
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Date row — pill-shaped selectors (48×54px) ──
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePill: {
    width: 48,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  datePillActive: {
    borderWidth: 1.5,
    borderColor: '#477bff',
  },
  datePillFuture: {
    opacity: 0.5,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#767ea8',
  },
  dateNumberActive: {
    color: '#477bff',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#767ea8',
  },
  dayLabelActive: {
    color: '#477bff',
  },

  // ── Scroll area ──
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },

  // ── Section titles — dark navy ──
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#031373',
    paddingHorizontal: 20,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  // ── "New for you" cards — white 109×86px with icon + label ──
  cardsScroll: {
    marginBottom: 24,
  },
  cardsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  newForYouCard: {
    width: 109,
    height: 86,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  newForYouLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#031373',
    textAlign: 'center',
    lineHeight: 15,
  },

  // ── Blue points card ──
  blueCard: {
    backgroundColor: '#3d6df1',
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 24,
    marginBottom: 24,
  },
  blueCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  blueCardStat: {
    alignItems: 'center',
    width: 70,
  },
  blueCardStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  blueCardStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  // Points ring (centered in the blue card)
  pointsRingContainer: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsRingText: {
    position: 'absolute',
    alignItems: 'center',
  },
  pointsRingNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  pointsRingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: -2,
  },
  // Action buttons inside the blue card
  blueCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  blueActionBtn: {
    backgroundColor: '#477bff',
    borderWidth: 1,
    borderColor: '#84abff',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  blueActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ── Macros section — colored stacked cards ──
  macrosContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginHorizontal: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  macroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
  },
  macroIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  macroCenterCol: {
    flex: 1,
  },
  macroName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#031373',
    letterSpacing: 0.5,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#031373',
    marginTop: 1,
  },
  macroRange: {
    fontSize: 10,
    color: '#767ea8',
    marginTop: 1,
  },
  macroTextLight: {
    color: '#ffffff',
  },
  macroRangeLight: {
    color: 'rgba(255,255,255,0.7)',
  },
  // Add/Remove dashed card
  addRemoveCard: {
    borderWidth: 1.5,
    borderColor: '#b8d2ff',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRemoveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#477bff',
  },

  // ── Bottom nav: white container wrapping tabs + home indicator (84px total) ──
  navContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    height: 84,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    height: 48,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    gap: 4,
  },
  tabActive: {},
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#27253c',
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: '#002bff',
  },

  // ── FAB — absolutely positioned, floats above tab bar with transparent bg ──
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 48,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#002bff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    // Shadow
    shadowColor: '#002bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },

  // ── Home indicator — below tab bar ──
  homeIndicator: {
    width: 135,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#d1d1e4',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
});
