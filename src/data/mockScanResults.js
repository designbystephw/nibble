// Mock scan results for demo purposes
// Ingredients are listed without restriction flags — restrictions are matched
// dynamically against the user's avoid list at scan time.

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

export const categoryIcons = {
  carbs: 'rice', protein: 'meat', vegetable: 'vegetable', sauce: 'sauce',
  spice: 'spice', fat: 'oil', dairy: 'dairy', acid: 'citrus',
  herb: 'herb', liquid: 'drink', seasoning: 'seasoning',
}

// Dish similarity map — for recommending similar dishes on homepage
export const dishSimilarity = {
  'Char Kway Teow': ['Pad Thai', 'Mee Goreng', 'Wonton Noodles', 'Laksa'],
  'Caesar Salad': ['Greek Salad', 'Waldorf Salad', 'Cobb Salad'],
  'Steamed Fish': ['Fish and Chips', 'Sushi', 'Grilled Salmon'],
  'Pad Thai': ['Char Kway Teow', 'Mee Goreng', 'Pho', 'Laksa'],
  'Bibimbap': ['Hainanese Chicken Rice', 'Nasi Lemak', 'Fried Rice'],
  'Laksa': ['Tom Yum Soup', 'Pho', 'Wonton Noodles', 'Pad Thai'],
  'Hainanese Chicken Rice': ['Nasi Lemak', 'Bibimbap', 'Fried Rice'],
  'Tom Yum Soup': ['Laksa', 'Pho', 'Wonton Noodles'],
  'Nasi Lemak': ['Hainanese Chicken Rice', 'Bibimbap', 'Nasi Goreng'],
  'Fish and Chips': ['Steamed Fish', 'Sushi', 'Fish Tacos'],
  'Sushi': ['Sashimi', 'Poke Bowl', 'Onigiri'],
  'Pho': ['Laksa', 'Tom Yum Soup', 'Wonton Noodles', 'Ramen'],
  'Carbonara': ['Aglio Olio', 'Bolognese', 'Margherita Pizza'],
  'Butter Chicken': ['Tikka Masala', 'Naan', 'Biryani', 'Dal'],
  'Mee Goreng': ['Char Kway Teow', 'Pad Thai', 'Wonton Noodles'],
  'Roti Canai': ['Naan', 'Paratha', 'Chapati'],
  'Satay': ['Kebab', 'Yakitori', 'Grilled Chicken'],
  'Wonton Noodles': ['Pho', 'Laksa', 'Ramen'],
  'Bak Kut Teh': ['Tom Yum Soup', 'Pho', 'Wonton Noodles'],
  'Beef Rendang': ['Butter Chicken', 'Satay', 'Nasi Lemak'],
  'Margherita Pizza': ['Carbonara', 'Aglio Olio', 'Bruschetta'],
  'Plain Rice': ['Fried Rice', 'Congee', 'Bibimbap'],
  'Fried Rice': ['Nasi Goreng', 'Bibimbap', 'Plain Rice'],
}

function buildConfidenceExplanation(result) {
  const { confidence, dish } = result
  const restricted = result.ingredients.filter(i => i.restricted).length
  const total = result.ingredients.length
  const sourceCount = result.sources.length

  if (confidence >= 85) {
    return `Nibble cross-referenced ${sourceCount} recipes for ${dish} and found strong consistency across sources. ${restricted} out of ${total} common ingredients matched your restriction list.`
  } else if (confidence >= 70) {
    return `We scanned ${sourceCount} recipes for ${dish}. Most sources agree on the core ingredients, though some variations exist. ${restricted} out of ${total} ingredients flagged against your profile.`
  } else {
    return `We found ${sourceCount} recipes for ${dish}, but there's quite a bit of variation between sources. ${restricted} out of ${total} ingredients flagged. Your version may differ from what we found.`
  }
}

