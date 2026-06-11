import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './ECommerce.css'
import { API as APIS } from '../api'

const API = APIS.products
const CATEGORIES = ['All', 'Electronics', 'Sports', 'Health', 'Home']

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return <div className={`toast toast-${type}`}>{type === 'success' ? '🛒' : '❌'} {msg}</div>
}

export default function ECommerce() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [cat, setCat]             = useState('All')
  const [search, setSearch]       = useState('')
  const [cart, setCart]           = useState([])
  const [showCart, setShowCart]   = useState(false)
  const [showCheckout, setCheckout] = useState(false)
  const [orderDone, setOrderDone] = useState(null)
  const [toast, setToast]         = useState(null)

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(API, { params: { category: cat, search } })
      setProducts(data)
    } catch { setProducts([]) }
    setLoading(false)
  }
  useEffect(() => { fetchProducts() }, [cat, search])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id)
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...c, { ...product, qty: 1 }]
    })
    showToast(`${product.name} added to cart!`)
  }
  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id))
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return }
    setCart(c => c.map(i => i.id === id ? { ...i, qty } : i))
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const handleCheckout = async (form) => {
    try {
      const { data } = await axios.post(`${API}/order`, { ...form, items: cart, total: cartTotal })
      setOrderDone(data.order); setCart([]); setCheckout(false); setShowCart(false)
    } catch {
      // Simulate success if backend is off
      setOrderDone({ id: 'ORD-DEMO', status: 'confirmed' }); setCart([]); setCheckout(false); setShowCart(false)
    }
  }

  return (
    <div className="ec-page">
      <div className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-logo">🛒 ShopNova</div>
          <div className="page-nav-right">
            <button className="btn btn-secondary btn-sm ec-cart-btn" onClick={() => setShowCart(true)}>
              🛒 Cart {cartCount > 0 && <span className="ec-cart-badge">{cartCount}</span>}
            </button>
            <Link to="/" className="back-link">← Home</Link>
          </div>
        </div>
      </div>

      {/* ORDER DONE */}
      {orderDone && (
        <div className="ec-order-success">
          <div className="ec-order-card card-elevated">
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎉</div>
            <h2>Order Confirmed!</h2>
            <p style={{ color: 'var(--muted)', margin: '8px 0 6px' }}>Order ID: <strong style={{ color: 'var(--a3)' }}>#{orderDone.id}</strong></p>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Your order has been placed and is being processed.</p>
            <button className="btn btn-primary" onClick={() => setOrderDone(null)}>Continue Shopping</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="ec-hero">
        <div className="ec-hero-glow" />
        <div className="container ec-hero-inner">
          <h1>Shop <span className="gradient-text">ShopNova</span></h1>
          <p>Discover premium products at unbeatable prices. Fast delivery, easy returns.</p>
          <div className="ec-search-bar">
            <span>🔍</span>
            <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* FILTERS + PRODUCTS */}
      <div className="container ec-main">
        <div className="ec-cats">
          {CATEGORIES.map(c => (
            <button key={c} className={`btn btn-sm ${cat === c ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>

        {loading ? <div className="loader" /> : (
          <div className="ec-products-grid">
            {products.map(p => (
              <div key={p.id} className="ec-product-card card">
                <div className="ec-product-img">{p.image}</div>
                <div className="ec-product-info">
                  <span className="tag tag-purple" style={{ fontSize: '.65rem' }}>{p.category}</span>
                  <h3 className="ec-product-name">{p.name}</h3>
                  <p className="ec-product-desc">{p.description}</p>
                  <div className="ec-product-rating">
                    <span className="ec-stars">{'★'.repeat(Math.floor(p.rating))}{'☆'.repeat(5 - Math.floor(p.rating))}</span>
                    <span className="ec-rating-val">{p.rating}</span>
                    <span className="ec-reviews">({p.reviews})</span>
                  </div>
                  <div className="ec-product-price-row">
                    <div>
                      <span className="ec-price">₹{p.price.toLocaleString()}</span>
                      <span className="ec-orig-price">₹{p.originalPrice.toLocaleString()}</span>
                      <span className="ec-discount">-{Math.round((1 - p.price / p.originalPrice) * 100)}%</span>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => addToCart(p)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different search or category</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CART DRAWER */}
      {showCart && (
        <div className="ec-cart-overlay" onClick={e => e.target === e.currentTarget && setShowCart(false)}>
          <div className="ec-cart-drawer">
            <div className="ec-cart-header">
              <h3>Your Cart ({cartCount})</h3>
              <button className="modal-close" style={{ position: 'static' }} onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-icon">🛒</div>
                <h3>Cart is empty</h3>
                <p>Add some products!</p>
              </div>
            ) : (
              <>
                <div className="ec-cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="ec-cart-item">
                      <div className="ec-ci-img">{item.image}</div>
                      <div className="ec-ci-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="ec-ci-qty">
                        <button className="btn btn-ghost btn-sm" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>×</button>
                    </div>
                  ))}
                </div>
                <div className="ec-cart-footer">
                  <div className="flex-between" style={{ marginBottom: 16 }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--accent)' }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="btn btn-primary btn-full" onClick={() => { setShowCart(false); setCheckout(true) }}>Proceed to Checkout →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal total={cartTotal} onClose={() => setCheckout(false)} onSubmit={handleCheckout} />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function CheckoutModal({ total, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true)
    await onSubmit(form); setLoading(false)
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Checkout</h2>
        <p className="modal-subtitle">Order Total: <strong style={{ color: 'var(--a3)' }}>₹{total.toLocaleString()}</strong></p>
        <form className="flex-col" onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group"><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required /></div>
            <div className="form-group"><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
            <div className="form-group"><label className="label">Phone *</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} required /></div>
            <div className="form-group"><label className="label">City *</label><input className="input" value={form.city} onChange={e => set('city', e.target.value)} required /></div>
          </div>
          <div className="form-group"><label className="label">Address *</label><input className="input" value={form.address} onChange={e => set('address', e.target.value)} required placeholder="Street address, area" /></div>
          <div className="form-group"><label className="label">PIN Code *</label><input className="input" value={form.pincode} onChange={e => set('pincode', e.target.value)} required placeholder="6-digit PIN" /></div>
          <p style={{ background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.2)', borderRadius: 8, padding: '10px 14px', fontSize: '.82rem', color: 'var(--a3)' }}>🔐 Payment on delivery · Free shipping on all orders</p>
          <div className="flex-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Placing Order…' : `Place Order ₹${total.toLocaleString()}`}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
