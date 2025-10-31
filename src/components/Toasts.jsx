import { useEffect, useState } from 'react'

import useCart from '../hooks/useCart'

export default function Toasts() {
  const [toasts, setToasts] = useState([])
  const { undo } = useCart()

  useEffect(() => {
    function onCartAdded(e) {
      const { item, qty, count } = e?.detail || {}
      const text = item ? `${qty}× ${item.name} added to cart` : 'Item added to cart'
      const id = Date.now() + Math.random()
      const canUndo = e?.detail?.canUndo
      setToasts(t => [...t, { id, text, canUndo }])
      const timer = setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
      return () => clearTimeout(timer)
    }
    window.addEventListener('gb:cart-added', onCartAdded)
    return () => window.removeEventListener('gb:cart-added', onCartAdded)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="toasts-root" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className="toast-item">
          {t.text}
          {t.canUndo && <button onClick={() => { undo(); setToasts(prev => prev.filter(x => x.id !== t.id)) }}>Undo</button>}
        </div>
      ))}
    </div>
  )
}
