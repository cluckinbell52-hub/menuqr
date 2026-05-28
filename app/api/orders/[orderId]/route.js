import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const { orderId } = await params
    const order = await Order.findById(orderId)
    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB()
    const { orderId } = await params
    const { status } = await req.json()
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}