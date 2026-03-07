import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, TrendingUp } from 'lucide-react'
import { popularDishes } from '../data/dietPresets'
import { useProfile } from '../context/ProfileContext'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)
  const { searchHistory } = useProfile()

  // When typing, filter popular dishes
  const filtered = query.length > 0
    ? popularDishes.filter(d => d.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  // Recent/frequent suggestions when search bar is empty and focused
  const recentDishes = searchHistory.slice(0, 3).map(r => r.dish)
  const frequentDishes = getFrequentDishes(searchHistory, 3)
  const idleSuggestions = [...new Set([...recentDishes, ...frequentDishes])].slice(0, 5)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(dishName) {
    const name = dishName || query
    if (!name.trim()) return
    navigate('/scan', { state: { dish: name.trim() } })
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const showIdleSuggestions = showSuggestions && query.length === 0 && idleSuggestions.length > 0
  const showFilteredSuggestions = showSuggestions && filtered.length > 0

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center bg-warm-white rounded-2xl shadow-soft border border-border px-4 py-3.5 min-h-[48px] gap-3 transition-all focus-within:shadow-soft-lg focus-within:border-indigo">
        <Search className="w-5 h-5 text-indigo flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true) }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="search a dish name..."
          className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-muted font-mono text-sm lowercase"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="text-indigo hover:text-text-primary text-sm font-mono lowercase min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
          >
            clear
          </button>
        )}
      </div>

      {/* Idle suggestions: recent & frequent searches */}
      {showIdleSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-warm-white rounded-2xl shadow-soft-lg border border-border overflow-hidden z-10">
          <div className="px-4 pt-3 pb-1">
            <p className="text-[13px] font-mono lowercase text-indigo">suggestions</p>
          </div>
          {idleSuggestions.map((dish) => (
            <button
              key={dish}
              onClick={() => { setQuery(dish); setShowSuggestions(false); handleSubmit(dish) }}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-mono lowercase text-text-primary hover:bg-indigo-light transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
            >
              <Clock className="w-3.5 h-3.5 text-indigo flex-shrink-0" />
              {dish.toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {/* Typed suggestions */}
      {showFilteredSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-warm-white rounded-2xl shadow-soft-lg border border-border overflow-hidden z-10">
          {filtered.map((dish) => (
            <button
              key={dish}
              onClick={() => { setQuery(dish); setShowSuggestions(false); handleSubmit(dish) }}
              className="w-full text-left px-4 py-3 min-h-[44px] text-sm font-mono lowercase text-text-primary hover:bg-indigo-light transition-colors border-b border-border last:border-b-0"
            >
              {dish}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function getFrequentDishes(history, limit) {
  const counts = {}
  history.forEach(r => {
    const key = r.dish.toLowerCase()
    counts[key] = (counts[key] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([dish]) => history.find(r => r.dish.toLowerCase() === dish)?.dish || dish)
}
