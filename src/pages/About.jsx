import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import '../styles/about.scss'

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function About() {
  const promises = [
    { icon: '🚚', title: 'Fast & Free Delivery', desc: 'Free nationwide delivery on qualifying orders — no surprises, no delays.' },
    { icon: '🎨', title: 'Custom Design Support', desc: 'Work directly with our in-house design team to polish your vision — for free.' },
    { icon: '🧵', title: 'Precision Production', desc: 'Every product is pressed, stitched, and finished in-house for consistent quality.' },
    { icon: '💡', title: 'Quality That Shows', desc: 'Each order goes through multiple checkpoints — color accuracy, material feel, and print alignment.' },
    { icon: '🖨️', title: 'Pro Printer Tech', desc: 'High-resolution sublimation using industrial-grade Epson and Sawgrass systems.' },
    { icon: '👥', title: 'People Behind the Print', desc: 'Designers, printers, and makers — all under one roof, all passionate about your brand.' }
  ]

  return (
    <motion.section className="about-page gb-container" variants={fade} initial="initial" animate="animate">
      <div className="about-inner">
        <header className="about-hero">
          <h1>Our Promise: Crafted for Creators</h1>
          <p className="about-intro">At Grizzlies, sublimation isn’t just printing — it’s how we bring creativity to life. We built our process around one mission: make it easy for anyone to turn ideas into premium-quality gear, fast.</p>
        </header>

        <section className="promises-grid">
          {promises.map((p, i) => (
            <motion.article key={p.title} className="promise-card" whileHover={{ translateY: -6 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="promise-icon" aria-hidden>{p.icon}</div>
              <h3 className="promise-title">{p.title}</h3>
              <p className="promise-desc">{p.desc}</p>
            </motion.article>
          ))}
        </section>

        <section className="about-outro">
          <p>We don’t just print designs — we help brands, teams, and dreamers build something real. Welcome to the home of bold ideas and even bolder prints.</p>
          <div className="about-cta">
            <Link to="/products" className="button primary">Shop Collections</Link>
            <Link to="/sublimation" className="button secondary">Start a Project</Link>
          </div>
        </section>

        <footer className="about-ultra-note">
          <h4>Make it Ultra ✨</h4>
          <ul>
            <li>Use animated icons (Lottie/SVG motion) for richer micro-interactions</li>
            <li>Add soft gradient borders or glass cards for depth</li>
            <li>Consider a masonry or diagonal grid to give the page energy</li>
          </ul>
        </footer>
      </div>
    </motion.section>
  )
}
