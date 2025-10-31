import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'
import useCart from '../hooks/useCart'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        checkIfLiked(session.user.id)
      }
    })
    loadLikes()
  }, [])

  const loadLikes = async () => {
    const { data, error } = await supabase.rpc('get_product_likes', { product_id: product.id })
    if (!error) {
      setLikes(data || 0)
    }
  }

  const checkIfLiked = async (userId) => {
    const { data } = await supabase
      .from('product_likes')
      .select('id')
      .eq('product_id', product.id)
      .eq('user_id', userId)
      .single()
    setIsLiked(!!data)
  }

  const handleLike = async () => {
    if (!session) {
      // Redirect to login or show login modal
      window.location.href = '/auth'
      return
    }

    if (isLiked) {
      await supabase
        .from('product_likes')
        .delete()
        .eq('product_id', product.id)
        .eq('user_id', session.user.id)
      setLikes(prev => prev - 1)
    } else {
      await supabase
        .from('product_likes')
        .insert({ product_id: product.id, user_id: session.user.id })
      setLikes(prev => prev + 1)
    }
    setIsLiked(!isLiked)
  }

  return (
    <motion.div
      layout
      className="product"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
    >
      <div className="product-image">
        <img src={product.image_url || 'https://placehold.co/400x300'} alt={product.name} />
        <motion.button
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          whileTap={{ scale: 0.9 }}
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
        >
          <svg viewBox="0 0 24 24" fill={isLiked ? "var(--accent)" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span className="likes-count">{likes}</span>
        </motion.button>
      </div>

      <div className="product-info">
        <h3 className="name">{product.name}</h3>
        <p className="desc">{product.description}</p>
        <div className="product-actions">
          <div className="price">R {product.price}</div>
          <button
            className="add-button"
            onClick={() => add(product, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}
