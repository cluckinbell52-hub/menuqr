import { connectDB } from '@/lib/mongodb'
import { Order, MenuItem } from '@/lib/models'

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

    // Reduce stock for each item
    for (const item of body.items) {
      await MenuItem.updateOne(
        { vendorId: body.vendorId, name: item.name, stock: { $gt: 0 } },
        { $inc: { stock: -item.qty } }
      )
      // Auto mark sold out if stock hits 0
      await MenuItem.updateOne(
        { vendorId: body.vendorId, name: item.name, stock: 0 },
        { isAvailable: false }
      )
    }

    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}