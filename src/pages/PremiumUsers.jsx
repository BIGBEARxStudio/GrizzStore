import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'

export default function PremiumUsers() {
  const [list, setList] = useState([])
  const [email, setEmail] = useState('')

  useEffect(() => { load() }, [])
  async function load() { const { data } = await supabase.from('premium_users').select('*').order('created_at', { ascending: false }); setList(data || []) }

  async function add() {
    if (!email) return alert('Email required')
    await supabase.from('premium_users').insert({ email, role: 'premium' })
    setEmail(''); load()
  }
  async function remove(id) { await supabase.from('premium_users').delete().eq('id', id); load() }

  return (
    <div>
      <h3>Premium Users</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder='email' />
        <button className='button' onClick={add}>Add</button>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {list.map(u => (
          <div key={u.id} className='card' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{u.email} • {u.role}</div>
            <div><button className='button' style={{ background: 'transparent' }} onClick={() => remove(u.id)}>Remove</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
