import { useEffect, useState } from 'react'
import cartStore from '../stores/cartStore'

// Lightweight hook that subscribes to the singleton cart store
export default function useCart() {
  const [items, setItems] = useState(cartStore.getItems())

  useEffect(() => {
    const unsub = cartStore.subscribe(next => setItems(next))
    return unsub
  }, [])

  const total = cartStore.getTotal()

  return {
    items,
    add: cartStore.add,
    remove: cartStore.remove,
    clear: cartStore.clear,
    total,
    attachFile: cartStore.attachFile,
    undo: cartStore.undo,
  }
}
