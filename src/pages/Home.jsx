import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/home.scss';

const animations = {
  fadeInUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } },
  fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8 } },
  scale: { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.6 } },
  stagger: { animate: { transition: { staggerChildren: 0.08 } } },
  slideInLeft: { initial: { x: -60, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function Home() {
  return (
    <div className="home home-exciting">
      {/* Big visual hero */}
      <section className="hero hero-exciting">
        <div className="hero-bg-gradient" aria-hidden="true" />
        <div className="hero-inner">
          <motion.div className="hero-left" initial="initial" whileInView="animate" viewport={{ once: true }} variants={animations.stagger}>
            <motion.div className="hero-badge" variants={animations.fadeIn} whileHover={{ scale: 1.04 }}>
              🔥 New Drop — Grizzlies Premium
            </motion.div>

            <motion.h1 variants={animations.slideInLeft} className="hero-title">
              Dominate the Game.
              <span className="hero-title-highlight"> Wear the Roar</span>
            </motion.h1>

            <motion.p className="hero-desc" variants={animations.fadeInUp}>
              Fresh streetwear drops, custom sublimation, and rapid WhatsApp checkout — built for fans who want to stand out.
            </motion.p>

            <motion.div className="hero-ctas" variants={animations.fadeInUp}>
              <Link to="/products" className="button primary glow large">Shop the Drop
                <motion.span className="button-icon" animate={{ x: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>→</motion.span>
              </Link>
              <Link to="/sublimation" className="button secondary large">Customise Now</Link>
            </motion.div>
          </motion.div>

          <motion.div className="hero-right" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {/* Featured product strip */}
            <div className="product-strip" role="list">
              {['T-Shirt', 'Hoodie', 'Kit', 'Cap'].map((label, i) => (
                <motion.div key={label} className="product-card" whileHover={{ scale: 1.03, y: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <div className="product-image" aria-hidden="true">
                    {label === 'T-Shirt' ? '👕' : label === 'Hoodie' ? '🧥' : label === 'Cap' ? '🧢' : '📦'}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{label} — Grizzlies</div>
                    <div className="product-price">₱{(20 + i * 10).toFixed(2)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick features */}
      <section className="quick-features">
        <div className="features-grid">
          <div className="feat">Fast Turnaround<span>24-48h</span></div>
          <div className="feat">Local Pickup<span>Available</span></div>
          <div className="feat">Secure Checkout<span>WhatsApp + Cards</span></div>
          <div className="feat">Premium Fabric<span>Guaranteed</span></div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-heading">Shop by Category</h2>
        <div className="categories-grid">
          <Link to="/products" className="category-card">
            <div className="cat-icon">👕</div>
            <div className="cat-title">T-Shirts</div>
          </Link>
          <Link to="/products" className="category-card">
            <div className="cat-icon">🧥</div>
            <div className="cat-title">Hoodies</div>
          </Link>
          <Link to="/sublimation" className="category-card">
            <div className="cat-icon">🏷️</div>
            <div className="cat-title">Custom Kits</div>
          </Link>
        </div>
      </section>

    </div>
  );
}
