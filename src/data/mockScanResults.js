// Mock scan results for demo purposes
// Ingredients are listed without restriction flags — restrictions are matched
// dynamically against the user's avoid list at scan time.

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

// Alias map: maps ingredient names to terms that might appear on avoid lists
const ingredientAliases = {
  'flat rice noodles': ['rice noodles', 'noodles', 'white rice', 'glutinous rice'],
  'prawns': ['prawns', 'shellfish', 'shrimp'],
  'cockles': ['cockles', 'shellfish', 'molluscs'],
  'chinese sausage (lap cheong)': ['processed meat', 'sausages', 'pork'],
  'bean sprouts': ['bean sprouts'],
  'chinese chives (ku chai)': ['chives'],
  'eggs': ['eggs'],
  'egg yolk': ['eggs'],
  'dark soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'light soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'oyster sauce': ['oyster sauce', 'shellfish'],
  'fish sauce': ['fish sauce'],
  'chilli': ['chilli', 'spicy food', 'hot sauce', 'cayenne pepper'],
  'garlic': ['garlic'],
  'lard': ['lard', 'greasy foods', 'deep-fried foods', 'fatty foods'],
  'cooking oil': ['vegetable oil', 'soybean oil', 'corn oil', 'palm oil'],
  'romaine lettuce': ['lettuce', 'salads', 'raw vegetables'],
  'parmesan cheese': ['parmesan', 'cheese', 'dairy', 'hard cheese'],
  'croutons': ['croutons', 'wheat', 'bread', 'gluten'],
  'anchovy (in dressing)': ['anchovies', 'fish'],
  'lemon juice': ['lemon', 'citrus'],
  'olive oil': ['olive oil'],
  'worcestershire sauce': ['worcestershire'],
  'black pepper': ['black pepper'],
  'dijon mustard': ['mustard'],
  'white fish (sea bass / grouper)': ['fish'],
  'ginger': ['ginger', 'fresh ginger'],
  'spring onion': ['spring onion', 'onion', 'shallots'],
  'sesame oil': ['sesame oil', 'sesame'],
  'shaoxing wine': ['alcohol', 'wine'],
  'coriander': ['coriander'],
  'sugar': ['sugar', 'refined sugar'],
  'salt': ['salt', 'sodium'],
  'onion': ['onion', 'shallots'],
  'soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
}

function matchRestrictions(ingredientName, avoidList) {
  const lowerName = ingredientName.toLowerCase()
  const lowerAvoidList = avoidList.map(a => a.toLowerCase())

  // Direct match against avoid list
  for (const avoided of lowerAvoidList) {
    if (lowerName.includes(avoided) || avoided.includes(lowerName)) {
      return { restricted: true, reason: `${avoided} — on your avoid list` }
    }
  }

  // Alias match
  const aliases = ingredientAliases[lowerName] || []
  for (const alias of aliases) {
    const lowerAlias = alias.toLowerCase()
    for (const avoided of lowerAvoidList) {
      if (lowerAlias.includes(avoided) || avoided.includes(lowerAlias)) {
        return { restricted: true, reason: `Related to ${avoided} — on your avoid list` }
      }
    }
  }

  return { restricted: false, reason: null }
}

