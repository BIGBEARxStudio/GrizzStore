import React from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../api/supabaseClient'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children, requiresAuth = true }) {
  const { user } = useAuth()
  const [isCustomer, setIsCustomer] = React.useState(false)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let isMounted = true

    async function verifyCustomerStatus() {
      if (!user?.id) {
        if (isMounted) {
          setLoading(false)
          setIsCustomer(false)
          setIsAdmin(false)
        }
        return
      }

      try {
        // First, verify the user's session is valid
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session) throw new Error('Invalid session')

        // Then check if they're a customer using RLS-protected query
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, role')
          .eq('user_id', user.id)
          .single()

        if (customerError && customerError.code !== 'PGRST116') {
          throw customerError
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setIsCustomer(!!customerData)
          setIsAdmin(customerData?.role === 'admin')
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error verifying access:', err)
          setError(err.message)
          setIsCustomer(false)
          setIsAdmin(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    verifyCustomerStatus()

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false
    }
  }, [user])

  if (loading) {
    return (
      <div className="loading-state">
        Verifying access...
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-error">
        Access verification failed. Please try signing in again.
      </div>
    )
  }

  // Public routes that don't require auth
  const publicPaths = ['/products', '/about', '/welcome']
  if (publicPaths.includes(window.location.pathname)) {
    return children
  }

  // Admin routes require admin role
  if (window.location.pathname.startsWith('/admin')) {
    return isAdmin ? children : <Navigate to="/auth" replace />
  }

  // Protected routes (orders, cart, etc)
  if (requiresAuth) {
    // If not authenticated at all, redirect to welcome
    if (!user) {
      return <Navigate to="/welcome" replace />
    }

    // If authenticated but not a verified customer, go to welcome
    if (!isCustomer) {
      return <Navigate to="/welcome" replace />
    }
  }

  return children
}
