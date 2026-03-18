import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Animated } from 'react-native';
import { Svg, Path, Line } from 'react-native-svg';


// FAB Menu — expanded quick-add sheet that appears when tapping the FAB ("+") on MyDay.
// Redesigned to match Figma node 2288:4539.
// White bottom sheet with navy-outlined icons in rounded-square containers,
// Recently Tracked food items, and a close button.

type Props = {
  onClose: () => void;
  onSmartScan: () => void; // navigates to the scanner
};

// ── Recently Tracked mock data (matching Figma) ──
const RECENT_ITEMS = [
  { title: 'Egg(s)', subtitle: '2 item(s) (large)', points: '0 pts' },
  { title: 'Coffee with half & half (2 Tbsp)', subtitle: '8 fl oz', points: '0 pts' },
  { title: 'Food item name', subtitle: 'Serving size', points: '0 pts' },
  { title: 'Food item name', subtitle: 'Serving size', points: '0 pts' },
];

// ── Grid icon components — all use navy fill (exact Figma paths) ──
const ICON_COLOR = '#181877';

function FoodIcon() {
  // Exact Figma icon: cup with steam + saucer (filled)
  return (
    <Svg width={28} height={28} viewBox="0 0 20.167 22.5" fill="none">
      <Path d="M18.417 8.74997C19.3832 8.75032 20.167 9.5337 20.167 10.5V14.833C20.167 17.0233 18.6835 18.8659 16.667 19.415V20.291C16.667 21.5101 15.6771 22.4998 14.458 22.5H5.70801C4.48894 22.4998 3.5 21.5101 3.5 20.291V19.415C1.48316 18.8662 0 17.0237 0 14.833V10.5C1.18563e-05 9.53348 0.78351 8.74997 1.75 8.74997H18.417ZM5 19.583V20.291C5 20.6817 5.31737 20.9998 5.70801 21H14.458C14.8486 20.9998 15.167 20.6817 15.167 20.291V19.583H5ZM1.75 10.25C1.61194 10.25 1.50001 10.3619 1.5 10.5V14.833C1.5 16.6279 2.95508 18.083 4.75 18.083H15.417C17.2116 18.0826 18.667 16.6277 18.667 14.833V10.5C18.667 10.3621 18.5548 10.2503 18.417 10.25H1.75ZM5.57812 0.129854C5.9206 -0.102871 6.38723 -0.0142797 6.62012 0.328096C7.03747 0.941914 7.34074 1.54022 7.33789 2.21384C7.33495 2.87916 7.03196 3.46903 6.63086 4.06931L6.63184 4.07028C6.28895 4.6071 6.19646 4.90293 6.19531 5.12985C6.1942 5.3523 6.2807 5.64406 6.62695 6.17185C6.85398 6.51804 6.75713 6.98266 6.41113 7.20993C6.06485 7.43701 5.59928 7.34129 5.37207 6.99509C4.97062 6.38317 4.69199 5.78717 4.69531 5.12204C4.69872 4.46155 4.98016 3.86858 5.36719 3.26267L5.37695 3.24899C5.74708 2.69707 5.83687 2.41515 5.83789 2.20798C5.83879 2.00396 5.75321 1.72234 5.37891 1.17185C5.1462 0.829377 5.23577 0.362747 5.57812 0.129854ZM9.63281 0.129854C9.97531 -0.1027 10.442 -0.0143007 10.6748 0.328096C11.0921 0.941866 11.3954 1.54027 11.3926 2.21384C11.3896 2.8791 11.0866 3.46909 10.6855 4.06931L10.6865 4.07028C10.3436 4.60715 10.2512 4.90292 10.25 5.12985C10.2489 5.35231 10.3353 5.64398 10.6816 6.17185C10.9085 6.51795 10.8116 6.98263 10.4658 7.20993C10.1196 7.4371 9.65403 7.34123 9.42676 6.99509C9.02526 6.38313 8.74668 5.78721 8.75 5.12204C8.75341 4.46152 9.03482 3.86861 9.42188 3.26267L9.43164 3.24899C9.80168 2.69718 9.89156 2.41513 9.89258 2.20798C9.89347 2.00398 9.80782 1.72225 9.43359 1.17185C9.20075 0.829319 9.2903 0.362741 9.63281 0.129854ZM13.7158 0.129854C14.0583 -0.102886 14.5249 -0.0143624 14.7578 0.328096C15.1752 0.941914 15.4784 1.54022 15.4756 2.21384C15.4726 2.87916 15.1697 3.46904 14.7686 4.06931L14.7695 4.07028C14.4266 4.60715 14.3342 4.90292 14.333 5.12985C14.3319 5.35231 14.4183 5.64399 14.7646 6.17185C14.9917 6.51804 14.8948 6.98266 14.5488 7.20993C14.2025 7.43713 13.737 7.34134 13.5098 6.99509C13.1083 6.38313 12.8297 5.78721 12.833 5.12204C12.8364 4.46152 13.1178 3.86861 13.5049 3.26267L13.5146 3.24899C13.8848 2.69708 13.9746 2.41515 13.9756 2.20798C13.9765 2.00396 13.8909 1.72234 13.5166 1.17185C13.2838 0.82932 13.3733 0.362738 13.7158 0.129854Z" fill={ICON_COLOR} />
    </Svg>
  );
}

