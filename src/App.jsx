import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useProfile } from './context/ProfileContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import ResultsPage from './pages/ResultsPage'
import ProfilePage from './pages/ProfilePage'
import AccountPage from './pages/AccountPage'
import OnigiriIcon from './components/OnigiriIcon'

function AuthGate({ children }) {
  const { user, authLoading } = useProfile()
  const [showTransition, setShowTransition] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!authLoading && user && !ready) {
      setShowTransition(true)
      const timer = setTimeout(() => {
        setShowTransition(false)
        setReady(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
    if (!authLoading && !user) {
      // Reset so transition shows again on next login
      setReady(false)
      setShowTransition(false)
    }
  }, [authLoading, user, ready])

  // Still loading auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream dot-grid flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-indigo-light flex items-center justify-center mb-4">
            <OnigiriIcon className="w-8 h-8 text-indigo animate-gentle-pulse" />
          </div>
          <p className="font-mono text-sm lowercase text-text-secondary">loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in — show auth page
  if (!user) {
    return (
      <Layout>
        <AccountPage embedded />
      </Layout>
    )
  }

  // Just logged in — show authorising transition
  if (showTransition) {
    return (
      <div className="min-h-screen bg-cream dot-grid flex items-center justify-center">
        <div className="flex flex-col items-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-indigo-light flex items-center justify-center mb-4">
            <OnigiriIcon className="w-8 h-8 text-indigo animate-gentle-pulse" />
          </div>
          <p className="font-mono text-sm lowercase text-indigo">authorising...</p>
        </div>
      </div>
    )
  }

  return children
}

function App() {
  return (
    <AuthGate>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </AuthGate>
  )
}

export default App
