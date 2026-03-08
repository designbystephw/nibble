// Vercel serverless function — POST /api/scan
// Requires OPENAI_API_KEY environment variable

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { dish } = req.body || {};
  if (!dish) return res.status(400).json({ error: 'Missing dish name' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a culinary expert. Given a dish name, analyze it and return JSON with this exact structure:
{
  "dish": "Proper Dish Name",
  "confidence": 85,
  "ingredients": [
    { "name": "ingredient name", "category": "carbs|protein|vegetable|sauce|spice|fat|dairy|acid|herb|liquid|seasoning" }
  ],
  "sources": [
    { "name": "Recipe Title", "url": "https://real-recipe-url.com/dish-name/", "site": "hostname.com" }
  ],
  "wittyComment": "A short, witty one-liner about the dish and diet restrictions."
}

Rules:
- List 8-20 common ingredients found across typical recipes for this dish. Include sub-ingredients (e.g. "dark soy sauce" not just "soy sauce"). Be specific.
- For sources, provide 4-7 REAL recipe URLs from popular cooking sites: recipetineats.com, seriouseats.com, bonappetit.com, thewoksoflife.com, bbcgoodfood.com, allrecipes.com, food52.com, epicurious.com, maangchi.com, justonecookbook.com, hot-thai-kitchen.com, rasamalaysia.com. Use real URL patterns these sites use.
- Confidence (0-100): high for well-known dishes with consistent recipes, lower for obscure or highly variable dishes.
- The witty comment should be brief, cheeky, and relevant to common dietary concerns about the dish.`
          },
          {
            role: 'user',
            content: `Analyze the dish: "${dish}"`
          }
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI API error:', err);
      return res.status(502).json({ error: 'Failed to analyze dish' });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: 'Empty response from AI' });
    }

    const result = JSON.parse(content);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Scan API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
