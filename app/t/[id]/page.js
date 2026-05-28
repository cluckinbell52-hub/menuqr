'use client'
import { useState, useEffect, use } from 'react'

export default function TruckPage({ params }) {
  const { id } = use(params)
  const [vendor, setVendor] = useState(null)
  const [items, setItems] = useState([])
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    fetch(`/api/vendors/${id}/menu`)
      .then(res => res.json())
      .then(data => {
        setVendor(data.vendor)
        setItems(data.items)
      })
  }, [id])

  function addToCart(item) {
    const exists = cart.find(c => c._id === item._id)
    if (exists) {
      setCart(cart.map(c => c._id === item._id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
  }

  function updateQty(itemId, delta) {
    setCart(cart.map(c => {
      if (c._id === itemId) {
        const newQty = c.qty + delta
        return newQty <= 0 ? null : { ...c, qty: newQty }
      }
      return c
    }).filter(Boolean))
  }

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0)
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))]

  const [showNameInput, setShowNameInput] = useState(false)
  const [customerName, setCustomerName] = useState('')

  async function placeOrder() {
    if (!customerName) {
      setShowNameInput(true)
      return
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorId: id,
        customerName: customerName,
        items: cart.map(c => ({ name: c.name, price: c.price, qty: c.qty })),
        total,
      }),
    })
    const data = await res.json()
    window.location.href = `/order/${data._id}`
  }

  if (!vendor) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-orange-400 border-t-transparent animate-spin"></div>
        <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-sm">Loading menu...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf7f2] pb-28">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="relative px-6 pt-8 pb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🚚</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-white/40 text-xs font-medium tracking-widest uppercase">Food Truck</span>
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-white text-4xl font-black leading-tight mb-2">{vendor.name}</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-white/50 text-sm">{vendor.cuisine}</p>
        </div>
        <div className="h-5 bg-[#faf7f2] rounded-t-[24px]"></div>
      </div>

      {/* Menu */}
      <div className="px-5 -mt-1">
        {categories.length > 0 ? (
          categories.map(cat => (
            <div key={cat} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px]" style={{ background: 'linear-gradient(to right, #ff6b35, transparent)' }}></div>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-gray-900 text-lg font-bold">{cat}</h2>
              </div>
              <div className="space-y-3">
                {items.filter(i => i.category === cat && i.isAvailable).map(item => {
                  const inCart = cart.find(c => c._id === item._id)
                  return (
                    <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex justify-between items-center gap-4 shadow-sm">
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-900 font-semibold text-[15px]">{item.name}</p>
                        {item.description && <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>}
                        <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-orange-500 font-bold text-sm mt-1.5">₹{item.price}</p>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item._id, -1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">−</button>
                          <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-900 font-bold text-sm w-5 text-center">{inCart.qty}</span>
                          <button onClick={() => updateQty(item._id, 1)} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-5 py-2 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition-colors"
                          style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-3 mt-4">
            {items.filter(i => i.isAvailable).map(item => {
              const inCart = cart.find(c => c._id === item._id)
              return (
                <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 flex justify-between items-center gap-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-900 font-semibold text-[15px]">{item.name}</p>
                    {item.description && <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-xs mt-0.5 truncate">{item.description}</p>}
                    <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-orange-500 font-bold text-sm mt-1.5">₹{item.price}</p>
                  </div>
                  {inCart ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item._id, -1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">−</button>
                      <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-900 font-bold text-sm w-5 text-center">{inCart.qty}</span>
                      <button onClick={() => updateQty(item._id, 1)} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="px-5 py-2 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition-colors"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Add
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {items.filter(i => !i.isAvailable).length > 0 && (
          <div className="mt-6 mb-4">
            <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-3">Sold Out</p>
            {items.filter(i => !i.isAvailable).map(item => (
              <div key={item._id} className="bg-white/50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center mb-2 opacity-50">
                <div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 font-medium text-sm line-through">{item.name}</p>
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-300 text-xs font-medium">Sold out</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Bar */}
      {cart.length > 0 && !showCart && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
          <button
            onClick={() => setShowCart(true)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-white font-semibold shadow-xl"
            style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">{cartCount}</span>
              <span>View Cart</span>
            </div>
            <span className="font-bold">₹{total}</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-50">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="flex justify-between items-center">
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-bold text-gray-900">Your Order</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-300 text-2xl leading-none hover:text-gray-500">&times;</button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              {cart.map(c => (
                <div key={c._id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-[15px]">{c.name}</p>
                    <p className="text-gray-400 text-xs">₹{c.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(c._id, -1)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">−</button>
                    <span className="text-gray-900 font-bold w-5 text-center text-sm">{c.qty}</span>
                    <button onClick={() => updateQty(c._id, 1)} className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>+</button>
                  </div>
                  <p className="text-gray-900 font-semibold w-16 text-right text-sm">₹{c.price * c.qty}</p>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-bold text-gray-900">Total</span>
                <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-bold text-gray-900">₹{total}</span>
              </div>
              {showNameInput && (
                <input
                  className="w-full bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300 text-sm mb-3"
                  placeholder="Your name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  autoFocus
                />
              )}
              <button
                onClick={placeOrder}
                className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg shadow-orange-500/20"
                style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
              >
                {showNameInput ? 'Confirm Order' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}