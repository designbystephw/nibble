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
        {[
          { name: 'Char Kway Teow', icon: 'noodles' },
          { name: 'Caesar Salad', icon: 'salad' },
          { name: 'Steamed Fish', icon: 'fish' },
        ].map((item) => (
          <QuickChip key={item.name} dish={item.name} icon={item.icon} />
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

const chipIcons = {
  noodles: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <path d="M4 12C4 12 5 16 10 16C15 16 16 12 16 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 12H17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6 11C6 9 7 7 9 6.5C10 6.2 9.5 8.5 11 7.5C12.5 6.5 12 5 13 6C14 7 13.5 9 14 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      <path d="M12 4L9 12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M14 3.5L11 11.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  salad: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <path d="M4 12C4 12 5 17 10 17C15 17 16 12 16 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 12H17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6 11C5.5 9 7 6 9 5.5C11 5 10 8 12 7C14 6 13 9 14 11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
      <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  fish: (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0">
      <path d="M4 10C4 10 6 6 10 6C14 6 16 10 16 10C16 10 14 14 10 14C6 14 4 10 4 10Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3 10C2 8 2 12 3 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="13" cy="9" r="0.8" fill="currentColor" />
      <path d="M11 8C10.5 9.5 10.5 11 11 12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
}

function QuickChip({ dish, icon }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/scan', { state: { dish } })}
      className="flex items-center gap-1.5 bg-warm-white border border-border rounded-full px-4 py-2 min-h-[44px] text-xs font-mono lowercase text-text-primary hover:bg-indigo hover:text-white hover:border-indigo transition-all shadow-soft"
    >
      {icon && chipIcons[icon]}
      {dish.toLowerCase()}
    </button>
  )
}
