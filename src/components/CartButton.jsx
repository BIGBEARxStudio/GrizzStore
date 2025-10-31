import { useEffect, useState } from 'react'
import useCart from '../hooks/useCart'

export default function CartButton() {
  const { items } = useCart()
  const count = items.reduce((s, i) => s + (i.qty || 1), 0)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 500)
    return () => clearTimeout(timer)
  }, [count])
  return (
    <div className="cart-button-wrap">
      <button className="cart-button" aria-label="Open cart" onClick={() => {
        // dispatch event that drawer listens for
        window.dispatchEvent(new CustomEvent('gb:toggle-cart'))
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H21L20 12H8L6 6Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="19" r="1" fill="currentColor" /><circle cx="18" cy="19" r="1" fill="currentColor" /></svg>
      </button>
      {count > 0 && <div className={`cart-badge ${animate ? 'animate' : ''}`}>{count}</div>}
    </div>
  )
}
