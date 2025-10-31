import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'
import useAuth from '../hooks/useAuth'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function load() {
      if (!user) return
      const { data } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setOrders(data || [])
    }; load()
  }, [user])

  if (!user) return <div>Please sign in to see your orders</div>

  return (
    <div>
      <h3>My Orders</h3>
      {orders.length === 0 ? <div>No orders yet</div> : (
        <div style={{ display: 'grid', gap: 10 }}>
          {orders.map(o => (
            <div key={o.id} className="card">
              <div><strong>Order:</strong> {o.id}</div>
              <div><strong>Status:</strong> {o.status}</div>
              <div><strong>Payload:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(o.payload, null, 2)}</pre></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
