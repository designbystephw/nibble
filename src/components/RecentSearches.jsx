import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { Clock, ChevronRight } from 'lucide-react'

// Map restricted percentage to recommendation label
function getRecommendationLabel(result) {
  const restrictedCount = result.ingredients?.filter(i => i.restricted).length || 0
  const totalCount = result.ingredients?.length || 1
  const restrictedPercent = (restrictedCount / totalCount) * 100

  if (restrictedPercent > 50) return { label: "don't eat this", dot: 'bg-danger' }
  if (restrictedPercent > 35) return { label: 'best to avoid', dot: 'bg-danger' }
  if (restrictedPercent > 20) return { label: 'eat with caution', dot: 'bg-caution' }
  if (restrictedPercent > 10) return { label: 'mostly fine', dot: 'bg-safe' }
  return { label: 'go for it', dot: 'bg-safe' }
}

export default function RecentSearches() {
  const { searchHistory } = useProfile()
  const navigate = useNavigate()

  if (searchHistory.length === 0) return null

  return (
    <div className="mt-8">
      <div className="bg-warm-white rounded-3xl p-5 border border-border shadow-soft">
        <h3 className="font-mono text-xs lowercase text-indigo mb-3">
          recently searched
        </h3>
        <div className="space-y-2">
          {searchHistory.slice(0, 5).map((result) => {
            const rec = getRecommendationLabel(result)
            return (
              <button
                key={result.dish}
                onClick={() => navigate('/results', { state: { result } })}
                className="w-full flex items-center gap-3 bg-cream rounded-2xl px-4 py-3.5 min-h-[48px] hover:border-indigo transition-all text-left border border-border"
              >
                <Clock className="w-4 h-4 text-indigo flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{result.dish}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-2 h-2 rounded-full ${rec.dot}`} />
                    <span className="text-xs font-mono lowercase text-text-secondary">{rec.label}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
