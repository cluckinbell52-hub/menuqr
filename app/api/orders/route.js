import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models'

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = await Order.countDocuments({
      vendorId: body.vendorId,
      createdAt: { $gte: today },
    })
    body.tokenNumber = todayOrders + 1

    const order = await Order.create(body)
    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}