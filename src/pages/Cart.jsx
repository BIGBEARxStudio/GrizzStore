import { useState } from 'react'
import useCart from '../hooks/useCart'

export default function Cart() {
  const { items, remove, total, clear, attachFile } = useCart()
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '+27123456789'
  const [showModal, setShowModal] = useState(false)
  const [messageText, setMessageText] = useState('')

  function generateMessage() {
    const lines = ['New order from website', 'Items:']
    items.forEach(it => {
      lines.push(`${it.qty} x ${it.name} — R${it.price} ${it.extras?.details ? '| ' + JSON.stringify(it.extras.details) : ''}`)
      if (it.extras?.files) it.extras.files.forEach(f => lines.push('Design: ' + f))
    })
    lines.push('Total: R' + total.toFixed(2))
    return lines.join('\n')
  }

  function checkout() {
    const text = generateMessage()
    setMessageText(text)
    setShowModal(true)
  }

  function openWhatsApp() {
    const text = encodeURIComponent(messageText)
    const wa = `https://wa.me/${number.replace(/\D/g, '')}?text=${text}`
    window.open(wa, '_blank')
    setShowModal(false)
  }

  if (items.length === 0) return <div>Your cart is empty</div>

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Your Cart</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((it, idx) => (
          <div key={idx} className="product" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{it.name}</div>
              <div style={{ color: '#bdbdbd' }}>{it.qty} x R{it.price}</div>
              {it.extras?.files?.length ? <div style={{ marginTop: 8 }}><small>Attachments: {it.extras.files.length}</small></div> : null}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>R{(it.price * it.qty).toFixed(2)}</div>
              <button onClick={() => remove(it.id)} className="button" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text)', marginTop: 8 }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700 }}>Total: R{total.toFixed(2)}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="button" onClick={clear} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}>Clear</button>
          <button className="button" onClick={checkout}>Checkout via WhatsApp</button>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <h4>Design files</h4>
        <div style={{ color: '#bdbdbd' }}>Please do not upload files here. After you complete checkout via WhatsApp, send your design files to the same WhatsApp number: <strong>{number}</strong></div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Your Order Message</h3>
            <textarea
              value={messageText}
              readOnly
              style={{ width: '100%', minHeight: 120, marginTop: 12, padding: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, color: 'inherit' }}
            />
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}>Cancel</button>
              <button className="button" onClick={() => { navigator.clipboard.writeText(messageText) }}>Copy Text</button>
              <button className="button" onClick={openWhatsApp}>Open WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
