// Scan service — tries real API first, falls back to mock data
import { generateMockResult } from '../data/mockScanResults'

// Ingredient alias map for matching against avoid list
const ingredientAliases = {
  'flat rice noodles': ['rice noodles', 'noodles', 'white rice', 'glutinous rice'],
  'prawns': ['prawns', 'shellfish', 'shrimp'],
  'cockles': ['cockles', 'shellfish', 'molluscs'],
  'chinese sausage (lap cheong)': ['processed meat', 'sausages', 'pork'],
  'bean sprouts': ['bean sprouts'],
  'chinese chives (ku chai)': ['chives'],
  'eggs': ['eggs'], 'egg yolk': ['eggs'], 'egg yolks': ['eggs'],
  'dark soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'light soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'soy sauce': ['soy sauce', 'soy sauce (excessive)', 'soy'],
  'oyster sauce': ['oyster sauce', 'shellfish'],
  'fish sauce': ['fish sauce'],
  'chilli': ['chilli', 'spicy food', 'hot sauce', 'cayenne pepper'],
  'chili': ['chilli', 'spicy food', 'hot sauce', 'cayenne pepper'],
  'garlic': ['garlic'],
  'lard': ['lard', 'greasy foods', 'deep-fried foods', 'fatty foods'],
  'cooking oil': ['vegetable oil', 'corn oil', 'palm oil'],
  'vegetable oil': ['vegetable oil', 'corn oil'],
  'romaine lettuce': ['lettuce', 'salads', 'raw vegetables'],
  'parmesan cheese': ['parmesan', 'cheese', 'dairy', 'hard cheese'],
  'parmesan': ['parmesan', 'cheese', 'dairy'],
  'croutons': ['croutons', 'wheat', 'bread', 'gluten'],
  'anchovy': ['anchovies', 'fish'],
  'anchovies': ['anchovies', 'fish'],
  'lemon juice': ['lemon', 'citrus'],
  'lime juice': ['lime', 'citrus'],
  'olive oil': ['olive oil'],
  'sesame oil': ['sesame oil', 'sesame'],
  'shaoxing wine': ['alcohol', 'wine'],
  'rice wine': ['alcohol', 'wine'],
  'beer': ['alcohol', 'beer'],
  'white wine': ['alcohol', 'wine'],
  'sugar': ['sugar', 'refined sugar'],
  'palm sugar': ['sugar', 'refined sugar'],
  'brown sugar': ['sugar', 'refined sugar'],
  'salt': ['salt', 'sodium'],
  'onion': ['onion', 'shallots'],
  'shallots': ['shallots', 'onion'],
  'spring onion': ['spring onion', 'onion', 'shallots'],
  'white rice': ['white rice', 'glutinous rice'],
  'jasmine rice': ['white rice'],
  'sushi rice': ['white rice'],
  'rice': ['white rice', 'rice'],
  'chicken': ['chicken', 'poultry'],
  'chicken thigh': ['chicken', 'poultry'],
  'chicken breast': ['chicken', 'poultry'],
  'pork': ['pork'], 'pork ribs': ['pork'], 'pork belly': ['pork'],
  'ground beef': ['beef', 'red meat'],
  'beef': ['beef', 'red meat'],
  'lamb': ['lamb', 'red meat'],
  'tofu': ['tofu', 'soy'],
  'coconut milk': ['coconut milk', 'coconut'],
  'coconut cream': ['coconut milk', 'coconut'],
  'curry paste': ['curry paste', 'spicy food'],
  'gochujang': ['chilli', 'spicy food'],
  'peanuts': ['peanuts', 'tree nuts'],
  'peanut butter': ['peanuts', 'tree nuts'],
  'cashews': ['cashews', 'tree nuts'],
  'almonds': ['almonds', 'tree nuts'],
  'dried shrimp': ['shrimp', 'shellfish', 'prawns'],
  'rice noodles': ['rice noodles', 'noodles', 'white rice'],
  'yellow noodles': ['noodles', 'wheat', 'gluten'],
  'egg noodles': ['noodles', 'wheat', 'gluten', 'eggs'],
  'spaghetti': ['pasta', 'wheat', 'gluten'],
  'pasta': ['pasta', 'wheat', 'gluten'],
  'flour': ['wheat', 'gluten', 'bread'],
  'wheat flour': ['wheat', 'gluten', 'bread'],
  'bread': ['bread', 'wheat', 'gluten'],
  'butter': ['butter', 'dairy'],
  'cream': ['cream', 'dairy'],
  'milk': ['milk', 'dairy'],
  'cheese': ['cheese', 'dairy'],
  'mozzarella': ['cheese', 'dairy'],
  'yoghurt': ['yoghurt', 'dairy'],
  'ghee': ['ghee', 'dairy'],
  'sambal': ['chilli', 'spicy food'],
  'ginger': ['ginger', 'fresh ginger'],
  'mushrooms': ['mushrooms'],
  'tomato': ['tomato'],
  'tomato sauce': ['tomato', 'tomato sauce'],
  'nori': ['seaweed'],
  'seaweed': ['seaweed'],
  'wasabi': ['wasabi', 'spicy food'],
  'coriander': ['coriander'],
  'basil': ['basil'],
  'cumin': ['cumin'],
  'turmeric': ['turmeric'],
  'cinnamon': ['cinnamon'],
  'star anise': ['star anise'],
  'black pepper': ['black pepper'],
  'white pepper': ['white pepper'],
}

