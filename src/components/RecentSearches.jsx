import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { Clock, ChevronRight } from 'lucide-react'

const summaryStyles = {
  'likely-safe': { dot: 'bg-safe', label: 'likely safe' },
  'check-these': { dot: 'bg-caution', label: 'check these' },
  'contains-restricted': { dot: 'bg-danger', label: 'restricted items' },
}

export default function RecentSearches() {
  const { searchHistory } = useProfile()
  const navigate = useNavigate()

  if (searchHistory.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="font-mono text-xs lowercase text-text-muted mb-3 px-1">
        recently searched
      </h3>
      <div className="space-y-2">
        {searchHistory.slice(0, 5).map((result) => {
          const style = summaryStyles[result.summary] || summaryStyles['check-these']
          return (
            <button
              key={result.dish}
              onClick={() => navigate('/results', { state: { result } })}
              className="w-full flex items-center gap-3 bg-warm-white rounded-2xl px-4 py-3.5 shadow-sm border border-border hover:shadow-md transition-shadow text-left"
            >
              <Clock className="w-4 h-4 text-text-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{result.dish}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                  <span className="text-xs font-mono lowercase text-text-muted">{style.label}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