function ActivityIcon() {
  // Exact Figma icon: running shoe (filled)
  return (
    <Svg width={28} height={28} viewBox="0 0 22.507 22.507" fill="none">
      <Path d="M6.58718 21.0068C7.00139 21.0068 7.33718 21.3426 7.33718 21.7568C7.33718 22.171 7.00138 22.5067 6.58718 22.5068H0.754176C0.339966 22.5068 0.00418187 22.171 0.00417568 21.7568C0.00417568 21.3425 0.339962 21.0068 0.754176 21.0068H6.58718ZM5.47097 0.501877C6.08901 -0.02526 6.97396 -0.152442 7.72 0.193283C8.46432 0.538477 8.93573 1.28322 8.93582 2.09856V5.05852H11.0452L12.763 4.01457C13.26 3.70879 13.8671 3.65156 14.4026 3.83977H14.4036C14.405 3.8403 14.4071 3.84124 14.4085 3.84172L14.4114 3.8427H14.4104C14.9045 4.01526 15.2865 4.37769 15.4993 4.82805L15.5803 5.02727L15.5833 5.03508L18.2268 12.9804L21.9348 17.9238L21.9358 17.9257C22.5798 18.79 22.6954 19.9469 22.2014 20.9189C21.7157 21.8744 20.7382 22.4949 19.6546 22.495H15.0696C13.5665 22.495 12.1298 21.8716 11.1009 20.7616V20.7607L1.13894 10.0409L1.13504 10.037C0.358902 9.19029 -0.0513488 8.06121 0.00515225 6.91496L0.00612881 6.90617C0.0764709 5.76663 0.596412 4.67627 1.47976 3.92082L5.47 0.502853L5.47097 0.501877ZM1.66043 6.22942C1.57379 6.47492 1.51955 6.73368 1.5032 6.99797C1.46921 7.73668 1.73491 8.46903 2.23757 9.01945L12.2005 19.7411L12.2014 19.7421C12.9458 20.545 13.9831 20.995 15.0696 20.995H19.6546C20.1571 20.9949 20.627 20.7064 20.8645 20.2392C21.0634 19.8479 21.0521 19.3845 20.8421 18.995H15.3606C14.1908 18.9949 13.0553 18.5166 12.2552 17.6464L1.66043 6.22942ZM3.08718 16.912C3.50139 16.912 3.83718 17.2478 3.83718 17.662C3.83702 18.0761 3.50129 18.412 3.08718 18.412H0.754176C0.340061 18.412 0.00433542 18.0761 0.00417568 17.662C0.00417568 17.2478 0.339962 16.912 0.754176 16.912H3.08718ZM7.08914 1.55461C6.87858 1.45704 6.61989 1.49311 6.44461 1.6425L2.54714 4.98137L13.3548 16.6269L13.3577 16.6298C13.8639 17.1813 14.5951 17.4949 15.3606 17.495H19.7376L16.9544 13.7841C16.906 13.7197 16.8685 13.6467 16.843 13.5702L16.4759 12.4677L12.5501 13.1503C12.142 13.2213 11.7529 12.9481 11.6819 12.54C11.6111 12.1321 11.8845 11.7439 12.2923 11.6728L15.9964 11.0273L15.4964 9.52629L11.3811 10.2343C10.9731 10.3044 10.5852 10.03 10.5149 9.62199C10.445 9.21394 10.7192 8.82598 11.1272 8.75578L15.0169 8.08586L14.1624 5.51653L14.1194 5.4257C14.0689 5.34302 13.9961 5.28577 13.9153 5.25774L13.9075 5.25481C13.792 5.21355 13.6559 5.22722 13.5491 5.29289L13.5452 5.29485L11.677 6.42863C11.5543 6.51641 11.4048 6.57015 11.2425 6.57024H8.18582C7.77191 6.57003 7.43603 6.23414 7.43582 5.82024V2.09856C7.43573 1.86449 7.30069 1.65291 7.08914 1.55461Z" fill={ICON_COLOR} />
    </Svg>
  );
}

