import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import ProfileBadge from '../components/ProfileBadge'
import RecentSearches from '../components/RecentSearches'
import OnigiriIcon from '../components/OnigiriIcon'

export default function HomePage() {
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

      {/* Quick suggestions */}
      <div className="mt-5 flex flex-wrap gap-2">
        {['Char Kway Teow', 'Caesar Salad', 'Steamed Fish'].map((dish) => (
          <QuickChip key={dish} dish={dish} />
        ))}
      </div>

      {/* Recent searches */}
      <RecentSearches />

      {/* Disclaimer */}
      <p className="mt-10 text-[11px] text-text-secondary text-center leading-relaxed px-4">
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
      className="bg-warm-white border border-border rounded-full px-4 py-2 min-h-[44px] text-xs font-mono lowercase text-text-primary hover:bg-indigo hover:text-white hover:border-indigo transition-all shadow-soft"
    >
      {dish.toLowerCase()}
    </button>
  )
}