// Alias map — cooking oil NO LONGER maps to soy
const ingredientAliases = {
  'flat rice noodles': ['rice noodles', 'noodles', 'white rice', 'glutinous rice'],
  'prawns': ['prawns', 'shellfish', 'shrimp'],
  'cockles': ['cockles', 'shellfish', 'molluscs'],
  'chinese sausage (lap cheong)': ['processed meat', 'sausages', 'pork'],
  'bean sprouts': ['bean sprouts'],
  'chinese chives (ku chai)': ['chives'],
  'eggs': ['eggs'], 'egg yolk': ['eggs'],
  'dark soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'light soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'oyster sauce': ['oyster sauce', 'shellfish'],
  'fish sauce': ['fish sauce'],
  'chilli': ['chilli', 'spicy food', 'hot sauce', 'cayenne pepper'],
  'garlic': ['garlic'],
  'lard': ['lard', 'greasy foods', 'deep-fried foods', 'fatty foods'],
  'cooking oil': ['vegetable oil', 'corn oil', 'palm oil'],
  'cooking oil (for deep frying)': ['vegetable oil', 'deep-fried foods', 'fried foods'],
  'romaine lettuce': ['lettuce', 'salads', 'raw vegetables'],
  'parmesan cheese': ['parmesan', 'cheese', 'dairy', 'hard cheese'],
  'croutons': ['croutons', 'wheat', 'bread', 'gluten'],
  'anchovy (in dressing)': ['anchovies', 'fish'],
  'lemon juice': ['lemon', 'citrus'], 'lemon': ['lemon', 'citrus'],
  'lime juice': ['lime', 'citrus'],
  'olive oil': ['olive oil'],
  'worcestershire sauce': ['worcestershire'],
  'black pepper': ['black pepper'],
  'dijon mustard': ['mustard'],
  'white fish (sea bass / grouper)': ['fish'],
  'white fish (cod/haddock)': ['fish'],
  'white fish': ['fish'],
  'raw fish (salmon/tuna)': ['fish', 'sashimi', 'raw foods'],
  'ginger': ['ginger', 'fresh ginger'],
  'spring onion': ['spring onion', 'onion', 'shallots'],
  'sesame oil': ['sesame oil', 'sesame'],
  'shaoxing wine': ['alcohol', 'wine'],
  'beer (in batter)': ['alcohol', 'beer'],
  'coriander': ['coriander'],
  'sugar': ['sugar', 'refined sugar'],
  'palm sugar': ['sugar', 'refined sugar'],
  'salt': ['salt', 'sodium'],
  'onion': ['onion', 'shallots'],
  'soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'white rice': ['white rice', 'glutinous rice'],
  'jasmine rice': ['white rice'],
  'sushi rice': ['white rice'],
  'rice': ['white rice', 'rice'],
  'water': [],
  'chicken': ['chicken', 'poultry'],
  'chicken thigh': ['chicken', 'poultry'],
  'chicken fat': ['chicken', 'fatty foods'],
  'pork': ['pork'], 'pork ribs': ['pork'],
  'pork belly': ['pork'],
  'ground beef': ['beef', 'red meat'],
  'beef': ['beef', 'red meat'],
  'tofu': ['tofu', 'soy'],
  'tofu puffs': ['tofu', 'soy'],
  'coconut milk': ['coconut milk', 'coconut'],
  'curry paste': ['curry paste', 'spicy food'],
  'laksa paste': ['curry paste', 'spicy food', 'shrimp paste'],
  'gochujang (chilli paste)': ['chilli', 'spicy food'],
  'chilli sauce': ['chilli', 'spicy food', 'hot sauce'],
  'tamarind': ['tamarind'],
  'peanuts': ['peanuts', 'tree nuts'],
  'dried shrimp': ['shrimp', 'shellfish', 'prawns'],
  'rice noodles': ['rice noodles', 'noodles', 'white rice'],
  'yellow noodles': ['noodles', 'wheat', 'gluten'],
  'egg noodles': ['noodles', 'wheat', 'gluten', 'eggs'],
  'wonton wrappers': ['wheat', 'gluten'],
  'spaghetti': ['pasta', 'wheat', 'gluten'],
  'flour': ['wheat', 'gluten', 'bread'],
  'guanciale': ['pork', 'processed meat'],
  'pancetta': ['pork', 'processed meat', 'bacon'],
  'pecorino romano': ['cheese', 'dairy'],
  'mozzarella': ['cheese', 'dairy'],
  'butter': ['butter', 'dairy'],
  'cream': ['cream', 'dairy'],
  'ghee': ['ghee', 'dairy'],
  'condensed milk': ['condensed milk', 'dairy', 'milk'],
  'sambal': ['chilli', 'spicy food'],
  'belacan': ['shrimp paste', 'shellfish'],
  'ikan bilis': ['anchovies', 'fish'],
  'pandan leaf': ['pandan'],
  'fish cake': ['fish'],
  'tomato': ['tomato'],
  'tomato sauce': ['tomato', 'tomato sauce'],
  'nori (seaweed)': ['seaweed'],
  'wasabi': ['wasabi', 'spicy food'],
  'pickled ginger': ['ginger'],
  'rice vinegar': ['vinegar'],
  'yeast': ['yeast'],
  'baking powder': ['baking powder'],
  'bread': ['bread', 'wheat', 'gluten'],
  'lettuce': ['lettuce', 'salads'],
  'spinach': ['spinach'],
  'mushrooms': ['mushrooms'],
  'noodles': ['noodles'],
  'cucumber': ['cucumber'],
  'chrysanthemum': ['chrysanthemum'],
  'hawthorn': ['hawthorn'],
  'goji berries': ['goji berries', 'goji'],
}