function matchRestrictions(ingredientName, avoidList) {
  const lowerName = ingredientName.toLowerCase()
  const lowerAvoidList = avoidList.map(a => a.toLowerCase())

  // Direct match
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

const wittyFallbacks = {
  safe: [
    "Your mum would actually approve of this one.",
    "Go for it — your gut will thank you.",
    "Green light. Enjoy without the guilt trip.",
  ],
  caution: [
    "Not a disaster, but maybe don't make it a daily habit.",
    "It's a maybe — like texting your ex, proceed with caution.",
    "Treat yourself, but maybe skip the seconds.",
  ],
  danger: [
    "This one's a minefield for your diet. Maybe sit this one out.",
    "Your body called — it said absolutely not.",
    "If your diet had a nemesis, this would be it.",
  ],
}

function getWittyComment(restrictedPercent) {
  const pool = restrictedPercent > 40 ? wittyFallbacks.danger
    : restrictedPercent > 20 ? wittyFallbacks.caution
    : wittyFallbacks.safe
  return pool[Math.floor(Math.random() * pool.length)]
}

function buildConfidenceExplanation(result) {
  const restricted = result.ingredients.filter(i => i.restricted).length
  const total = result.ingredients.length
  const sourceCount = result.sources.length

  if (result.confidence >= 85) {
    return `Nibble cross-referenced ${sourceCount} recipes for ${result.dish} and found strong consistency across sources. ${restricted} out of ${total} common ingredients matched your restriction list.`
  } else if (result.confidence >= 70) {
    return `We scanned ${sourceCount} recipes for ${result.dish}. Most sources agree on the core ingredients, though some variations exist. ${restricted} out of ${total} ingredients flagged against your profile.`
  } else {
    return `Nibble cross-referenced ${sourceCount} recipes for ${result.dish} and found low consistency across sources. ${restricted} out of ${total} common ingredients matched your restrictions list.`
  }
}

export async function scanDish(dishName, avoidList = []) {
  // Try real API first
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dish: dishName }),
    })

    if (response.ok) {
      const apiResult = await response.json()

      // Process ingredients against avoid list
      const ingredients = (apiResult.ingredients || []).map(ing => {
        const { restricted, reason } = matchRestrictions(ing.name, avoidList)
        return { ...ing, restricted, reason }
      })

      const restrictedPercent = ingredients.length > 0
        ? (ingredients.filter(i => i.restricted).length / ingredients.length) * 100
        : 0

      const result = {
        dish: apiResult.dish || dishName,
        confidence: apiResult.confidence || 75,
        ingredients,
        sources: apiResult.sources || [],
        recipesScanned: (apiResult.sources || []).length,
        wittyComment: apiResult.wittyComment || getWittyComment(restrictedPercent),
      }
      result.confidenceExplanation = buildConfidenceExplanation(result)
      return result
    }
  } catch (err) {
    console.warn('API scan failed, falling back to mock data:', err.message)
  }

  // Fallback to mock
  return generateMockResult(dishName, avoidList)
}
