import type { Deal } from '../data/mockDeals';
import { supabase } from './supabase';

export async function recordSwipe(
  userId: string,
  deal: Deal,
  direction: 'like' | 'pass'
): Promise<void> {
  const { error } = await supabase.from('swipes').insert({
    user_id: userId,
    deal_id: deal.id,
    category: deal.category,
    direction,
  });
  // Swipes are a nice-to-have signal, not critical path — log and move on
  // rather than interrupting the swiping experience over a network hiccup.
  if (error) console.warn('Failed to record swipe:', error.message);
}

// Net likes-minus-passes per category, used to rank the FYP feed.
export async function getCategoryPreferences(
  userId: string
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('swipes')
    .select('category, direction')
    .eq('user_id', userId);
  if (error || !data) return {};

  const scores: Record<string, number> = {};
  for (const swipe of data) {
    const delta = swipe.direction === 'like' ? 1 : -1;
    scores[swipe.category] = (scores[swipe.category] ?? 0) + delta;
  }
  return scores;
}
