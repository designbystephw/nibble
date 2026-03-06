import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ScanPage from './pages/ScanPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  )
}

export default App