// Raw dish data — ingredients only, no restriction flags
// Sources link to actual recipe pages for each specific dish
const dishDatabase = {
  'char kway teow': {
    dish: 'Char Kway Teow',
    confidence: 87,
    confidenceLevel: 'high',
    recipesScanned: 12,
    ingredients: [
      { name: 'flat rice noodles', category: 'carbs' },
      { name: 'prawns', category: 'protein' },
      { name: 'cockles', category: 'protein' },
      { name: 'Chinese sausage (lap cheong)', category: 'protein' },
      { name: 'bean sprouts', category: 'vegetable' },
      { name: 'Chinese chives (ku chai)', category: 'vegetable' },
      { name: 'eggs', category: 'protein' },
      { name: 'dark soy sauce', category: 'sauce' },
      { name: 'light soy sauce', category: 'sauce' },
      { name: 'oyster sauce', category: 'sauce' },
      { name: 'fish sauce', category: 'sauce' },
      { name: 'chilli', category: 'spice' },
      { name: 'garlic', category: 'spice' },
      { name: 'lard', category: 'fat' },
    ],
    sources: [
      { name: 'Woks of Life — Penang Char Kway Teow', url: 'https://thewoksoflife.com/char-kway-teow/' },
      { name: 'RecipeTin Eats — Char Kway Teow', url: 'https://www.recipetineats.com/char-kway-teow/' },
      { name: 'Rasa Malaysia — Char Kuey Teow', url: 'https://rasamalaysia.com/char-kuey-teow-recipe/' },
      { name: 'Serious Eats — Char Kway Teow', url: 'https://www.seriouseats.com/char-kway-teow-malaysian-stir-fried-rice-noodles-recipe' },
    ],
  },
  'caesar salad': {
    dish: 'Caesar Salad',
    confidence: 92,
    confidenceLevel: 'high',
    recipesScanned: 18,
    ingredients: [
      { name: 'romaine lettuce', category: 'vegetable' },
      { name: 'parmesan cheese', category: 'dairy' },
      { name: 'croutons', category: 'carbs' },
      { name: 'anchovy (in dressing)', category: 'protein' },
      { name: 'egg yolk', category: 'protein' },
      { name: 'garlic', category: 'spice' },
      { name: 'lemon juice', category: 'acid' },
      { name: 'olive oil', category: 'fat' },
      { name: 'Worcestershire sauce', category: 'sauce' },
      { name: 'dijon mustard', category: 'sauce' },
      { name: 'black pepper', category: 'spice' },
    ],
    sources: [
      { name: 'Serious Eats — The Best Caesar Salad', url: 'https://www.seriouseats.com/the-best-caesar-salad-recipe' },
      { name: 'Bon Appétit — Classic Caesar Salad', url: 'https://www.bonappetit.com/recipe/classic-caesar-salad' },
      { name: 'RecipeTin Eats — Caesar Salad', url: 'https://www.recipetineats.com/caesar-salad/' },
      { name: 'Food Network — Caesar Salad', url: 'https://www.foodnetwork.com/recipes/bobby-flay/caesar-salad-recipe-1942741' },
    ],
  },
  'steamed fish': {
    dish: 'Steamed Fish (Cantonese-style)',
    confidence: 90,
    confidenceLevel: 'high',
    recipesScanned: 14,
    ingredients: [
      { name: 'white fish (sea bass / grouper)', category: 'protein' },
      { name: 'ginger', category: 'spice' },
      { name: 'spring onion', category: 'vegetable' },
      { name: 'light soy sauce', category: 'sauce' },
      { name: 'sesame oil', category: 'fat' },
      { name: 'shaoxing wine', category: 'liquid' },
      { name: 'sugar', category: 'seasoning' },
      { name: 'coriander', category: 'herb' },
      { name: 'cooking oil', category: 'fat' },
    ],
    sources: [
      { name: 'Woks of Life — Cantonese Steamed Fish', url: 'https://thewoksoflife.com/steamed-whole-fish/' },
      { name: 'China Sichuan Food — Steamed Fish', url: 'https://www.chinasichuanfood.com/chinese-steamed-fish/' },
      { name: 'RecipeTin Eats — Chinese Steamed Fish', url: 'https://www.recipetineats.com/chinese-steamed-fish/' },
      { name: 'Taste — Cantonese Steamed Fish', url: 'https://www.taste.com.au/recipes/cantonese-style-steamed-fish/d93ab0f9-2686-4a76-bea0-cc920d5e0e9f' },
    ],
  },
};

// Fallback ingredients for unknown dishes
const fallbackIngredients = [
  { name: 'cooking oil', category: 'fat' },
  { name: 'garlic', category: 'spice' },
  { name: 'onion', category: 'vegetable' },
  { name: 'soy sauce', category: 'sauce' },
  { name: 'salt', category: 'seasoning' },
  { name: 'sugar', category: 'seasoning' },
  { name: 'protein (varies)', category: 'protein' },
  { name: 'vegetables (varies)', category: 'vegetable' },
]

// Generate a result for any dish, dynamically matching against the user's avoid list
export function generateMockResult(dishName, avoidList = []) {
  const known = dishDatabase[dishName.toLowerCase()]

  const baseData = known || {
    dish: dishName,
    confidence: 65,
    confidenceLevel: 'medium',
    recipesScanned: 6,
    ingredients: fallbackIngredients,
    sources: [
      { name: 'Various recipes online', url: '#' },
    ],
  }

  // Dynamically flag restricted ingredients based on user's avoid list
  const ingredients = baseData.ingredients.map(ing => {
    const { restricted, reason } = matchRestrictions(ing.name, avoidList)
    return { ...ing, restricted, reason }
  })

  const restrictedPercent = ingredients.length > 0
    ? (ingredients.filter(i => i.restricted).length / ingredients.length) * 100
    : 0

  return {
    ...baseData,
    ingredients,
    wittyComment: getWittyComment(restrictedPercent),
    confidenceExplanation: buildConfidenceExplanation({ ...baseData, ingredients }),
  }
}

// Re-export for backward compat
export const mockScanResults = dishDatabase;
