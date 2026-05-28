import { connectDB } from '@/lib/mongodb'
import { Vendor } from '@/lib/models'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const vendor = await Vendor.findOne({ email })
    if (!vendor) return Response.json({ error: 'No account with this email' }, { status: 400 })

    const valid = await bcrypt.compare(password, vendor.password)
    if (!valid) return Response.json({ error: 'Wrong password' }, { status: 400 })

    const token = createToken(vendor._id)
    return Response.json({ token, vendor: { _id: vendor._id, name: vendor.name, email: vendor.email, cuisine: vendor.cuisine } })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}