import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-1 w-full max-w-md mx-auto px-5 pb-8">
        <Outlet />
      </main>
    </div>
  )
}
