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
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

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
      <G transform="skewX(-6) translate(2.6 0)">
        <Rect x="7" y="7" width="14" height="19" rx="4" />
        <Rect x="27" y="7" width="14" height="11" rx="4" />
        <Rect x="7" y="32" width="14" height="9" rx="4" />
        <Rect x="27" y="24" width="14" height="17" rx="4" />
      </G>
    </Frame>
  );
}

/** Flixnder — a card mid-swipe, the rest of the deck showing as edges. */
export function FlixnderIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Path d="M11 16c-.6 6-.6 11 0 16" />
      <Path d="M17.5 12c-.8 8-.8 16 0 24" />
      <Rect x="23" y="9" width="19" height="30" rx="5" transform="rotate(10 32.5 24)" />
    </Frame>
  );
}

/** Wardrobe Scan — a hanger caught inside scan brackets. */
export function WardrobeIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Path d="M5 15V9a4 4 0 0 1 4-4h6" />
      <Path d="M33 5h6a4 4 0 0 1 4 4v6" />
      <Path d="M5 33v6a4 4 0 0 0 4 4h6" />
      <Path d="M43 33v6a4 4 0 0 1-4 4h-6" />
      <Path d="M24.5 23.5v-5a4 4 0 1 0-4 4" />
      <Path d="M24.5 23.5 13 34h23z" />
    </Frame>
  );
}

/** Outfit Planner — a day marked on a calendar, hanger hooks as the rings. */
export function PlannerIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Rect x="6.5" y="11" width="35" height="32" rx="6" />
      <Path d="M6.5 21.5c12 .8 23 .6 35-.6" />
      <Path d="M15 14V8.5a2.5 2.5 0 0 1 5 0" />
      <Path d="M28 14V8.5a2.5 2.5 0 0 1 5 0" />
      <Path d="M17.5 31.5c1.9 1.3 3.5 2.9 4.8 4.7 2.2-3.3 5-6.1 8.2-8.4" />
    </Frame>
  );
}

/** Scan & Price Match — the tag, read through scan brackets. */
export function PriceMatchIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <Path d="M5 12V9a4 4 0 0 1 4-4h3" />
      <Path d="M36 5h3a4 4 0 0 1 4 4v3" />
      <Path d="M5 36v3a4 4 0 0 0 4 4h3" />
      <Path d="M43 36v3a4 4 0 0 1-4 4h-3" />
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
      <Circle cx="24.5" cy="17" r="7.5" />
      <Path d="M9.5 42.5c.6-8 7-14.5 15-14.5s14.4 6.5 15 14.5" />
    </Frame>
  );
}
