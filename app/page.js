import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚚</span>
          <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-black text-gray-900">MenuQR</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>Login</Link>
          <Link href="/register" className="text-white px-4 py-2 rounded-xl text-sm font-medium" style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>Built for Food Trucks</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl md:text-6xl font-black text-red-900 leading-tight mb-6">
            Your menu.<br />Their phone.<br /><span style={{ color: '#ff6b35' }}>Zero hassle.</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-500 text-lg mb-8 leading-relaxed">
            QR-powered ordering for food trucks. Customers scan, browse your menu, and order — no app download needed.
          </p>
          <Link href="/register" className="inline-block text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-shadow" style={{ fontFamily: 'DM Sans, sans-serif', background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
            Register your Truck — Free
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl font-black text-gray-900 text-center mb-12">Everything your truck needs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'QR Menu', desc: 'Customers scan and see your full menu instantly. No app needed.' },
              { icon: '🛒', title: 'Pre-Orders', desc: 'Skip the queue chaos. Orders come in, you cook, they pick up.' },
              { icon: '📊', title: 'Revenue Insights', desc: 'Track sales, best sellers, and peak hours. Know your numbers.' },
              { icon: '🔔', title: 'Order Tracking', desc: 'Customers see live status — pending, preparing, ready.' },
              { icon: '⚡', title: 'Sold-Out Toggle', desc: 'Ran out of something? One tap and it is off the menu.' },
              { icon: '⭐', title: 'Customer Feedback', desc: 'Quick thumbs up/down after pickup. Know what is working.' },
            ].map(f => (
              <div key={f.title} className="bg-[#faf7f2] rounded-2xl p-6">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-900 font-bold text-base mb-2">{f.title}</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 max-w-5xl mx-auto px-6">
        <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl font-black text-gray-900 text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Register your truck', desc: 'Sign up, add your menu items and prices.' },
            { step: '2', title: 'Print your QR', desc: 'Download your unique QR code and stick it on your truck.' },
            { step: '3', title: 'Start receiving orders', desc: 'Customers scan, order, and you get notified instantly.' },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>{s.step}</div>
              <h3 style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-900 font-bold mb-2">{s.title}</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8 text-center">
        <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-sm">© 2026 MenuQR. Built for food trucks with ❤️</p>
      </div>
    </div>
  )
}