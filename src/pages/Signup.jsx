import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'

export default function Signup(){ 
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  async function doSignup(e){
    e.preventDefault()
    const { error } = await signup(email, pw)
    if(error) return alert(error.message)
    alert('Check your email to confirm sign up (if required)')
    window.location.href = '/'
  }

  return (
    <div className="auth-card">
      <h3>Create account</h3>
      <form onSubmit={doSignup}>
        <label>Email</label>
        <input value={email} onChange={e=> setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={pw} onChange={e=> setPw(e.target.value)} />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="button">Sign up</button>
        </div>
      </form>
    </div>
  )
}