function WeightIcon() {
  // Exact Figma icon: rounded square scale with display (filled)
  return (
    <Svg width={28} height={28} viewBox="0 0 22.5 22.5" fill="none">
      <Path d="M15.917 0C19.5521 0.000176249 22.4998 2.94789 22.5 6.58301V15.917C22.4998 19.5521 19.5521 22.4998 15.917 22.5H6.58301C2.94789 22.4998 0.000176246 19.5521 0 15.917V6.58301C0.000175862 2.94789 2.94789 0.000175859 6.58301 0H15.917ZM6.58301 1.5C3.77631 1.50018 1.50018 3.77631 1.5 6.58301V15.917C1.50018 18.7237 3.77631 20.9998 6.58301 21H15.917C18.7237 20.9998 20.9998 18.7237 21 15.917V6.58301C20.9998 3.77631 18.7237 1.50018 15.917 1.5H6.58301ZM11.25 4.00586C14.2411 4.00604 16.6658 6.43179 16.666 9.42285C16.6658 10.4825 15.8075 11.3387 14.75 11.3389H7.75C6.69204 11.3387 5.83318 10.4808 5.83301 9.42285C5.83326 6.43179 8.25892 4.00604 11.25 4.00586ZM11.25 5.50586C9.08735 5.50604 7.33326 7.26022 7.33301 9.42285C7.33318 9.65238 7.52047 9.83869 7.75 9.83887H10.7852L11.7461 7.91699C11.9313 7.54655 12.3815 7.39591 12.752 7.58105C13.1222 7.76625 13.2727 8.21657 13.0879 8.58691L12.4619 9.83887H14.75C14.98 9.83869 15.1658 9.65306 15.166 9.42285C15.1658 7.26022 13.4126 5.50604 11.25 5.50586Z" fill={ICON_COLOR} />
    </Svg>
  );
}

function WaterIcon() {
  // Exact Figma icon: glass/tumbler (filled)
  return (
    <Svg width={28} height={28} viewBox="0 0 18.417 23.067" fill="none">
      <Path d="M15.6169 0C17.2575 0.000142897 18.547 1.40443 18.4069 3.03906L17.0661 18.6777C16.853 21.1604 14.7757 23.0673 12.2839 23.0674H6.13347C3.64163 23.0673 1.56429 21.1604 1.35125 18.6777L0.0104275 3.03906C-0.129667 1.40435 1.15976 2.93134e-05 2.80047 0H15.6169ZM11.7126 8.25293C11.028 8.76453 10.1501 9.06343 9.20867 9.06348C8.26698 9.06348 7.38844 8.76476 6.70379 8.25293C6.0193 8.76456 5.14127 9.06337 4.19988 9.06348C3.4293 9.06348 2.70037 8.86363 2.08562 8.51074L2.945 18.541C3.08704 20.1961 4.47229 21.4677 6.13347 21.4678H12.2839C13.945 21.4676 15.3303 20.1961 15.4723 18.541L16.3307 8.51074C15.7161 8.86343 14.9878 9.06344 14.2175 9.06348C13.2758 9.06342 12.3972 8.76481 11.7126 8.25293ZM2.80047 1.59961C2.09733 1.59964 1.54513 2.20177 1.60515 2.90234L1.91472 6.52539C2.04355 6.56487 2.16419 6.63739 2.25945 6.74609C2.67909 7.22469 3.37778 7.56348 4.19988 7.56348C5.02199 7.56333 5.7208 7.22481 6.14031 6.74609L6.19597 6.68848C6.33363 6.56173 6.51474 6.49031 6.70379 6.49023C6.89276 6.49028 7.07395 6.56185 7.2116 6.68848L7.43816 6.91895C7.86421 7.30444 8.48928 7.56348 9.20867 7.56348C9.92807 7.56342 10.5532 7.30449 10.9792 6.91895L11.2057 6.68848C11.3434 6.56187 11.5246 6.49023 11.7136 6.49023C11.9024 6.49038 12.0829 6.56191 12.2204 6.68848L12.447 6.91895C12.873 7.3044 13.4981 7.56341 14.2175 7.56348C15.0396 7.56343 15.7383 7.22475 16.1579 6.74609C16.2531 6.63749 16.3729 6.56391 16.5016 6.52441L16.8122 2.90234C16.8722 2.20186 16.3199 1.59975 15.6169 1.59961H2.80047Z" fill={ICON_COLOR} />
    </Svg>
  );
}

