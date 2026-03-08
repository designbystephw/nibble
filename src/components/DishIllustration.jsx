// Dish illustrations using SVG files from /illustrations/ folder
// Falls back to category-based mapping

// Map dish names to illustration SVG filenames
const dishToIllustration = {
  // Noodle dishes -> bowl with steam
  'char kway teow': 'bowl-362832',
  'pad thai': 'bowl-362875',
  'laksa': 'bowl-362875',
  'pho': 'bowl-362832',
  'carbonara': 'food-362855',
  'mee goreng': 'bowl-362875',
  'wonton noodles': 'bowl-362832',
  'ramen': 'bowl-362832',
  // Rice dishes
  'plain rice': 'bowl-362832',
  'fried rice': 'cooking-362838',
  'bibimbap': 'bowl-362875',
  'hainanese chicken rice': 'chicken-362851',
  'nasi lemak': 'cooking-362846',
  'congee': 'bowl-362832',
  // Salad
  'caesar salad': 'agriculture-362847',
  // Fish
  'steamed fish': 'fish-362829',
  'steamed fish (cantonese-style)': 'fish-362829',
  'fish and chips': 'fish-362829',
  'sushi': 'fish-362829',
  // Meat
  'beef rendang': 'beef-362811',
  'butter chicken': 'chicken-362851',
  'satay': 'barbecue-362818',
  'bak kut teh': 'cooking-362869',
  // Bread
  'roti canai': 'bread-362849',
  'margherita pizza': 'food-362848',
  // Drinks
  'coffee': 'coffee-362874',
  'tea': 'cup-362827',
  // Desserts
  'cake': 'cake-362809',
  'ice cream': 'cone-362823',
  // Soup
  'tom yum soup': 'bowl-362875',
}

// Category fallbacks
const categoryToIllustration = {
  noodles: 'bowl-362832',
  rice: 'bowl-362875',
  salad: 'agriculture-362847',
  fish: 'fish-362829',
  meat: 'beef-362811',
  chicken: 'chicken-362851',
  soup: 'bowl-362875',
  bread: 'bread-362849',
  vegetable: 'broccoli-362830',
  fruit: 'apple-362842',
  default: 'food-362850',
}

// Infer category from dish name keywords
function inferCategory(dishName) {
  const lower = dishName.toLowerCase()
  if (lower.includes('noodle') || lower.includes('pasta') || lower.includes('mee') || lower.includes('pho') || lower.includes('laksa')) return 'noodles'
  if (lower.includes('rice') || lower.includes('nasi') || lower.includes('congee')) return 'rice'
  if (lower.includes('salad')) return 'salad'
  if (lower.includes('fish') || lower.includes('sushi') || lower.includes('sashimi')) return 'fish'
  if (lower.includes('chicken') || lower.includes('bird') || lower.includes('duck')) return 'chicken'
  if (lower.includes('beef') || lower.includes('steak') || lower.includes('lamb') || lower.includes('pork')) return 'meat'
  if (lower.includes('soup') || lower.includes('broth') || lower.includes('stew')) return 'soup'
  if (lower.includes('bread') || lower.includes('toast') || lower.includes('roti') || lower.includes('pizza') || lower.includes('sandwich')) return 'bread'
  if (lower.includes('vegetable') || lower.includes('veg')) return 'vegetable'
  return 'default'
}

export default function DishIllustration({ dishName, className = '' }) {
  const lower = dishName.toLowerCase()
  const filename = dishToIllustration[lower]
    || categoryToIllustration[inferCategory(lower)]
    || categoryToIllustration.default

  return (
    <div className={className}>
      <img
        src={`/illustrations/${filename}.svg`}
        alt={dishName}
        className="w-full h-full object-contain"
      />
    </div>
  )
}
