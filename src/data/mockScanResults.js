// Mock scan results for demo purposes — will be replaced with Claude API calls
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
  if (known) return known;

  // Generic fallback result
  return {
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
  };
}
