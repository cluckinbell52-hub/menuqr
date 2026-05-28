import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models'

export async function POST(req, { params }) {
  try {
    await connectDB()
    const { orderId } = await params
    const { rating, comment } = await req.json()
    const order = await Order.findByIdAndUpdate(orderId, { rating, comment }, { new: true })
    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}