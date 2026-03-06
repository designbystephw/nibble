import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { generateMockResult } from '../data/mockScanResults'
import { Leaf, Search, BookOpen, ShieldCheck } from 'lucide-react'

const loadingSteps = [
  { icon: Search, text: 'searching the web...', duration: 1200 },
  { icon: BookOpen, text: 'scanning recipes...', duration: 1400 },
  { icon: ShieldCheck, text: 'checking your restrictions...', duration: 1000 },
]

export default function ScanPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToHistory } = useProfile()
  const dish = location.state?.dish

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!dish) {
      navigate('/')
      return
    }

    let stepIndex = 0
    function advanceStep() {
      stepIndex++
      if (stepIndex < loadingSteps.length) {
        setCurrentStep(stepIndex)
        setTimeout(advanceStep, loadingSteps[stepIndex].duration)
      } else {
        // "Scan" complete — generate result and navigate
        const result = generateMockResult(dish)
        addToHistory(result)
        navigate('/results', { state: { result }, replace: true })
      }
    }

    const timer = setTimeout(advanceStep, loadingSteps[0].duration)
    return () => clearTimeout(timer)
  }, [dish, navigate, addToHistory])

  if (!dish) return null

  const step = loadingSteps[currentStep]
  const StepIcon = step.icon

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Animated leaf illustration */}
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full bg-sage-light flex items-center justify-center">
          <Leaf className="w-9 h-9 text-forest animate-leaf-sway" />
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-sage-light animate-ping opacity-20" />
      </div>

      {/* Dish name */}
      <h2 className="font-mono text-lg lowercase text-text-primary mb-8">
        {dish.toLowerCase()}
      </h2>

      {/* Loading steps */}
      <div className="space-y-4 w-full max-w-[240px]">
        {loadingSteps.map((s, i) => {
          const Icon = s.icon
          const isActive = i === currentStep
          const isDone = i < currentStep

          return (
            <div
              key={s.text}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isActive ? 'opacity-100' : isDone ? 'opacity-40' : 'opacity-20'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                isActive ? 'bg-lilac-light' : isDone ? 'bg-sage-light' : 'bg-cream-dark'
              }`}>
                <Icon className={`w-4 h-4 transition-colors duration-500 ${
                  isActive ? 'text-cobalt' : isDone ? 'text-forest' : 'text-text-muted'
                }`} />
              </div>
              <span className={`font-mono text-sm lowercase transition-colors duration-500 ${
                isActive ? 'text-text-primary animate-gentle-pulse' : 'text-text-muted'
              }`}>
                {s.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
