import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'

export default function Login(){ 
  const { signin } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  async function doLogin(e){
    e.preventDefault()
    const { error } = await signin(email, pw)
    if(error) return alert(error.message)
    window.location.href = '/'
  }

  return (
    <div className="auth-card">
      <h3>Sign in</h3>
      <form onSubmit={doLogin}>
        <label>Email</label>
        <input value={email} onChange={e=> setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={pw} onChange={e=> setPw(e.target.value)} />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="button">Sign in</button>
        </div>
      </form>
    </div>
  )
}
