import { Routes, Route } from 'react-router-dom'
import BuilderPage from './pages/BuilderPage'
import DemoPage from './pages/DemoPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BuilderPage />} />
      <Route path="/demo" element={<DemoPage />} />
    </Routes>
  )
}
