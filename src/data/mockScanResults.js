// Mock scan results for demo purposes — will be replaced with Claude API calls

// Witty commentary based on how "bad" the dish is for you
const wittyCommentary = {
  safe: [
    "Your mum would actually approve of this one.",
    "Go for it — your gut will thank you.",
    "Green light. Enjoy without the guilt trip.",
  ],
  caution: [
    "Your mum would probably say no, but moderation is key.",
    "Not a disaster, but maybe don't make it a daily habit.",
    "It's a maybe — like texting your ex, proceed with caution.",
    "Treat yourself, but maybe skip the seconds.",
  ],
  danger: [
    "This one's a minefield for your diet. Maybe sit this one out.",
    "Your body called — it said absolutely not.",
    "If your diet had a nemesis, this would be it.",
    "Let's just say this dish and your restrictions aren't on speaking terms.",
  ],
}

function getWittyComment(restrictedPercent) {
  const pool = restrictedPercent > 40 ? wittyCommentary.danger
    : restrictedPercent > 20 ? wittyCommentary.caution
    : wittyCommentary.safe
  return pool[Math.floor(Math.random() * pool.length)]
}

// Category to food group emoji mapping for illustrations
export const categoryIcons = {
  carbs: 'rice',
  protein: 'meat',
  vegetable: 'vegetable',
  sauce: 'sauce',
  spice: 'spice',
  fat: 'oil',
  dairy: 'dairy',
  acid: 'citrus',
  herb: 'herb',
  liquid: 'drink',
  seasoning: 'seasoning',
}

// Dish category for illustrations
export const dishCategories = {
  'Char Kway Teow': 'noodles',
  'Caesar Salad': 'salad',
  'Steamed Fish (Cantonese-style)': 'fish',
}

function buildConfidenceExplanation(result) {
  const { confidence, recipesScanned, dish } = result
  const restricted = result.ingredients.filter(i => i.restricted).length
  const total = result.ingredients.length

  if (confidence >= 85) {
    return `Nibble cross-referenced ${recipesScanned} recipes for ${dish} and found strong consistency across sources. ${restricted} out of ${total} common ingredients matched your restriction list. The high recipe count gives us confidence in the ingredient breakdown.`
  } else if (confidence >= 70) {
    return `We scanned ${recipesScanned} recipes for ${dish}. Most sources agree on the core ingredients, though some variations exist. ${restricted} out of ${total} ingredients flagged against your profile. Some regional variations may use different ingredients.`
  } else {
    return `We found ${recipesScanned} recipes for ${dish}, but there's quite a bit of variation between sources. ${restricted} out of ${total} ingredients flagged. Recipes for this dish vary widely — your version may differ from what we found.`
  }
}

