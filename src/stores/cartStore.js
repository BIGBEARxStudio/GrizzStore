// simple singleton cart store with subscriptions
const STORAGE_KEY = 'bb_cart'

let items = (() => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch (e) { return [] }
})()

let lastAction = { items: null, type: null, data: null }
const subscribers = new Set()

function persist(next) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch (e) { /* ignore */ }
  try { window.dispatchEvent(new CustomEvent('gb:cart-changed', { detail: { items: next } })) } catch (e) { }
}

function notify() {
  subscribers.forEach(fn => {
    try { fn(items) } catch (e) { console.warn('cart subscriber failed', e) }
  })
}

function setItems(next) {
  items = next
  persist(next)
  notify()
}

function subscribe(fn) {
  subscribers.add(fn)
  // call immediately
  try { fn(items) } catch (e) { }
  return () => subscribers.delete(fn)
}

function getItems() { return items }

function getTotal() {
  return items.reduce((s, i) => s + Number(i.price || 0) * (i.qty || 1), 0)
}

function add(product, qty = 1, extras = {}) {
  lastAction = { items: [...items], type: 'add', data: { product, qty, extras } }
  const idx = items.findIndex(p => p.id === product.id && JSON.stringify(p.extras) === JSON.stringify(extras))
  let next
  if (idx > -1) {
    const copy = [...items]; copy[idx].qty += qty; next = copy
  } else {
    next = [...items, { ...product, qty, extras }]
  }
  setItems(next)
  try {
    const count = next.reduce((s, i) => s + (i.qty || 0), 0)
    const total = getTotal()
    window.dispatchEvent(new CustomEvent('gb:cart-added', { detail: { item: product, qty, count, total, canUndo: true } }))
  } catch (e) { }
}

function remove(id) {
  lastAction = { items: [...items], type: 'remove', data: { id } }
  const next = items.filter(i => i.id !== id)
  setItems(next)
}

function clear() {
  lastAction = { items: [...items], type: 'clear', data: null }
  setItems([])
}

function attachFile(url) {
  if (items.length === 0) return
  const copy = [...items]
  const last = copy[copy.length - 1]
  last.extras = last.extras || {}
  last.extras.files = last.extras.files || []
  last.extras.files.push(url)
  setItems(copy)
}

function undo() {
  if (lastAction.items) {
    setItems(lastAction.items)
    lastAction = { items: null, type: null, data: null }
    return true
  }
  return false
}

export default {
  subscribe,
  getItems,
  getTotal,
  add,
  remove,
  clear,
  attachFile,
  undo,
}