function SleepIcon() {
  // Exact Figma icon: bed with headboard (filled, 24×24 container)
  return (
    <Svg width={24} height={24} viewBox="0 0 21.5 17.5" fill="none">
      <Path d="M15.75 0C17.8212 0 19.5 1.67879 19.5 3.75V6.92773C19.7458 7.35826 19.9096 7.84095 19.9717 8.35547C20.8769 8.80545 21.5 9.73752 21.5 10.8174V13.75C21.4998 14.4472 21.0904 15.047 20.5 15.3281V16.75C20.5 17.1642 20.1642 17.5 19.75 17.5C19.3358 17.5 19 17.1642 19 16.75V15.5H2.5V16.75C2.5 17.1642 2.16421 17.5 1.75 17.5C1.33579 17.5 1 17.1642 1 16.75V15.3281C0.409587 15.047 0.000154824 14.4472 0 13.75V10.8174C0 9.73752 0.623064 8.80545 1.52832 8.35547C1.59031 7.84166 1.75473 7.35977 2 6.92969V3.75C2 1.67879 3.67879 0 5.75 0H15.75ZM2.75 9.56738C2.05921 9.56738 1.5 10.1266 1.5 10.8174V13.75C1.50022 13.8876 1.61235 14 1.75 14H19.75C19.8877 14 19.9998 13.8876 20 13.75V10.8174C20 10.1266 19.4408 9.56738 18.75 9.56738H2.75ZM5.31738 6.5C4.30029 6.5 3.43787 7.15594 3.12598 8.06738H9.47559C9.33937 7.1801 8.57575 6.50019 7.65039 6.5H5.31738ZM13.3174 6.5C12.3003 6.5 11.4379 7.15594 11.126 8.06738H18.375C18.0631 7.15594 17.2007 6.5 16.1836 6.5H13.3174ZM5.75 1.5C4.50721 1.5 3.5 2.50721 3.5 3.75V5.45898C4.04032 5.16596 4.65955 5 5.31738 5H7.65039C8.76982 5.00013 9.75994 5.54999 10.3682 6.39355C11.0683 5.54265 12.1295 5 13.3174 5H16.1836C16.8411 5 17.4599 5.16622 18 5.45898V3.75C18 2.50721 16.9928 1.5 15.75 1.5H5.75Z" fill={ICON_COLOR} />
    </Svg>
  );
}

function GlucoseIcon() {
  // Exact Figma icon: blood drop (filled, 24×24 container)
  return (
    <Svg width={24} height={24} viewBox="0 0 14.064 18.083" fill="none">
      <Path d="M7.13477 0.00488281C7.34885 0.0252079 7.56064 0.107407 7.7373 0.257812L7.82227 0.338867L8.31934 0.876953C8.99029 1.61935 10.1243 2.93317 11.2041 4.45801C11.9237 5.47426 12.6309 6.59988 13.1602 7.72461C13.6844 8.8387 14.0635 10.0114 14.0635 11.1055C14.0635 15.0588 11.1247 18.083 7.03125 18.083C2.93796 18.0829 1.808e-05 15.0587 0 11.1055C0 10.0116 0.378755 8.83958 0.902344 7.72559C1.43096 6.6009 2.13664 5.47524 2.85547 4.45898C4.29316 2.4264 5.82697 0.768417 6.2334 0.338867L6.31934 0.257812C6.52525 0.082554 6.77891 0 7.02832 0L7.13477 0.00488281ZM7.02832 1.68945C6.42468 2.34815 5.21754 3.71707 4.08008 5.3252C3.39075 6.29976 2.73781 7.34624 2.25977 8.36328C1.7767 9.39105 1.5 10.3302 1.5 11.1055C1.50002 14.2348 3.77087 16.5829 7.03125 16.583C10.2918 16.583 12.5635 14.2349 12.5635 11.1055C12.5635 10.3303 12.2864 9.39111 11.8027 8.36328C11.3242 7.34628 10.6706 6.29974 9.98047 5.3252C8.8416 3.7169 7.63248 2.34797 7.02832 1.68945Z" fill={ICON_COLOR} />
    </Svg>
  );
}

