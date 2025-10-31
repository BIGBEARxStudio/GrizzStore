import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import FloatingCart from './components/FloatingCart'
import FloatingWA from './components/FloatingWA'
import NavLink from './components/NavLink'
import Toasts from './components/Toasts'
import useAuth from './hooks/useAuth'
import About from './pages/About'
import AdminPanel from './pages/AdminPanel'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Products from './pages/Products'
import Sublimation from './pages/Sublimation'

// Icons for the navigation
const Icons = {
  Home: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Shop: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Print: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Admin: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1 1 1 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
  ,
  About: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4" />
    </svg>
  )
}

const page = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0, transition: { duration: 0.36 } }, exit: { opacity: 0, y: -8, transition: { duration: 0.24 } } }

function AnimatedRoutes() {
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><Home /></motion.div>} />
        <Route path="/products" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><Products /></motion.div>} />
        <Route path="/sublimation" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><Sublimation /></motion.div>} />
        <Route path="/about" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><About /></motion.div>} />
        <Route path="/cart" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><Cart /></motion.div>} />
        <Route path="/admin" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><AdminPanel /></motion.div>} />
        <Route path="/auth" element={<motion.div variants={page} initial="initial" animate="animate" exit="exit"><Auth /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { user } = useAuth()
  const toggleRef = useRef(null)
  const navRef = useRef(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : true)

  useEffect(() => {
    let prevActive = null
    function onKey(e) {
      if (!isNavOpen) return
      if (e.key === 'Escape') {
        setIsNavOpen(false)
        if (toggleRef.current) toggleRef.current.focus()
      }

      if (e.key === 'Tab') {
        const container = navRef.current
        if (!container) return
        const focusable = Array.from(container.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')).filter(n => !n.hasAttribute('disabled'))
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    if (isNavOpen) {
      prevActive = document.activeElement
      document.addEventListener('keydown', onKey)
      // focus first focusable in nav
      setTimeout(() => {
        const container = navRef.current
        if (!container) return
        const focusable = container.querySelectorAll('a,button,[tabindex]:not([tabindex="-1")')
        if (focusable.length) focusable[0].focus()
      }, 0)
    }

    return () => {
      document.removeEventListener('keydown', onKey)
      if (!isNavOpen && prevActive && prevActive.focus) prevActive.focus()
    }
  }, [isNavOpen])

  useEffect(() => {
    // keep track of whether we're on a small/mobile viewport
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setIsMobile(e.matches)
    // set initial
    setIsMobile(mq.matches)
    if (mq.addEventListener) mq.addEventListener('change', handler)
    else mq.addListener(handler)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler)
      else mq.removeListener(handler)
    }
  }, [])

  // Add a function to close the nav
  function closeNav() {
    setIsNavOpen(false);
    if (toggleRef.current) toggleRef.current.focus();
  }

  return (
    <BrowserRouter>
      <header className="gb-header">
        <div className="gb-container">
          <Link to="/" className="gb-logo">
            <Icons.Home />
            <span className="logo-text">GRIZZLIES</span>
          </Link>

          <button ref={toggleRef} className={`mobile-menu-toggle ${isNavOpen ? 'open' : ''}`} onClick={() => setIsNavOpen(v => !v)} aria-label="Toggle navigation" aria-expanded={isNavOpen}>
            <span />
            <span />
            <span />
          </button>

          {/* Render nav always for desktop; for mobile rely on isNavOpen + CSS */}
          <motion.nav
            ref={navRef}
            role="navigation"
            aria-hidden={isMobile ? !isNavOpen : false}
            className={`gb-nav ${isMobile ? (isNavOpen ? 'active' : '') : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NavLink to="/" onClick={closeNav}>
              <Icons.Home />
              <span>Home</span>
            </NavLink>
            <NavLink to="/products" onClick={closeNav}>
              <Icons.Shop />
              <span>Merch</span>
            </NavLink>
            <NavLink to="/sublimation" onClick={closeNav}>
              <Icons.Print />
              <span>Sublimation</span>
            </NavLink>
            <NavLink to="/about" onClick={closeNav}>
              <Icons.About />
              <span>About</span>
            </NavLink>
            <NavLink to="/auth" onClick={closeNav}>
              <Icons.User />
              <span>Sign In</span>
            </NavLink>
            {user && (
              <NavLink to="/admin" onClick={closeNav}>
                <Icons.Admin />
                <span>Admin</span>
              </NavLink>
            )}
          </motion.nav>

          {/* overlay only active on mobile when nav is open to frost background */}
          <div className={`nav-overlay ${isMobile && isNavOpen ? 'active' : ''}`} onClick={closeNav} />
        </div>
      </header>

      <Toasts />
      <FloatingWA />
      <FloatingCart />

      <main className="gb-container">
        <AnimatedRoutes />
      </main>

      <footer className="gb-footer">
        <div className="gb-container">© {new Date().getFullYear()} Grizzlies • Bigbear</div>
      </footer>
    </BrowserRouter>
  )
}
