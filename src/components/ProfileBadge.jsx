import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { User } from 'lucide-react'

export default function ProfileBadge() {
  const { activeProfile, account } = useProfile()
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2.5 bg-warm-white rounded-full px-4 py-2.5 min-h-[44px] shadow-soft border border-border hover:border-indigo transition-colors"
      >
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: activeProfile.color }}
        />
        <span className="text-xs font-mono lowercase text-text-primary truncate max-w-[100px]">
          {activeProfile.name}
        </span>
      </button>
      <button
        onClick={() => navigate('/account')}
        className="w-[44px] h-[44px] rounded-full bg-warm-white border border-border shadow-soft flex items-center justify-center hover:border-indigo transition-colors"
      >
        {account ? (
          <div className="w-6 h-6 rounded-full bg-indigo-light flex items-center justify-center">
            <span className="text-[13px] font-mono font-medium text-indigo">
              {account.name.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <User className="w-4 h-4 text-text-secondary" />
        )}
      </button>
    </div>
  )
}
