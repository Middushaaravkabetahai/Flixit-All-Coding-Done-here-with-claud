import { Tabs } from 'expo-router';
import {
  FlixnderIcon,
  FypIcon,
  TodayIcon,
  PlannerIcon,
  PriceMatchIcon,
  ProfileIcon,
  WardrobeIcon,
} from '../../src/components/icons';
import { SHOW_DEAL_FEEDS } from '../../src/config/features';

// Ink for the active tab, muted warm grey for the rest — the brand neutrals,
// not the system defaults.
const ACTIVE = '#18181b';
const INACTIVE = '#9a938a';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {/* FYP and Flixnder are finished but hidden for v1 — the deal catalog
          behind them is placeholder data, which Apple rejects under guideline
          2.1. `href: null` keeps the routes registered and drops them from the
          tab bar, so flipping SHOW_DEAL_FEEDS back on needs no other change.
          See src/config/features.ts. */}
      {/* The landing screen: today's outfits as album covers. First in the
          bar and the default route inside (tabs), so this is what opening the
          app shows. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <TodayIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="fyp"
        options={{
          title: 'FYP',
          tabBarIcon: ({ color }) => <FypIcon color={color} />,
          href: SHOW_DEAL_FEEDS ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="flixnder"
        options={{
          title: 'Flixnder',
          tabBarIcon: ({ color }) => <FlixnderIcon color={color} />,
          href: SHOW_DEAL_FEEDS ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          // "Closet" not "Wardrobe": six tabs don't leave room for the longer
          // word, which truncates to "Wardr...". The screen heading still
          // reads "My Wardrobe".
          title: 'Closet',
          tabBarIcon: ({ color }) => <WardrobeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => <PlannerIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <PriceMatchIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
