import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function NavLink({ to, children, onClick }) {
  const location = useLocation()
  const [shouldPulse, setShouldPulse] = useState(false)
  const isActive = location.pathname === to

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setShouldPulse(true)
        setTimeout(() => setShouldPulse(false), 1000)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [isActive])

  return (
    <Link to={to} onClick={onClick} className={`nav-link ${isActive ? 'active' : ''}`}>
      {isActive && (
        <motion.div
          className="nav-link-background"
          layoutId="nav-background"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {shouldPulse && (
        <motion.div
          className="nav-link-pulse"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      )}
      {children}
    </Link>
  )
}
