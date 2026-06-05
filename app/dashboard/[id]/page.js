'use client'
import { useState, useEffect, use } from 'react'
import QRCode from 'react-qr-code'

export default function DashboardPage({ params }) {
  const { id } = use(params)
  const [vendor, setVendor] = useState(null)
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '' })
  const [tab, setTab] = useState('menu')

  useEffect(() => {
    fetchMenu()
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMenu() {
    const res = await fetch(`/api/vendors/${id}/menu`)
    const data = await res.json()
    setVendor(data.vendor)
    setItems(data.items)
  }

  async function fetchOrders() {
    const res = await fetch(`/api/vendors/${id}/orders`)
    const data = await res.json()
    setOrders(data)
  }

  async function addItem(e) {
    e.preventDefault()
    await fetch(`/api/vendors/${id}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    })
    setForm({ name: '', price: '', category: '', description: '' })
    fetchMenu()
  }

  if (!vendor) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  const activeOrders = orders.filter(o => o.status !== 'collected')
  const pastOrders = orders.filter(o => o.status === 'collected')

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-gray-900 text-xl font-bold">{vendor.name}</h1>
            <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-sm">{vendor.cuisine}</p>
          </div>
          <div className="flex gap-2">
         <a href={`/kitchen/${id}`} className="text-green-600 text-sm font-medium px-4 py-2 bg-green-50 rounded-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>👨‍🍳 Kitchen</a>
         <a href={`/dashboard/${id}/revenue`} className="text-orange-500 text-sm font-medium px-4 py-2 bg-orange-50 rounded-xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>📊 Revenue</a>
        </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6">
        <div className="max-w-3xl mx-auto flex gap-1">
          {['menu', 'orders', 'qr'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-400'
              }`}
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              {t === 'qr' ? 'QR Code' : t === 'orders' ? `Orders (${activeOrders.length})` : 'Menu'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* MENU TAB */}
        {tab === 'menu' && (
          <>
            <form onSubmit={addItem} className="bg-white p-6 rounded-2xl border border-gray-100 mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              <h2 className="text-gray-900 font-bold mb-4">Add Menu Item</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className="bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300 col-span-2" placeholder="Item Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300" placeholder="Price (₹)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <input className="bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              </div>
              <input className="w-full bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300 mb-3" placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <button type="submit" className="w-full text-white font-bold py-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>Add Item</button>
            </form>

            <div className="space-y-3">
              {items.map(item => (
                <div key={item._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className={`font-medium ${item.isAvailable ? 'text-gray-900' : 'text-gray-400 line-through'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.name}</p>
                    <p className="text-gray-400 text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-orange-500 font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>₹{item.price}</p>
                    <button
                      onClick={async () => {
                        await fetch(`/api/menu/${item._id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isAvailable: !item.isAvailable }),
                        })
                        fetchMenu()
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${item.isAvailable ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </button>
                    <button
                      onClick={async () => {
                        await fetch(`/api/menu/${item._id}`, { method: 'DELETE' })
                        fetchMenu()
                      }}
                      className="text-gray-300 hover:text-red-400 text-xs transition-colors"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-gray-400 text-sm text-center py-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>No items yet. Add your first menu item above.</p>}
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <>
            {activeOrders.length > 0 && (
              <div className="mb-6">
                <h2 className="text-gray-900 font-bold mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>Active Orders</h2>
                <div className="space-y-3">
                  {activeOrders.map(order => (
                    <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-100" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-900 font-semibold">#{order.tokenNumber} — {order.customerName}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          order.status === 'pending' ? 'bg-yellow-500' :
                          order.status === 'preparing' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>{order.status}</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{order.customerPhone}</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-gray-600 text-sm">{item.name} x{item.qty} — ₹{item.price * item.qty}</p>
                      ))}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                        <p className="text-orange-500 font-bold">₹{order.total}</p>
                        <button
                          onClick={async () => {
                            const next = order.status === 'pending' ? 'preparing' : order.status === 'preparing' ? 'ready' : 'collected'
                            await fetch(`/api/orders/${order._id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: next }),
                            })
                            fetchOrders()
                          }}
                          className="text-white px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
                        >
                          {order.status === 'pending' ? 'Start Preparing' : order.status === 'preparing' ? 'Mark Ready' : 'Mark Collected'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-gray-900 font-bold mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>Past Orders</h2>
                <div className="space-y-3">
                  {pastOrders.map(order => (
                    <div key={order._id} className="bg-white p-4 rounded-2xl border border-gray-100 opacity-60" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-gray-900 font-medium">#{order.tokenNumber} — {order.customerName}</p>
                        <span className="text-gray-400 text-xs">Collected</span>
                      </div>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-gray-500 text-sm">{item.name} x{item.qty}</p>
                      ))}
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-orange-500 font-semibold text-sm">₹{order.total}</p>
                        {order.rating && (
                          <span className="text-sm">{order.rating === 1 ? '👍' : '👎'} {order.comment && <span className="text-gray-400 text-xs">{order.comment}</span>}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {orders.length === 0 && <p className="text-gray-400 text-sm text-center py-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>No orders yet.</p>}
          </>
        )}

        {/* QR TAB */}
        {tab === 'qr' && (
          <div className="flex flex-col items-center py-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-4 qr-container">
              <QRCode value={typeof window !== 'undefined' ? `${window.location.origin}/t/${id}` : ''} size={220} />
            </div>
            <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Customers scan this to see your menu</p>
            <button
              onClick={() => {
                const svg = document.querySelector('.qr-container svg')
                const svgData = new XMLSerializer().serializeToString(svg)
                const canvas = document.createElement('canvas')
                canvas.width = 250
                canvas.height = 250
                const ctx = canvas.getContext('2d')
                const img = new Image()
                img.onload = () => {
                  ctx.fillStyle = 'white'
                  ctx.fillRect(0, 0, 250, 250)
                  ctx.drawImage(img, 25, 25, 200, 200)
                  const link = document.createElement('a')
                  link.download = 'qr-code.png'
                  link.href = canvas.toDataURL()
                  link.click()
                }
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
              }}
              className="text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20"
              style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
            >
              ⬇ Download QR Code
            </button>
          </div>
        )}

      </div>
    </div>
  )
}