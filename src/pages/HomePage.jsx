import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ProfileBadge from '../components/ProfileBadge'
import FavouritesCarousel from '../components/FavouritesCarousel'
import RecentSearches from '../components/RecentSearches'
import OnigiriIcon from '../components/OnigiriIcon'
import { useProfile } from '../context/ProfileContext'
import { popularDishes } from '../data/dietPresets'
import { dishSimilarity } from '../data/mockScanResults'

export default function HomePage() {
  const { searchHistory } = useProfile()

  // Dynamic suggestions: pick similar dishes to recently searched, or random popular ones
  const suggestions = useMemo(() => {
    const recentDishNames = searchHistory.slice(0, 3).map(r => r.dish)
    const similarSet = new Set()

    // Get similar dishes based on recent searches
    for (const dish of recentDishNames) {
      const similar = dishSimilarity[dish] || []
      for (const s of similar) {
        if (!recentDishNames.includes(s)) similarSet.add(s)
      }
    }

    // If we have similar dishes, pick 3; otherwise pick random popular dishes
    let picks = [...similarSet].slice(0, 3)
    if (picks.length < 3) {
      const remaining = popularDishes.filter(d =>
        !picks.includes(d) && !recentDishNames.includes(d)
      )
      // Shuffle and pick
      const shuffled = remaining.sort(() => Math.random() - 0.5)
      picks = [...picks, ...shuffled].slice(0, 3)
    }

    return picks
  }, [searchHistory])

  return (
    <div className="pt-14 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <OnigiriIcon className="w-6 h-6 text-indigo" />
            <h1 className="font-mono text-2xl font-medium lowercase text-text-primary">
              nibble
            </h1>
          </div>
          <p className="text-sm text-text-secondary">
            eat safely, eat well
          </p>
        </div>
        <ProfileBadge />
      </div>

      {/* Greeting card */}
      <div className="bg-warm-white rounded-3xl p-6 mb-8 shadow-soft border border-border">
        <p className="font-mono text-sm lowercase text-indigo mb-1">
          what are you eating?
        </p>
        <p className="text-lg font-medium text-text-primary leading-snug">
          Search any dish to check if it's safe for your diet
        </p>
        <div className="mt-1">
          <p className="text-xs text-text-secondary">
            We'll scan common recipes and flag restricted ingredients
          </p>
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Dynamic suggestions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {suggestions.map((dish) => (
          <QuickChip key={dish} dish={dish} />
        ))}
      </div>

      {/* Favourites carousel */}
      <FavouritesCarousel />

      {/* Recent searches */}
      <RecentSearches />

      {/* Disclaimer */}
      <p className="mt-10 text-[13px] text-text-secondary text-center leading-relaxed px-4">
        nibble uses AI to identify common ingredients. Results may vary by restaurant.
        Not medical advice — when in doubt, ask the kitchen.
      </p>
    </div>
  )
}

function QuickChip({ dish }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/scan', { state: { dish } })}
      className="flex items-center gap-1.5 bg-warm-white border border-border rounded-full px-4 py-2 min-h-[44px] text-xs font-mono lowercase text-text-primary hover:bg-indigo hover:text-white hover:border-indigo transition-all shadow-soft"
    >
      {dish.toLowerCase()}
    </button>
  )
}
