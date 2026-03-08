import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { dietPresets, knownIngredients } from '../data/dietPresets'
import { ArrowLeft, X, Plus, Pencil, Check, Sparkles, RotateCcw } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const {
    activeProfile, updateProfile,
    customDiets, addCustomDiet, updateCustomDiet, removeCustomDiet,
    savePresetCustomisation, resetPresetCustomisation,
    getPresetCustomisation, isPresetCustomised,
  } = useProfile()
  const [customInput, setCustomInput] = useState('')
  const [showIngredientSuggestions, setShowIngredientSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const ingredientWrapperRef = useRef(null)
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [newDietName, setNewDietName] = useState('')
  const [editingName, setEditingName] = useState(null)
  const [editNameValue, setEditNameValue] = useState('')
  const [startFromPreset, setStartFromPreset] = useState(null)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const bottomSheetRef = useRef(null)

  const allDiets = [...dietPresets, ...customDiets]
  const isCustom = customDiets.some(d => d.id === activeProfile.presetId)
  const currentPreset = allDiets.find(p => p.id === activeProfile.presetId)

  // Open bottom sheet when a diet is selected
  function handlePresetChange(presetId) {
    const preset = allDiets.find(p => p.id === presetId)
    if (!preset) return

    // For built-in presets, use customisation if available
    const isBuiltIn = dietPresets.some(p => p.id === presetId)
    const customAvoidList = isBuiltIn ? getPresetCustomisation(presetId) : null

    updateProfile(activeProfile.id, {
      presetId: preset.id,
      name: preset.name,
      color: preset.color,
      avoidList: customAvoidList || preset.avoidList,
    })
    setShowBottomSheet(true)
  }

  function removeIngredient(ingredient) {
    const newList = activeProfile.avoidList.filter(i => i !== ingredient)
    updateProfile(activeProfile.id, { avoidList: newList })
    // Persist customisation
    const isBuiltIn = dietPresets.some(p => p.id === activeProfile.presetId)
    if (isBuiltIn) {
      savePresetCustomisation(activeProfile.presetId, newList)
    }
    if (isCustom) {
      updateCustomDiet(activeProfile.presetId, { avoidList: newList })
    }
  }

  const ingredientSuggestions = customInput.trim().length > 0
    ? knownIngredients
        .filter(i =>
          i.includes(customInput.trim().toLowerCase()) &&
          !activeProfile.avoidList.map(a => a.toLowerCase()).includes(i)
        )
        .slice(0, 6)
    : []

  function addIngredient(ingredient) {
    const item = (ingredient || '').trim().toLowerCase()
    if (!item || !knownIngredients.includes(item)) return
    if (activeProfile.avoidList.map(a => a.toLowerCase()).includes(item)) return
    const newList = [...activeProfile.avoidList, item]
    updateProfile(activeProfile.id, { avoidList: newList })
    // Persist customisation
    const isBuiltIn = dietPresets.some(p => p.id === activeProfile.presetId)
    if (isBuiltIn) {
      savePresetCustomisation(activeProfile.presetId, newList)
    }
    if (isCustom) {
      updateCustomDiet(activeProfile.presetId, { avoidList: newList })
    }
    setCustomInput('')
    setShowIngredientSuggestions(false)
    setSelectedSuggestionIndex(-1)
  }

  function handleIngredientKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev =>
        prev < ingredientSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev =>
        prev > 0 ? prev - 1 : ingredientSuggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0 && ingredientSuggestions[selectedSuggestionIndex]) {
        addIngredient(ingredientSuggestions[selectedSuggestionIndex])
      } else if (ingredientSuggestions.length === 1) {
        addIngredient(ingredientSuggestions[0])
      } else if (ingredientSuggestions.length === 0 && customInput.trim()) {
        addIngredient(customInput)
      }
    } else if (e.key === 'Escape') {
      setShowIngredientSuggestions(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (ingredientWrapperRef.current && !ingredientWrapperRef.current.contains(e.target)) {
        setShowIngredientSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleCreateCustomDiet() {
    const name = newDietName.trim()
    if (!name) return
    const id = `custom-${Date.now()}`
    const baseList = startFromPreset
      ? dietPresets.find(p => p.id === startFromPreset)?.avoidList || []
      : []
    const newDiet = {
      id,
      name,
      description: 'Your custom diet',
      color: '#2B2BB0',
      avoidList: [...baseList],
      isCustom: true,
    }
    addCustomDiet(newDiet)
    updateProfile(activeProfile.id, {
      presetId: newDiet.id,
      name: newDiet.name,
      color: newDiet.color,
      avoidList: newDiet.avoidList,
    })
    setShowAddCustom(false)
    setNewDietName('')
    setStartFromPreset(null)
    setShowBottomSheet(true)
  }

  function handleRename(dietId) {
    const name = editNameValue.trim()
    if (!name) return
    updateCustomDiet(dietId, { name })
    if (activeProfile.presetId === dietId) {
      updateProfile(activeProfile.id, { name })
    }
    setEditingName(null)
    setEditNameValue('')
  }

  function handleResetPreset() {
    const original = dietPresets.find(p => p.id === activeProfile.presetId)
    if (!original) return
    resetPresetCustomisation(activeProfile.presetId)
    updateProfile(activeProfile.id, { avoidList: original.avoidList })
  }

  // Sort presets so active one is first
  const sortedPresets = [...dietPresets].sort((a, b) => {
    if (a.id === activeProfile.presetId) return -1
    if (b.id === activeProfile.presetId) return 1
    return 0
  })

  const sortedCustomDiets = [...customDiets].sort((a, b) => {
    if (a.id === activeProfile.presetId) return -1
    if (b.id === activeProfile.presetId) return 1
    return 0
  })

  return (
    <div className="pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-primary hover:text-indigo transition-colors min-h-[44px] min-w-[44px]"
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
          Select or create a diet and customise your avoid list
        </p>
      </div>

      {/* Diet presets — horizontal carousel */}
      <div className="mb-8">
        <h3 className="font-mono text-xs lowercase text-indigo mb-3 px-1">
          diet presets
        </h3>
        <div
          className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedPresets.map((preset) => {
            const isActive = preset.id === activeProfile.presetId
            const customised = isPresetCustomised(preset.id)
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`flex-shrink-0 w-[120px] h-[120px] rounded-2xl p-3 border transition-all text-left flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-light border-indigo shadow-soft'
                    : 'bg-warm-white border-border shadow-soft hover:border-indigo'
                }`}
              >
                <div>
                  <div
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: preset.color }}
                  />
                  <p className={`text-xs font-medium leading-tight line-clamp-2 ${isActive ? 'text-indigo' : 'text-text-primary'}`}>
                    {preset.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {customised && (
                    <span className="text-[10px] font-mono lowercase bg-indigo/10 text-indigo rounded-full px-1.5 py-0.5">
                      customised
                    </span>
                  )}
                  {isActive && !customised && (
                    <div className="w-2 h-2 rounded-full bg-indigo" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom diets — horizontal carousel with add button next to heading */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-mono text-xs lowercase text-indigo">
            custom diets
          </h3>
          {!showAddCustom && (
            <button
              onClick={() => setShowAddCustom(true)}
              className="flex items-center gap-1 text-indigo font-mono text-xs lowercase hover:opacity-70 transition-opacity min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              add
            </button>
          )}
        </div>

        {customDiets.length > 0 && (
          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sortedCustomDiets.map((diet) => {
              const isActive = diet.id === activeProfile.presetId
              const isEditing = editingName === diet.id
              return (
                <div
                  key={diet.id}
                  className={`flex-shrink-0 w-[120px] h-[120px] rounded-2xl p-3 border transition-all text-left flex flex-col justify-between relative ${
                    isActive
                      ? 'bg-indigo-light border-indigo shadow-soft'
                      : 'bg-warm-white border-border shadow-soft hover:border-indigo'
                  }`}
                >
                  <button
                    onClick={() => handlePresetChange(diet.id)}
                    className="flex flex-col flex-1 min-w-0 text-left"
                  >
                    <div
                      className="w-3 h-3 rounded-full mb-2 flex-shrink-0"
                      style={{ backgroundColor: diet.color }}
                    />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(diet.id)}
                        className="text-xs font-medium bg-transparent outline-none border-b border-indigo text-text-primary w-full"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <p className={`text-xs font-medium leading-tight line-clamp-2 ${isActive ? 'text-indigo' : 'text-text-primary'}`}>
                        {diet.name}
                      </p>
                    )}
                  </button>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-secondary font-mono">
                      {diet.avoidList.length} items
                    </span>
                    <div className="flex items-center gap-0.5">
                      {isEditing ? (
                        <button
                          onClick={() => handleRename(diet.id)}
                          className="p-1 rounded-full hover:bg-cream-dark transition-colors"
                        >
                          <Check className="w-3 h-3 text-indigo" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingName(diet.id)
                            setEditNameValue(diet.name)
                          }}
                          className="p-1 rounded-full hover:bg-cream-dark transition-colors"
                        >
                          <Pencil className="w-3 h-3 text-text-secondary" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeCustomDiet(diet.id)
                          if (activeProfile.presetId === diet.id) {
                            handlePresetChange('tcm-damp-heat')
                          }
                        }}
                        className="p-1 rounded-full hover:bg-blush-light transition-colors"
                      >
                        <X className="w-3 h-3 text-text-secondary hover:text-danger" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {customDiets.length === 0 && !showAddCustom && (
          <button
            onClick={() => setShowAddCustom(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 min-h-[48px] border border-dashed border-indigo-muted bg-warm-white text-indigo font-mono text-sm lowercase shadow-soft hover:bg-indigo-light transition-all"
          >
            <Plus className="w-4 h-4" />
            add custom diet
          </button>
        )}

        {/* Add custom diet form */}
        {showAddCustom && (
          <div className="bg-warm-white rounded-2xl p-5 border border-border shadow-soft space-y-4 mt-3">
            <div>
              <label className="text-xs font-mono lowercase text-indigo mb-2 block">
                diet name
              </label>
              <input
                type="text"
                value={newDietName}
                onChange={(e) => setNewDietName(e.target.value)}
                placeholder="e.g. My IBS Diet"
                className="w-full bg-cream rounded-xl border border-border px-4 py-3 min-h-[44px] text-sm font-mono lowercase text-text-primary placeholder:text-text-muted outline-none focus:border-indigo transition-all"
                autoFocus
              />
            </div>

            {dietPresets.length > 0 && (
              <div>
                <p className="text-xs font-mono lowercase text-text-secondary mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo" />
                  start from an existing diet?
                </p>
                <div className="flex flex-wrap gap-2">
                  {dietPresets.slice(0, 4).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setStartFromPreset(startFromPreset === preset.id ? null : preset.id)}
                      className={`text-xs font-mono lowercase rounded-full px-3 py-1.5 min-h-[36px] border transition-all ${
                        startFromPreset === preset.id
                          ? 'bg-indigo text-white border-indigo'
                          : 'bg-cream border-border text-text-primary hover:border-indigo'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                {startFromPreset && (
                  <p className="text-[13px] text-text-secondary mt-2">
                    We'll copy its avoid list so you don't start from scratch.
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleCreateCustomDiet}
                disabled={!newDietName.trim()}
                className="flex-1 bg-indigo text-white font-mono text-xs lowercase rounded-2xl py-3 min-h-[44px] shadow-soft hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                create diet
              </button>
              <button
                onClick={() => { setShowAddCustom(false); setNewDietName(''); setStartFromPreset(null) }}
                className="bg-cream text-text-primary font-mono text-xs lowercase rounded-2xl px-4 py-3 min-h-[44px] border border-border hover:border-indigo transition-all"
              >
                cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Avoid list bottom sheet trigger */}
      {currentPreset && !showBottomSheet && (
        <button
          onClick={() => setShowBottomSheet(true)}
          className="w-full bg-warm-white rounded-2xl p-4 mb-6 shadow-soft border border-border flex items-center gap-3 text-left hover:border-indigo transition-all"
        >
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: activeProfile.color }}
          />
          <div className="flex-1">
            <p className="font-mono text-sm lowercase text-text-primary font-medium">
              {activeProfile.name}
            </p>
            <p className="text-xs text-text-secondary">
              {activeProfile.avoidList.length} items on your avoid list — tap to edit
            </p>
          </div>
        </button>
      )}

      {/* Bottom sheet overlay */}
      {showBottomSheet && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setShowBottomSheet(false)}
        />
      )}

      {/* Bottom sheet */}
      {showBottomSheet && (
        <div
          ref={bottomSheetRef}
          className="fixed bottom-0 left-0 right-0 z-50 bg-cream rounded-t-3xl shadow-soft-lg border-t border-border max-h-[80vh] flex flex-col animate-fade-up"
        >
          {/* Sheet handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Sheet header */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeProfile.color }}
              />
              <h3 className="font-mono text-sm lowercase text-text-primary font-medium">
                {activeProfile.name}
              </h3>
              {!isCustom && isPresetCustomised(activeProfile.presetId) && (
                <span className="text-[10px] font-mono lowercase bg-indigo/10 text-indigo rounded-full px-1.5 py-0.5">
                  customised
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!isCustom && isPresetCustomised(activeProfile.presetId) && (
                <button
                  onClick={handleResetPreset}
                  className="flex items-center gap-1 text-xs font-mono lowercase text-text-secondary hover:text-indigo transition-colors min-h-[36px] px-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  reset
                </button>
              )}
              <button
                onClick={() => setShowBottomSheet(false)}
                className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-cream-dark transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>

          {/* Sheet content — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Add ingredient with autocomplete */}
            <div ref={ingredientWrapperRef} className="relative mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 min-h-[48px] gap-2 shadow-soft focus-within:border-indigo transition-all">
                  <Plus className="w-4 h-4 text-indigo flex-shrink-0" />
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value)
                      setShowIngredientSuggestions(true)
                      setSelectedSuggestionIndex(-1)
                    }}
                    onFocus={() => setShowIngredientSuggestions(true)}
                    onKeyDown={handleIngredientKeyDown}
                    placeholder="search for an ingredient..."
                    className="flex-1 bg-transparent outline-none text-sm font-mono lowercase text-text-primary placeholder:text-text-muted"
                  />
                </div>
                <button
                  onClick={() => {
                    if (ingredientSuggestions.length === 1) addIngredient(ingredientSuggestions[0])
                    else if (selectedSuggestionIndex >= 0) addIngredient(ingredientSuggestions[selectedSuggestionIndex])
                    else addIngredient(customInput)
                  }}
                  disabled={!customInput.trim() || !knownIngredients.includes(customInput.trim().toLowerCase())}
                  className="bg-indigo text-white font-mono text-xs lowercase rounded-2xl px-4 py-3 min-h-[48px] shadow-soft hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  add
                </button>
              </div>

              {showIngredientSuggestions && customInput.trim().length > 0 && (
                <div className="absolute top-full left-0 right-12 mt-2 bg-warm-white rounded-2xl shadow-soft-lg border border-border overflow-hidden z-10 max-h-[240px] overflow-y-auto">
                  {ingredientSuggestions.length > 0 ? (
                    ingredientSuggestions.map((item, i) => (
                      <button
                        key={item}
                        onClick={() => addIngredient(item)}
                        className={`w-full text-left px-4 py-3 min-h-[44px] text-sm font-mono lowercase text-text-primary transition-colors border-b border-border last:border-b-0 ${
                          i === selectedSuggestionIndex ? 'bg-indigo-light' : 'hover:bg-indigo-light'
                        }`}
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-text-secondary font-mono lowercase">
                      no matching ingredient found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ingredient pills */}
            <div className="flex flex-wrap gap-2">
              {activeProfile.avoidList.map((ingredient) => (
                <span
                  key={ingredient}
                  className="inline-flex items-center gap-1.5 bg-warm-white border border-border rounded-full pl-3 pr-1.5 py-1.5 text-xs font-mono lowercase text-text-primary shadow-soft group"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-blush-light hover:text-danger transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="bg-warm-white rounded-2xl p-4 border border-border shadow-soft">
        <p className="text-[13px] text-text-secondary leading-relaxed">
          Presets are a starting point — customise to match your practitioner's guidance.
          Your avoid list is used to flag ingredients when scanning dishes.
        </p>
      </div>
    </div>
  )
}
