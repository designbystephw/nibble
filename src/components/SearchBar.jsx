import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { popularDishes } from '../data/dietPresets'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  const filtered = query.length > 0
    ? popularDishes.filter(d => d.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

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

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center bg-warm-white rounded-2xl shadow-soft border border-border px-4 py-3.5 gap-3 transition-all focus-within:shadow-soft-lg focus-within:border-indigo">
        <Search className="w-5 h-5 text-indigo-muted flex-shrink-0" />
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
            className="text-text-muted hover:text-indigo text-sm font-mono lowercase"
          >
            clear
          </button>
        )}
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-warm-white rounded-2xl shadow-soft-lg border border-border overflow-hidden z-10">
          {filtered.map((dish) => (
            <button
              key={dish}
              onClick={() => { setQuery(dish); setShowSuggestions(false); handleSubmit(dish) }}
              className="w-full text-left px-4 py-3 text-sm font-mono lowercase text-text-primary hover:bg-indigo-light transition-colors border-b border-border last:border-b-0"
            >
              {dish}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