function matchRestrictions(ingredientName, avoidList) {
  const lowerName = ingredientName.toLowerCase()
  const lowerAvoidList = avoidList.map(a => a.toLowerCase())

  for (const avoided of lowerAvoidList) {
    if (lowerName.includes(avoided) || avoided.includes(lowerName)) {
      return { restricted: true, reason: `${avoided} — on your avoid list` }
    }
  }

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

// ---- DISH DATABASE ----
const dishDatabase = {
  'char kway teow': {
    dish: 'Char Kway Teow', confidence: 87, confidenceLevel: 'high',
    ingredients: [
      { name: 'flat rice noodles', category: 'carbs' }, { name: 'prawns', category: 'protein' },
      { name: 'cockles', category: 'protein' }, { name: 'Chinese sausage (lap cheong)', category: 'protein' },
      { name: 'bean sprouts', category: 'vegetable' }, { name: 'Chinese chives (ku chai)', category: 'vegetable' },
      { name: 'eggs', category: 'protein' }, { name: 'dark soy sauce', category: 'sauce' },
      { name: 'light soy sauce', category: 'sauce' }, { name: 'oyster sauce', category: 'sauce' },
      { name: 'fish sauce', category: 'sauce' }, { name: 'chilli', category: 'spice' },
      { name: 'garlic', category: 'spice' }, { name: 'lard', category: 'fat' },
    ],
    sources: [
      { name: 'Penang Char Kway Teow', url: 'https://thewoksoflife.com/char-kway-teow/', site: 'thewoksoflife.com' },
      { name: 'Char Kway Teow', url: 'https://www.recipetineats.com/char-kway-teow/', site: 'recipetineats.com' },
      { name: 'Char Kuey Teow', url: 'https://rasamalaysia.com/char-kuey-teow-recipe/', site: 'rasamalaysia.com' },
      { name: 'Char Kway Teow', url: 'https://www.seriouseats.com/char-kway-teow-malaysian-stir-fried-rice-noodles-recipe', site: 'seriouseats.com' },
    ],
  },
  'caesar salad': {
    dish: 'Caesar Salad', confidence: 92, confidenceLevel: 'high',
    ingredients: [
      { name: 'romaine lettuce', category: 'vegetable' }, { name: 'parmesan cheese', category: 'dairy' },
      { name: 'croutons', category: 'carbs' }, { name: 'anchovy (in dressing)', category: 'protein' },
      { name: 'egg yolk', category: 'protein' }, { name: 'garlic', category: 'spice' },
      { name: 'lemon juice', category: 'acid' }, { name: 'olive oil', category: 'fat' },
      { name: 'Worcestershire sauce', category: 'sauce' }, { name: 'dijon mustard', category: 'sauce' },
      { name: 'black pepper', category: 'spice' },
    ],
    sources: [
      { name: 'The Best Caesar Salad', url: 'https://www.seriouseats.com/the-best-caesar-salad-recipe', site: 'seriouseats.com' },
      { name: 'Classic Caesar Salad', url: 'https://www.bonappetit.com/recipe/classic-caesar-salad', site: 'bonappetit.com' },
      { name: 'Caesar Salad', url: 'https://www.recipetineats.com/caesar-salad/', site: 'recipetineats.com' },
      { name: 'Caesar Salad', url: 'https://www.foodnetwork.com/recipes/bobby-flay/caesar-salad-recipe-1942741', site: 'foodnetwork.com' },
    ],
  },
  'steamed fish': {
    dish: 'Steamed Fish (Cantonese-style)', confidence: 90, confidenceLevel: 'high',
    ingredients: [
      { name: 'white fish (sea bass / grouper)', category: 'protein' }, { name: 'ginger', category: 'spice' },
      { name: 'spring onion', category: 'vegetable' }, { name: 'light soy sauce', category: 'sauce' },
      { name: 'sesame oil', category: 'fat' }, { name: 'shaoxing wine', category: 'liquid' },
      { name: 'sugar', category: 'seasoning' }, { name: 'coriander', category: 'herb' },
      { name: 'cooking oil', category: 'fat' },
    ],
    sources: [
      { name: 'Cantonese Steamed Fish', url: 'https://thewoksoflife.com/steamed-whole-fish/', site: 'thewoksoflife.com' },
      { name: 'Chinese Steamed Fish', url: 'https://www.chinasichuanfood.com/chinese-steamed-fish/', site: 'chinasichuanfood.com' },
      { name: 'Chinese Steamed Fish', url: 'https://www.recipetineats.com/chinese-steamed-fish/', site: 'recipetineats.com' },
      { name: 'Cantonese Steamed Fish', url: 'https://www.taste.com.au/recipes/cantonese-style-steamed-fish/d93ab0f9-2686-4a76-bea0-cc920d5e0e9f', site: 'taste.com.au' },
    ],
  },
  'plain rice': {
    dish: 'Plain Rice', confidence: 95, confidenceLevel: 'high',
    ingredients: [
      { name: 'white rice', category: 'carbs' },
      { name: 'water', category: 'liquid' },
    ],
    sources: [
      { name: 'How to Cook Rice', url: 'https://www.simplyrecipes.com/recipes/how_to_make_rice/', site: 'simplyrecipes.com' },
      { name: 'Perfect Steamed Rice', url: 'https://www.recipetineats.com/how-to-cook-rice/', site: 'recipetineats.com' },
      { name: 'Fluffy White Rice', url: 'https://www.allrecipes.com/recipe/17245/perfect-rice/', site: 'allrecipes.com' },
    ],
  },
  'fried rice': {
    dish: 'Fried Rice', confidence: 85, confidenceLevel: 'high',
    ingredients: [
      { name: 'white rice', category: 'carbs' }, { name: 'eggs', category: 'protein' },
      { name: 'cooking oil', category: 'fat' }, { name: 'garlic', category: 'spice' },
      { name: 'light soy sauce', category: 'sauce' }, { name: 'spring onion', category: 'vegetable' },
      { name: 'salt', category: 'seasoning' }, { name: 'white pepper', category: 'spice' },
      { name: 'sesame oil', category: 'fat' },
    ],
    sources: [
      { name: 'Chinese Fried Rice', url: 'https://thewoksoflife.com/chinese-fried-rice/', site: 'thewoksoflife.com' },
      { name: 'Egg Fried Rice', url: 'https://www.recipetineats.com/chinese-fried-rice/', site: 'recipetineats.com' },
      { name: 'Fried Rice', url: 'https://www.seriouseats.com/easy-vegetable-fried-rice-recipe', site: 'seriouseats.com' },
    ],
  },
  'bibimbap': {
    dish: 'Bibimbap', confidence: 88, confidenceLevel: 'high',
    ingredients: [
      { name: 'white rice', category: 'carbs' }, { name: 'ground beef', category: 'protein' },
      { name: 'eggs', category: 'protein' }, { name: 'spinach', category: 'vegetable' },
      { name: 'bean sprouts', category: 'vegetable' }, { name: 'carrots', category: 'vegetable' },
      { name: 'zucchini', category: 'vegetable' }, { name: 'gochujang (chilli paste)', category: 'sauce' },
      { name: 'soy sauce', category: 'sauce' }, { name: 'sesame oil', category: 'fat' },
      { name: 'garlic', category: 'spice' }, { name: 'sesame seeds', category: 'seasoning' },
    ],
    sources: [
      { name: 'Bibimbap', url: 'https://www.maangchi.com/recipe/bibimbap', site: 'maangchi.com' },
      { name: 'Korean Bibimbap', url: 'https://www.recipetineats.com/bibimbap/', site: 'recipetineats.com' },
      { name: 'Classic Bibimbap', url: 'https://www.seriouseats.com/bibimbap-recipe', site: 'seriouseats.com' },
      { name: 'Bibimbap', url: 'https://www.bonappetit.com/recipe/bibimbap', site: 'bonappetit.com' },
    ],
  },
  'pad thai': {
    dish: 'Pad Thai', confidence: 90, confidenceLevel: 'high',
    ingredients: [
      { name: 'rice noodles', category: 'carbs' }, { name: 'prawns', category: 'protein' },
      { name: 'tofu', category: 'protein' }, { name: 'eggs', category: 'protein' },
      { name: 'bean sprouts', category: 'vegetable' }, { name: 'garlic', category: 'spice' },
      { name: 'tamarind', category: 'sauce' }, { name: 'fish sauce', category: 'sauce' },
      { name: 'palm sugar', category: 'seasoning' }, { name: 'peanuts', category: 'protein' },
      { name: 'lime juice', category: 'acid' }, { name: 'dried shrimp', category: 'protein' },
      { name: 'spring onion', category: 'vegetable' }, { name: 'cooking oil', category: 'fat' },
    ],
    sources: [
      { name: 'Pad Thai', url: 'https://www.recipetineats.com/pad-thai-recipe/', site: 'recipetineats.com' },
      { name: 'Pad Thai', url: 'https://www.seriouseats.com/pad-thai-recipe', site: 'seriouseats.com' },
      { name: 'Best Pad Thai', url: 'https://thewoksoflife.com/pad-thai/', site: 'thewoksoflife.com' },
      { name: 'Authentic Pad Thai', url: 'https://hot-thai-kitchen.com/pad-thai-recipe/', site: 'hot-thai-kitchen.com' },
    ],
  },
  'laksa': {
    dish: 'Laksa', confidence: 86, confidenceLevel: 'high',
    ingredients: [
      { name: 'rice noodles', category: 'carbs' }, { name: 'prawns', category: 'protein' },
      { name: 'tofu puffs', category: 'protein' }, { name: 'fish cake', category: 'protein' },
      { name: 'coconut milk', category: 'liquid' }, { name: 'laksa paste', category: 'sauce' },
      { name: 'bean sprouts', category: 'vegetable' }, { name: 'dried shrimp', category: 'protein' },
      { name: 'lemongrass', category: 'herb' }, { name: 'galangal', category: 'spice' },
      { name: 'chilli', category: 'spice' }, { name: 'fish sauce', category: 'sauce' },
      { name: 'cooking oil', category: 'fat' },
    ],
    sources: [
      { name: 'Laksa', url: 'https://www.recipetineats.com/laksa-recipe/', site: 'recipetineats.com' },
      { name: 'Curry Laksa', url: 'https://rasamalaysia.com/curry-laksa/', site: 'rasamalaysia.com' },
      { name: 'Laksa', url: 'https://www.sbs.com.au/food/recipes/laksa', site: 'sbs.com.au' },
    ],
  },
  'hainanese chicken rice': {
    dish: 'Hainanese Chicken Rice', confidence: 91, confidenceLevel: 'high',
    ingredients: [
      { name: 'chicken', category: 'protein' }, { name: 'jasmine rice', category: 'carbs' },
      { name: 'ginger', category: 'spice' }, { name: 'garlic', category: 'spice' },
      { name: 'spring onion', category: 'vegetable' }, { name: 'sesame oil', category: 'fat' },
      { name: 'pandan leaf', category: 'herb' }, { name: 'chicken fat', category: 'fat' },
      { name: 'salt', category: 'seasoning' }, { name: 'cucumber', category: 'vegetable' },
      { name: 'dark soy sauce', category: 'sauce' }, { name: 'chilli sauce', category: 'sauce' },
    ],
    sources: [
      { name: 'Hainanese Chicken Rice', url: 'https://thewoksoflife.com/hainanese-chicken-rice/', site: 'thewoksoflife.com' },
      { name: 'Chicken Rice', url: 'https://rasamalaysia.com/hainanese-chicken-rice/', site: 'rasamalaysia.com' },
      { name: 'Singapore Chicken Rice', url: 'https://www.recipetineats.com/hainanese-chicken-rice/', site: 'recipetineats.com' },
    ],
  },
  'nasi lemak': {
    dish: 'Nasi Lemak', confidence: 89, confidenceLevel: 'high',
    ingredients: [
      { name: 'jasmine rice', category: 'carbs' }, { name: 'coconut milk', category: 'liquid' },
      { name: 'pandan leaf', category: 'herb' }, { name: 'ikan bilis', category: 'protein' },
      { name: 'peanuts', category: 'protein' }, { name: 'eggs', category: 'protein' },
      { name: 'cucumber', category: 'vegetable' }, { name: 'sambal', category: 'sauce' },
      { name: 'belacan', category: 'sauce' }, { name: 'chilli', category: 'spice' },
      { name: 'cooking oil', category: 'fat' },
    ],
    sources: [
      { name: 'Nasi Lemak', url: 'https://rasamalaysia.com/nasi-lemak/', site: 'rasamalaysia.com' },
      { name: 'Nasi Lemak', url: 'https://www.recipetineats.com/nasi-lemak/', site: 'recipetineats.com' },
      { name: 'Malaysian Nasi Lemak', url: 'https://thewoksoflife.com/nasi-lemak/', site: 'thewoksoflife.com' },
    ],
  },
  'tom yum soup': {
    dish: 'Tom Yum Soup', confidence: 88, confidenceLevel: 'high',
    ingredients: [
      { name: 'prawns', category: 'protein' }, { name: 'lemongrass', category: 'herb' },
      { name: 'galangal', category: 'spice' }, { name: 'kaffir lime leaves', category: 'herb' },
      { name: 'chilli', category: 'spice' }, { name: 'fish sauce', category: 'sauce' },
      { name: 'lime juice', category: 'acid' }, { name: 'mushrooms', category: 'vegetable' },
      { name: 'tomato', category: 'vegetable' }, { name: 'coriander', category: 'herb' },
      { name: 'sugar', category: 'seasoning' },
    ],
    sources: [
      { name: 'Tom Yum Soup', url: 'https://hot-thai-kitchen.com/tom-yum-goong/', site: 'hot-thai-kitchen.com' },
      { name: 'Tom Yum', url: 'https://www.recipetineats.com/tom-yum-soup/', site: 'recipetineats.com' },
      { name: 'Tom Yum Goong', url: 'https://www.seriouseats.com/tom-yum-goong-recipe', site: 'seriouseats.com' },
    ],
  },
  'carbonara': {
    dish: 'Carbonara', confidence: 93, confidenceLevel: 'high',
    ingredients: [
      { name: 'spaghetti', category: 'carbs' }, { name: 'guanciale', category: 'protein' },
      { name: 'eggs', category: 'protein' }, { name: 'egg yolk', category: 'protein' },
      { name: 'pecorino romano', category: 'dairy' }, { name: 'black pepper', category: 'spice' },
      { name: 'salt', category: 'seasoning' },
    ],
    sources: [
      { name: 'Spaghetti Carbonara', url: 'https://www.seriouseats.com/spaghetti-carbonara-recipe', site: 'seriouseats.com' },
      { name: 'Classic Carbonara', url: 'https://www.bonappetit.com/recipe/spaghetti-carbonara', site: 'bonappetit.com' },
      { name: 'Carbonara', url: 'https://www.recipetineats.com/carbonara/', site: 'recipetineats.com' },
    ],
  },
  'butter chicken': {
    dish: 'Butter Chicken', confidence: 90, confidenceLevel: 'high',
    ingredients: [
      { name: 'chicken thigh', category: 'protein' }, { name: 'butter', category: 'dairy' },
      { name: 'cream', category: 'dairy' }, { name: 'tomato', category: 'vegetable' },
      { name: 'onion', category: 'vegetable' }, { name: 'garlic', category: 'spice' },
      { name: 'ginger', category: 'spice' }, { name: 'garam masala', category: 'spice' },
      { name: 'chilli', category: 'spice' }, { name: 'cumin', category: 'spice' },
      { name: 'coriander', category: 'herb' }, { name: 'sugar', category: 'seasoning' },
      { name: 'salt', category: 'seasoning' },
    ],
    sources: [
      { name: 'Butter Chicken', url: 'https://www.recipetineats.com/butter-chicken/', site: 'recipetineats.com' },
      { name: 'Butter Chicken', url: 'https://www.seriouseats.com/butter-chicken-recipe', site: 'seriouseats.com' },
      { name: 'Murgh Makhani', url: 'https://www.bonappetit.com/recipe/bas-best-butter-chicken', site: 'bonappetit.com' },
    ],
  },
  'pho': {
    dish: 'Pho', confidence: 89, confidenceLevel: 'high',
    ingredients: [
      { name: 'rice noodles', category: 'carbs' }, { name: 'beef', category: 'protein' },
      { name: 'star anise', category: 'spice' }, { name: 'cinnamon', category: 'spice' },
      { name: 'ginger', category: 'spice' }, { name: 'onion', category: 'vegetable' },
      { name: 'fish sauce', category: 'sauce' }, { name: 'bean sprouts', category: 'vegetable' },
      { name: 'basil', category: 'herb' }, { name: 'lime juice', category: 'acid' },
      { name: 'spring onion', category: 'vegetable' }, { name: 'coriander', category: 'herb' },
    ],
    sources: [
      { name: 'Pho', url: 'https://www.recipetineats.com/vietnamese-pho/', site: 'recipetineats.com' },
      { name: 'Vietnamese Pho', url: 'https://www.seriouseats.com/pho-recipe', site: 'seriouseats.com' },
      { name: 'Pho Bo', url: 'https://www.bonappetit.com/recipe/pho-bo-vietnamese-beef-noodle-soup', site: 'bonappetit.com' },
    ],
  },
  'sushi': {
    dish: 'Sushi', confidence: 91, confidenceLevel: 'high',
    ingredients: [
      { name: 'sushi rice', category: 'carbs' }, { name: 'rice vinegar', category: 'acid' },
      { name: 'sugar', category: 'seasoning' }, { name: 'salt', category: 'seasoning' },
      { name: 'nori (seaweed)', category: 'vegetable' }, { name: 'raw fish (salmon/tuna)', category: 'protein' },
      { name: 'soy sauce', category: 'sauce' }, { name: 'wasabi', category: 'spice' },
      { name: 'pickled ginger', category: 'spice' },
    ],
    sources: [
      { name: 'Sushi Rice', url: 'https://www.justonecookbook.com/how-to-make-sushi-rice/', site: 'justonecookbook.com' },
      { name: 'Sushi at Home', url: 'https://www.seriouseats.com/sushi-rice-recipe', site: 'seriouseats.com' },
      { name: 'Homemade Sushi', url: 'https://www.recipetineats.com/sushi-rice/', site: 'recipetineats.com' },
    ],
  },
  'fish and chips': {
    dish: 'Fish and Chips', confidence: 92, confidenceLevel: 'high',
    ingredients: [
      { name: 'white fish (cod/haddock)', category: 'protein' }, { name: 'flour', category: 'carbs' },
      { name: 'beer (in batter)', category: 'liquid' }, { name: 'potatoes', category: 'carbs' },
      { name: 'cooking oil (for deep frying)', category: 'fat' }, { name: 'salt', category: 'seasoning' },
      { name: 'black pepper', category: 'spice' }, { name: 'lemon', category: 'acid' },
      { name: 'baking powder', category: 'carbs' },
    ],
    sources: [
      { name: 'Fish and Chips', url: 'https://www.recipetineats.com/crispy-beer-battered-fish/', site: 'recipetineats.com' },
      { name: 'Fish and Chips', url: 'https://www.seriouseats.com/beer-battered-fish-and-chips-recipe', site: 'seriouseats.com' },
      { name: 'British Fish and Chips', url: 'https://www.bbcgoodfood.com/recipes/next-level-fish-chips', site: 'bbcgoodfood.com' },
    ],
  },
  'margherita pizza': {
    dish: 'Margherita Pizza', confidence: 94, confidenceLevel: 'high',
    ingredients: [
      { name: 'flour', category: 'carbs' }, { name: 'yeast', category: 'carbs' },
      { name: 'olive oil', category: 'fat' }, { name: 'tomato sauce', category: 'sauce' },
      { name: 'mozzarella', category: 'dairy' }, { name: 'basil', category: 'herb' },
      { name: 'salt', category: 'seasoning' }, { name: 'sugar', category: 'seasoning' },
    ],
    sources: [
      { name: 'Margherita Pizza', url: 'https://www.seriouseats.com/the-best-neapolitan-margherita-pizza-recipe', site: 'seriouseats.com' },
      { name: 'Classic Margherita', url: 'https://www.bonappetit.com/recipe/pizza-margherita', site: 'bonappetit.com' },
      { name: 'Margherita', url: 'https://www.recipetineats.com/margherita-pizza/', site: 'recipetineats.com' },
    ],
  },
  'congee': {
    dish: 'Congee', confidence: 90, confidenceLevel: 'high',
    ingredients: [
      { name: 'white rice', category: 'carbs' }, { name: 'water', category: 'liquid' },
      { name: 'ginger', category: 'spice' }, { name: 'salt', category: 'seasoning' },
      { name: 'spring onion', category: 'vegetable' }, { name: 'sesame oil', category: 'fat' },
      { name: 'white pepper', category: 'spice' },
    ],
    sources: [
      { name: 'Chinese Congee', url: 'https://thewoksoflife.com/chinese-congee/', site: 'thewoksoflife.com' },
      { name: 'Rice Porridge', url: 'https://www.recipetineats.com/congee-recipe/', site: 'recipetineats.com' },
    ],
  },
  'beef rendang': {
    dish: 'Beef Rendang', confidence: 87, confidenceLevel: 'high',
    ingredients: [
      { name: 'beef', category: 'protein' }, { name: 'coconut milk', category: 'liquid' },
      { name: 'lemongrass', category: 'herb' }, { name: 'galangal', category: 'spice' },
      { name: 'garlic', category: 'spice' }, { name: 'onion', category: 'vegetable' },
      { name: 'chilli', category: 'spice' }, { name: 'turmeric', category: 'spice' },
      { name: 'ginger', category: 'spice' }, { name: 'kaffir lime leaves', category: 'herb' },
      { name: 'sugar', category: 'seasoning' }, { name: 'salt', category: 'seasoning' },
    ],
    sources: [
      { name: 'Beef Rendang', url: 'https://rasamalaysia.com/beef-rendang-recipe/', site: 'rasamalaysia.com' },
      { name: 'Rendang', url: 'https://www.recipetineats.com/beef-rendang/', site: 'recipetineats.com' },
      { name: 'Indonesian Rendang', url: 'https://www.seriouseats.com/rendang-recipe', site: 'seriouseats.com' },
    ],
  },
  'mee goreng': {
    dish: 'Mee Goreng', confidence: 85, confidenceLevel: 'high',
    ingredients: [
      { name: 'yellow noodles', category: 'carbs' }, { name: 'prawns', category: 'protein' },
      { name: 'tofu', category: 'protein' }, { name: 'eggs', category: 'protein' },
      { name: 'bean sprouts', category: 'vegetable' }, { name: 'chilli', category: 'spice' },
      { name: 'garlic', category: 'spice' }, { name: 'soy sauce', category: 'sauce' },
      { name: 'tomato sauce', category: 'sauce' }, { name: 'cooking oil', category: 'fat' },
      { name: 'spring onion', category: 'vegetable' },
    ],
    sources: [
      { name: 'Mee Goreng', url: 'https://rasamalaysia.com/mee-goreng/', site: 'rasamalaysia.com' },
      { name: 'Mee Goreng', url: 'https://www.recipetineats.com/mee-goreng/', site: 'recipetineats.com' },
    ],
  },
  'satay': {
    dish: 'Satay', confidence: 89, confidenceLevel: 'high',
    ingredients: [
      { name: 'chicken thigh', category: 'protein' }, { name: 'turmeric', category: 'spice' },
      { name: 'lemongrass', category: 'herb' }, { name: 'garlic', category: 'spice' },
      { name: 'sugar', category: 'seasoning' }, { name: 'salt', category: 'seasoning' },
      { name: 'peanuts', category: 'protein' }, { name: 'coconut milk', category: 'liquid' },
      { name: 'chilli', category: 'spice' }, { name: 'cooking oil', category: 'fat' },
    ],
    sources: [
      { name: 'Chicken Satay', url: 'https://rasamalaysia.com/chicken-satay/', site: 'rasamalaysia.com' },
      { name: 'Satay', url: 'https://www.recipetineats.com/chicken-satay/', site: 'recipetineats.com' },
      { name: 'Thai Satay', url: 'https://hot-thai-kitchen.com/chicken-satay/', site: 'hot-thai-kitchen.com' },
    ],
  },
  'wonton noodles': {
    dish: 'Wonton Noodles', confidence: 87, confidenceLevel: 'high',
    ingredients: [
      { name: 'egg noodles', category: 'carbs' }, { name: 'pork', category: 'protein' },
      { name: 'prawns', category: 'protein' }, { name: 'wonton wrappers', category: 'carbs' },
      { name: 'spring onion', category: 'vegetable' }, { name: 'sesame oil', category: 'fat' },
      { name: 'oyster sauce', category: 'sauce' }, { name: 'light soy sauce', category: 'sauce' },
      { name: 'dark soy sauce', category: 'sauce' }, { name: 'ginger', category: 'spice' },
    ],
    sources: [
      { name: 'Wonton Noodle Soup', url: 'https://thewoksoflife.com/wonton-noodle-soup/', site: 'thewoksoflife.com' },
      { name: 'Wonton Noodles', url: 'https://www.recipetineats.com/wonton-noodle-soup/', site: 'recipetineats.com' },
    ],
  },
  'bak kut teh': {
    dish: 'Bak Kut Teh', confidence: 88, confidenceLevel: 'high',
    ingredients: [
      { name: 'pork ribs', category: 'protein' }, { name: 'garlic', category: 'spice' },
      { name: 'white pepper', category: 'spice' }, { name: 'star anise', category: 'spice' },
      { name: 'cinnamon', category: 'spice' }, { name: 'clove', category: 'spice' },
      { name: 'dark soy sauce', category: 'sauce' }, { name: 'light soy sauce', category: 'sauce' },
      { name: 'salt', category: 'seasoning' }, { name: 'lettuce', category: 'vegetable' },
    ],
    sources: [
      { name: 'Bak Kut Teh', url: 'https://rasamalaysia.com/bak-kut-teh/', site: 'rasamalaysia.com' },
      { name: 'Pork Rib Soup', url: 'https://thewoksoflife.com/bak-kut-teh/', site: 'thewoksoflife.com' },
    ],
  },
  'roti canai': {
    dish: 'Roti Canai', confidence: 90, confidenceLevel: 'high',
    ingredients: [
      { name: 'flour', category: 'carbs' }, { name: 'ghee', category: 'dairy' },
      { name: 'condensed milk', category: 'dairy' }, { name: 'salt', category: 'seasoning' },
      { name: 'sugar', category: 'seasoning' }, { name: 'water', category: 'liquid' },
      { name: 'eggs', category: 'protein' },
    ],
    sources: [
      { name: 'Roti Canai', url: 'https://rasamalaysia.com/roti-canai/', site: 'rasamalaysia.com' },
      { name: 'Malaysian Flatbread', url: 'https://www.recipetineats.com/roti-canai/', site: 'recipetineats.com' },
    ],
  },
};

// Smart fallback: infer ingredients from dish name keywords
const dishKeywordIngredients = {
  'rice': [{ name: 'white rice', category: 'carbs' }, { name: 'water', category: 'liquid' }, { name: 'salt', category: 'seasoning' }],
  'noodle': [{ name: 'noodles', category: 'carbs' }, { name: 'cooking oil', category: 'fat' }, { name: 'soy sauce', category: 'sauce' }, { name: 'garlic', category: 'spice' }, { name: 'spring onion', category: 'vegetable' }],
  'salad': [{ name: 'lettuce', category: 'vegetable' }, { name: 'olive oil', category: 'fat' }, { name: 'salt', category: 'seasoning' }, { name: 'black pepper', category: 'spice' }],
  'soup': [{ name: 'water', category: 'liquid' }, { name: 'salt', category: 'seasoning' }, { name: 'onion', category: 'vegetable' }, { name: 'garlic', category: 'spice' }],
  'chicken': [{ name: 'chicken', category: 'protein' }, { name: 'salt', category: 'seasoning' }, { name: 'black pepper', category: 'spice' }, { name: 'cooking oil', category: 'fat' }],
  'fish': [{ name: 'white fish', category: 'protein' }, { name: 'salt', category: 'seasoning' }, { name: 'lemon juice', category: 'acid' }],
  'beef': [{ name: 'beef', category: 'protein' }, { name: 'salt', category: 'seasoning' }, { name: 'black pepper', category: 'spice' }, { name: 'cooking oil', category: 'fat' }],
  'pork': [{ name: 'pork', category: 'protein' }, { name: 'salt', category: 'seasoning' }, { name: 'cooking oil', category: 'fat' }],
  'toast': [{ name: 'bread', category: 'carbs' }, { name: 'butter', category: 'dairy' }],
  'sandwich': [{ name: 'bread', category: 'carbs' }, { name: 'butter', category: 'dairy' }, { name: 'lettuce', category: 'vegetable' }],
  'curry': [{ name: 'curry paste', category: 'sauce' }, { name: 'coconut milk', category: 'liquid' }, { name: 'onion', category: 'vegetable' }, { name: 'garlic', category: 'spice' }, { name: 'cooking oil', category: 'fat' }],
  'stir': [{ name: 'cooking oil', category: 'fat' }, { name: 'garlic', category: 'spice' }, { name: 'soy sauce', category: 'sauce' }],
  'egg': [{ name: 'eggs', category: 'protein' }, { name: 'salt', category: 'seasoning' }, { name: 'cooking oil', category: 'fat' }],
}

function inferIngredients(dishName) {
  const lower = dishName.toLowerCase()
  let ingredients = []
  const added = new Set()
  for (const [keyword, items] of Object.entries(dishKeywordIngredients)) {
    if (lower.includes(keyword)) {
      for (const item of items) {
        if (!added.has(item.name)) { ingredients.push(item); added.add(item.name) }
      }
    }
  }
  if (ingredients.length === 0) {
    ingredients = [{ name: 'salt', category: 'seasoning' }, { name: 'cooking oil', category: 'fat' }]
  }
  return ingredients
}

function generateSmartSources(dishName) {
  const slug = dishName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return [
    { name: `${dishName} - RecipeTin Eats`, url: `https://www.recipetineats.com/${slug}/`, site: 'recipetineats.com' },
    { name: `${dishName} - Serious Eats`, url: `https://www.seriouseats.com/${slug}-recipe`, site: 'seriouseats.com' },
    { name: `${dishName} - BBC Good Food`, url: `https://www.bbcgoodfood.com/recipes/${slug}`, site: 'bbcgoodfood.com' },
  ]
}

export function generateMockResult(dishName, avoidList = []) {
  const known = dishDatabase[dishName.toLowerCase()]

  const baseData = known || {
    dish: dishName,
    confidence: 65,
    confidenceLevel: 'medium',
    ingredients: inferIngredients(dishName),
    sources: generateSmartSources(dishName),
  }

  const ingredients = baseData.ingredients.map(ing => {
    const { restricted, reason } = matchRestrictions(ing.name, avoidList)
    return { ...ing, restricted, reason }
  })

  const restrictedPercent = ingredients.length > 0
    ? (ingredients.filter(i => i.restricted).length / ingredients.length) * 100
    : 0

  const result = {
    ...baseData,
    ingredients,
    recipesScanned: baseData.sources.length,
    wittyComment: getWittyComment(restrictedPercent),
  }
  result.confidenceExplanation = buildConfidenceExplanation(result)
  return result
}

export const mockScanResults = dishDatabase;
