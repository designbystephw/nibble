import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import {
  ArrowLeft, Heart, ChevronDown, ChevronUp,
  ExternalLink, AlertTriangle, CheckCircle, XCircle, Info
} from 'lucide-react'

const summaryConfig = {
  'likely-safe': {
    icon: CheckCircle,
    label: 'likely safe',
    sublabel: 'No restricted ingredients detected',
    bgClass: 'bg-sage-light',
    dotClass: 'bg-safe',
    textClass: 'text-forest',
  },
  'check-these': {
    icon: AlertTriangle,
    label: 'check these',
    sublabel: 'Some ingredients may be restricted',
    bgClass: 'bg-warm-white',
    dotClass: 'bg-caution',
    textClass: 'text-terracotta',
  },
  'contains-restricted': {
    icon: XCircle,
    label: 'contains restricted items',
    sublabel: 'This dish likely contains ingredients you avoid',
    bgClass: 'bg-blush-light',
    dotClass: 'bg-danger',
    textClass: 'text-danger',
  },
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isFavourite, toggleFavourite } = useProfile()
  const [showSources, setShowSources] = useState(false)

  const result = location.state?.result
  if (!result) {
    navigate('/')
    return null
  }

  const config = summaryConfig[result.summary] || summaryConfig['check-these']
  const SummaryIcon = config.icon
  const fav = isFavourite(result.dish)
  const restrictedCount = result.ingredients.filter(i => i.restricted).length
  const safeCount = result.ingredients.filter(i => !i.restricted).length

  const confidenceLabel = result.confidence >= 80 ? 'high' : result.confidence >= 60 ? 'medium' : 'low'
  const confidenceColor = result.confidence >= 80 ? 'text-forest' : result.confidence >= 60 ? 'text-caution' : 'text-danger'

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

      {/* Dish name */}
      <h1 className="font-mono text-xl lowercase text-text-primary mb-2">
        {result.dish.toLowerCase()}
      </h1>

      {/* Confidence badge */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 bg-warm-white rounded-full px-3 py-1 border border-border">
          <div className={`w-2 h-2 rounded-full ${
            confidenceLabel === 'high' ? 'bg-safe' : confidenceLabel === 'medium' ? 'bg-caution' : 'bg-danger'
          }`} />
          <span className={`text-xs font-mono lowercase ${confidenceColor}`}>
            {confidenceLabel} confidence
          </span>
        </div>
        <span className="text-xs text-text-muted">
          {result.recipesScanned} recipes scanned
        </span>
      </div>

      {/* Traffic light summary card */}
      <div className={`${config.bgClass} rounded-3xl p-5 mb-6 shadow-soft border border-border`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
            <SummaryIcon className={`w-5 h-5 ${config.textClass}`} />
          </div>
          <div>
            <p className={`font-mono text-sm lowercase font-medium ${config.textClass}`}>
              {config.label}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {config.sublabel}
            </p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs font-mono text-danger lowercase">{restrictedCount} flagged</span>
              <span className="text-xs font-mono text-safe lowercase">{safeCount} ok</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients list */}
      <div className="mb-6">
        <h3 className="font-mono text-xs lowercase text-text-muted mb-3 px-1">
          ingredients found
        </h3>
        <div className="space-y-2">
          {result.ingredients
            .sort((a, b) => (b.restricted ? 1 : 0) - (a.restricted ? 1 : 0))
            .map((ingredient, i) => (
              <IngredientRow key={i} ingredient={ingredient} />
            ))}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-6">
        <button
          onClick={() => setShowSources(!showSources)}
          className="flex items-center gap-2 w-full text-left px-1 mb-2"
        >
          <h3 className="font-mono text-xs lowercase text-text-muted">
            sources scanned ({result.sources.length})
          </h3>
          {showSources
            ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
            : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          }
        </button>
        {showSources && (
          <div className="bg-warm-white rounded-2xl border border-border p-4 space-y-2 shadow-soft animate-fade-up" style={{ animationDuration: '0.3s' }}>
            {result.sources.map((source, i) => (
              <div key={i} className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-muted flex-shrink-0" />
                <span className="text-xs text-text-secondary">{source.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-warm-white rounded-2xl p-4 flex gap-3 border border-border shadow-soft">
        <Info className="w-4 h-4 text-indigo-muted flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-muted leading-relaxed">
          Results are based on common recipes and may vary by restaurant.
          This is not medical advice — when in doubt, ask the kitchen.
        </p>
      </div>

      {/* Search again */}
      <button
        onClick={() => navigate('/')}
        className="w-full mt-6 bg-indigo text-white font-mono text-sm lowercase rounded-2xl py-3.5 shadow-soft hover:opacity-90 transition-opacity"
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
        <span className={`text-sm flex-1 ${restricted ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
          {name}
        </span>
        {restricted && (
          <span className="text-[10px] font-mono lowercase text-indigo bg-indigo-light rounded-full px-2 py-0.5">
            restricted
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
