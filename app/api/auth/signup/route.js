import { connectDB } from '@/lib/mongodb'
import { Vendor } from '@/lib/models'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const { name, email, password, cuisine } = await req.json()

    const exists = await Vendor.findOne({ email })
    if (exists) return Response.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const vendor = await Vendor.create({ name, email, password: hashed, cuisine })
    const token = createToken(vendor._id)

    return Response.json({ token, vendor: { _id: vendor._id, name: vendor.name, email: vendor.email, cuisine: vendor.cuisine } })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}