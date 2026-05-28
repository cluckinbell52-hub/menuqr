import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models'

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const order = await Order.create(body)
    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}