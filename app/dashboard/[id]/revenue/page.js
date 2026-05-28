'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'

export default function RevenuePage({ params }) {
  const { id } = use(params)
  const [orders, setOrders] = useState([])
  const [period, setPeriod] = useState('today')

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    const res = await fetch(`/api/vendors/${id}/orders`)
    const data = await res.json()
    setOrders(data)
  }

  function filterOrders() {
    const now = new Date()
    return orders.filter(o => {
      const d = new Date(o.createdAt)
      if (period === 'today') return d.toDateString() === now.toDateString()
      if (period === 'week') return (now - d) < 7 * 24 * 60 * 60 * 1000
      if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      return true
    })
  }

  const filtered = filterOrders()
  const totalRevenue = filtered.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = filtered.length
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const positiveRatings = filtered.filter(o => o.rating === 1).length
  const negativeRatings = filtered.filter(o => o.rating === -1).length
  const totalRatings = positiveRatings + negativeRatings
  const satisfaction = totalRatings > 0 ? Math.round((positiveRatings / totalRatings) * 100) : 0

  const itemCounts = {}
  filtered.forEach(o => {
    o.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty
    })
  })
  const bestSellers = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <Link href={`/dashboard/${id}`} className="text-orange-500 text-sm font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>← Dashboard</Link>
            <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-gray-900 text-xl font-bold mt-1">Revenue</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>

        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {['today', 'week', 'month', 'all'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                period === p ? 'text-white shadow-md shadow-orange-500/20' : 'bg-white text-gray-400 border border-gray-100'
              }`}
              style={period === p ? { background: 'linear-gradient(135deg, #ff6b35, #f7931e)' } : {}}
            >
              {p === 'all' ? 'All Time' : p}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-xs mb-1">Revenue</p>
            <p className="text-2xl font-bold" style={{ color: '#ff6b35' }}>₹{totalRevenue}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-xs mb-1">Orders</p>
            <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-xs mb-1">Avg Order</p>
            <p className="text-2xl font-bold text-gray-900">₹{avgOrder}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-xs mb-1">Satisfaction</p>
            <p className="text-2xl font-bold text-gray-900">{totalRatings > 0 ? `${satisfaction}%` : '—'}</p>
            {totalRatings > 0 && <p className="text-gray-400 text-xs mt-0.5">👍 {positiveRatings} · 👎 {negativeRatings}</p>}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 mb-6">
          <h2 className="text-gray-900 font-bold mb-4">Best Sellers</h2>
          {bestSellers.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
          {bestSellers.map(([name, count], i) => (
            <div key={name} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-900 font-medium text-sm">{name}</span>
                  <span className="text-gray-400 text-xs">{count} sold</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(count / bestSellers[0][1]) * 100}%`, background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Feedback */}
        {filtered.some(o => o.rating) && (
          <div className="bg-white p-5 rounded-2xl border border-gray-100">
            <h2 className="text-gray-900 font-bold mb-4">Recent Feedback</h2>
            {filtered.filter(o => o.rating).slice(0, 5).map(order => (
              <div key={order._id} className="flex items-start gap-3 mb-3 last:mb-0">
                <span className="text-lg">{order.rating === 1 ? '👍' : '👎'}</span>
                <div>
                  <p className="text-gray-900 text-sm font-medium">{order.customerName}</p>
                  {order.comment && <p className="text-gray-400 text-xs">{order.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}