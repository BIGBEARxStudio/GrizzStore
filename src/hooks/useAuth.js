import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'

export default function useAuth() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const signup = async (email, password) => {
    return await supabase.auth.signUp({ email, password })
  }
  const signin = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }
  const signout = async () => {
    await supabase.auth.signOut()
  }
  return { user, signup, signin, signout }
}
