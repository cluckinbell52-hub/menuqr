'use client'
import { useState, useEffect, use } from 'react'

export default function OrderTrackingPage({ params }) {
  const [vendor, setVendor] = useState(null)
  const { orderId } = use(params)
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetchOrder()
    const interval = setInterval(fetchOrder, 5000)
    return () => clearInterval(interval)
  }, [])

async function fetchOrder() {
    const res = await fetch(`/api/orders/${orderId}`)
    const data = await res.json()
    setOrder(data)
    if (data.vendorId) {
      const vRes = await fetch(`/api/vendors/${data.vendorId}/menu`)
      const vData = await vRes.json()
      setVendor(vData.vendor)
    }
  }

  const [showFeedbackInput, setShowFeedbackInput] = useState(false)
  const [feedbackComment, setFeedbackComment] = useState('')

  async function submitFeedback(rating) {
    if (rating === -1 && !showFeedbackInput) {
      setShowFeedbackInput(true)
      return
    }
    await fetch(`/api/orders/${orderId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment: feedbackComment }),
    })
    fetchOrder()
  }
function downloadReceipt() {
    const receiptWindow = window.open('', '_blank')
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Token #${order.tokenNumber}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'DM Sans', sans-serif; background: #faf7f2; min-height: 100vh; padding: 20px; }
          .card { background: white; border-radius: 20px; overflow: hidden; max-width: 380px; margin: 0 auto; border: 1px solid #f0ece4; }
          .header { background: #ff6b35; padding: 24px 20px; text-align: center; }
          .header .label { font-size: 11px; color: rgba(255,255,255,0.7); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
          .header .name { font-size: 22px; font-weight: 600; color: white; margin-bottom: 2px; }
          .header .cuisine { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 14px; }
          .token { display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 18px; border-radius: 20px; color: white; font-size: 14px; font-weight: 500; }
          .body { padding: 20px; }
          .meta { background: #faf7f2; border-radius: 12px; padding: 14px; margin-bottom: 16px; }
          .meta-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .meta-row:not(:last-child) { border-bottom: 1px solid #f0ece4; }
          .meta-label { font-size: 13px; color: #9ca3af; }
          .meta-value { font-size: 13px; font-weight: 500; color: #111827; }
          .section-title { font-size: 11px; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
          .item-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #faf7f2; }
          .item-left { display: flex; align-items: center; gap: 8px; }
          .item-qty { background: #ff6b35; color: white; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 12px; }
          .item-name { font-size: 14px; color: #111827; }
          .item-price { font-size: 14px; font-weight: 500; color: #111827; }
          .total-row { display: flex; justify-content: space-between; align-items: center; background: #faf7f2; border-radius: 12px; padding: 14px; margin-top: 14px; }
          .total-label { font-size: 17px; font-weight: 500; color: #111827; }
          .total-value { font-size: 20px; font-weight: 600; color: #ff6b35; }
          .footer { text-align: center; margin-top: 16px; padding-top: 14px; border-top: 1px solid #f0ece4; }
          .footer p { font-size: 12px; color: #9ca3af; margin-bottom: 3px; }
          .footer .brand { font-size: 12px; color: #ff6b35; font-weight: 500; }
          .print-btn { display: block; width: 100%; margin-top: 16px; background: #ff6b35; color: white; border: none; border-radius: 12px; padding: 13px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <p class="label">food truck</p>
            <p class="name">${vendor?.name || 'Food Truck'}</p>
            <p class="cuisine">${vendor?.cuisine || ''}</p>
            <div class="token">Token #${order.tokenNumber}</div>
          </div>
          <div class="body">
            <div class="meta">
              <div class="meta-row">
                <span class="meta-label">Customer</span>
                <span class="meta-value">${order.customerName}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Date</span>
                <span class="meta-value">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Time</span>
                <span class="meta-value">${new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <p class="section-title">Order summary</p>
            ${order.items.map(item => `
              <div class="item-row">
                <div class="item-left">
                  <span class="item-qty">x${item.qty}</span>
                  <span class="item-name">${item.name}</span>
                </div>
                <span class="item-price">₹${item.price * item.qty}</span>
              </div>
            `).join('')}
            <div class="total-row">
              <span class="total-label">Total</span>
              <span class="total-value">₹${order.total}</span>
            </div>
            <div class="footer">
              <p>Thank you for ordering!</p>
              <p class="brand">Powered by MenuQR</p>
            </div>
            <button class="print-btn" onclick="window.print()">Save as PDF</button>
          </div>
        </div>
      </body>
      </html>
    `)
  }
  if (!order) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="w-10 h-10 rounded-full border-2 border-orange-400 border-t-transparent animate-spin"></div>
    </div>
  )

  const steps = ['pending', 'preparing', 'ready', 'collected']
  const currentStep = steps.indexOf(order.status)
  const labels = ['Order Placed', 'Preparing', 'Ready', 'Picked Up']
  const emojis = ['🧾', '🍳', '✅', '🎉']

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-100">
        <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Order Tracking</p>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-gray-900 text-xl font-bold">Hey, {order.customerName}!</h1>
        <div className="mt-2 inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>Token #{order.tokenNumber}</div>
      </div>

      <div className="max-w-md mx-auto px-6 py-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>

        {/* Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">{emojis[currentStep]}</span>
            <p className="text-gray-900 font-bold text-lg">{
              currentStep === 0 ? 'Order received!' :
              currentStep === 1 ? 'Your food is being prepared' :
              currentStep === 2 ? 'Your order is ready!' :
              'Order complete'
            }</p>
            <p className="text-gray-400 text-sm mt-1">{
              currentStep === 0 ? 'Waiting for the kitchen...' :
              currentStep === 1 ? 'Almost there...' :
              currentStep === 2 ? 'Head to the truck to pick up' :
              'Thanks for ordering!'
            }</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between relative px-2">
            {/* Line behind dots */}
            <div className="absolute top-4 left-8 right-8 h-[2px] bg-gray-100"></div>
            <div className="absolute top-4 left-8 h-[2px] transition-all duration-500" style={{
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              width: `${(currentStep / (steps.length - 1)) * (100 - 16)}%`
            }}></div>

            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all duration-300 ${
                  i < currentStep ? 'text-white' :
                  i === currentStep ? 'text-white shadow-lg shadow-orange-500/30 scale-110' :
                  'bg-gray-100 text-gray-300'
                }`} style={i <= currentStep ? { background: 'linear-gradient(135deg, #ff6b35, #f7931e)' } : {}}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <p className={`text-[10px] font-medium ${i <= currentStep ? 'text-orange-500' : 'text-gray-300'}`}>{labels[i]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h3 className="text-gray-900 font-bold text-sm mb-3">Order Summary</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">{item.name} <span className="text-gray-300">x{item.qty}</span></span>
              <span className="text-gray-900 font-medium">₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="border-t border-gray-50 mt-3 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold" style={{ color: '#ff6b35' }}>₹{order.total}</span>
          </div>
        </div>
        <button
          onClick={downloadReceipt}
          className="w-full mt-3 bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          <span className="text-gray-900 font-semibold text-sm">🧾 Download Receipt</span>
        </button>

        {/* Auto refresh indicator */}
        {currentStep < 3 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <p className="text-gray-400 text-xs">Live — updates every 5 seconds</p>
          </div>
        )}

        {/* Ready pickup notice */}
        {order.status === 'ready' && (
          <div className="rounded-2xl p-5 text-center mb-6" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}>
            <p className="text-green-700 font-bold text-lg mb-1">🎉 Your order is ready!</p>
            <p className="text-green-600 text-sm">Show this screen at the truck</p>
          </div>
        )}

        {/* Feedback */}
{order.status === 'collected' && !order.rating && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <p className="text-gray-900 font-bold mb-1">How was your food?</p>
            <p className="text-gray-400 text-xs mb-4">Your feedback helps the truck improve</p>
            {!showFeedbackInput ? (
              <div className="flex justify-center gap-6">
                <button onClick={() => submitFeedback(1)} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                  <span className="text-5xl">👍</span>
                  <span className="text-gray-400 text-xs">Loved it</span>
                </button>
                <button onClick={() => submitFeedback(-1)} className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
                  <span className="text-5xl">👎</span>
                  <span className="text-gray-400 text-xs">Not great</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  className="w-full bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300 text-sm"
                  placeholder="What could be better?"
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => submitFeedback(-1)}
                  className="w-full text-white font-bold py-3 rounded-xl text-sm"
                  style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        )}

        {order.status === 'collected' && order.rating && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center mb-6">
            <p className="text-gray-900 font-bold mb-2">Thanks for your feedback!</p>
            <a href={`/t/${order.vendorId}`} className="text-orange-500 font-medium text-sm underline underline-offset-4">Order again →</a>
          </div>
        )}

      </div>
    </div>
  )
}