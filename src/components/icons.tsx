// Flixit feature sub-marks, as React Native components.
//
// Geometry is copied verbatim from brand/icons/*.svg — same 48 grid, same 3.5
// stroke, same round caps and joins. If you change a mark here, change it
// there too (and vice versa), or the app and the brand kit drift apart.
//
// Every icon takes { color, size } so the tab bar can tint them for the
// focused/unfocused state, matching the `stroke="currentColor"` the SVG
// originals use.
import type { ColorValue } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconProps = {
  /** ColorValue rather than string: this is what expo-router's tabBarIcon hands us. */
  color: ColorValue;
  size?: number;
};

const STROKE = 3.5;

function Frame({ color, size = 26, children }: IconProps & { children: React.ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke={color}
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </Svg>
  );
}

/** Style FYP — a masonry feed. Unequal tile heights are the point. */
export function FypIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Rect x="6" y="6" width="15" height="20" rx="3.5" />
      <Rect x="27" y="6" width="15" height="12" rx="3.5" />
      <Rect x="6" y="32" width="15" height="10" rx="3.5" />
      <Rect x="27" y="24" width="15" height="18" rx="3.5" />
    </Frame>
  );
}

/** Flixnder — a card mid-swipe, the rest of the deck showing as edges. */
export function FlixnderIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Path d="M11 15v18" />
      <Path d="M17 12v24" />
      <Rect x="23" y="9" width="19" height="30" rx="4" transform="rotate(7 32.5 24)" />
    </Frame>
  );
}

/** Wardrobe Scan — a hanger caught inside scan brackets. */
export function WardrobeIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Path d="M5 15V5h10" />
      <Path d="M33 5h10v10" />
      <Path d="M5 33v10h10" />
      <Path d="M43 33v10H33" />
      <Path d="M24 22v-4a3.5 3.5 0 1 0-3.5 3.5" />
      <Path d="M24 22 13 33h22z" />
    </Frame>
  );
}

/** Outfit Planner — a day marked on a calendar, hanger hooks as the rings. */
export function PlannerIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Rect x="6" y="11" width="36" height="32" rx="5" />
      <Path d="M6 21h36" />
      <Path d="M16 6v8" />
      <Path d="M32 6v8" />
      <Path d="M18 31.5l4.5 4.5 8-8" />
    </Frame>
  );
}

/** Scan & Price Match — the tag, read through scan brackets. */
export function PriceMatchIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Path d="M5 12V5h7" />
      <Path d="M36 5h7v7" />
      <Path d="M5 36v7h7" />
      <Path d="M43 36v7h-7" />
      <Path d="M26 13h6a3 3 0 0 1 3 3v6L22 35a2.5 2.5 0 0 1-3.5 0l-5.5-5.5a2.5 2.5 0 0 1 0-3.5z" />
      <Circle cx="28.5" cy="19.5" r="1.75" />
    </Frame>
  );
}

/**
 * Profile — the sixth mark, drawn to the same rules as the other five
 * (48 grid, 3.5 stroke, one idea). Not a "feature" mark, so it stays the
 * plainest shape in the set rather than competing with them.
 */
export function ProfileIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Circle cx="24" cy="17" r="7.5" />
      <Path d="M9 42a15 15 0 0 1 30 0" />
    </Frame>
  );
}
