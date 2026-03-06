import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import DishIllustration from '../components/DishIllustration'
import {
  ArrowLeft, Heart, ChevronDown, ChevronUp,
  ExternalLink, Info
} from 'lucide-react'

// Recommendation label based on restricted percentage
function getRecommendation(restrictedPercent) {
  if (restrictedPercent > 50) return { label: "don't eat this", position: 90 }
  if (restrictedPercent > 35) return { label: 'best to avoid', position: 75 }
  if (restrictedPercent > 20) return { label: 'eat with caution', position: 55 }
  if (restrictedPercent > 10) return { label: 'mostly fine', position: 30 }
  return { label: 'go for it', position: 10 }
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isFavourite, toggleFavourite } = useProfile()
  const [showIngredients, setShowIngredients] = useState(false)
  const [showSources, setShowSources] = useState(false)

  const result = location.state?.result
  if (!result) {
    navigate('/')
    return null
  }

  const fav = isFavourite(result.dish)
  const restrictedCount = result.ingredients.filter(i => i.restricted).length
  const totalCount = result.ingredients.length
  const restrictedPercent = (restrictedCount / totalCount) * 100
  const recommendation = getRecommendation(restrictedPercent)

  const confidenceLabel = result.confidence >= 80 ? 'Very High' : result.confidence >= 60 ? 'Moderate' : 'Low'
  const confidenceColor = result.confidence >= 80 ? 'text-forest' : result.confidence >= 60 ? 'text-caution' : 'text-danger'
  const confidenceRingColor = result.confidence >= 80 ? 'stroke-safe' : result.confidence >= 60 ? 'stroke-caution' : 'stroke-danger'

  // SVG circle for confidence ring
  const circumference = 2 * Math.PI * 36
  const strokeDash = (result.confidence / 100) * circumference

  return (
    <div className="pt-6 pb-8 animate-fade-up" style={{ animationDuration: '0.4s' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-indigo transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-mono lowercase">back</span>
        </button>
        <button
          onClick={() => toggleFavourite(result.dish)}
          className="p-2 rounded-full hover:bg-cream-dark transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${fav ? 'fill-danger text-danger' : 'text-text-muted'}`}
          />
        </button>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* DISH NAME + ILLUSTRATION                    */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="font-mono text-2xl lowercase text-text-primary leading-tight">
            {result.dish.toLowerCase()}
          </h1>
          <p className="text-xs text-text-muted mt-1 font-mono lowercase">
            {result.recipesScanned} recipes scanned
          </p>
        </div>
        <DishIllustration
          dishName={result.dish}
          className="w-20 h-20 flex-shrink-0 opacity-80"
        />
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TO EAT OR NOT TO EAT                       */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-8">
        <h2 className="font-mono text-xs lowercase text-text-muted mb-3 px-1">
          to eat or not to eat
        </h2>
        <div className="bg-warm-white rounded-3xl p-5 border border-border shadow-soft">
          {/* Recommendation label */}
          <p className={`font-mono text-lg lowercase font-medium mb-1 ${
            restrictedPercent > 20 ? 'text-danger' : 'text-forest'
          }`}>
            {recommendation.label}
          </p>

          {/* Witty commentary */}
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {result.wittyComment || "Your mum would probably say no, but moderation is key."}
          </p>

          {/* Spectrum bar */}
          <div className="relative mt-2">
            <div className="flex justify-between text-[10px] font-mono lowercase text-text-muted mb-1.5">
              <span>eat it</span>
              <span>skip it</span>
            </div>
            <div className="h-3 rounded-full bg-gradient-to-r from-safe via-caution to-danger relative overflow-hidden">
              {/* Indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-text-primary shadow-soft transition-all duration-700 ease-out"
                style={{ left: `clamp(8px, calc(${recommendation.position}% - 8px), calc(100% - 16px))` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] font-mono text-safe">{totalCount - restrictedCount} ok</span>
              <span className="text-[10px] font-mono text-danger">{restrictedCount} flagged</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* COMMON INGREDIENTS (collapsible)            */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-8">
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="flex items-center justify-between w-full text-left px-1 mb-3"
        >
          <h2 className="font-mono text-xs lowercase text-text-muted">
            common ingredients ({totalCount})
          </h2>
          {showIngredients
            ? <ChevronUp className="w-4 h-4 text-text-muted" />
            : <ChevronDown className="w-4 h-4 text-text-muted" />
          }
        </button>
        {showIngredients && (
          <div className="space-y-2 animate-fade-up" style={{ animationDuration: '0.3s' }}>
            {result.ingredients
              .sort((a, b) => (b.restricted ? 1 : 0) - (a.restricted ? 1 : 0))
              .map((ingredient, i) => (
                <IngredientRow key={i} ingredient={ingredient} />
              ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* NIBBLE'S THOUGHT PROCESS                   */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-8">
        <h2 className="font-mono text-xs lowercase text-text-muted mb-3 px-1">
          nibble's thought process
        </h2>
        <div className="bg-warm-white rounded-3xl p-5 border border-border shadow-soft">
          {/* Confidence ring + label */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
                {/* Background ring */}
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-border"
                />
                {/* Confidence ring */}
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
                <span className="font-mono text-sm font-medium text-text-primary">{result.confidence}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted">Confidence level</p>
              <p className={`font-mono text-sm font-medium ${confidenceColor}`}>
                {confidenceLabel}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-sm text-text-secondary leading-relaxed">
            {result.confidenceExplanation || `Nibble scanned ${result.recipesScanned} recipes and cross-referenced the ingredients against your dietary profile. ${restrictedCount} out of ${totalCount} common ingredients were flagged.`}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* REFERENCES (collapsible)                   */}
      {/* ═══════════════════════════════════════════ */}
      <div className="mb-8">
        <button
          onClick={() => setShowSources(!showSources)}
          className="flex items-center justify-between w-full text-left px-1 mb-3"
        >
          <h2 className="font-mono text-xs lowercase text-text-muted">
            references ({result.sources.length} sources)
          </h2>
          {showSources
            ? <ChevronUp className="w-4 h-4 text-text-muted" />
            : <ChevronDown className="w-4 h-4 text-text-muted" />
          }
        </button>
        {showSources && (
          <div className="bg-warm-white rounded-2xl border border-border p-4 space-y-2 shadow-soft animate-fade-up" style={{ animationDuration: '0.3s' }}>
            {result.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cream-dark transition-colors group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-muted flex-shrink-0" />
                <span className="text-sm text-indigo group-hover:underline flex-1">
                  {source.name}
                </span>
                <span className="text-[10px] text-text-muted font-mono">
                  {source.url !== '#' ? new URL(source.url).hostname : ''}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-warm-white rounded-2xl p-4 flex gap-3 border border-border shadow-soft mb-6">
        <Info className="w-4 h-4 text-indigo-muted flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          Results are based on common recipes and may vary by restaurant.
          This is not medical advice — when in doubt, ask the kitchen.
        </p>
      </div>

      {/* Search again */}
      <button
        onClick={() => navigate('/')}
        className="w-full bg-indigo text-white font-mono text-sm lowercase rounded-2xl py-3.5 shadow-soft hover:opacity-90 transition-opacity"
      >
        search another dish
      </button>
    </div>
  )
}

function IngredientRow({ ingredient }) {
  const { restricted, name, reason } = ingredient

  return (
    <div className={`rounded-2xl px-4 py-3 border shadow-soft ${
      restricted
        ? 'bg-blush-light/50 border-blush'
        : 'bg-warm-white border-border'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          restricted ? 'bg-danger' : 'bg-safe'
        }`} />
        <span className={`text-sm flex-1 ${restricted ? 'font-medium text-danger' : 'text-text-secondary'}`}>
          {name}
        </span>
        {restricted && (
          <span className="text-[10px] font-mono lowercase text-danger bg-blush-light rounded-full px-2 py-0.5 border border-blush">
            no-go
          </span>
        )}
      </div>
      {restricted && reason && (
        <p className="text-xs text-text-muted mt-1.5 ml-[22px]">
          {reason}
        </p>
      )}
    </div>
  )
}
