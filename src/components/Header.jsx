import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import CartButton from './CartButton'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items, total } = useCart()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const generateMessage = () => {
    if (!items || items.length === 0) return encodeURIComponent('Hi Grizzlies! I would like to place an order.')
    const lines = items.map(i => `${i.qty}x ${i.name} - R${Number(i.price || 0) * i.qty}`)
    lines.push(`Total: R${total}`)
    return encodeURIComponent(`Hi Grizzlies! I would like to place an order:\n\n${lines.join('\n')}`)
  }

  const openWhatsApp = () => {
    const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '+27123456789').replace(/\D/g, '')
    const msg = generateMessage()
    window.open(`https://wa.me/${number}?text=${msg}`, '_blank')
  }

  return (
    <header className="gb-header">
      <div className="gb-container">
        <div className="left">
          <Link to="/" className="gb-logo">Grizzlies Clothing Store</Link>
        </div>

        <button
          className={`mobile-menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`nav-overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        />

        <nav className={`gb-nav ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-header">
            <Link to="/" className="gb-logo" onClick={() => setIsMenuOpen(false)}>
              Grizzlies
            </Link>
            <button
              className="mobile-menu-toggle open"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Merch</Link>
          <Link to="/sublimation" onClick={() => setIsMenuOpen(false)}>Sublimation</Link>
          <Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link>

          <div className="cart-summary">
            <div className="cart-summary-title">Cart</div>
            {items.length === 0 ? (
              <div className="cart-empty">Your cart is empty</div>
            ) : (
              <div>
                {items.map(it => (
                  <div key={it.id + JSON.stringify(it.extras || {})} className="cart-item">
                    <div>{it.qty} x {it.name}</div>
                    <div>R{Number(it.price || 0) * it.qty}</div>
                  </div>
                ))}
                <div className="cart-total">
                  <strong>Total:</strong> R{total}
                </div>
                <div className="cart-actions">
                  <Link
                    to="/cart"
                    className="button ghost"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    View Cart
                  </Link>
                  <button
                    className="button"
                    style={{ background: '#25D366', color: '#fff' }}
                    onClick={() => { openWhatsApp(); setIsMenuOpen(false) }}
                  >
                    WhatsApp Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="right">
          <CartButton />
        </div>
      </div>
    </header>
  )
}
