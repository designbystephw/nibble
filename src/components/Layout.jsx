import { Outlet } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-cream dot-grid flex flex-col">
      <main className="flex-1 w-full max-w-md mx-auto px-5 pb-8">
        {children || <Outlet />}
      </main>
    </div>
  )
}
