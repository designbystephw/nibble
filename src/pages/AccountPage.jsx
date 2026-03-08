import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { ArrowLeft, Mail, User, LogOut, Lock } from 'lucide-react'
import OnigiriIcon from '../components/OnigiriIcon'

export default function AccountPage({ embedded = false }) {
  const navigate = useNavigate()
  const { account, authLoading, signUp, signIn, signInWithGoogle, signOut } = useProfile()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  async function handleEmailAuth(e) {
    e.preventDefault()
    setError('')
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !trimmedEmail.includes('@')) { setError('Please enter a valid email address'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return }
        await signUp(trimmedEmail, password, name.trim())
        setConfirmationSent(true)
      } else {
        await signIn(trimmedEmail, password)
      }
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleGoogleSSO() {
    setError('')
    try { await signInWithGoogle() } catch (err) { setError(err.message) }
  }

  if (authLoading) {
    return (
      <div className="pt-6 pb-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-text-secondary">loading...</p>
      </div>
    )
  }

  if (confirmationSent) {
    return (
      <div className="pt-6 pb-8">
        {!embedded && (
          <div className="mb-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-text-primary min-h-[44px]">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">back</span>
            </button>
          </div>
        )}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-purple/30 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-purple-dark" />
          </div>
          <h1 className="text-xl text-text-primary mb-2">Check your email</h1>
          <p className="text-sm text-text-secondary mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <button onClick={() => { setConfirmationSent(false); setMode('signin') }} className="text-sm text-purple-dark hover:underline">
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  if (account) {
    return (
      <div className="pt-6 pb-8">
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-text-primary min-h-[44px]">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">back</span>
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-[30px] leading-tight text-text-primary mb-1">Your Account</h1>
          <p className="text-sm text-text-secondary">Your data syncs automatically across devices</p>
        </div>

        <div className="bg-warm-white rounded-2xl p-5 border border-border shadow-soft mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple/30 flex items-center justify-center">
              <User className="w-6 h-6 text-purple-dark" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{account.name}</p>
              <p className="text-xs text-text-secondary">{account.email}</p>
            </div>
          </div>
          <p className="text-xs text-text-muted">
            Joined {new Date(account.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-warm-white rounded-2xl p-4 border border-border shadow-soft mb-6">
          <p className="text-sm text-text-secondary leading-relaxed">
            Your diet preferences, custom diets, and search history are saved to your account and sync across all your devices.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 bg-warm-white border border-border rounded-2xl py-3.5 text-sm text-danger hover:bg-danger-light transition-all shadow-soft"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="pt-6 pb-8">
      {!embedded && (
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-text-primary min-h-[44px]">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">back</span>
          </button>
        </div>
      )}
      {embedded && <div className="mb-8" />}

      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-purple/30 flex items-center justify-center mb-4">
          <OnigiriIcon className="w-8 h-8 text-text-primary" />
        </div>
        <h1 className="text-xl text-text-primary mb-1">
          {mode === 'signup' ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-text-secondary text-center">
          {mode === 'signup' ? 'Save your diet settings across devices' : 'Sign in to access your saved settings'}
        </p>
      </div>

      <button
        onClick={handleGoogleSSO}
        className="w-full flex items-center justify-center gap-3 bg-warm-white border border-border rounded-2xl py-3.5 text-sm font-medium text-text-primary hover:border-text-muted transition-all shadow-soft mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-3">
        {mode === 'signup' && (
          <div className="flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 gap-3 shadow-soft focus-within:border-text-muted">
            <User className="w-4 h-4 text-text-muted flex-shrink-0" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
              className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted" />
          </div>
        )}

        <div className="flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 gap-3 shadow-soft focus-within:border-text-muted">
          <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
            className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted" />
        </div>

        <div className="flex items-center bg-warm-white rounded-2xl border border-border px-4 py-3 gap-3 shadow-soft focus-within:border-text-muted">
          <Lock className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted" />
        </div>

        {error && <p className="text-xs text-danger px-1">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-text-primary text-warm-white text-sm font-medium rounded-2xl py-3.5 shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <p className="text-center text-xs text-text-secondary mt-6">
        {mode === 'signup' ? (
          <>Already have an account?{' '}<button onClick={() => { setMode('signin'); setError('') }} className="text-text-primary font-medium hover:underline">Sign in</button></>
        ) : (
          <>Don't have an account?{' '}<button onClick={() => { setMode('signup'); setError('') }} className="text-text-primary font-medium hover:underline">Create one</button></>
        )}
      </p>
    </div>
  )
}
