import { Alert, Linking, Platform } from 'react-native';

/**
 * Opens a link outside the app, and says so when it cannot.
 *
 * `Linking.openURL` returns a promise that REJECTS when nothing on the device
 * can handle the URL. Called bare, that rejection is unhandled: the tap does
 * nothing at all, with no error and no clue that anything went wrong. It
 * matters most on the privacy policy link, which App Review taps, and on the
 * price search, which is the Scan tab's whole payoff.
 */
export async function openExternal(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    const message = "Couldn't open that link. Check your connection and try again.";
    if (Platform.OS === 'web') {
      // Alert.alert is a no-op on react-native-web, so the user would get
      // nothing — which is the bug this function exists to fix.
      window.alert(message);
      return;
    }
    Alert.alert("Couldn't open link", message);
  }
}

/** A Google Shopping search for a free-text item description. */
export function shoppingSearchUrl(query: string): string {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
}
