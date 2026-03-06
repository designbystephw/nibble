import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { generateMockResult } from '../data/mockScanResults'
import { Search, BookOpen, ShieldCheck } from 'lucide-react'
import OnigiriIcon from '../components/OnigiriIcon'

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
        const result = generateMockResult(dish)
        addToHistory(result)
        navigate('/results', { state: { result }, replace: true })
      }
    }

    const timer = setTimeout(advanceStep, loadingSteps[0].duration)
    return () => clearTimeout(timer)
  }, [dish, navigate, addToHistory])

  if (!dish) return null

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Animated onigiri */}
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full bg-indigo-light flex items-center justify-center">
          <OnigiriIcon className="w-10 h-10 text-indigo animate-gentle-pulse" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-indigo-light animate-ping opacity-20" />
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
                isActive ? 'bg-indigo-light' : isDone ? 'bg-sage-light' : 'bg-cream-dark'
              }`}>
                <Icon className={`w-4 h-4 transition-colors duration-500 ${
                  isActive ? 'text-indigo' : isDone ? 'text-forest' : 'text-text-muted'
                }`} />
              </div>
              <span className={`font-mono text-sm lowercase transition-colors duration-500 ${
                isActive ? 'text-indigo animate-gentle-pulse' : 'text-text-secondary'
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
