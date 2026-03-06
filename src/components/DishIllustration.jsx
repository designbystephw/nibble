// Hand-drawn style dish illustrations using inline SVGs
// Each illustration has a sketchy, whimsical feel

const illustrations = {
  noodles: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bowl */}
      <path d="M16 42C16 42 18 58 40 58C62 58 64 42 64 42" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 42H68" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Noodles */}
      <path d="M24 40C24 34 28 28 32 26C36 24 34 32 38 30C42 28 40 22 44 24C48 26 46 34 50 32C54 30 52 26 56 28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <path d="M20 38C22 32 26 30 30 32C34 34 32 28 36 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      {/* Chopsticks */}
      <path d="M50 18L36 44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M56 16L42 42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Steam */}
      <path d="M30 20C30 18 32 16 30 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M40 18C40 16 42 14 40 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  salad: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Bowl */}
      <path d="M14 44C14 44 18 60 40 60C62 60 66 44 66 44" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 44H70" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Lettuce leaves */}
      <path d="M24 42C22 36 26 28 32 26C38 24 36 34 40 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <path d="M36 30C38 24 44 22 48 26C52 30 48 36 52 38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <path d="M28 38C30 32 34 30 38 34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      {/* Crouton */}
      <rect x="44" y="30" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.5" transform="rotate(-10 44 30)" />
      {/* Cherry tomato */}
      <circle cx="30" cy="34" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M29 30C30 29 31 30 30 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  fish: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Plate */}
      <ellipse cx="40" cy="54" rx="28" ry="8" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      {/* Fish body */}
      <path d="M18 38C18 38 24 28 40 28C56 28 62 38 62 38C62 38 56 48 40 48C24 48 18 38 18 38Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Tail */}
      <path d="M14 38C10 32 10 44 14 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Eye */}
      <circle cx="52" cy="36" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="52.5" cy="35.5" r="1" fill="currentColor" />
      {/* Gills */}
      <path d="M46 32C44 36 44 40 46 44" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      {/* Steam */}
      <path d="M32 24C32 22 34 20 32 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M40 22C40 20 42 18 40 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      {/* Decorative lines on body */}
      <path d="M26 36C30 34 34 36 38 34" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  ),
  generic: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Plate */}
      <ellipse cx="40" cy="50" rx="26" ry="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="40" cy="50" rx="20" ry="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      {/* Food dome/mound */}
      <path d="M22 48C22 48 26 28 40 28C54 28 58 48 58 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Steam */}
      <path d="M32 24C32 22 34 18 32 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M40 22C40 20 42 16 40 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <path d="M48 24C48 22 50 18 48 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      {/* Garnish */}
      <path d="M36 34C38 30 42 30 44 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
}

// Map dish names to illustration categories
const dishToCategory = {
  'char kway teow': 'noodles',
  'pad thai': 'noodles',
  'laksa': 'noodles',
  'pho': 'noodles',
  'carbonara': 'noodles',
  'mee goreng': 'noodles',
  'wonton noodles': 'noodles',
  'caesar salad': 'salad',
  'steamed fish': 'fish',
  'steamed fish (cantonese-style)': 'fish',
  'fish and chips': 'fish',
}

export default function DishIllustration({ dishName, className = '' }) {
  const category = dishToCategory[dishName.toLowerCase()] || 'generic'
  const illustration = illustrations[category] || illustrations.generic

  return (
    <div className={`text-indigo-muted ${className}`}>
      {illustration}
    </div>
  )
}
