import { motion } from 'framer-motion'
import { useState } from 'react'
import useCart from '../hooks/useCart'

const WhatsAppSVG = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
    <path d="M20.5 3.5A11.97 11.97 0 0 0 12 0C5.373 0 .001 5.373.001 12c0 2.116.553 4.091 1.603 5.862L0 24l6.314-1.606A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12 0-1.977-.475-3.84-1.5-5.5zM12 21.5c-1.03 0-2.03-.168-3-.5l-.213-.078L5 20l.923-3.686-.122-.198A8.48 8.48 0 0 1 3.5 12.001c0-4.694 3.806-8.5 8.5-8.5 4.692 0 8.5 3.806 8.5 8.5S16.692 21.5 12 21.5z" />
    <path d="M17.2 14.2c-.26-.13-1.53-.76-1.77-.85-.24-.09-.41-.13-.59.13s-.68.85-.83 1.02c-.15.17-.3.19-.56.06-.26-.13-1.09-.4-2.07-1.27-.77-.69-1.29-1.55-1.44-1.81-.15-.26-.016-.4.11-.53.11-.11.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.31-.02-.44-.06-.13-.59-1.43-.81-1.95-.22-.51-.44-.44-.59-.45l-.5-.01c-.17 0-.44.06-.67.31-.24.26-.9.88-.9 2.15 0 1.26.92 2.48 1.05 2.65.13.17 1.81 2.83 4.38 3.95 2.57 1.12 2.57.75 3.03.7.46-.06 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.06-.11-.24-.17-.5-.3z" />
  </svg>
)

export default function FloatingWA() {
  const { items, total } = useCart()
  const [showPreview, setShowPreview] = useState(false)
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || '+27123456789').replace(/\D/g, '')

  const generateMessage = () => {
    const orderItems = items.map(item => (
      `${item.qty}x ${item.name} @ R${item.price} each` +
      (item.extras?.files ? `\nFiles: ${item.extras.files.join(', ')}` : '')
    )).join('\n')

    return encodeURIComponent(
      `Hi Grizzlies! I would like to place an order:\n\n${orderItems}\n\nTotal: R${total}`
    )
  }

  const openWA = () => {
    const message = generateMessage()
    window.open(`https://wa.me/${number}?text=${message}`, '_blank')
  }

  return (
    <>
      <motion.button
        className="floating-wa"
        onClick={openWA}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04 }}
      >
        <WhatsAppSVG />
        {items.length > 0 && <span className="wa-badge">{items.length}</span>}
      </motion.button>

      {showPreview && items.length > 0 && (
        <motion.div
          className="wa-preview"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="wa-preview-header">Send Order via WhatsApp</div>
          {items.map(item => (
            <div key={item.id} className="wa-preview-item">
              <span>{item.qty}x {item.name}</span>
              <span>R{item.price * item.qty}</span>
            </div>
          ))}
          <div className="wa-preview-total">
            <strong>Total:</strong> R{total}
          </div>
        </motion.div>
      )}
    </>
  )
}
