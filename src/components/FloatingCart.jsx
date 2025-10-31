import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import useCart from '../hooks/useCart'
import { formatCurrency } from '../utils/formatters'

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

export default function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, remove, clear, total } = useCart()
  const count = items.reduce((s, i) => s + (i.qty || 1), 0)

  function openWhatsApp() {
    const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '+27123456789').replace(/\D/g, '')
    const lines = ['New order from website:']
    items.forEach(it => {
      lines.push(`${it.qty || 1} x ${it.name} — ${formatCurrency(it.price)}`)
      if (it.extras?.details) lines.push(`Details: ${JSON.stringify(it.extras.details)}`)
    })
    lines.push(`\nTotal: ${formatCurrency(total)}`)
    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${number}?text=${text}`, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      <motion.button
        className="floating-cart"
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <CartIcon />
        {count > 0 && <span className="cart-badge">{count}</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cart-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="cart-modal-backdrop"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="cart-modal-content"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="cart-modal-header">
                <h2 className="cart-modal-title">Your Cart</h2>
                <button className="cart-modal-close" onClick={() => setIsOpen(false)}>✕</button>
              </div>

              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#9a9a9a' }}>
                  Your cart is empty
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {items.map((it, idx) => (
                      <div key={idx} className="product" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{it.name}</div>
                          <div style={{ color: '#bdbdbd' }}>{it.qty} x {formatCurrency(it.price)}</div>
                          {it.extras?.details && (
                            <div style={{ color: '#bdbdbd', fontSize: '0.9em', marginTop: 4 }}>
                              Quality: {it.extras.details.quality}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700 }}>{formatCurrency(it.price * it.qty)}</div>
                          <button
                            onClick={() => remove(it.id)}
                            className="button"
                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text)', marginTop: 8 }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1em' }}>
                      Total: {formatCurrency(total)}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="button"
                        onClick={clear}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        Clear
                      </button>
                      <button className="button" onClick={openWhatsApp}>
                        Checkout via WhatsApp
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 20, padding: 12, background: 'rgba(37,211,102,0.06)', borderRadius: 8 }}>
                    <strong style={{ color: '#25D366' }}>Note:</strong>{' '}
                    <span style={{ color: '#bdbdbd' }}>
                      After checkout, you'll be redirected to WhatsApp to send your order. For sublimation orders,
                      please send your design files in the same chat.
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
