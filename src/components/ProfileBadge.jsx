import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { User } from 'lucide-react'

export default function ProfileBadge() {
  const { activeProfile } = useProfile()
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/profile')}
      className="flex items-center gap-2.5 bg-warm-white rounded-full px-4 py-2 shadow-soft border border-border hover:border-indigo transition-colors"
    >
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: activeProfile.color }}
      />
      <span className="text-xs font-mono lowercase text-text-secondary truncate max-w-[140px]">
        {activeProfile.name}
      </span>
      <User className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
    </button>
  )
}
