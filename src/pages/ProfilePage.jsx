import { useState, useRef, useEffect } from 'react'
import { useProfile } from '../context/ProfileContext'
import { dietPresets, knownIngredients } from '../data/dietPresets'
import NavBar from '../components/NavBar'
import { X, Plus, Search, MoreHorizontal, RotateCcw } from 'lucide-react'

export default function ProfilePage() {
  const {
    activeProfile, updateProfile,
    customDiets, addCustomDiet, updateCustomDiet, removeCustomDiet,
    savePresetCustomisation, resetPresetCustomisation,
    getPresetCustomisation, isPresetCustomised,
  } = useProfile()
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [newDietName, setNewDietName] = useState('')
  const [customInput, setCustomInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef(null)

  const allDiets = [...dietPresets, ...customDiets]
  const isCustom = customDiets.some(d => d.id === activeProfile.presetId)

  function handlePresetChange(presetId) {
    const preset = allDiets.find(p => p.id === presetId)
    if (!preset) return
    const isBuiltIn = dietPresets.some(p => p.id === presetId)
    const customAvoidList = isBuiltIn ? getPresetCustomisation(presetId) : null
    updateProfile(activeProfile.id, {
      presetId: preset.id,
      name: preset.name,
      color: preset.color,
      avoidList: customAvoidList || preset.avoidList,
      emoji: preset.emoji,
    })
    setShowBottomSheet(true)
  }

  function removeIngredient(ingredient) {
    const newList = activeProfile.avoidList.filter(i => i !== ingredient)
    updateProfile(activeProfile.id, { avoidList: newList })
    const isBuiltIn = dietPresets.some(p => p.id === activeProfile.presetId)
    if (isBuiltIn) savePresetCustomisation(activeProfile.presetId, newList)
    if (isCustom) updateCustomDiet(activeProfile.presetId, { avoidList: newList })
  }

  function addIngredient(ingredient) {
    const item = (ingredient || '').trim().toLowerCase()
    if (!item || !knownIngredients.includes(item)) return
    if (activeProfile.avoidList.map(a => a.toLowerCase()).includes(item)) return
    const newList = [...activeProfile.avoidList, item]
    updateProfile(activeProfile.id, { avoidList: newList })
    const isBuiltIn = dietPresets.some(p => p.id === activeProfile.presetId)
    if (isBuiltIn) savePresetCustomisation(activeProfile.presetId, newList)
    if (isCustom) updateCustomDiet(activeProfile.presetId, { avoidList: newList })
    setCustomInput('')
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const suggestions = customInput.trim().length > 0
    ? knownIngredients
        .filter(i => i.includes(customInput.trim().toLowerCase()) && !activeProfile.avoidList.map(a => a.toLowerCase()).includes(i))
        .slice(0, 6)
    : []

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) addIngredient(suggestions[selectedIndex])
      else if (suggestions.length === 1) addIngredient(suggestions[0])
      else addIngredient(customInput)
    }
    else if (e.key === 'Escape') setShowSuggestions(false)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleCreateCustomDiet() {
    const name = newDietName.trim()
    if (!name) return
    const id = `custom-${Date.now()}`
    const newDiet = { id, name, description: 'Custom diet', color: '#D9CCFC', emoji: '📋', avoidList: [], isCustom: true }
    addCustomDiet(newDiet)
    updateProfile(activeProfile.id, { presetId: newDiet.id, name: newDiet.name, color: newDiet.color, avoidList: newDiet.avoidList, emoji: newDiet.emoji })
    setShowAddCustom(false)
    setNewDietName('')
    setShowBottomSheet(true)
  }

  function handleResetPreset() {
    const original = dietPresets.find(p => p.id === activeProfile.presetId)
    if (!original) return
    resetPresetCustomisation(activeProfile.presetId)
    updateProfile(activeProfile.id, { avoidList: original.avoidList })
  }

  return (
    <div className="pb-8">
      <NavBar />

      {/* Title */}
      <div className="mt-2 mb-8">
        <h1 className="text-[30px] leading-tight text-text-primary mb-1">
          Your Diet
        </h1>
        <p className="text-sm text-text-secondary">
          Select a preset or create a custom diet!
        </p>
      </div>

      {/* Custom diets section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            Your custom diets
          </h2>
          <button
            onClick={() => setShowAddCustom(true)}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-text-muted transition-colors"
          >
            <Plus className="w-4 h-4 text-text-primary" />
          </button>
        </div>

        {showAddCustom && (
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newDietName}
              onChange={(e) => setNewDietName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCustomDiet()}
              placeholder="Diet name..."
              className="flex-1 bg-warm-white rounded-xl border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-text-muted"
              autoFocus
            />
            <button onClick={handleCreateCustomDiet} disabled={!newDietName.trim()} className="bg-text-primary text-warm-white text-sm rounded-xl px-4 py-3 disabled:opacity-40">Create</button>
            <button onClick={() => { setShowAddCustom(false); setNewDietName('') }} className="text-sm text-text-secondary px-2">Cancel</button>
          </div>
        )}

        {customDiets.length > 0 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
            {customDiets.map((diet) => {
              const isActive = diet.id === activeProfile.presetId
              return (
                <button
                  key={diet.id}
                  onClick={() => handlePresetChange(diet.id)}
                  className={`flex-shrink-0 w-[160px] rounded-2xl p-4 border text-left transition-all ${
                    isActive ? 'border-text-primary bg-warm-white shadow-soft' : 'border-border bg-warm-white hover:border-text-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg">{diet.emoji || '📋'}</span>
                    <MoreHorizontal className="w-4 h-4 text-text-muted" />
                  </div>
                  <p className="text-sm font-medium text-text-primary mb-0.5 truncate">{diet.name}</p>
                  <p className="text-xs text-text-secondary">{diet.avoidList.length} items</p>
                </button>
              )
            })}
          </div>
        )}

        {customDiets.length === 0 && !showAddCustom && (
          <p className="text-sm text-text-muted">No custom diets yet. Tap + to create one.</p>
        )}
      </div>

      {/* Diet presets section */}
      <div className="mb-8">
        <h2 className="text-base text-text-primary mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Diet presets
        </h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
          {dietPresets.map((preset) => {
            const isActive = preset.id === activeProfile.presetId
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetChange(preset.id)}
                className={`flex-shrink-0 w-[180px] rounded-2xl p-4 border text-left transition-all ${preset.gradient} ${
                  isActive ? 'border-text-primary shadow-soft' : 'border-transparent hover:border-text-muted'
                }`}
              >
                <span className="text-lg block mb-2">{preset.emoji}</span>
                <p className="text-sm font-medium text-text-primary mb-1">{preset.name}</p>
                <p className="text-xs text-text-secondary leading-snug line-clamp-3">{preset.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Currently selected — tap to open sheet */}
      {!showBottomSheet && (
        <button
          onClick={() => setShowBottomSheet(true)}
          className="w-full bg-warm-white rounded-2xl p-4 border border-border flex items-center gap-3 text-left hover:border-text-muted transition-all"
        >
          <span className="text-lg">{activeProfile.emoji || '📋'}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">{activeProfile.name}</p>
            <p className="text-xs text-text-secondary">{activeProfile.avoidList.length} items — tap to edit</p>
          </div>
        </button>
      )}

      {/* Bottom sheet overlay */}
      {showBottomSheet && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowBottomSheet(false)} />}

      {/* Bottom sheet */}
      {showBottomSheet && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-warm-white rounded-t-3xl shadow-soft-lg border-t border-border max-h-[80vh] flex flex-col animate-fade-up">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeProfile.emoji || '📋'}</span>
              <h3 className="text-base font-medium text-text-primary">{activeProfile.name}</h3>
            </div>
            <div className="flex items-center gap-1">
              {!isCustom && isPresetCustomised(activeProfile.presetId) && (
                <button onClick={handleResetPreset} className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary px-2 py-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
              <button onClick={() => setShowBottomSheet(false)} className="w-9 h-9 flex items-center justify-center">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>

          <div className="px-5 py-3" ref={suggestionsRef}>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-cream rounded-xl border border-border px-4 py-3 gap-2 focus-within:border-text-muted">
                <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => { setCustomInput(e.target.value); setShowSuggestions(true); setSelectedIndex(-1) }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for an ingredient"
                  className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
                />
              </div>
              <button
                onClick={() => { if (suggestions.length === 1) addIngredient(suggestions[0]); else addIngredient(customInput) }}
                disabled={!customInput.trim() || !knownIngredients.includes(customInput.trim().toLowerCase())}
                className="w-10 h-10 rounded-full bg-green flex items-center justify-center disabled:opacity-40"
              >
                <Plus className="w-5 h-5 text-text-primary" />
              </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-2 bg-warm-white rounded-xl border border-border shadow-soft-lg max-h-[200px] overflow-y-auto">
                {suggestions.map((item, i) => (
                  <button key={item} onClick={() => addIngredient(item)}
                    className={`w-full text-left px-4 py-2.5 text-sm text-text-primary border-b border-border last:border-b-0 ${i === selectedIndex ? 'bg-cream' : 'hover:bg-cream'}`}
                  >{item}</button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <div className="flex flex-wrap gap-2">
              {activeProfile.avoidList.map((ingredient) => (
                <span key={ingredient} className="inline-flex items-center gap-2 bg-cream border border-border rounded-full pl-3.5 pr-1.5 py-2 text-sm text-text-primary">
                  {ingredient}
                  <button onClick={() => removeIngredient(ingredient)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-cream-dark transition-colors">
                    <X className="w-3.5 h-3.5 text-text-muted" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-border">
            <button onClick={() => setShowBottomSheet(false)} className="w-full bg-green text-text-primary text-base font-medium rounded-2xl py-3.5 hover:opacity-90 transition-opacity">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
