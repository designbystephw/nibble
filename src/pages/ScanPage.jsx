import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { scanDish } from '../lib/scanService'
import { Search, BookOpen, ShieldCheck } from 'lucide-react'
import OnigiriIcon from '../components/OnigiriIcon'

const loadingSteps = [
  { icon: Search, text: 'searching the web...', duration: 1500 },
  { icon: BookOpen, text: 'scanning recipes...', duration: 2000 },
  { icon: ShieldCheck, text: 'checking your restrictions...', duration: 1500 },
]

export default function ScanPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToHistory, activeProfile } = useProfile()
  const dish = location.state?.dish

  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!dish) {
      navigate('/')
      return
    }

    // Start the API call immediately
    const apiPromise = scanDish(dish, activeProfile.avoidList)

    // Animate through loading steps
    let stepIndex = 0
    let completed = false

    function advanceStep() {
      stepIndex++
      if (stepIndex < loadingSteps.length) {
        setCurrentStep(stepIndex)
        setTimeout(advanceStep, loadingSteps[stepIndex].duration)
      } else {
        completed = true
        // Wait for API result
        apiPromise.then((result) => {
          addToHistory(result)
          navigate('/results', { state: { result }, replace: true })
        })
      }
    }

    const timer = setTimeout(advanceStep, loadingSteps[0].duration)

    // If API returns before animation finishes, wait for animation
    apiPromise.then((result) => {
      if (!completed) {
        // API finished early — store result and let animation finish
        const waitForAnimation = setInterval(() => {
          if (completed) {
            clearInterval(waitForAnimation)
            addToHistory(result)
            navigate('/results', { state: { result }, replace: true })
          }
        }, 100)
      }
    })

    return () => clearTimeout(timer)
  }, [dish, navigate, addToHistory, activeProfile.avoidList])

  if (!dish) return null

  return (
    <div className="pt-20 flex flex-col items-center justify-center min-h-[70vh]">
      {/* Animated onigiri */}
      <div className="relative mb-10">
        <div className="w-20 h-20 rounded-full bg-purple/30 flex items-center justify-center">
          <OnigiriIcon className="w-10 h-10 text-text-primary animate-gentle-pulse" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-purple/20 animate-ping opacity-20" />
      </div>

      {/* Dish name */}
      <h2 className="text-lg text-text-primary mb-8">
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
                isActive ? 'bg-purple/30' : isDone ? 'bg-green/30' : 'bg-cream-dark'
              }`}>
                <Icon className={`w-4 h-4 transition-colors duration-500 ${
                  isActive ? 'text-purple-dark' : isDone ? 'text-green-dark' : 'text-text-muted'
                }`} />
              </div>
              <span className={`text-sm transition-colors duration-500 ${
                isActive ? 'text-text-primary animate-gentle-pulse' : 'text-text-secondary'
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
