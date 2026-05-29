'use client'
import { useState, useEffect, use } from 'react'

export default function OrderTrackingPage({ params }) {
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