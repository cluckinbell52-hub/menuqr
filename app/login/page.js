'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
      setLoading(false)
      return
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('vendorId', data.vendor._id)
    router.push(`/dashboard/${data.vendor._id}`)
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <span className="text-2xl">🚚</span>
          <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-black text-gray-900">MenuQR</span>
        </Link>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-gray-900 text-2xl font-bold mb-1">Welcome back</h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-sm mb-6">Login to manage your truck</p>
          {error && <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <div>
              <label className="text-gray-600 text-xs font-medium mb-1 block">Email</label>
              <input className="w-full bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300 transition-colors" placeholder="you@email.com" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="text-gray-600 text-xs font-medium mb-1 block">Password</label>
              <input className="w-full bg-[#faf7f2] text-gray-900 rounded-xl p-3 outline-none border border-transparent focus:border-orange-300 transition-colors" placeholder="Enter your password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="w-full text-white font-bold py-3.5 rounded-xl mt-2 shadow-lg shadow-orange-500/20" style={{ background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif' }} className="text-gray-400 text-sm text-center mt-6">Don't have an account? <Link href="/register" className="text-orange-500 font-medium">Register</Link></p>
      </div>
    </div>
  )
}