import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { ArrowLeft, Mail, User, LogOut } from 'lucide-react'
import OnigiriIcon from '../components/OnigiriIcon'

export default function AccountPage() {
  const navigate = useNavigate()
  const { account, signUp, signOut } = useProfile()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleEmailAuth(e) {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name')
        return
      }
      signUp(trimmedEmail, name.trim())
    } else {
      // Sign in — create account if doesn't exist (simple localStorage auth)
      signUp(trimmedEmail, name.trim() || trimmedEmail.split('@')[0])
    }
  }

  function handleGoogleSSO() {
    // Simulate Google SSO — in production, this would use Firebase Auth or similar
    const mockEmail = 'user@gmail.com'
    const mockName = 'Google User'
    signUp(mockEmail, mockName)
  }

  // Signed in view
  if (account) {
    return (
      <div className="pt-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-text-primary hover:text-indigo transition-colors min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-mono lowercase">back</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="font-mono text-xl lowercase text-text-primary mb-1">
            your account
          </h1>
          <p className="text-sm text-text-secondary">
            Your settings are saved to this device
          </p>
        </div>

        <div className="bg-warm-white rounded-2xl p-5 border border-border shadow-soft mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-light flex items-center justify-center">
              <User className="w-6 h-6 text-indigo" />
            </div>
            <div>
              <p className="font-mono text-sm font-medium text-text-primary">
                {account.name}
              </p>
              <p className="text-xs text-text-secondary">
                {account.email}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-text-muted">
            Joined {new Date(account.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-warm-white rounded-2xl p-4 border border-border shadow-soft mb-6">
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Your diet preferences, custom diets, and search history are automatically saved to this device.
            Sign in on another device to sync your data.
          </p>
        </div>

        <button
          onClick={() => {
            signOut()
          }}
          className="w-full flex items-center justify-center gap-2 bg-warm-white border border-border rounded-2xl py-3.5 min-h-[48px] text-sm font-mono lowercase text-danger hover:bg-blush-light transition-all shadow-soft"
        >
          <LogOut className="w-4 h-4" />
          sign out
        </button>
      </div>
    )
  }

  // Auth form view
  return (
    <div className="pt-6 pb-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-text-primary hover:text-indigo transition-colors min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-mono lowercase">back</span>
        </button>
      </div>

      {/* Logo + title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-indigo-light flex items-center justify-center mb-4">
          <OnigiriIcon className="w-8 h-8 text-indigo" />
        </div>
        <h1 className="font-mono text-xl lowercase text-text-primary mb-1">
          {mode === 'signup' ? 'create account' : 'welcome back'}
        </h1>
        <p className="text-sm text-text-secondary text-center">
          {mode === 'signup'
            ? 'Save your diet settings across sessions'
            : 'Sign in to access your saved settings'}
        </p>
      </div>

      {/* Google SSO button */}
      <button
        onClick={handleGoogleSSO}
        className="w-full flex items-center justify-center gap-3 bg-warm-white border border-border rounded-2xl py-3.5 min-h-[48px] text-sm font-medium text-text-primary hover:border-indigo transition-all shadow-soft mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted font-mono lowercase">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailAuth} className="space-y-3">
        {mode === 'signup' && (
          <div className="flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 min-h-[48px] gap-3 shadow-soft focus-within:border-indigo transition-all">
            <User className="w-4 h-4 text-indigo flex-shrink-0" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              className="flex-1 bg-transparent outline-none text-sm font-mono lowercase text-text-primary placeholder:text-text-muted"
            />
          </div>
        )}

        <div className="flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 min-h-[48px] gap-3 shadow-soft focus-within:border-indigo transition-all">
          <Mail className="w-4 h-4 text-indigo flex-shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email address"
            className="flex-1 bg-transparent outline-none text-sm font-mono lowercase text-text-primary placeholder:text-text-muted"
          />
        </div>

        {error && (
          <p className="text-xs text-danger px-1">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-indigo text-white font-mono text-sm lowercase rounded-2xl py-3.5 min-h-[48px] shadow-soft hover:opacity-90 transition-opacity"
        >
          {mode === 'signup' ? 'create account' : 'sign in'}
        </button>
      </form>

      {/* Toggle mode */}
      <p className="text-center text-xs text-text-secondary mt-6">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <button
              onClick={() => { setMode('signin'); setError('') }}
              className="text-indigo hover:underline font-medium"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className="text-indigo hover:underline font-medium"
            >
              Create one
            </button>
          </>
        )}
      </p>
    </div>
  )
}
