import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import useCart from '../hooks/useCart'
import AudioPlayer from './AudioPlayer'

export default function CartDrawer() {
  const { items, remove, clear, total, attachFile } = useCart()
  const [open, setOpen] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    const handler = () => setOpen(o => !o)
    window.addEventListener('gb:toggle-cart', handler)
    return () => window.removeEventListener('gb:toggle-cart', handler)
  }, [])

  useEffect(() => {
    let t
    if (reviewing) {
      setCountdown(30)
      t = setInterval(() => setCountdown(c => {
        if (c <= 1) { confirmAndSend(); return 0 }
        return c - 1
      }), 1000)
    }
    return () => clearInterval(t)
  }, [reviewing])

  function startReview() { setReviewing(true) }
  function cancelReview() { setReviewing(false) }

  function confirmAndSend() {
    // build WA message
    const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '+27123456789').replace(/\D/g, '')
    const lines = ['New order from website:']
    items.forEach(it => {
      lines.push(`${it.qty || 1} x ${it.name} — R${it.price}`)
      if (it.extras?.details) lines.push(`Details: ${JSON.stringify(it.extras.details)}`)
      if (it.extras?.files) it.extras.files.forEach(f => lines.push('Design: ' + f))
    })
    if (phone) lines.push('Customer phone: ' + phone)
    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${number}?text=${text}`, '_blank')
    setReviewing(false)
    setOpen(false)
    // optionally clear cart after sending
    // clear()
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cart-backdrop" onClick={() => setOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="cart-drawer">
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button onClick={() => setOpen(false)} className="btn-ghost">Close</button>
            </div>

            <div className="cart-body">
              {items.length === 0 ? <div className="empty">Your cart is empty</div> : (
                <div className="cart-items">
                  {items.map((it, idx) => (
                    <div key={idx} className="cart-item">
                      <div className="left">
                        <img src={it.image_url || '/assets/images/placeholder.png'} alt={it.name} />
                      </div>
                      <div className="middle">
                        <div className="name">{it.name}</div>
                        <div className="meta">Qty: {it.qty || 1}</div>
                      </div>
                      <div className="right">
                        <div className="price">R{(it.price * (it.qty || 1)).toFixed(2)}</div>
                        <button className="btn-ghost" onClick={() => remove(it.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="cart-footer">
              <div className="total">Total: R{total.toFixed(2)}</div>
              <div className="phone-input">
                <label>Phone (for tracking)</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+27..." />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="button" onClick={startReview} disabled={items.length === 0}>Checkout (Review)</button>
                <button className="button" onClick={() => { window.dispatchEvent(new CustomEvent('gb:open-audio')); confirmAndSend(); }} style={{ background: 'transparent' }}>Direct WA</button>
              </div>

              {reviewing && (
                <div className="review-box">
                  <AudioPlayer src={'/assets/sounds/grizzlies_roar.mp3'} playOnMount />
                  <div>Auto-confirming in <strong>{countdown}s</strong></div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="button" onClick={confirmAndSend}>Confirm Now</button>
                    <button className="button" onClick={cancelReview} style={{ background: 'transparent' }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
