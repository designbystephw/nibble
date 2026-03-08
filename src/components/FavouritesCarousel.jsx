import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { Heart } from 'lucide-react'

export default function FavouritesCarousel() {
  const { favourites, searchHistory } = useProfile()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const [activeDot, setActiveDot] = useState(0)

  // Get favourite dishes that have cached results in search history
  const favouriteDishes = favourites
    .map(name => searchHistory.find(r => r.dish === name))
    .filter(Boolean)

  if (favouriteDishes.length === 0) return null

  function handleScroll() {
    if (!scrollRef.current) return
    const { scrollLeft } = scrollRef.current
    // Each tile is 120px + 12px gap
    const index = Math.round(scrollLeft / 132)
    setActiveDot(Math.min(index, favouriteDishes.length - 1))
  }

  return (
    <div className="mt-8">
      <div className="bg-warm-white rounded-3xl p-5 border border-border shadow-soft">
        <h3 className="font-mono text-xs lowercase text-indigo mb-3 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          favourites
        </h3>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {favouriteDishes.map((result) => {
            const restrictedCount = result.ingredients?.filter(i => i.restricted).length || 0
            const totalCount = result.ingredients?.length || 1
            const restrictedPercent = (restrictedCount / totalCount) * 100
            const label = restrictedPercent > 50 ? "don't eat this"
              : restrictedPercent > 35 ? 'best to avoid'
              : restrictedPercent > 20 ? 'eat with caution'
              : restrictedPercent > 10 ? 'mostly fine'
              : 'go for it'
            const dotColor = restrictedPercent > 20 ? 'bg-danger' : 'bg-safe'

            return (
              <button
                key={result.dish}
                onClick={() => navigate('/results', { state: { result } })}
                className="flex-shrink-0 w-[120px] h-[120px] snap-start bg-cream rounded-2xl p-3 border border-border text-left hover:border-indigo transition-all flex flex-col justify-between"
              >
                <p className="text-xs font-medium text-text-primary line-clamp-2 leading-tight mb-1">{result.dish}</p>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="text-xs font-mono lowercase text-text-secondary">{label}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Pagination dots */}
        {favouriteDishes.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {favouriteDishes.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeDot ? 'bg-indigo' : 'bg-border'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
