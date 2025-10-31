import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../api/supabaseClient'

const Icons = {
  Shop: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Visitor: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M12 14c-3.314 0-6 1.343-6 3v1h12v-1c0-1.657-2.686-3-6-3z" />
    </svg>
  ),
  Order: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 0V3a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6M12 12v3m0 0v3m0-3h3m-3 0H9" />
    </svg>
  )
}

export default function Welcome() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function continueAsVisitor() {
    navigate('/products')
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Save customer info to supabase
      const { error: dbError } = await supabase
        .from('customers')
        .insert([
          {
            email: email || null,
            phone: phoneNumber || null,
            type: 'customer'
          }
        ])

      if (dbError) throw dbError

      // If they provided an email, send them a magic link
      if (email) {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email,
        })
        if (authError) throw authError
      }

      // Navigate to products page
      navigate('/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isRegistering ? (
        <div className="welcome-card">
          <motion.h2
            className="welcome-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Grizzlies
          </motion.h2>

          <motion.p
            className="welcome-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Choose how you'd like to continue
          </motion.p>

          <motion.div
            className="welcome-options"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button className="welcome-option" onClick={continueAsVisitor}>
              <Icons.Visitor />
              <div>
                <h3>Continue as Visitor</h3>
                <p>Browse our merch collection</p>
              </div>
            </button>

            <button className="welcome-option" onClick={() => setIsRegistering(true)}>
              <Icons.Order />
              <div>
                <h3>Place an Order</h3>
                <p>Register to track your orders</p>
              </div>
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="welcome-card">
          <motion.h2
            className="welcome-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Quick Registration
          </motion.h2>

          <motion.p
            className="welcome-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Provide your contact info to track orders
          </motion.p>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.form
            className="welcome-form"
            onSubmit={handleRegister}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="form-group">
              <label>Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="For order tracking via magic link"
                className="welcome-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number (optional)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="For order notifications"
                className="welcome-input"
              />
            </div>

            <div className="welcome-actions">
              <button
                type="button"
                className="button ghost"
                onClick={() => setIsRegistering(false)}
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="button"
                disabled={loading || (!email && !phoneNumber)}
              >
                {loading ? 'Registering...' : 'Continue to Shop'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </motion.div>
  )
}
