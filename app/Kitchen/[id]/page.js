'use client'
import { useState, useEffect, use } from 'react'

export default function KitchenPage({ params }) {
  const { id } = use(params)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 4000)
    return () => clearInterval(interval)
  }, [])

  async function fetchOrders() {
    const res = await fetch(`/api/vendors/${id}/orders`)
    const data = await res.json()
    setOrders(data.filter(o => o.status !== 'collected'))
  }

  async function markReady(orderId, currentStatus) {
    const next = currentStatus === 'pending' ? 'preparing' : 'ready'
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    fetchOrders()
  }

  const pending = orders.filter(o => o.status === 'pending')
  const preparing = orders.filter(o => o.status === 'preparing')
  const ready = orders.filter(o => o.status === 'ready')

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-white text-2xl font-black">Kitchen Display</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-xs">Live</span>
        </div>
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-5xl mb-4">🍳</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-500 text-lg">No active orders</p>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-6">
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3">New Orders ({pending.length})</p>
          <div className="space-y-3">
            {pending.map(order => (
              <OrderCard key={order._id} order={order} onAction={markReady} actionLabel="Start Preparing" actionColor="#f7931e" />
            ))}
          </div>
        </div>
      )}

      {/* Preparing */}
      {preparing.length > 0 && (
        <div className="mb-6">
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-3">Preparing ({preparing.length})</p>
          <div className="space-y-3">
            {preparing.map(order => (
              <OrderCard key={order._id} order={order} onAction={markReady} actionLabel="Mark Ready ✓" actionColor="#22c55e" />
            ))}
          </div>
        </div>
      )}

      {/* Ready */}
      {ready.length > 0 && (
        <div className="mb-6">
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Ready for Pickup ({ready.length})</p>
          <div className="space-y-3 opacity-60">
            {ready.map(order => (
              <div key={order._id} className="bg-gray-900 rounded-2xl p-4 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-green-400 font-black text-2xl">#{order.tokenNumber}</p>
                  <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-green-400 text-sm font-semibold">Waiting for pickup</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, onAction, actionLabel, actionColor }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-white font-black text-4xl leading-none">#{order.tokenNumber}</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-sm mt-1">{order.customerName}</p>
        </div>
        <span style={{ fontFamily: 'DM Sans, sans-serif', background: actionColor }} className="text-white text-xs font-bold px-3 py-1 rounded-full capitalize">{order.status}</span>
      </div>
      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span style={{ fontFamily: 'DM Sans, sans-serif', background: actionColor }} className="text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center">{item.qty}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-white text-lg font-semibold">{item.name}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => onAction(order._id, order.status)}
        className="w-full py-3 rounded-xl text-white font-bold text-base"
        style={{ fontFamily: 'DM Sans, sans-serif', background: actionColor }}
      >
        {actionLabel}
      </button>
    </div>
  )
}