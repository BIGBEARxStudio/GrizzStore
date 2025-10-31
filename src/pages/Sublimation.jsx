import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import useCart from '../hooks/useCart'

const CATEGORIES = {
  Bottoms: { icon: "👖" },
  Dresses: { icon: "👗" },
  Hoodies: { icon: "🧥" },
  Jackets: { icon: "🧥" },
  Kits: { icon: "⚽" },
  Tops: { icon: "👕" }
}

export default function Sublimation() {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [details, setDetails] = useState({ quality: 'Standard' })
  const [message, setMessage] = useState('')
  const { add } = useCart()

  const handleAddToCart = () => {
    if (!selectedCategory) {
      setMessage('Please select a category')
      return
    }

    const item = {
      name: `${selectedCategory} Sublimation`,
      quantity,
      price: 350, // Base price per item
      category: 'sublimation',
      details: {
        quality: details.quality,
        category: selectedCategory
      }
    }

    add(item, quantity, { details: item.details })
    setMessage(`${quantity}x ${selectedCategory} added to cart. We'll discuss specifics via WhatsApp after checkout.`)
    setSelectedCategory('')
    setQuantity(1)
  }

  function onSelect(p) {
    // toggle selection
    if (selected && selected.id === p.id) return setSelected(null)
    setSelected(p)
    setMessage('')
  }

  function onAdd() {
    if (!selected) {
      setMessage('Please select a packet to continue')
      return
    }
    const item = { ...selected, name: selected.name + ' (Sublimation)', quality: details.quality }
    add(item, details.quantity, { details })
    // keep selection so user can quickly add multiples; show friendly inline message
    setMessage(`${details.quantity} × ${selected.name} added to cart — after checkout, please send your design files via WhatsApp.`)
    // reset quantity to 1
    setDetails({ quality: 'Standard', quantity: 1 })
    setSelected(null)
  }

  return (
    <div className="sublimation-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
      >
        <h2>Sublimation Orders</h2>
        <p>Choose a category and quantity below. We'll discuss design specifics via WhatsApp after your order.</p>
      </motion.div>

      <motion.div
        className="sublimation-simple"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="sublimation-card">
          <div className="category-selection">
            <label>Select Category</label>
            <div className="category-buttons">
              {Object.entries(CATEGORIES).map(([name, { icon }]) => (
                <button
                  key={name}
                  className={`category-btn ${selectedCategory === name ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(name)}
                >
                  <span className="category-icon">{icon}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-section">
            <label>Quantity</label>
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >-</button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="qty-input"
              />
              <button
                className="qty-btn"
                onClick={() => setQuantity(prev => prev + 1)}
              >+</button>
            </div>
          </div>

          <div className="quality-selection">
            <label>Print Quality</label>
            <select
              value={details.quality}
              onChange={e => setDetails({ ...details, quality: e.target.value })}
            >
              <option>Standard</option>
              <option>Premium</option>
              <option>High</option>
            </select>
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Price per Item:</span>
              <span>R 350</span>
            </div>
            <div className="total-row">
              <span>Total:</span>
              <span>R {(350 * quantity).toFixed(2)}</span>
            </div>
          </div>

          <div className="card-actions">
            <button
              className="button"
              onClick={handleAddToCart}
              disabled={!selectedCategory}
            >
              Add to Cart
            </button>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="message"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="whatsapp-preview">
            <label>Message Preview</label>
            <textarea
              readOnly
              value={selectedCategory ?
                `Hi Grizzlies! I would like to place a sublimation order:\n\n${quantity}x ${selectedCategory}\nQuality: ${details.quality}\nTotal: R${(350 * quantity).toFixed(2)}\n\nI'd like to discuss the design specifics via WhatsApp.`
                : 'Select a category to see message preview'}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
