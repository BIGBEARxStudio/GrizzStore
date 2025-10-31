import { motion } from 'framer-motion'
import { useState } from 'react'
import { supabase } from '../api/supabaseClient'

const AuthIllustration = () => (
  <svg width="280" height="280" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      d="M300 550C439.746 550 550 439.746 550 300C550 160.254 439.746 50 300 50C160.254 50 50 160.254 50 300C50 439.746 160.254 550 300 550Z"
      stroke="rgba(255, 190, 11, 0.2)"
      strokeWidth="20"
    />
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
      d="M300 400C355.228 400 400 355.228 400 300C400 244.772 355.228 200 300 200C244.772 200 200 244.772 200 300C200 355.228 244.772 400 300 400Z"
      stroke="rgba(255, 190, 11, 0.4)"
      strokeWidth="20"
    />
    <motion.path
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      d="M300 330C316.569 330 330 316.569 330 300C330 283.431 316.569 270 300 270C283.431 270 270 283.431 270 300C270 316.569 283.431 330 300 330Z"
      fill="#FFBE0B"
    />
  </svg>
)

const InputField = ({ label, type = "text", value, onChange, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="auth-input-group"
  >
    <label className="auth-label">{label}</label>
    <div className="auth-input-wrapper">
      {Icon && <Icon className="auth-input-icon" />}
      <input
        type={type}
        className="auth-input"
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </motion.div>
)

const EmailIcon = ({ className }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const LockIcon = ({ className }) => (
  <svg className={className} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-6V4.5a2.5 2.5 0 015 0V9m-5 0h8a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2h8z" />
  </svg>
)

export default function Auth() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function signIn(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pw
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-card">
        <div className="auth-illustration">
          <AuthIllustration />
        </div>

        <motion.form
          className="auth-form"
          onSubmit={signIn}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your admin dashboard</p>

          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={EmailIcon}
          />

          <InputField
            label="Password"
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            icon={LockIcon}
          />

          <motion.button
            className={`auth-submit ${loading ? 'loading' : ''}`}
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>

          <div className="auth-footer">
            <p>Need help? Contact support</p>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}
