import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '../api/supabaseClient'
import { formatCurrency } from '../utils/formatters'

const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="dashboard-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ '--highlight-color': color }}
  >
    <div className="dashboard-card-icon">
      <Icon />
    </div>
    <div className="dashboard-card-content">
      <h3>{title}</h3>
      <div className="dashboard-card-value">{value}</div>
    </div>
  </motion.div>
)

const ProductModal = ({ product, onClose, onSave, onUpload }) => {
  const [formData, setFormData] = useState({
    id: product.id || null,
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    category: product.category || 'merch',
    active: product.active ?? true,
    image_url: product.image_url || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    try {
      setLoading(true)
      const file = e.target.files[0]
      const url = await onUpload(file)
      setFormData(prev => ({ ...prev, image_url: url }))
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal product-modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="modal-header">
          <h2>{product.id ? 'Edit Product' : 'New Product'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="merch">Merch</option>
              <option value="sublimation">Sublimation</option>
              <option value="sublimation-packet">Sublimation Packet</option>
            </select>
          </div>

          <div className="form-group image-upload">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              Active (visible in store)
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="button ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Dashboard Icons
const Icons = {
  Products: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Revenue: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Orders: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Active: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function AdminPanel() {
  const [session, setSession] = useState(null)
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess))
    load()
    return () => listener?.subscription.unsubscribe()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function save(formData) {
    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price || 0),
        image_url: formData.image_url,
        category: formData.category,
        active: formData.active
      }

      if (formData.id) {
        await supabase.from('products').update(payload).eq('id', formData.id)
      } else {
        await supabase.from('products').insert(payload)
      }

      await load()
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id) {
    setLoading(true)
    try {
      await supabase.from('products').delete().eq('id', id)
      await load()
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: products.length,
    active: products.filter(p => p.active).length,
    revenue: products.reduce((sum, p) => sum + (p.price || 0), 0),
    categories: Object.entries(
      products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})
    )
  }

  const uploadImage = async (file) => {
    if (!file) return null
    const path = `products/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('designs').upload(path, file)
    if (error) throw error
    const { data: url } = supabase.storage.from('designs').getPublicUrl(data.path)
    return url.publicUrl
  }

  return (
    <div className="admin-dashboard">
      {!session ? (
        <motion.div
          className="auth-required"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Icons.Products />
          <h2>Admin Access Required</h2>
          <p>Please sign in to manage products and view dashboard</p>
          <button className="button" onClick={() => window.location.href = '/auth'}>
            Sign In
          </button>
        </motion.div>
      ) : (
        <>
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage your products and view insights</p>
            </div>
            <button className="button ghost" onClick={() => supabase.auth.signOut()}>
              Sign Out
            </button>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-stats">
            <DashboardCard
              title="Total Products"
              value={stats.total}
              icon={Icons.Products}
              color="#ffbe0b"
            />
            <DashboardCard
              title="Active Products"
              value={stats.active}
              icon={Icons.Active}
              color="#00c853"
            />
            <DashboardCard
              title="Total Revenue"
              value={formatCurrency(stats.revenue)}
              icon={Icons.Revenue}
              color="#2196f3"
            />
            <DashboardCard
              title="Categories"
              value={stats.categories.length}
              icon={Icons.Orders}
              color="#e91e63"
            />
          </div>

          {/* Products Section */}
          <div className="products-section">
            <div className="products-header">
              <h2>Products</h2>
              <div className="products-actions">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-filter"
                >
                  <option value="all">All Categories</option>
                  <option value="merch">Merch</option>
                  <option value="sublimation">Sublimation</option>
                  <option value="sublimation-packet">Sublimation Packet</option>
                </select>
                <button
                  className="button"
                  onClick={() => setEditingProduct({})}
                >
                  Add Product
                </button>
              </div>
            </div>

            <motion.div layout className="products-grid">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div
                    className="loading-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Loading products...
                  </motion.div>
                ) : filteredProducts.length === 0 ? (
                  <motion.div
                    className="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No products found
                  </motion.div>
                ) : (
                  filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      className="product-card"
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      {product.image_url && (
                        <div className="product-image">
                          <img src={product.image_url} alt={product.name} />
                        </div>
                      )}
                      <div className="product-content">
                        <h3>{product.name}</h3>
                        <div className="product-meta">
                          <span className="price">{formatCurrency(product.price)}</span>
                          <span className={`status ${product.active ? 'active' : 'inactive'}`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="product-description">{product.description}</p>
                        <div className="product-actions">
                          <button
                            className="button ghost"
                            onClick={() => setEditingProduct(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="button ghost danger"
                            onClick={() => setShowDeleteConfirm(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Edit Modal */}
          <AnimatePresence>
            {editingProduct && (
              <ProductModal
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSave={save}
                onUpload={uploadImage}
              />
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="modal delete-confirm-modal"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                >
                  <h3>Confirm Deletion</h3>
                  <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button
                      className="button ghost"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="button danger"
                      onClick={() => deleteProduct(showDeleteConfirm)}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