export const mockScanResults = {
  'char kway teow': {
    dish: 'Char Kway Teow',
    confidence: 87,
    confidenceLevel: 'high',
    recipesScanned: 12,
    ingredients: [
      { name: 'flat rice noodles (kway teow)', restricted: false, category: 'carbs' },
      { name: 'prawns', restricted: true, reason: 'Shellfish — restricted on your diet', category: 'protein' },
      { name: 'cockles', restricted: true, reason: 'Shellfish — restricted on your diet', category: 'protein' },
      { name: 'Chinese sausage (lap cheong)', restricted: true, reason: 'Processed meat — may trigger flare-ups', category: 'protein' },
      { name: 'bean sprouts', restricted: false, category: 'vegetable' },
      { name: 'chives', restricted: false, category: 'vegetable' },
      { name: 'eggs', restricted: false, category: 'protein' },
      { name: 'dark soy sauce', restricted: false, category: 'sauce' },
      { name: 'light soy sauce', restricted: false, category: 'sauce' },
      { name: 'oyster sauce', restricted: true, reason: 'Contains shellfish extract — restricted on your diet', category: 'sauce' },
      { name: 'fish sauce', restricted: true, reason: 'Fish sauce — restricted on your diet', category: 'sauce' },
      { name: 'chilli', restricted: true, reason: 'Spicy ingredients — may aggravate your condition', category: 'spice' },
      { name: 'garlic', restricted: true, reason: 'Garlic — restricted on your diet', category: 'spice' },
      { name: 'lard / cooking oil', restricted: true, reason: 'Greasy/fatty cooking base — restricted', category: 'fat' },
    ],
    sources: [
      { name: 'Woks of Life', url: 'https://thewoksoflife.com' },
      { name: 'RecipeTin Eats', url: 'https://recipetineats.com' },
      { name: 'Serious Eats', url: 'https://seriouseats.com' },
      { name: 'Rasa Malaysia', url: 'https://rasamalaysia.com' },
    ],
    summary: 'contains-restricted',
  },
  'caesar salad': {
    dish: 'Caesar Salad',
    confidence: 92,
    confidenceLevel: 'high',
    recipesScanned: 18,
    ingredients: [
      { name: 'romaine lettuce', restricted: false, category: 'vegetable' },
      { name: 'parmesan cheese', restricted: true, reason: 'Dairy — restricted on your diet', category: 'dairy' },
      { name: 'croutons', restricted: true, reason: 'Wheat/gluten — restricted on your diet', category: 'carbs' },
      { name: 'anchovy (in dressing)', restricted: false, category: 'protein' },
      { name: 'egg yolk (in dressing)', restricted: false, category: 'protein' },
      { name: 'garlic', restricted: true, reason: 'Garlic — restricted on your diet', category: 'spice' },
      { name: 'lemon juice', restricted: false, category: 'acid' },
      { name: 'olive oil', restricted: false, category: 'fat' },
      { name: 'Worcestershire sauce', restricted: false, category: 'sauce' },
      { name: 'black pepper', restricted: false, category: 'spice' },
    ],
    sources: [
      { name: 'Serious Eats', url: 'https://seriouseats.com' },
      { name: "J. Kenji López-Alt", url: 'https://seriouseats.com' },
      { name: 'Bon Appétit', url: 'https://bonappetit.com' },
      { name: 'Food Network', url: 'https://foodnetwork.com' },
      { name: 'RecipeTin Eats', url: 'https://recipetineats.com' },
    ],
    summary: 'check-these',
  },
  'steamed fish': {
    dish: 'Steamed Fish (Cantonese-style)',
    confidence: 90,
    confidenceLevel: 'high',
    recipesScanned: 14,
    ingredients: [
      { name: 'white fish (sea bass / grouper)', restricted: false, category: 'protein' },
      { name: 'ginger (fresh)', restricted: false, category: 'spice' },
      { name: 'spring onion', restricted: true, reason: 'Onion family — restricted on your diet', category: 'vegetable' },
      { name: 'light soy sauce', restricted: false, category: 'sauce' },
      { name: 'sesame oil', restricted: false, category: 'fat' },
      { name: 'shaoxing wine', restricted: true, reason: 'Alcohol — restricted on your diet', category: 'liquid' },
      { name: 'coriander', restricted: false, category: 'herb' },
    ],
    sources: [
      { name: 'Woks of Life', url: 'https://thewoksoflife.com' },
      { name: 'China Sichuan Food', url: 'https://chinasichuanfood.com' },
      { name: 'RecipeTin Eats', url: 'https://recipetineats.com' },
    ],
    summary: 'check-these',
  },
};

// Generate a plausible mock result for any dish not in the database
export function generateMockResult(dishName) {
  const known = mockScanResults[dishName.toLowerCase()];
  if (known) {
    // Enrich with witty commentary and confidence explanation
    const restrictedPercent = (known.ingredients.filter(i => i.restricted).length / known.ingredients.length) * 100
    return {
      ...known,
      wittyComment: getWittyComment(restrictedPercent),
      confidenceExplanation: buildConfidenceExplanation(known),
    }
  }

  // Generic fallback result
  const fallback = {
    dish: dishName,
    confidence: 65,
    confidenceLevel: 'medium',
    recipesScanned: 6,
    ingredients: [
      { name: 'cooking oil', restricted: true, reason: 'Greasy cooking base — may be restricted', category: 'fat' },
      { name: 'garlic', restricted: true, reason: 'Garlic — restricted on your diet', category: 'spice' },
      { name: 'onion', restricted: true, reason: 'Onion — restricted on your diet', category: 'vegetable' },
      { name: 'soy sauce', restricted: false, category: 'sauce' },
      { name: 'salt', restricted: false, category: 'seasoning' },
      { name: 'sugar', restricted: true, reason: 'Sugar — restricted on your diet', category: 'seasoning' },
      { name: 'protein (varies)', restricted: false, category: 'protein' },
      { name: 'vegetables (varies)', restricted: false, category: 'vegetable' },
    ],
    sources: [
      { name: 'Various recipes online', url: '#' },
    ],
    summary: 'check-these',
  }

  const restrictedPercent = (fallback.ingredients.filter(i => i.restricted).length / fallback.ingredients.length) * 100
  return {
    ...fallback,
    wittyComment: getWittyComment(restrictedPercent),
    confidenceExplanation: buildConfidenceExplanation(fallback),
  }
}
