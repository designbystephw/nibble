import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import NavBar from '../components/NavBar'
import {
  Heart, ChevronDown, ChevronUp,
  ExternalLink, Info
} from 'lucide-react'

function getRecommendation(restrictedPercent) {
  if (restrictedPercent > 50) return { label: "Don't eat this", position: 90 }
  if (restrictedPercent > 35) return { label: 'Best to avoid', position: 75 }
  if (restrictedPercent > 20) return { label: 'Eat with caution', position: 55 }
  if (restrictedPercent > 10) return { label: 'Mostly fine', position: 30 }
  return { label: 'Go for it', position: 10 }
}

function getFaviconUrl(url) {
  try {
    const hostname = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch { return null }
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isFavourite, toggleFavourite } = useProfile()
  const [showIngredients, setShowIngredients] = useState(true)
  const [showSources, setShowSources] = useState(false)

  const result = location.state?.result
  if (!result) {
    navigate('/')
    return null
  }

  const fav = isFavourite(result.dish)
  const restrictedCount = result.ingredients.filter(i => i.restricted).length
  const totalCount = result.ingredients.length
  const restrictedPercent = totalCount > 0 ? (restrictedCount / totalCount) * 100 : 0
  const recommendation = getRecommendation(restrictedPercent)
  const sourceCount = result.sources.length

  const confidenceLabel = result.confidence >= 80 ? 'Very High' : result.confidence >= 60 ? 'Moderate' : 'Low'
  const confidenceColor = result.confidence >= 80 ? 'text-green-dark' : result.confidence >= 60 ? 'text-yellow-dark' : 'text-danger'
  const confidenceRingColor = result.confidence >= 80 ? 'stroke-safe' : result.confidence >= 60 ? 'stroke-caution' : 'stroke-danger'

  const circumference = 2 * Math.PI * 36
  const strokeDash = (result.confidence / 100) * circumference

  return (
    <div className="pb-8 animate-fade-up" style={{ animationDuration: '0.4s' }}>
      <NavBar />

      {/* Dish name + favourite */}
      <div className="flex items-start justify-between mb-2 mt-2">
        <div>
          <h1 className="text-[30px] leading-tight text-text-primary">
            {result.dish}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {sourceCount} recipes scanned
          </p>
        </div>
        <button
          onClick={() => toggleFavourite(result.dish)}
          className="p-2 mt-1"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${fav ? 'fill-danger text-danger' : 'text-text-muted'}`}
          />
        </button>
      </div>

      {/* TO EAT OR NOT TO EAT — card with gradient */}
      <div className="mt-8 mb-8">
        <div className="bg-warm-white rounded-3xl p-5 border border-border shadow-soft">
          {/* Recommendation label */}
          <p className={`text-base font-bold mb-1 ${
            restrictedPercent > 20 ? 'text-danger' : 'text-green-dark'
          }`} style={{ fontFamily: 'var(--font-heading)' }}>
            {recommendation.label}
          </p>

          {/* Witty commentary */}
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {result.wittyComment || "Not a disaster, but maybe don't make it a daily habit."}
          </p>

          {/* Spectrum bar */}
          <div className="relative">
            <div className="h-3 rounded-full bg-gradient-to-r from-green via-caution to-danger relative overflow-hidden">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-text-primary transition-all duration-700 ease-out"
                style={{ left: `clamp(8px, calc(${recommendation.position}% - 6px), calc(100% - 12px))` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* COMMON INGREDIENTS */}
      <div className="mb-8">
        <div className="bg-warm-white rounded-3xl border border-border shadow-soft overflow-hidden">
          <button
            onClick={() => setShowIngredients(!showIngredients)}
            className="flex items-center justify-between w-full text-left px-5 py-4"
          >
            <h2 className="text-base text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              Common ingredients <span className="text-text-secondary font-normal">{totalCount}</span>
            </h2>
            {showIngredients
              ? <ChevronUp className="w-5 h-5 text-text-secondary" />
              : <ChevronDown className="w-5 h-5 text-text-secondary" />
            }
          </button>
          {showIngredients && (
            <div className="px-5 pb-5 animate-fade-up" style={{ animationDuration: '0.3s' }}>
              <div className="flex flex-wrap gap-x-4 gap-y-3">
                {result.ingredients
                  .sort((a, b) => (b.restricted ? 1 : 0) - (a.restricted ? 1 : 0))
                  .map((ingredient, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        ingredient.restricted ? 'bg-danger' : 'bg-green-dark'
                      }`} />
                      <span className={`text-sm ${ingredient.restricted ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {ingredient.name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NIBBLE'S THOUGHT PROCESS — card with subtle gradient */}
      <div className="mb-8">
        <div className="bg-warm-white rounded-3xl p-5 border border-border shadow-soft gradient-salmon" style={{ background: 'linear-gradient(135deg, rgba(255,207,175,0.15) 0%, #FFFFFF 60%)' }}>
          <h2 className="text-base text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Nibble's thought process
          </h2>

          {/* Confidence ring + label */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-border"
                />
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className={confidenceRingColor}
                  strokeDasharray={`${strokeDash} ${circumference}`}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-text-primary">{result.confidence}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Confidence level</p>
              <p className={`text-sm font-bold ${confidenceColor}`}>
                {confidenceLabel}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-sm text-text-secondary leading-relaxed">
            {result.confidenceExplanation || `Nibble cross-referenced ${sourceCount} recipes and found ${restrictedCount} out of ${totalCount} common ingredients matched your restrictions list.`}
          </p>
        </div>
      </div>

      {/* SOURCES */}
      <div className="mb-8">
        <div className="bg-warm-white rounded-3xl border border-border shadow-soft overflow-hidden">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center justify-between w-full text-left px-5 py-4"
          >
            <h2 className="text-base text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              Sources <span className="text-text-secondary font-normal">{sourceCount}</span>
            </h2>
            {showSources
              ? <ChevronUp className="w-5 h-5 text-text-secondary" />
              : <ChevronDown className="w-5 h-5 text-text-secondary" />
            }
          </button>
          {showSources && (
            <div className="px-5 pb-4 space-y-1 animate-fade-up" style={{ animationDuration: '0.3s' }}>
              {result.sources.map((source, i) => {
                const favicon = getFaviconUrl(source.url)
                let displayUrl = source.url
                try { displayUrl = new URL(source.url).hostname + new URL(source.url).pathname } catch {}
                if (displayUrl.length > 40) displayUrl = displayUrl.substring(0, 40) + '...'

                return (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-3 border-b border-border last:border-b-0 group"
                  >
                    {favicon && (
                      <img
                        src={favicon}
                        alt=""
                        className="w-5 h-5 rounded flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <span className="text-sm text-text-secondary group-hover:text-text-primary flex-1 truncate">
                      {displayUrl}
                    </span>
                    <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-sm text-text-secondary text-center leading-relaxed px-4 mb-6">
        Results are based on common recipes and may vary by restaurant. This is not medical advice — when in doubt, ask the kitchen!
      </p>

      {/* Search again */}
      <button
        onClick={() => navigate('/')}
        className="w-full bg-text-primary text-warm-white text-base font-medium rounded-2xl py-3.5 hover:opacity-90 transition-opacity"
      >
        Search another dish
      </button>
    </div>
  )
}
