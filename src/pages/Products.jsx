import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'
import MerchHero from '../components/MerchHero'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'merch')
        .eq('active', true)
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      if (mounted) setItems(data || [])
      setLoading(false)
    }
    load()
    return () => mounted = false
  }, [])

  const featuredItems = items.filter(item => item.featured)
  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.subcategory === filter)

  return (
    <div className="merch-page">
      <MerchHero products={featuredItems.length ? featuredItems : items.slice(0, 5)} />

      <motion.div
        className="merch-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="merch-header">
          <h2>Shop Merch</h2>
          <div className="filter-controls">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'clothing' ? 'active' : ''}`}
              onClick={() => setFilter('clothing')}
            >
              Clothing
            </button>
            <button
              className={`filter-btn ${filter === 'accessories' ? 'active' : ''}`}
              onClick={() => setFilter('accessories')}
            >
              Accessories
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Loading merch...
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="products-grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            {filteredItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
