import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { ArrowLeft } from 'lucide-react'

export default function NavBar({ showBack = true }) {
  const navigate = useNavigate()
  const { activeProfile, account } = useProfile()

  const initial = account?.name?.charAt(0)?.toUpperCase() || 'S'

  return (
    <div className="flex items-center justify-between py-4">
      {/* Left: back arrow */}
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-warm-white border border-border flex items-center justify-center hover:border-text-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
      ) : (
        <div className="w-11" />
      )}

      {/* Center: diet name pill */}
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2 bg-warm-white rounded-full px-4 py-2 h-11 border border-border hover:border-text-muted transition-colors"
      >
        <span className="text-sm text-text-primary">
          {activeProfile.name}
        </span>
        <span className="text-sm">
          {activeProfile.emoji || '🟩'}
        </span>
      </button>

      {/* Right: user avatar */}
      <button
        onClick={() => navigate('/account')}
        className="w-11 h-11 rounded-full bg-warm-white border border-border flex items-center justify-center hover:border-text-muted transition-colors"
      >
        <span className="text-sm font-medium text-text-primary">
          {initial}
        </span>
      </button>
    </div>
  )
}
