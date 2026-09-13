import { Tabs } from 'expo-router';
import {
  FlixnderIcon,
  FypIcon,
  PlannerIcon,
  PriceMatchIcon,
  ProfileIcon,
  WardrobeIcon,
} from '../../src/components/icons';

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'FYP',
          tabBarIcon: ({ color }) => <FypIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="flixnder"
        options={{
          title: 'Flixnder',
          tabBarIcon: ({ color }) => <FlixnderIcon color={color} />,
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
