import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Chatbot from './components/common/Chatbot'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoaderOverlay from './components/LoaderOverlay'
import Home from './pages/Home'
import PrivacyPolicy from './pages/PrivacyPolicy'
import SecurityTerms from './pages/SecurityTerms'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import CaseStudies from './pages/CaseStudies'
import SystemStatus from './pages/SystemStatus'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import './styles/global.css'

function App() {
  return (
    <ErrorBoundary>
      <LoaderOverlay />
      <Router>
        <div className="app-wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/system-status" element={<SystemStatus />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/security" element={<SecurityTerms />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
