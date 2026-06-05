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
      console.log('Processing item:', item)
      if (item.itemId) {
        const updated = await MenuItem.updateOne(
          { _id: item.itemId, stock: { $gt: 0 } },
          { $inc: { stock: -item.qty } }
        )
        console.log('Stock update result:', updated)
        await MenuItem.updateOne(
          { _id: item.itemId, stock: 0 },
          { $set: { isAvailable: false } }
        )
      } else {
        console.log('No itemId found for:', item.name)
      }
    }

    return Response.json(order)
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}