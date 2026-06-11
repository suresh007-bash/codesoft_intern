import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import LandingPage from './pages/LandingPage'
import Calculator from './pages/Calculator'
import JobBoard from './pages/JobBoard'
import QuizMaker from './pages/QuizMaker'
import ECommerce from './pages/ECommerce'
import ProjectManager from './pages/ProjectManager'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/jobboard" element={<JobBoard />} />
        <Route path="/quiz" element={<QuizMaker />} />
        <Route path="/ecommerce" element={<ECommerce />} />
        <Route path="/projects" element={<ProjectManager />} />
      </Routes>
    </BrowserRouter>
  )
}
