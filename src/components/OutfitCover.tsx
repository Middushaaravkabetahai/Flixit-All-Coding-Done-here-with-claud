import { Image, StyleSheet, Text, View } from 'react-native';
import { OUTFIT_SLOTS, type Outfit } from '../lib/outfitPlanner';

/**
 * One outfit drawn as a square album cover.
 *
 * The layout is a mosaic rather than a grid: the top gets a tall panel down the
 * left, everything else stacks in a narrower column on the right. A plain 2x2
 * would make a pair of shoes as visually important as the jacket, and it breaks
 * the moment a closet has three items in an outfit instead of four. This way
 * the same shape holds whether the outfit has two pieces or five.
 */
export function OutfitCover({
  outfit,
  imageUrls,
}: {
  outfit: Outfit;
  imageUrls: Record<string, string>;
}) {
  const hero = outfit.Top ?? outfit.Bottom;
  const rest = OUTFIT_SLOTS.map((slot) => outfit[slot]).filter(
    (item) => item && item.id !== hero?.id
  );

  return (
    <View style={styles.cover}>
      <View style={styles.mosaic}>
        <View style={styles.heroPane}>
          <Panel uri={hero ? imageUrls[hero.id] : undefined} />
        </View>

        {rest.length > 0 && (
          <View style={styles.sidePane}>
            {rest.map((item) => (
              <View key={item!.id} style={styles.sideCell}>
                <Panel uri={imageUrls[item!.id]} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Boolean() rather than a bare `uri &&`: an empty string is falsy but still
 * renders, and a text node inside a View throws on native.
 */
function Panel({ uri }: { uri?: string }) {
  return (
    <View style={styles.panel}>
      {Boolean(uri) && <Image source={{ uri }} style={styles.panelImage} />}
    </View>
  );
}

/** The slot list under a cover, set like a track listing. */
export function CoverTracklist({ outfit }: { outfit: Outfit }) {
  const worn = OUTFIT_SLOTS.filter((slot) => outfit[slot]);
  return (
    <View style={styles.tracks}>
      {worn.map((slot, i) => {
        const item = outfit[slot]!;
        const meta = [item.brand, item.color].filter(Boolean).join(' · ');
        return (
          <View key={slot} style={styles.trackRow}>
            <Text style={styles.trackNum}>{String(i + 1).padStart(2, '0')}</Text>
            <Text style={styles.trackSlot}>{slot}</Text>
            {Boolean(meta) && (
              <Text style={styles.trackMeta} numberOfLines={1}>
                {meta}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const GAP = 3;

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#e7e1d6',
    // A cover needs to sit off the page the way a record sleeve does.
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  mosaic: { flex: 1, flexDirection: 'row', gap: GAP },
  heroPane: { flex: 1.45 },
  sidePane: { flex: 1, gap: GAP },
  sideCell: { flex: 1 },
  panel: { flex: 1, backgroundColor: '#ddd6c9', overflow: 'hidden' },
  panelImage: { width: '100%', height: '100%' },

  tracks: { marginTop: 2, gap: 7 },
  trackRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  trackNum: {
    fontSize: 11,
    color: '#a39a8d',
    fontVariant: ['tabular-nums'],
    width: 18,
  },
  trackSlot: { fontSize: 14, fontWeight: '600', color: '#18181b', width: 86 },
  trackMeta: { fontSize: 13, color: '#8a8278', flex: 1 },
});
