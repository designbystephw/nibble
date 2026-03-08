import { Outlet } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col relative">
      <main className="flex-1 w-full max-w-md mx-auto px-5 pb-8">
        {children || <Outlet />}
      </main>
      {/* Bottom gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-40 gradient-bottom pointer-events-none" />
    </div>
  )
}