function SmartScanIcon() {
  // Exact Figma icon: camera viewfinder with corner brackets (filled)
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Path d="M2.33301 20.25C2.74722 20.25 3.08301 20.5858 3.08301 21V22.167C3.08318 23.0411 3.79197 23.7496 4.66602 23.75H5.83301C6.24722 23.75 6.58301 24.0858 6.58301 24.5C6.58301 24.9142 6.24722 25.25 5.83301 25.25H4.66602C2.96355 25.2496 1.58318 23.8695 1.58301 22.167V21C1.58301 20.5859 1.91894 20.2502 2.33301 20.25ZM25.667 20.25C26.0811 20.2502 26.417 20.5859 26.417 21V22.167C26.4168 23.8695 25.0365 25.2496 23.334 25.25H22.167C21.7528 25.25 21.417 24.9142 21.417 24.5C21.417 24.0858 21.7528 23.75 22.167 23.75H23.334C24.208 23.7496 24.9168 23.0411 24.917 22.167V21C24.917 20.5858 25.2528 20.25 25.667 20.25ZM16.917 7.85449C17.3311 7.85467 17.667 8.19039 17.667 8.60449V9.67773C17.6669 10.2 17.511 10.6864 17.2441 11.0938C17.7094 11.3129 18.1052 11.6392 18.4199 12.0576C19.0153 12.8496 19.2705 13.9022 19.2705 15.0215C19.2702 18.0137 16.8467 20.4383 13.8545 20.4385C10.8621 20.4385 8.43781 18.0138 8.4375 15.0215C8.4375 13.9023 8.69276 12.8496 9.28809 12.0576C9.905 11.2373 10.833 10.7715 11.9873 10.7715L12.0566 10.7744C12.4323 10.8092 12.8059 10.8597 13.1768 10.9229C13.0621 10.6862 12.8223 10.5216 12.542 10.5215H12.25C11.836 10.5215 11.5003 10.1854 11.5 9.77148C11.5 9.35727 11.8358 9.02148 12.25 9.02148H12.542C12.9023 9.02154 13.2415 9.10949 13.542 9.2627C13.6631 9.02643 13.8203 8.80765 14.0117 8.61621C14.4942 8.13372 15.1574 7.85449 15.8438 7.85449H16.917ZM15.7432 12.2725C15.1679 12.3226 14.5926 12.4193 14.0215 12.5498C13.9117 12.5749 13.7973 12.5748 13.6875 12.5498C13.1207 12.4203 12.5421 12.3282 11.958 12.2725C11.2622 12.2797 10.7993 12.5442 10.4873 12.959C10.1498 13.408 9.9375 14.1054 9.9375 15.0215C9.93781 17.1853 11.6906 18.9385 13.8545 18.9385C16.0183 18.9383 17.7702 17.1852 17.7705 15.0215C17.7705 14.1055 17.5591 13.408 17.2217 12.959C16.9086 12.5427 16.443 12.278 15.7432 12.2725ZM15.8438 9.35449C15.5618 9.35449 15.2791 9.4719 15.0732 9.67773C14.8709 9.88014 14.7559 10.1557 14.7559 10.4482V10.7715H15.0732C15.6782 10.7715 16.1669 10.2799 16.167 9.67773V9.35449H15.8438ZM5.83301 2.75C6.24722 2.75 6.58301 3.08579 6.58301 3.5C6.58301 3.91421 6.24722 4.25 5.83301 4.25H4.66602C3.79197 4.25035 3.08318 4.95892 3.08301 5.83301V7C3.08301 7.41421 2.74722 7.75 2.33301 7.75C1.91894 7.74982 1.58301 7.4141 1.58301 7V5.83301C1.58318 4.1305 2.96355 2.75035 4.66602 2.75H5.83301ZM23.334 2.75C25.0365 2.75035 26.4168 4.1305 26.417 5.83301V7C26.417 7.4141 26.0811 7.74982 25.667 7.75C25.2528 7.75 24.917 7.41421 24.917 7V5.83301C24.9168 4.95892 24.208 4.25035 23.334 4.25H22.167C21.7528 4.25 21.417 3.91421 21.417 3.5C21.417 3.08579 21.7528 2.75 22.167 2.75H23.334Z" fill={ICON_COLOR} />
    </Svg>
  );
}

