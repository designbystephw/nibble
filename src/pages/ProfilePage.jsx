import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { dietPresets } from '../data/dietPresets'
import { ArrowLeft, X, Plus, ChevronRight } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { activeProfile, updateProfile } = useProfile()
  const [customInput, setCustomInput] = useState('')

  const currentPreset = dietPresets.find(p => p.id === activeProfile.presetId)

  function handlePresetChange(presetId) {
    const preset = dietPresets.find(p => p.id === presetId)
    if (preset) {
      updateProfile(activeProfile.id, {
        presetId: preset.id,
        name: preset.name,
        color: preset.color,
        avoidList: preset.avoidList,
      })
    }
  }

  function removeIngredient(ingredient) {
    updateProfile(activeProfile.id, {
      avoidList: activeProfile.avoidList.filter(i => i !== ingredient),
    })
  }

  function addIngredient() {
    const item = customInput.trim().toLowerCase()
    if (item && !activeProfile.avoidList.includes(item)) {
      updateProfile(activeProfile.id, {
        avoidList: [...activeProfile.avoidList, item],
      })
      setCustomInput('')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  return (
    <div className="pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-secondary hover:text-indigo transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-mono lowercase">back</span>
        </button>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-mono text-xl lowercase text-text-primary mb-1">
          my diet
        </h1>
        <p className="text-sm text-text-secondary">
          Choose a preset and customise your avoid list
        </p>
      </div>

      {/* Active profile indicator */}
      <div className="bg-warm-white rounded-2xl p-4 mb-8 shadow-soft border border-border flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: activeProfile.color }}
        />
        <div className="flex-1">
          <p className="font-mono text-sm lowercase text-text-primary font-medium">
            {activeProfile.name}
          </p>
          <p className="text-xs text-text-muted">
            {activeProfile.avoidList.length} items on your avoid list
          </p>
        </div>
      </div>

      {/* Diet presets */}
      <div className="mb-8">
        <h3 className="font-mono text-xs lowercase text-text-muted mb-3 px-1">
          diet presets
        </h3>
        <div className="space-y-2">
          {dietPresets.map((preset) => {
            const isActive = preset.id === activeProfile.presetId
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all text-left ${
                  isActive
                    ? 'bg-indigo-light border-indigo shadow-soft'
                    : 'bg-warm-white border-border shadow-soft hover:border-indigo'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: preset.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-indigo' : 'text-text-primary'}`}>
                    {preset.name}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {preset.description}
                  </p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-indigo flex-shrink-0" />
                )}
                {!isActive && (
                  <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Avoid list */}
      <div className="mb-6">
        <h3 className="font-mono text-xs lowercase text-text-muted mb-3 px-1">
          your avoid list
        </h3>

        {/* Add custom ingredient */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 gap-2 shadow-soft focus-within:border-indigo transition-all">
            <Plus className="w-4 h-4 text-indigo-muted flex-shrink-0" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="add an ingredient..."
              className="flex-1 bg-transparent outline-none text-sm font-mono lowercase text-text-primary placeholder:text-text-muted"
            />
          </div>
          <button
            onClick={addIngredient}
            disabled={!customInput.trim()}
            className="bg-indigo text-white font-mono text-xs lowercase rounded-2xl px-4 py-3 shadow-soft hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            add
          </button>
        </div>

        {/* Ingredient pills */}
        <div className="flex flex-wrap gap-2">
          {activeProfile.avoidList.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center gap-1.5 bg-warm-white border border-border rounded-full pl-3 pr-1.5 py-1.5 text-xs font-mono lowercase text-text-secondary shadow-soft group"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-blush-light hover:text-danger transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="bg-warm-white rounded-2xl p-4 border border-border shadow-soft">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Presets are a starting point — customise to match your practitioner's guidance.
          Your avoid list is used to flag ingredients when scanning dishes.
        </p>
      </div>
    </div>
  )
}
