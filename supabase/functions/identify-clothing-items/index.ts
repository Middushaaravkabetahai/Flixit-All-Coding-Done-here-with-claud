// Phase 4 (Smart Scanning): identifies clothing item(s) in a photo using
// Claude's vision API, so a single closet photo can become several tagged
// wardrobe items instead of one-by-one manual entry, and a single in-store
// item photo can be auto-tagged for price matching.
//
// Deploy: supabase functions deploy identify-clothing-items
// Requires a secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// (get a key at https://console.anthropic.com — this is separate from the
// Supabase keys and isn't set by default, so this function 500s with a
// clear message until it's configured).

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const MODEL = Deno.env.get('CLAUDE_MODEL') ?? 'claude-haiku-4-5-20251001';

const CATEGORIES = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Mode = 'closet' | 'item';

type DetectedItem = {
  category: string;
  color: string | null;
  brand: string | null;
  description: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function promptFor(mode: Mode) {
  const shared = `Only real clothing items — skip furniture, walls, hangers with
nothing on them, etc. "category" must be exactly one of: ${CATEGORIES.join(', ')}
(pick the closest match). "color" and "brand" are null if not confidently
visible/legible. "description" is a short human-readable label, e.g.
"Navy crewneck sweater".`;

  if (mode === 'closet') {
    return `You're looking at a photo of someone's closet or a rack of clothes.
Identify each distinct clothing item you can see. ${shared}
Respond with ONLY a JSON array (no markdown fences, no commentary), e.g.:
[{"category":"Top","color":"Navy","brand":null,"description":"Navy crewneck sweater"}]
If you can't confidently identify any items, respond with [].`;
  }

  return `You're looking at a photo of a single clothing item, likely taken in a
store. Identify it. ${shared}
Respond with ONLY a single JSON object (no markdown fences, no commentary), e.g.:
{"category":"Shoes","color":"White","brand":"Nike","description":"White leather sneakers"}
If you can't confidently identify an item, respond with null.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });

  if (!ANTHROPIC_API_KEY) {
    return jsonResponse(
      {
        error:
          'ANTHROPIC_API_KEY is not set for this Supabase project. Run: ' +
          'supabase secrets set ANTHROPIC_API_KEY=sk-ant-... (see README).',
      },
      500
    );
  }

  let body: { image?: string; mediaType?: string; mode?: Mode };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body.' }, 400);
  }

  const { image, mediaType = 'image/jpeg', mode = 'item' } = body;
  if (!image) return jsonResponse({ error: '"image" (base64) is required.' }, 400);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
              { type: 'text', text: promptFor(mode) },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return jsonResponse({ error: `Claude API error: ${detail}` }, 502);
    }

    const result = await response.json();
    const text: string = result?.content?.[0]?.text ?? '';

    let parsed: unknown;
    try {
      // Models occasionally wrap JSON in ```json fences despite instructions.
      const cleaned = text.trim().replace(/^```json\s*|^```\s*|```$/g, '');
      parsed = JSON.parse(cleaned);
    } catch {
      return jsonResponse({ error: 'Could not parse a response from Claude. Try again.' }, 502);
    }

    if (mode === 'closet') {
      const items = (Array.isArray(parsed) ? parsed : []) as DetectedItem[];
      return jsonResponse({ items });
    }

    return jsonResponse({ item: (parsed ?? null) as DetectedItem | null });
  } catch (e) {
    return jsonResponse({ error: e instanceof Error ? e.message : 'Unknown error' }, 500);
  }
});