// Map grid item keys to icon components
function GridIcon({ itemKey }: { itemKey: string }) {
  switch (itemKey) {
    case 'food': return <FoodIcon />;
    case 'activity': return <ActivityIcon />;
    case 'weight': return <WeightIcon />;
    case 'water': return <WaterIcon />;
    case 'sleep': return <SleepIcon />;
    case 'glucose': return <GlucoseIcon />;
    case 'smartscan': return <SmartScanIcon />;
    default: return null;
  }
}

// ── Grid data ──
const GRID_ROW_1 = [
  { key: 'food', label: 'Food' },
  { key: 'activity', label: 'Activity' },
  { key: 'weight', label: 'Weight' },
  { key: 'water', label: 'Water' },
] as const;

const GRID_ROW_2 = [
  { key: 'sleep', label: 'Sleep' },
  { key: 'glucose', label: 'Glucose' },
  { key: 'smartscan', label: 'Smart Scan' },
] as const;

export default function FABMenu({ onClose, onSmartScan }: Props) {
  // iOS-style sheet presentation: backdrop fades, sheet slides up with spring
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entryAnim, {
      toValue: 1,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, []);

  // Animate sheet out (slide down + fade backdrop), THEN call the callback.
  // This prevents the parent from unmounting us before the animation finishes.
  const handleDismiss = (callback: () => void) => {
    Animated.spring(entryAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start(() => callback());
  };

  // Backdrop fades from transparent to semi-opaque
  const backdropOpacity = entryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  // Sheet slides up from below
  const sheetTranslateY = entryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });
  // Recent card fades in slightly after sheet starts moving
  const recentOpacity = entryAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Blurred background overlay — tap to dismiss, animated fade-in */}
      <Animated.View style={[styles.backdropAnimated, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => handleDismiss(onClose)} />
      </Animated.View>

      {/* ── Date label — on top of blur overlay, always visible ── */}
      <Text style={styles.dateLabel} pointerEvents="none">Today, Oct 13</Text>

      {/* ── Recently Tracked — glass card floating ABOVE the sheet, fades in ── */}
      <Animated.View style={[styles.recentCard, { top: 114, opacity: recentOpacity }]}>
        {/* Header row */}
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>RECENTLY TRACKED</Text>
          <View style={styles.lunchChip}>
            <Text style={styles.lunchChipText}>LUNCH</Text>
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <Path d="M3 5l3 3 3-3" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>

        {/* Food items list */}
        <ScrollView style={styles.recentList} showsVerticalScrollIndicator={false}>
          {RECENT_ITEMS.map((item, i) => (
            <View key={i}>
              {/* Divider between items */}
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.recentItem}>
                {/* Left: title + subtitle */}
                <View style={styles.recentItemLeft}>
                  <Text style={styles.recentItemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.recentItemSubtitle}>{item.subtitle}</Text>
                </View>
                {/* Right: points + add button */}
                <View style={styles.recentItemRight}>
                  <Text style={styles.recentItemPoints}>{item.points}</Text>
                  <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                      {/* White "+" icon for glass card */}
                      <Line x1={8} y1={3} x2={8} y2={13} stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" />
                      <Line x1={3} y1={8} x2={13} y2={8} stroke="#ffffff" strokeWidth={1.8} strokeLinecap="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── White bottom sheet — slides up from bottom with spring ── */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
        {/* Drag handle */}
        <View style={styles.handleBar} />

        {/* ── Grid of quick-add buttons ── */}
        <View style={styles.grid}>
          {/* Row 1: Food, Activity, Weight, Water */}
          <View style={styles.gridRow}>
            {GRID_ROW_1.map((item) => (
              <TouchableOpacity key={item.key} style={styles.gridItem} activeOpacity={0.7}>
                <View style={styles.gridIconSquare}>
                  <GridIcon itemKey={item.key} />
                </View>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Row 2: Sleep, Glucose, Smart Scan */}
          <View style={styles.gridRow}>
            {GRID_ROW_2.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.gridItem}
                activeOpacity={0.7}
                onPress={item.key === 'smartscan' ? () => handleDismiss(onSmartScan) : undefined}
              >
                <View style={[
                  styles.gridIconSquare,
                  item.key === 'smartscan' && styles.gridIconSmartScan,
                ]}>
                  <GridIcon itemKey={item.key} />
                </View>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            {/* Empty spacer for 4-column alignment */}
            <View style={styles.gridItem} />
          </View>
        </View>

        {/* ── Close button ── */}
        <TouchableOpacity style={styles.closeButton} onPress={() => handleDismiss(onClose)} activeOpacity={0.8}>
          <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <Line x1={4} y1={4} x2={16} y2={16} stroke="#181877" strokeWidth={1.8} strokeLinecap="round" />
            <Line x1={16} y1={4} x2={4} y2={16} stroke="#181877" strokeWidth={1.8} strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
  },

  // ── Date label — positioned above blur, always visible ──
  dateLabel: {
    position: 'absolute',
    top: 56,        // Below status bar (~44px) + small margin
    left: 0,
    right: 0,
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    zIndex: 10,     // Above the backdrop blur
  },

  // ── Animated backdrop wrapper ──
  backdropAnimated: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // ── Blurred backdrop ──
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 5, 23, 0.7)',  // Figma navy #070517 at 70%
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(10px)',   // Figma: 10px (was 20px)
          WebkitBackdropFilter: 'blur(10px)',
        } as any
      : {}),
  },

  // ── White bottom sheet ──
  sheet: {
    position: 'absolute',
    bottom: -8,  // Figma: bottom-[-8px] — extends past safe area
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 36,
    paddingHorizontal: 16,
    gap: 8,
    // Sheet shadow from Figma
    shadowColor: '#070517',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },

  // ── Drag handle ──
  handleBar: {
    width: 22,
    height: 4,
    borderRadius: 100,
    backgroundColor: '#031aa1',
    marginBottom: 12,
  },

  // ── Grid ──
  grid: {
    width: '100%',
    gap: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,  // Figma: gap-[4px] (was 6)
  },

  // ── Grid icon — rounded square with light blue bg ──
  gridIconSquare: {
    width: '100%',
    height: 72,
    borderRadius: 16,
    backgroundColor: '#e6efff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Smart Scan is the opposite: white bg + gray border (outlined style)
  gridIconSmartScan: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d1e4',
  },

  // ── Grid label — navy text ──
  gridLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181877',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // ── Close button — rounded rectangle (48×40) ──
  closeButton: {
    width: 48,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d1e4',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24, // 8 (sheet gap) + 24 = 32px total from grid, matching Figma
  },

  // ── Recently Tracked card — glass effect floating ABOVE the sheet ──
  recentCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 372,  // Figma: exact card height (was maxHeight: 260)
    backgroundColor: 'rgba(244,245,249,0.1)',
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    // Glass blur effect (web only)
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        } as any
      : {}),
  },

  // ── Recent header ──
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 0.24,
  },
  lunchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 70,
    gap: 0,  // Figma: gap-[0px] (was 4) — text flush against chevron
    // Glass blur on the chip itself
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
        } as any
      : {}),
    // Shadow from Figma
    shadowColor: '#000000',
    shadowOffset: { width: 20, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
  },
  lunchChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: 0.24,
  },

  // ── Recent items list ──
  recentList: {
    flex: 1,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recentItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    letterSpacing: -0.31,
    marginBottom: 2,
  },
  recentItemSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ffffff',
    letterSpacing: -0.15,
  },
  recentItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,  // Figma: gap-[12px] (was 10)
  },
  recentItemPoints: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'right',
    letterSpacing: -0.2,  // Figma: tracking-[-0.2px]
  },
  // "+" button — white border circle, no fill
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Divider line between items — semi-transparent white ──
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
