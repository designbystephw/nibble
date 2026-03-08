import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useProfile } from '../context/ProfileContext'
import { scrollingDishes, dishEmojis } from '../data/dietPresets'
import { Search } from 'lucide-react'

export default function HomePage() {
  const { account, searchHistory } = useProfile()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const firstName = account?.name?.split(' ')[0] || 'there'

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

  // Get recently searched dish names for the suggestion pills
  const recentDishes = searchHistory.slice(0, 5).map(r => r.dish)

  return (
    <div className="pb-20">
      <NavBar showBack={false} />

      {/* Big greeting */}
      <div className="mt-16 mb-10 text-center">
        <h1 className="text-[30px] leading-tight text-text-primary">
          Hey {firstName},
          <br />
          whatcha eating?
        </h1>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3.5 gap-3 transition-all focus-within:border-text-muted">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search a dish name..."
            className="flex-1 bg-transparent outline-none text-base text-text-primary placeholder:text-text-muted"
          />
          {focused && query && (
            <button
              onClick={() => handleSubmit()}
              className="text-sm font-medium text-text-primary"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Recent searches as pills below search */}
      {recentDishes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-5 px-5">
          {recentDishes.map((dish) => (
            <button
              key={dish}
              onClick={() => handleSubmit(dish)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-warm-white border border-border rounded-full px-3.5 py-2 text-sm text-text-primary hover:border-text-muted transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-green-dark flex-shrink-0" />
              {dish}
            </button>
          ))}
        </div>
      )}

      {/* Scrolling dish suggestion rows */}
      <div className="mt-4">
        <ScrollingDishRows onSelect={handleSubmit} />
      </div>
    </div>
  )
}

function ScrollingDishRows({ onSelect }) {
  return (
    <div className="space-y-3 overflow-hidden -mx-5">
      {scrollingDishes.map((row, rowIndex) => (
        <div key={rowIndex} className="relative">
          <div
            className={`flex gap-2.5 whitespace-nowrap ${
              rowIndex % 2 === 0 ? 'animate-scroll-left' : 'animate-scroll-right'
            }`}
            style={{ width: 'max-content' }}
          >
            {/* Duplicate the row for seamless loop */}
            {[...row, ...row].map((dish, i) => (
              <button
                key={`${dish}-${i}`}
                onClick={() => onSelect(dish)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-warm-white border border-border rounded-full px-3.5 py-2 text-sm text-text-primary hover:border-text-muted transition-colors"
              >
                <span>{dishEmojis[dish] || '🍽️'}</span>
                {dish}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
