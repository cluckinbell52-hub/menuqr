import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const orders = await Order.find({ vendorId: id }).sort({ createdAt: -1 })
    return Response.json(orders)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}